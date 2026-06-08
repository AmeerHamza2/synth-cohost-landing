'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Play, Users, MessageCircle, Sparkles, Clock, TrendingUp } from 'lucide-react';
import SectionWrapper from './SectionWrapper';

const chatMessages = [
  { user: 'StreamFan42', message: "Let's gooo! Great stream!", isAI: false },
  { user: 'Synth AI', message: "Thanks StreamFan42! Stick around, we're just getting started! 🎮", isAI: true },
  { user: 'GamerPro', message: 'How do you do that move?', isAI: false },
  { user: 'Synth AI', message: "Great question! That's the dash-cancel technique. I'll have the streamer show it again in a moment!", isAI: true },
  { user: 'NewViewer123', message: 'Just followed!', isAI: false },
  { user: 'Synth AI', message: "Welcome to the community NewViewer123! 💜 Make yourself at home!", isAI: true },
];

const activityItems = [
  { time: '2m ago', event: 'Synth welcomed 5 new viewers', icon: Users },
  { time: '4m ago', event: 'Answered question about controls', icon: MessageCircle },
  { time: '7m ago', event: 'Read donation from SupporterX', icon: Sparkles },
  { time: '12m ago', event: 'Started tracking stream metrics', icon: TrendingUp },
];

export default function LivestreamShowcase() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <SectionWrapper sectionNumber="05" isDark={true}>
      <div ref={ref} className="py-16 lg:py-32 px-6 lg:px-8 overflow-hidden" id="product">
        <div className="relative max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                See Synth in action
                <br />
                <span className="text-gradient-purple">where it matters.</span>
              </h2>

              <p className="text-lg text-[#B0B0C0] mb-8 max-w-md">
                Watch how Synth seamlessly integrates into a live stream, handling chat, 
                reading donations, and keeping your audience engaged.
              </p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-[#8B5CF6] text-white font-semibold rounded-xl hover:bg-[#7C4FE0] transition-colors glow-purple-sm flex items-center gap-2"
              >
                <Play className="w-5 h-5" />
                Watch Full Demo
              </motion.button>
            </motion.div>

            {/* Right Content - Fake Livestream UI */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="editorial-card relative rounded-[20px] overflow-hidden bg-[rgba(17,17,27,0.8)] backdrop-blur-[12px] border border-[rgba(139,92,246,0.25)] shadow-[0_0_40px_rgba(139,92,246,0.2)]">
                {/* Video Player Area */}
                <div className="relative aspect-video bg-gradient-to-br from-[#1a1a2e] to-[#11111B]">
                  {/* Simulated video content */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 rounded-full bg-[#8B5CF6]/20 flex items-center justify-center">
                      <Play className="w-12 h-12 text-[#8B5CF6]" />
                    </div>
                  </div>

                  {/* Live badge */}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <motion.div
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded flex items-center gap-1"
                    >
                      <span className="w-2 h-2 bg-white rounded-full" />
                      LIVE
                    </motion.div>
                    <div className="px-3 py-1 bg-black/50 backdrop-blur text-white text-xs rounded flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      2.4K
                    </div>
                  </div>

                  {/* Stream duration */}
                  <div className="absolute top-4 right-4 px-3 py-1 bg-black/50 backdrop-blur text-white text-xs rounded flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    1:42:15
                  </div>

                  {/* Synth AI indicator */}
                  <motion.div
                    animate={{ opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute bottom-4 left-4 px-3 py-1.5 bg-[#8B5CF6]/20 backdrop-blur border border-[#8B5CF6]/50 text-[#C4B5FD] text-xs font-medium rounded-full flex items-center gap-2"
                  >
                    <Sparkles className="w-3 h-3" />
                    Synth AI Active
                  </motion.div>
                </div>

                {/* Bottom Panel - Chat & Activity */}
                <div className="grid grid-cols-2 divide-x divide-[rgba(255,255,255,0.08)]">
                  {/* Chat Panel */}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <MessageCircle className="w-4 h-4 text-[#8B5CF6]" />
                      <span className="text-sm font-medium text-white">Live Chat</span>
                    </div>
                    <div className="space-y-2 max-h-40 overflow-hidden">
                      {chatMessages.map((msg, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                          transition={{ delay: 0.5 + index * 0.1 }}
                          className={`text-xs ${msg.isAI ? 'bg-[#8B5CF6]/10 rounded p-1.5' : ''}`}
                        >
                          <span className={`font-medium ${msg.isAI ? 'text-[#8B5CF6]' : 'text-[#C4B5FD]'}`}>
                            {msg.user}:
                          </span>
                          <span className="text-[#B0B0C0] ml-1">{msg.message}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Activity Panel */}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4 text-[#8B5CF6]" />
                    <span className="text-sm font-medium text-white">Synth Activity</span>
                  </div>
                  <div className="space-y-2">
                    {activityItems.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 10 }}
                        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 10 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        className="flex items-start gap-2 text-xs"
                      >
                        <item.icon className="w-3 h-3 text-[#8B5CF6] mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="text-[#B0B0C0]">{item.event}</span>
                          <span className="text-[#B0B0C0]/50 ml-1">{item.time}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

              {/* Decorative elements */}
              <motion.div
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-[#8B5CF6]/30 blur-2xl pointer-events-none"
              />
              <motion.div
                animate={{ opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-[#C4B5FD]/30 blur-2xl pointer-events-none"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
