'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';

const features = [
  {
    title: 'Responds to chat',
    description: 'Engages your audience in real time.',
    icon: (
      <svg className="w-8 h-8 text-[#b58af7]" viewBox="0 0 32 32" fill="none">
        <rect x="4" y="8" width="24" height="18" rx="3" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M4 13h24" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="16" cy="21" r="2" fill="currentColor"/>
      </svg>
    ),
  },
  {
    title: 'Understands context',
    description: 'Follows the flow and remembers key details.',
    icon: (
      <svg className="w-8 h-8 text-[#b58af7]" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="11" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M16 10v6l4 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    title: 'Supports your workflow',
    description: 'Helps keep your stream on track.',
    icon: (
      <svg className="w-8 h-8 text-[#b58af7]" viewBox="0 0 32 32" fill="none">
        <path d="M8 24V14a8 8 0 1116 0v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M4 24h24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
];

export default function MeetSynth() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section 
      data-section="04" 
      className="relative bg-[#0d0b14] border-t border-[rgba(255,255,255,0.07)] overflow-hidden"
      id="features"
    >
      {/* Section Number - Left Side */}
      <div className="absolute left-6 lg:left-10 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
        <span className="text-[11px] font-bold text-white">04</span>
        <span className="w-4 h-[2px] bg-white" />
      </div>

      <div ref={ref} className="py-24 lg:py-28 px-6 lg:px-20 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Left - Character Portrait */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden bg-gradient-to-b from-[#1a1628] to-[#0d0b14]">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[80%] aspect-[3/4] rounded-xl bg-gradient-to-br from-[#2a2040] to-[#1a1628] flex items-end justify-center overflow-hidden">
                  <Image
                    src="/synth_character_lossless.webp"
                    alt="Synth AI Character"
                    fill
                    className="object-cover object-top"
                    unoptimized
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right - Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="text-[10.5px] font-bold tracking-[2px] uppercase text-[#7c3aed] mb-4 block">
              Meet Synth
            </span>

            <h2 className="text-[clamp(28px,3vw,42px)] font-extrabold text-[#f5f3ff] leading-[1.1] tracking-[-1px] mb-4">
              Your AI cohost.
              <br />
              Designed for live.
            </h2>

            <p className="text-[14.5px] text-[#a09bbf] leading-[1.7] mb-9 max-w-md">
              Synth listens, understands context, and participates naturally across your entire stream.
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-3 gap-5">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                >
                  <div className="mb-2.5">{feature.icon}</div>
                  <h4 className="text-[13px] font-bold text-[#f5f3ff] mb-1.5">
                    {feature.title}
                  </h4>
                  <p className="text-[12.5px] text-[#a09bbf] leading-[1.5]">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
