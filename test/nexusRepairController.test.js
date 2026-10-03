'use strict';
const test=require('node:test');const assert=require('node:assert/strict');
const {NexusRepairController,digest}=require('../nexusRepairController');
const snapshot={repository:'Nexus-',commit:'abcdef1234567',files:{}};
const diagnosis=(errors=1)=>({evidenceDigest:'d'.repeat(64),summary:{errorCount:errors,status:errors?'BLOCKED':'DIAGNOSED'}});
function deps(overrides={}){
 const plan={bounded:true,baseCommit:snapshot.commit,strategy:'safe-fix'};
 return {
  diagnose:async(s)=>s.commit===snapshot.commit?diagnosis(1):diagnosis(0),
  classify:async()=>({classified:true,repairEligible:true,failureCode:'CRU-0004'}),
  planRepair:async()=>plan,
  authorize:async()=>({approved:true,authorizationId:'A1',baseCommit:snapshot.commit,planDigest:digest(plan)}),
  repair:async()=>({commit:'fedcba7654321',snapshot:{...snapshot,commit:'fedcba7654321'}}),
  retest:async()=>({passed:true}),
  verify:async()=>({passed:true,independent:true}),
  regressionMemory:async()=>[],
  ...overrides,
 };
}
test('clean repair loop requires rediagnosis and independent verification',async()=>{
 const r=await new NexusRepairController(deps()).run({snapshot,task:{id:'T1'}});
 assert.equal(r.state,'FINISHED');
 assert.deepEqual(r.history.map(x=>x.state),['DIAGNOSE','CLASSIFY','PLAN','AUTHORIZE','REPAIR','RETEST','REDIAGNOSE','VERIFY']);
});
test('diagnosis cannot mutate without exact authorization',async()=>{
 let repaired=false;const r=await new NexusRepairController(deps({authorize:async()=>({approved:false}),repair:async()=>{repaired=true;}})).run({snapshot,task:{}});
 assert.equal(r.state,'BLOCKED');assert.equal(repaired,false);
});
test('failed retest quarantines repair and emits regression candidate',async()=>{
 const r=await new NexusRepairController(deps({retest:async()=>({passed:false,check:'unit'})})).run({snapshot,task:{}});
 assert.equal(r.state,'QUARANTINED');assert.equal(r.reason,'repair-retest-failed');assert.equal(r.repairRegressionCandidate.preRepairCommit,snapshot.commit);
});
test('known harmful strategy is quarantined before authorization or mutation',async()=>{
 let authorized=false,repaired=false;
 const regression={regressionId:'RR-1',component:'builder',preventionLesson:'Do not repeat safe-fix because it corrupted output.'};
 const r=await new NexusRepairController(deps({
  planRepair:async()=>({bounded:true,baseCommit:snapshot.commit,strategy:'safe-fix',component:'builder'}),
  regressionMemory:async()=>[regression],
  authorize:async()=>{authorized=true;return{};},
  repair:async()=>{repaired=true;return{};},
 })).run({snapshot,task:{}});
 assert.equal(r.state,'QUARANTINED');assert.equal(r.reason,'repair-strategy-matches-known-harmful-regression');assert.equal(authorized,false);assert.equal(repaired,false);
});
