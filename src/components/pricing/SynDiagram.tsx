'use client';

import { motion } from 'framer-motion';
import { Monitor, Radio, Sparkles } from 'lucide-react';
import Image from 'next/image';

export default function SynDiagram() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="relative w-[280px] h-[280px]"
    >
      {/* Animated rotation container */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0"
      >
        {/* Curved connection arrows */}
        <svg className="w-full h-full" viewBox="0 0 320 320">
          {/* Left to center arrow */}
          <path
            d="M 60 160 Q 100 100 160 100"
            stroke="rgba(168,85,247,0.4)"
            strokeWidth="2"
            fill="none"
            strokeDasharray="5,5"
          />
          {/* Center to right arrow */}
          <path
            d="M 160 100 Q 220 100 260 160"
            stroke="rgba(168,85,247,0.4)"
            strokeWidth="2"
            fill="none"
            strokeDasharray="5,5"
          />
          {/* Right to bottom arrow */}
          <path
            d="M 260 160 Q 220 220 160 220"
            stroke="rgba(168,85,247,0.4)"
            strokeWidth="2"
            fill="none"
            strokeDasharray="5,5"
          />
          {/* Bottom to left arrow */}
          <path
            d="M 160 220 Q 100 220 60 160"
            stroke="rgba(168,85,247,0.4)"
            strokeWidth="2"
            fill="none"
            strokeDasharray="5,5"
          />
        </svg>
      </motion.div>

      {/* Center node - uuu9.png */}
      <motion.div
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100px] h-[100px]"
      >
        <div className="relative w-full h-full">
          <div className="absolute inset-0 bg-[#8B3DFF] rounded-full blur-[20px] opacity-40" />
          <div className="relative w-full h-full rounded-full bg-[#1A1A2E] border-2 border-[#8B3DFF] flex items-center justify-center overflow-hidden">
            <Image
              src="/UUU9.png"
              alt="Center Syn"
              fill
              className="object-contain p-2"
              unoptimized
            />
          </div>
        </div>
      </motion.div>

      {/* Left node - Desktop Companion */}
      <motion.div
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute left-0 top-1/2 -translate-y-1/2 w-[70px] h-[70px]"
      >
        <div className="relative w-full h-full">
          <div className="absolute inset-0 bg-[#8B3DFF] rounded-full blur-[15px] opacity-30" />
          <div className="relative w-full h-full rounded-full bg-[#1A1A2E] border border-[#8B3DFF]/50 flex items-center justify-center">
            <Monitor className="w-8 h-8 text-[#8B3DFF]" />
          </div>
        </div>
        <p className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[12px] font-semibold text-white whitespace-nowrap">
          DESKTOP
          <br />
          COMPANION
        </p>
      </motion.div>

      {/* Right node - AI Cohost */}
      <motion.div
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute right-0 top-1/2 -translate-y-1/2 w-[70px] h-[70px]"
      >
        <div className="relative w-full h-full">
          <div className="absolute inset-0 bg-[#8B3DFF] rounded-full blur-[15px] opacity-30" />
          <div className="relative w-full h-full rounded-full bg-[#1A1A2E] border border-[#8B3DFF]/50 flex items-center justify-center">
            <Radio className="w-8 h-8 text-[#8B3DFF]" />
          </div>
        </div>
        <p className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[12px] font-semibold text-white whitespace-nowrap">
          AI
          <br />
          COHOST
        </p>
      </motion.div>

      {/* Outer glow effect */}
      <div className="absolute inset-0 bg-[#8B3DFF] blur-[60px] opacity-10 rounded-full" />
    </motion.div>
  );
}
