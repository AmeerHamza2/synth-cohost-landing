'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';

const documents = [
  { name: 'Brand Guidelines', type: 'pdf' },
  { name: 'Creator Playbook', type: 'pdf' },
  { name: 'Q&A Notes', type: 'doc' },
  { name: 'Strategy Doc', type: 'pdf' },
  { name: 'Community FAQ', type: 'pdf' },
];

export default function KnowledgeUpload() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [hoveredDoc, setHoveredDoc] = useState<string | null>(null);

  return (
    <section 
      data-section="06" 
      className="relative bg-[#0d0b14] overflow-hidden"
    >
      {/* Section Number - Left Side */}
      <div className="absolute left-6 lg:left-10 top-1/3 -translate-y-1/2 flex flex-col items-center gap-2">
        <span className="text-[11px] font-bold text-white">06</span>
        <span className="w-4 h-[2px] bg-white" />
      </div>

      <div ref={ref} className="py-24 lg:py-28 px-6 lg:px-20 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-[clamp(28px,3vw,42px)] font-extrabold leading-[1.1] tracking-[-1px]">
            <span className="text-[#f5f3ff]">Teach Synth</span>
            <br />
            <span className="text-[#b58af7]">what matters.</span>
          </h2>
        </motion.div>

        {/* Floating Document Cards */}
        <div className="flex flex-wrap justify-center gap-4">
          {documents.map((doc, index) => (
            <motion.div
              key={doc.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              onMouseEnter={() => setHoveredDoc(doc.name)}
              onMouseLeave={() => setHoveredDoc(null)}
              whileHover={{ y: -6 }}
              className={`
                relative p-4 rounded-xl transition-all duration-300 cursor-pointer
                bg-[#13111e] border min-w-[140px]
                ${hoveredDoc === doc.name 
                  ? 'border-[rgba(124,58,237,0.3)] shadow-[0_0_25px_rgba(124,58,237,0.15)]' 
                  : 'border-[rgba(255,255,255,0.05)]'
                }
              `}
            >
              {/* File Icon */}
              <div className="w-9 h-9 rounded-lg mb-3 flex items-center justify-center bg-[rgba(124,58,237,0.15)]">
                <svg className="w-4 h-4 text-[#b58af7]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14,2 14,8 20,8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10,9 9,9 8,9"/>
                </svg>
              </div>

              {/* Document Name */}
              <h4 className="text-[12.5px] font-medium text-[#f5f3ff]">{doc.name}</h4>
            </motion.div>
          ))}

          {/* Add Your Doc Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ delay: 0.2 + documents.length * 0.1 }}
            whileHover={{ y: -6 }}
            className="relative p-4 rounded-xl border-2 border-dashed border-[rgba(124,58,237,0.3)] hover:border-[rgba(124,58,237,0.5)] transition-all duration-300 cursor-pointer flex flex-col items-center justify-center min-w-[140px] hover:bg-[rgba(124,58,237,0.05)]"
          >
            <motion.div
              whileHover={{ rotate: 90 }}
              transition={{ duration: 0.3 }}
              className="w-9 h-9 rounded-lg bg-[rgba(124,58,237,0.1)] flex items-center justify-center mb-3"
            >
              <svg className="w-4 h-4 text-[#7c3aed]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </motion.div>
            <span className="text-[12.5px] font-medium text-[#7c3aed]">Add Your Doc</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
