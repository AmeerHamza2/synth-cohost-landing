'use client';

import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import Image from 'next/image';

export default function Hero() {
  return (
    <section data-section="01" className="relative min-h-[60vh] overflow-hidden">
      {/* Full Width Character Image */}
      <motion.div
        initial={{ opacity: 0, scale: 1.02 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="absolute inset-0"
      >
        <Image
          src="/synth_character_lossless.webp"
          alt="Synth AI Cohost"
          fill
          className="object-cover object-top"
          priority
          unoptimized
        />
      </motion.div>

      {/* Left Content Overlay */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-20 pt-32 pb-16 min-h-screen flex items-center">
        {/* Section Number - Left Side - Hidden on mobile */}
        <div className="hidden md:flex absolute left-6 lg:left-10 top-1/2 -translate-y-1/2 flex-col items-center gap-2">
          <span className="text-[11px] font-bold text-[#7c3aed]">01</span>
          <span className="w-4 h-[2px] bg-[#7c3aed]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="max-w-lg ml-8 lg:ml-0"
        >
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center gap-2 mb-6"
          >
            <span className="text-[11px] font-semibold tracking-[1.8px] uppercase text-[#7c3aed]">
              AI Cohost for Live Streamers
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-[clamp(42px,5vw,64px)] font-medium text-[#1a1628] leading-[1.05] tracking-[-2px] mb-5"
          >
            Your stream.
            <br />
            Stronger together<span className="text-[#7c3aed]">.</span>
          </motion.h1>

          {/* Body */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-[15px] text-[#5c5575] leading-[1.7] max-w-[380px] mb-9"
          >
            Synth Cohost is an AI cohost that talks with you, engages your audience, 
            and helps your stream run smoother — so you can focus on what you love.
          </motion.p>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: '#7c3aed' }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 bg-[#1a1628] text-white text-[13.5px] font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              See It In Action
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02, color: '#7c3aed' }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 text-[#3d3654] text-[13.5px] font-medium px-1 py-3 transition-colors"
            >
              <span className="w-7 h-7 rounded-full border-[1.5px] border-[#3d3654] flex items-center justify-center">
                <Play className="w-2.5 h-2.5 fill-[#3d3654]" />
              </span>
              Watch Demo
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* Side Labels - Hidden on mobile */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="hidden lg:flex absolute right-8 top-1/2 -translate-y-1/2 flex-col gap-3 z-10"
      >
        {['ENGAGE', 'SUPPORT', 'COLLABORATE'].map((label, index) => (
          <motion.span
            key={label}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
            className="text-[11px] font-bold tracking-[2px] uppercase text-[#1a1628] flex items-center gap-2"
          >
            <span className="text-sm text-[#7c3aed]">+</span>
            {label}
          </motion.span>
        ))}
      </motion.div>

      {/* Scroll Hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] tracking-[2.5px] uppercase text-[#9d99b5] z-10"
      >
        Scroll to discover
      </motion.div>

      {/* Bottom line separator */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-[#0d0b14]" />
    </section>
  );
}
