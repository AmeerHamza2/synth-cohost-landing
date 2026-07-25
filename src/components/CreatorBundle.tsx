'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Check, ArrowRight, Monitor, Radio } from 'lucide-react';

export default function CreatorBundle() {
  return (
    <section className="py-2 px-4 lg:px-8 max-w-[1400px] mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="rounded-3xl bg-gradient-to-r from-[#11111C] to-[#0E0A16] border border-[rgba(139,61,255,.25)] p-3 lg:p-4"
      >
        <div className="grid lg:grid-cols-4 gap-6 items-center">
          {/* Left - Pricing */}
          <div className="text-center lg:text-left">
            <div className="text-[44px] font-black text-[#8B3DFF] mb-2">$89<span className="text-[18px] text-[#8B3DFF]">/mo</span></div>
            <p className="text-[#8B3DFF] text-[14px]">or</p>
            <p className="text-[44px] font-black text-[#8B3DFF]">$899<span className="text-[18px] text-[#8B3DFF]">/year</span></p>
          </div>

          {/* Heading and Description */}
          <div>
            <h3 className="text-[26px] font-bold text-white mb-4">One AI. Everywhere.</h3>
            <p className="text-[#A8A8B5] text-[14px] mb-6">
              The ultimate experience across all your surfaces with one shared Syn.
            </p>
          </div>

          {/* Center - Ecosystem Icons */}
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#8B3DFF]/10 border border-[#8B3DFF]/30 flex items-center justify-center">
                <Image
                  src="/syn.png"
                  alt="Syn Logo"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <div className="w-12 h-12 rounded-full bg-[#8B3DFF]/10 border border-[#8B3DFF]/30 flex items-center justify-center">
                <Monitor className="w-6 h-6 text-[#8B3DFF]" />
              </div>
              <div className="w-12 h-12 rounded-full bg-[#8B3DFF]/10 border border-[#8B3DFF]/30 flex items-center justify-center">
                <Radio className="w-6 h-6 text-[#8B3DFF]" />
              </div>
            </div>
            <div className="flex gap-8 text-[12px] text-[#A8A8B5]">
              <span>Syn</span>
              <span>Desktop</span>
              <span>AI Cohost</span>
            </div>
          </div>

          {/* Right - Checklist */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <h4 className="text-white font-bold mb-4">Includes:</h4>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-3 text-[#A8A8B5] text-[14px]">
                  <Check className="w-4 h-4 text-[#8B3DFF]" />
                  AI Cohost
                </li>
                <li className="flex items-center gap-3 text-[#A8A8B5] text-[14px]">
                  <Check className="w-4 h-4 text-[#8B3DFF]" />
                  Desktop Companion
                </li>
                <li className="flex items-center gap-3 text-[#A8A8B5] text-[14px]">
                  <Check className="w-4 h-4 text-[#8B3DFF]" />
                  Shared memories
                </li>
                <li className="flex items-center gap-3 text-[#A8A8B5] text-[14px]">
                  <Check className="w-4 h-4 text-[#8B3DFF]" />
                  Shared personalities
                </li>
                <li className="flex items-center gap-3 text-[#A8A8B5] text-[14px]">
                  <Check className="w-4 h-4 text-[#8B3DFF]" />
                  Shared voice
                </li>
                <li className="flex items-center gap-3 text-[#A8A8B5] text-[14px]">
                  <Check className="w-4 h-4 text-[#8B3DFF]" />
                  Shared settings
                </li>
                <li className="flex items-center gap-3 text-[#A8A8B5] text-[14px]">
                  <Check className="w-4 h-4 text-[#8B3DFF]" />
                  Cross-device continuity
                </li>
              </ul>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-2 rounded-full bg-gradient-to-r from-[#8B3DFF] to-[#6A1BFF] text-white font-semibold hover:shadow-[0_0_30px_rgba(139,61,255,.4)] transition-all cursor-pointer flex items-center gap-2"
              >
                Choose Synth Creator+
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
            <div className="flex-shrink-0">
              <Image
                src="/UUU10.png"
                alt="Synth Character"
                width={90}
                height={90}
                className="object-contain"
                unoptimized
              />
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
