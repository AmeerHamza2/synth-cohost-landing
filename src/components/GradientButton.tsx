'use client';

import { motion } from 'framer-motion';

interface GradientButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function GradientButton({ 
  children, 
  onClick, 
  className = '',
  size = 'md' 
}: GradientButtonProps) {
  const sizeClasses = {
    sm: 'h-10 px-4 text-sm',
    md: 'h-11 px-6 text-base',
    lg: 'h-12 px-8 text-lg'
  };

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        relative overflow-hidden rounded-xl
        bg-gradient-to-r from-[#5A19FF] to-[#A84DFF]
        text-white font-semibold
        shadow-[0_0_20px_rgba(90,25,255,0.3)]
        hover:shadow-[0_0_30px_rgba(90,25,255,0.5)]
        transition-all duration-300
        ${sizeClasses[size]}
        ${className}
      `}
    >
      <span className="relative z-10">{children}</span>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-700" />
    </motion.button>
  );
}
