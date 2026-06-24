'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { usePopup } from '../contexts/PopupContext';
import { useState } from 'react';
import SignInModal from './SignInModal';

const footerLinks = {
  main: [
    { name: 'What are Syns?', href: '#', isPopup: true, popupType: 'what-are-syns' },
    { name: 'Products', href: '#', isPopup: true, popupType: 'our-products' },
    { name: 'Download', href: '#', isSignIn: true },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: 'mailto:creator@synthcohost.com' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms of Service', href: '#' },
  ],
};

const socialLinks = [
  {
    name: 'X',
    href: 'https://X.com/synthcohost',
    color: '#ffffff',
    bgColor: 'rgba(255, 255, 255, 0.1)',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.514l-5.1-6.694-5.833 6.694H2.562l7.746-8.973L1.24 2.25h6.676l4.6 6.088L17.595 2.25h.649zm-1.289 18.566h1.83L5.817 4.14H3.88l12.375 16.676z"/>
      </svg>
    )
  },
  {
    name: 'Instagram',
    href: 'https://instagram.com/synthcohost',
    color: '#E1306C',
    bgColor: 'rgba(225, 48, 108, 0.1)',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.057-1.645.069-4.849.069-3.204 0-3.584-.012-4.849-.069-3.259-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163C8.717 0 8.298.013 7.028.072 2.735.272.273 2.69.073 7.052.01 8.317 0 8.741 0 12s.010 3.683.072 4.948c.2 4.358 2.656 6.78 7.019 6.98 1.27.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.617 6.979-6.98.059-1.265.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.28-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.322a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z"/>
      </svg>
    )
  },
  {
    name: 'Discord',
    href: 'https://discord.com/synthcohost',
    color: '#5865F2',
    bgColor: 'rgba(88, 101, 242, 0.1)',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.211.375-.444.864-.607 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.056 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.975 14.975 0 0 0 1.293-2.1.074.074 0 0 0-.041-.103 13.134 13.134 0 0 1-1.871-.889.075.075 0 0 1-.008-.125c.125-.093.25-.19.371-.287a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.009c.12.098.246.195.371.288a.075.075 0 0 1-.006.124 12.993 12.993 0 0 1-1.871.888.075.075 0 0 0-.041.103c.36.687.772 1.341 1.292 2.1a.074.074 0 0 0 .084.028 19.963 19.963 0 0 0 6.002-3.03.075.075 0 0 0 .032-.056c.44-4.467-.735-8.948-3.113-12.66a.06.06 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-.965-2.157-2.156 0-1.193.96-2.157 2.157-2.157 1.203 0 2.157.964 2.157 2.157 0 1.19-.954 2.157-2.157 2.157zm7.975 0c-1.183 0-2.157-.965-2.157-2.156 0-1.193.96-2.157 2.157-2.157 1.202 0 2.157.964 2.157 2.157 0 1.19-.955 2.157-2.157 2.157z"/>
      </svg>
    )
  },
  {
    name: 'YouTube',
    href: 'https://www.youtube.com/@SynthCohost',
    color: '#FF0000',
    bgColor: 'rgba(255, 0, 0, 0.1)',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    )
  },
];

export default function Footer() {
  const { openPopup } = usePopup();
  const [isSignInOpen, setIsSignInOpen] = useState(false);

  return (
    <footer className="relative bg-[#0d0b14] pt-12 lg:pt-16 pb-8 overflow-hidden border-t border-[rgba(255,255,255,0.05)]">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
          {/* Logo Column - Left */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-3">
              <Image
                src="/Cohost Synth logo.png"
                alt="Synth Cohost"
                width={120}
                height={40}
                className="w-auto h-7 lg:h-8"
              />
              <span className="text-[12px] lg:text-[13px] font-extrabold tracking-[-0.3px] text-[#f5f3ff] leading-[1.1]">
                SYNTH<span className="block font-normal">COHOST</span>
              </span>
            </Link>
            <p className="text-[#a09bbf] text-[11px] lg:text-[12.5px] leading-relaxed max-w-xs">
              Digital companions for streams and desktops.
            </p>
          </div>

          {/* Links Column - Right */}
          <div className="flex flex-col justify-center">
            {/* Tagline */}
            <div className="mb-6">
              <p className="text-[#f5f3ff] font-semibold text-sm lg:text-base tracking-wide">
                FOR CREATORS. FOR BRANDS. FOR EVERY COMMUNITY.
              </p>
            </div>

            {/* Main Links */}
            <div className="flex flex-wrap gap-4 lg:gap-6 mb-6">
              {footerLinks.main.map((link) => (
                (link as any).isPopup ? (
                  <button
                    key={link.name}
                    onClick={() => openPopup((link as any).popupType || null)}
                    className="text-[#a09bbf] text-sm lg:text-base hover:text-[#7c3aed] transition-colors cursor-pointer border-0 bg-transparent p-0"
                  >
                    {link.name}
                  </button>
                ) : (link as any).isSignIn ? (
                  <button
                    key={link.name}
                    onClick={() => setIsSignInOpen(true)}
                    className="text-[#a09bbf] text-sm lg:text-base hover:text-[#7c3aed] transition-colors cursor-pointer border-0 bg-transparent p-0"
                  >
                    {link.name}
                  </button>
                ) : (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-[#a09bbf] text-sm lg:text-base hover:text-[#7c3aed] transition-colors"
                  >
                    {link.name}
                  </Link>
                )
              ))}
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap gap-4 lg:gap-6 mb-6">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-[#a09bbf] text-sm lg:text-base hover:text-[#7c3aed] transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Email */}
            <div>
              <a
                href="mailto:creator@synthcohost.com"
                className="text-[#7c3aed] text-sm lg:text-base hover:text-[#a09bbf] transition-colors"
              >
                creator@synthcohost.com
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-[rgba(255,255,255,0.05)] mb-6" />

        {/* Bottom Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-5">
          {/* Copyright */}
          <p className="text-[#5e5a72] text-[11px]">
            © 2026 Synth Cohost. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-2">
            {socialLinks.map((social) => (
              <motion.a
                key={social.name}
                href={social.href}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-8 h-8 rounded-lg transition-all"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  color: '#a09bbf',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = social.bgColor;
                  e.currentTarget.style.color = social.color;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)';
                  e.currentTarget.style.color = '#a09bbf';
                }}
              >
                <div className="flex items-center justify-center w-full h-full">
                  {social.icon}
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </div>

      {/* Sign In Modal */}
      <AnimatePresence>
        {isSignInOpen && (
          <SignInModal onClose={() => setIsSignInOpen(false)} />
        )}
      </AnimatePresence>
    </footer>
  );
}
