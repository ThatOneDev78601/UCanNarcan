// Run while `node scripts/serve.mjs` is serving the production export.
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const path='/audio/2026-10-10-human-v1/recognize.mp3';
const source=await readFile(`out${path}`);
for(const [range,start,end] of [['bytes=0-99',0,99],['bytes=100-',100,source.length-1],['bytes=-50',source.length-50,source.length-1]]){
 const response=await fetch(`http://127.0.0.1:3001${path}`,{headers:{Range:range}});
 assert.equal(response.status,206);
 assert.equal(response.headers.get('Content-Range'),`bytes ${start}-${end}/${source.length}`);
 assert.deepEqual(Buffer.from(await response.arrayBuffer()),source.subarray(start,end+1));
}
assert.equal((await fetch(`http://127.0.0.1:3001${path}`,{headers:{Range:`bytes=${source.length}-`}})).status,416);
const head=await fetch(`http://127.0.0.1:3001${path}`,{method:'HEAD'});
assert.equal(Number(head.headers.get('Content-Length')),source.length);
assert.equal((await head.arrayBuffer()).byteLength,0);
console.log('Preview audio ranges, invalid range, and HEAD passed.');
