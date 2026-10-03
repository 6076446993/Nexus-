'use strict';
const test=require('node:test');const assert=require('node:assert/strict');const fs=require('fs');const os=require('os');const path=require('path');
const {CruDiagnosticMemory,extractCruCodes}=require('../cruDiagnosticMemory');

function catalog(codes){return {schemaVersion:1,authority:'The-Crucible',codes:codes.map(code=>({code,status:'active-classification',category:'test',meaning:`Meaning ${code}`,next:'Inspect evidence.',remedy:{kind:'guided',command:null,verifyWith:{tests:['x.test.js']},forbidden:'Do not guess.'}}))};}

test('CRU memory accepts an evolving catalog rather than a fixed code list',()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'nexus-cru-'));const memory=new CruDiagnosticMemory(root);
 memory.installCatalog({catalog:catalog(['CRU-0008','CRU-0099']),sourceRepository:'6076446993/The-Crucible',sourceCommit:'a'.repeat(40)});
 assert.equal(memory.explain('CRU-0099').meaning,'Meaning CRU-0099');
 fs.rmSync(root,{recursive:true,force:true});
});

test('newly observed CRU-shaped code is remembered before its definition is published and enriches after refresh',()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'nexus-cru-'));const memory=new CruDiagnosticMemory(root);
 memory.installCatalog({catalog:catalog(['CRU-0008']),sourceRepository:'6076446993/The-Crucible',sourceCommit:'a'.repeat(40)});
 const occurrence=memory.remember({code:'CRU-0099',component:'advanced-diagnostics',event:'failure-observed'});
 assert.equal(occurrence.definitionStatus,'unresolved-pending-catalog-refresh');
 memory.installCatalog({catalog:catalog(['CRU-0008','CRU-0099']),sourceRepository:'6076446993/The-Crucible',sourceCommit:'b'.repeat(40)});
 const explanation=memory.explain('CRU-0099');
 assert.equal(explanation.occurrences.length,1);
 assert.equal(explanation.occurrences[0].code,'CRU-0099');
 assert.equal(explanation.meaning,'Meaning CRU-0099');
 fs.rmSync(root,{recursive:true,force:true});
});

test('CRU extraction is diagnostic recognition only',()=>{assert.deepEqual(extractCruCodes('failed CRU-0027 then CRU-0027 and CRU-0055'),['CRU-0027','CRU-0055']);});
