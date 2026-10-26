'use client';

import { useRef, type CSSProperties } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

const strip=Array.from({length:30},(_,i)=>i%10);

// BlockPrep's three-turn digit strips and 100/18/1.5 spring, with one readable value.
export function AnimatedNumber({text}:{text:string}){
 const ref=useRef<HTMLSpanElement>(null);
 const visible=useInView(ref,{once:true,amount:.2});
 const reduce=useReducedMotion();
 return <span ref={ref} className="animated-number">
  <span className="sr-only">{text}</span>
  <span className="number-visual" aria-hidden="true">{Array.from(text).map((char,i)=>{
   if(!/\d/.test(char))return <span key={i} className={`number-mark ${char==='+'?'stat-suffix':''}`}>{char}</span>;
   const index=20+Number(char);
   const offset=`-${index/strip.length*100}%`;
   return <span className="number-window" key={i}>
    <motion.span className="number-strip" initial={false} animate={{y:visible||reduce?offset:'0%'}} style={{'--digit-offset':offset} as CSSProperties} transition={reduce?{duration:0}:{type:'spring',stiffness:100,damping:18,mass:1.5,delay:i*.15}}>
     {strip.map((digit,j)=><span key={j}>{digit}</span>)}
    </motion.span>
   </span>;
  })}</span>
 </span>;
}
