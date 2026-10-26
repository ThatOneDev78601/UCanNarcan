export type Coordinates={lat:number;lng:number};
export type Location=Coordinates & {id:string;name:string;address:string;type:string;hours:string|null;phone:string;website:string;county:string;services:string[];referrals:string;contactName:string;contactEmail:string;mapId:string;price:number|null;priceStatus:string;stock:string;sourceDate:string;source:string;published:boolean;coordinateStatus?:string};
export function distanceMiles(a:Coordinates,b:Coordinates){const r=Math.PI/180;const dlat=(b.lat-a.lat)*r,dlng=(b.lng-a.lng)*r;const h=Math.sin(dlat/2)**2+Math.cos(a.lat*r)*Math.cos(b.lat*r)*Math.sin(dlng/2)**2;return 3958.7613*2*Math.atan2(Math.sqrt(h),Math.sqrt(Math.max(0,1-h)));}
export function rankLocations(locations:Location[],origin:Coordinates|null,filter='all',query='',sort='nearest'){
 const q=query.trim().toLowerCase();
 const seen=new Set<string>();
 const cost=(l:Location)=>l.price??(l.priceStatus==='program-free'?0:Infinity);
 return locations.filter(l=>{
  if(origin&&l.type==='Approximate')return false;
  const key=`${l.name}|${l.address}|${l.type}`.toLowerCase();
  if(seen.has(key))return false;
  seen.add(key);
  if(!l.published||l.coordinateStatus==='review')return false;
  if(filter==='vending'&&!/vending/i.test(l.type))return false;
  if(filter==='fixed'&&!/fixed/i.test(l.type))return false;
  if(filter==='free'&&l.price!==0&&l.priceStatus!=='program-free')return false;
  return !q||`${l.name} ${l.address} ${l.county} ${l.services.join(' ')}`.toLowerCase().includes(q);
 }).map(l=>({...l,distance:origin?distanceMiles(origin,l):null})).sort((a,b)=>{
  const availability=Number(a.stock==='out')-Number(b.stock==='out');
  if(availability)return availability;
  // Price preference applies inside 25-mile bands so distant free sites do not displace local options.
  if(sort==='cost' && origin){
   const band=Math.floor((a.distance??0)/25)-Math.floor((b.distance??0)/25);
   if(band)return band;
   if(cost(a)!==cost(b))return cost(a)-cost(b);
  }
  return origin?(a.distance??Infinity)-(b.distance??Infinity):a.name.localeCompare(b.name);
 });
}
export function safeWebsite(url:string){try{const u=new URL(url.startsWith('www.')?`https://${url}`:url);return ['http:','https:'].includes(u.protocol)?u.href:null;}catch{return null;}}
export function directionsUrl(location:Coordinates,origin?:Coordinates|null){const p=new URLSearchParams({api:'1',destination:`${location.lat},${location.lng}`});if(origin)p.set('origin',`${origin.lat},${origin.lng}`);return `https://www.google.com/maps/dir/?${p}`;}
export function phoneHref(phone:string){const match=phone.match(/(?:\+?1[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/);return match?`tel:${match[0].replace(/[^\d+]/g,'')}`:null;}
