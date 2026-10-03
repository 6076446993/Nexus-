'use strict';
const test=require('node:test');const assert=require('node:assert/strict');const fs=require('fs');const os=require('os');const path=require('path');
const {OperationalDiagnostics}=require('../operationalDiagnostics');
const {CrucibleDiagnosticBridge}=require('../crucibleDiagnosticBridge');

function setup({checkConclusion='success'}={}){
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'nexus-cru-bridge-'));
 const pinFile=path.join(root,'pin.json');const commit='a'.repeat(40);
 fs.writeFileSync(pinFile,JSON.stringify({schemaVersion:1,mode:'exact-ref-read-only',crucibleRepository:'6076446993/The-Crucible',crucibleCommit:commit,cruCatalogPath:'catalog.json',repairContractPath:'contract.json'}));
 const catalog={schemaVersion:1,authority:'The-Crucible',codes:[{code:'CRU-0055',status:'active-classification',category:'nexus',meaning:'integration defect',next:'repair locally',remedy:{kind:'guided',command:null,verifyWith:{tests:['bridge.test.js']},forbidden:'no assimilation'}}]};
 const contract={schemaVersion:1,authority:'The-Crucible',diagnosisMappings:{'NXD-CONFORMANCE-MISSING':'CRU-0055'},verificationRules:{githubRequiredCheck:'The Crucible'}};
 const githubClient={
  getFileContent:async(_token,_owner,_repo,file,ref)=>{assert.equal(ref,commit);return{content:JSON.stringify(file==='catalog.json'?catalog:contract),sha:file==='catalog.json'?'catalog-blob':'contract-blob'};},
  getCommitCheckRuns:async(_token,_owner,_repo,sha)=>{assert.equal(sha,'b'.repeat(40));return[{id:1,name:'The Crucible',status:'completed',conclusion:checkConclusion,htmlUrl:'x'}];},
 };
 const diagnostics=new OperationalDiagnostics(root);
 return {root,bridge:new CrucibleDiagnosticBridge({token:'token',githubClient,diagnostics,pinFile}),diagnostics};
}

test('bridge refreshes Crucible vocabulary from exact pinned commit and classifies diagnosis',async()=>{
 const {root,bridge,diagnostics}=setup();const refreshed=await bridge.refresh();assert.equal(refreshed.codeCount,1);
 const diagnosis={evidenceDigest:'d'.repeat(64),summary:{errorCount:1},findings:[{code:'NXD-CONFORMANCE-MISSING',severity:'error'}]};
 const result=bridge.classifyDiagnosis({diagnosis,task:{id:'T'}});
 assert.equal(result.classified,true);assert.equal(result.repairEligible,true);assert.equal(result.classifiedFailures[0].crucibleCode,'CRU-0055');
 assert.equal(diagnostics.explainCruCode('CRU-0055').sourceCommit,'a'.repeat(40));fs.rmSync(root,{recursive:true,force:true});
});

test('bridge verifies only the exact repair commit with successful required Crucible check',async()=>{
 const {root,bridge}=setup();await bridge.refresh();
 const result=await bridge.verifyRepair({owner:'o',repo:'r',repairCommit:'b'.repeat(40),beforeDiagnosis:{evidenceDigest:'1'.repeat(64)},afterDiagnosis:{evidenceDigest:'2'.repeat(64),summary:{errorCount:0}},classification:{classifiedFailures:[{crucibleCode:'CRU-0055'}]},test:{passed:true}});
 assert.equal(result.passed,true);assert.equal(result.independent,true);assert.equal(result.requiredCheck,'The Crucible');fs.rmSync(root,{recursive:true,force:true});
});

test('failed required check cannot be self-certified by Nexus',async()=>{
 const {root,bridge}=setup({checkConclusion:'failure'});await bridge.refresh();
 const result=await bridge.verifyRepair({owner:'o',repo:'r',repairCommit:'b'.repeat(40),beforeDiagnosis:{evidenceDigest:'1'.repeat(64)},afterDiagnosis:{evidenceDigest:'2'.repeat(64),summary:{errorCount:0}},classification:{classifiedFailures:[]},test:{passed:true}});
 assert.equal(result.passed,false);fs.rmSync(root,{recursive:true,force:true});
});
