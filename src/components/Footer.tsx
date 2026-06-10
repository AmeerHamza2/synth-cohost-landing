'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const footerLinks = {
  Product: [
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Integrations', href: '#' },
    { name: 'Roadmap', href: '#' },
  ],
  'For Streamers': [
    { name: 'Use Cases', href: '#' },
    { name: 'Resources', href: '#' },
    { name: 'Help Center', href: '#' },
  ],
  Company: [
    { name: 'About', href: '#about' },
    { name: 'Careers', href: '#' },
    { name: 'Contact', href: '#' },
    { name: 'Press Kit', href: '#' },
  ],
  Legal: [
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms of Service', href: '#' },
  ],
};

const socialLinks = [
  { name: 'X', href: '#', icon: 'X' },
  { name: 'Instagram', href: '#', icon: 'IG' },
  { name: 'Discord', href: '#', icon: 'DC' },
  { name: 'YouTube', href: '#', icon: 'YT' },
];

export default function Footer() {
  return (
    <footer className="relative bg-[#0d0b14] pt-16 pb-8 overflow-hidden border-t border-[rgba(255,255,255,0.05)]">
      <div className="relative max-w-7xl mx-auto px-6 lg:px-20">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-14">
          {/* Logo Column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-5">
              <svg className="w-7 h-7" viewBox="0 0 28 28" fill="none">
                <path d="M14 2L26 8.5V19.5L14 26L2 19.5V8.5L14 2Z" fill="#7c3aed" opacity="0.15"/>
                <path d="M14 6l8 4.5v9L14 24l-8-4.5v-9L14 6z" fill="#7c3aed" opacity="0.35"/>
                <path d="M14 10l4 2.25v4.5L14 19l-4-2.25v-4.5L14 10z" fill="#7c3aed"/>
              </svg>
              <span className="text-[13px] font-extrabold tracking-[-0.3px] text-[#f5f3ff] leading-[1.1]">
                SYNTH<span className="block font-normal">COHOST</span>
              </span>
            </Link>
            <p className="text-[#a09bbf] text-[12.5px] leading-relaxed max-w-xs">
              The AI cohost that makes streaming better.
            </p>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-[#f5f3ff] font-semibold mb-4 text-[12px]">{category}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-[#a09bbf] text-[12px] hover:text-[#7c3aed] transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
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
                className="w-8 h-8 rounded-lg bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(124,58,237,0.15)] flex items-center justify-center text-[#a09bbf] hover:text-[#7c3aed] transition-all"
              >
                <span className="text-[10px] font-bold">{social.icon}</span>
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
