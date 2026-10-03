'use strict';
const fs=require('fs');const path=require('path');const {spawnSync}=require('child_process');

function bridgeCli(crucibleRoot,action,payload){
 const root=fs.realpathSync(crucibleRoot);const cli=path.join(root,'src','nexusRepairBridgeCli.js');
 if(!fs.existsSync(cli)) throw new Error('Configured Crucible checkout does not expose nexusRepairBridgeCli.js.');
 const run=spawnSync(process.execPath,[cli,action],{cwd:root,input:JSON.stringify(payload),encoding:'utf8',windowsHide:true,timeout:120000,maxBuffer:1024*1024});
 let parsed;try{parsed=JSON.parse(String(run.stdout||'').trim());}catch{throw new Error(`Crucible bridge returned invalid output: ${String(run.stderr||run.stdout||'').slice(0,1000)}`);}
 if(run.status!==0||parsed.ok!==true) throw new Error(parsed.error||`Crucible bridge failed with status ${run.status}`);
 return parsed.result;
}

function createLocalCrucibleRepairBridge(crucibleRoot){
 const classifyDiagnosis=async(ctx)=>bridgeCli(crucibleRoot,'classify',{diagnosis:ctx.diagnosis,task:ctx.task||null});
 const verifyRepair=async(ctx)=>bridgeCli(crucibleRoot,'verify',{
   beforeDiagnosis:ctx.beforeDiagnosis,afterDiagnosis:ctx.afterDiagnosis,classification:ctx.classification,
   test:ctx.test,repair:ctx.repair,
 });
 return {
  requiresRepositoryCoordinates:false,
  classifyDiagnosis,
  verifyRepair,
  classifyNexusDiagnosis:classifyDiagnosis,
  verifyNexusRepair:verifyRepair,
 };
}
module.exports={createLocalCrucibleRepairBridge,bridgeCli};
