'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import SignInModal from './SignInModal';
import { usePopup } from '../contexts/PopupContext';

type NavLink = {
  name: string;
  href: string;
  isPopup?: boolean;
  popupType?: 'what-are-syns' | 'our-products';
};

const navLinks: NavLink[] = [
  { name: 'What Are Syns', href: '#', isPopup: true, popupType: 'what-are-syns' },
  { name: 'Our Products', href: '#', isPopup: true, popupType: 'our-products' },
  { name: 'For Streamers', href: '#streamers' },
];

export default function Navbar() {
  const { isPopupOpen, popupType, openPopup, closePopup } = usePopup();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  // Calculate which character is being hovered (6 characters total)
  const getCharacterIndex = () => {
    if (!isHovering) return -1;
    const characterWidth = 100 / 6; // Each character takes up ~16.67% of width
    return Math.floor(mousePosition.x / characterWidth);
  };

  const characterIndex = getCharacterIndex();

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-6 lg:px-12 bg-[rgba(240,238,248,0.97)] backdrop-blur-[10px] border-b border-[rgba(124,58,237,0.08)]"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/Cohost Synth logo.png"
            alt="Synth Cohost"
            width={120}
            height={40}
            className="w-auto h-8"
          />
          <span className="text-[13px] font-extrabold tracking-[-0.3px] text-[#1a1628] leading-[1.1]">
            SYNTH<span className="block font-normal">COHOST</span>
          </span>
        </Link>

        {/* Desktop Navigation - Centered */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.name}>
              {link.isPopup ? (
                <button
                  onClick={() => {
                    openPopup(link.popupType || null);
                  }}
                  className="text-[13.5px] font-medium text-[#3d3654] hover:text-[#7c3aed] transition-colors cursor-pointer"
                >
                  {link.name}
                </button>
              ) : (
                <Link
                  href={link.href}
                  className="text-[13.5px] font-medium text-[#3d3654] hover:text-[#7c3aed] transition-colors"
                >
                  {link.name}
                </Link>
              )}
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <div className="hidden md:block">
          <motion.button
            onClick={() => setIsSignInOpen(true)}
            whileHover={{ scale: 1.02, backgroundColor: '#7c3aed' }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 bg-[#1a1628] text-white text-[13.5px] font-semibold px-5 py-2.5 rounded-lg transition-colors border-0 cursor-pointer"
          >
            Get Started
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-[#1a1628]"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-16 z-40 md:hidden bg-[rgba(240,238,248,0.98)] backdrop-blur-xl border-b border-gray-200"
          >
            <div className="px-6 py-8 space-y-4">
              {navLinks.map((link) => (
                link.isPopup ? (
                  <button
                    key={link.name}
                    onClick={() => {
                      openPopup(link.popupType || null);
                      setIsMobileMenuOpen(false);
                    }}
                    className="block text-lg font-medium text-[#3d3654] hover:text-[#7c3aed] transition-colors w-full text-left cursor-pointer"
                  >
                    {link.name}
                  </button>
                ) : (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-lg font-medium text-[#3d3654] hover:text-[#7c3aed] transition-colors"
                  >
                    {link.name}
                  </Link>
                )
              ))}
              <button
                onClick={() => {
                  setIsSignInOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full mt-4 px-6 py-3 bg-[#1a1628] text-white text-sm font-semibold rounded-lg text-center hover:bg-[#7c3aed] transition-colors border-0 cursor-pointer"
              >
                Get Started
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
                }}
              >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closePopup();
                }}
                className={`absolute top-8 text-gray-400 hover:text-gray-600 transition-colors z-10 ${popupType === 'our-products' ? 'right-26' : 'right-8'}`}
              >
                <X className="w-6 h-6" />
              </button>

              <div
                className="flex items-center justify-center relative"
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                {popupType === 'video-demo' ? (
                  <div className="w-full max-w-4xl">
                    <video
                      src="/Synth Cohost's AI Avatars That Stream With You.mp4"
                      autoPlay
                      controls
                      className="w-full rounded-2xl shadow-2xl bg-black"
                    />
                  </div>
                ) : (
                  <>
                    <Image
                      src={popupType === 'our-products' ? '/Our Products Tab. (1).png' : '/cdc.png'}
                      alt={popupType === 'our-products' ? 'Our Products' : 'What Are Syns'}
                      width={1800}
                      height={900}
                      className="w-full max-h-[550px] object-contain border-0 cursor-pointer"
                      unoptimized
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsSignInOpen(true);
                      }}
                    />
                    {/* Focused spotlight on character area */}
                    {isHovering && popupType === 'what-are-syns' && (
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background: `radial-gradient(circle 60px at ${mousePosition.x}% ${mousePosition.y}%, rgba(255, 255, 255, 0.8) 0%, rgba(124, 58, 237, 0.6) 30%, transparent 60%)`,
                          mixBlendMode: 'screen',
                        }}
                      />
                    )}
                  </>
                )}
              </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sign In Modal */}
      <AnimatePresence>
        {isSignInOpen && (
          <SignInModal onClose={() => {
            setIsSignInOpen(false);
            closePopup();
          }} />
        )}
      </AnimatePresence>
    </>
  );
}
