import type { MetadataRoute } from 'next';
export const dynamic='force-static';
export default function manifest():MetadataRoute.Manifest{return {name:'UCanNarcan',short_name:'UCanNarcan',description:'Find naloxone. Be there for someone.',start_url:'/',display:'standalone',background_color:'#f4f4f4',theme_color:'#f4f4f4',icons:[{src:'/icon-192.png',sizes:'192x192',type:'image/png',purpose:'any'},{src:'/icon-512.png',sizes:'512x512',type:'image/png',purpose:'maskable'}]};}
