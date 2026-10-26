'use client';
import { useRef } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
export const Dialog=DialogPrimitive.Root;
export const DialogTitle=DialogPrimitive.Title;
export const DialogDescription=DialogPrimitive.Description;
export function DialogContent({children,className=''}:{children:React.ReactNode;className?:string}){
 const reduceMotion=useReducedMotion();
 const opener=useRef<HTMLElement|null>(null);
 const immediate=className.split(' ').includes('emergency-dialog');
 const lesson=className.split(' ').includes('lesson-dialog');
 return <DialogPrimitive.Portal>
  <DialogPrimitive.Overlay className={`dialog-overlay ${immediate?'emergency-overlay':''}`}/>
  <DialogPrimitive.Content asChild onOpenAutoFocus={()=>{opener.current=document.activeElement instanceof HTMLElement?document.activeElement:null;}} onCloseAutoFocus={event=>{if(opener.current?.isConnected){event.preventDefault();opener.current.focus({preventScroll:true});}}}>
   <motion.div className={`dialog-content motion-dialog ${className}`} transformTemplate={(_,transform)=>`translate(-50%, -50%)${transform==='none'?'':` ${transform}`}`} initial={reduceMotion||immediate?false:lesson?{opacity:0,scale:.96,y:24,filter:'blur(4px)'}:{opacity:1,filter:'blur(4px)'}} animate={{opacity:1,scale:1,y:0,filter:'blur(0px)'}} transition={reduceMotion||immediate?{duration:0}:lesson?{type:'spring',stiffness:100,damping:18,mass:1.5,opacity:{duration:.2},filter:{duration:.25,ease:'easeOut'}}:{duration:.25,ease:'easeOut'}}>
    {children}<DialogPrimitive.Close className="dialog-close" aria-label="Close"><X size={20}/></DialogPrimitive.Close>
   </motion.div>
  </DialogPrimitive.Content>
 </DialogPrimitive.Portal>;
}
