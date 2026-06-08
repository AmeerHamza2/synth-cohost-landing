'use client';

import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-screen bg-[#FAFAFC] overflow-hidden pt-20">
      {/* Left Navigation Rail for Section 01 */}
      <div className="hidden lg:flex fixed left-0 top-0 bottom-0 w-[80px] flex-col items-center pt-32 z-30 pointer-events-none">
        <span className="text-[11px] font-medium tracking-[0.2em] text-[#080812]/40">01</span>
        <div className="w-px flex-1 bg-[#080812]/10 mt-4" />
      </div>

      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FAFAFC] to-[#F0F0F5]" />
      
      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 lg:pl-[100px] py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative z-10"
          >
            {/* Label */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#8B5CF6]/10 rounded-full mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-[#8B5CF6] animate-pulse" />
              <span className="text-sm font-medium text-[#8B5CF6] tracking-wide">
                AI COHOST FOR LIVE STREAMERS
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-5xl lg:text-7xl font-bold text-[#080812] leading-[1.1] mb-6"
            >
              Your stream.
              <br />
              <span className="text-gradient-purple">Stronger together.</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg lg:text-xl text-[#080812]/60 max-w-lg mb-10 leading-relaxed"
            >
              Synth Cohost is an AI cohost that talks with you, engages your audience, 
              and helps your stream run smoother—so you can focus on what you love.
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-[#8B5CF6] text-white font-semibold rounded-xl hover:bg-[#7C4FE0] transition-colors glow-purple-sm"
              >
                See It In Action
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white text-[#080812] font-semibold rounded-xl border-2 border-[#080812]/10 hover:border-[#8B5CF6]/50 transition-colors flex items-center gap-2"
              >
                <Play className="w-5 h-5" />
                Watch Demo
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right Content - AI Character */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
            className="relative lg:h-[600px] flex items-center justify-center"
          >
            {/* Glowing background effects */}
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Large star/spark shape */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
                className="absolute w-[500px] h-[500px]"
              >
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  <defs>
                    <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#C4B5FD" stopOpacity="0.1" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M100 0 L120 80 L200 100 L120 120 L100 200 L80 120 L0 100 L80 80 Z"
                    fill="url(#starGradient)"
                  />
                </svg>
              </motion.div>

              {/* Gradient glow */}
              <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute w-[400px] h-[400px] rounded-full bg-gradient-to-r from-[#8B5CF6]/30 to-[#C4B5FD]/20 blur-3xl"
              />
            </div>

            {/* Floating particles */}
            <div className="absolute inset-0 pointer-events-none">
              {[
                { left: 25, top: 30, duration: 3.5, delay: 0.5 },
                { left: 35, top: 45, duration: 4.2, delay: 1.2 },
                { left: 55, top: 25, duration: 3.8, delay: 0.8 },
                { left: 70, top: 55, duration: 4.5, delay: 1.8 },
                { left: 40, top: 65, duration: 3.2, delay: 0.3 },
                { left: 60, top: 35, duration: 4.0, delay: 1.5 },
                { left: 30, top: 55, duration: 3.6, delay: 0.9 },
                { left: 75, top: 40, duration: 4.3, delay: 0.1 },
                { left: 45, top: 75, duration: 3.4, delay: 1.0 },
                { left: 65, top: 60, duration: 4.1, delay: 1.6 },
                { left: 50, top: 50, duration: 3.9, delay: 0.6 },
                { left: 80, top: 70, duration: 4.4, delay: 1.3 },
              ].map((pos, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full bg-[#8B5CF6]"
                  style={{
                    left: `${pos.left}%`,
                    top: `${pos.top}%`,
                  }}
                  animate={{
                    y: [0, -30, 0],
                    opacity: [0.3, 0.8, 0.3],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: pos.duration,
                    repeat: Infinity,
                    delay: pos.delay,
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </div>

            {/* AI Character placeholder - stylized avatar */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="relative z-10"
            >
              <div className="relative w-[350px] h-[450px] lg:w-[400px] lg:h-[520px]">
                {/* Character silhouette with gradient */}
                <div className="absolute inset-0 rounded-3xl overflow-hidden bg-gradient-to-b from-[#1a1a2e] to-[#080812] border border-[#8B5CF6]/30 glow-purple">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#8B5CF6]/20" />
                  
                  {/* Stylized AI avatar representation */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    {/* Head/Face area */}
                    <div className="relative mb-4">
                      <div className="w-32 h-32 rounded-full bg-gradient-to-b from-[#f5e6d3] to-[#e8d4c0] relative overflow-hidden">
                        {/* Hair */}
                        <div className="absolute -top-4 -left-4 -right-4 h-20 bg-gradient-to-br from-[#1a1a2e] via-[#8B5CF6] to-[#C4B5FD] rounded-t-full" />
                        {/* Hair strands with purple glow */}
                        <motion.div
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="absolute top-0 left-2 w-2 h-16 bg-gradient-to-b from-[#8B5CF6] to-transparent rounded-full blur-sm"
                        />
                        <motion.div
                          animate={{ opacity: [0.7, 1, 0.7] }}
                          transition={{ duration: 2.5, repeat: Infinity }}
                          className="absolute top-2 right-4 w-3 h-14 bg-gradient-to-b from-[#C4B5FD] to-transparent rounded-full blur-sm"
                        />
                        {/* Eyes */}
                        <div className="absolute top-14 left-1/2 transform -translate-x-1/2 flex gap-6">
                          <div className="w-4 h-4 rounded-full bg-[#8B5CF6] relative">
                            <div className="absolute inset-0 rounded-full bg-white/30 animate-pulse" />
                          </div>
                          <div className="w-4 h-4 rounded-full bg-[#8B5CF6] relative">
                            <div className="absolute inset-0 rounded-full bg-white/30 animate-pulse" />
                          </div>
                        </div>
                        {/* Smile */}
                        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-8 h-2 border-b-2 border-[#c9a88e] rounded-b-full" />
                      </div>
                    </div>
                    
                    {/* Body - Black hoodie */}
                    <div className="w-48 h-48 bg-gradient-to-b from-[#1a1a2e] to-[#080812] rounded-t-3xl relative">
                      {/* Hoodie details */}
                      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-16 h-8 border-b-2 border-[#2a2a4e] rounded-b-full" />
                      <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-1 h-20 bg-[#2a2a4e]" />
                      {/* Subtle logo on hoodie */}
                      <motion.div
                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="absolute top-24 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full border border-[#8B5CF6]/50"
                      />
                    </div>
                    
                    {/* Glow effect at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#8B5CF6]/30 to-transparent" />
                  </div>
                  
                  {/* Ambient light reflection */}
                  <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-[#8B5CF6]/10 to-transparent" />
                </div>
                
                {/* Outer glow ring */}
                <motion.div
                  animate={{ opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -inset-4 rounded-[2rem] border border-[#8B5CF6]/30 pointer-events-none"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Right Side Labels */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="hidden lg:flex flex-col items-end gap-4 fixed right-8 top-1/2 -translate-y-1/2 z-20"
      >
        {['ENGAGE', 'SUPPORT', 'COLLABORATE'].map((label, i) => (
          <span
            key={label}
            className="text-[10px] font-medium tracking-[0.3em] text-[#080812]/30 hover:text-[#8B5CF6] transition-colors cursor-default"
            style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
          >
            {label}
          </span>
        ))}
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10"
      >
        <span className="text-[10px] font-medium tracking-[0.3em] text-[#080812]/40">
          SCROLL TO EXPLORE
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px h-8 bg-gradient-to-b from-[#080812]/20 to-transparent"
        />
      </motion.div>

      {/* Bottom gradient transition */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-[#080812]" />
    </section>
  );
}
