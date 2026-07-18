'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Check } from 'lucide-react';

export default function StreamingPricing() {
  const benefits = [
    'More engagement',
    'Better streams',
    'Less workload',
    'Potentially more revenue',
  ];

  return (
    <section className="py-20 px-6 lg:px-12 max-w-[1400px] mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="rounded-3xl bg-[#11111C]/50 backdrop-blur-xl border border-[rgba(139,61,255,.25)] p-8 lg:p-12"
      >
        <div className="text-center mb-8">
          <h2 className="text-[42px] font-bold text-white mb-6">2. Streaming Avatar / AI Cohost</h2>
          
          {/* Benefit Labels */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {benefits.map((benefit) => (
              <span
                key={benefit}
                className="px-4 py-2 rounded-full bg-[#8B3DFF]/10 border border-[#8B3DFF]/30 text-[#A8A8B5] text-[14px]"
              >
                {benefit}
              </span>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Starter */}
          <motion.div
            whileHover={{ y: -6 }}
            className="rounded-3xl bg-[rgba(18,18,30,.92)] backdrop-blur-xl border border-[rgba(139,61,255,.25)] p-6 transition-all duration-300 hover:shadow-[0_0_40px_rgba(138,61,255,.20)]"
          >
            <h3 className="text-[28px] font-bold text-white mb-2">STARTER</h3>
            <div className="text-[56px] font-black text-white mb-6">$14.99<span className="text-[24px] font-normal text-[#A8A8B5]">/mo</span></div>
            
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-3 text-[#A8A8B5] text-[16px]">
                <Check className="w-5 h-5 text-[#8B3DFF]" />
                Basic AI avatar
              </li>
              <li className="flex items-center gap-3 text-[#A8A8B5] text-[16px]">
                <Check className="w-5 h-5 text-[#8B3DFF]" />
                10 hours/month
              </li>
              <li className="flex items-center gap-3 text-[#A8A8B5] text-[16px]">
                <Check className="w-5 h-5 text-[#8B3DFF]" />
                Standard voice
              </li>
            </ul>

            <button className="w-full py-3 rounded-full border border-[#8B3DFF] text-white font-semibold hover:bg-[#8B3DFF]/10 transition-colors cursor-pointer">
              Get Started
            </button>
          </motion.div>

          {/* Pro - Most Popular */}
          <motion.div
            whileHover={{ y: -6 }}
            className="relative rounded-3xl bg-[rgba(18,18,30,.92)] backdrop-blur-xl border-2 border-[#8B3DFF] p-6 transition-all duration-300 hover:shadow-[0_0_60px_rgba(139,61,255,.35)]"
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#8B3DFF] text-white text-[12px] font-bold px-4 py-1 rounded-full">
              MOST POPULAR
            </div>

            <h3 className="text-[28px] font-bold text-white mb-2">PRO</h3>
            <div className="text-[56px] font-black text-white mb-6">$29.99<span className="text-[24px] font-normal text-[#A8A8B5]">/mo</span></div>
            
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-3 text-[#A8A8B5] text-[16px]">
                <Check className="w-5 h-5 text-[#8B3DFF]" />
                Advanced AI avatar
              </li>
              <li className="flex items-center gap-3 text-[#A8A8B5] text-[16px]">
                <Check className="w-5 h-5 text-[#8B3DFF]" />
                50 hours/month
              </li>
              <li className="flex items-center gap-3 text-[#A8A8B5] text-[16px]">
                <Check className="w-5 h-5 text-[#8B3DFF]" />
                Premium voice
              </li>
              <li className="flex items-center gap-3 text-[#A8A8B5] text-[16px]">
                <Check className="w-5 h-5 text-[#8B3DFF]" />
                Custom personality
              </li>
            </ul>

            <button className="w-full py-3 rounded-full bg-gradient-to-r from-[#8B3DFF] to-[#6A1BFF] text-white font-semibold hover:shadow-[0_0_30px_rgba(139,61,255,.4)] transition-all cursor-pointer">
              Subscribe Now
            </button>
          </motion.div>

          {/* Power Creator */}
          <motion.div
            whileHover={{ y: -6 }}
            className="relative rounded-3xl bg-[rgba(18,18,30,.92)] backdrop-blur-xl border border-[rgba(139,61,255,.25)] p-6 transition-all duration-300 hover:shadow-[0_0_40px_rgba(138,61,255,.20)] overflow-hidden"
          >
            <h3 className="text-[28px] font-bold text-white mb-2">POWER CREATOR</h3>
            <div className="text-[56px] font-black text-white mb-6">$49.99<span className="text-[24px] font-normal text-[#A8A8B5]">/mo</span></div>
            
            <ul className="space-y-3 mb-6 relative z-10">
              <li className="flex items-center gap-3 text-[#A8A8B5] text-[16px]">
                <Check className="w-5 h-5 text-[#8B3DFF]" />
                Unlimited hours
              </li>
              <li className="flex items-center gap-3 text-[#A8A8B5] text-[16px]">
                <Check className="w-5 h-5 text-[#8B3DFF]" />
                Multiple avatars
              </li>
              <li className="flex items-center gap-3 text-[#A8A8B5] text-[16px]">
                <Check className="w-5 h-5 text-[#8B3DFF]" />
                Voice cloning
              </li>
              <li className="flex items-center gap-3 text-[#A8A8B5] text-[16px]">
                <Check className="w-5 h-5 text-[#8B3DFF]" />
                Priority support
              </li>
            </ul>

            <button className="w-full py-3 rounded-full bg-gradient-to-r from-[#8B3DFF] to-[#6A1BFF] text-white font-semibold hover:shadow-[0_0_30px_rgba(139,61,255,.4)] transition-all cursor-pointer relative z-10">
              Subscribe Now
            </button>

            {/* Fantasy Character Image Overflowing */}
            <div className="absolute bottom-0 right-0 w-[200px] h-[200px] -mr-10 -mb-10 opacity-80">
              <Image
                src="/synth_character_lossless.webp"
                alt="Fantasy Character"
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
