import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, existsSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import vm from 'node:vm';
import {JSDOM} from 'jsdom';
import {createHandler as favorites} from '../api/favorites.js';
import {createPortalHandler as portal} from '../api/portal.js';
import {createHandler as testers} from '../api/testers.js';
import {validateEvents, mergeDocuments} from '../lib/favorites.mjs';

const html=readFileSync('index.html','utf8');
function app(){
 const dom=new JSDOM(html,{url:'https://rehaboom.test',runScripts:'outside-only',pretendToBeVisual:true});
 const w=dom.window;
 w.matchMedia=()=>({matches:false,addEventListener(){},removeEventListener(){}});
 w.IntersectionObserver=class{observe(){} unobserve(){} disconnect(){}};
 w.ResizeObserver=class{observe(){} unobserve(){} disconnect(){}};
 w.HTMLElement.prototype.scrollIntoView=()=>{};
 w.scrollTo=()=>{};
 w.fetch=()=>Promise.reject(new Error('Network disabled during tests'));
 const context=dom.getInternalVMContext();
 for(const script of w.document.scripts){
  const src=script.getAttribute('src');
  vm.runInContext(src?readFileSync(src.split('?')[0].replace(/^\//,''),'utf8'):script.textContent,context);
 }
 return {dom,context,read:code=>vm.runInContext(code,context)};
}
function response(){return {headers:{},setHeader(k,v){this.headers[k]=v;},status(n){this.code=n;return this;},json(body){this.body=body;return this;}};}
test('build preserves source and copies the final HTML and worker byte for byte',()=>{
 const paths=['index.html','sw.js','package.json','scripts/build.mjs'];
 const before=paths.map(p=>readFileSync(p));
 execFileSync(process.execPath,['scripts/build.mjs']);
 paths.forEach((p,i)=>assert.deepEqual(readFileSync(p),before[i]));
 for(const p of ['index.html','sw.js'])assert.deepEqual(readFileSync('dist/'+p),readFileSync(p));
});
test('serviceworker precache contains only existing build files',()=>{
 const worker=readFileSync('sw.js','utf8');
 const core=vm.runInNewContext(worker.slice(0,worker.indexOf("self.addEventListener"))+';CORE');
 const missing=core.filter(url=>!existsSync('dist/'+(url.split('?')[0].replace(/^\.\//,'')||'index.html')));
 assert.deepEqual(Array.from(missing),[]);
 assert.match(worker,/api\|testers/);
});
test('all app sections open and movement antagonist links resolve',()=>{
 const a=app();try{
  for(let i=0;i<6;i++){a.read(`switchTab(${i})`);assert.equal(a.dom.window.document.querySelectorAll('main > .wrap:not([hidden])').length,1);}
  const broken=a.read('J.flatMap(j=>j.planes.flatMap(p=>p.moves)).filter(m=>m.an&&!MF_MOVES.has(m.an)).map(m=>m.id)');
  assert.deepEqual(Array.from(broken),[]);
  const unresolved=a.read("J.flatMap(j=>j.planes.flatMap(p=>p.moves.flatMap(m=>['ag','sy','st'].flatMap(r=>(m[r]||[]).map(([n])=>n))))).filter(n=>!key(n)&&!groupOf(n))");
  assert.deepEqual(Array.from(unresolved),[]);
 }finally{a.dom.window.close();}
});
test('muscle locations and individual browse cards include iliacus and ECRB',()=>{
 const a=app();try{
  assert.equal(a.read("MUSCLE_REGION['M. Iliacus']"),'hip_flexor_front');
  assert.equal(a.read("MUSCLE_REGION['M. Extensor Carpi Radialis Brevis']"),'forearm_back');
  const names=a.read('Object.values(GROUPS).flatMap(groups=>groups.flatMap(g=>g.muscles))');
  for(const name of ['M. Iliacus','M. Extensor Carpi Radialis Brevis'])assert.ok(names.includes(name));
  for(const name of ['M. Iliopsoas','M. Extensor Carpi Radialis Longus / Brevis','M. Flexor Digitorum Superficialis / Profundus'])assert.ok(!names.includes(name));
  a.dom.window.document.getElementById('q').value='ili';a.read('renderS()');
  assert.equal(a.dom.window.document.querySelector('#mres [data-m="M. Iliopsoas"]'),null);
 }finally{a.dom.window.close();}
});
test('every absent numerical ROM has an explicit explanation',()=>{
 const a=app();try{
  const missing=a.read('Object.entries(ROM).filter(([id,r])=>!r[0]&&!ROMNOTE[id]).map(([id])=>id)');
  assert.deepEqual(Array.from(missing),[]);
  assert.match(a.read("romLine('g-elev')"),/Referentie.*geen standaardwaarde/);
  assert.match(a.read("romLine('k-endo')"),/alleen bij gebogen knie/);
 }finally{a.dom.window.close();}
});
test('invalid favorite payloads and future timestamps are rejected',()=>{
 for(const value of [[],null,{'muscle:<script>':{on:true,at:1}},{'muscle:test':{on:true,at:Date.now()+600000}}])assert.throws(()=>validateEvents(value));
});
test('offline favorites retain unrelated changes and deterministic deletions',()=>{
 const result=mergeDocuments([{device:'a',events:{'muscle:a':{on:true,at:1},'muscle:b':{on:true,at:2}}},{device:'b',events:{'muscle:a':{on:false,at:1}}}]);
 assert.equal(result['muscle:a'].on,false);assert.equal(result['muscle:b'].on,true);
});
for(const [name,factory] of [['favorites',favorites],['portal',portal],['testers',testers]]){
 test(`${name} rejects cross-origin requests before any storage access`,async()=>{
  const res=response();await factory()({method:'POST',headers:{origin:'https://other.test',host:'rehaboom.test'},body:{}},res);
  assert.equal(res.code,403);assert.match(res.headers['Cache-Control'],/no-store/);
 });
 test(`${name} rejects unsupported methods`,async()=>{
  const res=response();await factory()({method:'DELETE',headers:{host:'rehaboom.test'},body:{}},res);
  assert.equal(res.code,405);
 });
}
