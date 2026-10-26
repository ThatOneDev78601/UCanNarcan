import sharp from 'sharp';
import fs from 'node:fs/promises';
import {emergencySteps} from '../src/data/content';
async function main(){
await fs.mkdir('public/audio',{recursive:true});
await fs.mkdir('.tmp',{recursive:true});
const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><rect width="512" height="512" rx="112" fill="#080808"/><path d="M256 356C232 336 150 278 150 224c0-64 78-77 106-26 28-51 106-38 106 26 0 54-82 112-106 132Z" fill="#ffffff"/></svg>`;
for(const size of [192,512])await sharp(Buffer.from(svg)).resize(size,size).png().toFile(`public/icon-${size}.png`);
await fs.writeFile('.tmp/audio-text.json',JSON.stringify(emergencySteps.map(s=>({id:s.id,version:s.guideVersion,text:s.narration}))));
}
main().catch(error=>{console.error(error);process.exitCode=1;});
