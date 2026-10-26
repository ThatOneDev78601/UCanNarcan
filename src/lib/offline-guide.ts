// Shared by the page and service worker. A cache becomes usable only after the
// complete, integrity-checked download has a commit record.
export const guideCachePrefix='ucn-saved-guide-';
export const guideCommitPath='/__ucn_saved_guide__';
export type GuideManifest={guideVersion:string;buildId:string;assets:{url:string;sha256:string}[]};
type Commit=GuideManifest & {savedAt:number};

function validManifest(value:unknown):value is GuideManifest {
 const m=value as GuideManifest;
 return !!m&&typeof m.guideVersion==='string'&&typeof m.buildId==='string'&&Array.isArray(m.assets)&&m.assets.length>4&&
  m.assets.every(a=>typeof a.url==='string'&&a.url.startsWith('/')&&!a.url.startsWith('//')&&/^[a-f0-9]{64}$/.test(a.sha256))&&
  m.assets.some(a=>a.url==='/');
}
export async function readGuideManifest(fetcher:typeof fetch=fetch):Promise<GuideManifest>{
 const response=await fetcher('/offline-guide.json',{cache:'no-store',signal:AbortSignal.timeout(20000)});
 if(!response.ok)throw new Error('Guide manifest unavailable');
 const manifest:unknown=await response.json();
 if(!validManifest(manifest))throw new Error('Invalid guide manifest');
 return manifest;
}
export function matchesGuide(manifest:GuideManifest,version:string,audioUrls:string[],shellUrls:string[]){
 return manifest.guideVersion===version&&[...audioUrls,...shellUrls].every(url=>manifest.assets.some(a=>a.url===url));
}
export async function completeGuides(storage:CacheStorage=caches):Promise<{name:string;cache:Cache;commit:Commit}[]> {
 const complete=[];
 for(const name of await storage.keys()){
  if(!name.startsWith(guideCachePrefix))continue;
  const cache=await storage.open(name);
  const record=await cache.match(guideCommitPath);
  if(!record)continue;
  try{
   const commit:Commit=await record.json();
   if(!validManifest(commit)||!Number.isFinite(commit.savedAt))continue;
   const responses=await Promise.all(commit.assets.map(a=>cache.match(a.url)));
   if(responses.every(r=>r?.status===200))complete.push({name,cache,commit});
  }catch{/* Incomplete or evicted entries are never advertised as saved. */}
 }
 return complete.sort((a,b)=>b.commit.savedAt-a.commit.savedAt);
}
export async function isGuideSaved(version:string,audioUrls:string[],shellUrls:string[],storage:CacheStorage=caches){
 return (await completeGuides(storage)).some(g=>matchesGuide(g.commit,version,audioUrls,shellUrls));
}
export async function saveGuide(manifest:GuideManifest,storage:CacheStorage=caches,fetcher:typeof fetch=fetch){
 if(!validManifest(manifest))throw new Error('Invalid guide manifest');
 const previous=await completeGuides(storage);
 if(previous.some(g=>g.commit.buildId===manifest.buildId&&g.commit.guideVersion===manifest.guideVersion&&JSON.stringify(g.commit.assets)===JSON.stringify(manifest.assets)))return;
 // Never write into a prior complete cache: even a same-version rebuild may fail.
 const name=`${guideCachePrefix}${manifest.buildId}-${crypto.randomUUID()}`;
 const cache=await storage.open(name);
 try{
  // Four concurrent requests limit memory and avoid swamping a mobile connection.
  for(let i=0;i<manifest.assets.length;i+=4){
   await Promise.allSettled(manifest.assets.slice(i,i+4).map(async asset=>{
    const response=await fetcher(asset.url,{cache:'no-store',signal:AbortSignal.timeout(30000)});
    if(response.status!==200)throw new Error(`Download failed: ${asset.url}`);
    const body=await response.arrayBuffer();
    const digest=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',body)),b=>b.toString(16).padStart(2,'0')).join('');
    if(digest!==asset.sha256)throw new Error(`Content changed: ${asset.url}`);
    const headers=new Headers(response.headers);
    headers.delete('Content-Encoding');headers.set('Content-Length',String(body.byteLength));
    await cache.put(asset.url,new Response(body,{status:200,headers}));
   })).then(results=>{if(results.some(r=>r.status==='rejected'))throw new Error('Incomplete guide download');});
  }
  await cache.put(guideCommitPath,new Response(JSON.stringify({...manifest,savedAt:Date.now()}),{headers:{'Content-Type':'application/json'}}));
  if(!(await completeGuides(storage)).some(g=>g.name===name))throw new Error('Guide verification failed');
 }catch(error){await storage.delete(name);throw error;}
}
export async function savedGuideResponse(request:Request,storage:CacheStorage=caches):Promise<Response|undefined>{
 const url=new URL(request.url);
 for(const {cache} of await completeGuides(storage)){
  const response=await cache.match(url.pathname==='/'?'/':request.url);
  if(!response)continue;
  const range=request.headers.get('Range');
  if(!range)return response;
  // Native audio uses byte ranges for seeking. Cache contains the entire MP3.
  const match=/^bytes=(\d*)-(\d*)$/.exec(range);
  if(!match)return response;
  const body=await response.arrayBuffer();
  const start=match[1]?Number(match[1]):Math.max(0,body.byteLength-Number(match[2]));
  const end=match[1]&&match[2]?Math.min(Number(match[2]),body.byteLength-1):body.byteLength-1;
  if(start>end||start>=body.byteLength)return new Response(null,{status:416,headers:{'Content-Range':`bytes */${body.byteLength}`}});
  const headers=new Headers(response.headers);
  headers.set('Content-Range',`bytes ${start}-${end}/${body.byteLength}`);
  headers.set('Content-Length',String(end-start+1));
  headers.set('Accept-Ranges','bytes');
  return new Response(body.slice(start,end+1),{status:206,headers});
 }
}
