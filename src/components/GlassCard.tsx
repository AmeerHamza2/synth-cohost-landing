'use client';

import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function GlassCard({ children, className = '', onClick }: GlassCardProps) {
  return (
    <motion.div
      onClick={onClick}
      whileHover={{ y: -4 }}
      className={`
        relative overflow-hidden rounded-2xl
        bg-[rgba(20,20,30,0.75)]
        backdrop-blur-md
        border border-[rgba(170,80,255,0.18)]
        shadow-[0_0_30px_rgba(120,40,255,0.18)]
        transition-all duration-300
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}
