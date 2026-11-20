/* REHABOOM 3.9: navigation, presentation and private favorite collections. */
(() => {
 'use strict';
 let jointSection='anatomie', applyingRoute=false, routePending=false;
 const jointSections={
  anatomie:{label:'Anatomie',panel:'joint-anatomy'},
  beweging:{label:'Beweging',panel:'joint-motion'},
  toepassing:{label:'Toepassing',panel:'joint-practice'},
  'vlakken-en-assen':{label:'Vlakken en assen',panel:'joint-planes-lesson'}
 };
 const originalG=renderG,originalO=renderO,originalSheet=openSheet,originalClose=closeSheet,originalMove=goMove;
 const equipment={squat:'Halter',sumo:'Halter',sissy:'Lichaamsgewicht',rdl:'Halter',dl:'Halter',thrust:'Halter',lunge:'Dumbbells',reverse:'Dumbbells',bss:'Dumbbells',legcurl:'Machine',legext:'Machine',calf:'Machine',seatedcalf:'Machine',bench:'Halter',pushup:'Lichaamsgewicht',ohp:'Halter',arnold:'Dumbbells',pullup:'Optrekstang',row:'Halter',lateral:'Dumbbells',facepull:'Kabel / elastiek',curl:'Dumbbells',inclinecurl:'Dumbbells',triceps:'Kabel / dumbbell',plank:'Lichaamsgewicht',sideplank:'Lichaamsgewicht',pallof:'Kabel / elastiek',backext:'Bank'};
 // IDs vary by exercise; use the exercise name for descriptive filters.
 function gear(e){
  const n=e.n.toLowerCase();
  if(/sissy|push-up|plank/.test(n))return 'Lichaamsgewicht';
  if(/pull-up/.test(n))return 'Optrekstang';
  if(/leg curl|leg extension|kuitheffing/.test(n))return 'Machine';
  if(/face pull|pallof/.test(n))return 'Kabel / elastiek';
  if(/back extension/.test(n))return 'Bank';
  if(/arnold|lateral|biceps|lunge|split squat/.test(n))return 'Dumbbells';
  if(/triceps/.test(n))return 'Kabel / dumbbell';
  return equipment[e.id]||'Halter';
 }
 function pattern(e){const n=e.n.toLowerCase();
  if(/squat|lunge|split squat|leg extension/.test(n))return 'Knie dominant';
  if(/deadlift|hip thrust|leg curl|back extension/.test(n))return 'Heup / achterzijde';
  if(/kuit/.test(n))return 'Enkel';
  if(/plank|pallof/.test(n))return 'Rompstabiliteit';
  if(/pull-up|row|face pull|biceps/.test(n))return 'Trekken';
  return 'Duwen';
 }
 const filters={region:'',gear:'',pattern:''};
 window.rbFilterExercise=e=>(!filters.region||e.cat===filters.region)&&(!filters.gear||gear(e)===filters.gear)&&(!filters.pattern||pattern(e)===filters.pattern);
 function renderFilters(){
  const root=$('exercise-filters');
  root.innerHTML=[['region','Regio',EXCATS],['gear','Materiaal',[...new Set(EX.map(gear))]],['pattern','Bewegingspatroon',[...new Set(EX.map(pattern))]]].map(([key,label,values])=>`<label>${label}<select data-ex-select="${key}" aria-label="${label}"><option value="">Alles</option>${values.map(v=>`<option value="${esc(v)}"${filters[key]===v?' selected':''}>${esc(v)}</option>`).join('')}</select></label>`).join('');
 }
 function jointPanels(){
  const j=J[ji];
  const tabs=$('joint-sections');
  if(!tabs.children.length)tabs.innerHTML=Object.entries(jointSections).map(([id,{label,panel}])=>`<button type="button" data-joint-section="${id}" aria-controls="${panel}">${label}</button>`).join('');
  for(const tab of tabs.children){
   const selected=tab.dataset.jointSection===jointSection;
   tab.setAttribute('aria-pressed',String(selected));
   $(tab.getAttribute('aria-controls')).hidden=!selected;
  }
  $('joint-muscles').hidden=jointSection!=='beweging';
  const moves=new Set(j.planes.flatMap(p=>p.moves.map(m=>m.id)));
  const exercises=EX.filter(e=>e.acts.some(([id,effort])=>
   moves.has(id)&&(effort==='c'||(effort==='i'&&j.id==='tr'&&e.cat==='Romp'))
  ));
  $('joint-practice').innerHTML=`<h3>${esc(j.short)} in de praktijk</h3><p class="practice-intro">Oefeningen die dit gewricht gericht trainen. Open een oefening voor coaching, betrokken spieren en de bewegingsanalyse.</p><div class="joint-practice-list">${exercises.map(e=>`<button class="practice-link" data-practice-ex="${e.id}"><b>${esc(e.n)}</b><small>${esc(e.d)}</small><span>Bekijk oefening →</span></button>`).join('')||'<p>Voor dit gewricht zijn nog geen oefeningen gekoppeld.</p>'}</div>`;
  const head=$('joint-anatomy').querySelector('.ja-head');
  if(head&&!head.querySelector('[data-share]'))head.insertAdjacentHTML('beforeend','<button class="share-button" data-share>Deel gewricht</button>');
 }
 renderG=function(){originalG();jointPanels();};
 renderO=function(){originalO();
  const cats=$('excats');const count=cats.querySelectorAll('[data-e]').length;
  cats.insertAdjacentHTML('afterbegin',`<p class="exercise-count" role="status">${count} oefening${count===1?'':'en'}${filters.region||filters.gear||filters.pattern?' · gefilterd':''}</p>`);
 };
 openSheet=function(name){originalSheet(name);const sheet=document.querySelector('.sheet');
  if(sheet&&!sheet.querySelector('[data-share]'))sheet.querySelector('h3').insertAdjacentHTML('afterend','<button class="share-button" data-share>Deel spier</button>');scheduleRoute();};
 closeSheet=function(){originalClose();scheduleRoute();};
 goMove=function(id){jointSection='beweging';originalMove(id);scheduleRoute();};

 function route(){
  const params=new URLSearchParams();let path;
  if(activeSheetName){path='spier/'+encodeURIComponent(activeSheetName);}
  else if(cur===0){path='gewricht/'+J[ji].id;params.set('onderdeel',jointSection);params.set('vlak',String(pi));if(JA_STATE.mode==='schema')params.set('beeld','lagen');}
  else if(cur===1)path='spieren';
  else if(cur===2)path='oefening/'+EX[ei].id;
  else if(cur===5)path='begeleiding';
  else if(cur===3)path='testen/'+encodeURIComponent(TJ[tj]);
  else{path='simulator/'+si;params.set('a',a);params.set('b',b);}
  if(client)params.set('client','1');
  return '#'+path+(params.size?'?'+params:'');
 }
 function writeRoute(replace=false){if(applyingRoute)return;const next=route();if(location.hash!==next)history[replace?'replaceState':'pushState'](null,'',location.pathname+location.search+next);}
 function scheduleRoute(){if(applyingRoute||routePending)return;routePending=true;queueMicrotask(()=>{routePending=false;writeRoute();});}
 function resetExerciseFilters(){Object.keys(filters).forEach(k=>filters[k]='');$('ex-search').value='';savedExercisesOnly=false;renderFilters();}
 function applyRoute(){
  if(!location.hash)return;applyingRoute=true;
  try {
   const raw=location.hash.slice(1),q=raw.indexOf('?'),path=q<0?raw:raw.slice(0,q),p=new URLSearchParams(q<0?'':raw.slice(q+1));
   const [kind,encoded]=path.split('/');const id=decodeURIComponent(encoded||'');
   let valid=true;
   // Mode is part of a shared explanation, while theme stays local to each device.
   if(['gewricht','spier','spieren','oefening','testen','simulator'].includes(kind)&&client!==(p.get('client')==='1'))setClient(p.get('client')==='1');
   originalClose();
   if(kind==='begeleiding'){switchTab(5);if(window.rbRenderCare)window.rbRenderCare();}
   else if(kind==='gewricht'){
    const index=J.findIndex(j=>j.id===id);if(index<0)valid=false;else{
     ji=index;pi=Math.max(0,Math.min(J[ji].planes.length-1,Number(p.get('vlak'))||0));
     jointSection=Object.hasOwn(jointSections,p.get('onderdeel'))?p.get('onderdeel'):'anatomie';JA_STATE.mode=p.get('beeld')==='lagen'?'schema':'atlas';
     switchTab(0);renderG();
    }
   }else if(kind==='oefening'){
    const index=EX.findIndex(e=>e.id===id);if(index<0)valid=false;else{resetExerciseFilters();ei=index;switchTab(2);renderO();}
   }else if(kind==='spier'){
    if(!key(id)&&!groupOf(id))valid=false;else{switchTab(1);openSheet(id);}
   }else if(kind==='spieren'){switchTab(1);renderS();}
   else if(kind==='testen'){
    const index=TJ.indexOf(id);if(index<0)valid=false;else{tj=index;switchTab(3);renderT();}
   }else if(kind==='simulator'){
    const i=Number(id);if(!Number.isInteger(i)||i<0||i>=S.length)valid=false;else{si=i;a=p.get('a')==='1'?1:0;b=p.get('b')==='1'?1:0;switchTab(4);renderI();}
   }else valid=false;
   if(!valid)toast('Deze link bestaat niet meer. Kies een onderdeel in de app.');
  }catch{toast('De link kon niet worden geopend.');}
  finally{applyingRoute=false;writeRoute(true);}
 }
 addEventListener('popstate',applyRoute);addEventListener('hashchange',()=>{if(location.hash!==route())applyRoute();});
 let toastTimer;
 function toast(message){let box=$('app-toast');if(!box){box=document.createElement('div');box.id='app-toast';box.className='app-toast';box.setAttribute('role','status');document.body.append(box);}box.textContent=message;box.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>box.hidden=true,4200);}
 const dialog=document.createElement('dialog');dialog.id='collection-dialog';dialog.className='collection-dialog';dialog.setAttribute('aria-labelledby','collection-title');document.body.append(dialog);
 function closeDialog(){dialog.close();}
 async function copyText(text,message){try{await navigator.clipboard.writeText(text);toast(message);return true;}catch{return false;}}
 async function share(){writeRoute();const url=location.origin+location.pathname+location.search+route();
  if(await copyText(url,'Deellink gekopieerd'))return;
  dialog.innerHTML='<button class="dialog-close" data-dialog-close aria-label="Sluiten">×</button><h2 id="collection-title">Deel deze uitleg</h2><p>Kopieer de link om deze selectie te delen.</p><label for="share-url">Deellink</label><textarea id="share-url" readonly></textarea>';
  dialog.querySelector('textarea').value=url;dialog.showModal();dialog.querySelector('textarea').select();
 }

 // Private collection: only favorite IDs, never client files or health data.
 const readJSON=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))??fallback;}catch{return fallback;}};
 const persist=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value));return true;}catch{toast('Opslag op dit toestel is niet beschikbaar.');return false;}};
 const randomHex=bytes=>Array.from(crypto.getRandomValues(new Uint8Array(bytes)),b=>b.toString(16).padStart(2,'0')).join('');
 let token=readJSON('rb-collection-key','');if(!/^[a-f0-9]{64}$/.test(token))token='';
 let device=readJSON('rb-device','');if(!/^[a-f0-9]{32}$/.test(device)){device=randomHex(16);persist('rb-device',device);}
 let events=readJSON('rb-favorite-events',{}),remoteItems={},busy=false,status=token?'Collectie gekoppeld. Synchronisatie controleren…':'Favorieten staan op dit toestel.';
 if(!events||typeof events!=='object'||Array.isArray(events))events={};
 const sets={muscle:savedMuscles,exercise:savedExercises};
 const validItem=id=>{const colon=id.indexOf(':'),type=id.slice(0,colon),key=id.slice(colon+1);return type==='muscle'?!!DETAILS[key]:type==='exercise'&&EX.some(e=>e.id===key);};
 function clock(){return Math.max(Date.now(),...Object.values(events).map(v=>Number(v.at||0)+1),...Object.values(remoteItems).map(v=>Number(v.at||0)+1));}
 // Existing local favorites migrate without losing the saved selections.
 for(const [type,set] of Object.entries(sets))for(const key of set){const id=type+':'+key;if(!events[id])events[id]={on:true,at:clock()};}
 persist('rb-favorite-events',events);
 function refreshSaved(){
  const merged={...remoteItems};
  for(const [id,v] of Object.entries(events)){
   const old=merged[id];if(!old||v.at>old.at||(v.at===old.at&&device>=old.device))merged[id]={...v,device};
  }
  savedMuscles.clear();savedExercises.clear();
  for(const [id,v] of Object.entries(merged))if(v.on&&validItem(id)){const i=id.indexOf(':');sets[id.slice(0,i)].add(id.slice(i+1));}
  persist('rb-saved-muscles',[...savedMuscles]);persist('rb-saved-exercises',[...savedExercises]);
  renderS();renderO();
  document.querySelectorAll('[data-save-muscle]').forEach(b=>{const on=savedMuscles.has(b.dataset.saveMuscle);b.setAttribute('aria-pressed',on);b.innerHTML=SAVE_ICON+'<span>'+(on?'Opgeslagen':'Bewaar spier')+'</span>';});
 }
 async function request(method,key=token,body){
  const r=await fetch('/api/favorites',{method,cache:'no-store',headers:{Authorization:'Bearer '+key,...(body?{'Content-Type':'application/json'}:{})},...(body?{body:JSON.stringify(body)}:{}),signal:AbortSignal.timeout(20000)});
  const data=await r.json().catch(()=>({}));if(!r.ok)throw new Error(data.error||'Synchronisatie niet bereikbaar');return data;
 }
 function updateStatus(message){status=message;const el=dialog.querySelector('#sync-state');if(el)el.textContent=status;document.querySelectorAll('[data-collection]').forEach(b=>b.textContent=token?'Collectie · gekoppeld':'Collectie & apparaten');}
 let needsSync=false,lastUploaded='';
 async function sync(){
  if(!token)return;if(busy){needsSync=true;return;}busy=true;
  try {
   if(!navigator.onLine)throw new Error('Offline: wijzigingen staan op dit toestel en worden verzonden zodra je weer online bent.');
   const target=token;
   // Only this device's changes are written, so other devices cannot be erased.
   const snapshot=JSON.stringify(events);
   if(snapshot!==lastUploaded){await request('POST',target,{device,events});lastUploaded=snapshot;}
   const data=await request('GET',target);if(token!==target)return;
   remoteItems=data.items;refreshSaved();updateStatus('Gesynchroniseerd · '+new Intl.DateTimeFormat('nl-NL',{hour:'2-digit',minute:'2-digit'}).format(new Date()));
  }catch(e){updateStatus(e.message||'Synchronisatie tijdelijk niet bereikbaar. Favorieten blijven op dit toestel.');}
  finally{busy=false;if(needsSync){needsSync=false;sync();}}
 }
 function collection(){
  const count=savedMuscles.size+savedExercises.size;
  dialog.innerHTML=`<button class="dialog-close" data-dialog-close aria-label="Sluiten">×</button><h2 id="collection-title">Mijn collectie</h2><p>${count} opgeslagen ${count===1?'item':'items'} · ${savedMuscles.size} ${savedMuscles.size===1?'spier':'spieren'} en ${savedExercises.size} ${savedExercises.size===1?'oefening':'oefeningen'}.</p><p class="sync-status" id="sync-state" role="status"></p>${token?`<div class="dialog-actions"><button class="primary" data-sync-now>Nu synchroniseren</button><button data-copy-code>Koppelcode kopiëren</button><button data-show-code>Code bekijken</button></div><div id="code-reveal" hidden><label for="own-code">Jouw privé-koppelcode</label><textarea id="own-code" readonly></textarea></div><p class="private-note">Open Rehaboom op je andere apparaat en vul daar deze code in bij Mijn collectie. Iedereen met de code kan deze favorieten bekijken en wijzigen. Bewaar hem voor jezelf.</p><button data-disconnect>Dit apparaat ontkoppelen</button>`:`<p>Gebruik dezelfde favorieten op je telefoon, tablet en computer.</p><button class="primary" data-create-collection>Privécollectie maken</button><p class="private-note">Alleen je opgeslagen spieren en oefeningen worden gesynchroniseerd.</p><hr><label for="collection-code">Bestaande koppelcode</label><input id="collection-code" type="password" autocomplete="off" spellcheck="false" placeholder="rb1_…"><div class="dialog-actions"><button data-connect-collection>Dit apparaat koppelen</button></div>`}<hr><div class="dialog-actions"><button data-view-saved="muscle">Opgeslagen spieren</button><button data-view-saved="exercise">Opgeslagen oefeningen</button></div>`;
  dialog.querySelector('#sync-state').textContent=status;
  if(token)dialog.querySelector('#own-code').value='rb1_'+token;
  if(!dialog.open)dialog.showModal();
 }
 async function connect(create){
  if(busy)return;busy=true;
  const candidate=create?randomHex(32):dialog.querySelector('#collection-code').value.trim().replace(/^rb1_/,'');
  if(!/^[a-f0-9]{64}$/.test(candidate)){busy=false;updateStatus('Vul de volledige koppelcode in.');return;}
  updateStatus(create?'Privécollectie maken…':'Collectie koppelen…');
  try {
   let incoming={};if(!create)incoming=(await request('GET',candidate)).items;
   // Commit the link only after storage accepts the request.
   await request('POST',candidate,{device,events});
   if(!persist('rb-collection-key',candidate))throw new Error('Koppelcode kon niet op dit toestel worden bewaard.');
   token=candidate;lastUploaded=JSON.stringify(events);remoteItems=incoming;refreshSaved();updateStatus('Collectie gekoppeld. Je favorieten worden automatisch bijgewerkt.');collection();
  }catch(e){updateStatus(e.message||'Koppelen niet gelukt. Probeer het opnieuw.');}
  finally{busy=false;}
 }
 document.addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b)return;
  if(b.dataset.jointSection){jointSection=b.dataset.jointSection;jointPanels();}
  if(b.dataset.practiceEx){const i=EX.findIndex(x=>x.id===b.dataset.practiceEx);if(i>=0){resetExerciseFilters();ei=i;switchTab(2);renderO();}}
  if(b.hasAttribute('data-share')){share();return;}
  if(b.id==='collection-toggle'||b.hasAttribute('data-collection'))collection();
  if(b.hasAttribute('data-dialog-close'))closeDialog();
  if(b.hasAttribute('data-create-collection'))connect(true);
  if(b.hasAttribute('data-connect-collection'))connect(false);
  if(b.hasAttribute('data-copy-code'))copyText('rb1_'+token,'Privé-koppelcode gekopieerd').then(ok=>{if(!ok){dialog.querySelector('#code-reveal').hidden=false;dialog.querySelector('#own-code').select();}});
  if(b.hasAttribute('data-show-code')){dialog.querySelector('#code-reveal').hidden=false;dialog.querySelector('#own-code').select();}
  if(b.hasAttribute('data-sync-now'))sync();
  if(b.hasAttribute('data-disconnect')){token='';remoteItems={};persist('rb-collection-key','');
   // Snapshot visible favorites as the new local collection; no remote deletion.
   events={};for(const [type,set] of Object.entries(sets))for(const k of set)events[type+':'+k]={on:true,at:Date.now()};persist('rb-favorite-events',events);updateStatus('Apparaat ontkoppeld. Favorieten blijven op dit toestel.');collection();}
  if(b.dataset.viewSaved){closeDialog();if(b.dataset.viewSaved==='muscle'){savedMusclesOnly=true;$('q').value='';switchTab(1);renderS();}else{resetExerciseFilters();savedExercisesOnly=true;switchTab(2);renderO();}}
  const type=b.dataset.saveMuscle?'muscle':b.dataset.saveExercise?'exercise':null;
  if(type){const key=b.dataset.saveMuscle||b.dataset.saveExercise;events[type+':'+key]={on:sets[type].has(key),at:clock()};persist('rb-favorite-events',events);if(token)sync();}
  // Original handlers have completed by the time this listener observes state.
  if(!dialog.contains(b))scheduleRoute();
 });
 document.addEventListener('change',e=>{const key=e.target.dataset.exSelect;if(key){filters[key]=e.target.value;renderO();scheduleRoute();}});
 $('ex-search').addEventListener('input',scheduleRoute);
 addEventListener('online',sync);document.addEventListener('visibilitychange',()=>{if(!document.hidden)sync();});
 // Poll only while visible; re-read after reconnect and on foregrounding the app.
 setInterval(()=>{if(token&&!document.hidden&&navigator.onLine)sync();},60000);
 addEventListener('storage',e=>{if(['rb-favorite-events','rb-collection-key'].includes(e.key)){events=readJSON('rb-favorite-events',{});token=readJSON('rb-collection-key','');refreshSaved();sync();}});
 renderFilters();renderG();renderO();updateStatus(status);
 if(location.hash)applyRoute();else writeRoute(true);
 if(token)sync();
})();
