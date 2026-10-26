import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import type { Location } from './locations';
const config={apiKey:process.env.NEXT_PUBLIC_FIREBASE_API_KEY,authDomain:process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,projectId:process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,storageBucket:process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,messagingSenderId:process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,appId:process.env.NEXT_PUBLIC_FIREBASE_APP_ID};
export const firebaseConfigured=Boolean(config.apiKey&&config.projectId&&config.appId);
export async function loadPublishedLocations():Promise<Location[]|null>{
 if(!firebaseConfigured)return null;
 const app=getApps()[0]??initializeApp(config);
 const snapshot=await getDocs(query(collection(getFirestore(app),'locations'),where('published','==',true)));
 const records=snapshot.docs.map(d=>({...d.data(),id:d.id})) as Location[];
 if(!records.length||records.some(l=>!l.name||!l.address||!Array.isArray(l.services)||!Number.isFinite(l.lat)||!Number.isFinite(l.lng)))throw new Error('Invalid location response');
 return records;
}
