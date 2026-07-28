'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

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
    <section className="relative overflow-hidden bg-black py-16 md:py-10  lg:py-2">
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
  );
}