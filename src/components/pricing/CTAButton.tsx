'use client';

import { motion } from 'framer-motion';

const BUTTON_TEXT = 'Choose Synth Creator+';

export default function CTAButton() {
  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className="w-full md:w-[220px] h-[48px] rounded-[10px] bg-gradient-to-b from-[#9D4EFF] to-[#7B2FFF] text-white font-semibold text-[16px] shadow-[0_10px_25px_rgba(147,51,234,.35)] hover:shadow-[0_10px_30px_rgba(147,51,234,.5)] transition-all duration-300"
    >
      {BUTTON_TEXT}
    </motion.button>
  );
}
