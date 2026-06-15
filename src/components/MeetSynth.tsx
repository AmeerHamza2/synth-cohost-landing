'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';

const features = [
  {
    title: 'Responds to chat',
    description: 'Engages your audience in real time.',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="6" width="18" height="14" rx="2" stroke="#7c3aed" strokeWidth="1.5"/>
        <path d="M3 10h18" stroke="#7c3aed" strokeWidth="1.5"/>
        <circle cx="12" cy="16" r="1.5" fill="#7c3aed"/>
      </svg>
    ),
  },
  {
    title: 'Understands context',
    description: 'Follows the flow and remembers key details.',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <path d="M9.5 2A9.5 9.5 0 0 1 19 11.5c0 3.5-2 6.5-5 8.5V22l-4.5-2.5A9.5 9.5 0 0 1 9.5 2z" stroke="#7c3aed" strokeWidth="1.5"/>
        <path d="M9.5 7v5l3 1.5" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    title: 'Supports your workflow',
    description: 'Helps keep your stream on track.',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

export default function MeetSynth() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });


}
