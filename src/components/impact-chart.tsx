'use client';

import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { TrendingDown } from 'lucide-react';
import { AnimatedNumber } from '@/components/animated-number';

export function ImpactChart({series}:{series:{label:string;value:number}[]}){
 const ref=useRef<HTMLDivElement>(null);
 const visible=useInView(ref,{once:true,amount:.15});
 const reduce=useReducedMotion();
 const max=Math.max(...series.map(p=>p.value));
 return <div className="chart-panel" ref={ref}>
  <div className="section-heading"><div><h2>A changing picture.</h2></div><TrendingDown size={28}/></div>
  <div className="bar-chart" role="img" aria-label={series.map(p=>`${p.label}: ${p.value.toLocaleString()} deaths in the preceding 12 months`).join('; ')}>
   {series.map((p,i)=><div className="chart-column" key={p.label}>
    <span><AnimatedNumber text={p.value.toLocaleString()}/></span>
    <motion.div initial={false} animate={{scaleY:visible||reduce?1:0}} transition={reduce?{duration:0}:{type:'spring',stiffness:100,damping:18,mass:1.5,delay:i*.08}} style={{transformOrigin:'bottom',height:`${p.value/max*130}px`}} className={i===series.length-1?'latest':''}/>
    <small>{p.label}</small>
   </div>)}
  </div>
  <p>Each bar covers a rolling 12-month period. Provisional estimates adjust for reporting delays and may change.</p>
 </div>;
}
