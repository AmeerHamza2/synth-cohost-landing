'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

const roles = [
  {
    id: 'educator',
    title: 'Educator',
    objectPosition: '5% center',
  },
  {
    id: 'moderator',
    title: 'Moderator',
    objectPosition: '36% center',
  },
  {
    id: 'interviewer',
    title: 'Interviewer',
    objectPosition: '65% center',
  },
  {
    id: 'researcher',
    title: 'Research Assistant',
    objectPosition: '96% center',
  },
  {
    id: 'companion',
    title: 'Companion',
    objectPosition: '50% center',
  },
];

export default function RolesCarousel() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [currentIndex, setCurrentIndex] = useState(0);

  const totalCards = roles.length;

  const move = useCallback((dir: number) => {
    setCurrentIndex((prev) => {
      let next = prev + dir;
      if (next < 0) next = totalCards - 1;
      if (next >= totalCards) next = 0;
      return next;
    });
  }, [totalCards]);

  // Auto-play
  useEffect(() => {
    const interval = setInterval(() => {
      move(1);
    }, 4000);
    return () => clearInterval(interval);
  }, [move]);

  // Get visible cards with wrapping
  const getVisibleCards = () => {
    const cards = [];
    for (let i = -1; i <= 3; i++) {
      const index = ((currentIndex + i) % totalCards + totalCards) % totalCards;
      cards.push({ ...roles[index], originalIndex: index, offset: i });
    }
    return cards;
  };

  const visibleCards = getVisibleCards();

  return (
    <section 
      data-section="04" 
      className="relative bg-[#0d0b14] overflow-hidden"
      id="streamers"
    >
      {/* Section Number - Left Side */}
      <div className="absolute left-6 lg:left-10 top-1/3 -translate-y-1/2 flex flex-col items-center gap-2">
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
          <div className="min-w-[200px] max-w-[220px] flex-shrink-0">
            <div className="text-[10px] tracking-[0.13em] text-[#a09bbf] uppercase mb-2.5">
              One personality. Many roles.
            </div>
            <h2 className="text-[26px] font-medium text-[#f5f3ff] leading-[1.3] mb-6">
              Synth adapts to your stream.
            </h2>
            <a 
              href="#" 
              className="inline-flex items-center gap-1.5 text-[13px] text-[#a09bbf] border-b border-[rgba(255,255,255,0.2)] pb-0.5 hover:text-white transition-colors"
            >
              Learn more ▷
            </a>
          </div>

          {/* Right Slider */}
          <div className="flex-1 relative overflow-hidden min-w-0">
            {/* Prev Button */}
            <button
              onClick={() => move(-1)}
              className="absolute left-0 top-[45%] -translate-y-1/2 w-8 h-8 rounded-full bg-[rgba(20,20,40,0.85)] border border-[rgba(255,255,255,0.1)] text-[#9090b8] flex items-center justify-center z-10 hover:bg-[rgba(80,70,160,0.7)] hover:text-white transition-all"
              aria-label="Previous"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            {/* Slider Track */}
            <div className="overflow-hidden mx-10">
              <div className="flex gap-3 justify-center">
                {visibleCards.slice(1, 4).map((role, idx) => (
                  <motion.div
                    key={`${role.id}-${role.offset}`}
                    layout
                    initial={false}
                    animate={{ 
                      scale: idx === 1 ? 1.02 : 0.95,
                      opacity: idx === 1 ? 1 : 0.6
                    }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    onClick={() => setCurrentIndex(role.originalIndex)}
                    className={`w-[200px] min-w-[200px] rounded-[10px] overflow-hidden cursor-pointer flex-shrink-0 border-[1.5px] transition-colors duration-300 ${idx === 1 ? 'border-[#7c6edc]' : 'border-transparent'}`}
                  >
                    <div className="relative w-full h-[300px]">
                      <Image
                        src="/Mods_lossless(1) (1).webp"
                        alt={role.title}
                        fill
                        className="object-cover"
                        style={{ objectPosition: role.objectPosition }}
                        unoptimized
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Next Button */}
            <button
              onClick={() => move(1)}
              className="absolute right-0 top-[45%] -translate-y-1/2 w-8 h-8 rounded-full bg-[rgba(20,20,40,0.85)] border border-[rgba(255,255,255,0.1)] text-[#9090b8] flex items-center justify-center z-10 hover:bg-[rgba(80,70,160,0.7)] hover:text-white transition-all"
              aria-label="Next"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-4">
              {roles.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${currentIndex === index ? 'bg-[#7c6edc] scale-125' : 'bg-[#2a2a4a] hover:bg-[#4a4a6a]'}`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
