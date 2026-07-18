'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function FooterCTA() {
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
          {/* Left - Robot Illustration */}
          <div className="flex justify-center lg:justify-start">
            <div className="relative w-32 h-32">
              <Image
                src="/synth_character_lossless.webp"
                alt="Robot"
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          </div>

          {/* Center - Text */}
          <div className="text-center">
            <h2 className="text-[32px] font-bold text-white mb-3">
              Not sure which plan is right for you?
            </h2>
            <p className="text-[#A8A8B5] text-[18px]">
              Join the waitlist and be the first to experience Syn.
            </p>
          </div>

          {/* Right - CTA Button */}
          <div className="flex justify-center lg:justify-end">
            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: '#8B3DFF' }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-3 rounded-full border border-[#8B3DFF] text-white font-semibold hover:bg-[#8B3DFF]/10 transition-all cursor-pointer"
            >
              Join Waitlist
            </motion.button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
