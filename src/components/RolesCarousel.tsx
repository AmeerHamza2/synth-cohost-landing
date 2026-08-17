'use client';



import { motion, useInView } from 'framer-motion';

import { useEffect, useRef, useState } from 'react';

import Image from 'next/image';

import { usePopup } from '../contexts/PopupContext';

import { roleTrigger, setStageRole } from '../three/bindings';

import type { RoleId } from '../three/stage/types';



/**
 * The five roles.
 *
 * `title` and `description` used to exist only as pixels baked into the card
 * PNGs — the markup carried the name in an `alt` attribute and nothing else.
 * They are real text now, because the 3D layer replaces those images and the
 * copy has to survive that (and it is selectable and screen-reader visible for
 * the first time as a result).
 *
 * Note the image mapping: `tight_card_4.png` is the Companion card and
 * `tight_card_5.png` is the Research Assistant card. The array previously
 * paired them the other way round, which was invisible while the titles were
 * never rendered.
 */
const roles = [
  {
    id: 'educator',
    title: 'Educator',
    description: 'Explains complex ideas simply.',
    image: '/tight_card_1.png',
  },
  {
    id: 'moderator',
    title: 'Moderator',
    description: 'Manages chat and keeps things focused.',
    image: '/tight_card_2.png',
  },
  {
    id: 'interviewer',
    title: 'Interviewer',
    description: 'Asks better questions and drives conversations.',
    image: '/tight_card_3.png',
  },
  {
    id: 'researcher',
    title: 'Research Assistant',
    description: 'References your docs and surfaces insights.',
    image: '/tight_card_5.png',
  },
  {
    id: 'companion',
    title: 'Companion',
    description: 'Keeps the energy up and vibes with you.',
    image: '/tight_card_4.png',
  },
];



export default function RolesCarousel() {

  const { openPopup } = usePopup();

  const ref = useRef(null);

  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);

  // Paging the mobile carousel transforms the single 3D SYN to match.
  useEffect(() => {
    setStageRole(roles[currentIndex].id as RoleId);
  }, [currentIndex]);



  // Paging the mobile carousel transforms the 3D SYN into that role, so the
  // swipe drives the same single model the desktop hover does.

  useEffect(() => {

    setStageRole(roles[currentIndex].id as RoleId);

  }, [currentIndex]);



  return (

    <section 

      data-section="04"

      data-stage="roles"

      className="relative bg-black overflow-hidden stage-transparent"

      id="streamers"

    >

      {/* Section Number - Left Side - Hidden on mobile */}

      <div className="hidden md:flex absolute left-6 lg:left-10 top-1/3 -translate-y-1/2 flex-col items-center gap-2">

        <span className="text-[11px] font-bold text-white">04</span>

        <span className="w-4 h-[2px] bg-white" />

      </div>



      <div ref={ref} className="py-2 px-6 lg:px-12">

        <motion.div

          initial={{ opacity: 0 }}

          animate={isInView ? { opacity: 1 } : { opacity: 0 }}

          transition={{ duration: 0.6 }}

          className="flex flex-col lg:flex-row items-center gap-12 max-w-[1100px] mx-auto"

        >

          {/* Left Content */}

          <div className="w-full lg:w-auto lg:max-w-[280px] flex-shrink-0 text-center lg:text-left">

            <div className="text-[10px] tracking-[0.13em] text-[#a09bbf] uppercase mb-3">

              One personality. Many roles.

            </div>

            <h2 className="text-[26px] lg:text-[32px] font-extrabold text-[#f5f3ff] leading-[1.2] mb-4 tracking-[-0.5px]">

              Syns adapts to your stream.

            </h2>

            <p className="text-[14px] text-[#a09bbf] leading-[1.6] mb-6 hidden lg:block">

   

 Learn how Syns transforms across different roles, from educator and moderator to interviewer, seamlessly adapting to your stream's needs.

            </p>

            <div className="flex flex-col gap-3">

              <button

                onClick={() => openPopup('what-are-syns')}

                className="inline-flex items-center gap-2.5 text-[13px] font-semibold text-[#a09bbf] border-b border-[rgba(255,255,255,0.2)] pb-0.5 hover:text-white transition-colors w-fit"

              >

                Learn more <span>▷</span>

              </button>



            </div>

          </div>



          {/* Right Boxes */}

          <div className="flex-1 relative overflow-hidden min-w-0 w-full lg:w-auto">

            {/* Mobile Carousel */}

            <div className="md:hidden">

              <div className="relative w-full h-[250px]">

                <motion.div

                  key={currentIndex}

                  initial={{ opacity: 0, x: 50 }}

                  animate={{ opacity: 1, x: 0 }}

                  exit={{ opacity: 0, x: -50 }}

                  transition={{ duration: 0.3 }}

                  drag="x"

                  dragConstraints={{ left: 0, right: 0 }}

                  dragElastic={0.2}

                  onDragEnd={(e, { offset, velocity }) => {

                    const swipe = offset.x * velocity.x;

                    if (swipe < -1000 || offset.x < -50) {

                      setCurrentIndex((prev) => (prev + 1) % roles.length);

                    } else if (swipe > 1000 || offset.x > 50) {

                      setCurrentIndex((prev) => prev === 0 ? roles.length - 1 : prev - 1);

                    }

                  }}

                  className="relative w-full h-full rounded-[10px] overflow-hidden cursor-pointer touch-pan-y"

                  style={{

                    boxShadow: hoveredIndex === currentIndex 

                      ? '0 0 30px rgba(124, 58, 237, 0.8), 0 0 60px rgba(124, 58, 237, 0.5)' 

                      : 'none'

                  }}

                  onHoverStart={() => setHoveredIndex(currentIndex)}

                  onHoverEnd={() => setHoveredIndex(null)}

                >

                  <Image

                    src={roles[currentIndex].image}

                    alt={roles[currentIndex].title}

                    fill

                    className="object-contain transition-all duration-300"

                    unoptimized

                  />

                  <div className="stage-caption">
                    <p>{roles[currentIndex].title}</p>
                    <p>{roles[currentIndex].description}</p>
                  </div>

                </motion.div>

                

                {/* Navigation Arrows */}

                <button

                  onClick={() => setCurrentIndex((prev) => prev === 0 ? roles.length - 1 : prev - 1)}

                  className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors z-10"

                >

                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">

                    <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round"/>

                  </svg>

                </button>

                <button

                  onClick={() => setCurrentIndex((prev) => (prev + 1) % roles.length)}

                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors z-10"

                >

                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">

                    <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/>

                  </svg>

                </button>

              </div>

              

              {/* Mobile Dots */}

              <div className="flex justify-center gap-2 mt-4">

                {roles.map((_, index) => (

                  <button

                    key={index}

                    onClick={() => setCurrentIndex(index)}

                    className={`w-2 h-2 rounded-full transition-colors ${

                      index === currentIndex ? 'bg-[#7c3aed]' : 'bg-[#7c6edc]'

                    }`}

                  />

                ))}

              </div>

            </div>



            {/* Desktop Grid */}

            <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-5 gap-3">

              {roles.map((role, index) => (

                <motion.div

                  key={role.id}

                  onHoverStart={() => setHoveredIndex(index)}

                  onHoverEnd={() => setHoveredIndex(null)}

                  {...roleTrigger(role.id as RoleId)}

                  className="relative w-full h-[220px] lg:h-[300px] rounded-[10px] overflow-hidden cursor-pointer"

                  style={{

                    boxShadow:

                      hoveredIndex === index

                        ? '0 0 30px rgba(124, 58, 237, 0.8), 0 0 60px rgba(124, 58, 237, 0.5)'

                        : 'none'

                  }}

                  transition={{ duration: 0.2, ease: 'easeOut' }}

                >

                  <Image

                    src={role.image}

                    alt={role.title}

                    fill

                    className="object-contain transition-all duration-300"

                    unoptimized

                  />

                  {/* The card art carries this copy as baked-in pixels. When the
                      3D stage replaces the art, this renders it as real text so
                      nothing is lost; when the stage is off it stays hidden and
                      the original card is untouched. */}
                  <div className="stage-caption">
                    <p>{role.title}</p>
                    <p>{role.description}</p>
                  </div>

                </motion.div>

              ))}

            </div>

          </div>

        </motion.div>

      </div>

    </section>

  );

}

