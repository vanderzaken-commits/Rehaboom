import {createHash,timingSafeEqual} from 'node:crypto';
import {get,list,put} from '@vercel/blob';
const hash=s=>createHash('sha256').update(s).digest('hex');
const hex=s=>typeof s==='string'&&/^[a-f0-9]{64}$/.test(s);
function envelope(x){return x&&x.v===1&&/^[A-Za-z0-9+/]{16}$/.test(x.iv||'')&&typeof x.data==='string'&&x.data.length>=24&&x.data.length<=600000&&/^[A-Za-z0-9+/]+=*$/.test(x.data);}
async function read(storage,path){const r=await storage.get(path,{access:'private',useCache:false});return r?.statusCode===200?JSON.parse(await new Response(r.stream).text()):null;}
export function createPortalHandler(storage={get,list,put}){return async(req,res)=>{
 res.setHeader('Cache-Control','private, no-store, max-age=0');res.setHeader('Vary','Authorization');res.setHeader('X-Content-Type-Options','nosniff');
 const send=(n,error)=>res.status(n).json({error});
 if(!['GET','POST'].includes(req.method)){res.setHeader('Allow','GET, POST');return send(405,'Methode niet toegestaan');}
 const origin=req.headers.origin;if(origin&&origin!==`https://${req.headers.host}`&&origin!==`http://${req.headers.host}`)return send(403,'Ongeldige herkomst');
 const token=/^Bearer ([a-f0-9]{64})$/.exec(req.headers.authorization||'')?.[1];if(!token)return send(401,'Een geldige portaalcode is nodig');
 const prefix='portals/'+hash(token)+'/',path=prefix+'plan.json';
 try{
  const record=await read(storage,path);
  if(req.method==='GET'){
   if(!record)return send(404,'Portaal niet gevonden');if(record.disabled)return send(403,'Dit portaal is ingetrokken door de coach');
   const files=await storage.list({prefix:prefix+'logs/',limit:33});if(files.hasMore||files.blobs.length>32)return send(409,'Te veel apparaten gekoppeld');
   const logs=await Promise.all(files.blobs.map(b=>read(storage,b.pathname)));
   return res.status(200).json({plan:record.plan,revision:record.revision,logs:logs.filter(Boolean)});
  }
  if(!String(req.headers['content-type']||'').startsWith('application/json'))return send(415,'JSON vereist');
  if(Number(req.headers['content-length']||0)>650000)return send(413,'Gegevens te groot');
  let body;try{body=typeof req.body==='string'?JSON.parse(req.body):req.body;}catch{return send(400,'Ongeldige gegevens');}
  if(!body||JSON.stringify(body).length>650000)return send(400,'Ongeldige gegevens');
  if(body.action==='publish'||body.action==='revoke'){
   const owner=req.headers['x-portal-owner'];if(!hex(owner))return send(403,'Alleen de coach kan het programma wijzigen');
   const ownerHash=hash(owner);
   if(record&&!timingSafeEqual(Buffer.from(record.ownerHash,'hex'),Buffer.from(ownerHash,'hex')))return send(403,'Geen coachtoegang voor dit portaal');
   if(body.action==='revoke'){
    if(!record)return send(404,'Portaal niet gevonden');await storage.put(path,JSON.stringify({...record,disabled:true}),{access:'private',addRandomSuffix:false,allowOverwrite:true,contentType:'application/json',cacheControlMaxAge:60});return res.status(200).json({ok:true});
   }
   if(!envelope(body.plan))return send(400,'Ongeldig versleuteld programma');
   // Existing portals require their owner; a reader can never replace a plan.
   await storage.put(path,JSON.stringify({ownerHash,plan:body.plan,disabled:false,revision:Date.now()}),{access:'private',addRandomSuffix:false,allowOverwrite:!!record,contentType:'application/json',cacheControlMaxAge:60});
   return res.status(200).json({ok:true});
  }
  if(body.action==='log'){
   if(!record)return send(404,'Portaal niet gevonden');if(record.disabled)return send(403,'Dit portaal is ingetrokken door de coach');
   if(!/^[a-f0-9]{32}$/.test(body.device||'')||!envelope(body.payload))return send(400,'Ongeldige versleutelde resultaten');
   await storage.put(prefix+'logs/'+body.device+'.json',JSON.stringify({device:body.device,payload:body.payload}),{access:'private',addRandomSuffix:false,allowOverwrite:true,contentType:'application/json',cacheControlMaxAge:60});return res.status(200).json({ok:true});
  }
  return send(400,'Onbekende actie');
 }catch{return send(503,'Portaal tijdelijk niet bereikbaar. Opgeslagen resultaten blijven op dit toestel.');}
};}
export default createPortalHandler();
export const config={maxDuration:30};
