import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

export default function Education({ data }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const sectionRef = useRef(null);

  if (!data || data.visible === false || !data.items || data.items.length === 0) {
    return null;
  }

  const items = data.items;
  const scrollWidth = `${items.length * 80 + 100}vw`;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 25 });
  // Map progress to horizontal scroll: 0 to -100% of the internal track width
  const xTransform = useTransform(smoothProgress, [0, 1], ["0%", "-80%"]);
  const progressWidth = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="education" className="relative border-t border-white/[0.04] bg-[#050508]">
      <div ref={sectionRef} style={{ height: `${items.length * 80}vh` }} className="relative w-full">
        <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center">
          
          <div className="absolute top-24 left-8 sm:left-12 z-50">
            <h2 className="font-mono text-xs sm:text-sm tracking-[0.25em] text-cyan-400 uppercase">
              EDUCATION // FOUNDATIONS
            </h2>
          </div>

          {/* Horizontal Track */}
          <div className="relative mt-20 w-full h-[60vh] flex items-center">
            
            {/* Background line */}
            <div className="absolute left-0 w-full h-[2px] bg-white/10 top-1/2 -translate-y-1/2 z-0">
              <motion.div style={{ width: progressWidth }} className="h-full bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.6)]" />
            </div>

            <motion.div 
              style={{ x: xTransform, width: scrollWidth }}
              className="flex items-center gap-32 sm:gap-48 px-24 sm:px-48 h-full"
            >
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
                    <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#050508] border-2 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.5)] z-20" />
                    
                    {/* Content above or below line alternating */}
                    <motion.div 
                      initial={{ opacity: 0.5, y: idx % 2 === 0 ? 50 : -50 }}
                      whileInView={{ opacity: 1, y: idx % 2 === 0 ? -120 : 120 }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="absolute left-0 w-full glass-panel p-6 rounded-2xl border border-white/10 hover:border-cyan-400/30 transition-colors"
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
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
