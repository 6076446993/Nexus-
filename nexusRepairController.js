'use strict';

const crypto = require('crypto');

const STATES = Object.freeze({ DIAGNOSE:'DIAGNOSE', CLASSIFY:'CLASSIFY', PLAN:'PLAN', AUTHORIZE:'AUTHORIZE', REPAIR:'REPAIR', RETEST:'RETEST', REDIAGNOSE:'REDIAGNOSE', VERIFY:'VERIFY', FINISHED:'FINISHED', QUARANTINED:'QUARANTINED', BLOCKED:'BLOCKED' });
const DURABILITY = Object.freeze(['PROPOSED','PASSED_ONCE','REPEATED_PASS','REGRESSION_FREE','DURABLE']);
const FAILURE_CLASSES = new Set(['knowledge-missing','knowledge-wrong','retrieval','reasoning','tool','implementation','verification']);
const NEGATIVE_RELATIONS = new Set(['FAILED_IN','REGRESSED_IN','UNSAFE_UNDER','INCOMPATIBLE_WITH','REPLACED_BY']);
const digest = (value) => crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');
const clone = (value) => JSON.parse(JSON.stringify(value));

function requireFunction(value,name){ if(typeof value!=='function') throw new TypeError(`${name} is required`); }
function normalizeFailureClass(value){ const v=String(value||'').trim().toLowerCase().replace(/[_\s]+/g,'-'); return FAILURE_CLASSES.has(v)?v:(v.startsWith('cru-')||v.startsWith('nexus-')?v:'implementation'); }
function materialContext(value={}){ return { repository:value.repository||null, component:value.component||null, branch:value.branch||null, sha:value.sha||value.commit||null, dependency:value.dependency||null, runtime:value.runtime||null, tool:value.tool||null, model:value.model||null, version:value.version||null, workflowVersion:value.workflowVersion||null, testVersion:value.testVersion||null, environment:value.environment||null }; }
function sameMaterialContext(a,b){ return digest(materialContext(a))===digest(materialContext(b)); }
function stableFingerprint(observation={}){ return observation.stableFingerprint||digest({repository:observation.repository||null,component:observation.component||null,failureClass:normalizeFailureClass(observation.failureClass),rootCause:observation.rootCause||null,advisory:observation.advisory||null,package:observation.package||null,manifest:observation.manifest||null,dependencyPath:observation.dependencyPath||null}); }

function applicability(rule,context={}){
 const envelope=rule.applicability||{}; const actual=materialContext(context); const exclusions=envelope.exclusions||[];
 if(exclusions.some(x=>Object.entries(x).every(([k,v])=>actual[k]===v))) return {inEnvelope:false,excluded:true,supportDistance:Infinity,reasons:['explicit-exclusion']};
 let distance=0; const reasons=[];
 for(const [k,expected] of Object.entries(envelope.preconditions||{})){ if(expected!=null&&actual[k]!==expected){distance++;reasons.push(`${k}:${actual[k]}!=${expected}`);} }
 for(const k of ['repository','component','dependency','runtime','tool','model','version','environment']){ const supported=envelope[k]; if(Array.isArray(supported)&&supported.length&&!supported.includes(actual[k])){distance++;reasons.push(`${k}:unsupported`);} }
 return {inEnvelope:distance===0,excluded:false,supportDistance:distance,reasons};
}

function adaptiveVerificationPlan(input={}){
 const mandatory=[...new Set(input.mandatory||[])];
 const pressure=['novelty','securityImpact','safetyImpact','blastRadius','historicalRegression','dependencyReachability','uncertainty','supportDistance'].reduce((n,k)=>n+Number(input[k]||0),0);
 const optional=(input.candidates||[]).map(x=>({...x,score:Number(x.detectionValue||0)*(1+pressure)/(Math.max(1,Number(x.cost||1)))})).sort((a,b)=>b.score-a.score);
 return {mandatory,optional,depth:pressure>=12?'deep':pressure>=5?'standard':'bounded',mandatoryBypassAllowed:false};
}

function chooseProbe(hypotheses=[]){
 const probes=[];
 for(const h of hypotheses) for(const p of h.probes||[]) probes.push({...p,hypothesisId:h.id,score:Number(p.expectedDecisionValue||0)/(Math.max(.01,Number(p.cost||0)+2*Number(p.risk||0)+.01))});
 return probes.filter(p=>p.authorized!==false).sort((a,b)=>b.score-a.score)[0]||null;
}

class OperationalLearningStore {
 constructor(state){ this.state=state?clone(state):{schemaVersion:2,observations:{},strategies:{},negativeEvidence:[],verifiers:{},policies:[{version:1,createdAt:new Date(0).toISOString(),rules:{}}],activePolicyVersion:1,processRecords:[],exports:[]}; this.checkpoints=[]; }
 static fromJSON(text){ return new OperationalLearningStore(JSON.parse(text)); }
 toJSON(){ return JSON.stringify(this.state,null,2); }
 checkpoint(){ const id=digest(this.state); this.checkpoints.push({id,state:clone(this.state)}); return id; }
 rollback(id){ const c=this.checkpoints.find(x=>x.id===id); if(!c) throw new Error('unknown operational-learning checkpoint'); this.state=clone(c.state); return this.state.activePolicyVersion; }
 installPolicy(rules,metadata={}){ const version=Math.max(0,...this.state.policies.map(x=>x.version))+1; this.state.policies.push({version,createdAt:metadata.createdAt||new Date().toISOString(),rules:clone(rules),metadata:clone(metadata)}); this.state.activePolicyVersion=version; return version; }
 recordObservation(observation){
  const fp=stableFingerprint(observation); const now=observation.observedAt||new Date().toISOString(); const evidence=clone(observation.evidence||[]); const existing=this.state.observations[fp];
  if(existing){ const seen=new Set(existing.evidence.map(digest)); for(const e of evidence) if(!seen.has(digest(e))) existing.evidence.push(e); existing.occurrences++; existing.lastSeen=now; existing.contexts.push(materialContext(observation)); return {fingerprint:fp,duplicate:true,observation:clone(existing)}; }
  this.state.observations[fp]={fingerprint:fp,rawFingerprint:observation.rawFingerprint||null,failureClass:normalizeFailureClass(observation.failureClass),rootCause:observation.rootCause||null,provenance:clone(observation.provenance||{}),evidence,uncertainty:observation.uncertainty??null,firstSeen:now,lastSeen:now,occurrences:1,contexts:[materialContext(observation)]};
  return {fingerprint:fp,duplicate:false,observation:clone(this.state.observations[fp])};
 }
 recordNegative(record){ const relation=String(record.relation||''); if(!NEGATIVE_RELATIONS.has(relation)) throw new Error('unsupported negative operational relation'); const item={...clone(record),context:materialContext(record.context),recordedAt:record.recordedAt||new Date().toISOString()}; this.state.negativeEvidence.push(item); return item; }
 evaluateRetry({strategy,context,addressesEvidenceId}){ const hit=this.state.negativeEvidence.find(x=>x.strategy===strategy&&sameMaterialContext(x.context,context)&&x.id!==addressesEvidenceId); return hit?{allowed:false,reason:'unchanged-failed-approach',evidence:clone(hit)}:{allowed:true,reason:'material-state-changed-or-no-matching-failure'}; }
 recordStrategyOutcome(record){ const key=digest({failureClass:normalizeFailureClass(record.failureClass),repository:record.repository||null,component:record.component||null,strategy:record.strategy,context:materialContext(record.context)}); const s=this.state.strategies[key]||{key,failureClass:normalizeFailureClass(record.failureClass),repository:record.repository||null,component:record.component||null,strategy:record.strategy,applicability:clone(record.applicability||{}),successes:0,failures:0,cost:{ciRuns:0,toolCalls:0,wallMs:0,estimatedUsd:0},durability:'PROPOSED',lastContext:null,lastVerifiedAt:null}; record.success?s.successes++:s.failures++; for(const k of Object.keys(s.cost)) s.cost[k]+=Number(record.cost?.[k]||0); s.lastContext=materialContext(record.context); s.lastVerifiedAt=record.verifiedAt||null; if(record.success) s.durability=this.advanceDurability(s.durability,record.recurrenceFree===true); this.state.strategies[key]=s; return clone(s); }
 advanceDurability(current,recurrenceFree=false){ let i=Math.max(0,DURABILITY.indexOf(current)); if(i<DURABILITY.length-1) i++; if(recurrenceFree&&i<DURABILITY.length-1)i++; return DURABILITY[i]; }
 markDrift(context){ const changed=[]; for(const s of Object.values(this.state.strategies)){ if(s.lastContext&&!sameMaterialContext(s.lastContext,context)){s.needsRevalidation=true;changed.push(s.key);} } return changed; }
 recommend({failureClass,context}){ const candidates=Object.values(this.state.strategies).map(rule=>({rule,match:applicability(rule,context)})).filter(x=>x.rule.failureClass===normalizeFailureClass(failureClass)); const durable=candidates.filter(x=>x.match.inEnvelope&&!x.rule.needsRevalidation&&['REGRESSION_FREE','DURABLE'].includes(x.rule.durability)).sort((a,b)=>(b.rule.successes-b.rule.failures)-(a.rule.successes-a.rule.failures)); return durable.length?{diagnosisRequired:false,strategy:clone(durable[0].rule),applicability:durable[0].match}:{diagnosisRequired:true,candidates:candidates.map(x=>({key:x.rule.key,applicability:x.match,needsRevalidation:!!x.rule.needsRevalidation}))}; }
 recordVerifier(record){ const key=digest({check:record.check,version:record.version}); const v=this.state.verifiers[key]||{check:record.check,version:record.version,detections:0,misses:0,falsePasses:0,falseAlarms:0,cost:0}; for(const k of ['detections','misses','falsePasses','falseAlarms']) v[k]+=Number(record[k]||0); v.cost+=Number(record.cost||0); this.state.verifiers[key]=v; return clone(v); }
 prioritize(item){ return 4*Number(item.severity||0)+3*Number(item.recurrenceLikelihood||0)+2*Number(item.unblockValue||0)+Number(item.affectedSystems||0)+2*Number(item.evidenceGap||0)+2*Number(item.expectedInformationGain||0)-Number(item.cost||0); }
 recordProcess(record){ const item={...clone(record),recordedAt:record.recordedAt||new Date().toISOString(),policyVersion:this.state.activePolicyVersion}; this.state.processRecords.push(item); return item; }
 exportEvidence(record,destination){ const item={schemaVersion:1,destination,kind:'nexus-operational-evidence',provenance:clone(record.provenance||{}),derived_from:clone(record.derived_from||[]),independence_group:record.independence_group||null,payload:clone(record.payload||{}),authorityClass:'evidence-only',executionAuthority:false,promotionAuthority:false,createdAt:record.createdAt||new Date().toISOString()}; this.state.exports.push(item); return clone(item); }
 contextFor({classification,plan,context,hypotheses,verification}){ return {failureClass:normalizeFailureClass(classification?.failureClass||classification?.failureCode),recommendation:this.recommend({failureClass:classification?.failureClass||classification?.failureCode,context}),retry:plan?this.evaluateRetry({strategy:plan.strategy||plan.remedy,context,addressesEvidenceId:plan.addressesEvidenceId}):null,probe:chooseProbe(hypotheses||[]),verification:adaptiveVerificationPlan(verification||{})}; }
}

function applicableRegressionMemory(regressions,plan){ return (regressions||[]).find(record=>{ if(!record||typeof record!=='object') return false; const componentMatches=!record.component||!plan.component||record.component===plan.component; const strategy=String(plan.strategy||plan.remedy||''); const lesson=String(record.preventionLesson||''); return componentMatches&&strategy&&lesson&&lesson.toLowerCase().includes(strategy.toLowerCase()); })||null; }

class NexusRepairController {
 constructor({diagnose,classify,planRepair,authorize,repair,retest,verify,regressionMemory=()=>[],operationalLearning=null,maxAttempts=2}){ for(const [name,fn] of Object.entries({diagnose,classify,planRepair,authorize,repair,retest,verify,regressionMemory})) requireFunction(fn,name); this.diagnose=diagnose;this.classify=classify;this.planRepair=planRepair;this.authorize=authorize;this.repair=repair;this.retest=retest;this.verify=verify;this.regressionMemory=regressionMemory;this.operationalLearning=operationalLearning;this.maxAttempts=maxAttempts; }
 async run({snapshot,task}){ const history=[];let current=snapshot;let priorDiagnosis=null;
  for(let attempt=1;attempt<=this.maxAttempts;attempt++){
   const diagnosis=await this.diagnose(current);history.push({state:STATES.DIAGNOSE,attempt,evidenceDigest:diagnosis.evidenceDigest,status:diagnosis.summary?.status});
   if(!diagnosis.summary?.errorCount){const verification=await this.verify({task,snapshot:current,diagnosis,history});history.push({state:STATES.VERIFY,attempt,verification});if(verification?.passed===true&&verification?.independent===true)return{state:STATES.FINISHED,snapshot:current,diagnosis,verification,history};return{state:STATES.BLOCKED,reason:'independent-verification-not-passed',snapshot:current,diagnosis,verification,history};}
   const classification=await this.classify({task,snapshot:current,diagnosis,priorDiagnosis});history.push({state:STATES.CLASSIFY,attempt,classification});if(!classification?.classified||!classification?.repairEligible)return{state:STATES.BLOCKED,reason:'failure-not-classified-as-repair-eligible',snapshot:current,diagnosis,classification,history};
   const learningContext=this.operationalLearning?this.operationalLearning.contextFor({classification,context:{...materialContext(current),repository:current.repository,component:classification.component},hypotheses:classification.hypotheses,verification:classification.verification}):null;
   const plan=await this.planRepair({task,snapshot:current,diagnosis,classification,priorDiagnosis,learningContext});history.push({state:STATES.PLAN,attempt,planDigest:digest(plan),learningContext});if(!plan?.bounded||!plan?.baseCommit||plan.baseCommit!==current.commit)return{state:STATES.BLOCKED,reason:'repair-plan-not-bounded-to-current-immutable-base',snapshot:current,diagnosis,classification,plan,history};
   if(this.operationalLearning){const retry=this.operationalLearning.evaluateRetry({strategy:plan.strategy||plan.remedy,context:{...materialContext(current),repository:current.repository,component:plan.component||classification.component},addressesEvidenceId:plan.addressesEvidenceId});if(!retry.allowed)return{state:STATES.QUARANTINED,reason:retry.reason,negativeOperationalEvidence:retry.evidence,snapshot:current,diagnosis,classification,plan,history};}
   const priorFailure=applicableRegressionMemory(await this.regressionMemory({task,snapshot:current,classification,plan}),plan);if(priorFailure&&plan.addressesRegressionId!==priorFailure.regressionId)return{state:STATES.QUARANTINED,reason:'repair-strategy-repeats-recorded-failure-without-addressing-it',regressionMemory:priorFailure,snapshot:current,diagnosis,classification,plan,history};
   const authorization=await this.authorize({task,snapshot:current,diagnosis,classification,plan});history.push({state:STATES.AUTHORIZE,attempt,authorizationId:authorization?.authorizationId||null,approved:authorization?.approved===true});if(!authorization?.approved||authorization.baseCommit!==current.commit||authorization.planDigest!==digest(plan))return{state:STATES.BLOCKED,reason:'repair-not-authorized-for-exact-base-and-plan',snapshot:current,diagnosis,classification,plan,authorization,history};
   const repaired=await this.repair({task,snapshot:current,diagnosis,classification,plan,authorization});history.push({state:STATES.REPAIR,attempt,resultCommit:repaired?.commit||null});if(!repaired?.commit||repaired.commit===current.commit)return{state:STATES.BLOCKED,reason:'repair-produced-no-new-immutable-version',snapshot:current,diagnosis,classification,plan,authorization,repaired,history};
   const test=await this.retest({task,before:current,repaired,diagnosis,classification,plan});history.push({state:STATES.RETEST,attempt,test});if(!test?.passed){if(this.operationalLearning)this.operationalLearning.recordNegative({id:digest({plan,test}),relation:'REGRESSED_IN',strategy:plan.strategy||plan.remedy,context:{...materialContext(current),repository:current.repository,component:plan.component||classification.component},evidence:test});return{state:STATES.QUARANTINED,reason:'repair-retest-failed',repairRegressionCandidate:{preRepairCommit:current.commit,repairCommit:repaired.commit,diagnosisDigest:diagnosis.evidenceDigest,test},history};}
   priorDiagnosis=diagnosis;current=repaired.snapshot||{...current,commit:repaired.commit};const post=await this.diagnose(current);history.push({state:STATES.REDIAGNOSE,attempt,evidenceDigest:post.evidenceDigest,status:post.summary?.status});if(post.summary?.errorCount)return{state:STATES.QUARANTINED,reason:'repair-did-not-clear-diagnosis',repairRegressionCandidate:{preRepairCommit:snapshot.commit,repairCommit:repaired.commit,before:diagnosis.evidenceDigest,after:post.evidenceDigest},snapshot:current,diagnosis:post,history};
   const verification=await this.verify({task,snapshot:current,diagnosis:post,classification,repair:repaired,test,history});history.push({state:STATES.VERIFY,attempt,verification});if(this.operationalLearning)this.operationalLearning.recordStrategyOutcome({failureClass:classification.failureClass||classification.failureCode,repository:snapshot.repository,component:classification.component,strategy:plan.strategy||plan.remedy,context:materialContext(current),applicability:plan.applicability,success:verification?.passed===true&&verification?.independent===true,cost:verification?.cost,verifiedAt:verification?.observedAt});if(verification?.passed===true&&verification?.independent===true)return{state:STATES.FINISHED,snapshot:current,diagnosis:post,verification,history};return{state:STATES.BLOCKED,reason:'independent-verification-not-passed',snapshot:current,diagnosis:post,verification,history};
  }
  return{state:STATES.QUARANTINED,reason:'repair-attempt-limit-reached',snapshot:current,history};
 }
}

module.exports={NexusRepairController,OperationalLearningStore,STATES,DURABILITY,digest,normalizeFailureClass,stableFingerprint,materialContext,sameMaterialContext,applicability,adaptiveVerificationPlan,chooseProbe,applicableRegressionMemory};
