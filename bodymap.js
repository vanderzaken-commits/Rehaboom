/* REHABOOM lichaamskaart — eigen tekening (geen externe bron).
   Voor- (F) en achteraanzicht (B) in een 200×460 frame per figuur; spiervormen worden links getekend en gespiegeld.
   deep:true = diep gelegen spier (gestippelde rand). c:true = middenlijn, niet spiegelen. */
const BM_SIL=[[92,50],[91,62],[80,68],[64,72],[53,78],[47,92],[45,112],[43,136],[42,158],[38,184],[35,210],[33,232],[29,246],[29,260],[34,268],[40,264],[43,250],[46,234],[50,206],[54,182],[57,160],[59,138],[61,118],[64,108],[67,126],[69,150],[70,176],[67,200],[65,222],[66,256],[70,292],[74,322],[74,342],[73,362],[76,392],[78,416],[74,430],[76,440],[94,442],[96,432],[94,416],[96,384],[97,350],[95,330],[97,300],[99,262],[100,240]];
const BM={
 /* ---------- VOORAANZICHT ---------- */
 scm:{v:'F',p:[[87,40],[91,40],[99,64],[95,66]]},
 scal:{v:'F',p:[[84,48],[88,50],[87,66],[81,66]]},
 neckdeep:{v:'F',c:1,deep:1,p:[[96,50],[104,50],[104,66],[96,66]]},
 delt_f:{v:'F',p:[[64,72],[53,78],[47,92],[47,104],[54,106],[60,92],[70,80]]},
 pec:{v:'F',p:[[70,80],[86,77],[99,80],[99,104],[88,112],[74,110],[64,104],[63,96]]},
 pecmin:{v:'F',deep:1,p:[[72,84],[84,84],[82,100],[72,96]]},
 serr:{v:'F',p:[[64,106],[70,108],[68,114],[72,118],[69,124],[73,128],[68,134],[64,124]]},
 icost:{v:'F',deep:1,p:[[72,112],[86,114],[84,128],[72,130]]},
 rectab:{v:'F',p:[[90,112],[99,112],[99,190],[91,190],[89,150]]},
 extobl:{v:'F',p:[[69,130],[74,116],[88,118],[88,186],[76,192],[70,170]]},
 transv:{v:'F',deep:1,p:[[73,150],[99,150],[99,200],[78,198]]},
 coraco:{v:'F',deep:1,p:[[58,100],[62,102],[61,124],[57,122]]},
 bic:{v:'F',p:[[49,104],[57,104],[59,126],[56,148],[50,150],[47,128]]},
 brach:{v:'F',deep:1,p:[[44,132],[49,132],[50,156],[45,158],[43,148]]},
 brrad:{v:'F',p:[[42,154],[48,158],[47,180],[41,208],[37,206],[39,180]]},
 prteres:{v:'F',p:[[54,160],[58,164],[50,186],[47,182]]},
 fcr:{v:'F',p:[[48,184],[52,170],[54,176],[49,214],[46,214]]},
 pl:{v:'F',p:[[52,168],[56,172],[51,222],[49,222]]},
 fcu:{v:'F',p:[[56,164],[58,170],[54,214],[51,224],[52,196]]},
 fd:{v:'F',deep:1,p:[[43,190],[53,178],[51,228],[42,228]]},
 prquad:{v:'F',deep:1,p:[[41,222],[50,222],[50,230],[41,230]]},
 supin_f:{v:'F',deep:1,p:[[44,160],[49,162],[46,178],[42,176]]},
 iliops:{v:'F',deep:1,p:[[84,170],[92,170],[95,202],[93,234],[86,232],[84,200]]},
 pectin:{v:'F',p:[[89,226],[97,232],[94,248],[87,242]]},
 tfl:{v:'F',p:[[66,206],[72,204],[75,232],[69,240],[66,226]]},
 sart:{v:'F',p:[[71,204],[77,206],[98,318],[95,332],[91,326]]},
 recfem:{v:'F',p:[[82,226],[86,226],[90,262],[89,300],[85,318],[81,300],[79,262]]},
 vl:{v:'F',p:[[68,240],[76,244],[80,292],[78,322],[73,326],[70,292]]},
 vm:{v:'F',p:[[89,288],[95,300],[96,320],[90,326],[86,316]]},
 vi:{v:'F',deep:1,p:[[78,254],[87,254],[87,300],[79,300]]},
 add:{v:'F',p:[[88,240],[95,236],[98,250],[97,282],[91,292],[88,268]]},
 grac:{v:'F',p:[[97,244],[99.5,244],[98,330],[95,334],[96,300]]},
 tibant:{v:'F',p:[[80,340],[86,338],[87,360],[85,404],[82,408],[80,372]]},
 edl:{v:'F',p:[[76,350],[80,346],[81,400],[80,414],[77,400]]},
 ehl:{v:'F',deep:1,p:[[84,378],[88,378],[88,418],[85,420]]},
 per_f:{v:'F',p:[[73,344],[76,344],[78,398],[75,400],[73,370]]},
 pert:{v:'F',p:[[79,398],[82,398],[82,420],[79,420]]},
 /* ---------- ACHTERAANZICHT ---------- */
 semisp:{v:'B',p:[[95,36],[99.5,36],[99.5,62],[95,62]]},
 splen:{v:'B',p:[[88,40],[94,40],[94,60],[89,62],[87,52]]},
 levsc:{v:'B',deep:1,p:[[86,50],[90,52],[86,82],[82,80]]},
 spin:{v:'B',p:[[96,100],[99.5,100],[99.5,170],[96,170]]},
 longth:{v:'B',p:[[92,100],[95.5,100],[95.5,166],[92,166]]},
 longlu:{v:'B',p:[[92,166],[95.5,166],[95.5,208],[92,206]]},
 iliocth:{v:'B',p:[[87,104],[91.5,104],[91.5,164],[87,164]]},
 iliocl:{v:'B',p:[[87,164],[91.5,164],[91.5,204],[86,200]]},
 multif:{v:'B',deep:1,p:[[96,168],[99.5,168],[99.5,214],[96,212]]},
 rotth:{v:'B',deep:1,c:1,p:[[98.5,96],[101.5,96],[101.5,166],[98.5,166]]},
 rotlu:{v:'B',deep:1,c:1,p:[[98.5,166],[101.5,166],[101.5,212],[98.5,212]]},
 ql:{v:'B',deep:1,p:[[78,170],[86,170],[86,202],[76,198]]},
 trap:{v:'B',p:[[94,48],[100,46],[100,152],[90,128],[84,104],[76,86],[63,74],[80,68],[91,62]]},
 supra:{v:'B',deep:1,p:[[70,80],[86,82],[85,88],[70,90]]},
 rhomb:{v:'B',deep:1,p:[[86,86],[96,88],[96,116],[84,106]]},
 infra:{v:'B',p:[[70,92],[84,92],[82,110],[72,108]]},
 subsc:{v:'B',deep:1,p:[[71,90],[85,90],[83,112],[71,110]]},
 tmin:{v:'B',p:[[65,102],[72,106],[70,112],[64,110]]},
 tmaj:{v:'B',p:[[64,112],[72,114],[70,122],[63,120]]},
 delt_b:{v:'B',p:[[64,72],[53,78],[47,92],[47,104],[54,106],[62,90],[70,84]]},
 lat:{v:'B',p:[[59,104],[65,106],[76,118],[90,124],[99.5,128],[99.5,200],[84,204],[72,184],[66,150],[61,120]]},
 tric:{v:'B',p:[[48,104],[57,104],[60,124],[57,150],[50,154],[46,130]]},
 ancon:{v:'B',p:[[50,156],[55,156],[54,166],[50,166]]},
 supin_b:{v:'B',deep:1,p:[[44,162],[50,164],[48,178],[43,176]]},
 ecr:{v:'B',p:[[42,158],[47,160],[46,190],[40,214],[37,210],[39,184]]},
 edig:{v:'B',p:[[47,170],[51,170],[48,216],[44,216]]},
 ecu:{v:'B',p:[[52,166],[56,170],[52,206],[49,220],[49,196]]},
 thumb:{v:'B',p:[[39,206],[45,204],[45,226],[40,228]]},
 gmed:{v:'B',p:[[66,198],[86,196],[82,212],[68,218]]},
 gmin:{v:'B',deep:1,p:[[68,200],[82,200],[80,210],[69,214]]},
 gmax:{v:'B',p:[[67,212],[84,208],[99,216],[99,250],[84,258],[68,246]]},
 piri:{v:'B',deep:1,p:[[72,224],[98,220],[98,226],[73,230]]},
 deeprot:{v:'B',deep:1,p:[[74,232],[98,230],[98,236],[75,238]]},
 qfem:{v:'B',deep:1,p:[[76,240],[94,240],[94,246],[77,246]]},
 addmag:{v:'B',p:[[89,250],[99.5,248],[99,292],[93,290],[89,272]]},
 bf:{v:'B',p:[[70,256],[80,258],[82,296],[80,326],[74,328],[71,292]]},
 st:{v:'B',p:[[83,258],[89,258],[92,300],[92,326],[87,326],[84,298]]},
 sm:{v:'B',p:[[90,270],[97,272],[97,318],[93,330],[91,300]]},
 popl:{v:'B',deep:1,p:[[80,330],[94,326],[93,338],[82,342]]},
 soleus:{v:'B',p:[[74,356],[96,356],[95,388],[90,406],[80,406],[75,388]]},
 gastr:{v:'B',p:[[74,330],[85,330],[86,360],[82,384],[76,378],[73,352]]},
 gastr2:{v:'B',p:[[87,330],[96,330],[97,352],[94,384],[88,384],[86,360]]},
 tibpost:{v:'B',deep:1,p:[[84,352],[89,352],[89,402],[84,402]]},
 fdl:{v:'B',deep:1,p:[[90,368],[95,368],[93,410],[90,410]]},
 fhl:{v:'B',deep:1,p:[[78,368],[83,368],[84,410],[80,410]]},
 per_b:{v:'B',p:[[71,346],[75,346],[78,402],[75,404],[72,370]]}
};
/* Spier (sleutel in DETAILS of naam in de bewegingskaarten) → vormen */
const BM_MAP={
 'M. Deltoideus':['delt_f','delt_b'],'M. Pectoralis Major':['pec'],'M. Latissimus Dorsi':['lat'],'M. Teres Major':['tmaj'],'M. Coracobrachialis':['coraco'],
 'M. Subscapularis':['subsc'],'M. Supraspinatus':['supra'],'M. Infraspinatus':['infra'],'M. Teres Minor':['tmin'],'M. Trapezius':['trap'],'M. Levator Scapulae':['levsc'],
 'Mm. Rhomboidei':['rhomb'],'M. Pectoralis Minor':['pecmin'],'M. Serratus Anterior':['serr'],'M. Biceps Brachii':['bic'],'M. Brachialis':['brach'],'M. Brachioradialis':['brrad'],
 'M. Triceps Brachii':['tric'],'M. Anconeus':['ancon'],'M. Supinator':['supin_f','supin_b'],'M. Pronator Teres':['prteres'],'M. Pronator Quadratus':['prquad'],
 'M. Flexor Carpi Radialis':['fcr'],'M. Flexor Carpi Ulnaris':['fcu'],'M. Palmaris Longus':['pl'],'M. Flexor Digitorum Superficialis / Profundus':['fd'],
 'M. Extensor Carpi Radialis Longus':['ecr'],'M. Extensor Carpi Radialis Longus / Brevis':['ecr'],'M. Extensor Carpi Ulnaris':['ecu'],'M. Extensor Digitorum':['edig'],
 'M. Abductor Pollicis Longus':['thumb'],'M. Extensor Pollicis Longus':['thumb'],
 'M. Sternocleidomastoideus':['scm'],'Mm. Scaleni':['scal'],'M. Longus Colli':['neckdeep'],'M. Longus Capitis':['neckdeep'],'M. Splenius Capitis':['splen'],
 'M. Splenius Capitis / Cervicis':['splen'],'M. Semispinalis Capitis':['semisp'],'Mm. Rotatores':['rotth','rotlu'],'Mm. Rotatores Lumbales':['rotlu'],'Mm. Rotatores Thoracales':['rotth'],
 'M. Rectus Abdominis':['rectab'],'M. Obliquus Externus Abdominis':['extobl'],'M. Obliquus Internus Abdominis':['extobl'],'M. Transversus Abdominis':['transv'],
 'M. Quadratus Lumborum':['ql'],'M. Erector Spinae':['spin','longth','longlu','iliocth','iliocl'],'M. Iliocostalis Lumborum':['iliocl'],'M. Iliocostalis Thoracis':['iliocth'],
 'M. Longissimus Lumborum':['longlu'],'M. Longissimus Thoracis':['longth'],'M. Spinalis Thoracis':['spin'],'M. Multifidus':['multif'],'Mm. Intercostales':['icost'],
 'M. Psoas Major':['iliops'],'M. Iliopsoas':['iliops'],'M. Rectus Femoris':['recfem'],'M. Gluteus Maximus':['gmax'],'M. Gluteus Medius':['gmed'],'M. Gluteus Minimus':['gmin'],
 'M. Tensor Fasciae Latae':['tfl'],'Hamstrings':['bf','st','sm'],'M. Biceps Femoris':['bf'],'M. Semitendinosus':['st'],'M. Semimembranosus':['sm'],
 'Adductoren':['add','addmag','grac','pectin'],'M. Adductor Magnus':['addmag','add'],'M. Adductor Longus':['add'],'M. Adductor Brevis':['add'],'M. Gracilis':['grac'],'M. Pectineus':['pectin'],
 'M. Sartorius':['sart'],'M. Piriformis':['piri'],'Diepe pelvitrochantaire spieren':['deeprot','qfem'],'M. Quadratus Femoris':['qfem'],
 'M. Vastus Lateralis / Medialis / Intermedius':['vl','vm','vi'],'M. Popliteus':['popl'],'M. Gastrocnemius':['gastr','gastr2'],'M. Soleus':['soleus'],
 'M. Triceps Surae':['gastr','gastr2','soleus'],'M. Tibialis Anterior':['tibant'],'M. Tibialis Posterior':['tibpost'],'M. Peroneus Longus':['per_f','per_b'],
 'M. Peroneus Brevis':['per_f','per_b'],'M. Peroneus Longus / Brevis':['per_f','per_b'],'M. Peroneus Tertius':['pert'],'M. Flexor Digitorum Longus':['fdl'],
 'M. Flexor Hallucis Longus':['fhl'],'M. Flexor Digitorum Superficialis':['fd'],'M. Flexor Digitorum Profundus':['fd'],'M. Extensor Carpi Radialis Brevis':['ecr'],'M. Extensor Digitorum Longus':['edl'],'M. Extensor Hallucis Longus':['ehl'],
 /* groepen en losse namen uit de bewegingskaarten */
 'Rotator cuff':['supra','infra','tmin','subsc'],'M. Infraspinatus / Teres Minor / Subscapularis':['infra','tmin','subsc'],'Buikwand':['rectab','extobl','transv'],
 'Diepe exorotatoren':['piri','deeprot','qfem'],'Mm. Obliqui':['extobl'],'M. Iliacus':['iliops']
};
const BM_ORDER=Object.keys(BM);
function bmSmooth(p){
  const n=p.length,f=v=>v.toFixed(1);let d=`M${f(p[0][0])},${f(p[0][1])}`;
  for(let i=0;i<n;i++){const a=p[(i-1+n)%n],b=p[i],c=p[(i+1)%n],e=p[(i+2)%n];
    d+=`C${f(b[0]+(c[0]-a[0])/6)},${f(b[1]+(c[1]-a[1])/6)} ${f(c[0]-(e[0]-b[0])/6)},${f(c[1]-(e[1]-b[1])/6)} ${f(c[0])},${f(c[1])}`;}
  return d+'Z';
}
const bmMirror=p=>p.map(([x,y])=>[200-x,y]);
const BM_PATH={};
for(const id of BM_ORDER){const s=BM[id];BM_PATH[id]=s.c?[bmSmooth(s.p)]:[bmSmooth(s.p),bmSmooth(bmMirror(s.p))];}
const BM_BODY=(()=>{const full=BM_SIL.concat(bmMirror(BM_SIL.slice(0,-1)).reverse());
  const f=v=>v.toFixed(1);return 'M'+full.map(q=>f(q[0])+','+f(q[1])).join('L')+'Z';})();
/* Namen → vormen. hl: {naam: rol} met rol 'ag' | 'sy' | 'st' | 'on' */
function bmShapesFor(name){
  if(BM_MAP[name])return BM_MAP[name];
  const k=typeof key==='function'?key(name):null;if(k&&BM_MAP[k])return BM_MAP[k];
  const b=name.split(' (')[0];if(BM_MAP[b])return BM_MAP[b];
  if(/^Hamstrings/.test(name))return BM_MAP.Hamstrings;
  if(/^M\. Triceps Surae/.test(name))return BM_MAP['M. Triceps Surae'];
  const parts=b.split(' / ');if(parts.length>1){const pre=parts[0].replace(/ [^ ]+$/,'');const out=[];
    parts.forEach((x,i)=>{const nm=i===0?x:(/^M\.|^Mm\./.test(x)?x:pre+' '+x);(BM_MAP[nm]||[]).forEach(s=>out.push(s));});if(out.length)return out;}
  return [];
}
const BM_RANK={ag:3,on:3,sy:2,st:1};
function bodymap(hl,opt={}){
  const role={};
  for(const [n,r] of hl)for(const s of bmShapesFor(n))if(!role[s]||BM_RANK[r]>BM_RANK[role[s]])role[s]=r;
  const views=['F','B'].filter(v=>!opt.only||opt.only===v);
  const fig=(v,dx)=>{
    const rest=[],hit=[];
    for(const id of BM_ORDER){if(BM[id].v!==v)continue;const r=role[id];
      for(const d of BM_PATH[id]){
        if(r)hit.push(`<path d="${d}" class="bm-m bm-${r}${BM[id].deep?' bm-deep':''}"/>`);
        else if(!BM[id].deep)rest.push(`<path d="${d}" class="bm-o"/>`);}}
    return `<g transform="translate(${dx},0)"><path d="${BM_BODY}" class="bm-b"/><ellipse cx="100" cy="30" rx="15" ry="19" class="bm-b"/>${rest.join('')}${hit.join('')}<text x="100" y="458" class="bm-t">${v==='F'?'Voorzijde':'Achterzijde'}</text></g>`;
  };
  const w=views.length*200+(views.length-1)*10;
  return `<svg class="bm${opt.cls?' '+opt.cls:''}" viewBox="0 0 ${w} 464" role="img" aria-label="${opt.label||'Lichaamskaart'}">${views.map((v,i)=>fig(v,i*210)).join('')}</svg>`;
}

/* Icoon: uitsnede van de lichaamskaart met één groep spieren ingekleurd.
   Kiest automatisch voor- of achterzijde en snijdt bij op de ingekleurde spieren. */
function bmIcon(names,opt={}){
  const ids=[...new Set(names.flatMap(n=>bmShapesFor(n)))].filter(id=>BM[id]&&!BM[id].deep);
  const use=ids.length?ids:[...new Set(names.flatMap(n=>bmShapesFor(n)))];
  const f=use.filter(id=>BM[id].v==='F').length,b=use.filter(id=>BM[id].v==='B').length;
  const v=opt.view||(b>f?'B':'F');
  const sel=use.filter(id=>BM[id].v===v);
  let x0=200,y0=460,x1=0,y1=0;
  for(const id of sel)for(const [x,y] of BM[id].p){x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);}
  const limb=x1<84;                         // ledemaat: alleen de linkerkant tonen
  if(!limb){x0=Math.min(x0,200-x1);x1=Math.max(x1,200-x0);}
  const pad=opt.pad??Math.max(16,(Math.max(x1-x0,y1-y0))*.28),cx=(x0+x1)/2,cy=(y0+y1)/2;
  const size=Math.max(x1-x0,y1-y0)+pad*2;
  const box=[cx-size/2,cy-size/2,size,size].map(n=>n.toFixed(1)).join(' ');
  const outl=[],hit=[];
  for(const id of BM_ORDER){if(BM[id].v!==v)continue;
    const on=sel.includes(id);
    for(const d of BM_PATH[id]){if(on)hit.push(`<path d="${d}" class="ic-m"/>`);else if(!BM[id].deep)outl.push(`<path d="${d}" class="ic-o"/>`);}}
  return `<svg class="bmi" viewBox="${box}" aria-hidden="true"><path d="${BM_BODY}" class="ic-b"/><ellipse cx="100" cy="30" rx="15" ry="19" class="ic-b"/>${outl.join('')}${hit.join('')}</svg>`;
}
