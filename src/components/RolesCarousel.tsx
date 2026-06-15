'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import Image from 'next/image';

const roles = [
  {
    id: 'educator',
    title: 'Educator',
    image: '/complete 5.png',
    objectPosition: '5% center',
  },
  {
    id: 'moderator',
    title: 'Moderator',
    image: '/complete 5.png',
    objectPosition: '25% center',
  },
  {
    id: 'interviewer',
    title: 'Interviewer',
    image: '/complete 5.png',
    objectPosition: '50% center',
  },
  {
    id: 'researcher',
    title: 'Research Assistant',
    image: '/complete 5.png',
    objectPosition: '75% center',
  },
  {
    id: 'companion',
    title: 'Companion',
    image: '/complete 5.png',
    objectPosition: '95% center',
  },
];

export default function RolesCarousel() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section 
      data-section="04" 
      className="relative bg-black overflow-hidden"
      id="streamers"
    >
      {/* Section Number - Left Side - Hidden on mobile */}
      <div className="hidden md:flex absolute left-6 lg:left-10 top-1/3 -translate-y-1/2 flex-col items-center gap-2">
        <span className="text-[11px] font-bold text-white">04</span>
        <span className="w-4 h-[2px] bg-white" />
      </div>

      <div ref={ref} className="py-12 px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col lg:flex-row items-center gap-12 max-w-[1100px] mx-auto"
        >
          {/* Left Content */}
          <div className="w-full lg:w-auto lg:max-w-[280px] flex-shrink-0 text-center lg:text-left">
            <div className="text-[10px] tracking-[0.13em] text-[#a09bbf] uppercase mb-3">
              One personality. Many roles.
            </div>
            <h2 className="text-[26px] lg:text-[32px] font-extrabold text-[#f5f3ff] leading-[1.2] mb-4 tracking-[-0.5px]">
              Synth adapts to your stream.
            </h2>
            <p className="text-[14px] text-[#a09bbf] leading-[1.6] mb-6 hidden lg:block">
              Watch how Synth transforms across different roles—educator, moderator, interviewer—seamlessly adapting to match your stream's needs.
            </p>
            <div className="flex flex-col gap-3">
              <a 
                href="#" 
                className="inline-flex items-center gap-2.5 text-[13px] font-semibold text-[#a09bbf] border-b border-[rgba(255,255,255,0.2)] pb-0.5 hover:text-white transition-colors w-fit"
              >
                Learn more <span>▷</span>
              </a>
            
            </div>
          </div>

          {/* Right Boxes */}
          <div className="flex-1 relative overflow-hidden min-w-0 w-full lg:w-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {roles.map((role, index) => (
                <motion.div
                  key={role.id}
                  onHoverStart={() => setHoveredIndex(index)}
                  onHoverEnd={() => setHoveredIndex(null)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative w-full h-[120px] sm:h-[150px] lg:h-[200px] rounded-[10px] overflow-hidden cursor-pointer"
                  style={{
                    boxShadow: hoveredIndex === index 
                      ? '0 0 30px rgba(124, 58, 237, 0.8), 0 0 60px rgba(124, 58, 237, 0.5)' 
                      : 'none'
                  }}
                >
                  <Image
                    src={role.image}
                    alt={role.title}
                    fill
                    className="object-cover transition-all duration-300"
                    style={{
                      filter: hoveredIndex === index ? 'brightness(1.2)' : 'brightness(0.8)',
                      objectPosition: role.objectPosition
                    }}
                    unoptimized
                  />
                  {/* Purple overlay when hovered */}
                  <div 
                    className="absolute inset-0 transition-all duration-300"
                    style={{
                      backgroundColor: hoveredIndex === index ? 'rgba(124, 58, 237, 0.4)' : 'rgba(0, 0, 0, 0.5)'
                    }}
                  />
                  {/* Text overlay */}
                  <div className="absolute inset-0 flex items-end justify-center pb-3">
                    <span className="text-white text-[11px] sm:text-[12px] lg:text-[13px] font-semibold text-center px-2">
                      {role.title}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
            {/* Dots */}
            <div className="flex justify-center gap-1 mt-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7c6edc]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#7c6edc]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#7c6edc]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#7c6edc]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#7c6edc]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#7c6edc]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#7c6edc]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#7c6edc]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#7c6edc]" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
