import { defaultCache } from '@serwist/next/worker';
import { Serwist, type PrecacheEntry, type SerwistGlobalConfig } from 'serwist';
import { savedGuideResponse } from '../lib/offline-guide';
declare global {interface WorkerGlobalScope extends SerwistGlobalConfig {__SW_MANIFEST:(PrecacheEntry|string)[]|undefined}}
declare const self:ServiceWorkerGlobalScope;
const serwist=new Serwist({precacheEntries:self.__SW_MANIFEST,skipWaiting:false,clientsClaim:true,navigationPreload:false,runtimeCaching:[{
 matcher:({url})=>url.origin===self.location.origin&&(url.pathname==='/'||url.pathname.startsWith('/audio/')||url.pathname.startsWith('/_next/static/')),
 handler:async({request})=>{
  try {const response=await fetch(request);if(response.ok)return response;}catch{}
  const saved=await savedGuideResponse(request);
  return saved??new Response('Offline resource unavailable',{status:503});
 }
},{
 // Let the browser honor tile-server HTTP caching; maps are never part of guide downloads.
 matcher:({url})=>url.hostname==='tile.openstreetmap.org',
 handler:({request})=>fetch(request)
},...defaultCache]});
serwist.addEventListeners();
