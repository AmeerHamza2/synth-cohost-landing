'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Check, ArrowRight } from 'lucide-react';

export default function CreatorBundle() {
  return (
    <section className="py-20 px-6 lg:px-12 max-w-[1400px] mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="rounded-3xl bg-gradient-to-r from-[#11111C] to-[#0E0A16] border border-[rgba(139,61,255,.25)] p-8 lg:p-12"
      >
        <div className="grid lg:grid-cols-4 gap-8 items-center">
          {/* Left - Pricing */}
          <div className="text-center lg:text-left">
            <div className="text-[56px] font-black text-white mb-2">$89</div>
            <p className="text-[#A8A8B5] text-[16px]">/mo</p>
            <p className="text-[#A8A8B5] text-[16px]">or $899 /year</p>
          </div>

          {/* Center - Circular Diagram */}
          <div className="flex justify-center">
            <div className="relative w-48 h-48">
              {/* Circular connections */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full bg-[#8B3DFF]/10 border border-[#8B3DFF]/30 flex items-center justify-center">
                  <Image
                    src="/Cohost Synth logo.png"
                    alt="Syn Logo"
                    width={60}
                    height={60}
                    className="object-contain"
                  />
                </div>
              </div>
              
              {/* Desktop Companion */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 bg-[#11111C] border border-[#8B3DFF]/30 rounded-lg px-3 py-2 text-[12px] text-white whitespace-nowrap">
                Desktop Companion
              </div>
              
              {/* AI Cohost */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2 bg-[#11111C] border border-[#8B3DFF]/30 rounded-lg px-3 py-2 text-[12px] text-white whitespace-nowrap">
                AI Cohost
              </div>
            </div>
          </div>

          {/* Right - Checklist */}
          <div className="lg:col-span-2">
            <h3 className="text-[32px] font-bold text-white mb-4">One AI. Everywhere.</h3>
            <p className="text-[#A8A8B5] text-[16px] mb-6">
              The ultimate experience across all your surfaces with one shared Syn.
            </p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-3 text-[#A8A8B5] text-[16px]">
                <Check className="w-5 h-5 text-[#8B3DFF]" />
                AI Cohost
              </li>
              <li className="flex items-center gap-3 text-[#A8A8B5] text-[16px]">
                <Check className="w-5 h-5 text-[#8B3DFF]" />
                Desktop Companion
              </li>
              <li className="flex items-center gap-3 text-[#A8A8B5] text-[16px]">
                <Check className="w-5 h-5 text-[#8B3DFF]" />
                Shared memories
              </li>
              <li className="flex items-center gap-3 text-[#A8A8B5] text-[16px]">
                <Check className="w-5 h-5 text-[#8B3DFF]" />
                Shared personalities
              </li>
              <li className="flex items-center gap-3 text-[#A8A8B5] text-[16px]">
                <Check className="w-5 h-5 text-[#8B3DFF]" />
                Shared voice
              </li>
              <li className="flex items-center gap-3 text-[#A8A8B5] text-[16px]">
                <Check className="w-5 h-5 text-[#8B3DFF]" />
                Shared settings
              </li>
              <li className="flex items-center gap-3 text-[#A8A8B5] text-[16px]">
                <Check className="w-5 h-5 text-[#8B3DFF]" />
                Cross-device continuity
              </li>
            </ul>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-[#8B3DFF] to-[#6A1BFF] text-white font-semibold hover:shadow-[0_0_30px_rgba(139,61,255,.4)] transition-all cursor-pointer flex items-center gap-2"
            >
              Choose Synth Creator+
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
