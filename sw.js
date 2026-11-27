const CACHE='rehaboom-v4-18-sneller-laden';   // app-schil: wisselt bij elke versie
const IMG='rehaboom-img';   // spierafbeeldingen: blijft bewaard bij updates
const MEDIA='rehaboom-media';  // beelden en 3D: blijven bewaard bij updates (versie zit in de URL)
const CORE=['./premium.css?v=417','./premium.js?v=417','./motion-details.js?v=417','./motion-controls.js?v=417','./motion-3d.js?v=417','./shoulder-motion.js?v=2','./care-model.js?v=40','./secure-data.js?v=40','./video-catalog.js?v=40','./','./index.html','./upgrade.css?v=39','./upgrade.js?v=44-planes','./manifest.webmanifest','./icons/rehaboom-qr.png','./icons/icon-192.png','./icons/icon-512.png','./icons/maskable-512.png'];
// Zware bestanden: niet bij installatie, maar daarna op de achtergrond (zie warm()).
const ASSETS=["./anatomy/motion-three.js?v=3","./anatomy/motion-human.json?v=2"];
ASSETS.push(...["./media/025971b56e2d-still.webp","./media/025971b56e2d-thumb.webp","./media/03d455a42f14-still.webp","./media/03d455a42f14-thumb.webp","./media/049952246347-still.webp","./media/049952246347-thumb.webp","./media/0c08496602af-still.webp","./media/0c08496602af-thumb.webp","./media/0da6c67c1d6b-still.webp","./media/0da6c67c1d6b-thumb.webp","./media/0de9df2bab9d-still.webp","./media/0de9df2bab9d-thumb.webp","./media/0eeab74da4d8-still.webp","./media/0eeab74da4d8-thumb.webp","./media/110f9f427f48-still.webp","./media/110f9f427f48-thumb.webp","./media/116182cf8be0-still.webp","./media/116182cf8be0-thumb.webp","./media/126f1c40f9e3-still.webp","./media/126f1c40f9e3-thumb.webp","./media/16c16f156b03-still.webp","./media/16c16f156b03-thumb.webp","./media/1c8dae2c43be-still.webp","./media/1c8dae2c43be-thumb.webp","./media/1d8e2ab4f244-still.webp","./media/1d8e2ab4f244-thumb.webp","./media/1e3c4541043e-still.webp","./media/1e3c4541043e-thumb.webp","./media/1f3ca26daca0-still.webp","./media/1f3ca26daca0-thumb.webp","./media/35c3c6a0b122-still.webp","./media/35c3c6a0b122-thumb.webp","./media/37a83ae9f3da-still.webp","./media/37a83ae9f3da-thumb.webp","./media/3a60d2ed4a9c-still.webp","./media/3a60d2ed4a9c-thumb.webp","./media/3ae1bfba4336-still.webp","./media/3ae1bfba4336-thumb.webp","./media/3e1374ba1ab9-still.webp","./media/3e1374ba1ab9-thumb.webp","./media/42e0f42a6d96-still.webp","./media/42e0f42a6d96-thumb.webp","./media/49c191819550-still.webp","./media/49c191819550-thumb.webp","./media/4b0f2b8b2309-still.webp","./media/4b0f2b8b2309-thumb.webp","./media/4cb054cc6a62-still.webp","./media/4cb054cc6a62-thumb.webp","./media/51dad382dc1e-still.webp","./media/51dad382dc1e-thumb.webp","./media/e1dd234ae2ad-still.webp","./media/e1dd234ae2ad-thumb.webp","./media/e2d475d56f9d-still.webp","./media/e2d475d56f9d-thumb.webp","./media/e2de0889b8c1-still.webp","./media/e2de0889b8c1-thumb.webp","./media/e36f3d6dda7b-still.webp","./media/e36f3d6dda7b-thumb.webp","./media/e788ba617e4f-still.webp","./media/e788ba617e4f-thumb.webp","./media/e905e2f2d20e-still.webp","./media/e905e2f2d20e-thumb.webp","./media/eaeb6e62bf37-still.webp","./media/eaeb6e62bf37-thumb.webp","./media/eb705287fbb3-still.webp","./media/eb705287fbb3-thumb.webp","./media/ee28424c0a67-still.webp","./media/ee28424c0a67-thumb.webp","./media/ef5d830a8690-still.webp","./media/ef5d830a8690-thumb.webp","./media/f23f16065de9-still.webp","./media/f23f16065de9-thumb.webp","./media/f5a2286aca80-still.webp","./media/f5a2286aca80-thumb.webp","./media/f6d511a8a323-still.webp","./media/f6d511a8a323-thumb.webp","./media/fc2a514dd595-still.webp","./media/fc2a514dd595-thumb.webp","./media/fff9e357258c-still.webp","./media/fff9e357258c-thumb.webp","./media/flexor-digitorum-profundus-still.webp","./media/flexor-digitorum-profundus-thumb.webp","./media/illustraties/52260a2d1ae4-still.webp","./media/illustraties/56e9e1b4038f-still.webp","./media/illustraties/580538c47fc7-still.webp","./media/illustraties/5b947bfb1a60-still.webp","./media/illustraties/5c4008b31ec0-still.webp","./media/illustraties/6204156c62e6-still.webp","./media/illustraties/6277e92b97e1-still.webp","./media/illustraties/66908e6f96e9-still.webp","./media/illustraties/669b2902cc3b-still.webp","./media/illustraties/6811496d733e-still.webp","./media/illustraties/6e92167d5930-still.webp","./media/illustraties/71427050e1bc-still.webp","./media/illustraties/749166520f49-still.webp","./media/illustraties/7e7e06be02e8-still.webp","./media/illustraties/7fc04e021681-still.webp","./media/illustraties/83ac2877302c-still.webp","./media/illustraties/84e78623891c-still.webp","./media/illustraties/85afb1664e23-still.webp","./media/illustraties/887e32e1969e-still.webp","./media/illustraties/8a3c33ab9609-still.webp","./media/illustraties/8c55ed4db61c-still.webp","./media/illustraties/9e41bf1fbb3b-still.webp","./media/illustraties/9ea7433f3172-still.webp","./media/illustraties/a27c67b1d0ff-still.webp","./media/illustraties/a50f8dc31986-still.webp","./media/illustraties/a613b2eefaf8-still.webp","./media/illustraties/a7b7282141a8-still.webp","./media/illustraties/ae707c597f56-still.webp","./media/illustraties/af254a1a27a2-still.webp","./media/illustraties/b073b9b022af-still.webp","./media/illustraties/b23c017057bd-still.webp","./media/illustraties/c142711723f8-still.webp","./media/illustraties/c1b62e1c4acb-still.webp","./media/illustraties/c82a4b214944-still.webp","./media/illustraties/ca11364a563e-still.webp","./media/illustraties/cb2c3c74b1a0-still.webp","./media/illustraties/cccbbe6fa070-still.webp","./media/illustraties/cd58f6ce2cc3-still.webp","./media/illustraties/ce9e9bdee7e1-still.webp","./media/illustraties/cf17d55d79b9-still.webp","./media/illustraties/cfd6f22b1ba8-still.webp","./media/illustraties/d6869d6a7e52-still.webp","./media/illustraties/d90864caf027-still.webp","./media/illustraties/d9165fbdcd66-still.webp","./media/illustraties/extensor-carpi-radialis-brevis-still.webp","./media/illustraties/iliacus-still.webp","./media/illustraties/intercostales-interni-still.webp","./media/illustraties/scalenus-medius-still.webp","./media/illustraties/scalenus-posterior-still.webp","./media/miniaturen/52260a2d1ae4-thumb.webp","./media/miniaturen/56e9e1b4038f-thumb.webp","./media/miniaturen/580538c47fc7-thumb.webp","./media/miniaturen/5b947bfb1a60-thumb.webp","./media/miniaturen/5c4008b31ec0-thumb.webp","./media/miniaturen/6204156c62e6-thumb.webp","./media/miniaturen/6277e92b97e1-thumb.webp","./media/miniaturen/66908e6f96e9-thumb.webp","./media/miniaturen/669b2902cc3b-thumb.webp","./media/miniaturen/6811496d733e-thumb.webp","./media/miniaturen/6e92167d5930-thumb.webp","./media/miniaturen/71427050e1bc-thumb.webp","./media/miniaturen/749166520f49-thumb.webp","./media/miniaturen/7e7e06be02e8-thumb.webp","./media/miniaturen/7fc04e021681-thumb.webp","./media/miniaturen/83ac2877302c-thumb.webp","./media/miniaturen/84e78623891c-thumb.webp","./media/miniaturen/85afb1664e23-thumb.webp","./media/miniaturen/887e32e1969e-thumb.webp","./media/miniaturen/8a3c33ab9609-thumb.webp","./media/miniaturen/8c55ed4db61c-thumb.webp","./media/miniaturen/9e41bf1fbb3b-thumb.webp","./media/miniaturen/9ea7433f3172-thumb.webp","./media/miniaturen/a27c67b1d0ff-thumb.webp","./media/miniaturen/a50f8dc31986-thumb.webp","./media/miniaturen/a613b2eefaf8-thumb.webp","./media/miniaturen/a7b7282141a8-thumb.webp","./media/miniaturen/ae707c597f56-thumb.webp","./media/miniaturen/af254a1a27a2-thumb.webp","./media/miniaturen/b073b9b022af-thumb.webp","./media/miniaturen/b23c017057bd-thumb.webp","./media/miniaturen/c142711723f8-thumb.webp","./media/miniaturen/c1b62e1c4acb-thumb.webp","./media/miniaturen/c82a4b214944-thumb.webp","./media/miniaturen/ca11364a563e-thumb.webp","./media/miniaturen/cb2c3c74b1a0-thumb.webp","./media/miniaturen/cccbbe6fa070-thumb.webp","./media/miniaturen/cd58f6ce2cc3-thumb.webp","./media/miniaturen/ce9e9bdee7e1-thumb.webp","./media/miniaturen/cf17d55d79b9-thumb.webp","./media/miniaturen/cfd6f22b1ba8-thumb.webp","./media/miniaturen/d6869d6a7e52-thumb.webp","./media/miniaturen/d90864caf027-thumb.webp","./media/miniaturen/extensor-carpi-radialis-brevis-thumb.webp","./media/miniaturen/iliacus-thumb.webp","./media/miniaturen/intercostales-interni-thumb.webp","./media/miniaturen/scalenus-medius-thumb.webp","./media/miniaturen/scalenus-posterior-thumb.webp","./media/rhomboideus-major-still.webp","./media/rhomboideus-major-thumb.webp","./media/rhomboideus-minor-still.webp","./media/rhomboideus-minor-thumb.webp","./media/vastus-intermedius-still.webp","./media/vastus-intermedius-thumb.webp","./media/vastus-lateralis-still.webp","./media/vastus-lateralis-thumb.webp","./media/vastus-medialis-still.webp","./media/vastus-medialis-thumb.webp"]);
ASSETS.push(...['shoulder','girdle','girdle-ac','elbow','wrist','hip','knee','ankle','neck','spine','spine-segment','vlakken-en-assen'].map(n=>'./anatomy/'+n+'.webp'));
ASSETS.push(...['sh','sg','el','wr','hp','kn','an','nk','tr'].map(n=>'./anatomy/interactive/'+n+'.webp'));
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()));});
// Vult de mediacache aan met wat nog ontbreekt (max. 4 tegelijk) en ruimt oude versies van dezelfde bestanden op.
// Wordt bij elke app-start aangeroepen; wat al in de cache staat, wordt niet opnieuw gedownload.
let warming=null;
function warm(){
  if(warming)return warming;
  warming=caches.open(MEDIA).then(async c=>{
    const want=new Set(ASSETS.map(a=>new URL(a,self.location.href).href));
    const paths=new Set([...want].map(u=>new URL(u).pathname));
    for(const r of await c.keys()){const u=new URL(r.url);if(paths.has(u.pathname)&&!want.has(r.url))await c.delete(r);}
    const todo=[];for(const u of want)if(!(await c.match(u)))todo.push(u);
    let i=0;const worker=async()=>{while(i<todo.length){const u=todo[i++];try{const r=await fetch(u);if(r.ok)await c.put(u,r);}catch(err){/* offline: volgende keer verder */}}};
    await Promise.all([worker(),worker(),worker(),worker()]);
  }).finally(()=>{warming=null;});
  return warming;
}
const isMedia=p=>/^\/(media|anatomy|demos)\//.test(p);
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE&&k!==IMG&&k!==MEDIA).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));warm();});
self.addEventListener('fetch',e=>{
  const req=e.request; if(req.method!=='GET'||req.headers.has('range'))return;
  const url=new URL(req.url);
  // Never cache private synchronization requests or responses.
  if(url.origin===location.origin&&(/^\/(api|testers)(\/|$)/).test(url.pathname))return;
  // Pagina: eerst netwerk (updates), anders cache (offline)
  if(req.mode==='navigate'){e.waitUntil(warm());e.respondWith(fetch(req).then(r=>{if(r.ok){const cp=r.clone();caches.open(CACHE).then(c=>c.put('./index.html',cp));}return r;}).catch(()=>caches.match('./index.html')));return;}
  const img=url.hostname.endsWith('wikimedia.org');
  // Lettertypes, eigen bestanden en spierafbeeldingen: cache eerst, zodat ze offline werken
  if(img||url.origin===location.origin||url.hostname.endsWith('fonts.googleapis.com')||url.hostname.endsWith('fonts.gstatic.com')){
    e.respondWith(caches.match(req).then(hit=>hit||fetch(req).then(r=>{if(r.ok||r.type==='opaque'){const cp=r.clone();caches.open(img?IMG:(url.origin===location.origin&&isMedia(url.pathname))?MEDIA:CACHE).then(c=>c.put(req,cp));}return r;})));
  }
});

self.addEventListener('push', event => {
  let data;
  try { data = event.data?.json(); } catch { data = {}; }
  event.waitUntil(self.registration.showNotification(data?.title || 'Rehaboom-update', {
    body: data?.body || 'Open Rehaboom voor de nieuwste versie.',
    icon: '/icons/icon-192.png',
  }));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil((async () => {
    const home = new URL('/', self.location.origin).href;
    const windows = await self.clients.matchAll({type: 'window', includeUncontrolled: true});
    const app = windows.find(client => new URL(client.url).pathname === '/');
    if (app) {
      try { await app.navigate(home); } catch { /* Focus the existing app if navigation fails. */ }
      return app.focus();
    }
    return self.clients.openWindow(home);
  })());
});
  
