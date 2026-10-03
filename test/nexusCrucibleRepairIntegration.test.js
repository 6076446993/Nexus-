'use strict';
const test=require('node:test');const assert=require('node:assert/strict');const fs=require('fs');const os=require('os');const path=require('path');const {execFileSync}=require('child_process');
const {createNexusProgramRepairRuntime,makeExactPlanAuthorization}=require('../nexusProgramRepairRuntime');
const {createLocalCrucibleRepairBridge}=require('../nexusCrucibleRepairAdapter');
const crucible=process.env.CRUCIBLE_INTEGRATION_ROOT;
test('Nexus and Crucible complete a real bounded repair cycle', {skip:!crucible}, async()=>{
 const folder=fs.mkdtempSync(path.join(os.tmpdir(),'nexus-crucible-e2e-'));
 execFileSync('git',['init'],{cwd:folder});execFileSync('git',['config','user.email','integration@test.invalid'],{cwd:folder});execFileSync('git',['config','user.name','Nexus Integration'],{cwd:folder});
 const file=path.join(folder,'NEXUS-SYSTEM-CONFORMANCE.md');fs.writeFileSync(file,'canonical Nexus authority and lineage\nRoute failures into Assimilation for reconciliation.\n');
 execFileSync('git',['add','.'],{cwd:folder});execFileSync('git',['commit','-m','defective fixture'],{cwd:folder});
 const bridge=createLocalCrucibleRepairBridge(crucible);
 const runtime=createNexusProgramRepairRuntime({
  repository:'Nexus-',scope:'nexus-component',folder,snapshotFiles:['NEXUS-SYSTEM-CONFORMANCE.md'],crucibleBridge:bridge,
  planRepair:async({snapshot,classification})=>({bounded:true,baseCommit:snapshot.commit,strategy:'retire-obsolete-assimilation-routing',component:'integration',failureCodes:classification.codes}),
  authorize:async({snapshot,plan})=>makeExactPlanAuthorization({authorizationId:'E2E-AUTH',baseCommit:snapshot.commit,plan}),
  applyBoundedRepair:async()=>{fs.writeFileSync(file,'canonical Nexus authority and lineage\nAssimilation is obsolete and must not route new work.\n');execFileSync('git',['add','.'],{cwd:folder});execFileSync('git',['commit','-m','bounded integration repair'],{cwd:folder});return{ok:true};},
  runProjectTests:async({classification})=>{const requested=[...new Set((classification.classifiedFailures||[]).flatMap(x=>x.testRequest?.tests||[]))];for(const rel of requested)execFileSync(process.execPath,['--test',path.join(crucible,rel)],{cwd:crucible,stdio:'pipe'});return{ok:true,requested};},
  loadRegressionMemory:async()=>[],
 });
 const result=await runtime.run({id:'NEXUS-CRUCIBLE-E2E'});
 assert.equal(result.state,'FINISHED',JSON.stringify(result,null,2));assert.deepEqual(result.verification.failureCodes,['CRU-0055']);assert.equal(result.verification.independent,true);
 fs.rmSync(folder,{recursive:true,force:true});
});
