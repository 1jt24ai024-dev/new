import React, { useLayoutEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function Education({ data }) {
  const [hoveredId, setHoveredId] = useState(null);
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    if (!sectionRef.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.education-item').forEach((item) => {
        gsap.fromTo(item,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 90%',
              end: 'top 60%',
              scrub: false,
              toggleActions: 'play none none none',
            },
          }
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [data]);

  if (!data || data.visible === false || !data.items || data.items.length === 0) {
    return null;
  }

  const items = data.items;

  return (
    <section id="education" ref={sectionRef} className="relative py-16 sm:py-24 px-5 sm:px-8 border-t border-white/[0.04] bg-[#050508]">
      <div className="max-w-7xl mx-auto">
        <div className="section-heading mb-14 sm:mb-24">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="font-mono text-xs sm:text-sm tracking-[0.25em] text-cyan-400 uppercase"
          >
            EDUCATION // FOUNDATIONS
          </motion.h2>
        </div>

        <div className="flex flex-col gap-16 sm:gap-24 relative">
          <div className="absolute left-[27px] sm:left-[35px] top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500/50 via-white/10 to-transparent" />
          
          {items.map((item, idx) => {
            const isHovered = hoveredId === (item._id || idx);
            return (
              <motion.div
                key={item._id || idx}
                onMouseEnter={() => setHoveredId(item._id || idx)}
                onMouseLeave={() => setHoveredId(null)}
                className={`education-item relative pl-16 sm:pl-24 transition-all duration-300 group cursor-default`}
              >
                {/* Node on the vertical line */}
                <div className="absolute left-[23px] sm:left-[31px] top-1.5 w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.8)] border border-[#050508]" />

                <div className="grid lg:grid-cols-12 gap-6 lg:gap-16 items-start">
                  <div className="lg:col-span-5 relative">
                    <motion.div
                      animate={{ x: isHovered ? 8 : 0 }}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      className="flex flex-col"
                    >
                      <div className="flex items-center gap-3">
                        {item.logo && (
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white p-1.5 border border-cyan-300/20 shadow-[0_0_15px_rgba(103,232,249,0.1)]">
                            <img src={item.logo} alt={item.institution} className="h-full w-full object-contain" loading="lazy" />
                          </div>
                        )}
                        <h3 className="font-display text-xl sm:text-2xl font-semibold text-white tracking-tight group-hover:text-cyan-200 transition-colors">
                          {item.degree}
                        </h3>
                      </div>

                      <div className="mt-3 flex items-center gap-2.5 font-mono text-xs text-slate-400 uppercase tracking-wider">
                        {item.institution && (
                          <span className="text-cyan-300 font-medium px-2 py-0.5 rounded bg-cyan-900/20 border border-cyan-500/20">
                            {item.institution}
                          </span>
                        )}
                        {item.year && <span className="text-slate-500 group-hover:text-slate-400 transition-colors">{item.year}</span>}
                      </div>
                    </motion.div>
                  </div>

                  {item.description && (
                    <div className="lg:col-span-7 mt-2 lg:mt-0">
                      <motion.p
                        animate={{ opacity: isHovered ? 1 : 0.8 }}
                        transition={{ duration: 0.25 }}
                        className="text-sm sm:text-base text-slate-300 leading-relaxed font-light text-left whitespace-pre-line border-l border-white/[0.06] group-hover:border-white/20 pl-4 transition-colors duration-300"
                      >
                        {item.description}
                      </motion.p>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
