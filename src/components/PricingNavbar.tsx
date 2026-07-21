'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function PricingNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'What Are Syns', href: '#' },
    { name: 'Our Products', href: '#' },
    { name: 'For Streamers', href: '#' },
    { name: 'Log In', href: '#' },
    { name: 'Get Started', href: '#', active: true },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 h-[90px] flex items-center justify-between px-6 lg:px-12 bg-[#07070B]/80 backdrop-blur-xl border-b border-[rgba(139,61,255,.25)]">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/syn.png"
            alt="Synth Cohost"
            width={120}
            height={40}
            className="w-auto h-10"
            loading="eager"
            style={{ width: 'auto' }}
          />
        </Link>

        {/* Desktop Navigation - Centered */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link
                href={link.href}
                className={`text-[15px] font-medium transition-colors ${
                  link.active
                    ? 'bg-[#8B3DFF] text-white px-4 py-2 rounded-full'
                    : 'text-[#A8A8B5] hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-white"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
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
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block text-lg font-medium transition-colors ${
                    link.active
                      ? 'bg-[#8B3DFF] text-white px-4 py-2 rounded-full w-fit'
                      : 'text-[#A8A8B5] hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
