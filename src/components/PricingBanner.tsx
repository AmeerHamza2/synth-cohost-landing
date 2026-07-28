'use client';

import { useState } from 'react';
import Image from 'next/image';
import WaitlistModal from './WaitlistModal';

export default function PricingBanner() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="w-full h-[390px] relative">
        <Image
          src="/hero101.png"
          alt="Hero"
          fill
          className="object-cover"
          unoptimized
        />
        <div 
          className="absolute bottom-0 right-0 w-1/3 h-1/2 cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        />
      </div>
      <WaitlistModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
