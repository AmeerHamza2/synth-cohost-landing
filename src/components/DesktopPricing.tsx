'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Check, Monitor } from 'lucide-react';
import WaitlistModal from './WaitlistModal';
import SignInModal from './SignInModal';
import GlassCard from './GlassCard';
import GradientButton from './GradientButton';

export default function DesktopPricing() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const companionImages = [
    { id: 'robot', image: '/UUU3.png', title: 'Robot' },
    { id: 'cat', image: '/UUU4.png', title: 'Cat' },
    { id: 'premium', image: '/UUU5.png', title: 'Premium' },
  ];

  return (
    <>
      {/* Mobile Version */}
      <section className="md:hidden relative bg-[#050505] py-4 px-4 max-w-[420px] mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <Monitor size={28} className="text-[#7A3CFF]" />
            <h2 className="text-[32px] font-extrabold uppercase tracking-[-0.5px] text-white leading-none">
              1. DESKTOP COMPANION
            </h2>
          </div>
          <p className="text-[12px] font-semibold tracking-[2px] uppercase text-[#7A3CFF] ml-11">
            YOUR PRIVATE AI COMPANION
          </p>
        </motion.div>

        {/* Pricing Cards - Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="relative w-full h-[500px] mb-4">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = offset.x * velocity.x;
                if (swipe < -1000 || offset.x < -50) {
                  setCurrentIndex((prev) => (prev + 1) % companionImages.length);
                } else if (swipe > 1000 || offset.x > 50) {
                  setCurrentIndex((prev) => prev === 0 ? companionImages.length - 1 : prev - 1);
                }
              }}
              className="relative w-full h-full rounded-[10px] overflow-hidden cursor-pointer touch-pan-y bg-[#101018]"
              style={{
                boxShadow: hoveredIndex === currentIndex 
                  ? '0 0 30px rgba(124, 58, 237, 0.8), 0 0 60px rgba(124, 58, 237, 0.5)' 
                  : 'none'
              }}
              onHoverStart={() => setHoveredIndex(currentIndex)}
              onHoverEnd={() => setHoveredIndex(null)}
            >
              {currentIndex === 0 && (
                <div className="relative bg-[#111120] border border-[rgba(139,92,255,.25)] rounded-[22px] p-5 h-full shadow-[0_20px_60px_rgba(98,0,255,.18)] overflow-hidden">
                  <div className="relative z-10 w-[58%]">
                    <h3 className="text-white font-bold uppercase text-[18px] tracking-tight mb-4">FREE TIER</h3>
                    <div className="text-[44px] font-bold text-[#8B5CFF] mb-4">$0</div>

                    <div className="mb-4">
                      <p className="text-[#87879A] text-[13px] font-bold mb-2">Includes:</p>
                      <ul className="space-y-[10px]">
                        <li className="flex items-center gap-3 text-[14px] font-medium text-[#D8D8D8] leading-6">
                          <Check className="w-4 h-4 text-[#8B5CFF]" />
                          Basic companion
                        </li>
                        <li className="flex items-center gap-3 text-[14px] font-medium text-[#D8D8D8] leading-6">
                          <Check className="w-4 h-4 text-[#8B5CFF]" />
                          Limited personality
                        </li>
                        <li className="flex items-center gap-3 text-[14px] font-medium text-[#D8D8D8] leading-6">
                          <Check className="w-4 h-4 text-[#8B5CFF]" />
                          Limited memory
                        </li>
                        <li className="flex items-center gap-3 text-[14px] font-medium text-[#D8D8D8] leading-6">
                          <Check className="w-4 h-4 text-[#8B5CFF]" />
                          Limited interactions
                        </li>
                      </ul>
                    </div>

                    <button
                      onClick={() => setIsSignInOpen(true)}
                      className="w-full h-[48px] rounded-[12px] bg-gradient-to-r from-[#6F2CFF] to-[#8B5CFF] text-white font-semibold text-[15px] transition-all cursor-pointer hover:shadow-[0_8px_30px_rgba(120,80,255,.45)] hover:scale-[1.02] mt-20"
                    >
                      Get Started
                    </button>
                  </div>

                  <div className="absolute right-[-20px] top-1/2 -translate-y-1/2 w-[60%] h-[85%] pointer-events-none">
                    <motion.div
                      animate={{ y: [-4, 0, -4] }}
                      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                      className="relative w-full h-full"
                    >
                      <Image
                        src="/UUU3.png"
                        alt="Robot"
                        fill
                        className="object-contain object-top"
                        unoptimized
                      />
                    </motion.div>
                    <div className="absolute -bottom-4 -right-4 w-32 h-32 rounded-full bg-[#8B5CFF] blur-[60px] opacity-30" />
                  </div>
                </div>
              )}

              {currentIndex === 1 && (
                <div className="relative bg-[#111120] border border-[rgba(139,92,255,.25)] rounded-[22px] p-5 h-full shadow-[0_20px_60px_rgba(98,0,255,.18)] overflow-hidden">
                  <div className="relative z-10 w-[58%]">
                    <h3 className="text-white font-bold uppercase text-[18px] tracking-tight mb-4">PAID COMPANION</h3>
                    <div className="text-[44px] font-bold text-[#8B5CFF] mb-1">$19.99</div>
                    <p className="text-[#B9B9C8] text-[13px] mb-4">One-time purchase</p>

                    <div className="mb-4">
                      <p className="text-[#87879A] text-[13px] font-bold mb-2">Includes:</p>
                      <ul className="space-y-[10px]">
                        <li className="flex items-center gap-3 text-[14px] font-medium text-[#D8D8D8] leading-6">
                          <Check className="w-4 h-4 text-[#8B5CFF]" />
                          Unlock character
                        </li>
                        <li className="flex items-center gap-3 text-[14px] font-medium text-[#D8D8D8] leading-6">
                          <Check className="w-4 h-4 text-[#8B5CFF]" />
                          More animations
                        </li>
                        <li className="flex items-center gap-3 text-[14px] font-medium text-[#D8D8D8] leading-6">
                          <Check className="w-4 h-4 text-[#8B5CFF]" />
                          Customization
                        </li>
                        <li className="flex items-center gap-3 text-[14px] font-medium text-[#D8D8D8] leading-6">
                          <Check className="w-4 h-4 text-[#8B5CFF]" />
                          Better personality
                        </li>
                      </ul>
                    </div>

                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="w-full h-[48px] rounded-[12px] bg-gradient-to-r from-[#6F2CFF] to-[#8B5CFF] text-white font-semibold text-[15px] transition-all cursor-pointer hover:shadow-[0_8px_30px_rgba(120,80,255,.45)] hover:scale-[1.02] mt-20"
                    >
                      Unlock Now
                    </button>
                  </div>

                  <div className="absolute right-[-20px] top-[60%] -translate-y-1/2 w-[65%] h-[90%] pointer-events-none">
                    <motion.div
                      animate={{ y: [-4, 0, -4] }}
                      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                      className="relative w-full h-full"
                    >
                      <Image
                        src="/UUU4.png"
                        alt="Cat"
                        fill
                        className="object-contain object-top"
                        unoptimized
                      />
                    </motion.div>
                    <div className="absolute -bottom-4 -right-4 w-32 h-32 rounded-full bg-[#8B5CFF] blur-[60px] opacity-30" />
                  </div>
                </div>
              )}

              {currentIndex === 2 && (
                <div className="relative bg-[#111120] border border-[rgba(139,92,255,.25)] rounded-[22px] p-5 h-full shadow-[0_20px_60px_rgba(98,0,255,.18)] overflow-hidden">
                  <div className="relative z-10 w-[58%]">
                    <h3 className="text-white font-bold uppercase text-[18px] tracking-tight mb-3">PREMIUM AI COMPANION</h3>
                    <div className="flex items-end gap-1 mb-1">
                      <span className="text-[44px] font-bold text-[#8B5CFF] leading-none">
                        $9.99
                      </span>
                      <span className="text-[14px] text-[#B9B9C8] mb-1">
                        /month
                      </span>
                    </div>
                    <div className="mb-2">
                      <p className="text-[#B9B9C8] text-sm">or</p>
                      <div className="flex items-end gap-1">
                        <span className="text-[36px] font-bold text-[#8B5CFF]">
                          $79
                        </span>
                        <span className="text-[14px] text-[#8B5CFF] mb-1">
                          /year
                        </span>
                      </div>
                    </div>

                    <div className="mb-3">
                      <p className="text-[#87879A] text-[13px] font-bold mb-1">Includes:</p>
                      <ul className="space-y-[8px]">
                        <li className="flex items-center gap-3 text-[14px] font-medium text-[#D8D8D8] leading-5">
                          <Check className="w-4 h-4 text-[#8B5CFF]" />
                          Long-term memory
                        </li>
                        <li className="flex items-center gap-3 text-[14px] font-medium text-[#D8D8D8] leading-5">
                          <Check className="w-4 h-4 text-[#8B5CFF]" />
                          Advanced conversations
                        </li>
                        <li className="flex items-center gap-3 text-[14px] font-medium text-[#D8D8D8] leading-5">
                          <Check className="w-4 h-4 text-[#8B5CFF]" />
                          Personality tuning
                        </li>
                        <li className="flex items-center gap-3 text-[14px] font-medium text-[#D8D8D8] leading-5">
                          <Check className="w-4 h-4 text-[#8B5CFF]" />
                          More behaviors
                        </li>
                        <li className="flex items-center gap-3 text-[14px] font-medium text-[#D8D8D8] leading-5">
                          <Check className="w-4 h-4 text-[#8B5CFF]" />
                          Voice features
                        </li>
                        <li className="flex items-center gap-3 text-[14px] font-medium text-[#D8D8D8] leading-5">
                          <Check className="w-4 h-4 text-[#8B5CFF]" />
                          Cloud sync
                        </li>
                      </ul>
                    </div>

                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="w-full h-[48px] rounded-[12px] bg-gradient-to-r from-[#6F2CFF] to-[#8B5CFF] text-white font-semibold text-[15px] transition-all cursor-pointer hover:shadow-[0_8px_30px_rgba(120,80,255,.45)] hover:scale-[1.02]"
                    >
                      Go Premium
                    </button>
                  </div>

                  <div className="absolute right-[-20px] top-1/2 -translate-y-1/2 w-[60%] h-[85%] pointer-events-none">
                    <motion.div
                      animate={{ y: [-4, 0, -4] }}
                      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                      className="relative w-full h-full"
                    >
                      <Image
                        src="/UUU5.png"
                        alt="Premium Robot"
                        fill
                        className="object-contain object-top"
                        unoptimized
                      />
                    </motion.div>
                    <div className="absolute -bottom-4 -right-4 w-32 h-32 rounded-full bg-[#8B5CFF] blur-[60px] opacity-30" />
                  </div>
                </div>
              )}
            </motion.div>

            {/* Navigation Arrows */}
            <button
              onClick={() => setCurrentIndex((prev) => prev === 0 ? companionImages.length - 1 : prev - 1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors z-10"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button
              onClick={() => setCurrentIndex((prev) => (prev + 1) % companionImages.length)}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors z-10"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mb-4">
            {companionImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-[#7c3aed]' : 'bg-[#7c6edc]'
                }`}
              />
            ))}
          </div>
        </motion.div>

        <WaitlistModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        <SignInModal isOpen={isSignInOpen} onClose={() => setIsSignInOpen(false)} />
      </section>

      {/* Desktop Version (Unchanged) */}
      <section className="hidden md:block py-4 px-6 lg:px-12 max-w-[1400px] mx-auto">
        <WaitlistModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        <SignInModal isOpen={isSignInOpen} onClose={() => setIsSignInOpen(false)} />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-[28px] bg-gradient-to-b from-[#0C0A16] to-[#090811] border border-[rgba(139,61,255,.18)] p-8 shadow-[0_20px_60px_rgba(0,0,0,.45)]"
        >
          <div className="flex items-center gap-4 mb-8">
            <Monitor size={42} color="#8B3DFF" />
            <div>
              <h2 className="text-[40px] font-extrabold uppercase tracking-[0.5px] text-white leading-none">
                1. DESKTOP COMPANION
              </h2>
              <p className="text-[14px] font-semibold tracking-[2px] uppercase text-[#9B5CFF] mt-1">
                CONSUMER MARKET
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-[1fr_1fr_1.15fr] gap-6 mt-8">
            {/* Free Tier */}
            <motion.div
              whileHover={{ y: -6 }}
                        className="relative rounded-[22px] bg-[#11111C] border border-[rgba(139,61,255,.20)] px-8 pt-7 pb-6 h-[430px] flex flex-col shadow-[0_12px_40px_rgba(0,0,0,.35)] before:absolute before:inset-0 before:rounded-[22px] before:bg-[radial-gradient(circle_at_top_right,rgba(139,61,255,.15),transparent_70%)] before:pointer-events-none transition-all duration-300 hover:shadow-[0_0_50px_rgba(139,61,255,.25)]"
            >
              <h3 className="text-[18px] font-bold uppercase text-white mb-2">FREE TIER</h3>
              <div className="text-[44px] font-black text-[#8B3DFF] mb-2">$0</div>
              
              <div className="absolute right-0 top-20 -mr-15">
                <Image
                  src="/UUU3.png"
                  alt="Robot"
                  width={280}
                  height={280}
                  className="object-contain"
                  unoptimized
                />
              </div>

              <ul className="space-y-2 mb-auto">
                <li className="flex items-center gap-3 text-[#C9C9D4] text-[15px] font-medium leading-[22px]">
                  <Check className="w-5 h-5 text-[#8B3DFF]" />
                  Basic companion
                </li>
                <li className="flex items-center gap-3 text-[#C9C9D4] text-[15px] font-medium leading-[22px]">
                  <Check className="w-5 h-5 text-[#8B3DFF]" />
                  Limited personality
                </li>
                <li className="flex items-center gap-3 text-[#C9C9D4] text-[15px] font-medium leading-[22px]">
                  <Check className="w-5 h-5 text-[#8B3DFF]" />
                  Limited memory
                </li>
                <li className="flex items-center gap-3 text-[#C9C9D4] text-[15px] font-medium leading-[22px]">
                  <Check className="w-5 h-5 text-[#8B3DFF]" />
                  Limited interactions
                </li>
              </ul>

              <button onClick={() => setIsSignInOpen(true)} className="w-full h-12 rounded-xl border border-[#8B3DFF] text-white font-semibold hover:bg-[#8B3DFF] transition-colors cursor-pointer mt-1">
                Get Started
              </button>
            </motion.div>

            {/* Paid Companion */}
            <motion.div
              whileHover={{ y: -6 }}
                        className="relative rounded-[22px] bg-[#11111C] border border-[rgba(139,61,255,.20)] px-8 pt-7 pb-6 h-[430px] flex flex-col shadow-[0_12px_40px_rgba(0,0,0,.35)] before:absolute before:inset-0 before:rounded-[22px] before:bg-[radial-gradient(circle_at_top_right,rgba(139,61,255,.15),transparent_70%)] before:pointer-events-none transition-all duration-300 hover:shadow-[0_0_50px_rgba(139,61,255,.25)]"
            >
              <h3 className="text-[18px] font-bold uppercase text-white mb-4">PAID COMPANION</h3>
              <div className="text-[44px] font-black text-[#8B3DFF] mb-2">$19.99</div>
              <p className="text-[#A8A8B5] text-[14px] mb-4">One-time purchase</p>
              
              <div className="absolute right-0 top-20 -mr-15">
                <Image
                  src="/UUU4.png"
                  alt="Cat"
                  width={280}
                  height={280}
                  className="object-contain"
                  unoptimized
                />
              </div>

              <ul className="space-y-2 mb-auto">
                <li className="flex items-center gap-3 text-[#C9C9D4] text-[15px] font-medium leading-[22px]">
                  <Check className="w-5 h-5 text-[#8B3DFF]" />
                  Unlock character
                </li>
                <li className="flex items-center gap-3 text-[#C9C9D4] text-[15px] font-medium leading-[22px]">
                  <Check className="w-5 h-5 text-[#8B3DFF]" />
                  More animations
                </li>
                <li className="flex items-center gap-3 text-[#C9C9D4] text-[15px] font-medium leading-[22px]">
                  <Check className="w-5 h-5 text-[#8B3DFF]" />
                  Customization
                </li>
                <li className="flex items-center gap-3 text-[#C9C9D4] text-[15px] font-medium leading-[22px]">
                  <Check className="w-5 h-5 text-[#8B3DFF]" />
                  Better personality
                </li>
              </ul>

              <button onClick={() => setIsModalOpen(true)} className="w-full h-12 rounded-xl bg-gradient-to-r from-[#8B3DFF] to-[#6A1BFF] text-white font-semibold hover:shadow-[0_0_30px_rgba(139,61,255,.4)] transition-all cursor-pointer mt-4">
                Unlock Now
              </button>
            </motion.div>

            {/* Premium - Best Value */}
            <motion.div
              whileHover={{ y: -6 }}
                        className="relative rounded-[22px] bg-[#11111C] border-2 border-[#8B3DFF] px-8 pt-7 pb-6 h-[560px] flex flex-col shadow-[0_12px_40px_rgba(0,0,0,.35)] before:absolute before:inset-0 before:rounded-[22px] before:bg-[radial-gradient(circle_at_top_right,rgba(139,61,255,.15),transparent_70%)] before:pointer-events-none transition-all duration-300 hover:shadow-[0_0_60px_rgba(139,61,255,.28)] scale-[1.03]"
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#8B3DFF] text-white text-[12px] font-bold px-5 py-1.5 rounded-full">
                BEST VALUE
              </div>

              <h3 className="text-[18px] font-bold uppercase text-white mb-4 tracking-[0.5px]">PREMIUM AI COMPANION</h3>
              <div className="flex items-end gap-1 mb-2">
                <span className="text-[56px] font-black text-[#8B3DFF] leading-none">
                  $9.99
                </span>
                <span className="text-[18px] text-[#A8A8B5] mb-1">
                  /month
                </span>
              </div>
              <div className="mb-2">
                <p className="text-[#A8A8B5]  text-sm">
                  or
                </p>
                <div className="flex items-end gap-1">
                  <span className="text-[38px] font-black text-[#8B3DFF]">
                    $79
                  </span>
                  <span className="text-[18px] text-[#8B3DFF] mb-1">
                    /year
                  </span>
                </div>
              </div>
              
              <div className="absolute right-0 top-24 -mr-8">
                <Image
                  src="/UUU5.png"
                  alt="Premium Robot"
                  width={280}
                  height={280}
                  className="object-contain"
                  unoptimized
                />
              </div>

              <p className="text-[#9B5CFF] text-[14px] mb-0.5 font-bold">Includes:</p>
              
              <ul className="space-y-1.5 mb-auto">
                <li className="flex items-center gap-3 text-[#C9C9D4] text-[15px] font-medium leading-[22px]">
                  <Check className="w-5 h-5 text-[#8B3DFF]" />
                  Long-term memory
                </li>
                <li className="flex items-center gap-3 text-[#C9C9D4] text-[15px] font-medium leading-[22px]">
                  <Check className="w-5 h-5 text-[#8B3DFF]" />
                  Advanced conversations
                </li>
                <li className="flex items-center gap-3 text-[#C9C9D4] text-[15px] font-medium leading-[22px]">
                  <Check className="w-5 h-5 text-[#8B3DFF]" />
                  Personality tuning
                </li>
                <li className="flex items-center gap-3 text-[#C9C9D4] text-[15px] font-medium leading-[22px]">
                  <Check className="w-5 h-5 text-[#8B3DFF]" />
                  More behaviors
                </li>
                <li className="flex items-center gap-3 text-[#C9C9D4] text-[15px] font-medium leading-[22px]">
                  <Check className="w-5 h-5 text-[#8B3DFF]" />
                  Voice features
                </li>
                <li className="flex items-center gap-3 text-[#C9C9D4] text-[15px] font-medium leading-[22px]">
                  <Check className="w-5 h-5 text-[#8B3DFF]" />
                  Cloud sync
                </li>
              </ul>

              <button onClick={() => setIsModalOpen(true)} className="w-full h-12 rounded-xl bg-gradient-to-r from-[#8B3DFF] to-[#6A1BFF] text-white font-semibold hover:shadow-[0_0_30px_rgba(139,61,255,.4)] transition-all cursor-pointer mt-4">
                Go Premium
              </button>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </>
  );
}
