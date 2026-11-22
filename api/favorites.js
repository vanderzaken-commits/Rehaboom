import {createHash} from 'node:crypto';
import {get,list,put} from '@vercel/blob';
import {validateEvents,mergeDocuments} from '../lib/favorites.mjs';

export function createHandler(storage={get,list,put}) {
 return async function handler(req,res) {
  res.setHeader('Cache-Control','private, no-store, max-age=0');
  res.setHeader('Vary','Authorization');
  res.setHeader('X-Content-Type-Options','nosniff');
  if(!['GET','POST'].includes(req.method)){res.setHeader('Allow','GET, POST');return res.status(405).json({error:'Methode niet toegestaan'});}
  // Browsers on other origins cannot access the private collection.
  const origin=req.headers.origin;
  if(origin&&origin!==`https://${req.headers.host}`&&origin!==`http://${req.headers.host}`)return res.status(403).json({error:'Ongeldige herkomst'});
  const token=/^Bearer ([a-f0-9]{64})$/.exec(req.headers.authorization||'')?.[1];
  if(!token)return res.status(401).json({error:'Een geldige koppelcode is nodig'});
  const prefix='favorites/'+createHash('sha256').update(token).digest('hex')+'/';
  try {
   if(req.method==='POST') {
    if(!String(req.headers['content-type']||'').startsWith('application/json'))return res.status(415).json({error:'JSON vereist'});
    if(Number(req.headers['content-length']||0)>32768)return res.status(413).json({error:'Collectie te groot'});
    let body;
    try{body=typeof req.body==='string'?JSON.parse(req.body):req.body;}catch{return res.status(400).json({error:'Ongeldige gegevens'});}
    if(!body||!/^[a-f0-9]{32}$/.test(body.device||''))return res.status(400).json({error:'Ongeldig apparaat'});
    let events;try{events=validateEvents(body.events);}catch{return res.status(400).json({error:'Ongeldige favorieten'});}
    await storage.put(prefix+body.device+'.json',JSON.stringify({device:body.device,events}),{access:'private',addRandomSuffix:false,allowOverwrite:true,contentType:'application/json',cacheControlMaxAge:60});
    return res.status(200).json({ok:true});
   }
   const files=await storage.list({prefix,limit:33});
   if(files.hasMore||files.blobs.length>32)return res.status(409).json({error:'Te veel gekoppelde apparaten'});
   if(!files.blobs.length)return res.status(404).json({error:'Collectie niet gevonden. Controleer de koppelcode.'});
   const docs=await Promise.all(files.blobs.map(async b=>{
    const file=await storage.get(b.pathname,{access:'private',useCache:false});
    if(!file||file.statusCode!==200)throw new Error('Opslag tijdelijk niet beschikbaar');
    return JSON.parse(await new Response(file.stream).text());
   }));
   return res.status(200).json({items:mergeDocuments(docs)});
  } catch {return res.status(503).json({error:'Synchronisatie is tijdelijk niet bereikbaar. Je favorieten blijven op dit toestel.'});}
 };
}
export default createHandler();
export const config={maxDuration:30};
