'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
  const [email, setEmail] = useState('');

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="relative w-full max-w-[400px] max-h-[550px] rounded-3xl overflow-hidden bg-[#09090F] border border-[#2A2A38] shadow-[0_0_60px_rgba(139,61,255,0.3)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-0 right-4 z-20 w-10 h-10 rounded-full bg-black/50 border border-[#2A2A38] flex items-center justify-center text-white hover:bg-black/70 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Top Hero Image Section */}
            <div className="relative w-full aspect-[16/6.4]">
              <Image
                src="/upper-hero-only.png"
                alt="Premium AI Personalities Hero"
                fill
                className="object-cover rounded-t-3xl"
                unoptimized
              />
            </div>

            {/* Bottom Form Section */}
            <div className="bg-[#11131D] rounded-b-3xl p-5 md:p-6 border-t border-[#2A2A38]">
              <div className="max-w-full mx-auto">
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8B3DFF] to-[#6A1BFF] flex items-center justify-center mb-4">
                  <Mail className="w-6 h-6 text-white" />
                </div>

                {/* Heading */}
                <h2 className="text-2xl font-bold text-white mb-3">
                  Waitlist for Early Access to Premium AI Personalities
                </h2>

                {/* Description */}
                <p className="text-[#A8A8B5] text-sm mb-6 max-w-[700px]">
                  Be the first to experience the future of AI companionship. Join our waitlist to get early access to premium features and exclusive updates.
                </p>

                {/* Email Input */}
                <div className="relative mb-3">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B6B7B]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full h-12 pl-10 pr-4 bg-[#1A1C26] rounded-xl border border-[#303040] text-white placeholder-[#6B6B7B] focus:outline-none focus:border-[#8B3DFF] focus:ring-2 focus:ring-[#8B3DFF]/20 transition-all"
                  />
                </div>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ translateY: -1, backgroundColor: '#9B4DFF' }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.25 }}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-[#8B3DFF] to-[#6A1BFF] text-white font-bold text-base flex items-center justify-center gap-3 hover:shadow-[0_0_30px_rgba(139,61,255,0.4)] transition-all"
                >
                  Join Waitlist
                  <ArrowRight className="w-4 h-4" />
                </motion.button>

                {/* Privacy Notice */}
                <div className="flex items-center justify-center gap-2 mt-4 text-[#6B6B7B] text-xs">
                  <Lock className="w-3 h-3" />
                  <span>We respect your privacy. No spam, ever.</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
