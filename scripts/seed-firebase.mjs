import {initializeApp,applicationDefault} from 'firebase-admin/app';
import {getFirestore} from 'firebase-admin/firestore';
import fs from 'node:fs/promises';
const projectId=process.env.FIREBASE_PROJECT_ID;
if(!projectId)throw new Error('Set FIREBASE_PROJECT_ID and use Application Default Credentials. Never put a service-account key in source.');
initializeApp({credential:applicationDefault(),projectId});
const db=getFirestore(); const {locations}=JSON.parse(await fs.readFile('src/data/locations.json','utf8'));
const batch=db.batch();for(const l of locations)batch.set(db.collection('locations').doc(l.id),l,{merge:true});await batch.commit();console.log(`Imported ${locations.length} records to ${projectId}.`);
