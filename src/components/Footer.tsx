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
  { 
    name: 'X', 
    href: '#', 
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
    href: '#', 
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
    href: '#', 
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
    href: '#', 
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
  return (
    <footer className="relative bg-[#0d0b14] pt-12 lg:pt-16 pb-8 overflow-hidden border-t border-[rgba(255,255,255,0.05)]">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-20">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-10 mb-10 lg:mb-14">
          {/* Logo Column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 lg:mb-5">
              <svg className="w-6 h-6 lg:w-7 lg:h-7" viewBox="0 0 28 28" fill="none">
                <path d="M14 2L26 8.5V19.5L14 26L2 19.5V8.5L14 2Z" fill="#7c3aed" opacity="0.15"/>
                <path d="M14 6l8 4.5v9L14 24l-8-4.5v-9L14 6z" fill="#7c3aed" opacity="0.35"/>
                <path d="M14 10l4 2.25v4.5L14 19l-4-2.25v-4.5L14 10z" fill="#7c3aed"/>
              </svg>
              <span className="text-[12px] lg:text-[13px] font-extrabold tracking-[-0.3px] text-[#f5f3ff] leading-[1.1]">
                SYNTH<span className="block font-normal">COHOST</span>
              </span>
            </Link>
            <p className="text-[#a09bbf] text-[11px] lg:text-[12.5px] leading-relaxed max-w-xs">
              The AI cohost that makes streaming better.
            </p>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-[#f5f3ff] font-semibold mb-3 lg:mb-4 text-[11px] lg:text-[12px]">{category}</h4>
              <ul className="space-y-2 lg:space-y-2.5">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-[#a09bbf] text-[11px] lg:text-[12px] hover:text-[#7c3aed] transition-colors"
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
    </footer>
  );
}
