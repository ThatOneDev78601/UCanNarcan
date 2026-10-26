'use client';

import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { motion, MotionConfig, useReducedMotion } from 'framer-motion';
import { ArrowDown, ArrowRight, ArrowUpRight, BookOpen, Check, CheckCircle2, ChevronLeft, ChevronRight, Clock3, Download, ExternalLink, Heart, HeartHandshake, Info, LocateFixed, MapPin, Navigation, Pause, Phone, Play, RotateCcw, Search, ShieldCheck, Store, TrendingDown, Volume2, VolumeX, WifiOff, X, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { AnimatedNumber } from '@/components/animated-number';
import { ImpactChart } from '@/components/impact-chart';
import dynamic from 'next/dynamic';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import snapshot from '@/data/locations.json';
import statsSnapshot from '@/data/stats.json';
import { emergencyGuideVersion, emergencySteps, lessons, medicalSources } from '@/data/content';
import { isGuideSaved, matchesGuide, readGuideManifest, saveGuide } from '@/lib/offline-guide';
import { directionsUrl, phoneHref, rankLocations, safeWebsite, type Coordinates, type Location } from '@/lib/locations';
import { loadPublishedLocations } from '@/lib/firebase';
import { cdcEndpoint, summarizeStats, type CDCRow } from '@/lib/stats';

const sourceMapUrl='https://www.google.com/maps/d/viewer?mid=1Oc8m4uYRvpJmIKdtG-73GUFLcTQuPmpa';
const emergencyAudioUrls=emergencySteps.map(s=>s.audioUrl);
function audioTime(seconds:number){const whole=Math.floor(seconds);return `${Math.floor(whole/60)}:${String(whole%60).padStart(2,'0')}`;}
const sourceUrl='https://health.maryland.gov/pha/NALOXONE/Pages/Approved-Entities.aspx';
const NearbyMap=dynamic(()=>import('@/components/nearby-map'),{ssr:false,loading:()=> <p className="map-loading" role="status">Loading nearby map…</p>});
type Origin=Coordinates & {label:string;kind:'device'|'search';accuracy?:number};
type Candidate={address:string;location:{x:number;y:number};score:number;attributes?:{Addr_type?:string}};
type InstallEvent=Event & {prompt:()=>Promise<void>;userChoice:Promise<{outcome:string}>};

function Brand(){return <span className="brand"><span className="brand-mark"><Heart size={19} fill="currentColor" strokeWidth={2.5}/></span>UCan<span className="brand-accent">Narcan</span><span className="brand-dot">+</span></span>;}

export default function UCanNarcan(){
 const reduceMotion=useReducedMotion();
 const [view,setView]=useState<'find'|'learn'|'impact'>('find');
 const [locations,setLocations]=useState<Location[]>(snapshot.locations as Location[]);
 const [origin,setOrigin]=useState<Origin|null>(null);
 const [mapCenter,setMapCenter]=useState<Coordinates|null>(null);
 const [search,setSearch]=useState('');const [directorySearch,setDirectorySearch]=useState('');
 const [candidates,setCandidates]=useState<Candidate[]>([]);
 const [filter,setFilter]=useState('all');const [sort,setSort]=useState('nearest');
 const [busy,setBusy]=useState(false);const [message,setMessage]=useState('');
 const [selected,setSelected]=useState<Location|null>(null);
 const [emergency,setEmergency]=useState(false);const [step,setStep]=useState(0);
 const [lesson,setLesson]=useState<number|null>(null);const [answer,setAnswer]=useState<number|null>(null);
 const [completed,setCompleted]=useState<string[]>([]);
 const [showAll,setShowAll]=useState(false);const [mobilePanel,setMobilePanel]=useState<'map'|'list'>('map');
 const [about,setAbout]=useState(false);const [install,setInstall]=useState(false);
 const [installEvent,setInstallEvent]=useState<InstallEvent|null>(null);
 const [mapRevision,setMapRevision]=useState(0);const [guideMessage,setGuideMessage]=useState('');
 const [savingGuide,setSavingGuide]=useState(false);
 const [audioError,setAudioError]=useState(false);const [audioLoading,setAudioLoading]=useState(false);const [audioPlaying,setAudioPlaying]=useState(false);
 const [audioPosition,setAudioPosition]=useState(0);const [audioDuration,setAudioDuration]=useState(0);const [audioMuted,setAudioMuted]=useState(false);
 const audioRef=useRef<HTMLAudioElement|null>(null);const saveInProgress=useRef(false);
 const [offline,setOffline]=useState(false);const [offlineReady,setOfflineReady]=useState(false);
 const [rows,setRows]=useState<CDCRow[]>(statsSnapshot.rows);const [statsStatus,setStatsStatus]=useState('Saved CDC snapshot');
 const [dataStatus,setDataStatus]=useState('Map snapshot · Oct 1, 2026');
 const request=useRef<AbortController|null>(null);const searchSequence=useRef(0);
 const stats=useMemo(()=>summarizeStats(rows),[rows]);
 const results=useMemo(()=>rankLocations(locations,origin,filter,directorySearch,sort),[locations,origin,filter,directorySearch,sort]);
 const visible=showAll?results:results.slice(0,3);
 const hasNavigated=useRef(false);
 const settle=reduceMotion?{duration:0}:{duration:.25,ease:'easeOut' as const};
 const learningSpring=reduceMotion?{duration:0}:{type:'spring' as const,stiffness:100,damping:18,mass:1.5};
 const headingMotion={initial:reduceMotion?false as const:{opacity:0,y:-20},animate:{opacity:1,y:0},transition:reduceMotion?{duration:0}:{...learningSpring,opacity:{duration:.25}}};
 const copyMotion={initial:reduceMotion?false as const:{opacity:0,y:12},animate:{opacity:1,y:0},transition:reduceMotion?{duration:0}:{...learningSpring,delay:.08,opacity:{duration:.25}}};

 useEffect(()=>{
  try{setCompleted(JSON.parse(localStorage.getItem('ucn-lessons')||'[]'));}catch{}
  const online=()=>setOffline(!navigator.onLine);online();window.addEventListener('online',online);window.addEventListener('offline',online);
  const prompt=(e:Event)=>{e.preventDefault();setInstallEvent(e as InstallEvent);};window.addEventListener('beforeinstallprompt',prompt);
  loadPublishedLocations().then(data=>{if(data){setLocations(data);setDataStatus('Directory synced from Firebase');}}).catch(()=>setDataStatus('Saved map snapshot · sync unavailable'));
  const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),10000);
  fetch(cdcEndpoint,{signal:controller.signal,cache:'no-store'}).then(r=>{if(!r.ok)throw new Error();return r.json();}).then(data=>{summarizeStats(data);setRows(data);setStatsStatus(`CDC checked ${new Date().toLocaleDateString('en-US')}`);}).catch(()=>setStatsStatus(`Saved CDC snapshot · ${new Date(statsSnapshot.retrievedAt).toLocaleDateString('en-US')}`)).finally(()=>clearTimeout(timeout));
  return()=>{window.removeEventListener('online',online);window.removeEventListener('offline',online);window.removeEventListener('beforeinstallprompt',prompt);controller.abort();request.current?.abort();};
 },[]);

 function shellUrls(){return Array.from(document.querySelectorAll<HTMLScriptElement|HTMLLinkElement>('script[src],link[rel="stylesheet"]')).map(el=>new URL(el instanceof HTMLScriptElement?el.src:el.href)).filter(url=>url.origin===location.origin).map(url=>url.pathname);}
 async function refreshSavedGuide(){
  try{const ready='caches' in window&&await isGuideSaved(emergencyGuideVersion,emergencyAudioUrls,shellUrls());setOfflineReady(ready);return ready;}catch{setOfflineReady(false);return false;}
 }
 useEffect(()=>{
  void refreshSavedGuide();
  const refresh=()=>{if(document.visibilityState==='visible')void refreshSavedGuide();};
  window.addEventListener('pageshow',refresh);window.addEventListener('focus',refresh);document.addEventListener('visibilitychange',refresh);
  return()=>{window.removeEventListener('pageshow',refresh);window.removeEventListener('focus',refresh);document.removeEventListener('visibilitychange',refresh);};
 },[]);
 useEffect(()=>{
  const audio=audioRef.current;
  if(emergency)void refreshSavedGuide();
  return()=>{audio?.pause();};
 },[emergency,step]);
 useEffect(()=>{
  if(!audioLoading)return;
  const audio=audioRef.current;
  const timeout=setTimeout(()=>{if(audioRef.current===audio){audio?.pause();setAudioLoading(false);setAudioError(true);}},20000);
  return()=>clearTimeout(timeout);
 },[audioLoading,step,emergency]);
 function stopAudio(){const audio=audioRef.current;if(audio){audio.pause();audio.currentTime=0;}setAudioPlaying(false);setAudioLoading(false);setAudioPosition(0);}
 function changeStep(next:number){stopAudio();setAudioError(false);if(next!==step)setAudioDuration(0);setStep(next);}
 function changeEmergency(open:boolean){stopAudio();setAudioError(false);setAudioDuration(0);if(open)setStep(0);setEmergency(open);}
 async function playAudio({restart=false,retry=false}:{restart?:boolean;retry?:boolean}={}){
  const audio=audioRef.current;if(!audio)return;
  setAudioError(false);setAudioLoading(true);if(retry)audio.load();if(restart){audio.currentTime=0;setAudioPosition(0);}
  try{await audio.play();}catch(error){if(audioRef.current===audio&&!(error instanceof DOMException&&error.name==='AbortError')){setAudioLoading(false);setAudioError(true);setAudioPlaying(false);}}
 }
 async function checkOffline(){
  if(saveInProgress.current||audioPlaying)return;
  if(!('caches' in window)||!('serviceWorker' in navigator)||!navigator.serviceWorker.controller){setGuideMessage('Offline saving becomes available once the production service worker is ready. Reopen this page and try again.');return;}
  saveInProgress.current=true;setSavingGuide(true);setGuideMessage('Saving the guide and all four audio steps…');
  try{
   const manifest=await readGuideManifest();
   if(!matchesGuide(manifest,emergencyGuideVersion,emergencyAudioUrls,shellUrls()))throw new Error('App updated; reopen before saving');
   await saveGuide(manifest);if(!await refreshSavedGuide())throw new Error('Storage verification failed');
   setGuideMessage('Saved. The guide and all four audio steps are available offline while browser storage remains available.');
  }catch{
   await refreshSavedGuide();
   setGuideMessage('Could not finish saving. Reconnect and retry. Any previous complete download has been kept.');
  }finally{saveInProgress.current=false;setSavingGuide(false);}
 }

 async function searchAddress(e:React.FormEvent){
  e.preventDefault();if(!search.trim())return;
  request.current?.abort();const seq=++searchSequence.current;const controller=new AbortController();request.current=controller;
  setBusy(true);setMessage('');setCandidates([]);const timer=setTimeout(()=>controller.abort(),12000);
  try{
   const params=new URLSearchParams({f:'json',SingleLine:search.trim(),countryCode:'USA',outFields:'Addr_type',maxLocations:'4',forStorage:'false'});
   const r=await fetch(`https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?${params}`,{signal:controller.signal});
   if(!r.ok)throw new Error('Address search is unavailable. Try device location or filter the directory.');
   const data=await r.json();if(data.error)throw new Error('Address search is unavailable. Try device location or filter the directory.');
   const valid=(data.candidates??[]).filter((c:Candidate)=>c.score>=70&&Number.isFinite(c.location.x)&&Number.isFinite(c.location.y));
   if(seq!==searchSequence.current)return;
   if(!valid.length){setMessage('No matching address found. Try adding a city and state.');return;}setCandidates(valid);
  }catch(e){if(seq===searchSequence.current)setMessage(e instanceof Error&&e.name==='AbortError'?'Search timed out. Try again or use device location.':e instanceof Error?e.message:'Search unavailable.');}
  finally{clearTimeout(timer);if(seq===searchSequence.current)setBusy(false);}
 }
 function chooseCandidate(c:Candidate){const next:Origin={lat:c.location.y,lng:c.location.x,label:c.address,kind:'search'};setOrigin(next);setMapCenter(next);setMobilePanel('map');setCandidates([]);setDirectorySearch('');setShowAll(false);setMessage(c.attributes?.Addr_type==='PointAddress'||c.attributes?.Addr_type==='StreetAddress'?'Distances are straight-line estimates.':'Using an approximate area center. Distances are estimates.');}
 function locate(){
  request.current?.abort();const seq=++searchSequence.current;setCandidates([]);
  if(!navigator.geolocation){setMessage('Location is unavailable in this browser. Enter an address instead.');return;}
  setBusy(true);setMessage('');navigator.geolocation.getCurrentPosition(p=>{if(seq!==searchSequence.current)return;const next:Origin={lat:p.coords.latitude,lng:p.coords.longitude,label:'Your current location',kind:'device',accuracy:p.coords.accuracy};setOrigin(next);setMapCenter(next);setMobilePanel('map');setBusy(false);setDirectorySearch('');setShowAll(false);setMessage(`Location accuracy: about ${Math.round(p.coords.accuracy)} m. Distances are straight-line estimates.`);},e=>{if(seq!==searchSequence.current)return;setBusy(false);setMessage(e.code===1?'Location permission was declined. You can still enter an address.':'We could not get your location. Try an address or ZIP code.');},{enableHighAccuracy:true,timeout:12000,maximumAge:60000});
 }
 function changeView(v:'find'|'learn'|'impact'){if(v!==view)hasNavigated.current=true;setView(v);window.scrollTo({top:0,behavior:'instant'});}
 function openLesson(i:number){setLesson(i);setAnswer(null);}
 function finishLesson(){if(lesson===null)return;const next=Array.from(new Set([...completed,lessons[lesson].id]));setCompleted(next);try{localStorage.setItem('ucn-lessons',JSON.stringify(next));}catch{}setLesson(null);}

 return <MotionConfig reducedMotion="user"><div className="app-shell">
  <a className="skip-link" href="#main">Skip to content</a>
  <header className="header"><button className="brand-button" onClick={()=>changeView('find')} aria-label="UCanNarcan home"><Brand/></button><nav className="desktop-nav" aria-label="Main navigation">{(['find','learn','impact'] as const).map(v=><button key={v} className={view===v?'active':''} aria-current={view===v?'page':undefined} onClick={()=>changeView(v)}>{view===v&&<motion.span className="nav-selection" layoutId="desktop-selection" transition={reduceMotion?{duration:0}:{type:'spring',stiffness:420,damping:34}}/>}<span className="nav-label">{v==='find'?'Find Narcan':v==='learn'?'Learn the basics':'The bigger picture'}</span></button>)}</nav><button className="emergency-fab" onClick={()=>changeEmergency(true)}><span><Heart size={17}/></span>Overdose help<ArrowUpRight size={16}/></button><ThemeToggle/><Button variant="outline" size="sm" onClick={()=>setInstall(true)} className="install-header"><Download size={17}/> Get the app</Button></header>
  {offline&&<div className="offline-banner" role="status"><WifiOff size={16}/> You’re offline. Saved guides are available; the map and address search need a connection.</div>}
  <motion.main id="main" key={view} initial={reduceMotion||!hasNavigated.current?false:{opacity:1,filter:'blur(4px)'}} animate={{opacity:1,filter:'blur(0px)'}} transition={settle}>
  {view==='find'&&<>
   <section className="intro"><div><motion.h1 className="page-title" {...headingMotion}>Find Narcan.<br/><span>Be there for someone.</span></motion.h1></div><motion.p className="intro-copy" {...copyMotion}>Free naloxone and support, closer than you think.<br className="desktop-break"/> Find a place. Make a plan. You can make a difference.</motion.p></section>
   <section className="locator" aria-label="Naloxone locator"><div className="finder-panel"><h2>Start where<br/> you are.</h2><p className="muted">A few seconds now could matter a lot later.</p><span className="region-badge"><MapPin size={12}/> Maryland coverage</span><form onSubmit={searchAddress} className="search-form"><label htmlFor="location-search">Where should we look?</label><div className="search-input-wrap"><Search size={18}/><input id="location-search" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Address, city, or ZIP code" autoComplete="street-address"/><button type="submit" aria-label="Search location" disabled={busy||!search.trim()}><ArrowRight size={19}/></button></div></form><Button onClick={locate} variant="outline" className="locate-button" disabled={busy}><LocateFixed size={17}/>{busy?'Searching…':'Use my location'}</Button><p className="privacy-note">No location history. Map tiles use OpenStreetMap; address search uses Esri.</p>
   {candidates.length>0&&<motion.div className="candidate-list" initial={reduceMotion?false:{y:8}} animate={{y:0}} transition={settle}><span className="candidate-prompt">Choose your location</span>{candidates.map((c,i)=><button key={i} onClick={()=>chooseCandidate(c)}><MapPin size={16}/><span>{c.address}</span><ChevronRight size={15}/></button>)}</motion.div>}
   {message&&<p className="search-message" role="status">{message}</p>}
   {origin&&<motion.div className="origin-card" key={`${origin.lat}:${origin.lng}`} initial={reduceMotion?false:{y:8}} animate={{y:0}} transition={settle}><LocateFixed size={18}/><div><strong>{origin.label}</strong><small>{origin.kind==='device'?'Device location':'Selected search location'}</small></div><button aria-label="Clear search location" onClick={()=>{request.current?.abort();searchSequence.current++;setBusy(false);setOrigin(null);setMapCenter(null);setMessage('');}}><X size={15}/></button></motion.div>}
   <div className="finder-bottom"><div className="mini-symbol"><ShieldCheck size={22}/></div><div><strong>No account. No judgment.</strong><p>Just a little help finding what you need.</p></div></div></div>
   <div className={`map-panel ${mobilePanel==='list'?'mobile-hide':''}`}>
    <div className="map-heading"><span><span className="status-dot"/> Maryland’s naloxone network</span><a href={sourceMapUrl} target="_blank" rel="noreferrer" aria-label="View source directory map" title="View source directory map"><ExternalLink size={17}/></a></div>
    <NearbyMap locations={results} origin={origin} center={mapCenter} revision={mapRevision} onSelect={setSelected}/>
    <div className="map-footnote"><span><i className="legend-dot fixed-site"/> Fixed sites <i className="legend-dot vending"/> Vending machines</span>{origin?<button onClick={()=>{setMapCenter({...origin});setMapRevision(v=>v+1);}}><LocateFixed size={14}/> {origin.kind==='device'?'Center on me':'Center on search'}</button>:<span>{results.length} mapped resources</span>}</div>
    <p className="map-origin-note">{origin?<><i className="legend-dot origin"/> {origin.kind==='device'?'Blue dot: your device location. The circle shows estimated accuracy.':'Blue dot: your selected search location, not live GPS.'}</>:'Choose a location to see your dot. Pins follow the directory filters.'} Tap a resource pin for details.</p>
   </div></section>
   <div className="mobile-switch" aria-label="Mobile map visibility"><button className={mobilePanel==='map'?'active':''} onClick={()=>setMobilePanel('map')}>Show map</button><button className={mobilePanel==='list'?'active':''} onClick={()=>setMobilePanel('list')}>List only</button></div>
   <section className="results-section" aria-labelledby="results-title"><div className="section-heading"><div><h2 id="results-title">{origin?'Closest to you.':'Explore the network.'}</h2></div><div className="results-meta">{results.length} {results.length===1?'location':'locations'}<span>•</span>{origin?'Straight-line distance':'Choose a location to sort by distance'}</div></div><div className="filters"><div className="filter-pills">{[['all','All locations'],['free','Free programs'],['vending','Vending machines'],['fixed','Fixed sites']].map(([v,label])=><motion.button key={v} whileTap={reduceMotion?undefined:{scale:.95}} className={filter===v?'selected':''} onClick={()=>{setFilter(v);setShowAll(false);}} aria-pressed={filter===v}>{filter===v&&<motion.span className="filter-selection" layoutId="filter-selection" transition={reduceMotion?{duration:0}:{type:'spring',stiffness:420,damping:34}}/>}<span className="filter-label"><Check size={13} style={{visibility:filter===v?'visible':'hidden'}}/>{label}</span></motion.button>)}</div><select aria-label="Sort locations" value={sort} onChange={e=>setSort(e.target.value)}><option value="nearest">Nearest first</option><option value="cost">Free / low cost first</option></select></div><div className="directory-search"><Search size={15}/><input aria-label="Filter directory by name, county or service" placeholder="Filter by name, county, or service…" value={directorySearch} onChange={e=>{setDirectorySearch(e.target.value);setShowAll(false);}}/></div>
   <p className="data-note">ORPs offer free naloxone through Maryland programs. Confirm access and supply before traveling. Machine costs and hours are shown only when listed.</p>
   {origin&&results[0]?.distance!==null&&(results[0]?.distance??0)>50&&<div className="notice">This directory covers Maryland. The nearest listed resource is over 50 miles away; it may not be your nearest naloxone provider.</div>}
   <div className="result-grid">{visible.map((l,i)=><motion.article key={l.id} className="location-card" layout={reduceMotion?false:"position"} initial={reduceMotion?false:{opacity:1,y:12}} animate={{opacity:1,y:0}} transition={reduceMotion?{duration:0}:{type:"spring",stiffness:300,damping:28,delay:Math.min(i,2)*.04}}><div className="card-top"><span className={`location-icon ${/vending/i.test(l.type)?'vending':'fixed-site'}`}>{/vending/i.test(l.type)?<Zap size={20}/>:<Store size={20}/>}</span><span className="cost-badge">{l.price===0?'Free':l.price!==null?`$${l.price.toFixed(2)}`:l.priceStatus==='program-free'?'Free program':'Cost not listed'}</span>{l.distance!==null&&<span className="distance">{l.distance<.1?'<0.1':l.distance.toFixed(1)} mi</span>}</div><span className="location-type">{l.type} · {l.county}</span><button className="card-title" onClick={()=>setSelected(l)}>{l.name}<ArrowUpRight size={17}/></button><p className="address">{l.address}</p><div className="hours"><Clock3 size={14}/><span>{l.hours||'Hours not listed · Call ahead'}</span></div><div className="card-actions"><Button variant="outline" size="sm" onClick={()=>{setSelected(l);setMapCenter(l);}}>View details <ArrowRight size={14}/></Button><a href={directionsUrl(l,origin)} target="_blank" rel="noreferrer" aria-label={`Directions to ${l.name}`}><Navigation size={17}/></a></div></motion.article>)}</div>
   {!results.length&&<div className="empty-state"><Search size={28}/><h3>No matching locations.</h3><p>Try a broader filter or a different county.</p><Button variant="outline" onClick={()=>{setFilter('all');setDirectorySearch('');}}>Clear filters</Button></div>}
   {results.length>3&&<button className="show-more" onClick={()=>setShowAll(!showAll)}>{showAll?'Show fewer locations':`See all ${results.length} locations`}<motion.span className="show-more-icon" animate={{rotate:showAll?180:0}} transition={settle}><ArrowDown size={16}/></motion.span></button>}<div className="source-line"><span>{dataStatus}. Availability is not live.</span><a href={sourceUrl} target="_blank" rel="noreferrer">About the source <ArrowUpRight size={12}/></a></div></section>
   <section className="learn-banner"><div className="banner-art" aria-hidden="true"><HeartHandshake size={78} strokeWidth={1.15}/></div><div><h2>You don’t have to be an expert.<br/>You just have to be there.</h2><p>Learn the signs. Learn the steps. Feel more prepared.</p></div><Button onClick={()=>changeView('learn')}>Learn the basics <ArrowUpRight size={17}/></Button></section>
  </>}
  {view==='learn'&&<section className="secondary-page"><motion.h1 className="page-title" {...headingMotion}>You can make<br/><span>a difference.</span></motion.h1><motion.p className="page-intro" {...copyMotion}>Small lessons. Useful skills. A little more confidence when it matters.</motion.p><motion.div className="learning-summary" {...copyMotion}><BookOpen size={20}/><span>{completed.length} of 3 lessons completed</span><div className="progress-track"><motion.span initial={false} animate={{scaleX:completed.length/3}} style={{transformOrigin:"left",width:"100%"}} transition={learningSpring}/></div></motion.div><div className="lesson-grid">{lessons.map((l,i)=><motion.button key={l.id} initial={reduceMotion?false:{opacity:1,y:24,scale:.97}} animate={{opacity:1,y:0,scale:1,transition:reduceMotion?{duration:0}:{...learningSpring,delay:i*.08}}} whileHover={reduceMotion?undefined:{scale:1.02}} whileTap={reduceMotion?undefined:{scale:.95}} transition={learningSpring} className={`lesson-card ${l.color}`} onClick={()=>openLesson(i)}><div className="lesson-status">{completed.includes(l.id)?<CheckCircle2/>:<ArrowUpRight/>}</div>{i===0?<Search size={54} strokeWidth={1.2}/>:i===1?<Heart size={54} strokeWidth={1.2}/>:<HeartHandshake size={54} strokeWidth={1.2}/>}<h2>{l.title}</h2><p>{l.subtitle}</p><span className="lesson-time"><Clock3 size={14}/>{l.minutes} min · Interactive lesson</span></motion.button>)}</div><div className="learning-footer"><ShieldCheck size={26}/><div><h3>Practice now. Keep the guide close.</h3><p>These lessons are educational, not a training certification. In an emergency, open the quick guide or call 911.</p></div><Button variant="outline" onClick={()=>changeEmergency(true)}>Open quick guide <ArrowRight size={16}/></Button></div><Sources/></section>}
  {view==='impact'&&<section className="secondary-page"><motion.h1 className="page-title" {...headingMotion}>Every number<br/><span>is a person.</span></motion.h1><motion.p className="page-intro" {...copyMotion}>Understanding the scale helps us show up for each other.</motion.p><div className="stat-grid"><motion.article className="stat-card dark" initial={reduceMotion?false:{y:20}} animate={{y:0}} transition={learningSpring}><span>U.S. drug overdose deaths</span><strong><AnimatedNumber text={stats.total.toLocaleString()}/></strong><p>Predicted provisional count · 12 months ending {stats.period}</p></motion.article><motion.article className="stat-card mint" initial={reduceMotion?false:{y:20}} animate={{y:0}} transition={learningSpring}><span>U.S. opioid-involved deaths</span><strong>{stats.opioids!==null?<AnimatedNumber text={stats.opioids.toLocaleString()}/>:'Unavailable'}</strong><p>A subset of overdose deaths · Same reporting period</p></motion.article><motion.article className="stat-card cream" initial={reduceMotion?false:{y:20}} animate={{y:0}} transition={learningSpring}><span>Naloxone prescriptions dispensed</span><strong><AnimatedNumber text="1.9M+"/></strong><p>U.S. retail pharmacies · 2024<br/>Excludes over-the-counter sales.</p></motion.article></div><ImpactChart series={stats.series}/><div className="stats-notes"><Info size={20}/><p>Prescriptions dispensed do not measure doses administered or lives saved. Drug categories can overlap. {statsStatus}.</p></div><div className="source-links"><a href="https://www.cdc.gov/nchs/nvss/vsrr/drug-overdose-data.htm" target="_blank" rel="noreferrer">CDC/NCHS overdose data <ArrowUpRight size={14}/></a><a href="https://www.cdc.gov/overdose-prevention/data-research/facts-stats/naloxone-dispensing-rate-maps.html" target="_blank" rel="noreferrer">CDC dispensing data <ArrowUpRight size={14}/></a></div></section>}
  </motion.main>
  <footer className="footer"><Brand/><p>A little more prepared. A little more connected.</p><button onClick={()=>setAbout(true)}>About & privacy <ArrowUpRight size={13}/></button></footer>
  <nav className="mobile-nav" aria-label="Mobile navigation">{(['find','learn'] as const).map(v=><button key={v} className={view===v?'active':''} aria-current={view===v?'page':undefined} onClick={()=>changeView(v)}>{view===v&&<motion.span className="dock-selection" layoutId="dock-selection" transition={reduceMotion?{duration:0}:{type:'spring',stiffness:420,damping:34}}/>}{v==='find'?<MapPin size={22}/>:<BookOpen size={22}/>}<span>{v==='find'?'Find':'Learn'}</span></button>)}<button className="dock-help" onClick={()=>changeEmergency(true)} aria-label="Overdose help"><span className="dock-help-icon"><Heart size={23} strokeWidth={2.5}/></span><span>Overdose</span></button><button className={view==='impact'?'active':''} aria-current={view==='impact'?'page':undefined} onClick={()=>changeView('impact')}>{view==='impact'&&<motion.span className="dock-selection" layoutId="dock-selection" transition={reduceMotion?{duration:0}:{type:'spring',stiffness:420,damping:34}}/>}<TrendingDown size={22}/><span>Impact</span></button></nav>
  

  <Dialog open={!!selected} onOpenChange={open=>{if(!open)setSelected(null);}}><DialogContent>{selected&&<><DialogTitle className="dialog-title">{selected.name}</DialogTitle><DialogDescription className="dialog-description">{selected.address}</DialogDescription><div className="detail-actions"><Button asChild><a href={directionsUrl(selected,origin)} target="_blank" rel="noreferrer"><Navigation size={17}/> Get directions</a></Button>{phoneHref(selected.phone)&&<Button variant="outline" asChild><a href={phoneHref(selected.phone)!}><Phone size={16}/> Call</a></Button>}</div><div className="detail-row"><Clock3 size={19}/><div><strong>Hours & access</strong><p>{selected.hours||'Hours have not been provided. Call before visiting.'}</p></div></div><div className="detail-row"><ShieldCheck size={19}/><div><strong>{selected.priceStatus==='program-free'?'Free naloxone program':'Price not provided'}</strong><p>{selected.priceStatus==='program-free'?'Maryland ORPs offer free naloxone. Confirm supply and any access requirements with this location.':'The source map does not list this location’s price. Confirm with the operator.'} Stock is not tracked live.</p></div></div><h3 className="detail-subtitle">What you can find here</h3><div className="service-tags">{selected.services.map(s=><span key={s}>{s}</span>)}</div>{selected.referrals&&<><h3 className="detail-subtitle">Off-site & referral services</h3><p className="muted">{selected.referrals}</p></>}{selected.contactName&&<div className="detail-contact"><strong>Program contact</strong><p>{selected.contactName}</p><p>{selected.phone}</p>{selected.contactEmail.split(/[,;]/).map(e=>e.trim()).filter(e=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)).map(e=><a key={e} href={`mailto:${e}`}>{e}</a>)}</div>}{safeWebsite(selected.website)&&<a className="text-link" href={safeWebsite(selected.website)!} target="_blank" rel="noreferrer">Visit organization website <ExternalLink size={14}/></a>}<p className="detail-source">Source: Maryland ORP map dated October 1, 2026. <a href={selected.source} target="_blank" rel="noreferrer">View source map.</a></p></>}</DialogContent></Dialog>
  <Dialog open={emergency} onOpenChange={changeEmergency}><DialogContent className="emergency-dialog">
   <DialogTitle className="dialog-title">Suspected overdose?</DialogTitle>
   <DialogDescription className="dialog-description">Give naloxone if available and get emergency help immediately.</DialogDescription>
   <a className="call-911" href="tel:911" onClick={stopAudio}><Phone size={22}/><strong>Call 911</strong><span>Put your phone on speaker</span><ArrowUpRight size={21}/></a>
   <div className="step-tabs" aria-label="Emergency steps"><div className="step-track" aria-hidden="true"><motion.span className="step-progress" initial={false} animate={{scaleX:step/3}} style={{"--step-progress":step/3} as React.CSSProperties} transition={reduceMotion?{duration:0}:{type:"spring",stiffness:300,damping:28}}/></div>{emergencySteps.map((s,i)=><button className={step===i?'active':step>i?'past':''} aria-current={step===i?'step':undefined} aria-label={`Step ${i+1}: ${s.short}`} aria-pressed={step===i} key={s.id} onClick={()=>changeStep(i)}>{i+1}</button>)}</div>
   <div className="emergency-step">
    <h2 id="emergency-step-title">{emergencySteps[step].title}</h2>
    {audioError&&<div className="audio-error" role="alert"><p>Audio couldn’t play. Read the instructions below or retry.</p><Button variant="outline" size="sm" onClick={()=>void playAudio({restart:true,retry:true})}>Retry audio</Button></div>}
    <p>{emergencySteps[step].text}</p>
    <div className="audio-label" id="emergency-audio-label"><Volume2 size={17}/>Listen to this step</div>
    <audio ref={audioRef} key={emergencySteps[step].id} hidden preload="metadata" muted={audioMuted} src={emergencySteps[step].audioUrl}
     onLoadedMetadata={e=>{if(e.currentTarget===audioRef.current)setAudioDuration(Number.isFinite(e.currentTarget.duration)?e.currentTarget.duration:0);}}
     onDurationChange={e=>{if(e.currentTarget===audioRef.current)setAudioDuration(Number.isFinite(e.currentTarget.duration)?e.currentTarget.duration:0);}}
     onTimeUpdate={e=>{if(e.currentTarget===audioRef.current)setAudioPosition(e.currentTarget.currentTime);}}
     onVolumeChange={e=>{if(e.currentTarget===audioRef.current)setAudioMuted(e.currentTarget.muted);}}
     onWaiting={e=>{if(e.currentTarget===audioRef.current&&!e.currentTarget.paused)setAudioLoading(true);}} onCanPlay={e=>{if(e.currentTarget===audioRef.current)setAudioLoading(false);}}
     onPlay={e=>{if(e.currentTarget===audioRef.current){setAudioPlaying(true);setAudioLoading(e.currentTarget.readyState<3);}}} onPause={e=>{if(e.currentTarget===audioRef.current){setAudioPlaying(false);setAudioLoading(false);}}}
     onEnded={e=>{if(e.currentTarget===audioRef.current){setAudioPlaying(false);setAudioLoading(false);}}}
     onError={e=>{if(e.currentTarget===audioRef.current){setAudioError(true);setAudioLoading(false);setAudioPlaying(false);}}}>
     Your browser does not support audio. The complete instructions are above.
    </audio>
    <div className="guide-player" role="group" aria-labelledby="emergency-audio-label emergency-step-title">
     <div className="player-controls">
      <button className="player-toggle" onClick={()=>{const audio=audioRef.current;if(!audio)return;if(audio.paused)void playAudio();else audio.pause();}} aria-label={audioPlaying?'Pause step audio':'Play step audio'}>{audioPlaying?<Pause size={18} fill="currentColor" aria-hidden="true"/>:<Play size={18} fill="currentColor" aria-hidden="true"/>}{audioPlaying?'Pause':'Play'}</button>
      <span className="player-time" aria-hidden="true">{audioTime(audioPosition)} <span>/ {audioDuration?audioTime(audioDuration):'--:--'}</span></span>
      <button className="player-mute" aria-label={audioMuted?'Unmute step audio':'Mute step audio'} aria-pressed={audioMuted} onClick={()=>{const audio=audioRef.current;if(audio)audio.muted=!audio.muted;}}>{audioMuted?<VolumeX size={20} aria-hidden="true"/>:<Volume2 size={20} aria-hidden="true"/>}</button>
     </div>
     <input className="player-seek" type="range" min={0} max={audioDuration||1} step={.1} value={Math.min(audioPosition,audioDuration||0)} disabled={!audioDuration||audioError} aria-label="Seek step audio" aria-valuetext={`${audioTime(audioPosition)} of ${audioDuration?audioTime(audioDuration):'unknown duration'}`} style={{'--audio-progress':`${audioDuration?Math.min(audioPosition/audioDuration*100,100):0}%`} as CSSProperties} onChange={e=>{const audio=audioRef.current;if(audio){audio.currentTime=Number(e.target.value);setAudioPosition(audio.currentTime);}}}/>
    </div>
    <div className="audio-actions"><Button variant="outline" size="sm" onClick={()=>void playAudio({restart:true})}><RotateCcw size={16}/>Replay step</Button><span className="audio-status" role="status">{audioLoading&&!audioError?'Loading audio…':''}</span></div>
   </div>
   <div className="step-context" role="status">Step {step+1} of 4 · {emergencySteps[step].short}</div>
   <div className="step-navigation"><Button variant="outline" disabled={step===0} onClick={()=>changeStep(step-1)}><ChevronLeft size={16}/> Back</Button><Button disabled={step===3} onClick={()=>changeStep(step+1)}>Next step <ChevronRight size={16}/></Button></div>
   <p className="emergency-note">Do not leave the person alone to look for naloxone. These steps cover Narcan 4 mg nasal spray; follow your product’s instructions.</p>
   <button className="text-link" disabled={savingGuide||audioPlaying} onClick={checkOffline}>{offlineReady?<CheckCircle2 size={16}/>:<Download size={16}/>} {savingGuide?'Saving guide & audio…':'Save guide & audio'}</button>
   {offlineReady&&<p className="guide-readiness" role="status"><CheckCircle2 size={16}/>Saved on this device · All four audio steps</p>}
   {audioPlaying&&<p className="audio-status">Pause audio before saving the guide.</p>}
   {guideMessage&&<p className="search-message" role="status">{guideMessage}</p>}
   <Sources/>
  </DialogContent></Dialog>
  <Dialog open={lesson!==null} onOpenChange={open=>{if(!open)setLesson(null);}}><DialogContent className="lesson-dialog">{lesson!==null&&<><DialogTitle className="dialog-title">{lessons[lesson].title}</DialogTitle><DialogDescription className="dialog-description">{lessons[lesson].subtitle}</DialogDescription><p className="lesson-body">{lessons[lesson].body}</p><div className="quiz"><h3>{lessons[lesson].question}</h3>{lessons[lesson].answers.map((a,i)=><button key={a} className={answer===i?(i===lessons[lesson].correct?'correct':'incorrect'):''} onClick={()=>setAnswer(i)}><span>{String.fromCharCode(65+i)}</span>{a}{answer===i&&(i===lessons[lesson].correct?<Check size={17}/>:<X size={17}/>)}</button>)}</div>{answer!==null&&<motion.div key={answer} initial={reduceMotion?false:{y:6}} animate={{y:0}} transition={settle} className={`quiz-feedback ${answer===lessons[lesson].correct?'success':''}`} role="status"><strong>{answer===lessons[lesson].correct?'That’s right.':'Let’s try that again.'}</strong><p>{lessons[lesson].explanation}</p></motion.div>}<Button className="lesson-complete" disabled={answer!==lessons[lesson].correct} onClick={finishLesson}>Complete lesson <Check size={16}/></Button><Sources/></>}</DialogContent></Dialog>
  <Dialog open={install} onOpenChange={setInstall}><DialogContent><DialogTitle className="dialog-title">Keep UCanNarcan close.</DialogTitle><DialogDescription className="dialog-description">Add it to your home screen for quick access. No account needed.</DialogDescription>{installEvent?<Button onClick={async()=>{await installEvent.prompt();const choice=await installEvent.userChoice;if(choice.outcome==='accepted')setInstall(false);setInstallEvent(null);}}>Install UCanNarcan <Download size={17}/></Button>:<div className="install-steps"><h3>On iPhone or iPad</h3><p>Open this page in Safari. Tap Share, then Add to Home Screen.</p><h3>On Android</h3><p>Open in Chrome. Use the browser menu and choose Install app or Add to Home screen.</p></div>}<div className="notice">Open the emergency guide and save its audio while online. Offline maps and live address search are not available.</div></DialogContent></Dialog>
  <Dialog open={about} onOpenChange={setAbout}><DialogContent><DialogTitle className="dialog-title">A little more prepared.</DialogTitle><DialogDescription className="dialog-description">UCanNarcan connects people with naloxone resources and practical education.</DialogDescription><h3>Where the locations come from</h3><p className="lesson-body">This directory uses the Maryland ORP map dated October 1, 2026, with {locations.length} resources. It is not a live stock feed. The interactive map uses this directory snapshot and shows your selected location. Pins follow your filters; tap a pin to read provider details.</p><h3>Your privacy</h3><p className="lesson-body">No account or location history is required. Device coordinates stay in the current session. Google receives coordinates when you open directions; OpenStreetMap receives tile requests for the viewed area. Address searches go to Esri. Learning progress and downloaded guides stay on your device. External providers may use their own cookies and logs.</p><h3>Content & corrections</h3><p className="lesson-body">Educational content is based on CDC and product-label sources. This initial version still needs independent clinical review before a public launch. Please confirm location access directly with the program.</p><div className="source-links"><a href={sourceUrl} target="_blank" rel="noreferrer">Maryland directory <ExternalLink size={14}/></a><a href="https://stopoverdose.maryland.gov/naloxone/" target="_blank" rel="noreferrer">Maryland free naloxone programs <ExternalLink size={14}/></a></div><Sources/></DialogContent></Dialog>
 </div></MotionConfig>;
}
function Sources(){return <div className="medical-sources"><span>Sources · Content checked October 10, 2026</span>{medicalSources.map(s=><a key={s.name} href={s.url} target="_blank" rel="noreferrer">{s.name} <ArrowUpRight size={12}/></a>)}</div>;}
