'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

export function ThemeToggle() {
 const reduceMotion=useReducedMotion();
 const [dark,setDark]=useState(false);
 useEffect(()=>{
  const media=window.matchMedia('(prefers-color-scheme: dark)');
  const sync=()=>setDark(document.documentElement.dataset.theme==='dark');
  const system=()=>{let saved=null;try{saved=localStorage.getItem('ucn-theme');}catch{} if(saved!=='light'&&saved!=='dark'){document.documentElement.dataset.theme=media.matches?'dark':'light';sync();}};
  const storage=()=>{let saved=null;try{saved=localStorage.getItem('ucn-theme');}catch{} document.documentElement.dataset.theme=saved==='light'||saved==='dark'?saved:media.matches?'dark':'light';sync();};
  sync();media.addEventListener('change',system);window.addEventListener('storage',storage);
  return()=>{media.removeEventListener('change',system);window.removeEventListener('storage',storage);};
 },[]);
 function toggle(){const next=dark?'light':'dark';document.documentElement.dataset.theme=next;setDark(!dark);try{localStorage.setItem('ucn-theme',next);}catch{}}
 return <motion.button className="theme-toggle" whileTap={reduceMotion?undefined:{scale:.95}} onClick={toggle} aria-label={dark?'Switch to light mode':'Switch to dark mode'} title={dark?'Switch to light mode':'Switch to dark mode'}><motion.span className="theme-icon" key={dark?'sun':'moon'} initial={reduceMotion?false:{rotate:-45}} animate={{rotate:0}} transition={{duration:reduceMotion?0:.15,ease:'easeOut'}}>{dark?<Sun size={20}/>:<Moon size={20}/>}</motion.span></motion.button>;
}
