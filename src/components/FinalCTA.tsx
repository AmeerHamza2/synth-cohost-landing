'use client';

import Image from 'next/image';

export default function FinalCTA() {
  return (
    <section 
      data-section="07" 
      className="relative bg-black overflow-hidden"
    >
      {/* Section Number - Left Side - Hidden on mobile */}
      <div className="hidden md:flex absolute left-6 lg:left-10 top-1/3 -translate-y-1/2 flex-col items-center gap-2">
        <span className="text-[11px] font-bold text-white">07</span>
        <span className="w-4 h-[2px] bg-white" />
      </div>

      <div className="py-16 lg:py-28 px-4 sm:px-6 lg:px-20">
        <div className="relative inline-block w-full">
          <Image
            src="/background_lossless.webp"
            alt="Meet Your Cohost"
            width={1200}
            height={600}
            className="w-full h-auto"
            unoptimized
          />
          
          {/* Text Overlay */}
          <div className="absolute inset-0 flex flex-col items-start justify-end p-6 lg:p-12">
            <h2 className="text-[clamp(24px,3.5vw,52px)] font-extrabold leading-[1.1] tracking-[-1px] mb-6 lg:mb-8 text-[#f5f3ff]">
              <span>The next generation</span>
              <br />
              <span>of creators won&apos;t</span>
              <br />
              <span>stream </span>
              <span className="text-[#b58af7]">alone.</span>
            </h2>

            <div className="flex flex-col gap-3">
              <a 
                href="#" 
                className="inline-flex items-center gap-2.5 text-[13px] font-semibold text-[#a09bbf] border-b border-[rgba(255,255,255,0.2)] pb-0.5 hover:text-white transition-colors w-fit"
              >
                Meet Your Cohost <span>▷</span>
              </a>
              <a 
                href="#" 
                className="inline-flex items-center gap-2.5 text-[13px] font-semibold text-[#a09bbf] border-b border-[rgba(255,255,255,0.2)] pb-0.5 hover:text-white transition-colors w-fit"
              >
                Start Free <span>▷</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
