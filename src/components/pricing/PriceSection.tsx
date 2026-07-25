'use client';

import { motion } from 'framer-motion';

const PRICING = {
  monthly: 89,
  yearly: 899,
};

export default function PriceSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col"
    >
      <h2 className="text-white font-bold text-[32px] tracking-[2px] leading-none mb-3">
        SYNTH CREATOR+
      </h2>
      
      <div className="flex items-baseline gap-1 mb-2">
        <span className="text-[#A855F7] font-extrabold text-[52px] leading-none">
          ${PRICING.monthly}
        </span>
        <span className="text-[#A855F7] font-semibold text-[18px] mb-2">
          /mo
        </span>
      </div>
      
      <div className="flex flex-col items-center mb-1">
        <span className="text-[#7A7A8C] text-[14px] font-medium">or</span>
      </div>
      
      <div className="flex items-baseline gap-1">
        <span className="text-[#A855F7] font-extrabold text-[52px] leading-none">
          ${PRICING.yearly}
        </span>
        <span className="text-[#A855F7] font-semibold text-[18px] mb-2">
          /year
        </span>
      </div>
    </motion.div>
  );
}
