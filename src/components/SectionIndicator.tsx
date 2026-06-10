'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const sections = ['01', '02', '03', '04', '05', '06', '07'];

export default function SectionIndicator() {
  const [activeSection, setActiveSection] = useState(0);
  const [isLightSection, setIsLightSection] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;
      const sectionElements = document.querySelectorAll('[data-section]');
      
      sectionElements.forEach((section, index) => {
        const element = section as HTMLElement;
        const top = element.offsetTop;
        const bottom = top + element.offsetHeight;
        
        if (scrollPosition >= top && scrollPosition < bottom) {
          setActiveSection(index);
          // Section 01 (Hero) has light background
          setIsLightSection(index === 0);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="fixed left-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-0"
    >
      {sections.map((num, index) => (
        <div key={num} className="flex flex-col items-center">
          <motion.span
            animate={{
              color: activeSection === index 
                ? '#7c3aed' 
                : isLightSection 
                  ? 'rgba(26,22,40,0.3)' 
                  : 'rgba(160,155,191,0.4)',
            }}
            className="text-[11px] font-bold tracking-[0.15em] transition-colors duration-300"
          >
            {num}
          </motion.span>
          {index < sections.length - 1 && (
            <div 
              className={`w-px h-7 my-1.5 transition-colors duration-300 ${
                isLightSection ? 'bg-[rgba(124,58,237,0.08)]' : 'bg-[rgba(255,255,255,0.07)]'
              }`} 
            />
          )}
        </div>
      ))}
    </motion.div>
  );
}
