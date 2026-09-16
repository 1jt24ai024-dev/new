import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useSpring } from 'framer-motion';
import { Menu, X, ArrowUpRight, Lock, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import useCinematicScroll from '../hooks/useCinematicScroll';

const NAV_LINKS = [
  { id: 'home', label: 'HOME' },
  { id: 'about', label: 'ABOUT' },
  { id: 'education', label: 'EDUCATION' },
  { id: 'experience', label: 'WORK EXPERIENCE' },
  { id: 'certifications', label: 'CERTIFICATIONS' },
  { id: 'projects', label: 'PROJECTS' },
  { id: 'chronicles', label: 'CHRONICLES' },
  { id: 'contact', label: 'CONTACT' },
];

export default function Navbar({ visibility = {} }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { activeScene, overallProgress } = useCinematicScroll();
  const scaleX = useSpring(overallProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = NAV_LINKS.filter((l) => visibility[l.id] !== false);

  const scrollTo = (id) => {
    setMobileOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -70;
      const yPos = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: yPos, behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Ultra-thin Scroll Progress Indicator at very top */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-400 via-cyan-400 to-sky-400 origin-left z-[100] pointer-events-none"
      />

      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'py-3 bg-[#070812]/78 backdrop-blur-xl border-b border-white/[0.07] shadow-[0_12px_40px_rgba(2,3,10,0.22)]'
            : 'py-5 sm:py-7 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between">
          {/* Brand / Logo */}
          <motion.button
            onClick={() => scrollTo('home')}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-3 group text-left"
          >
            <span className="grid h-8 w-8 place-items-center rounded-full border border-white/[0.12] bg-white/[0.04] text-cyan-200 transition-all duration-300 group-hover:border-cyan-300/40 group-hover:bg-cyan-300/10 group-hover:rotate-12">
              <Sparkles size={14} aria-hidden="true" />
            </span>
            <span className="navbar-brand-name font-display font-semibold text-sm sm:text-base tracking-[0.16em] uppercase text-white group-hover:text-white transition-colors">
              NS SIDDARTH
            </span>
          </motion.button>

          {/* Desktop Navigation */}
          <nav className="navbar-desktop-nav hidden xl:flex items-center gap-1 rounded-full border border-white/[0.07] bg-white/[0.025] p-1.5 backdrop-blur-md">
            {links.map((link, idx) => {
              const isActive = activeScene === link.id;
              return (
                <motion.button
                  key={link.id}
                  onClick={() => scrollTo(link.id)}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.94 }}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 + idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  className={`interactive-hit relative rounded-full px-3 py-2 font-mono text-[10px] tracking-[0.12em] transition-all duration-300 ${
                    isActive ? 'text-white font-medium' : 'text-slate-500 hover:text-slate-200'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && (
                    <motion.span
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 -z-10 rounded-full border border-white/[0.12] bg-white/[0.07]"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </nav>

          {/* Discreet CMS Login & Mobile Toggle */}
          <div className="flex items-center gap-4">
            <Link
              to="/dashboard/login"
              title="Dashboard CMS"
              className="text-slate-600 hover:text-slate-400 transition-colors p-1"
              aria-label="CMS Login"
            >
              <Lock size={12} className="opacity-40 hover:opacity-100 transition-opacity" />
            </Link>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="xl:hidden grid h-9 w-9 place-items-center rounded-full border border-white/[0.1] bg-white/[0.03] text-slate-300 hover:border-white/30 hover:text-white transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Overlay */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="xl:hidden border-b border-white/[0.08] bg-[#070812]/95 backdrop-blur-xl overflow-hidden px-5 py-5"
            >
              <div className="flex flex-col gap-3">
                {links.map((link, idx) => {
                  const isActive = activeScene === link.id;
                  return (
                    <motion.button
                      key={link.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      onClick={() => scrollTo(link.id)}
                      className={`text-left font-mono text-xs tracking-widest py-2 px-3 rounded-lg flex items-center justify-between transition-colors ${
                        isActive
                          ? 'text-white bg-white/[0.06] font-semibold'
                          : 'text-slate-400 hover:text-white hover:bg-white/[0.02]'
                      }`}
                    >
                      <span>{link.label}</span>
                      {isActive && <ArrowUpRight size={14} className="text-emerald-400" />}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}
