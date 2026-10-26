'use client';

import { useEffect, useRef, useState } from 'react';
import * as L from 'leaflet';
import type { Coordinates, Location } from '@/lib/locations';

type MapOrigin=Coordinates & {label:string;kind:'device'|'search';accuracy?:number};
type Props={locations:Location[];origin:MapOrigin|null;center:Coordinates|null;revision:number;onSelect:(location:Location)=>void};

export default function NearbyMap({locations,origin,center,revision,onSelect}:Props){
 const container=useRef<HTMLDivElement>(null);
 const map=useRef<L.Map|null>(null);
 const tiles=useRef<L.TileLayer|null>(null);
 const select=useRef(onSelect);select.current=onSelect;
 const [tileError,setTileError]=useState(false);

 useEffect(()=>{
  if(!container.current)return;
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const instance=L.map(container.current,{scrollWheelZoom:false,zoomAnimation:!reduce,fadeAnimation:!reduce,markerZoomAnimation:!reduce}).setView([39.05,-76.7],7);
  map.current=instance;
  tiles.current=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors'}).on('tileerror',()=>setTileError(true)).on('load',()=>{const broken=container.current?.querySelector('img.leaflet-tile:not(.leaflet-tile-loaded)');if(!broken)setTileError(false);}).addTo(instance);
  const resize=new ResizeObserver(()=>instance.invalidateSize({animate:false}));resize.observe(container.current);
  return()=>{resize.disconnect();instance.remove();map.current=null;tiles.current=null;};
 },[]);

 useEffect(()=>{
  const instance=map.current;if(!instance)return;
  const pins=L.layerGroup().addTo(instance);
  for(const location of locations){
   if(!Number.isFinite(location.lat)||!Number.isFinite(location.lng))continue;
   const vending=/vending/i.test(location.type);
   const marker=L.marker([location.lat,location.lng],{icon:L.divIcon({className:`resource-pin ${vending?'vending':'fixed-site'}`,html:'<span aria-hidden="true"></span>',iconSize:[44,44],iconAnchor:[22,22]}),title:`${location.name} · ${location.type}`,alt:location.name}).on('click',()=>select.current(location)).addTo(pins);
   const element=marker.getElement();
   element?.setAttribute('aria-label',`View details for ${location.name}`);
   element?.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();event.stopPropagation();select.current(location);}});
  }
  return()=>{pins.remove();};
 },[locations]);

 useEffect(()=>{
  const instance=map.current;if(!instance||!origin)return;
  const layer=L.layerGroup().addTo(instance);
  if(origin.kind==='device'&&Number.isFinite(origin.accuracy)&&(origin.accuracy??0)>0){L.circle([origin.lat,origin.lng],{radius:origin.accuracy,color:'#2463eb',weight:1,fillOpacity:.1,interactive:false}).addTo(layer);}
  const label=origin.kind==='device'?'Your current location':'Selected search location';
  const marker=L.marker([origin.lat,origin.lng],{icon:L.divIcon({className:'origin-pin',html:'<span aria-hidden="true"></span>',iconSize:[44,44],iconAnchor:[22,22]}),title:label,zIndexOffset:2000}).addTo(layer);
  marker.getElement()?.setAttribute('aria-label',label);
  const content=document.createElement('span');content.textContent=origin.kind==='device'?`${label} · accuracy about ${Math.round(origin.accuracy??0)} m`:origin.label;
  marker.bindTooltip(content,{permanent:true,direction:'top',offset:[0,-10],className:'origin-tooltip'});
  return()=>{layer.remove();};
 },[origin]);

 useEffect(()=>{const instance=map.current;if(!instance)return;const target=center??origin;instance.setView(target?[target.lat,target.lng]:[39.05,-76.7],target?12:7,{animate:false});},[center,origin,revision]);

 return <div className="nearby-map-wrap"><div ref={container} className="nearby-map" role="region" aria-label="Nearby naloxone map. Use arrow keys to pan and plus or minus to zoom. Location details are also available in the list below."/>{tileError&&<div className="map-load-error" role="status"><p>Map tiles couldn’t load. Use the location list, or reconnect and retry.</p><button onClick={()=>{setTileError(false);tiles.current?.redraw();}}>Retry map</button></div>}</div>;
}
