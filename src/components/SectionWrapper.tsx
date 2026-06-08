'use client';

import { motion } from 'framer-motion';

interface SectionWrapperProps {
  children: React.ReactNode;
  sectionNumber: string;
  className?: string;
  isDark?: boolean;
}

export default function SectionWrapper({
  children,
  sectionNumber,
  className = '',
  isDark = true,
}: SectionWrapperProps) {
  return (
    <section
      className={`relative ${isDark ? 'bg-[#080812]' : 'bg-[#FAFAFC]'} ${className}`}
    >
      {/* Top divider line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-white/[0.08]" />

      <div className="flex">
        {/* Left Navigation Rail */}
        <div className="hidden lg:flex flex-col items-center w-20 flex-shrink-0 py-16">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="sticky top-32"
          >
            {/* Section Number */}
            <span
              className={`text-sm font-light tracking-[0.2em] ${
                isDark ? 'text-white/40' : 'text-[#080812]/40'
              }`}
            >
              {sectionNumber}
            </span>

            {/* Vertical Line */}
            <div
              className={`w-px h-24 mx-auto mt-6 ${
                isDark ? 'bg-white/10' : 'bg-[#080812]/10'
              }`}
            />
          </motion.div>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </section>
  );
}
