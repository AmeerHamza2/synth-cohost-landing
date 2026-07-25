'use client';

import { motion } from 'framer-motion';
import PriceSection from './PriceSection';
import DescriptionSection from './DescriptionSection';
import SynDiagram from './SynDiagram';
import FeatureList from './FeatureList';
import CharacterShowcase from './CharacterShowcase';
import CTAButton from './CTAButton';

export default function SynthCreatorBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-[1400px] h-[220px] rounded-[18px] overflow-hidden relative"
      style={{
        background: 'linear-gradient(135deg, #070711 0%, #111124 35%, #171131 60%, #0B0B17 100%)',
        border: '1px solid rgba(140,80,255,.25)',
        boxShadow: '0 20px 60px rgba(0,0,0,.35)',
      }}
    >
      {/* Decorative effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Soft vignette */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/30" />
        
        {/* Purple radial glows */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-[#8B3DFF] blur-[100px] opacity-10" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#8B3DFF] blur-[100px] opacity-10" />
        
        {/* Blurred light behind center icon area */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#8B3DFF] blur-[80px] opacity-15" />
        
        {/* Ambient bloom */}
        <div className="absolute inset-0 bg-[#8B3DFF] opacity-5 mix-blend-screen" />
        
        {/* Circuit-like background texture */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%238B3DFF' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        
        {/* Purple neon highlights */}
        <div className="absolute top-4 left-4 w-2 h-2 bg-[#8B3DFF] rounded-full blur-[4px] opacity-60" />
        <div className="absolute top-4 right-4 w-2 h-2 bg-[#8B3DFF] rounded-full blur-[4px] opacity-60" />
        <div className="absolute bottom-4 left-4 w-2 h-2 bg-[#8B3DFF] rounded-full blur-[4px] opacity-60" />
        <div className="absolute bottom-4 right-4 w-2 h-2 bg-[#8B3DFF] rounded-full blur-[4px] opacity-60" />
        
        {/* Subtle purple particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-[#8B3DFF] rounded-full opacity-30"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Main content grid */}
      <div className="relative z-10 h-full p-[20px_24px]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 h-full items-start">
          {/* Price Section */}
          <div className="col-span-1">
            <PriceSection />
          </div>

          {/* Description Section */}
          <div className="col-span-1">
            <DescriptionSection />
          </div>

          {/* Syn Diagram */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1 flex items-center justify-center order-3 lg:order-3">
            <SynDiagram />
          </div>

          {/* Feature List */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1 order-4 lg:order-4">
            <FeatureList />
          </div>

          {/* Character Section with CTA */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1 flex flex-col justify-between h-full order-5 lg:order-5">
            <CharacterShowcase />
            <div className="flex justify-end lg:justify-center">
              <CTAButton />
            </div>
          </div>
        </div>
      </div>

      {/* CSS animation for floating particles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </motion.div>
  );
}
