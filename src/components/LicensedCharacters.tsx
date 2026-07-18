'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function LicensedCharacters() {
  const characters = [
    '/synth_character_lossless.webp',
    '/stream_lossless.webp',
    '/background_lossless.webp',
    '/files_lossless (1).webp',
    '/change_lossless.webp',
    '/Mods_lossless(1) (1).webp',
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
        <div className="grid lg:grid-cols-3 gap-8 items-center">
          {/* Left - Text */}
          <div>
            <h2 className="text-[42px] font-bold text-white mb-4">Premium Licensed Characters</h2>
            <p className="text-[#A8A8B5] text-[18px] leading-relaxed">
              Unlock exclusive licensed characters from your favorite franchises. Each character comes with unique personalities, voice profiles, and special interactions.
            </p>
          </div>

          {/* Center - Character Strip */}
          <div className="lg:col-span-1">
            <div className="relative h-[300px] flex items-center justify-center">
              {characters.map((char, index) => (
                <motion.div
                  key={index}
                  initial={{ x: 20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="absolute"
                  style={{
                    left: `${index * 15}%`,
                    zIndex: characters.length - index,
                  }}
                >
                  <div className="w-32 h-32 rounded-2xl border border-[rgba(139,61,255,.25)] bg-[#11111C] overflow-hidden">
                    <Image
                      src={char}
                      alt={`Character ${index + 1}`}
                      width={128}
                      height={128}
                      className="object-cover w-full h-full"
                      unoptimized
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right - Pricing */}
          <div className="text-center lg:text-right">
            <p className="text-[#A8A8B5] text-[16px] mb-2">Starting from</p>
            <div className="text-[56px] font-black text-white mb-2">$39.99</div>
            <p className="text-[#A8A8B5] text-[14px] mb-6">per character</p>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-[#8B3DFF] to-[#6A1BFF] text-white font-semibold hover:shadow-[0_0_30px_rgba(139,61,255,.4)] transition-all cursor-pointer"
            >
              Browse Characters
            </motion.button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
