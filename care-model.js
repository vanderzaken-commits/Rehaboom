/* Domain functions shared by the UI and deterministic tests. */
window.CareModel=(()=>{
 'use strict';
 const localDate=(d=new Date())=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
 const uid=()=>crypto.randomUUID();
 const empty=()=>({version:1,clients:[],programs:[],sessions:[],measurements:[],reviews:[],portals:{}});
 const validDate=s=>typeof s==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(s)&&localDate(new Date(s+'T12:00:00'))===s;
 const num=(n,min,max)=>typeof n==='number'&&Number.isFinite(n)&&n>=min&&n<=max;
 const text=(s,max)=>typeof s==='string'&&s.length<=max;
 const identifier=s=>typeof s==='string'&&/^[\w-]{1,80}$/.test(s);
 function validateProgram(p,ids){
  return p&&identifier(p.id)&&text(p.title,100)&&text(p.clientId||'',80)&&Array.isArray(p.days)&&p.days.length<=7&&p.days.every(n=>Number.isInteger(n)&&n>=0&&n<=6)&&Array.isArray(p.items)&&p.items.length<=40&&p.items.every(i=>identifier(i.id)&&ids.has(i.exId)&&Number.isInteger(i.sets)&&num(i.sets,1,12)&&Number.isInteger(i.reps)&&num(i.reps,1,300)&&['reps','seconds'].includes(i.unit)&&num(i.rest,0,600)&&text(i.tempo||'',30)&&text(i.note||'',500)&&num(i.load??0,0,1500))&&text(p.note||'',2000)&&text(p.privateNote||'',2000);
 }
 function validateSession(s,ids){return s&&identifier(s.id)&&identifier(s.clientId)&&identifier(s.programId)&&validDate(s.date)&&num(s.rpe,0,10)&&text(s.note||'',1000)&&Array.isArray(s.items)&&s.items.length>0&&s.items.length<=40&&s.items.every(i=>ids.has(i.exId)&&['reps','seconds'].includes(i.unit)&&Array.isArray(i.sets)&&i.sets.length>0&&i.sets.length<=12&&i.sets.every(v=>Number.isInteger(v.reps)&&num(v.reps,1,300)&&num(v.load,0,1500)));}
 function validateState(s,ids){
  if(!s||s.version!==1||!['clients','programs','sessions','measurements','reviews'].every(k=>Array.isArray(s[k])&&s[k].length<=2000))return false;
  return s.clients.every(c=>identifier(c.id)&&text(c.name,80)&&text(c.goal||'',500)&&validDate(c.start)&&(!c.evaluation||validDate(c.evaluation)))&&s.programs.every(p=>validateProgram(p,ids))&&s.sessions.every(x=>validateSession(x,ids))&&s.measurements.every(m=>identifier(m.id)&&identifier(m.clientId)&&validDate(m.date)&&['rom','weight','recovery'].includes(m.type)&&num(m.value,0,m.type==='rom'?360:m.type==='weight'?500:10)&&text(m.label||'',100)&&text(m.side||'',20))&&s.reviews.every(r=>identifier(r.id)&&identifier(r.clientId)&&validDate(r.date)&&text(r.note||'',2000)&&(!r.next||validDate(r.next)));
 }
 function nextTraining(programs,from=new Date()){
  const d=new Date(from.getFullYear(),from.getMonth(),from.getDate(),12);
  for(let n=0;n<8;n++){const day=new Date(d);day.setDate(day.getDate()+n);const matches=programs.filter(p=>p.items.length&&p.days.includes(day.getDay()));if(matches.length)return {date:localDate(day),programs:matches};}return null;
 }
 function weekStart(date=new Date()){const d=new Date(date.getFullYear(),date.getMonth(),date.getDate(),12);d.setDate(d.getDate()-((d.getDay()+6)%7));return localDate(d);}
 function weeklyStats(programs,sessions,date=new Date()){
  const start=weekStart(date),d=new Date(start+'T12:00:00');d.setDate(d.getDate()+7);const end=localDate(d);
  const planned=programs.reduce((n,p)=>n+(p.items.length?new Set(p.days).size:0),0),done=sessions.filter(s=>s.date>=start&&s.date<end).length;
  return {planned,done,percentage:planned?Math.round(done/planned*100):null};
 }
 function exerciseSeries(sessions,id,metric='load'){
  return sessions.filter(s=>s.items.some(i=>i.exId===id)).sort((a,b)=>a.date.localeCompare(b.date)||a.id.localeCompare(b.id)).slice(-12).map(s=>{
   const items=s.items.filter(i=>i.exId===id);const sets=items.flatMap(i=>i.sets);let value;
   if(metric==='volume')value=items.reduce((sum,i)=>sum+(i.unit==='reps'?i.sets.reduce((n,v)=>n+v.reps*v.load,0):0),0);
   else if(metric==='reps')value=sets.reduce((n,v)=>n+v.reps,0);
   else if(metric==='effort')value=s.rpe;
   else value=Math.max(0,...sets.map(v=>v.load));
   return {date:s.date,value:Number(value.toFixed(2)),id:s.id};
  });
 }
 function clientSnapshot(state,id){
  const client=state.clients.find(c=>c.id===id);if(!client)throw new Error('Cliënt niet gevonden');
  return {version:1,client:{id:client.id,name:client.name,goal:client.goal,start:client.start,evaluation:client.evaluation},programs:state.programs.filter(p=>p.clientId===id).map(p=>{const {privateNote,...safe}=p;return safe;})};
 }
 function validateSnapshot(s,ids){return s&&s.version===1&&s.client&&validateState({...empty(),clients:[s.client],programs:s.programs},ids)&&s.programs.every(p=>p.clientId===s.client.id);}
 function mergeResults(state,results,clientId,ids){
  if(!results||results.version!==1||!Array.isArray(results.sessions)||!Array.isArray(results.measurements))throw new Error('Ongeldige resultaten');
  const sessions=results.sessions.filter(s=>s.clientId===clientId&&validateSession(s,ids));
  const measurements=results.measurements.filter(m=>m.clientId===clientId&&validateState({...empty(),measurements:[m]},ids));
  if(sessions.length!==results.sessions.length||measurements.length!==results.measurements.length)throw new Error('Resultaten horen niet bij deze cliënt');
  for(const s of sessions)if(!state.sessions.some(x=>x.id===s.id))state.sessions.push(s);
  for(const m of measurements)if(!state.measurements.some(x=>x.id===m.id))state.measurements.push(m);
  return state;
 }
 return {localDate,uid,empty,validDate,validateProgram,validateSession,validateState,nextTraining,weeklyStats,exerciseSeries,clientSnapshot,validateSnapshot,mergeResults};
})();
