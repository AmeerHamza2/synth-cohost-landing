'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import SectionWrapper from './SectionWrapper';

export default function FinalCTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <SectionWrapper sectionNumber="07" isDark={true}>
      <div ref={ref} className="py-32 pr-6 lg:pr-8 overflow-hidden">
        <div className="relative max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl lg:text-6xl font-bold text-white leading-tight">
                The next generation
                <br />
                of creators won&apos;t
                <br />
                stream{' '}
                <span className="text-gradient-purple">alone.</span>
              </h2>
            </motion.div>

            {/* Right Content */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              {/* Image container with city night scene */}
              <div className="editorial-card relative rounded-[20px] overflow-hidden aspect-[4/3] bg-[rgba(17,17,27,0.8)] backdrop-blur-[12px] border border-[rgba(139,92,246,0.25)] shadow-[0_0_40px_rgba(139,92,246,0.2)]">
                {/* Background gradient simulating city at night */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] via-[#11111B] to-[#080812]">
                  {/* Stars/lights effect */}
                  {[
                    { left: 5, top: 10, opacity: 0.8, duration: 2.5, delay: 0.5 },
                    { left: 15, top: 25, opacity: 0.6, duration: 3, delay: 1 },
                    { left: 25, top: 8, opacity: 0.9, duration: 2.2, delay: 0.3 },
                    { left: 35, top: 35, opacity: 0.5, duration: 3.5, delay: 1.5 },
                    { left: 45, top: 15, opacity: 0.7, duration: 2.8, delay: 0.8 },
                    { left: 55, top: 28, opacity: 0.6, duration: 3.2, delay: 1.2 },
                    { left: 65, top: 5, opacity: 0.8, duration: 2.3, delay: 0.6 },
                    { left: 75, top: 20, opacity: 0.5, duration: 3.8, delay: 1.8 },
                    { left: 85, top: 32, opacity: 0.7, duration: 2.6, delay: 0.9 },
                    { left: 95, top: 12, opacity: 0.9, duration: 3, delay: 0.4 },
                    { left: 10, top: 40, opacity: 0.6, duration: 2.9, delay: 1.1 },
                    { left: 20, top: 45, opacity: 0.8, duration: 2.4, delay: 0.7 },
                    { left: 30, top: 50, opacity: 0.5, duration: 3.3, delay: 1.6 },
                    { left: 40, top: 38, opacity: 0.7, duration: 2.7, delay: 0.2 },
                    { left: 50, top: 48, opacity: 0.6, duration: 3.1, delay: 1.3 },
                    { left: 60, top: 42, opacity: 0.8, duration: 2.5, delay: 0.5 },
                    { left: 70, top: 55, opacity: 0.5, duration: 3.6, delay: 1.9 },
                    { left: 80, top: 50, opacity: 0.7, duration: 2.8, delay: 0.8 },
                    { left: 90, top: 45, opacity: 0.9, duration: 2.2, delay: 0.1 },
                    { left: 12, top: 55, opacity: 0.6, duration: 3.4, delay: 1.4 },
                    { left: 28, top: 18, opacity: 0.8, duration: 2.6, delay: 0.6 },
                    { left: 38, top: 22, opacity: 0.5, duration: 3.2, delay: 1.7 },
                    { left: 48, top: 58, opacity: 0.7, duration: 2.9, delay: 0.3 },
                    { left: 58, top: 30, opacity: 0.6, duration: 3, delay: 1 },
                    { left: 68, top: 38, opacity: 0.8, duration: 2.4, delay: 0.9 },
                    { left: 78, top: 15, opacity: 0.5, duration: 3.5, delay: 1.2 },
                    { left: 88, top: 28, opacity: 0.7, duration: 2.7, delay: 0.4 },
                    { left: 8, top: 32, opacity: 0.9, duration: 2.3, delay: 1.5 },
                    { left: 42, top: 8, opacity: 0.6, duration: 3.1, delay: 0.7 },
                    { left: 72, top: 48, opacity: 0.8, duration: 2.5, delay: 1.8 },
                  ].map((star, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-white rounded-full"
                      style={{
                        left: `${star.left}%`,
                        top: `${star.top}%`,
                        opacity: star.opacity,
                      }}
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{
                        duration: star.duration,
                        repeat: Infinity,
                        delay: star.delay,
                      }}
                    />
                  ))}

                  {/* City skyline silhouette */}
                  <div className="absolute bottom-0 left-0 right-0 h-1/3">
                    <svg viewBox="0 0 400 100" preserveAspectRatio="none" className="w-full h-full">
                      <path
                        d="M0,100 L0,60 L20,60 L20,40 L40,40 L40,50 L60,50 L60,30 L80,30 L80,45 L100,45 L100,35 L120,35 L120,55 L140,55 L140,25 L160,25 L160,40 L180,40 L180,20 L200,20 L200,45 L220,45 L220,30 L240,30 L240,50 L260,50 L260,35 L280,35 L280,55 L300,55 L300,25 L320,25 L320,45 L340,45 L340,40 L360,40 L360,55 L380,55 L380,45 L400,45 L400,100 Z"
                        fill="#080812"
                    />
                  </svg>
                  {/* City lights */}
                  <div className="absolute bottom-0 left-0 right-0 h-full">
                    {[
                      { bottom: 35, duration: 1.5, delay: 0.2 },
                      { bottom: 45, duration: 2.1, delay: 0.5 },
                      { bottom: 28, duration: 1.8, delay: 0.8 },
                      { bottom: 52, duration: 2.5, delay: 0.3 },
                      { bottom: 38, duration: 1.3, delay: 0.9 },
                      { bottom: 48, duration: 2.2, delay: 0.1 },
                      { bottom: 32, duration: 1.6, delay: 0.6 },
                      { bottom: 55, duration: 2.8, delay: 0.4 },
                      { bottom: 42, duration: 1.9, delay: 0.7 },
                      { bottom: 30, duration: 2.4, delay: 0.2 },
                      { bottom: 50, duration: 1.4, delay: 0.8 },
                      { bottom: 36, duration: 2.0, delay: 0.5 },
                      { bottom: 44, duration: 1.7, delay: 0.3 },
                      { bottom: 58, duration: 2.6, delay: 0.9 },
                      { bottom: 40, duration: 1.2, delay: 0.1 },
                      { bottom: 46, duration: 2.3, delay: 0.6 },
                      { bottom: 34, duration: 1.5, delay: 0.4 },
                      { bottom: 52, duration: 2.1, delay: 0.7 },
                      { bottom: 38, duration: 1.8, delay: 0.2 },
                      { bottom: 48, duration: 2.5, delay: 0.8 },
                    ].map((light, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-2 bg-[#8B5CF6]"
                        style={{
                          left: `${5 + i * 5}%`,
                          bottom: `${light.bottom}%`,
                          opacity: 0.5,
                        }}
                        animate={{ opacity: [0.3, 0.8, 0.3] }}
                        transition={{
                          duration: light.duration,
                          repeat: Infinity,
                          delay: light.delay,
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Silhouettes of two creators */}
                <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 flex gap-8">
                  {/* Person 1 */}
                  <div className="w-16 h-32 bg-[#11111B] rounded-t-full relative">
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-10 h-10 bg-[#11111B] rounded-full" />
                  </div>
                  {/* Person 2 */}
                  <div className="w-16 h-28 bg-[#11111B] rounded-t-full relative">
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-10 h-10 bg-[#11111B] rounded-full" />
                  </div>
                </div>

                {/* Purple glow overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#8B5CF6]/20 to-transparent" />
              </div>

              {/* Text overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-[#080812] to-transparent">
                <p className="text-xl lg:text-2xl font-semibold text-white">
                  They will stream
                  <br />
                  alongside <span className="text-gradient-purple">intelligence.</span>
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-8 w-full lg:w-auto px-8 py-4 bg-gradient-to-r from-[#8B5CF6] to-[#7C4FE0] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-[#8B5CF6]/30 transition-all flex items-center justify-center gap-2 glow-purple"
            >
              Meet Your Cohost
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </div>

        {/* Background ambient glow */}
        <motion.div
          animate={{ opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full bg-[#8B5CF6]/10 blur-[150px] pointer-events-none"
        />
      </div>
    </SectionWrapper>
  );
}
