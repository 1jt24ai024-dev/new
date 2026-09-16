import React, { useRef } from 'react';
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { ArrowUpRight, FileText } from 'lucide-react';
import { formatExternalUrl } from '../utils/url';
import AeroShards from './AeroShards';

const EASE = [0.16, 1, 0.3, 1];

export default function About({ data = {} }) {
  const sectionRef = useRef(null);
  const visualRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 90, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 90, damping: 25 });
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const signalScale = useTransform(scrollYProgress, [0.08, 0.5, 0.92], [0.12, 1, 0.12]);

  const handleMouseMove = (e) => {
    if (!visualRef.current) return;
    const rect = visualRef.current.getBoundingClientRect();
    mouseX.set(((e.clientX - (rect.left + rect.width / 2)) / rect.width) * 16);
    mouseY.set(((e.clientY - (rect.top + rect.height / 2)) / rect.height) * 16);
  };

  if (!data || (!data.heading && !data.bio && !data.image)) return null;
  const hasImage = Boolean(data.image);
  const stats = [
    { label: 'Focus', value: 'ML / AI' },
    { label: 'Stack', value: 'PyTorch · C++ · CUDA' },
    { label: 'Status', value: 'Open to Collabs' },
  ];

  return (
    <section ref={sectionRef} id="about" className="relative isolate py-32 px-6 sm:px-10 border-t border-white/[0.04]">
      {/* Sticky wrapper for cinematic scroll reveal */}
      <div className="relative" style={{ minHeight: '150vh' }}>
        <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
          <motion.div className="about-scroll-rail pointer-events-none absolute left-3 top-20 bottom-20 hidden w-px origin-top sm:block" style={reducedMotion ? undefined : { scaleY: signalScale }} aria-hidden="true" />
          <div className="pointer-events-none absolute inset-0 opacity-55" aria-hidden="true">
            <AeroShards backgroundColor="#050508" shardColor="#1D9BF0" accentColor="#67E8F9" placement="full" flow="stream" material="glass" detail="balanced" effect="none" scale={0.8} spread={0.72} depth={0.75} speed={0.35} spin={0.25} interaction="none" density={0.7} shardSize={0.8} turbulence={0.35} glow={0.7} bloom={0.25} grain={0.02} holdToGather={false} />
          </div>

          <div className="max-w-7xl mx-auto w-full relative z-10">
        {/* Label */}
        <motion.div className="section-heading mb-14 sm:mb-20 flex items-center gap-4" initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.65, ease: EASE }}>
          <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.15, ease: EASE }} className="h-px w-10 bg-gradient-to-r from-cyan-400 to-transparent origin-left" />
          <h2 className="font-mono text-xs sm:text-sm tracking-[0.25em] text-cyan-400 uppercase">ABOUT</h2>
        </motion.div>

        {/* Heading */}
        {data.heading && (
          <div className="mb-12 overflow-hidden">
            <motion.h3 initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.9, ease: EASE }} className="w-full font-display text-3xl sm:text-4xl lg:text-6xl font-semibold tracking-tight text-white leading-[1.08]">
              {data.heading}
            </motion.h3>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
          {/* Left: Narrative */}
          <div className="flex h-full flex-col justify-center gap-8">
            {data.bio && (
              <motion.div initial={{ opacity: 0, y: 32, filter: 'blur(10px)' }} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.95, delay: 0.1, ease: EASE }} className="about-copy glass-panel h-full min-h-[22rem] rounded-2xl border border-white/[0.1] p-6 sm:p-10 flex items-center text-slate-300 text-base sm:text-lg leading-relaxed text-left font-light whitespace-pre-line hover:border-cyan-300/30 transition-colors duration-300 shadow-[0_20px_60px_rgba(0,0,0,0.2)]">
                {data.bio}
              </motion.div>
            )}
            <div className="flex gap-6 flex-wrap">
              {stats.map((stat, i) => (
                <motion.div key={stat.label} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 + i * 0.12, ease: EASE }} className="flex flex-col gap-0.5">
                  <span className="font-mono text-[10px] tracking-widest text-slate-500 uppercase">{stat.label}</span>
                  <span className="font-mono text-xs text-slate-200">{stat.value}</span>
                </motion.div>
              ))}
            </div>
            {data.resumeUrl && (
              <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.35, ease: EASE }}>
                <motion.a whileHover={{ x: 6 }} transition={{ duration: 0.2 }} href={formatExternalUrl(data.resumeUrl)} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-white/15 hover:border-white/40 bg-white/[0.03] hover:bg-white/[0.08] text-xs font-mono tracking-wider text-slate-300 hover:text-white transition-all shadow-sm hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                  <FileText size={14} className="text-emerald-400" />
                  <span>CURRICULUM VITAE / RESUME</span>
                  <ArrowUpRight size={14} className="transition-transform duration-250 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-slate-400 group-hover:text-white" />
                </motion.a>
              </motion.div>
            )}
          </div>

          {/* Right: Visual */}
          <div ref={visualRef} onMouseMove={handleMouseMove} className="flex items-center justify-center relative group">
            {hasImage ? (
              <motion.div initial={{ opacity: 0, scale: 0.9, y: 35 }} whileInView={{ opacity: 1, scale: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 1, delay: 0.15, ease: EASE }} style={{ x: springX, y: springY }} whileHover={{ scale: 1.02 }} className="image-surface relative z-10 w-full h-full min-h-[22rem] rounded-3xl overflow-hidden p-3 shadow-2xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.6)] transition-all duration-500">
                <div className="relative w-full h-full rounded-2xl overflow-hidden">
                  <img src={data.image} alt={data.heading || 'About'} className="w-full h-full object-cover grayscale-[15%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050508]/80 via-transparent to-transparent opacity-60 pointer-events-none" />
                </div>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.88 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.9, delay: 0.15, ease: EASE }} style={{ x: springX, y: springY }} whileHover={{ scale: 1.02 }} className="relative z-10 w-full h-full min-h-[22rem] rounded-2xl bg-transparent p-8 flex flex-col justify-between overflow-hidden group transition-all duration-300">
                <svg className="absolute inset-0 w-full h-full opacity-20 stroke-white group-hover:opacity-30 transition-opacity duration-500" viewBox="0 0 400 400" fill="none">
                  <circle cx="200" cy="200" r="140" strokeWidth="0.5" strokeDasharray="3 4" />
                  <circle cx="200" cy="200" r="90" strokeWidth="0.75" />
                  <circle cx="200" cy="200" r="40" strokeWidth="0.5" />
                  <line x1="200" y1="20" x2="200" y2="380" strokeWidth="0.5" strokeDasharray="2 3" />
                  <line x1="20" y1="200" x2="380" y2="200" strokeWidth="0.5" strokeDasharray="2 3" />
                </svg>
                <div className="relative z-10 flex items-center justify-between font-mono text-[11px] text-slate-400 border-b border-white/[0.06] pb-3">
                  <span className="tracking-widest uppercase">ABOUT</span>
                  <span className="text-emerald-400 animate-pulse">ACTIVE</span>
                </div>
                <div className="relative z-10 my-auto flex flex-col items-center justify-center py-6">
                  <div className="w-24 h-24 rounded-full border border-white/15 group-hover:border-cyan-400/40 flex items-center justify-center font-display text-2xl font-bold tracking-tighter text-white/90 bg-white/[0.02] group-hover:bg-white/[0.05] transition-all duration-300 shadow-inner">NS</div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
  );
}
