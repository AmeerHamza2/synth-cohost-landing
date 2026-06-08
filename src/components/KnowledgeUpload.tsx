'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { FileText, File, Plus, Upload } from 'lucide-react';

const documents = [
  { name: 'Brand Guidelines.pdf', type: 'pdf', size: '2.4 MB' },
  { name: 'Creator Playbook.pdf', type: 'pdf', size: '5.1 MB' },
  { name: 'Q&A Notes.docx', type: 'doc', size: '824 KB' },
  { name: 'Strategy Deck.pdf', type: 'pdf', size: '3.2 MB' },
  { name: 'Community FAQ.pdf', type: 'pdf', size: '1.8 MB' },
];

export default function KnowledgeUpload() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [hoveredDoc, setHoveredDoc] = useState<string | null>(null);

  return (
    <section ref={ref} className="relative bg-[#080812] py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a18] to-[#080812]" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
            transition={{ duration: 0.6 }}
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block text-[#8B5CF6] font-medium tracking-wide mb-4"
            >
              KNOWLEDGE BASE
            </motion.span>

            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Teach Synth
              <br />
              <span className="text-gradient-purple">what matters.</span>
            </h2>

            <p className="text-lg text-[#B0B0C0] mb-8 leading-relaxed max-w-md">
              Upload your docs, notes and resources. Synth learns your brand voice, 
              community guidelines, and important information to provide accurate, 
              on-brand responses.
            </p>

            <div className="flex flex-wrap gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-[#8B5CF6] text-white font-semibold rounded-xl hover:bg-[#7C4FE0] transition-colors flex items-center gap-2"
              >
                <Upload className="w-5 h-5" />
                Upload Documents
              </motion.button>
            </div>
          </motion.div>

          {/* Right Content - Document Grid */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {documents.map((doc, index) => (
                <motion.div
                  key={doc.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  onMouseEnter={() => setHoveredDoc(doc.name)}
                  onMouseLeave={() => setHoveredDoc(null)}
                  whileHover={{ y: -5 }}
                  className={`
                    relative p-5 rounded-2xl transition-all duration-300 cursor-pointer
                    ${hoveredDoc === doc.name 
                      ? 'bg-[#11111B] border-[#8B5CF6]/50 glow-purple-sm' 
                      : 'bg-[#11111B]/50 border-[#8B5CF6]/10'
                    }
                    border backdrop-blur-sm
                  `}
                >
                  {/* Glass effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

                  {/* File Icon */}
                  <div className={`
                    w-12 h-12 rounded-xl mb-4 flex items-center justify-center
                    ${doc.type === 'pdf' ? 'bg-red-500/20' : 'bg-blue-500/20'}
                  `}>
                    <FileText className={`w-6 h-6 ${doc.type === 'pdf' ? 'text-red-400' : 'text-blue-400'}`} />
                  </div>

                  {/* Document Info */}
                  <h4 className="text-sm font-medium text-white mb-1 truncate">{doc.name}</h4>
                  <p className="text-xs text-[#B0B0C0]/60">{doc.size}</p>

                  {/* Hover glow */}
                  {hoveredDoc === doc.name && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 rounded-2xl bg-[#8B5CF6]/5 pointer-events-none"
                    />
                  )}
                </motion.div>
              ))}

              {/* Add Document Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: 0.3 + documents.length * 0.1 }}
                whileHover={{ y: -5, borderColor: 'rgba(139, 92, 246, 0.5)' }}
                className="relative p-5 rounded-2xl border-2 border-dashed border-[#8B5CF6]/20 hover:bg-[#11111B]/50 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center min-h-[140px]"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  transition={{ duration: 0.3 }}
                  className="w-12 h-12 rounded-xl bg-[#8B5CF6]/10 flex items-center justify-center mb-3"
                >
                  <Plus className="w-6 h-6 text-[#8B5CF6]" />
                </motion.div>
                <span className="text-sm font-medium text-[#8B5CF6]">Add Your Doc</span>
              </motion.div>
            </div>

            {/* Background glow */}
            <motion.div
              animate={{ opacity: [0.1, 0.2, 0.1] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute -inset-8 rounded-3xl bg-[#8B5CF6]/10 blur-3xl pointer-events-none -z-10"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
