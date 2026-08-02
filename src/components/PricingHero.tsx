'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Menu, Hexagon } from 'lucide-react';
import GlassCard from './GlassCard';

export default function PricingHero() {
  const features = [
    {
      image: '/brain.png',
      title: 'Same AI Core',
      description: 'One intelligence that connects every experience.',
      color: '#8B3DFF',
      useIcon: false,
    },
    {
      image: '/cloud.png',
      title: 'Cross-Device Continuity',
      description:
        'Your memories, personality, and settings follow you everywhere.',
      color: '#48C8FF',
      useIcon: false,
    },
  ];

  return (
    <>
      {/* Mobile Version */}
      <section className="md:hidden relative overflow-hidden bg-[#050505] pt-20 pb-4 px-4 max-w-[420px] mx-auto">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-10 w-32 h-32 bg-[#7A3CFF]/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#35B5FF]/15 rounded-full blur-3xl" />
        </div>

        {/* Header */}
        <div className="relative z-10 flex items-center justify-end mb-4">
          {/* Hamburger Menu */}
        
        </div>

        {/* Pill Badge */}
        <div className="relative z-10 mb-5">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#101018] border border-[rgba(170,80,255,0.18)] text-[#7A3CFF] text-xs font-semibold uppercase tracking-wider">
            One AI. Everywhere.
          </span>
        </div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 mb-[18px]"
        >
          <h1 className="text-[42px] font-extrabold uppercase leading-[0.95] tracking-[-1px] text-white">
            TWO EXPERIENCES.
            <br />
            <span className="bg-gradient-to-r from-[#7A3CFF] to-[#A94DFF] bg-clip-text text-transparent">
              ONE SYN.
            </span>
          </h1>
        </motion.div>

        {/* Supporting Headline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative z-10 text-white text-[20px] font-semibold mb-4"
        >
          Different surfaces.
          <br />
          Same personalities.
        </motion.p>

        {/* Body Copy */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="relative z-10 text-[#C6C6C6] text-[15px] font-normal mb-7 leading-relaxed"
        >
          Whether you're on your desktop or live on stream, Syn is with you.
          <br />
          Smarter. Sharper. More you.
        </motion.p>

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10 w-full h-[280px] mb-8"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050505] z-10" />
          <Image
            src="/1 UUU.png"
            alt="Pricing Hero"
            fill
            className="object-contain"
            unoptimized
          />
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative z-10 grid grid-cols-2 gap-4"
        >
          <GlassCard className="p-4 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-[#7A3CFF] font-semibold text-sm mb-1 uppercase">Same AI Core</h3>
              <p className="text-[#9CA3AF] text-xs leading-relaxed">One intelligence core  connects every experience.</p>
            </div>
            <div className="absolute right-0 top-0 bottom-0 w-16 opacity-20">
              <Image
                src="/brain.png"
                alt="Same AI Core"
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          </GlassCard>

          <GlassCard className="p-4 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-[#7A3CFF] font-semibold text-sm mb-1 uppercase">Cross-Device CONTINUITY</h3>
              <p className="text-[#9CA3AF] text-xs leading-relaxed">Your memories, personality, and settings follow you everywhere.</p>
            </div>
            <div className="absolute right-0 top-0 bottom-0 w-16 opacity-20">
              <Image
                src="/cloud.png"
                alt="Cross-Device"
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          </GlassCard>
        </motion.div>
      </section>

      {/* Desktop Version (Unchanged) */}
      <section className="hidden md:block relative overflow-hidden bg-black py-16 md:py-10 lg:py-2">
        {/* Background Glow */}
        <div className="absolute left-[-120px] top-[120px] h-[420px] w-[420px] rounded-full bg-[#8B3DFF]/5 blur-[180px]" />
        <div className="absolute right-[-150px] top-[60px] h-[500px] w-[500px] rounded-full bg-[#7C3AED]/5 blur-[220px]" />
        <div className="absolute bottom-[-100px] right-[120px] h-[380px] w-[380px] rounded-full bg-[#3B82F6]/5 blur-[180px]" />

        <div className="relative mx-auto grid max-w-[1400px] grid-cols-1 md:grid-cols-[42%_58%] items-center gap-16 px-6 lg:px-12">

          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .7 }}
          >
            <p className="mb-6 text-[14px] font-semibold uppercase tracking-[2px] text-[#9B5CFF]">
              OUR PRODUCTS
            </p>

            <h1 className="text-[48px] font-bold uppercase leading-[0.95] tracking-[-2px] text-white xl:text-[52px] md:text-[42px]">
              TWO EXPERIENCES.
              <br />
              <span className="text-[#8B3DFF]">
                ONE SYN.
              </span>
              <br />
              DIFFERENT SURFACES
              <br />
              SAME PERSONALITIES.
            </h1>

            <p className="mt-8 max-w-[430px] text-[16px] leading-[1.8] text-[#A8A8B5]">
              Whether you're on your desktop
              <br />
              or live on stream, Syn is with you.
              <br />
              Smarter. Sharper. More you.
            </p>

            {/* FEATURES */}

            <div className="mt-32 md:mt-14 flex gap-10">

              {features.map((feature) => {
                return (
                  <div
                    key={feature.title}
                    className="flex items-center gap-4 max-w-[280px]"
                  >
                    <div
                      className="flex-shrink-0 flex h-[60px] w-[60px] items-center justify-center rounded-full border border-[#8B3DFF]/30 bg-[#12121E] shadow-[0_0_30px_rgba(139,61,255,.25)]"
                    >
                      <Image
                        src={feature.image}
                        alt={feature.title}
                        width={40}
                        height={40}
                        className="w-10 h-10"
                        unoptimized
                      />
                    </div>

                    <div>
                      <h3
                        className="mb-2 text-[14px] font-medium"
                        style={{ color: feature.color }}
                      >
                        {feature.title}
                      </h3>

                      <p className="text-[14px] leading-7 text-[#A8A8B5]">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}

            </div>
          </motion.div>

          {/* RIGHT */}

          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: .8 }}
            className="relative flex items-center justify-center mt-10"
          >
            {/* Purple glow behind image */}

            <div className="absolute h-[480px] w-[480px] md:h-[720px] md:w-[720px] rounded-full bg-[#8B3DFF]/15 blur-[170px]" />

            <div className="relative h-[900px] md:h-[760px] w-full">
              <Image
                src="/1 UUU.png"
                alt="Pricing Hero"
                fill
                priority
                unoptimized
                className=""
              />
            </div>
          </motion.div>

        </div>
      </section>
    </>
  );
}