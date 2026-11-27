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
 w.fetch=async()=>({ok:true,json:async()=>JSON.parse(readFileSync('anatomy/motion-anatomy.json','utf8'))});
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
   a.w.rbMotionControls.state(a.svg).selected=id==='abd-brace'?'M. Transversus Abdominis':'';
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

test('real anatomical data retains separate deltoid/trapezius parts and normalized skin weights',()=>{
 const data=JSON.parse(readFileSync('anatomy/motion-anatomy.json','utf8'));
 assert.equal(data.license,'CC BY-SA 2.1 JP');
 assert.ok(data.meshes.filter(m=>m.kind==='muscle').length>=100);
 for(const id of ['FMA34680','FMA34682','FMA34684','FMA33586','FMA33584','FMA33581'])assert.ok(data.meshes.some(m=>m.id===id),id);
 const weights=Buffer.from(data.weights,'base64'),joints=Buffer.from(data.joints,'base64');
 for(let i=0;i<weights.length;i+=4){assert.equal(weights[i]+weights[i+1]+weights[i+2]+weights[i+3],255);for(let k=0;k<4;k++)assert.ok(joints[i+k]<data.bones.length);}
 const triangles=new Uint32Array(Uint8Array.from(Buffer.from(data.triangles,'base64')).buffer),count=Buffer.from(data.positions,'base64').length/6;
 assert.ok(Math.max(...triangles.subarray(0,1000))<count);
 for(const i of triangles)assert.ok(i<count);
 assert.ok(data.bones.some(b=>b[0]==='radius.R'));
 assert.ok(data.bones.some(b=>b[0]==='thumb-cmc.R'));
});

test('anatomical layers and individual deltoid selections change the rendered model',async()=>{
 const a=viewer();try{
  assert.equal(await a.w.rbMotion3d.prepare(),true);
  const settings=a.w.rbMotionControls.state(a.svg);settings.selected='M. Deltoideus (pars clavicularis)';
  a.w.rbMotion3d.draw(a.svg,'s-ante',.4,true,true);assert.equal(a.svg.dataset.selectedMeshCount,'1');
  const withMuscle=a.pixels();settings.layer='bones';a.w.rbMotion3d.draw(a.svg,'s-ante',.4,true,true);
  assert.notDeepEqual(a.pixels(),withMuscle);
  settings.layer='active';settings.selected='M. Deltoideus (pars spinalis)';a.w.rbMotion3d.draw(a.svg,'s-retro',.4,true,true);
  assert.equal(a.svg.dataset.selectedMeshCount,'1');
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
  
