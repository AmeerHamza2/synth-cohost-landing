'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { GraduationCap, Shield, Mic, Search, Heart } from 'lucide-react';
import SectionWrapper from './SectionWrapper';

const roles = [
  {
    id: 'educator',
    title: 'Educator',
    icon: GraduationCap,
    description: 'Explains concepts to your audience, answers questions, and helps teach complex topics.',
    color: '#8B5CF6',
  },
  {
    id: 'moderator',
    title: 'Moderator',
    icon: Shield,
    description: 'Keeps chat civil, manages timeouts, and maintains a positive atmosphere.',
    color: '#7C4FE0',
  },
  {
    id: 'interviewer',
    title: 'Interviewer',
    icon: Mic,
    description: 'Asks thoughtful questions to guests and ensures smooth dialogue flow.',
    color: '#8B5CF6',
  },
  {
    id: 'researcher',
    title: 'Research Assistant',
    icon: Search,
    description: 'Looks up facts, finds information on the fly, and provides context.',
    color: '#9F7AEA',
  },
  {
    id: 'companion',
    title: 'Companion',
    icon: Heart,
    description: 'A supportive presence that jokes with you and celebrates wins.',
    color: '#C4B5FD',
  },
];

export default function RolesCarousel() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [activeRole, setActiveRole] = useState('educator');

  return (
    <SectionWrapper sectionNumber="04" isDark={true}>
      <div ref={ref} className="py-32 pr-6 lg:pr-8 overflow-hidden" id="streamers">
        <div className="relative max-w-6xl">
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

          {/* Role Cards - Fixed dimensions as specified */}
          <div className="relative">
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex gap-4 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide lg:flex lg:justify-center lg:overflow-visible lg:pb-0 lg:flex-wrap"
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
                    className="flex-shrink-0 snap-center cursor-pointer"
                    style={{ width: '220px', height: '280px' }}
                  >
                    <div
                      className={`
                        relative h-full p-5 rounded-[20px] transition-all duration-300
                        bg-[rgba(17,17,27,0.8)] backdrop-blur-[12px] border
                        ${isActive 
                          ? 'border-[#8B5CF6] shadow-[0_0_40px_rgba(139,92,246,0.3)]' 
                          : 'border-[rgba(139,92,246,0.25)] hover:border-[rgba(139,92,246,0.5)]'
                        }
                      `}
                    >
                      {/* Icon area */}
                      <div className="relative mb-4">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          className={`
                            w-16 h-16 rounded-xl flex items-center justify-center
                            ${isActive 
                              ? 'bg-gradient-to-br from-[#8B5CF6] to-[#C4B5FD]' 
                              : 'bg-[#1a1a2e]'
                            }
                          `}
                        >
                          <Icon className={`w-8 h-8 ${isActive ? 'text-white' : 'text-[#8B5CF6]'}`} />
                        </motion.div>

                        {/* Active indicator */}
                        {isActive && (
                          <motion.div
                            layoutId="activeIndicator"
                            className="absolute -bottom-2 left-0 w-8 h-1 bg-[#8B5CF6] rounded-full"
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
                          className="absolute inset-0 rounded-[20px] bg-[#8B5CF6]/5 pointer-events-none"
                        />
                      )}
                    </div>
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
      </div>
    </SectionWrapper>
  );
}
