import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import {emergencySteps,emergencyGuideVersion} from '../src/data/content';
import {completeGuides,guideCommitPath,isGuideSaved,saveGuide,savedGuideResponse,type GuideManifest} from '../src/lib/offline-guide';

// CacheStorage test double stores cloned native Responses and absolute request keys.
function storage(){
 const stores=new Map<string,Map<string,Response>>();
 const key=(input:RequestInfo|URL)=>new URL(input instanceof Request?input.url:String(input),'https://app.test').href;
 const api={
  keys:async()=>[...stores.keys()],delete:async(name:string)=>stores.delete(name),
  open:async(name:string)=>{
   if(!stores.has(name))stores.set(name,new Map());const entries=stores.get(name)!;
   return {put:async(input:RequestInfo|URL,r:Response)=>{entries.set(key(input),r.clone());},match:async(input:RequestInfo|URL)=>entries.get(key(input))?.clone(),delete:async(input:RequestInfo|URL)=>entries.delete(key(input))} as Cache;
  },
 } as CacheStorage;
 return api;
}
const urls=['/','/_next/static/app.js',...emergencySteps.map(s=>s.audioUrl)];
function manifest(version=emergencyGuideVersion):GuideManifest{return {guideVersion:version,buildId:version,assets:urls.map(url=>({url,sha256:createHash('sha256').update(`body:${url}`).digest('hex')}))};}
const download=(async(input)=>new Response(`body:${input}`,{headers:{'Content-Type':String(input).endsWith('.mp3')?'audio/mpeg':'text/html'}})) as typeof fetch;

test('Saved requires the complete app shell and all four clips; reopening checks storage',async()=>{
 const cacheStorage=storage();assert.equal(await isGuideSaved(emergencyGuideVersion,urls.slice(2),[urls[1]],cacheStorage),false);
 await saveGuide(manifest(),cacheStorage,download);
 assert.equal(await isGuideSaved(emergencyGuideVersion,urls.slice(2),[urls[1]],cacheStorage),true);
 const [guide]=await completeGuides(cacheStorage);await guide.cache.delete(urls[3]);
 assert.equal(await isGuideSaved(emergencyGuideVersion,urls.slice(2),[urls[1]],cacheStorage),false);
});
test('A failed update preserves the previous complete download, including its shell',async()=>{
 const cacheStorage=storage();await saveGuide(manifest(),cacheStorage,download);
 const prior=await cacheStorage.keys();
 const failure=(async(input)=>String(input).endsWith('breathing.mp3')?new Response('missing',{status:404}):download(input)) as typeof fetch;
 await assert.rejects(saveGuide(manifest('new-version'),cacheStorage,failure));
 assert.deepEqual(await cacheStorage.keys(),prior);
 assert.equal(await isGuideSaved(emergencyGuideVersion,urls.slice(2),[urls[1]],cacheStorage),true);
 assert.equal(await isGuideSaved('new-version',urls.slice(2),[urls[1]],cacheStorage),false);
 assert.equal(await (await savedGuideResponse(new Request('https://app.test/'),cacheStorage))?.text(),'body:/');
});
test('Corrupt content, network loss and uncommitted caches never produce Saved',async()=>{
 for(const bad of [(async()=>new Response('truncated')) as typeof fetch,(async()=>{throw new Error('offline');}) as typeof fetch]){
  const cacheStorage=storage();await assert.rejects(saveGuide(manifest(),cacheStorage,bad));assert.deepEqual(await cacheStorage.keys(),[]);
 }
 const cacheStorage=storage();const cache=await cacheStorage.open('ucn-saved-guide-incomplete');await cache.put('/',new Response('partial'));
 assert.deepEqual(await completeGuides(cacheStorage),[]);assert.equal(await cache.match(guideCommitPath),undefined);
});
test('New shell bundles do not inherit an old Saved flag',async()=>{
 const cacheStorage=storage();await saveGuide(manifest(),cacheStorage,download);
 assert.equal(await isGuideSaved(emergencyGuideVersion,urls.slice(2),['/_next/static/new.js'],cacheStorage),false);
});
test('Saving an unchanged complete guide verifies it without duplicate downloads',async()=>{
 const cacheStorage=storage();await saveGuide(manifest(),cacheStorage,download);
 const before=await cacheStorage.keys();
 await saveGuide(manifest(),cacheStorage,(async()=>{throw new Error('No network needed for an unchanged complete guide');}) as typeof fetch);
 assert.deepEqual(await cacheStorage.keys(),before);
});
test('Offline MP3 seeking returns byte ranges and handles invalid ranges',async()=>{
 const cacheStorage=storage();await saveGuide(manifest(),cacheStorage,download);
 const response=await savedGuideResponse(new Request(`https://app.test${urls[2]}`,{headers:{Range:'bytes=5-12'}}),cacheStorage);
 assert.equal(response?.status,206);assert.equal(await response?.text(),`body:${urls[2]}`.slice(5,13));
 const suffix=await savedGuideResponse(new Request(`https://app.test${urls[2]}`,{headers:{Range:'bytes=-4'}}),cacheStorage);
 assert.equal(await suffix?.text(),'.mp3');
 const invalid=await savedGuideResponse(new Request(`https://app.test${urls[2]}`,{headers:{Range:'bytes=999999-'}}),cacheStorage);
 assert.equal(invalid?.status,416);
});
test('Versioned recordings match their transcript checksums and preserve older clips',async()=>{
 const recordings=JSON.parse(await readFile(`public/audio/${emergencyGuideVersion}/recordings.json`,'utf8'));
 assert.equal(recordings.guideVersion,emergencyGuideVersion);
 const ids=new Set(emergencySteps.map(s=>s.id));assert.equal(ids.size,4);
 for(const [i,step] of emergencySteps.entries()){
  assert.equal(step.guideVersion,emergencyGuideVersion);
  assert.equal(step.narration,`Step ${i+1}. ${step.title} ${step.text}`);
  const record=recordings.clips.find((r:{id:string})=>r.id===step.id);
  assert.ok(record);
  assert.equal(createHash('sha256').update(step.narration).digest('hex'),record.narrationSha256);
  assert.equal(createHash('sha256').update(await readFile(`public${step.audioUrl}`)).digest('hex'),record.mp3Sha256);
  assert.deepEqual(await readFile(`public/audio/2026-10-10-v1/${step.id}.mp3`),await readFile(`public/audio/step-${i+1}.mp3`));
 }
});
