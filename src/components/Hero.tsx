'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Play } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import SignInModal from './SignInModal';
import { usePopup } from '../contexts/PopupContext';

export default function Hero() {
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const { openPopup } = usePopup();

 
  return (
    <section data-section="01" className="relative min-h-[60vh] overflow-hidden">
      {/* Mobile Layout */}
      <div className="md:hidden relative z-10 px-6 pt-24 pb-16 bg-[#0d0b14]">
        <div className="grid grid-cols-2 gap-4 items-center">
          {/* Text Content - Left */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="col-span-1"
          >
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center gap-2 mb-4"
            >
              <span className="text-[10px] font-semibold tracking-[1.8px] uppercase text-[#7c3aed]">
                AI Cohost for Live Streamers
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-[24px] font-medium text-white leading-[1.1] tracking-[-1px] mb-3"
            >
              Your stream.
              <br />
              Stronger <span className="text-[#7c3aed]">together</span><span className="text-[#7c3aed]">.</span>
            </motion.h1>

            {/* Body */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-[12px] text-[#5c5575] leading-[1.6] mb-2"
            >
              Build intelligent Syns that engage audiences, drive product promotion, and unlock new revenue streams across livestreams and digital experiences.
            </motion.p>

              <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-[12px] text-[#5c5575] leading-[1.6] mb-2"
            >
               Extend their presence beyond the broadcast with lightweight desktop companions that keep your Syns active and engaging long after the stream ends.


            </motion.p>

         
         
            

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col gap-2"
            >
            
            </motion.div>
          </motion.div>

          {/* Image - Right */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="col-span-1 relative h-[280px] flex flex-col items-center justify-end"
          >
            <Image
              src="/cdcdc.png"
              alt="Synth AI Cohost"
              fill
              className="object-contain object-top"
              priority
              unoptimized
            />
            {/* See it in Action Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              onClick={() => setIsSignInOpen(true)}
              whileHover={{ scale: 1.02, backgroundColor: '#9d4edd' }}
              whileTap={{ scale: 0.98 }}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 inline-flex items-center justify-center gap-2 bg-[#7c3aed] text-white text-[10px] font-semibold px-6 py-2 rounded-lg transition-colors border-0 cursor-pointer w-[90%]"
            >
              See it in Action
              <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.button>

            {/* Watch Demo Button - Directly under See it in Action */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              onClick={() => openPopup('video-demo')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 z-10 inline-flex items-center justify-center gap-2 text-[10px] font-semibold text-[#a09bbf] border-b border-[rgba(255,255,255,0.2)] pb-0.5 hover:text-white transition-colors cursor-pointer bg-transparent"
            >
              Watch Demo <span className="text-[12px]">▷</span>
            </motion.button>
              
              {/* Mobile Scroll Hint */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1 }}
                className="absolute bottom-[-40px] left-1/2 -translate-x-1/2 text-[10px] tracking-[2.5px] uppercase text-[#9d99b5] text-center"
              >
                Scroll to discover
              </motion.div>
              
          </motion.div>

          
        </div>

        {/* Scroll Hint */}
        
       
      </div>
      

      {/* Desktop Layout */}
      <div className="hidden md:block relative z-10 w-full px-6 lg:px-12 pt-32 pb-16 min-h-screen flex items-center">
        {/* Full Width Character Image - Desktop */}
        <motion.div
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          <Image
            src="/synth_character_lossless.webp"
            alt="Synth AI Cohost"
            fill
            className="object-cover object-top"
            priority
            unoptimized
          />
        </motion.div>
        {/* Section Number - Left Side - Hidden on mobile */}
        <div className="hidden md:flex absolute left-6 lg:left-12 top-20 flex-col items-center gap-2 z-20">
          <span className="text-[11px] font-bold text-[#7c3aed]">01</span>
          <span className="w-4 h-[2px] bg-[#7c3aed]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="max-w-lg relative z-20"
        >
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center gap-2 mb-6"
          >
            <span className="text-[11px] font-semibold tracking-[1.8px] uppercase text-[#7c3aed]">
              AI Cohost for Live Streamers
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-[clamp(42px,5vw,64px)] font-medium text-[#1a1628] leading-[1.05] tracking-[-2px] mb-5"
          >
            Your stream.
            <br />
            Stronger <span className="text-[#7c3aed]">together</span><span className="text-[#7c3aed]">.</span>
          </motion.h1>

          {/* Body */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-[15px] text-[#5c5575] leading-[1.7] max-w-[380px] mb-3"
          >
            Build intelligent Syns that engage audiences, drive product promotion, and unlock new revenue streams across livestreams and digital experiences.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="text-[15px] text-[#5c5575] leading-[1.7] max-w-[380px] mb-9"
          >
            Extend their presence beyond the broadcast with lightweight desktop companions that keep your Syns active and engaging long after the stream ends.
          </motion.p>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4"
          >
            <motion.button
              onClick={() => setIsSignInOpen(true)}
              whileHover={{ scale: 1.02, backgroundColor: '#7c3aed' }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 bg-[#1a1628] text-white text-[13.5px] font-semibold px-6 py-3 rounded-lg transition-colors border-0 cursor-pointer"
            >
             Download Free Desktop Companion Demo
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.button>
            
         
          </motion.div>
        </motion.div>
      </div>

      {/* Side Labels - Hidden on mobile */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="hidden lg:flex absolute right-8 top-1/2 -translate-y-1/2 flex-col gap-3 z-10"
      >
        {['ENGAGE', 'SUPPORT', 'COLLABORATE'].map((label, index) => (
          <motion.span
            key={label}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
            className="text-[11px] font-bold tracking-[2px] uppercase text-[#1a1628] flex items-center gap-2"
          >
            <span className="text-sm text-[#7c3aed]">+</span>
            {label}
          </motion.span>
        ))}
      </motion.div>

      {/* Scroll Hint - Desktop only */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="hidden md:block absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] tracking-[2.5px] uppercase text-[#9d99b5] z-10"
      >
        Scroll to discover
      </motion.div>

      {/* Bottom line separator */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-[#0d0b14]" />

      {/* Sign In Modal */}
      <AnimatePresence>
        {isSignInOpen && (
          <SignInModal isOpen={isSignInOpen} onClose={() => setIsSignInOpen(false)} />
        )}
      </AnimatePresence>

      </section>
  );
}
