
// StreamingPricing.tsx
// NOTE: This is a scaffold matching the reference layout.
// Replace image paths with your own assets.

'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Check, Sparkles } from 'lucide-react';

const benefits = [
  'More engagement',
  'Better streams',
  'Less workload',
  'Potentially more revenue',
];

const plans = [
  {
    title:'CREATOR STARTER',
    price:'29.99',
    cta:'Start Now',
    featured:false,
    image:'/starter.webp',
    items:['AI Cohost','Basic chat interaction','Stream overlay','Limited hours']
  },
  {
    title:'CREATOR PRO',
    price:'99.99',
    cta:'Go Pro',
    featured:true,
    image:'/pro.webp',
    items:['Full AI Cohost','Memory','Multiple personalities','Chat interaction','Streaming integrations','Voice','Analytics']
  },
  {
    title:'POWER CREATOR',
    price:'299.99',
    cta:'Go Power',
    featured:false,
    image:'/power.webp',
    items:['VTubers','Professional creators','Esports','Agencies','Custom personality','Brand integration','Sponsor behaviors','Multiple characters','Priority compute']
  }
];

function Card({plan}:{plan:any}){
 return (
 <motion.div whileHover={{y:-6}}
 className={`relative rounded-[28px] bg-gradient-to-b from-[#12131F] to-[#090A14] border ${plan.featured?'border-[#8B3DFF]':'border-white/10'} p-7 shadow-lg`}>
 {plan.featured && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#8B3DFF] text-xs px-4 py-1 rounded-full font-semibold">MOST POPULAR</div>}
 <h3 className="text-xl font-bold text-white">{plan.title}</h3>
 <div className="mt-3 text-[#A855F7] text-5xl font-black">${plan.price}<span className="text-base text-gray-400">/month</span></div>
 <div className="mt-6 flex gap-4">
 <ul className="flex-1 space-y-3">
 {plan.items.map((i:string)=><li key={i} className="flex gap-2 text-sm text-gray-300"><Check size={16} className="text-[#A855F7] mt-0.5"/>{i}</li>)}
 </ul>
 <div className="w-40 h-64 relative self-end">
 <Image src={plan.image} alt="" fill className="object-contain object-bottom" unoptimized/>
 </div>
 </div>
 <button className={`mt-6 w-full h-12 rounded-xl ${plan.featured?'bg-[#8B3DFF]':'border border-[#8B3DFF]/40'} text-white`}>{plan.cta}</button>
 </motion.div>);
}

export default function StreamingPricing(){
 return (
 <section className="py-20 max-w-[1450px] mx-auto px-6">
 <div className="flex flex-wrap justify-center gap-8 mb-10">
 {benefits.map(b=><div key={b} className="flex items-center gap-2 text-gray-300"><Sparkles size={15} className="text-[#A855F7]"/>{b}</div>)}
 </div>
 <div className="grid lg:grid-cols-3 gap-5">
 {plans.map(p=><Card key={p.title} plan={p}/>)}
 </div>
 </section>);
}
