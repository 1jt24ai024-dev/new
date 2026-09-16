import React, { useLayoutEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function Education({ data }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const progressLineRef = useRef(null);

  useLayoutEffect(() => {
    if (!data || data.visible === false || !data.items || data.items.length === 0) return;
    
    gsap.registerPlugin(ScrollTrigger);
    
    const ctx = gsap.context(() => {
      const scrollWidth = trackRef.current.scrollWidth - window.innerWidth;
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          scrub: 1,
          start: 'top top',
          end: () => `+=${scrollWidth + window.innerWidth}`,
          invalidateOnRefresh: true,
        }
      });

      tl.to(trackRef.current, {
        x: -scrollWidth,
        ease: 'none',
      });

      // Tie the progress line strictly to the horizontal scroll progress
      gsap.to(progressLineRef.current, {
        width: '100%',
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          scrub: 1,
          start: 'top top',
          end: () => `+=${scrollWidth + window.innerWidth}`,
        }
      });

    }, sectionRef);

    return () => ctx.revert();
  }, [data]);

  if (!data || data.visible === false || !data.items || data.items.length === 0) {
    return null;
  }

  const items = data.items;

  return (
    <section id="education" ref={sectionRef} className="relative border-t border-white/[0.04] bg-[#050508] h-screen overflow-hidden flex flex-col justify-center">
      <div className="absolute top-24 left-8 sm:left-12 z-50">
        <h2 className="font-mono text-xs sm:text-sm tracking-[0.25em] text-cyan-400 uppercase">
          EDUCATION // FOUNDATIONS
        </h2>
      </div>

      <div ref={containerRef} className="relative mt-20 w-full h-[60vh] flex items-center">
        {/* Background line */}
        <div className="absolute left-0 w-full h-[2px] bg-white/10 top-1/2 -translate-y-1/2 z-0">
          <div ref={progressLineRef} className="h-full w-0 bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.6)]" />
        </div>

        <div ref={trackRef} className="flex items-center gap-16 sm:gap-24 px-12 sm:px-24 h-full will-change-transform">
          {items.map((item, idx) => {
            const isHovered = hoveredIdx === idx;
            return (
              <div 
                key={item._id || idx}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="relative z-10 w-[300px] sm:w-[450px] shrink-0"
              >
                {/* Node on the line */}
                <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#050508] border-2 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.5)] z-20 group" />
                
                {/* Content above or below line alternating */}
                <motion.div 
                  initial={{ opacity: 0.5, y: idx % 2 === 0 ? 50 : -50 }}
                  whileInView={{ opacity: 1, y: idx % 2 === 0 ? -120 : 120 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  viewport={{ once: true }}
                  className="absolute left-0 w-full glass-panel p-6 rounded-2xl border border-white/10 hover:border-cyan-400/30 transition-colors bg-[#050508]/80 backdrop-blur-lg shadow-xl"
                  style={{ top: '50%' }}
                >
                  <div className="flex items-center gap-3 font-mono text-xs text-slate-400 mb-3 tracking-wider">
                    {item.logo && (
                      <div className="h-8 w-8 shrink-0 flex items-center justify-center rounded-lg bg-white p-1">
                        <img src={item.logo} alt={item.institution} className="h-full w-full object-contain" />
                      </div>
                    )}
                    <span className="text-cyan-300 bg-cyan-900/20 px-2 py-0.5 rounded border border-cyan-500/20">{item.year}</span>
                  </div>
                  
                  <h3 className="font-display text-xl sm:text-2xl font-semibold text-white mb-2 leading-tight">
                    {item.degree}
                  </h3>
                  <p className="font-mono text-xs text-slate-300 uppercase tracking-wide mb-3">
                    {item.institution}
                  </p>
                  
                  {item.description && (
                    <p className="text-sm text-slate-400 line-clamp-3">
                      {item.description}
                    </p>
                  )}
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
