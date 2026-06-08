'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { GraduationCap, Shield, Mic, Search, Heart } from 'lucide-react';

const roles = [
  {
    id: 'educator',
    title: 'Educator',
    icon: GraduationCap,
    description: 'Explains concepts to your audience, answers questions, and helps teach complex topics in digestible ways.',
    color: '#8B5CF6',
  },
  {
    id: 'moderator',
    title: 'Moderator',
    icon: Shield,
    description: 'Keeps chat civil, manages timeouts, and maintains a positive atmosphere while you focus on content.',
    color: '#7C4FE0',
  },
  {
    id: 'interviewer',
    title: 'Interviewer',
    icon: Mic,
    description: 'Asks thoughtful questions to guests, drives conversation, and ensures smooth dialogue flow.',
    color: '#8B5CF6',
  },
  {
    id: 'researcher',
    title: 'Research Assistant',
    icon: Search,
    description: 'Looks up facts, finds information on the fly, and provides context when you need it most.',
    color: '#9F7AEA',
  },
  {
    id: 'companion',
    title: 'Companion',
    icon: Heart,
    description: 'A supportive presence that jokes with you, celebrates wins, and makes streaming feel less lonely.',
    color: '#C4B5FD',
  },
];

export default function RolesCarousel() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [activeRole, setActiveRole] = useState('educator');

  return (
    <section ref={ref} className="relative bg-[#080812] py-32 overflow-hidden" id="streamers">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a18] to-[#080812]" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-4">
            Synth adapts to
            <br />
            <span className="text-gradient-purple">your stream.</span>
          </h2>
          <p className="text-[#B0B0C0] text-lg max-w-2xl mx-auto">
            Configure Synth to take on different roles based on your streaming style and needs.
          </p>
        </motion.div>

        {/* Role Cards - Horizontal Scroll on Mobile */}
        <div className="relative">
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide lg:grid lg:grid-cols-5 lg:overflow-visible lg:pb-0"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {roles.map((role, index) => {
              const isActive = activeRole === role.id;
              const Icon = role.icon;

              return (
                <motion.div
                  key={role.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  onClick={() => setActiveRole(role.id)}
                  className={`
                    flex-shrink-0 w-64 lg:w-auto snap-center cursor-pointer
                    relative p-6 rounded-2xl transition-all duration-300
                    ${isActive 
                      ? 'bg-gradient-to-b from-[#11111B] to-[#11111B]/80 border-2 border-[#8B5CF6] glow-purple' 
                      : 'bg-[#11111B]/50 border border-[#8B5CF6]/10 hover:border-[#8B5CF6]/30'
                    }
                  `}
                >
                  {/* Portrait/Icon area */}
                  <div className="relative mb-6">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className={`
                        w-full aspect-square rounded-xl flex items-center justify-center
                        ${isActive 
                          ? 'bg-gradient-to-br from-[#8B5CF6] to-[#C4B5FD]' 
                          : 'bg-[#1a1a2e]'
                        }
                      `}
                    >
                      <Icon className={`w-12 h-12 ${isActive ? 'text-white' : 'text-[#8B5CF6]'}`} />
                    </motion.div>

                    {/* Active indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-[#8B5CF6] rounded-full"
                      />
                    )}
                  </div>

                  {/* Content */}
                  <h4 className={`text-lg font-bold mb-2 ${isActive ? 'text-white' : 'text-[#B0B0C0]'}`}>
                    {role.title}
                  </h4>
                  <p className={`text-sm leading-relaxed ${isActive ? 'text-[#B0B0C0]' : 'text-[#B0B0C0]/60'}`}>
                    {role.description}
                  </p>

                  {/* Glow effect */}
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 rounded-2xl bg-[#8B5CF6]/5 pointer-events-none"
                    />
                  )}
                </motion.div>
              );
            })}
          </motion.div>

          {/* Scroll indicators for mobile */}
          <div className="flex justify-center gap-2 mt-6 lg:hidden">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => setActiveRole(role.id)}
                className={`w-2 h-2 rounded-full transition-all ${
                  activeRole === role.id ? 'bg-[#8B5CF6] w-6' : 'bg-[#B0B0C0]/30'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Background glow */}
      <motion.div
        animate={{ opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-[#8B5CF6]/20 blur-[100px] pointer-events-none"
      />
    </section>
  );
}
