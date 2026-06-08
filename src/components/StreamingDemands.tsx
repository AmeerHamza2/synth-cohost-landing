'use client';

import { motion, useInView, Variants } from 'framer-motion';
import { useRef } from 'react';
import SectionWrapper from './SectionWrapper';

export default function StreamingDemands() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <SectionWrapper sectionNumber="02" isDark={true}>
      <div ref={ref} className="py-32 pr-6 lg:pr-8 overflow-hidden">
        {/* Grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="relative max-w-6xl"
        >
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Left Column */}
            <motion.div variants={itemVariants}>
              <h2 className="text-4xl lg:text-6xl font-bold text-white leading-tight mb-12">
                Streaming is
                <br />
                <span className="text-[#B0B0C0]">more demanding than ever.</span>
              </h2>

              <div className="space-y-6">
                {['More chat.', 'More content.', 'More pressure.', 'Always on.'].map(
                  (text, index) => (
                    <motion.div
                      key={text}
                      variants={itemVariants}
                      className="flex items-center gap-4 group"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={isInView ? { scale: 1 } : { scale: 0 }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
                        className="w-3 h-3 rounded-full bg-[#8B5CF6] group-hover:glow-purple-sm transition-all"
                      />
                      <span className="text-2xl lg:text-3xl font-medium text-[#B0B0C0] group-hover:text-white transition-colors">
                        {text}
                      </span>
                    </motion.div>
                  )
                )}
              </div>
            </motion.div>

            {/* Right Column */}
            <motion.div variants={itemVariants}>
              <h2 className="text-4xl lg:text-6xl font-bold leading-tight">
                <span className="text-[#B0B0C0]">What if</span>
                <br />
                <span className="text-white">you didn&apos;t have to</span>
                <br />
                <span className="text-gradient-purple">stream alone?</span>
              </h2>

              {/* Decorative element */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                transition={{ delay: 0.8, duration: 0.8, ease: 'easeOut' }}
                className="mt-12 h-1 w-32 bg-gradient-to-r from-[#8B5CF6] to-[#C4B5FD] rounded-full origin-left"
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Ambient glow effects */}
        <motion.div
          animate={{ opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/2 left-1/4 w-96 h-96 rounded-full bg-[#8B5CF6]/20 blur-[100px] pointer-events-none"
        />
        <motion.div
          animate={{ opacity: [0.05, 0.15, 0.05] }}
          transition={{ duration: 6, repeat: Infinity, delay: 2 }}
          className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-[#C4B5FD]/20 blur-[80px] pointer-events-none"
        />
      </div>
    </SectionWrapper>
  );
}
