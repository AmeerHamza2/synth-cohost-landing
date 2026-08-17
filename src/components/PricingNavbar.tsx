'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { usePopup } from '../contexts/PopupContext';
import SignInModal from './SignInModal';
import WaitlistModal from './WaitlistModal';

export default function PricingNavbar() {
  const { isPopupOpen, popupType, openPopup, closePopup } = usePopup();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

  const navLinks = [
    { name: 'What Are Syns', href: '#', isPopup: true, popupType: 'what-are-syns' },
    { name: 'Our Products', href: '/products' },
    { name: 'For Streamers', href: '/#streamers' },
  ];

  return (
    <>
     <nav className="fixed top-0 left-0 right-0 z-50 h-[90px] bg-[#07070B]/80 backdrop-blur-xl border-b border-[rgba(139,61,255,.25)]">
  <div className="max-w-[1600px] mx-auto h-full flex items-center px-6 lg:px-12">

    {/* Logo */}
    <Link href="/" className="flex items-center gap-2 shrink-0">
      <Image
        src="/Cohost Synth logo.png"
        alt="Synth Cohost"
        width={120}
        height={40}
        className="w-auto h-8"
        loading="eager"
      />
      <span className="text-[13px] font-extrabold tracking-[-0.3px] text-white leading-[1.1]">
        SYNTH<span className="block font-normal">COHOST</span>
      </span>
    </Link>

    {/* Navigation - centered */}
    <ul className="hidden md:flex gap-4 md:gap-8 flex-1 justify-center">
      {navLinks.map((link) => (
        <li key={link.name}>
          {(link as any).isPopup ? (
            <button
              onClick={() => openPopup((link as any).popupType || null)}
              className="text-[12px] sm:text-[13px] md:text-[15px] font-medium text-[#A8A8B5] hover:text-white transition-colors cursor-pointer border-0 bg-transparent p-0"
            >
              {link.name}
            </button>
          ) : (
            <Link
              href={link.href}
              className="text-[12px] sm:text-[13px] md:text-[15px] font-medium text-[#A8A8B5] hover:text-white transition-colors cursor-pointer"
            >
              {link.name}
            </Link>
          )}
        </li>
      ))}
    </ul>

    {/* Join Waitlist Button */}
    <button onClick={() => setIsWaitlistOpen(true)} className="hidden md:block px-8 h-12 rounded-xl border border-[#8B3DFF] text-white font-medium hover:bg-[#8B3DFF]/10 transition-colors cursor-pointer">
      Join Waitlist
    </button>

    {/* Mobile Menu */}
    <button
      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      className="md:hidden p-2 text-white cursor-pointer ml-auto"
    >
      {isMobileMenuOpen ? (
        <X className="w-6 h-6" />
      ) : (
        <Menu className="w-6 h-6" />
      )}
    </button>

  </div>
</nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-[90px] z-40 md:hidden bg-[#07070B]/98 backdrop-blur-xl border-b border-[rgba(139,61,255,.25)]"
          >
            <div className="px-6 py-8 space-y-4">
              {navLinks.map((link) => (
                (link as any).isPopup ? (
                  <button
                    key={link.name}
                    onClick={() => {
                      openPopup((link as any).popupType || null);
                      setIsMobileMenuOpen(false);
                    }}
                    className="block text-lg font-medium text-[#A8A8B5] hover:text-white transition-colors w-full text-left cursor-pointer border-0 bg-transparent p-0"
                  >
                    {link.name}
                  </button>
                ) : (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-lg font-medium text-[#A8A8B5] hover:text-white transition-colors cursor-pointer"
                  >
                    {link.name}
                  </Link>
                )
              ))}
              {/* Join Waitlist Button in Mobile */}
              <button onClick={() => setIsWaitlistOpen(true)} className="w-full mt-6 px-8 h-12 rounded-xl border border-[#8B3DFF] text-white font-medium hover:bg-[#8B3DFF]/10 transition-colors cursor-pointer">
                Join Waitlist
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Popup Modal */}
      <AnimatePresence>
        {isPopupOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => closePopup()}
          >
            <div className="flex items-center justify-center min-h-screen px-4">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative rounded-2xl p-8 w-[95vw] max-w-[1800px]"
                onClick={(e) => {
                  e.stopPropagation();
                  closePopup();
                  setIsSignInOpen(true);
                }}
              >
                <div className="relative">
                  <Image
                    src="/cdc.png"
                    alt="What Are Syns"
                    width={1800}
                    height={900}
                    className="w-full max-h-[550px] object-contain border-0 cursor-pointer"
                    unoptimized
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SignIn Modal */}
      <SignInModal isOpen={isSignInOpen} onClose={() => setIsSignInOpen(false)} />

      {/* Waitlist Modal */}
      <WaitlistModal isOpen={isWaitlistOpen} onClose={() => setIsWaitlistOpen(false)} />
    </>
  );
}
