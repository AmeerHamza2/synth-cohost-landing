'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function CharacterShowcase() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="relative h-full flex items-end justify-end"
    >
      {/* Large human character */}
      <motion.div
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10 w-[100px] h-[160px]"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#8B3DFF]/20 to-transparent rounded-lg blur-xl" />
        <div className="relative w-full h-full rounded-lg overflow-hidden bg-[#1A1A2E] border border-[#8B3DFF]/30">
          <Image
            src="/UUU9.png"
            alt="Character"
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      </motion.div>

      {/* Alien character - overlapping */}
      <motion.div
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="relative z-20 -ml-6 w-[80px] h-[130px]"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#8B3DFF]/20 to-transparent rounded-lg blur-xl" />
        <div className="relative w-full h-full rounded-lg overflow-hidden bg-[#1A1A2E] border border-[#8B3DFF]/30">
          <Image
            src="/UUU9.png"
            alt="Alien Character"
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      </motion.div>

      {/* Small robot character - overlapping */}
      <motion.div
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="relative z-30 -ml-4 w-[55px] h-[90px]"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#8B3DFF]/20 to-transparent rounded-lg blur-xl" />
        <div className="relative w-full h-full rounded-lg overflow-hidden bg-[#1A1A2E] border border-[#8B3DFF]/30">
          <Image
            src="/UUU9.png"
            alt="Robot Character"
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      </motion.div>

      {/* Overflow effect */}
      <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-[#8B3DFF] blur-[40px] opacity-20" />
    </motion.div>
  );
}
