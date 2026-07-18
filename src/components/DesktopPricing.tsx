'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Check } from 'lucide-react';

export default function DesktopPricing() {
  return (
    <section className="py-20 px-6 lg:px-12 max-w-[1400px] mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="rounded-3xl bg-[#11111C]/50 backdrop-blur-xl border border-[rgba(139,61,255,.25)] p-8 lg:p-12"
      >
        <div className="text-center mb-12">
          <h2 className="text-[42px] font-bold text-white mb-2">1. Desktop Companion</h2>
          <p className="text-[#8B3DFF] text-[18px] font-medium">Consumer Market</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Free Tier */}
          <motion.div
            whileHover={{ y: -6 }}
            className="rounded-3xl bg-[rgba(18,18,30,.92)] backdrop-blur-xl border border-[rgba(139,61,255,.25)] p-6 transition-all duration-300 hover:shadow-[0_0_40px_rgba(138,61,255,.20)]"
          >
            <h3 className="text-[28px] font-bold text-white mb-2">FREE TIER</h3>
            <div className="text-[56px] font-black text-white mb-6">$0</div>
            
            <div className="relative h-[200px] mb-6">
              <Image
                src="/synth_character_lossless.webp"
                alt="Robot"
                fill
                className="object-contain"
                unoptimized
              />
            </div>

            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-3 text-[#A8A8B5] text-[16px]">
                <Check className="w-5 h-5 text-[#8B3DFF]" />
                Basic AI personality
              </li>
              <li className="flex items-center gap-3 text-[#A8A8B5] text-[16px]">
                <Check className="w-5 h-5 text-[#8B3DFF]" />
                Desktop only
              </li>
              <li className="flex items-center gap-3 text-[#A8A8B5] text-[16px]">
                <Check className="w-5 h-5 text-[#8B3DFF]" />
                Limited interactions
              </li>
            </ul>

            <button className="w-full py-3 rounded-full border border-[#8B3DFF] text-white font-semibold hover:bg-[#8B3DFF]/10 transition-colors cursor-pointer">
              Get Started
            </button>
          </motion.div>

          {/* Paid Companion */}
          <motion.div
            whileHover={{ y: -6 }}
            className="rounded-3xl bg-[rgba(18,18,30,.92)] backdrop-blur-xl border border-[rgba(139,61,255,.25)] p-6 transition-all duration-300 hover:shadow-[0_0_40px_rgba(138,61,255,.20)]"
          >
            <h3 className="text-[28px] font-bold text-white mb-2">PAID COMPANION</h3>
            <div className="text-[56px] font-black text-white mb-2">$19.99</div>
            <p className="text-[#A8A8B5] text-[14px] mb-6">One-time purchase</p>
            
            <div className="relative h-[200px] mb-6">
              <Image
                src="/cdcc.png"
                alt="Cat"
                fill
                className="object-contain"
                unoptimized
              />
            </div>

            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-3 text-[#A8A8B5] text-[16px]">
                <Check className="w-5 h-5 text-[#8B3DFF]" />
                Advanced AI personality
              </li>
              <li className="flex items-center gap-3 text-[#A8A8B5] text-[16px]">
                <Check className="w-5 h-5 text-[#8B3DFF]" />
                Desktop only
              </li>
              <li className="flex items-center gap-3 text-[#A8A8B5] text-[16px]">
                <Check className="w-5 h-5 text-[#8B3DFF]" />
                Unlimited interactions
              </li>
              <li className="flex items-center gap-3 text-[#A8A8B5] text-[16px]">
                <Check className="w-5 h-5 text-[#8B3DFF]" />
                Custom personalities
              </li>
            </ul>

            <button className="w-full py-3 rounded-full bg-gradient-to-r from-[#8B3DFF] to-[#6A1BFF] text-white font-semibold hover:shadow-[0_0_30px_rgba(139,61,255,.4)] transition-all cursor-pointer">
              Purchase Now
            </button>
          </motion.div>

          {/* Premium - Best Value */}
          <motion.div
            whileHover={{ y: -6 }}
            className="relative rounded-3xl bg-[rgba(18,18,30,.92)] backdrop-blur-xl border-2 border-[#8B3DFF] p-6 transition-all duration-300 hover:shadow-[0_0_60px_rgba(139,61,255,.35)]"
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#8B3DFF] text-white text-[12px] font-bold px-4 py-1 rounded-full">
              BEST VALUE
            </div>

            <h3 className="text-[28px] font-bold text-white mb-2">PREMIUM AI COMPANION</h3>
            <div className="text-[56px] font-black text-white mb-2">$9.99<span className="text-[24px] font-normal text-[#A8A8B5]">/month</span></div>
            <p className="text-[#A8A8B5] text-[14px] mb-6">or $79/year</p>
            
            <div className="relative h-[200px] mb-6 flex justify-end">
              <Image
                src="/synth_character_lossless.webp"
                alt="Premium Robot"
                width={200}
                height={200}
                className="object-contain"
                unoptimized
              />
            </div>

            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-3 text-[#A8A8B5] text-[16px]">
                <Check className="w-5 h-5 text-[#8B3DFF]" />
                All Paid Companion features
              </li>
              <li className="flex items-center gap-3 text-[#A8A8B5] text-[16px]">
                <Check className="w-5 h-5 text-[#8B3DFF]" />
                Priority support
              </li>
              <li className="flex items-center gap-3 text-[#A8A8B5] text-[16px]">
                <Check className="w-5 h-5 text-[#8B3DFF]" />
                Early access features
              </li>
              <li className="flex items-center gap-3 text-[#A8A8B5] text-[16px]">
                <Check className="w-5 h-5 text-[#8B3DFF]" />
                Cloud backup
              </li>
            </ul>

            <button className="w-full py-3 rounded-full bg-gradient-to-r from-[#8B3DFF] to-[#6A1BFF] text-white font-semibold hover:shadow-[0_0_30px_rgba(139,61,255,.4)] transition-all cursor-pointer">
              Subscribe Now
            </button>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
