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
          className="object-cover hidden md:block"
          unoptimized
        />
        <Image
          src="/ona ai.png"
          alt="Hero"
          fill
          className="object-cover block md:hidden object-top"
          unoptimized
        />
        <div 
          className="absolute bottom-0 right-0 w-1/3 h-1/2 cursor-pointer md:block hidden"
          onClick={() => setIsModalOpen(true)}
        />
        <div 
          className="absolute bottom-4 right-4 w-1/2 h-1/3 cursor-pointer md:hidden z-10 bg-transparent"
          onClick={() => setIsModalOpen(true)}
        />
      </div>
      <WaitlistModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
