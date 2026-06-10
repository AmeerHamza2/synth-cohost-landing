'use client';

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
      className="relative bg-[#0d0b14] overflow-hidden"
      id="product"
    >
      {/* Section Number - Left Side */}
      <div className="absolute left-6 lg:left-10 top-1/3 -translate-y-1/2 flex flex-col items-center gap-2">
        <span className="text-[11px] font-bold text-white">05</span>
        <span className="w-4 h-[2px] bg-white" />
      </div>

      <div ref={ref} className="py-24 lg:py-28 px-6 lg:px-20 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-[clamp(28px,3vw,42px)] font-extrabold leading-[1.1] tracking-[-1px] mb-6">
              <span className="text-[#f5f3ff]">See Synth in action</span>
              <br />
              <span className="text-[#b58af7]">where it matters.</span>
            </h2>

            <p className="text-[14.5px] text-[#a09bbf] leading-[1.7] mb-8 max-w-md">
              Watch how Synth seamlessly integrates into a live stream, handling chat, 
              reading donations, and keeping your audience engaged.
            </p>

            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: '#9d5cf6' }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 bg-[#7c3aed] text-white text-[13.5px] font-semibold rounded-lg transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5,3 19,12 5,21" />
              </svg>
              Watch Full Demo
            </motion.button>
          </motion.div>

          {/* Right Content - Livestream Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-xl overflow-hidden bg-[#13111e] border border-[rgba(255,255,255,0.05)]">
              {/* Video Player Area */}
              <div className="relative aspect-video bg-gradient-to-br from-[#1a1628] to-[#0d0b14]">
                {/* Simulated video content */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-[rgba(124,58,237,0.2)] flex items-center justify-center border border-[rgba(124,58,237,0.3)]">
                    <svg className="w-8 h-8 text-[#7c3aed]" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="5,3 19,12 5,21" />
                    </svg>
                  </div>
                </div>

                {/* Live badge */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
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
                    2.4K
                  </div>
                </div>

                {/* Stream duration */}
                <div className="absolute top-4 right-4 px-2.5 py-1 bg-black/50 backdrop-blur text-white text-[10px] rounded flex items-center gap-1">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 6v6l4 2"/>
                  </svg>
                  1:42:15
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
              <div className="p-4 border-t border-[rgba(255,255,255,0.05)]">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-4 h-4 text-[#7c3aed]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                  <span className="text-[12px] font-medium text-[#f5f3ff]">Live Chat</span>
                </div>
                <div className="space-y-2 max-h-28 overflow-hidden">
                  {chatMessages.map((msg, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className={`text-[11px] ${msg.isAI ? 'bg-[rgba(124,58,237,0.1)] rounded px-2 py-1' : ''}`}
                    >
                      <span className={`font-medium ${msg.isAI ? 'text-[#7c3aed]' : 'text-[#b58af7]'}`}>
                        {msg.user}:
                      </span>
                      <span className="text-[#a09bbf] ml-1">{msg.message}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
