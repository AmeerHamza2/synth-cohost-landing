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
    items:['AI cohost','Basic chat interaction','Stream overlay','Limited hours']
  },
  {
    title:'CREATOR PRO',
    price:'99.99',
    cta:'Go Pro',
    featured:true,
    image:'/UUU7.png',
    items:['Full AI cohost','Memory','Multiple personalities','Chat interaction','Streaming integrations','Voice','Analytics']
  },
  {
    title:'POWER CREATOR',
    price:'299.99',
    cta:'Go Power',
    featured:false,
    image:'/UUU8.png',
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
 <div className={`absolute right-0 ${plan.title === 'CREATOR STARTER' ? 'top-25 -mr-30' : plan.title === 'POWER CREATOR' ? 'top-20 -mr-20' : 'top-20 -mr-15'}`}>
   <Image 
     src={plan.image} 
     alt="" 
     width={plan.title === 'CREATOR STARTER' ? 450 : 280}
     height={plan.title === 'CREATOR STARTER' ? 450 : 280}
     className="object-contain object-center" 
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
 const [currentIndex, setCurrentIndex] = useState(0);
 const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

 return (
 <>
 {/* Mobile Version */}
 <section className="md:hidden relative bg-[#050505] py-4 px-4 max-w-[420px] mx-auto">
 <WaitlistModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

 {/* Section Header */}
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.6 }}
 className="mb-6"
 >
 <div className="flex items-center gap-3 mb-2">
 <Radio size={28} className="text-[#8B3DFF]" />
 <h2 className="text-[16px] font-bold uppercase tracking-tight text-white leading-[1.2]">
  2. STREAMING AVATAR / AI COHOST
 </h2>
 </div>
 </motion.div>

 {/* Feature Highlights Bar */}
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.6, delay: 0.1 }}
 className="flex justify-between items-center gap-2 bg-[#090811] border border-[rgba(139,61,255,.15)] px-4 py-3 mb-6"
 >
 {benefits.map((benefit, index) => {
 const Icon = benefit.icon;
 return (
 <div key={index} className="flex flex-col items-center gap-1">
 <Icon size={16} className="text-[#8B3DFF]" />
 <span className="text-[10px] font-medium text-[#C9C9D4] text-center">
 {benefit.text}
 </span>
 </div>
 );
 })}
 </motion.div>

 {/* Pricing Cards - Carousel */}
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.6, delay: 0.2 }}
 >
 <div className="relative w-full h-[560px] mb-4">
 <motion.div
 key={currentIndex}
 initial={{ opacity: 0, x: 50 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, x: -50 }}
 transition={{ duration: 0.3 }}
 drag="x"
 dragConstraints={{ left: 0, right: 0 }}
 dragElastic={0.2}
 onDragEnd={(e, { offset, velocity }) => {
 const swipe = offset.x * velocity.x;
 if (swipe < -1000 || offset.x < -50) {
 setCurrentIndex((prev) => (prev + 1) % plans.length);
 } else if (swipe > 1000 || offset.x > 50) {
 setCurrentIndex((prev) => prev === 0 ? plans.length - 1 : prev - 1);
 }
 }}
 className="relative w-full h-full rounded-[10px] overflow-hidden cursor-pointer touch-pan-y bg-[#101018]"
 style={{
 boxShadow: hoveredIndex === currentIndex 
 ? '0 0 30px rgba(124, 58, 237, 0.8), 0 0 60px rgba(124, 58, 237, 0.5)' 
 : 'none'
 }}
 onHoverStart={() => setHoveredIndex(currentIndex)}
 onHoverEnd={() => setHoveredIndex(null)}
 >
 {currentIndex === 0 && (
 <div className="relative bg-[#0C0A16] border border-[rgba(110,70,255,.18)] rounded-[18px] p-[18px] h-full shadow-[0_12px_40px_rgba(0,0,0,.45)] overflow-hidden">
 <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-[radial-gradient(rgba(139,92,255,.25),transparent)] blur-[70px] opacity-50" />
 <div className="relative z-10 w-[55%] h-full flex flex-col">
 <h3 className="text-white font-bold uppercase text-[18px] tracking-tight mb-2">{plans[0].title}</h3>
 <div className="flex items-end gap-1 mb-2">
 <span className="text-[44px] font-bold text-[#8B5CFF] leading-none">
 ${plans[0].price}
 </span>
 <span className="text-[14px] text-[#B9B9C8] mb-2 font-medium">
 /month
 </span>
 </div>

 <div className="mb-2">
 <p className="text-[#87879A] text-[13px] font-bold mb-1">Includes:</p>
 <ul className="space-y-1">
 {plans[0].items.map((i:string)=><li key={i} className="flex items-center gap-3 text-[14px] font-medium text-[#D8D8D8] leading-5"><Check size={14} className="text-[#8B5CFF]"/>{i}</li>)}
 </ul>
 </div>

 <button onClick={() => setIsModalOpen(true)} className="mt-auto w-full h-[48px] rounded-[12px] bg-gradient-to-r from-[#6F2CFF] to-[#8B5CFF] text-white font-semibold text-[15px] transition-all cursor-pointer hover:shadow-[0_8px_30px_rgba(120,80,255,.45)] hover:scale-[1.02]">
 {plans[0].cta}
 </button>
 </div>

 <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[50%] h-[85%] pointer-events-none">
 <motion.div
 animate={{ y: [-4, 0, -4] }}
 transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
 className="relative w-full h-full"
 >
 <Image
 src={plans[0].image}
 alt=""
 fill
 className="object-contain object-center"
 unoptimized
 />
 </motion.div>
 <div className="absolute -bottom-4 -right-4 w-32 h-32 rounded-full bg-[radial-gradient(rgba(139,92,255,.25),transparent)] blur-[70px] opacity-30" />
 </div>
 </div>
 )}

 {currentIndex === 1 && (
 <div className="relative bg-[#0C0A16] border border-[rgba(110,70,255,.18)] rounded-[18px] p-[18px] pt-10 h-full shadow-[0_12px_40px_rgba(0,0,0,.45)] overflow-hidden">
 <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-[radial-gradient(rgba(139,92,255,.25),transparent)] blur-[70px] opacity-50" />
 <div className="absolute top-2 left-1/2 z-30 -translate-x-1/2 bg-gradient-to-r from-[#6F2CFF] to-[#8B5CFF] text-white text-[11px] font-bold px-4 py-1 rounded-full shadow-lg tracking-widest">MOST POPULAR</div>

 <div className="relative z-10 w-[55%] h-full flex flex-col">
 <h3 className="text-white font-bold uppercase text-[18px] tracking-tight mb-2">{plans[1].title}</h3>
 <div className="flex items-end gap-1 mb-2">
 <span className="text-[44px] font-bold text-[#8B5CFF] leading-none">
 ${plans[1].price}
 </span>
 <span className="text-[14px] text-[#B9B9C8] mb-2 font-medium">
 /month
 </span>
 </div>

 <div className="mb-2">
 <p className="text-[#87879A] text-[13px] font-bold mb-1">Includes:</p>
 <ul className="space-y-1">
 {plans[1].items.map((i:string)=><li key={i} className="flex items-center gap-3 text-[14px] font-medium text-[#D8D8D8] leading-5"><Check size={14} className="text-[#8B5CFF]"/>{i}</li>)}
 </ul>
 </div>

 <button onClick={() => setIsModalOpen(true)} className="mt-auto w-full h-[48px] rounded-[12px] bg-gradient-to-r from-[#6F2CFF] to-[#8B5CFF] text-white font-semibold text-[15px] transition-all cursor-pointer hover:shadow-[0_8px_30px_rgba(120,80,255,.45)] hover:scale-[1.02]">
 {plans[1].cta}
 </button>
 </div>

 <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[50%] h-[85%] pointer-events-none">
 <motion.div
 animate={{ y: [-4, 0, -4] }}
 transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
 className="relative w-full h-full"
 >
 <Image
 src={plans[1].image}
 alt=""
 fill
 className="object-contain object-center"
 unoptimized
 />
 </motion.div>
 <div className="absolute -bottom-4 -right-4 w-32 h-32 rounded-full bg-[radial-gradient(rgba(139,92,255,.25),transparent)] blur-[70px] opacity-30" />
 </div>
 </div>
 )}

 {currentIndex === 2 && (
 <div className="relative bg-[#0C0A16] border border-[rgba(110,70,255,.18)] rounded-[18px] p-[18px] h-full shadow-[0_12px_40px_rgba(0,0,0,.45)] overflow-hidden">
 <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-[radial-gradient(rgba(139,92,255,.25),transparent)] blur-[70px] opacity-50" />
 <div className="relative z-10 w-[55%] h-full flex flex-col">
 <h3 className="text-white font-bold uppercase text-[18px] tracking-tight mb-2">{plans[2].title}</h3>
 <div className="flex items-end gap-1 mb-2">
 <span className="text-[44px] font-bold text-[#8B5CFF] leading-none">
 ${plans[2].price}
 </span>
 <span className="text-[14px] text-[#B9B9C8] mb-2 font-medium">
 /month
 </span>
 </div>

 {plans[2].forItems && (
 <div className="mb-2">
 <p className="text-[#87879A] text-[13px] font-bold mb-1">For:</p>
 <ul className="space-y-1">
 {plans[2].forItems.map((i:string)=><li key={i} className="flex gap-3 text-[14px] font-medium text-[#D8D8D8] leading-5"><span className="text-[#8B5CFF]">•</span>{i}</li>)}
 </ul>
 </div>
 )}

 <div className="mb-2">
 <p className="text-[#87879A] text-[13px] font-bold mb-1">Includes:</p>
 <ul className="space-y-1">
 {plans[2].items.map((i:string)=><li key={i} className="flex items-center gap-3 text-[14px] font-medium text-[#D8D8D8] leading-5"><Check size={14} className="text-[#8B5CFF]"/>{i}</li>)}
 </ul>
 </div>

 <button onClick={() => setIsModalOpen(true)} className="mt-auto w-full h-[48px] rounded-[12px] bg-gradient-to-r from-[#6F2CFF] to-[#8B5CFF] text-white font-semibold text-[15px] transition-all cursor-pointer hover:shadow-[0_8px_30px_rgba(120,80,255,.45)] hover:scale-[1.02]">
 {plans[2].cta}
 </button>
 </div>

 <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[50%] h-[85%] pointer-events-none">
 <motion.div
 animate={{ y: [-4, 0, -4] }}
 transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
 className="relative w-full h-full"
 >
 <Image
 src={plans[2].image}
 alt=""
 fill
 className="object-contain object-center"
 unoptimized
 />
 </motion.div>
 <div className="absolute -bottom-4 -right-4 w-32 h-32 rounded-full bg-[radial-gradient(rgba(139,92,255,.25),transparent)] blur-[70px] opacity-30" />
 </div>
 </div>
 )}
 </motion.div>

 {/* Navigation Arrows */}
 <button
 onClick={() => setCurrentIndex((prev) => prev === 0 ? plans.length - 1 : prev - 1)}
 className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors z-10"
 >
 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
 <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
 </svg>
 </button>
 <button
 onClick={() => setCurrentIndex((prev) => (prev + 1) % plans.length)}
 className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors z-10"
 >
 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
 <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/>
 </svg>
 </button>
 </div>

 {/* Dots */}
 <div className="flex justify-center gap-2 mb-4">
 {plans.map((_, index) => (
 <button
 key={index}
 onClick={() => setCurrentIndex(index)}
 className={`w-2 h-2 rounded-full transition-colors ${
 index === currentIndex ? 'bg-[#8B3DFF]' : 'bg-[#8B6EDC]'
 }`}
 />
 ))}
 </div>
 </motion.div>
 </section>

 {/* Desktop Version */}
 <section className="hidden md:block py-4 px-6 lg:px-12 max-w-[1400px] mx-auto">
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
 </section>
 </>
 );
}
