'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

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
};

const socialLinks = [
  { name: 'X', href: '#', icon: 'X' },
  { name: 'Instagram', href: '#', icon: 'IG' },
  { name: 'Discord', href: '#', icon: 'DC' },
  { name: 'YouTube', href: '#', icon: 'YT' },
];

export default function Footer() {
  return (
    <footer className="relative bg-[#080812] pt-20 pb-10 overflow-hidden">
      {/* Top border glow */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#8B5CF6]/50 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
          {/* Logo Column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <motion.div
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.5 }}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#C4B5FD] flex items-center justify-center"
              >
                <Sparkles className="w-5 h-5 text-white" />
              </motion.div>
              <span className="font-bold text-lg text-white tracking-tight">
                SYNTH COHOST
              </span>
            </Link>
            <p className="text-[#B0B0C0] text-sm leading-relaxed max-w-xs">
              The AI cohost that makes streaming better for creators and their communities.
            </p>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-white font-semibold mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-[#B0B0C0] text-sm hover:text-[#8B5CF6] transition-colors"
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
        <div className="h-px bg-gradient-to-r from-transparent via-[#8B5CF6]/20 to-transparent mb-8" />

        {/* Bottom Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Copyright */}
          <p className="text-[#B0B0C0]/60 text-sm">
            © 2025 Synth Cohost. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <motion.a
                key={social.name}
                href={social.href}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-xl bg-[#11111B] border border-[#8B5CF6]/10 hover:border-[#8B5CF6]/50 flex items-center justify-center text-[#B0B0C0] hover:text-[#8B5CF6] transition-all"
              >
                <span className="text-xs font-bold">{social.icon}</span>
              </motion.a>
            ))}
          </div>
        </div>
      </div>

      {/* Background glow */}
      <motion.div
        animate={{ opacity: [0.05, 0.1, 0.05] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-[#8B5CF6]/20 blur-[100px] pointer-events-none"
      />
    </footer>
  );
}
