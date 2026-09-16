import React, { useRef, useCallback } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion';
import { ArrowDown, ArrowUpRight, Orbit } from 'lucide-react';
import { formatExternalUrl } from '../utils/url';

// Tactical Magnetic Button component for hero CTAs
function MagneticButton({ children, as: Component = motion.button, onClick, className = '', ...props }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 260, damping: 20 });
  const springY = useSpring(y, { stiffness: 260, damping: 20 });

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.28);
    y.set((e.clientY - centerY) * 0.28);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <Component
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileTap={{ scale: 0.96 }}
      className={className}
      {...props}
    >
      {children}
    </Component>
  );
}

export default function Hero({ data = {} }) {
  const containerRef = useRef(null);

  // Scroll driven subtle fade and scale for cinematic scroll-out
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 800], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 800], [1, 1.05]);
  const heroTranslateY = useTransform(scrollY, [0, 800], [0, -100]);
  
  const bgTranslateY = useTransform(scrollY, [0, 800], [0, 150]);

  // Mouse-tracking spotlight
  const rawMouseX = useMotionValue(50);
  const rawMouseY = useMotionValue(50);
  const spotX = useSpring(rawMouseX, { stiffness: 60, damping: 20 });
  const spotY = useSpring(rawMouseY, { stiffness: 60, damping: 20 });

  const handleHeroMouseMove = useCallback((e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    rawMouseX.set(((e.clientX - rect.left) / rect.width) * 100);
    rawMouseY.set(((e.clientY - rect.top) / rect.height) * 100);
  }, [rawMouseX, rawMouseY]);

  // Reactive spotlight gradient string
  const spotlightBg = useMotionTemplate`radial-gradient(700px circle at ${spotX}% ${spotY}%, rgba(99,102,241,0.22) 0%, rgba(139,92,246,0.07) 38%, transparent 68%)`;

  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -70;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const hasImage = Boolean(data.image);
  const linkedin = (data.socials || []).find((social) => social.platform?.toLowerCase().includes('linkedin'));
  const linkedinUrl = formatExternalUrl(linkedin?.url || 'https://www.linkedin.com');
  const nameText = (data.name || "N S SIDDARTH").toUpperCase();
  const taglineText = data.tagline || "Building intelligent systems with code, models, and ideas. AI/ML engineer exploring complex computational systems.";

  const techBadges = [
    'PyTorch',
    'C++',
    'Distributed Systems',
    'Stochastic Modeling',
    'CUDA',
    'Neural Architectures',
  ];

  return (
    <section
      id="home"
      ref={containerRef}
      onMouseMove={handleHeroMouseMove}
      className="hero relative min-h-screen flex flex-col justify-between pt-24 sm:pt-28 pb-8 px-5 sm:px-8 overflow-hidden bg-[#090a0f]"
    >
      {/* ── Interactive Background ── */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">

        {/* 1. Ambient base — deep indigo arc at top */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_55%_at_50%_-10%,_rgba(79,70,229,0.35)_0%,_transparent_65%)]" />

        {/* 2. Mouse-following spotlight — useMotionTemplate makes it fully reactive */}
        <motion.div className="absolute inset-0" style={{ background: spotlightBg }} />

        {/* 3. Warm amber glow behind portrait center */}
        <div className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(245,158,11,0.1)_0%,_transparent_65%)] blur-3xl" />

        {/* 4. Subtle dot-grid */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)', backgroundSize: '36px 36px' }}
        />

        {/* 5. Bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-[#090a0f] via-[#090a0f]/70 to-transparent z-[5]" />
      </div>

      {/* Cinematic Film Grain Overlay */}
      <div className="pointer-events-none absolute inset-0 z-50 opacity-[0.025] mix-blend-overlay bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')]" />

      <motion.div
        style={{
          opacity: heroOpacity,
          scale: heroScale,
          y: heroTranslateY,
        }}
        className="hero-stage max-w-7xl mx-auto w-full relative z-10 flex-1 flex flex-col justify-between"
      >
        {/* TOP: Centered Giant Name - Solid White */}
        <div className="hero-header-center w-full text-center select-none pt-2 sm:pt-4 z-10">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="hero-dribbble-title font-display font-black uppercase tracking-tight bg-gradient-to-b from-[#1e3a8a] via-[#3b82f6] to-white bg-clip-text text-transparent drop-shadow-[0_4px_30px_rgba(59,130,246,0.35)]"
          >
            {nameText}
          </motion.h1>
        </div>

        {/* MIDDLE: Two-column — left info | portrait — no overlap */}
        <div className="hero-middle relative w-full flex-1 min-h-[340px] sm:min-h-[520px] lg:min-h-[580px] flex flex-col sm:flex-row items-end mt-2 sm:mt-4">

          {/* ── LEFT COLUMN: full-width on mobile, narrow on desktop ── */}
          <div className="hero-info-col relative z-30 w-full sm:w-[30%] sm:max-w-[280px] flex-shrink-0 pb-6 sm:pb-12 pr-0 sm:pr-2 flex flex-col gap-0 items-start">

            {/* 1. Status Badge */}
            <motion.div
              initial={{ opacity: 0, x: -20, filter: 'blur(6px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.65, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 sm:gap-2.5 px-3 sm:px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/[0.07] backdrop-blur-md mb-3 sm:mb-4 shadow-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
              <span className="font-mono text-[10px] sm:text-[11px] tracking-wider text-emerald-300 uppercase">
                Open to collaborations
              </span>
            </motion.div>

            {/* 2. Role line */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="font-mono text-[10px] sm:text-xs tracking-[0.18em] uppercase text-indigo-300 mb-2 sm:mb-3"
            >
              Machine Learning Engineer
            </motion.p>

            {/* 3. Bio text */}
            {taglineText && (
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.48, ease: [0.16, 1, 0.3, 1] }}
                className="text-[12px] sm:text-sm text-white/90 font-normal leading-relaxed mb-4 sm:mb-6 [text-shadow:0_1px_12px_rgba(0,0,0,0.95)] max-w-[90%] sm:max-w-none"
              >
                {taglineText}
              </motion.p>
            )}

            {/* 4. GET IN TOUCH */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.62, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-center gap-2 sm:gap-3"
            >
              <MagneticButton
                onClick={() => scrollTo('contact')}
                className="interactive-hit group px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-white text-[#090a0f] font-mono text-[10px] sm:text-xs font-semibold tracking-wider flex items-center gap-2 hover:bg-slate-100 hover:shadow-[0_0_24px_rgba(255,255,255,0.25)] transition-all"
              >
                <span>GET IN TOUCH</span>
                <ArrowUpRight size={13} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </MagneticButton>

              {/* 5. LinkedIn */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.74, ease: [0.16, 1, 0.3, 1] }}
              >
                <MagneticButton
                  as={motion.a}
                  href={linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="interactive-hit group px-4 sm:px-5 py-2 sm:py-2.5 rounded-full border border-white/[0.18] hover:border-indigo-400/60 bg-white/[0.04] hover:bg-indigo-500/[0.1] backdrop-blur-md text-slate-200 hover:text-white font-mono text-[10px] sm:text-xs font-medium tracking-wider flex items-center gap-2 transition-all"
                >
                  <span>LINKEDIN</span>
                  <ArrowUpRight size={13} className="text-slate-400 transition-all duration-300 group-hover:text-indigo-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </MagneticButton>
              </motion.div>
            </motion.div>
          </div>

          {/* ── PORTRAIT: absolute center on desktop, relative on mobile ── */}
          {hasImage && (
            <div className="hero-portrait-wrap pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-0 z-20 flex justify-center items-end">
              <motion.img
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                src={data.image}
                alt={data.name || 'Hero'}
                className="hero-grounded-portrait w-auto max-h-[45vh] sm:max-h-[70vh] lg:max-h-[78vh] object-contain object-bottom"
              />
            </div>
          )}
        </div>

        {/* BOTTOM: Minimal Tech Strip (Matches reference layout) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="hero-bottom-bar relative z-30 w-full pt-4 sm:pt-5 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-2 sm:gap-4 font-mono text-[10px] sm:text-[11px] text-slate-400"
        >
          <div className="flex items-center gap-2 text-slate-300 uppercase tracking-widest text-[9px] sm:text-[10px]">
            <Orbit size={12} className="text-amber-400" />
            <span>CORE SYSTEMS</span>
          </div>

          <div className="hero-tech-badges flex flex-wrap items-center gap-1.5 sm:gap-3">
            {techBadges.map((badge) => (
              <span
                key={badge}
                className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border border-white/[0.08] bg-white/[0.025] text-slate-300 hover:text-white hover:border-white/25 transition-colors text-[9px] sm:text-[11px]"
              >
                {badge}
              </span>
            ))}
          </div>

          <button
            onClick={() => scrollTo('about')}
            className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
          >
            <span>Scroll to explore</span>
            <ArrowDown size={12} />
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
}
