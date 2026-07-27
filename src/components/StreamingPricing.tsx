'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Check, Radio, Zap, TrendingUp, Clock3, DollarSign } from 'lucide-react';
import WaitlistModal from './WaitlistModal';

const benefits = [
  { icon: Zap, text: 'More engagement' },
  { icon: TrendingUp, text: 'Better streams' },
  { icon: Clock3, text: 'Less workload' },
  { icon: DollarSign, text: 'Potentially more revenue' },
];

const plans = [
  {
    title:'CREATOR STARTER',
    price:'29.99',
    cta:'Start Now',
    featured:false,
    image:'/UUU6.png',
    imageClass:'right-2 -bottom-8 w-[38%] h-[42%]',
    items:['AI cohost','Basic chat interaction','Stream overlay','Limited hours']
  },
  {
    title:'CREATOR PRO',
    price:'99.99',
    cta:'Go Pro',
    featured:true,
    image:'/UUU7.png',
    imageClass:'right-0 -bottom-8 w-[45%] h-[62%]',
    items:['Full AI cohost','Memory','Multiple personalities','Chat interaction','Streaming integrations','Voice','Analytics']
  },
  {
    title:'POWER CREATOR',
    price:'299.99',
    cta:'Go Power',
    featured:false,
    image:'/UUU8.png',
    imageClass:'right-[-5px] -bottom-8 w-[45%] h-[60%]',
    forItems:['VTubers','Professional creators','esports','agencies'],
    items:['Custom personality','Brand integrations','Sponsor behaviors','Multiple characters','Priority compute'],
    increasedHeight:true
  }
];

function Card({plan, onOpenModal}:{plan:any, onOpenModal:()=>void}){
 return (
 <motion.div 
   whileHover={{y:-4}}
   className={`relative bg-[#090811] border ${plan.featured?'border-[#8B3DFF]':'border-[rgba(139,61,255,.3)]'} rounded-[20px] px-6 pt-8 pb-6 shadow-[0_0_50px_rgba(139,61,255,.12)] ${plan.featured?'h-[560px]':plan.increasedHeight?'h-[600px]':'h-[530px]'} flex flex-col overflow-visible before:absolute before:inset-0 before:rounded-[20px] before:border before:border-[#8B3DFF]/20 before:pointer-events-none`}
 >
 {plan.featured && <div className="absolute -top-4 left-1/2 z-30 -translate-x-1/2 bg-[#8B3DFF] text-white text-[11px] font-bold px-5 py-1 rounded-full shadow-lg">MOST POPULAR</div>}
 
 <div className={`relative z-10 ${plan.featured?'max-w-[52%]':plan.forItems?'max-w-[56%]':'max-w-[60%]'}`}>
   <h3 className="text-white font-bold uppercase text-[20px] tracking-tight mb-4">{plan.title}</h3>
   <div className="flex items-end gap-1 mb-6">
     <span className="text-[44px] font-extrabold text-[#A855F7] leading-none">
       ${plan.price}
     </span>
     <span className="text-[20px] text-[#A855F7] mb-2 font-medium">
       /month
     </span>
   </div>
   
   {plan.forItems && (
    <div className="mb-4">
      <p className="text-[#A855F7] text-[13px] font-bold mb-1.5">For:</p>
      <ul className="space-y-1">
        {plan.forItems.map((i:string)=><li key={i} className="flex gap-3 text-[14px] text-white leading-6"><span className="text-[#A855F7]">•</span>{i}</li>)}
      </ul>
    </div>
  )}
  
  <div className="mb-4">
    <p className="text-[#A855F7] text-[13px] font-bold mb-1.5">Includes:</p>
    <ul className="space-y-1">
      {plan.items.map((i:string)=><li key={i} className="flex items-center gap-3 text-[14px] text-white leading-6"><Check size={14} className="text-[#A855F7]"/>{i}</li>)}
    </ul>
  </div>
 </div>
 
 <div className="absolute right-6 bottom-10 w-44 h-44 rounded-full bg-[#8B3DFF] blur-[90px] opacity-20 z-0" />
 <div className={`absolute ${plan.imageClass} z-0`}>
   <Image 
     src={plan.image} 
     alt="" 
     fill 
     className="object-contain object-top" 
     unoptimized
   />
 </div>
 
 <div className="mt-auto pt-6 relative z-20">
   <button onClick={onOpenModal} className={`w-full h-[50px] rounded-[10px] ${plan.featured?'bg-gradient-to-r from-[#8B3DFF] to-[#6A1BFF] text-white shadow-[0_0_20px_rgba(139,61,255,.3)]':'border border-[#8B3DFF] text-[#8B3DFF] bg-transparent hover:border-[#B26DFF]'} font-semibold text-[16px] transition-all z-10 cursor-pointer`}>
     {plan.cta}
   </button>
 </div>
 </motion.div>);
}

export default function StreamingPricing(){
 const [isModalOpen, setIsModalOpen] = useState(false);

 return (
 <section className="py-4 px-6 lg:px-12 max-w-[1400px] mx-auto">
 <WaitlistModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
 <motion.div
 initial={{ opacity: 0, y: 30 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ duration: 0.6 }}
 className="rounded-[28px] bg-gradient-to-b from-[#0C0A16] to-[#090811] border border-[rgba(139,61,255,.18)] p-8 shadow-[0_20px_60px_rgba(0,0,0,.45)]"
 >
 {/* Section Header */}
 <div className="flex items-center gap-4 mb-10">
 <Radio size={28} color="#8B3DFF" />
 <h2 className="text-[34px] font-extrabold tracking-[-0.5px] text-white leading-none">
  2. STREAMING AVATAR / AI COHOST
 </h2>
 </div>

 {/* Feature Highlights Bar */}
 <div className="flex flex-wrap justify-center items-center gap-6 md:gap-24 bg-[#090811] border-t border-[rgba(139,61,255,.15)] border-b border-[rgba(139,61,255,.10)] px-8 py-[18px] mb-8">
 {benefits.map((benefit, index) => {
 const Icon = benefit.icon;
 return (
 <div key={index} className="flex items-center gap-2">
 <Icon size={18} color="#8B3DFF" />
 <span className="text-[14px] font-medium text-[#C9C9D4]">
 {benefit.text}
 </span>
 </div>
 );
 })}
 </div>

 {/* Pricing Cards */}
 <div className="grid lg:grid-cols-3 gap-6 pt-6">
 {plans.map((p, index) => (
   <motion.div
     key={p.title}
     initial={{ opacity: 0, y: 20 }}
     whileInView={{ opacity: 1, y: 0 }}
     viewport={{ once: true }}
     transition={{ duration: 0.5, delay: index * 0.1 }}
   >
     <Card plan={p} onOpenModal={() => setIsModalOpen(true)}/>
   </motion.div>
 ))}
 </div>
 </motion.div>
 </section>);
}
