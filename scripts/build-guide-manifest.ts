import {createHash} from 'node:crypto';
import {readFile,writeFile,readdir} from 'node:fs/promises';
import {emergencyGuideVersion,emergencySteps} from '../src/data/content';
async function files(dir:string):Promise<string[]>{
 const entries=await readdir(dir,{withFileTypes:true});
 return (await Promise.all(entries.map(e=>e.isDirectory()?files(`${dir}/${e.name}`):[`${dir}/${e.name}`]))).flat();
}
async function main(){
 const shell=(await files('out/_next/static')).filter(p=>/\.(js|css|woff2?)$/.test(p));
 const urls=['/',...shell.map(p=>p.slice(3)), '/icon-192.png','/icon-512.png','/manifest.webmanifest',...emergencySteps.map(s=>s.audioUrl)];
 const assets=await Promise.all(urls.map(async url=>({url,sha256:createHash('sha256').update(await readFile(url==='/'?'out/index.html':`out${url}`)).digest('hex')})));
 const buildId=createHash('sha256').update(JSON.stringify(assets)).digest('hex').slice(0,16);
 await writeFile('out/offline-guide.json',JSON.stringify({guideVersion:emergencyGuideVersion,buildId,assets}));
 console.log(`Offline guide manifest: ${assets.length} verified assets (${buildId})`);
}
main().catch(error=>{console.error(error);process.exitCode=1;});
