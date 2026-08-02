'use client';

import Image from 'next/image';

export default function PricingBanner2() {
  return (
    <div className="w-full h-[390px] relative pt-8">
      <Image
        src="/hero2.png"
        alt="Hero"
        fill
        className="object-cover hidden md:block"
        unoptimized
      />
      <Image
        src="/mmmo.png"
        alt="Hero"
        fill
        className="object-cover block md:hidden object-top"
        unoptimized
      />
    </div>
  );
}
