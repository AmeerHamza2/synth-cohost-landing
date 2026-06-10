'use client';

import { motion, useInView, Variants } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';

export default function StreamingDemands() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
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

  const demands = ['More chat.', 'More content.', 'More pressure.', 'Always on.'];

  return (
    <section 
      data-section="02" 
      className="relative bg-[#0d0b14] overflow-hidden"
    >
      {/* Text Section with 02 */}
      <div className="relative">
        {/* Section Number - Left Side - Hidden on mobile */}
        <div className="hidden md:flex absolute left-6 lg:left-10 top-1/3 -translate-y-1/2 flex-col items-center gap-2 z-10">
          <span className="text-[11px] font-bold text-white">02</span>
          <span className="w-4 h-[2px] bg-white" />
        </div>

        <div ref={ref} className="py-20 lg:py-24 px-6 lg:px-20 max-w-7xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-start"
          >
            {/* Left Column */}
            <motion.div variants={itemVariants}>
              <h2 className="text-[clamp(24px,2.5vw,36px)] font-extrabold text-[#f5f3ff] leading-[1.2] mb-7">
                Streaming is
                <br />
                more demanding than ever.
              </h2>

              {/* Tags */}
              <div className="flex flex-wrap gap-3">
                {demands.map((text) => (
                  <span
                    key={text}
                    className="text-[13px] text-[#a09bbf] px-3.5 py-1.5 border border-[rgba(255,255,255,0.07)] rounded-full"
                  >
                    {text}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Right Column */}
            <motion.div variants={itemVariants}>
              <h2 className="text-[clamp(28px,3vw,44px)] font-extrabold leading-[1.2]">
                <span className="text-[#f5f3ff]">What if</span>
                <br />
                <span className="text-[#f5f3ff]">you didn&apos;t have to</span>
                <br />
                <span className="text-[#b58af7]">stream alone?</span>
              </h2>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Image Section with 03 */}
      <div className="relative">
        {/* Section Number - Left Side - Hidden on mobile */}
        <div className="hidden md:flex absolute left-6 lg:left-10 top-1/3 -translate-y-1/2 flex-col items-center gap-2 z-10">
          <span className="text-[11px] font-bold text-white">03</span>
          <span className="w-4 h-[2px] bg-white" />
        </div>

        {/* Full Width Character Image */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-full"
        >
          <Image
            src="/change_lossless.webp"
            alt="Synth AI Character"
            width={1920}
            height={800}
            className="w-full h-auto object-cover"
            unoptimized
          />
        </motion.div>
      </div>
    </section>
  );
}
