'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const navLinks = [
  { name: 'What Are Syns', href: '#', isPopup: true },
  { name: 'For Streamers', href: '#streamers' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
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
          <svg className="w-7 h-7" viewBox="0 0 28 28" fill="none">
            <path d="M14 2L26 8.5V19.5L14 26L2 19.5V8.5L14 2Z" fill="#7c3aed" opacity="0.15"/>
            <path d="M14 6l8 4.5v9L14 24l-8-4.5v-9L14 6z" fill="#7c3aed" opacity="0.35"/>
            <path d="M14 10l4 2.25v4.5L14 19l-4-2.25v-4.5L14 10z" fill="#7c3aed"/>
          </svg>
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
                  onClick={() => setIsPopupOpen(true)}
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
          <motion.a
            href="#"
            whileHover={{ scale: 1.02, backgroundColor: '#7c3aed' }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 bg-[#1a1628] text-white text-[13.5px] font-semibold px-5 py-2.5 rounded-lg transition-colors"
          >
            Get Started
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.a>
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
                      setIsPopupOpen(true);
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
              <a
                href="#"
                className="block w-full mt-4 px-6 py-3 bg-[#1a1628] text-white text-sm font-semibold rounded-lg text-center hover:bg-[#7c3aed] transition-colors"
              >
                Get Started
              </a>
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
            onClick={() => setIsPopupOpen(false)}
          >
            <div className="flex items-center justify-center min-h-screen px-4">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative rounded-2xl p-8 w-[95vw] max-w-[1800px]"
                onClick={(e) => e.stopPropagation()}
              >
              <button
                onClick={() => setIsPopupOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
             
              <div 
                className="flex items-center justify-center relative cursor-crosshair"
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                <Image
                  src="/cdc.png"
                  alt="What Are Syns"
                  width={1800}
                  height={900}
                  className="w-full max-h-[550px] object-contain border-0"
                  unoptimized
                />
                {/* Focused spotlight on character area */}
                {isHovering && (
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle 60px at ${mousePosition.x}% ${mousePosition.y}%, rgba(255, 255, 255, 0.8) 0%, rgba(124, 58, 237, 0.6) 30%, transparent 60%)`,
                      mixBlendMode: 'screen',
                    }}
                  />
                )}
              </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
