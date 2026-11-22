import {readFileSync, readdirSync, mkdirSync, copyFileSync, writeFileSync} from 'node:fs';
import vm from 'node:vm';
const html=readFileSync('index.html','utf8');
for (const [,s] of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)) new vm.Script(s);
for(const f of ['upgrade.js','premium.js','motion-3d.js','shoulder-motion.js','care-model.js','secure-data.js','video-catalog.js','anatomy/motion-three.js'])new vm.Script(readFileSync(f,'utf8'));
function copy(dir='') {
 for(const f of readdirSync(dir||'.',{withFileTypes:true})) {
  const p=dir?dir+'/'+f.name:f.name;
  if(f.name.startsWith('.')||['node_modules','dist','api','lib','scripts','tests'].includes(f.name))continue;
  if(!dir&&!['demos','anatomy','media','icons','testers','premium.css','premium.js','motion-3d.js','shoulder-motion.js','care-model.js','secure-data.js','video-catalog.js','index.html','upgrade.css','upgrade.js','sw.js','manifest.webmanifest','media-sources.json'].includes(f.name))continue;
  if(f.isDirectory())copy(p);
  else if(/\.(html|css|js|webp|png|mp4|webmanifest|json)$/.test(f.name)&&!['package.json','package-lock.json','vercel.json'].includes(f.name)) {
   mkdirSync('dist/'+dir,{recursive:true});copyFileSync(p,'dist/'+p);
  }
 }
}
copy();
for (const file of ['entry.js', 'panel.js', 'push.js']) {
 new vm.Script(readFileSync('testers/'+file,'utf8'));
}
if (!/<\/body>/i.test(html)) throw new Error('Missing app document body.');
writeFileSync('dist/index.html',html.replace(/<\/body>/i,'<script defer src="/testers/entry.js?v=1"></script>\n</body>'));
const worker=readFileSync('sw.js','utf8');
const push=readFileSync('testers/push.js','utf8');
const bypass="if(url.origin===location.origin&&url.pathname.startsWith('/api/'))return;";
if (!worker.includes(bypass)) throw new Error('Update the service worker route exclusions.');
writeFileSync('dist/sw.js',worker.replace(bypass,
 "if(url.origin===location.origin&&(/^\\/(api|testers)(\\/|$)/).test(url.pathname))return;")+'\n'+push);
console.log('Static app built; inline and upgrade scripts parsed.');
