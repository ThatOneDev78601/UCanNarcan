import fs from 'node:fs/promises';
const response=await fetch("https://data.cdc.gov/resource/xkb8-kh2a.json?state=US&$where=year%20%3E%3D%20%272025%27&$limit=5000");
if(!response.ok)throw new Error(`CDC returned ${response.status}; previous snapshot retained.`);
const rows=await response.json();if(!Array.isArray(rows)||!rows.some(r=>r.indicator==='Number of Drug Overdose Deaths'&&Number(r.predicted_value)>0))throw new Error('CDC schema changed; previous snapshot retained.');
await fs.writeFile('src/data/stats.json',JSON.stringify({retrievedAt:new Date().toISOString(),rows},null,2));console.log(`Saved ${rows.length} CDC rows.`);
