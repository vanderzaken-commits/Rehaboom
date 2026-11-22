import {readFileSync, readdirSync, mkdirSync, copyFileSync, rmSync} from 'node:fs';
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
rmSync('dist',{recursive:true,force:true});
copy();
for (const file of ['entry.js', 'panel.js', 'push.js']) {
 new vm.Script(readFileSync('testers/'+file,'utf8'));
}
if (!/<\/body>/i.test(html)) throw new Error('Missing app document body.');
console.log('Static app built; source files copied unchanged.');
