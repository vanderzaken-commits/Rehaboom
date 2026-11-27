import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, existsSync, statSync} from 'node:fs';
import vm from 'node:vm';

const worker = readFileSync('sw.js', 'utf8');
const head = worker.slice(0, worker.indexOf('self.addEventListener'));
const {CACHE, MEDIA, CORE, ASSETS} = vm.runInNewContext(head + ';({CACHE,MEDIA,CORE,ASSETS})');
const file = url => url.split('?')[0].replace(/^\.\//, '') || 'index.html';

test('every precached and background asset exists in the source', () => {
  assert.deepEqual([...CORE, ...ASSETS].filter(u => !existsSync(file(u))), []);
});

test('install downloads only the light app shell (< 1.5 MB)', () => {
  const unique = [...new Set(CORE.map(file))];
  const bytes = unique.reduce((s, p) => s + statSync(p).size, 0);
  assert.ok(bytes < 1.5e6, `CORE is ${(bytes / 1e6).toFixed(2)} MB`);
  assert.ok(!CORE.some(u => /motion-(three|human)|\/media\//.test(u)), '3D and media belong in ASSETS');
});

test('media cache survives an update; shell cache carries the package version', () => {
  const version = JSON.parse(readFileSync('package.json', 'utf8')).version.split('.').slice(0, 2).join('-');
  assert.ok(CACHE.startsWith(`rehaboom-v${version}-`), `${CACHE} vs ${version}`);
  assert.match(worker, /k!==MEDIA/);
  assert.ok(!/\d/.test(MEDIA), 'media cache name must stay stable across versions');
});

test('3D renderer and model are fetched on demand and cached for offline use', () => {
  for (const a of ['./anatomy/motion-three.js', './anatomy/motion-anatomy.json']) {
    assert.ok(ASSETS.some(u => u.startsWith(a)), a);
  }
  assert.match(worker, /e\.waitUntil\(warm\(\)\)/);
});
