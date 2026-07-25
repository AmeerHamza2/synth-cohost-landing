'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Check, Monitor } from 'lucide-react';

export default function DesktopPricing() {
  return (
    <section className="py-4 px-6 lg:px-12 max-w-[1400px] mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="rounded-[28px] bg-gradient-to-b from-[#0C0A16] to-[#090811] border border-[rgba(139,61,255,.18)] p-8 shadow-[0_20px_60px_rgba(0,0,0,.45)]"
      >
        <div className="flex items-center gap-4 mb-8">
          <Monitor size={42} color="#8B3DFF" />
          <div>
            <h2 className="text-[40px] font-extrabold uppercase tracking-[0.5px] text-white leading-none">
              1. DESKTOP COMPANION
            </h2>
            <p className="text-[14px] font-semibold tracking-[2px] uppercase text-[#9B5CFF] mt-1">
              CONSUMER MARKET
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-[1fr_1fr_1.15fr] gap-6 mt-8">
          {/* Free Tier */}
          <motion.div
            whileHover={{ y: -6 }}
                        className="relative rounded-[22px] bg-[#11111C] border border-[rgba(139,61,255,.20)] px-8 pt-7 pb-6 h-[430px] flex flex-col shadow-[0_12px_40px_rgba(0,0,0,.35)] before:absolute before:inset-0 before:rounded-[22px] before:bg-[radial-gradient(circle_at_top_right,rgba(139,61,255,.15),transparent_70%)] before:pointer-events-none transition-all duration-300 hover:shadow-[0_0_50px_rgba(139,61,255,.25)]"
          >
            <h3 className="text-[18px] font-bold uppercase text-white mb-2">FREE TIER</h3>
            <div className="text-[44px] font-black text-[#8B3DFF] mb-2">$0</div>
            
            <div className="absolute right-4 top-32">
              <Image
                src="/UUU3.png"
                alt="Robot"
                width={160}
                height={160}
                className="object-contain"
                unoptimized
              />
            </div>

            <ul className="space-y-2 mb-auto">
              <li className="flex items-center gap-3 text-[#C9C9D4] text-[15px] font-medium leading-[22px]">
                <Check className="w-5 h-5 text-[#8B3DFF]" />
                Basic companion
              </li>
              <li className="flex items-center gap-3 text-[#C9C9D4] text-[15px] font-medium leading-[22px]">
                <Check className="w-5 h-5 text-[#8B3DFF]" />
                Limited personality
              </li>
              <li className="flex items-center gap-3 text-[#C9C9D4] text-[15px] font-medium leading-[22px]">
                <Check className="w-5 h-5 text-[#8B3DFF]" />
                Limited memory
              </li>
              <li className="flex items-center gap-3 text-[#C9C9D4] text-[15px] font-medium leading-[22px]">
                <Check className="w-5 h-5 text-[#8B3DFF]" />
                Limited interactions
              </li>
            </ul>

            <button className="w-full h-12 rounded-xl border border-[#8B3DFF] text-white font-semibold hover:bg-[#8B3DFF] transition-colors cursor-pointer mt-1">
              Get Started
            </button>
          </motion.div>

          {/* Paid Companion */}
          <motion.div
            whileHover={{ y: -6 }}
                        className="relative rounded-[22px] bg-[#11111C] border border-[rgba(139,61,255,.20)] px-8 pt-7 pb-6 h-[430px] flex flex-col shadow-[0_12px_40px_rgba(0,0,0,.35)] before:absolute before:inset-0 before:rounded-[22px] before:bg-[radial-gradient(circle_at_top_right,rgba(139,61,255,.15),transparent_70%)] before:pointer-events-none transition-all duration-300 hover:shadow-[0_0_50px_rgba(139,61,255,.25)]"
          >
            <h3 className="text-[18px] font-bold uppercase text-white mb-4">PAID COMPANION</h3>
            <div className="text-[44px] font-black text-[#8B3DFF] mb-2">$19.99</div>
            <p className="text-[#A8A8B5] text-[14px] mb-4">One-time purchase</p>
            
            <div className="absolute right-4 top-32">
              <Image
                src="/UUU4.png"
                alt="Cat"
                width={160}
                height={160}
                className="object-contain"
                unoptimized
              />
            </div>

            <ul className="space-y-2 mb-auto">
              <li className="flex items-center gap-3 text-[#C9C9D4] text-[15px] font-medium leading-[22px]">
                <Check className="w-5 h-5 text-[#8B3DFF]" />
                Unlock character
              </li>
              <li className="flex items-center gap-3 text-[#C9C9D4] text-[15px] font-medium leading-[22px]">
                <Check className="w-5 h-5 text-[#8B3DFF]" />
                More animations
              </li>
              <li className="flex items-center gap-3 text-[#C9C9D4] text-[15px] font-medium leading-[22px]">
                <Check className="w-5 h-5 text-[#8B3DFF]" />
                Customization
              </li>
              <li className="flex items-center gap-3 text-[#C9C9D4] text-[15px] font-medium leading-[22px]">
                <Check className="w-5 h-5 text-[#8B3DFF]" />
                Better personality
              </li>
            </ul>

            <button className="w-full h-12 rounded-xl bg-gradient-to-r from-[#8B3DFF] to-[#6A1BFF] text-white font-semibold hover:shadow-[0_0_30px_rgba(139,61,255,.4)] transition-all cursor-pointer mt-4">
              Unlock Now
            </button>
          </motion.div>

          {/* Premium - Best Value */}
          <motion.div
            whileHover={{ y: -6 }}
                        className="relative rounded-[22px] bg-[#11111C] border-2 border-[#8B3DFF] px-8 pt-7 pb-6 h-[560px] flex flex-col shadow-[0_12px_40px_rgba(0,0,0,.35)] before:absolute before:inset-0 before:rounded-[22px] before:bg-[radial-gradient(circle_at_top_right,rgba(139,61,255,.15),transparent_70%)] before:pointer-events-none transition-all duration-300 hover:shadow-[0_0_60px_rgba(139,61,255,.28)] scale-[1.03]"
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#8B3DFF] text-white text-[12px] font-bold px-5 py-1.5 rounded-full">
              BEST VALUE
            </div>

            <h3 className="text-[18px] font-bold uppercase text-white mb-4 tracking-[0.5px]">PREMIUM AI COMPANION</h3>
            <div className="flex items-end gap-1 mb-2">
              <span className="text-[56px] font-black text-[#8B3DFF] leading-none">
                $9.99
              </span>
              <span className="text-[18px] text-[#A8A8B5] mb-1">
                /month
              </span>
            </div>
            <div className="mb-2">
              <p className="text-[#A8A8B5]  text-sm">
                or
              </p>
              <div className="flex items-end gap-1">
                <span className="text-[38px] font-black text-[#8B3DFF]">
                  $79
                </span>
                <span className="text-[18px] text-[#8B3DFF] mb-1">
                  /year
                </span>
              </div>
            </div>
            
            <div className="absolute right-6 top-[140px]">
              <Image
                src="/UUU5.png"
                alt="Premium Robot"
                width={155}
                height={155}
                className="object-contain"
                unoptimized
              />
            </div>

            <p className="text-[#9B5CFF] text-[14px] mb-0.5 font-bold">Includes:</p>
            
            <ul className="space-y-1.5 mb-auto">
              <li className="flex items-center gap-3 text-[#C9C9D4] text-[15px] font-medium leading-[22px]">
                <Check className="w-5 h-5 text-[#8B3DFF]" />
                Long-term memory
              </li>
              <li className="flex items-center gap-3 text-[#C9C9D4] text-[15px] font-medium leading-[22px]">
                <Check className="w-5 h-5 text-[#8B3DFF]" />
                Advanced conversations
              </li>
              <li className="flex items-center gap-3 text-[#C9C9D4] text-[15px] font-medium leading-[22px]">
                <Check className="w-5 h-5 text-[#8B3DFF]" />
                Personality tuning
              </li>
              <li className="flex items-center gap-3 text-[#C9C9D4] text-[15px] font-medium leading-[22px]">
                <Check className="w-5 h-5 text-[#8B3DFF]" />
                More behaviors
              </li>
              <li className="flex items-center gap-3 text-[#C9C9D4] text-[15px] font-medium leading-[22px]">
                <Check className="w-5 h-5 text-[#8B3DFF]" />
                Voice features
              </li>
              <li className="flex items-center gap-3 text-[#C9C9D4] text-[15px] font-medium leading-[22px]">
                <Check className="w-5 h-5 text-[#8B3DFF]" />
                Cloud sync
              </li>
            </ul>

            <button className="w-full h-12 rounded-xl bg-gradient-to-r from-[#8B3DFF] to-[#6A1BFF] text-white font-semibold hover:shadow-[0_0_30px_rgba(139,61,255,.4)] transition-all cursor-pointer mt-4">
              Go Premium
            </button>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
