'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function FinalCTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section 
      data-section="07" 
      className="relative bg-[#0d0b14] overflow-hidden"
    >
      {/* Section Number - Left Side - Hidden on mobile */}
      <div className="hidden md:flex absolute left-6 lg:left-10 top-1/3 -translate-y-1/2 flex-col items-center gap-2">
        <span className="text-[11px] font-bold text-white">07</span>
        <span className="w-4 h-[2px] bg-white" />
      </div>

      <div ref={ref} className="py-16 lg:py-28 px-4 sm:px-6 lg:px-20 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-[clamp(24px,3.5vw,52px)] font-extrabold leading-[1.1] tracking-[-1px] mb-6 lg:mb-8">
              <span className="text-[#f5f3ff]">The next generation</span>
              <br />
              <span className="text-[#f5f3ff]">of creators won&apos;t</span>
              <br />
              <span className="text-[#f5f3ff]">stream </span>
              <span className="text-[#b58af7]">alone.</span>
            </h2>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.02, backgroundColor: '#9d5cf6' }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 bg-[#7c3aed] text-white text-[13.5px] font-semibold rounded-lg transition-all shadow-[0_0_25px_rgba(124,58,237,0.3)]"
            >
              Meet Your Cohost
            </motion.button>
          </motion.div>

          {/* Right Content - Dark atmospheric scene */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-gradient-to-br from-[#1a1628] via-[#13111e] to-[#0d0b14]">
              {/* Atmospheric stars/particles */}
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-0.5 h-0.5 bg-white rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 60}%`,
                    opacity: 0.2 + Math.random() * 0.4,
                  }}
                  animate={{ opacity: [0.2, 0.6, 0.2] }}
                  transition={{
                    duration: 2 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}

              {/* Silhouette scene at bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-1/2">
                <svg viewBox="0 0 400 100" preserveAspectRatio="none" className="w-full h-full">
                  <path
                    d="M0,100 L0,70 L50,70 L50,50 L80,50 L80,60 L120,60 L120,40 L150,40 L150,55 L180,55 L180,35 L220,35 L220,50 L260,50 L260,45 L300,45 L300,60 L340,60 L340,50 L380,50 L380,65 L400,65 L400,100 Z"
                    fill="#0d0b14"
                  />
                </svg>
              </div>

              {/* Purple glow */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-24 rounded-full bg-[rgba(124,58,237,0.25)] blur-[50px]" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
