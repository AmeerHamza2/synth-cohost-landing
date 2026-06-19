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

      className="relative bg-black overflow-hidden"

    >

      {/* Text Section with 02 */}

      <div className="relative">

        {/* Section Number - Left Side */}

        <div className="absolute left-6 lg:left-10 top-1/3 -translate-y-1/2 flex flex-col items-center gap-2 z-10">

          <span className="text-[11px] font-bold text-white">02</span>

          <span className="w-4 h-[2px] bg-white" />

        </div>



        <div ref={ref} className="py-8 lg:py-12 px-6 lg:px-20 max-w-7xl mx-auto">

          <motion.div

            variants={containerVariants}

            initial="hidden"

            animate={isInView ? 'visible' : 'hidden'}

            className="grid lg:grid-cols-2 gap-20 items-start"

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

      <div className="relative" data-section="03">

        {/* Section Number - Left Side */}

        <div className="hidden md:flex absolute left-6 lg:left-10 top-1/3 -translate-y-1/2 flex-col items-center gap-2 z-10">

          <span className="text-[11px] font-bold text-white">03</span>

          <span className="w-4 h-[2px] bg-white" />

        </div>



        {/* Full Width Character Image */}

        <motion.div

          initial={{ opacity: 0, y: 40 }}

          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}

          transition={{ duration: 0.8, delay: 0.3 }}

          className="w-full relative"

        >

          <Image

            src="/change_lossless.webp"

            alt="Synth AI Character"

            width={1920}

            height={800}

            className="w-full h-auto object-cover"

            unoptimized

          />



          {/* Text Overlay */}

          <div className="absolute inset-0 flex items-center px-6 lg:px-20">

            <div className="w-1/2 lg:w-2/5 ml-20 lg:ml-90">

              {/* Label */}

              <motion.span

                initial={{ opacity: 0 }}

                animate={isInView ? { opacity: 1 } : { opacity: 0 }}

                transition={{ duration: 0.6, delay: 0.4 }}

                className="text-[10px] font-bold uppercase tracking-[3px] text-[#c4b5fd] mb-3 block"

              >

                MEET SYNTH

              </motion.span>



              {/* Main Heading */}

              <motion.h2

                initial={{ opacity: 0, y: 20 }}

                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}

                transition={{ duration: 0.6, delay: 0.5 }}

                className="text-[clamp(24px,4vw,42px)] font-bold text-white leading-[1.1] tracking-[-1px] mb-6"

              >

                Your AI cohost:

                <br />

                Designed for live.

              </motion.h2>



              {/* Description */}

              <motion.p

                initial={{ opacity: 0, y: 20 }}

                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}

                transition={{ duration: 0.6, delay: 0.6 }}

                className="text-[13px] text-[#d1d5db] leading-[1.7] mb-8 max-w-[450px]"

              >

                Synth listens, understands context, and participates naturally across your entire stream.

              </motion.p>



              {/* Features Row */}

              <motion.div

                initial={{ opacity: 0, y: 20 }}

                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}

                transition={{ duration: 0.6, delay: 0.7 }}

                className="flex gap-8"

              >

                {/* Feature 1 */}

                <motion.div

                  whileHover={{ y: -4, transition: { duration: 0.3 } }}

                  className="group flex-1"

                >

                  <div className="flex items-start gap-2">

                    <div className="flex-shrink-0 mt-0.5">

                      <div className="flex items-center justify-center w-6 h-6 rounded bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 group-hover:from-purple-500/30 group-hover:to-purple-600/30 transition-all">

                        <svg className="w-3 h-3 text-purple-400" fill="currentColor" viewBox="0 0 20 20">

                          <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5z" />

                        </svg>

                      </div>

                    </div>

                    <div className="flex-1">

                      <p className="text-[12px] font-semibold text-white mb-1 whitespace-nowrap">Responds to chat</p>

                      <p className="text-[11px] text-[#d1d5db] leading-[1.4] whitespace-nowrap">Engages your audience in real time.</p>

                    </div>

                  </div>

                </motion.div>



                {/* Feature 2 */}

                <motion.div

                  whileHover={{ y: -4, transition: { duration: 0.3 } }}

                  className="group flex-1"

                >

                  <div className="flex items-start gap-2">

                    <div className="flex-shrink-0 mt-0.5">

                      <div className="flex items-center justify-center w-6 h-6 rounded bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 group-hover:from-purple-500/30 group-hover:to-purple-600/30 transition-all">

                        <svg className="w-3 h-3 text-purple-400" fill="currentColor" viewBox="0 0 20 20">

                          <path d="M10 3a1 1 0 011 1v6h6a1 1 0 110 2h-6v6a1 1 0 11-2 0v-6H3a1 1 0 110-2h6V4a1 1 0 011-1z" />

                        </svg>

                      </div>

                    </div>

                    <div className="flex-1">

                      <p className="text-[12px] font-semibold text-white mb-1 whitespace-nowrap">Understands context</p>

                      <p className="text-[11px] text-[#d1d5db] leading-[1.4] whitespace-nowrap">Follows the flow and remembers key details.</p>

                    </div>

                  </div>

                </motion.div>



                {/* Feature 3 */}

                <motion.div

                  whileHover={{ y: -4, transition: { duration: 0.3 } }}

                  className="group flex-1"

                >

                  <div className="flex items-start gap-2">

                    <div className="flex-shrink-0 mt-0.5">

                      <div className="flex items-center justify-center w-6 h-6 rounded bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 group-hover:from-purple-500/30 group-hover:to-purple-600/30 transition-all">

                        <svg className="w-3 h-3 text-purple-400" fill="currentColor" viewBox="0 0 20 20">

                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />

                        </svg>

                      </div>

                    </div>

                    <div className="flex-1">

                      <p className="text-[12px] font-semibold text-white mb-1 whitespace-nowrap">Supports your workflow</p>

                      <p className="text-[11px] text-[#d1d5db] leading-[1.4] whitespace-nowrap">Helps keep your stream on track.</p>

                    </div>

                  </div>

                </motion.div>

              </motion.div>

            </div>

          </div>

        </motion.div>

      </div>

    </section>

  );

}

