import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import { ArrowUpRight, X, ExternalLink } from 'lucide-react';
import { formatExternalUrl } from '../utils/url';

function GithubIcon({ size = 15, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

export default function Projects({ data }) {
  const [activeProject, setActiveProject] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => { if (e.key === 'Escape') setActiveProject(null); };
    if (activeProject) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [activeProject]);

  if (!data || data.visible === false || !data.items || data.items.length === 0) return null;

  const projects = data.items;

  return (
    <section id="projects" className="relative border-t border-white/[0.04] bg-[#050508]">
      {/* Section heading — always visible above the pinned area */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-16 sm:pt-24 pb-6">
        <h2 className="font-mono text-xs sm:text-sm tracking-[0.25em] text-slate-400 uppercase">
          PROJECT UNIVERSE
        </h2>
      </div>

      {/* One card per project — each scrolls into view naturally */}
      <div className="flex flex-col divide-y divide-white/[0.04]">
        {projects.map((project, idx) => (
          <ProjectCard
            key={project._id || idx}
            project={project}
            index={idx}
            onClick={() => setActiveProject(project)}
          />
        ))}
      </div>

      {/* Case Study Modal */}
      <AnimatePresence>
        {activeProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-[#050508]/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8 overflow-y-auto"
            onClick={() => setActiveProject(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto glass-panel rounded-2xl border border-white/[0.12] p-6 sm:p-12 shadow-2xl"
            >
              <button onClick={() => setActiveProject(null)} className="absolute top-6 right-6 p-2 rounded-full border border-white/10 bg-white/[0.04] text-slate-300 hover:text-white hover:bg-white/10 transition-colors z-20" aria-label="Close Case Study">
                <X size={18} />
              </button>

              <div className="mb-8">
                <span className="font-mono text-xs tracking-widest text-emerald-400 uppercase">CASE STUDY</span>
                <h2 className="font-display text-2xl sm:text-4xl font-bold text-white tracking-tight mt-2">{activeProject.title}</h2>
                {activeProject.shortDescription && <p className="text-base sm:text-lg text-slate-400 mt-2 font-light">{activeProject.shortDescription}</p>}
              </div>

              {activeProject.image && (
                <div className="rounded-xl overflow-hidden border border-white/[0.08] mb-10 max-h-[380px] bg-black">
                  <img src={activeProject.image} alt={activeProject.title} className="w-full h-full object-cover" />
                </div>
              )}

              {activeProject.details && (
                <div className="border-t border-white/[0.06] pt-8 mb-8">
                  <h4 className="font-mono text-xs tracking-widest uppercase text-slate-400 mb-3">SYSTEM OVERVIEW & DETAILS</h4>
                  <div className="text-sm sm:text-base text-slate-300 leading-relaxed font-light text-left whitespace-pre-line space-y-4">{activeProject.details}</div>
                </div>
              )}

              {Array.isArray(activeProject.techStack) && activeProject.techStack.length > 0 && (
                <div className="border-t border-white/[0.06] pt-6 mb-6">
                  <h4 className="font-mono text-xs tracking-widest uppercase text-slate-400 mb-3">TECHNOLOGIES</h4>
                  <div className="flex flex-wrap gap-2">
                    {activeProject.techStack.map((tech) => (
                      <span key={tech} className="font-mono text-xs px-3 py-1 rounded-full border border-white/[0.08] hover:border-emerald-400/40 bg-white/[0.03] hover:bg-emerald-500/10 text-slate-200 transition-all cursor-default">{tech}</span>
                    ))}
                  </div>
                </div>
              )}

              {(activeProject.githubUrl || activeProject.liveUrl) && (
                <div className="border-t border-white/[0.06] mt-8 pt-6 flex flex-wrap items-center gap-4">
                  {activeProject.githubUrl && (
                    <a href={formatExternalUrl(activeProject.githubUrl)} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/20 hover:border-white/50 bg-white/[0.05] hover:bg-white/10 text-white font-mono text-xs tracking-wider transition-all">
                      <GithubIcon size={14} /><span>GITHUB REPOSITORY</span><ArrowUpRight size={14} className="transition-transform duration-250 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-slate-400 group-hover:text-white" />
                    </a>
                  )}
                  {activeProject.liveUrl && (
                    <a href={formatExternalUrl(activeProject.liveUrl)} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black font-mono text-xs font-semibold tracking-wider hover:bg-slate-200 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all">
                      <ExternalLink size={14} /><span>LIVE DEMO</span><ArrowUpRight size={14} className="transition-transform duration-250 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function ProjectCard({ project, index, onClick }) {
  const cardRef = useRef(null);
  const [hovered, setHovered] = useState(false);

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start 95%', 'start 20%'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [60, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.4], [0, 1]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.08, 1]);
  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={cardRef}
      style={{ opacity, y }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative max-w-7xl mx-auto w-full px-5 sm:px-8 py-16 sm:py-24 cursor-pointer"
    >
      <div className={`grid lg:grid-cols-12 gap-8 lg:gap-16 items-center ${isEven ? '' : 'lg:flex-row-reverse'}`}>

        {/* Image */}
        <div className={`lg:col-span-7 ${isEven ? '' : 'lg:order-2'}`}>
          <div className="relative aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl border border-white/[0.06] group-hover:border-white/20 transition-colors duration-500">
            <motion.img
              src={project.image}
              alt={project.title}
              style={{ scale: imageScale }}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/70 via-black/10 to-transparent pointer-events-none" />
            {/* Hover overlay */}
            <motion.div
              animate={{ opacity: hovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm"
            >
              <span className="font-mono text-xs tracking-widest text-white uppercase border border-white/30 px-5 py-2.5 rounded-full bg-white/10">
                View Case Study
              </span>
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <div className={`lg:col-span-5 flex flex-col justify-center ${isEven ? '' : 'lg:order-1'}`}>
          <div className="font-mono text-[10px] tracking-[0.3em] text-cyan-400 mb-4 uppercase">
            {String(index + 1).padStart(2, '0')} · Project
          </div>

          <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4 leading-[1.05] group-hover:text-cyan-100 transition-colors duration-300">
            {project.title}
          </h3>

          <p className="text-slate-400 text-base sm:text-lg font-light mb-6 leading-relaxed">
            {project.shortDescription}
          </p>

          {project.techStack?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {project.techStack.map((tech) => (
                <span key={tech} className="font-mono text-[10px] tracking-wider uppercase border border-white/[0.08] group-hover:border-white/20 bg-white/[0.03] px-3 py-1.5 rounded-full text-slate-400 transition-colors duration-300">
                  {tech}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2 font-mono text-xs text-slate-400 group-hover:text-white uppercase tracking-widest transition-colors duration-300">
            <span>Explore Case Study</span>
            <motion.div animate={{ x: hovered ? 4 : 0, y: hovered ? -4 : 0 }} transition={{ duration: 0.2 }}>
              <ArrowUpRight size={16} />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}


