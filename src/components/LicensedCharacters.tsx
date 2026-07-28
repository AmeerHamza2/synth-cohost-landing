'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import WaitlistModal from './WaitlistModal';

export default function LicensedCharacters() {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-[1400px] mx-auto min-h-[100px] rounded-[22px] border border-[rgba(147,51,234,0.25)] px-8 flex flex-col md:flex-row items-center justify-between gap-5 relative overflow-hidden py-5 md:py-0"

      >
        {/* Subtle noise texture overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }} />

        {/* Left Section */}
        <div className="flex items-center gap-[18px] relative z-10">
          {/* Robot Avatar */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="relative"
          >
            <Image
              src="/download.gif"
              alt="Robot"
              width={120}
              height={120}
              className="object-contain rounded-2xl"
              unoptimized
            />
          </motion.div>

          {/* Text Block */}
          <div className="flex flex-col">
            <h3 className="text-white font-semibold text-[22px] leading-tight">
              Not sure which plan is right for you?
            </h3>
            <p className="text-[rgba(255,255,255,0.65)] text-[16px] mt-1">
              Join the waitlist and be the first to experience Syn.
            </p>
          </div>
        </div>

        {/* Right Section - Button */}
        <motion.button
          onClick={() => setIsWaitlistOpen(true)}
          whileHover={{
            backgroundColor: '#a855f7',
            translateY: -2,
            boxShadow: '0 4px 20px rgba(168, 85, 247, 0.4)',
          }}
          transition={{ duration: 0.25 }}
          className="h-[52px] w-[170px] md:w-[170px] w-full rounded-[12px] border border-[#A855F7] text-white font-semibold text-[16px] relative z-10 cursor-pointer"
          style={{ backgroundColor: 'transparent' }}
        >
          Join Waitlist
        </motion.button>
      </motion.div>
      <WaitlistModal isOpen={isWaitlistOpen} onClose={() => setIsWaitlistOpen(false)} />
    </>
  );
}