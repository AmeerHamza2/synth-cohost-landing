'use client';

import { motion } from 'framer-motion';

export default function DescriptionSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="flex flex-col"
    >
      <h3 className="text-white font-bold text-[36px] leading-[1.05] mb-2">
        One AI.
        <br />
        Everywhere.
      </h3>
      
      <p className="text-gray-400 text-[14px] leading-[1.6]">
        The ultimate experience across all
        <br />
        your surfaces
        <br />
        with one shared Syn
      </p>
    </motion.div>
  );
}
