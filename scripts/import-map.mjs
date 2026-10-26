import fs from 'node:fs/promises';
import { XMLParser } from 'fast-xml-parser';
const mid = '1Oc8m4uYRvpJmIKdtG-73GUFLcTQuPmpa';
const local = process.argv.includes('--local');
const kml = local ? await fs.readFile('../maryland-orps.kml','utf8') : await (await fetch(`https://www.google.com/maps/d/kml?mid=${mid}&forcekml=1`)).text();
const html = local ? await fs.readFile('../maryland-map.html','utf8') : await (await fetch(`https://www.google.com/maps/d/embed?mid=${mid}`)).text();
const match = html.match(/var _pageData = (".*?");/);
if (!match) throw new Error('Map format changed; retaining previous snapshot.');
const page = JSON.parse(JSON.parse(match[1]));
const pins = new Map();
function walk(v) {
  if (!Array.isArray(v)) return;
  const name=v[5]?.[0]?.[0], coords=v[4]?.[4];
  if (typeof name==='string' && Array.isArray(coords) && coords.length===2 && coords.every(Number.isFinite)) {const values=pins.get(name)||[];values.push({lat:coords[0],lng:coords[1],mapId:v[4][6]});pins.set(name,values);}
  v.forEach(walk);
}
walk(page);
for(const values of pins.values())values.sort((a,b)=>a.mapId.localeCompare(b.mapId));
const doc=new XMLParser({ignoreAttributes:false,attributeNamePrefix:'@'}).parse(kml).kml.Document;
const places=[doc.Folder].flat().flatMap(f=>[f.Placemark].flat());
const locations=places.map(p=>{
 const fields=Object.fromEntries([p.ExtendedData.Data].flat().map(d=>[d['@name'],String(d.value??'').replace(/\u0096/g,'–').replace(/[\u0080-\u009f]/g,'')]));
 const point=pins.get(p.name)?.shift();
 if (!point) throw new Error(`Missing map coordinates: ${p.name}`);
 point.coordinateStatus=point.lat<37.85||point.lat>39.73||point.lng< -79.6||point.lng> -75?'review':'source';
 return {id:point.mapId,name:p.name,address:fields['Full Address'],type:fields['Location Type'],hours:fields.Hours||null,phone:fields['Primary Contact Phone'],website:fields.Website,county:fields.County,services:fields['On-Site Services'].split(',').map(s=>s.trim()).filter(Boolean),referrals:fields['Off-Site and Referral Services'],contactName:fields['Training Director Name'],contactEmail:fields['Training Director Email'],...point,price:null,priceStatus:'program-free',stock:'unknown',published:true,sourceDate:'2026-10-01',source:`https://www.google.com/maps/d/viewer?mid=${mid}`};
});
locations.forEach((l,i)=>{if(parseInt(l.mapId.slice(-6),16)!==i+1)throw new Error('Map row order changed; manual reconciliation required.');if(/vending/i.test(l.type)||l.type==='Approximate')l.priceStatus='unknown';});
if (locations.length<100 || new Set(locations.map(l=>l.id)).size!==locations.length) throw new Error('Unexpected record count or duplicate IDs.');
await fs.mkdir('src/data',{recursive:true});
await fs.writeFile('src/data/locations.json',JSON.stringify({title:doc.name,sourceDate:'2026-10-01',retrievedAt:new Date().toISOString(),locations},null,2));
console.log(JSON.stringify({locations:locations.length,vending:locations.filter(l=>/vending/i.test(l.type)).length,withHours:locations.filter(l=>l.hours).length}));
