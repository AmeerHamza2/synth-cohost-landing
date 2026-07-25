'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const FEATURES = [
  'AI Cohost',
  'Desktop Companion',
  'Shared memories',
  'Shared personalities',
  'Shared voice',
  'Shared settings',
  'Cross-device continuity',
];

export default function FeatureList() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="flex flex-col"
    >
      <h4 className="text-white font-semibold text-[16px] mb-3">Includes:</h4>
      
      <ul className="space-y-[8px]">
        {FEATURES.map((feature, index) => (
          <motion.li
            key={feature}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.4 + index * 0.05 }}
            className="flex items-center gap-2"
          >
            <Check className="w-3.5 h-3.5 text-[#A855F7] flex-shrink-0" />
            <span className="text-white text-[14px]">{feature}</span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}
