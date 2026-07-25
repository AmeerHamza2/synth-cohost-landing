'use client';

import Image from 'next/image';

export default function PricingBanner2() {
  return (
    <div className="w-full h-[390px] relative">
      <Image
        src="/hero2.png"
        alt="Hero"
        fill
        className="object-cover"
        unoptimized
      />
    </div>
  );
}
