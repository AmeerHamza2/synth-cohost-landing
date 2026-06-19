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

      <div className="py-4 lg:py-6 px-0">
        <div className="relative w-full">
          <Image
            src="/background_lossless.webp"
            alt="Meet Your Cohost"
            width={1200}
            height={600}
            className="w-full h-auto"
            unoptimized
          />
          
          {/* Text Overlay */}
          <div className="absolute inset-0 flex flex-col lg:flex-row items-start justify-start p-6 lg:p-20 gap-8 lg:gap-12">
            <h2 className="text-[clamp(24px,3.5vw,52px)] font-extrabold leading-[1.1] tracking-[-1px] text-[#f5f3ff] -mt-8 lg:-mt-12">
              <span>The next generation</span>
              <br />
              <span>of creators won&apos;t</span>
              <br />
              <span>stream </span>
              <span className="text-[#b58af7]">alone.</span>
            </h2>

            <div className="flex flex-col items-start gap-4 mt-6 lg:mt-0">
              <p className="text-[16px] lg:text-[18px] font-medium text-[#f5f3ff]">
                They will stream<br />
                alongside intelligence.
              </p>
              <a 
                href="#" 
                className="inline-flex items-center gap-2.5 text-[13px] font-semibold text-white bg-[#7c3aed] px-5 py-2.5 rounded-full hover:bg-[#6d28d9] transition-colors w-fit"
              >
                Meet Your Cohost <span>→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
