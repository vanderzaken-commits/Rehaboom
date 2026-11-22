// Each device writes its own document. Per-item clocks merge offline changes
// without overwriting edits to unrelated favorites on another device.
export function validateEvents(input) {
 if(!input||typeof input!=='object'||Array.isArray(input)||Object.keys(input).length>200)throw new Error('Ongeldige collectie');
 const result=Object.create(null);
 for(const [id,v] of Object.entries(input)) {
  if(!/^(muscle|exercise):[^\u0000-\u001f<>]{1,120}$/.test(id)||!v||typeof v.on!=='boolean'||!Number.isSafeInteger(v.at)||v.at<1||v.at>Date.now()+300000)throw new Error('Ongeldig item');
  result[id]={on:v.on,at:v.at};
 }
 return result;
}
export function mergeDocuments(documents) {
 const items=Object.create(null);
 for(const doc of documents)for(const [id,event] of Object.entries(doc.events||{})) {
  const old=items[id];
  if(!old||event.at>old.at||(event.at===old.at&&String(doc.device)>old.device))items[id]={...event,device:doc.device};
 }
 return items;
}
