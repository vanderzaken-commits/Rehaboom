import {readFileSync,writeFileSync} from 'node:fs';
import vm from 'node:vm';
import {JSDOM} from 'jsdom';
const dom=new JSDOM(readFileSync('index.html','utf8'),{url:'https://rehaboom.test',runScripts:'outside-only',pretendToBeVisual:true});
Object.assign(dom.window,{matchMedia:()=>({matches:false,addEventListener(){}}),IntersectionObserver:class{observe(){} disconnect(){}},ResizeObserver:class{observe(){} disconnect(){}},scrollTo(){}});
dom.window.HTMLElement.prototype.scrollIntoView=()=>{};
for(const script of dom.window.document.scripts){
 const src=script.getAttribute('src');
 vm.runInContext(src?readFileSync(src.split('?')[0].replace(/^\//,''),'utf8'):script.textContent,dom.getInternalVMContext());
}
const audit=vm.runInContext(`(()=>{
 const moves=J.flatMap(j=>j.planes.flatMap(p=>p.moves));
 const unresolvedMovements=[];
 for(const m of moves)for(const role of ['ag','sy','st'])for(const [name] of m[role]||[])if(!key(name)&&!groupOf(name))unresolvedMovements.push({movement:m.id,name});
 const unresolvedExercises=[];
 for(const e of EX){for(const [id] of e.acts||[])if(!moves.some(m=>m.id===id))unresolvedExercises.push({exercise:e.id,movement:id});for(const name of e.low||[])if(!key(name)&&!groupOf(name))unresolvedExercises.push({exercise:e.id,name});}
 const unresolvedTests=[];
 for(const [joint,items] of Object.entries(TESTS))for(const t of items)for(const name of t.gekoppeldeSpieren||[])if(!key(name)&&!groupOf(name))unresolvedTests.push({joint,test:t.naam,name});
 const planeAxis=[];
 for(const j of J)for(const p of j.planes){const expected={'Sagittaal vlak':'F','Frontaal vlak':'S','Transversaal vlak':'L'}[p.plane];if(expected&&p.axis!==expected)planeAxis.push({joint:j.id,plane:p.plane,axis:p.axis});}
 return {moves:moves.length,unresolvedMovements,unresolvedExercises,unresolvedTests,missingMap:Object.keys(DETAILS).filter(n=>!MUSCLE_REGION[n]),planeAxis};
})()`,dom.getInternalVMContext());
writeFileSync('docs/v4.16-data-audit.json',JSON.stringify(audit,null,2)+'\n');
console.log(JSON.stringify(audit,null,2));
dom.window.close();
