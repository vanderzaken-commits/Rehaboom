import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {createHash} from 'node:crypto';
import {JSDOM} from 'jsdom';

function viewer(){
 const dom=new JSDOM('<div><svg viewBox="0 0 420 350"></svg></div>',{runScripts:'outside-only',pretendToBeVisual:true});
 const w=dom.window;let pixels;
 w.HTMLCanvasElement.prototype.getContext=function(kind){
  if(kind!=='2d')return null;
  return {createImageData:(width,height)=>({data:new Uint8ClampedArray(width*height*4)}),putImageData:frame=>{pixels=frame.data.slice();},clearRect(){},drawImage(){}};
 };
 w.SVGElement.prototype.getClientRects=()=>[{}];
 w.fetch=async()=>({ok:true,json:async()=>JSON.parse(readFileSync('anatomy/motion-human.json','utf8'))});
 const context=dom.getInternalVMContext();
 for(const path of ['anatomy/motion-three.js','motion-details.js','motion-controls.js','motion-3d.js'])vm.runInContext(readFileSync(path,'utf8'),context,{filename:path});
 return {dom,w,context,svg:w.document.querySelector('svg'),pixels:()=>pixels};
}

test('all 46 atlas movements and every muscle detail action have a 3D definition',()=>{
 const a=viewer();try{
  const html=readFileSync('index.html','utf8');
  // Read data from the actual application, including muscle-only actions.
  const app=new JSDOM(html,{runScripts:'outside-only',url:'https://rehaboom.test',pretendToBeVisual:true}),w=app.window;
  w.matchMedia=()=>({matches:false,addEventListener(){}});w.scrollTo=()=>{};
  w.IntersectionObserver=class{observe(){} disconnect(){}};
  w.ResizeObserver=class{observe(){} disconnect(){}};
  w.HTMLElement.prototype.scrollIntoView=()=>{};w.fetch=()=>Promise.reject(Error('offline test'));
  const ctx=app.getInternalVMContext();
  try {
  for(const script of w.document.scripts){const src=script.getAttribute('src');vm.runInContext(src?readFileSync(src.split('?')[0].replace(/^\//,''),'utf8'):script.textContent,ctx);}
  const ids=vm.runInContext('([...MF_MOVES.keys(),...Object.keys(MF_LOCAL),...Object.keys(MF_3D_EXTRA)])',ctx);
  app.window.close();
  assert.equal(new Set(ids).size,62);
  assert.deepEqual(Array.from(ids).filter(id=>!a.w.rbMotion3d.definitions[id]),[]);
  }finally{app.window.close();}
 }finally{a.dom.window.close();}
});

test('all 62 animations rasterize distinct start and end poses without WebGL',async()=>{
 const a=viewer();try{
  assert.equal(await a.w.rbMotion3d.prepare(),true);
  for(const id of Object.keys(a.w.rbMotion3d.definitions)){
   const hashes=[];
   for(const progress of [0,1]){
    assert.equal(a.w.rbMotion3d.draw(a.svg,id,progress,true,true),true,id);
    assert.ok(!/NaN|Infinity/.test(a.svg.innerHTML),id+' has finite projected coordinates');
    const frame=a.pixels();assert.ok(frame?.some((n,i)=>i%4===3&&n>0),id+' has visible 3D geometry');
    hashes.push(createHash('sha256').update(frame).digest('hex'));
   }
   assert.notEqual(hashes[0],hashes[1],id+' changes the 3D pose');
  }
 }finally{a.dom.window.close();}
});

test('camera changes rendered geometry and viewer settings remain independent',async()=>{
 const a=viewer();try{
  await a.w.rbMotion3d.prepare();
  const controls=a.w.rbMotionControls,settings=controls.state(a.svg);
  const second=a.w.document.createElementNS('http://www.w3.org/2000/svg','svg');
  a.w.rbMotion3d.draw(a.svg,'finger-pip',.5,true,true);const before=a.pixels();
  Object.assign(settings,{yaw:70,pitch:20,zoom:1.3});
  a.w.rbMotion3d.draw(a.svg,'finger-pip',.5,true,true);
  assert.notDeepEqual(a.pixels(),before);
  assert.equal(controls.state(second).yaw,0);assert.equal(controls.state(second).zoom,1);
 }finally{a.dom.window.close();}
});

test('playback stops at its endpoint and repetition returns smoothly',()=>{
 const a=viewer();try{
  const {advance}=a.w.rbMotionControls;
  assert.equal(advance(.99,1,100,{speed:1,repeat:false}).done,true);
  const reverse=advance(.99,1,100,{speed:1,repeat:true});
  assert.equal(reverse.direction,-1);assert.ok(reverse.progress<1);assert.equal(reverse.done,false);
  const slow=advance(.2,1,100,{speed:.25,repeat:false}),fast=advance(.2,1,100,{speed:1,repeat:false});
  assert.ok(slow.progress<fast.progress);
  assert.equal(advance(.5,1,100000,{speed:1,repeat:false}).progress,advance(.5,1,100,{speed:1,repeat:false}).progress);
 }finally{a.dom.window.close();}
});
  
