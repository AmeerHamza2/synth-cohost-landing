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
  ];

  return (
    <>
     <nav className="fixed top-0 left-0 right-0 z-50 h-[90px] bg-[#07070B]/80 backdrop-blur-xl border-b border-[rgba(139,61,255,.25)]">
  <div className="max-w-[1600px] mx-auto h-full flex items-center px-6 lg:px-12">

    {/* Logo */}
    <Link href="/" className="flex items-center shrink-0">
      <Image
        src="/syn.png"
        alt="Synth Cohost"
        width={120}
        height={40}
        className="w-auto h-10"
        loading="eager"
      />
    </Link>

    {/* Navigation - pushed much closer to logo */}
    <ul className="hidden  ml-65 md:flex gap-8">
      {navLinks.map((link) => (
        <li key={link.name}>
          <Link
            href={link.href}
            className="text-[15px] font-medium text-[#A8A8B5] hover:text-white transition-colors cursor-pointer"
          >
            {link.name}
          </Link>
        </li>
      ))}
    </ul>

    {/* Pushes everything after this to the far right */}
    <div className="flex-1" />

    {/* Join Waitlist Button */}
    <button className="hidden md:block px-8 h-12 rounded-xl border border-[#8B3DFF] text-white font-medium hover:bg-[#8B3DFF]/10 transition-colors cursor-pointer">
      Join Waitlist
    </button>

    {/* Mobile Menu */}
    <button
      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      className="md:hidden p-2 text-white cursor-pointer"
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
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-lg font-medium text-[#A8A8B5] hover:text-white transition-colors cursor-pointer"
                >
                  {link.name}
                </Link>
              ))}
              {/* Join Waitlist Button in Mobile */}
              <button className="w-full mt-6 px-8 h-12 rounded-xl border border-[#8B3DFF] text-white font-medium hover:bg-[#8B3DFF]/10 transition-colors cursor-pointer">
                Join Waitlist
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
