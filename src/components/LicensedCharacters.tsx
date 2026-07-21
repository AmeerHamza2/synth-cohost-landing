'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Sparkles } from 'lucide-react';

export default function LicensedCharacters() {
  const characters = [
    '/synth_character_lossless.webp',
    '/stream_lossless.webp',
    '/background_lossless.webp',
    '/files_lossless (1).webp',
    '/change_lossless.webp',
  ];

  return (
    <section className="py-20 px-6 lg:px-12 max-w-[1450px] mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="
        overflow-hidden
        rounded-[22px]
        border border-[#8B3DFF]/20
        bg-gradient-to-b
        from-[#12131F]
        to-[#090A14]
        shadow-[0_10px_40px_rgba(0,0,0,.35)]
        "
      >
        <div className="grid grid-cols-12 min-h-[220px]">

          {/* LEFT */}
          <div className="col-span-12 lg:col-span-3 flex flex-col justify-center p-8 border-r border-white/5">

            <div className="flex items-start gap-3 mb-5">

              <Sparkles
                size={20}
                className="text-[#8B3DFF] mt-1"
              />

          <h2 className="text-white text-[28px] font-bold uppercase leading-tight">
  PREMIUM LICENSED
  <br />
  CHARACTERS
</h2>

</div>

<p className="mt-5 text-[#A8A8B5] text-[15px] leading-7 max-w-[260px]">
  Expand your collection with officially licensed AI companions inspired by
  iconic characters from pop culture, video games, television, films, and
  more. Licensed characters will be available as individual purchases.
</p>

          </div>

          {/* CENTER */}
          <div className="col-span-12 lg:col-span-7 flex items-end justify-center px-2">

            <div className="flex gap-1 h-full items-end py-2">

              {characters.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{
                    opacity: 0,
                    y: 25,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{ once: true }}
                  transition={{
                    delay: index * .08,
                    duration: .45,
                  }}
                  whileHover={{
                    y: -6,
                    scale: 1.03,
                  }}
                  className="
                  w-[105px]
                  h-[190px]
                  rounded-xl
                  overflow-hidden
                  border
                  border-white/10
                  bg-[#11111C]
                  transition-all
                  "
                >
                  <Image
                    src={image}
                    alt=""
                    width={120}
                    height={220}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                </motion.div>
              ))}

            </div>

          </div>

          {/* RIGHT */}
          <div className="col-span-12 lg:col-span-2 border-l border-white/5">

            <div className="h-full flex flex-col items-center justify-center px-6 text-center">

              <p className="text-sm text-[#A7A8B8]">
                Starting from
              </p>

              <h3 className="text-[52px] font-black text-[#8B3DFF] leading-none my-3">
                $39.99
              </h3>

              <p className="text-[#8B3DFF] text-sm">
                One-time purchase
              </p>

              <p className="text-[#8B3DFF] text-sm my-2">
                +
              </p>

              <p className="text-[#A7A8B8] text-sm text-center leading-6">
                Plus optional
                <br />
                AI subscription
              </p>

             <button
  className="
    mt-6
    h-11
    px-6
    whitespace-nowrap
    rounded-lg
    border
    border-[#8B3DFF]/40
    text-white
    text-sm
    font-medium
    hover:bg-[#8B3DFF]
    hover:border-[#8B3DFF]
    transition-all
    duration-300
  "
>
  Explore Characters
</button>

            </div>

          </div>

        </div>
      </motion.div>
    </section>
  );
}