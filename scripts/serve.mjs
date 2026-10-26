import {createServer} from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
const root=resolve('out');
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.webmanifest':'application/manifest+json','.png':'image/png','.svg':'image/svg+xml','.mp3':'audio/mpeg','.woff2':'font/woff2','.txt':'text/plain; charset=utf-8'};
createServer(async(req,res)=>{try{
 const url=new URL(req.url,'http://127.0.0.1');let path=resolve(root,'.'+decodeURIComponent(url.pathname));
 if(path!==root&&!path.startsWith(root+sep)){res.writeHead(403);res.end();return;}
 try{if((await stat(path)).isDirectory())path=resolve(path,'index.html');}catch{path+='.html';}
 const body=await readFile(path);
 const headers={'Content-Type':mime[extname(path)]||'application/octet-stream','Cache-Control':'no-cache','Content-Length':body.length};
 // The preview must serve real byte ranges so the native audio engine can seek online.
 if(extname(path)==='.mp3'){
  headers['Accept-Ranges']='bytes';
  const range=/^bytes=(\d*)-(\d*)$/.exec(req.headers.range||'');
  if(range&&(range[1]||range[2])){
   const start=range[1]?Number(range[1]):Math.max(0,body.length-Number(range[2]));
   const end=range[1]&&range[2]?Math.min(Number(range[2]),body.length-1):body.length-1;
   if(start>end||start>=body.length){res.writeHead(416,{'Content-Range':`bytes */${body.length}`});res.end();return;}
   res.writeHead(206,{...headers,'Content-Range':`bytes ${start}-${end}/${body.length}`,'Content-Length':end-start+1});
   res.end(req.method==='HEAD'?undefined:body.subarray(start,end+1));return;
  }
 }
 res.writeHead(200,headers);res.end(req.method==='HEAD'?undefined:body);
}catch{res.writeHead(404);res.end('Not found');}}).listen(3001,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:3001'));
