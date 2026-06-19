'use client';

import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const chatMessages = [
  { user: 'StreamFan42', message: "Let's gooo! Great stream!", isAI: false },
  { user: 'Synth AI', message: "Thanks StreamFan42! Stick around, we're just getting started!", isAI: true },
  { user: 'GamerPro', message: 'How do you do that move?', isAI: false },
  { user: 'Synth AI', message: "Great question! That's the dash-cancel technique.", isAI: true },
  { user: 'NewViewer123', message: 'Just followed!', isAI: false },
  { user: 'Synth AI', message: "Welcome to the community NewViewer123!", isAI: true },
];

export default function LivestreamShowcase() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section 
      data-section="05" 
      className="relative bg-black overflow-hidden"
      id="product"
    >
      {/* Section Number - Left Side - Hidden on mobile */}
      <div className="hidden md:flex absolute left-6 lg:left-10 top-1/3 -translate-y-1/2 flex-col items-center gap-2">
        <span className="text-[11px] font-bold text-white">05</span>
        <span className="w-4 h-[2px] bg-white" />
      </div>

      <div ref={ref} className="py-6 lg:py-12 px-4 sm:px-6 lg:px-20 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-[280px_1fr] gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-[clamp(24px,3vw,42px)] font-extrabold leading-[1.1] tracking-[-1px] mb-4 lg:mb-6">
              <span className="text-[#f5f3ff]">See Synth in action</span>
              <br />
              <span className="text-[#b58af7]">where it matters.</span>
            </h2>

            <p className="text-[14.5px] text-[#a09bbf] leading-[1.7] mb-8 max-w-md">
          From chat to conversation to content—Synth is part of every moment.
            </p>

             <a 
                href="#" 
                className="inline-flex items-center gap-2.5 text-[13px] font-semibold text-[#a09bbf] border-b border-[rgba(255,255,255,0.2)] pb-0.5 hover:text-white transition-colors w-fit"
              >
                Watch  Demo <span>▷</span>
              </a>
          </motion.div>

          {/* Right Content - Livestream Dashboard Preview */}
          <div className="flex flex-col lg:flex-row gap-6">
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative max-w-[500px]"
            >
              <div className="relative rounded-xl overflow-hidden bg-[#13111e] border border-[rgba(255,255,255,0.05)] group/player">
                {/* Video Player Area */}
                <div className="relative aspect-video bg-gradient-to-br from-[#1a1628] to-[#0d0b14] cursor-pointer overflow-hidden max-h-[350px]">
                {/* Stream image content */}
                <div className="absolute inset-0 overflow-hidden">
                  <video
                    src="/WhatsApp3.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover group-hover/player:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d0b14]/80 via-transparent to-transparent" />
                </div>

                {/* Play button overlay */}
                <motion.div
                  className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover/player:opacity-100 transition-opacity duration-300"
                >
                  <motion.div
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-16 h-16 rounded-full bg-[rgba(255,0,0,0.8)] flex items-center justify-center backdrop-blur cursor-pointer shadow-lg"
                  >
                    <svg className="w-7 h-7 text-white ml-1" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="5,3 19,12 5,21" />
                    </svg>
                  </motion.div>
                </motion.div>

                {/* Stream controls on hover */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  className="absolute bottom-4 right-4 flex items-center gap-2 opacity-0 group-hover/player:opacity-100 transition-opacity duration-300"
                >
                  <button className="w-7 h-7 rounded bg-black/40 hover:bg-black/60 flex items-center justify-center text-white/70 hover:text-white transition-all">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                      <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
                    </svg>
                  </button>
                  <button className="w-7 h-7 rounded bg-black/40 hover:bg-black/60 flex items-center justify-center text-white/70 hover:text-white transition-all text-[10px] font-bold">
                    <span>1080p</span>
                  </button>
                  <button className="w-7 h-7 rounded bg-black/40 hover:bg-black/60 flex items-center justify-center text-white/70 hover:text-white transition-all">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M8 19H5c-1 0-2-1-2-2V7c0-1 1-2 2-2h3m8 0h3c1 0 2 1 2 2v10c0 1-1 2-2 2h-3m-4-3l4-4m0 8l-4-4"/>
                    </svg>
                  </button>
                </motion.div>

                {/* Top Controls Bar */}
                <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-black/40 to-transparent flex items-center px-4 justify-between">
                  <div className="flex items-center gap-2">
                    {/* Live badge */}
                    <motion.div
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="px-2.5 py-1 bg-red-500 text-white text-[10px] font-bold rounded flex items-center gap-1"
                    >
                      <span className="w-1.5 h-1.5 bg-white rounded-full" />
                      LIVE
                    </motion.div>
                    <div className="px-2.5 py-1 bg-black/50 backdrop-blur text-white text-[10px] rounded flex items-center gap-1">
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
                      </svg>
                      <motion.span animate={{ opacity: [1, 0.6, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                        2.4K
                      </motion.span>
                    </div>
                  </div>

                  {/* Stream duration */}
                  <div className="px-2.5 py-1 bg-black/50 backdrop-blur text-white text-[10px] rounded flex items-center gap-1 group/timer">
                    <svg className="w-3 h-3 group-hover/timer:text-red-400 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M12 6v6l4 2"/>
                    </svg>
                    <motion.span animate={{ textShadow: ['0 0 0px rgba(255,0,0,0)', '0 0 8px rgba(255,0,0,0.5)', '0 0 0px rgba(255,0,0,0)'] }} transition={{ duration: 2, repeat: Infinity }}>
                      1:42:15
                    </motion.span>
                  </div>
                </div>

                {/* Synth AI indicator */}
                <motion.div
                  animate={{ opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute bottom-4 left-4 px-3 py-1.5 bg-[rgba(124,58,237,0.2)] backdrop-blur border border-[#7c3aed] text-[#b58af7] text-[10px] font-medium rounded-full flex items-center gap-2"
                >
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                  </svg>
                  Synth AI Active
                </motion.div>
                </div>

              {/* Bottom Panel - Chat */}
              <div className="p-4 border-t border-[rgba(255,255,255,0.05)] bg-[rgba(13,11,20,0.6)]">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#7c3aed]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                    <span className="text-[12px] font-medium text-[#f5f3ff]">Live Chat</span>
                  </div>
                  <button className="text-[10px] text-[#7c3aed] hover:text-[#b58af7] transition-colors font-medium">
                    View All
                  </button>
                </div>
                <div className="space-y-2.5 max-h-28 overflow-y-auto pr-2">
                  {chatMessages.map((msg, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                      transition={{ delay: 0.5 + index * 0.08 }}
                      whileHover={{ x: 2 }}
                      className={`text-[11px] transition-all ${msg.isAI ? 'bg-[rgba(124,58,237,0.15)] rounded px-2 py-1.5 border border-[rgba(124,58,237,0.2)]' : 'py-0.5'}`}
                    >
                      <span className={`font-medium ${msg.isAI ? 'text-[#7c3aed]' : 'text-[#b58af7]'}`}>
                        {msg.user}:
                      </span>
                      <span className="text-[#a09bbf] ml-1">{msg.message}</span>
                    </motion.div>
                  ))}
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                    transition={{ delay: 1.1 }}
                    className="text-[11px] text-[#5e5a72] italic"
                  >
                    New messages appear here...
                  </motion.div>
                </div>
              </div>
            </div>
            </motion.div>
            
            {/* Activity Panel */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="w-fit p-6 bg-[#13111e] rounded-xl border border-[rgba(255,255,255,0.05)]"
            >
              <h3 className="text-[13px] font-semibold text-[#f5f3ff] mb-4 tracking-[0.13em] uppercase">Synth Activity</h3>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-3">
                  <span className="font-mono text-[11px] text-[#7c3aed] mt-0.5">01:23</span>
                  <span className="text-[13px] text-[#a09bbf]">Answered a viewer question</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-mono text-[11px] text-[#7c3aed] mt-0.5">01:39</span>
                  <span className="text-[13px] text-[#a09bbf]">Referenced Creator Guide.pdf</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-mono text-[11px] text-[#7c3aed] mt-0.5">01:18</span>
                  <span className="text-[13px] text-[#a09bbf]">Highlighted key point</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-mono text-[11px] text-[#7c3aed] mt-0.5">01:12</span>
                  <span className="text-[13px] text-[#a09bbf]">Scheduled next segment</span>
                </li>
              </ul>
              <h3 className="text-[13px] font-semibold text-[#f5f3ff] mb-1 mt-20 tracking-[0.13em] uppercase">Coming Up</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <svg className="w-4 h-4 text-[#a09bbf] mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                  <span className="text-[13px] text-[#a09bbf]">Q&A with Chat</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-4 h-4 text-[#a09bbf] mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 6v6l4 2"/>
                  </svg>
                  <span className="font-mono text-[11px] text-[#a09bbf]">Starting in 07:45</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
