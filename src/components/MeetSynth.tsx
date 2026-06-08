'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { MessageCircle, Brain, Settings } from 'lucide-react';
import SectionWrapper from './SectionWrapper';

const features = [
  {
    icon: MessageCircle,
    title: 'Responds to chat',
    description: 'Synth reads and responds to chat messages in real-time, keeping your community engaged even when you\'re focused.',
  },
  {
    icon: Brain,
    title: 'Understands context',
    description: 'Advanced AI comprehension allows Synth to follow conversations, understand jokes, and maintain topic awareness.',
  },
  {
    icon: Settings,
    title: 'Supports your workflow',
    description: 'From reading donations to managing viewer requests, Synth handles the routine so you can focus on content.',
  },
];

export default function MeetSynth() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <SectionWrapper sectionNumber="03" isDark={true}>
      <div ref={ref} className="py-16 lg:py-32 px-6 lg:px-8 overflow-hidden" id="features">
        <div className="relative max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block text-[#8B5CF6] font-medium tracking-wide mb-4"
            >
              INTRODUCING
            </motion.span>

            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-6">
              Meet <span className="text-gradient-purple">Synth</span>
            </h2>

            <h3 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-white/80 mb-8">
              Your AI cohost.
              <br />
              <span className="text-[#B0B0C0]">Designed for live.</span>
            </h3>

            <p className="max-w-2xl mx-auto text-lg text-[#B0B0C0] leading-relaxed">
              Synth is an intelligent AI companion purpose-built for live streaming. 
              It learns your style, understands your audience, and becomes a natural 
              extension of your broadcast.
            </p>
          </motion.div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                whileHover={{ y: -4, transition: { duration: 0.3 } }}
                className="group relative"
              >
                <div className="editorial-card relative h-full p-8 rounded-[20px] bg-[rgba(17,17,27,0.8)] backdrop-blur-[12px] border border-[rgba(139,92,246,0.25)] transition-all duration-300 overflow-hidden hover:shadow-[0_0_40px_rgba(139,92,246,0.3)]">
                  {/* Glow effect on hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-b from-[#8B5CF6]/0 to-[#8B5CF6]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />

                  {/* Icon */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-[#8B5CF6] to-[#C4B5FD] flex items-center justify-center mb-6 glow-purple-sm"
                  >
                    <feature.icon className="w-8 h-8 text-white" />
                  </motion.div>

                  {/* Content */}
                  <h4 className="relative text-xl font-bold text-white mb-4 group-hover:text-[#C4B5FD] transition-colors">
                    {feature.title}
                  </h4>

                  <p className="relative text-[#B0B0C0] leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Corner accent */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-[#8B5CF6]/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Ambient glow */}
        <motion.div
          animate={{ opacity: [0.05, 0.15, 0.05], scale: [1, 1.1, 1] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full bg-[#8B5CF6]/10 blur-[120px] pointer-events-none"
        />
      </div>
    </SectionWrapper>
  );
}
