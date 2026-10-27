const CACHE='rehaboom-v2-7';
const IMG='rehaboom-img';   // spierafbeeldingen: blijft bewaard bij updates
const CORE=['./','./index.html','./data.js?v=25','./bodymap.js?v=25','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png','./icons/maskable-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE&&k!==IMG).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const req=e.request; if(req.method!=='GET')return;
  const url=new URL(req.url);
  // Pagina: eerst netwerk (updates), anders cache (offline)
  if(req.mode==='navigate'){e.respondWith(fetch(req).then(r=>{const cp=r.clone();caches.open(CACHE).then(c=>c.put('./index.html',cp));return r;}).catch(()=>caches.match('./index.html')));return;}
  const img=url.hostname.endsWith('wikimedia.org');
  // Lettertypes, eigen bestanden en spierafbeeldingen: cache eerst, zodat ze offline werken
  if(img||url.origin===location.origin||url.hostname.endsWith('fonts.googleapis.com')||url.hostname.endsWith('fonts.gstatic.com')){
    e.respondWith(caches.match(req).then(hit=>hit||fetch(req).then(r=>{if(r.ok||r.type==='opaque'){const cp=r.clone();caches.open(img?IMG:CACHE).then(c=>c.put(req,cp));}return r;})));
  }
});
