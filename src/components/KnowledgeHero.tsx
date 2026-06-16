'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';

export default function KnowledgeHero() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      data-section="06"
      className="relative bg-black overflow-hidden py-4 lg:py-6"
      ref={ref}
    >
      {/* Section Number - Left Side - Hidden on mobile */}
      <div className="hidden md:flex absolute left-6 lg:left-10 top-1/2 -translate-y-1/2 flex-col items-center gap-2 z-20">
        <span className="text-[11px] font-bold text-white">06</span>
        <span className="w-4 h-[2px] bg-white" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-20 w-full">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col lg:flex-row items-start lg:items-center gap-8 lg:gap-8"
        >
          {/* Left Content */}
          <div className="w-full lg:w-auto flex-shrink-0 text-center lg:text-left">
            <div className="text-[10px] tracking-[0.13em] text-[#a09bbf] uppercase mb-2.5">
              Your knowledge. Her knowledge.
            </div>
            <h2 className="text-[22px] lg:text-[26px] font-medium text-[#f5f3ff] leading-[1.3] mb-4 lg:mb-6">
              Teach Synth what matters.
            </h2>
            <p className="text-[13px] text-[#a09bbf] leading-[1.5] mb-6 hidden lg:block">
              Upload your docs, notes, and resources. Synth turns them into real-time intel.
            </p>
         <a 
                href="#" 
                className="inline-flex items-center gap-2.5 text-[13px] font-semibold text-[#a09bbf] border-b border-[rgba(255,255,255,0.2)] pb-0.5 hover:text-white transition-colors w-fit"
              >
                Learn more <span>▷</span>
              </a>
          </div>

          {/* Right Image */}
          <div className="w-full lg:flex-1 min-w-0 bg-[#1a0b2e] relative">
            <Image
              src="/BK3.png"
              alt="Documents and files"
              width={1200}
              height={500}
              className="w-full h-auto"
              priority
            />
            <Image
              src="/mines.png"
              alt="Overlay"
              width={1200}
              height={500}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[96%] h-auto object-contain"
              priority
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
