import {readFileSync, writeFileSync} from 'node:fs';

// Refresh cached app files while retaining the existing private-route exclusions.
const worker=readFileSync('sw.js','utf8');
if(!/const CACHE='[^']+';/.test(worker))throw new Error('Service worker cache identifier missing.');
writeFileSync('sw.js',worker.replaceAll('motion-3d.js?v=410','motion-3d.js?v=415').replace(/const CACHE='[^']+';/,"const CACHE='rehaboom-v4-15-clickable-deltoid';"));
await import('./build.mjs');
