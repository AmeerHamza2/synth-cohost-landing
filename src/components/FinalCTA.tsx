'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';

export default function FinalCTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section 
      data-section="07" 
      className="relative bg-black overflow-hidden"
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

            <div className="flex flex-col gap-3">
              <a 
                href="#" 
                className="inline-flex items-center gap-2.5 text-[13px] font-semibold text-[#a09bbf] border-b border-[rgba(255,255,255,0.2)] pb-0.5 hover:text-white transition-colors w-fit"
              >
                Meet Your Cohost <span>▷</span>
              </a>
              <a 
                href="#" 
                className="inline-flex items-center gap-2.5 text-[13px] font-semibold text-[#a09bbf] border-b border-[rgba(255,255,255,0.2)] pb-0.5 hover:text-white transition-colors w-fit"
              >
                Start Free <span>▷</span>
              </a>
            </div>
          </motion.div>

          {/* Right Content - Background Image */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative rounded-xl overflow-hidden aspect-[4/3]"
          >
            <Image
              src="/background_lossless.webp"
              alt="Meet Your Cohost"
              fill
              className="object-cover"
              unoptimized
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
