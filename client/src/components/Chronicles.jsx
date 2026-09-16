import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, X } from 'lucide-react';
import ChromaGrid from './ChromaGrid';

export default function Chronicles({ data }) {
  const [selectedNote, setSelectedNote] = useState(null);

  // If no items or section is hidden, return null
  if (!data || data.visible === false || !data.items || data.items.length === 0) {
    return null;
  }

  const chronicles = data.items;

  return (
    <section id="chronicles" className="relative py-20 sm:py-32 px-5 sm:px-8 border-t border-white/[0.04] w-full min-h-0 h-auto overflow-hidden">
      {/* Neural particle background effect */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20" aria-hidden="true">
         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(16,185,129,0.15)_0%,_transparent_70%)]" />
         <svg className="absolute w-full h-full opacity-30" viewBox="0 0 100 100" preserveAspectRatio="none">
           <path d="M0,50 Q25,25 50,50 T100,50" fill="none" stroke="#34d399" strokeWidth="0.5" className="neural-edge" />
           <path d="M0,80 Q30,100 60,60 T100,20" fill="none" stroke="#67e8f9" strokeWidth="0.5" className="neural-edge" style={{ animationDelay: '1s' }}/>
         </svg>
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10">
        {/* Section Heading */}
        <div className="section-heading mb-12 sm:mb-16 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="font-mono text-xs sm:text-sm tracking-[0.25em] text-slate-400 uppercase"
            >
              CHRONICLES
            </motion.h2>
            <p className="font-display text-2xl sm:text-3xl lg:text-4xl text-slate-100 font-medium mt-3 tracking-tight">
              Research Notes, Experiments & Technical Explorations
            </p>
          </div>
          <span className="font-mono text-xs text-slate-500">
            [ {chronicles.length} {chronicles.length === 1 ? 'LOG' : 'LOGS'} RECORDED ]
          </span>
        </div>

        {/* Redesigned Dual Interactive Showcase Layout */}
        <ChromaGrid items={chronicles} onSelect={setSelectedNote} />
      </div>

      {/* Note Reader Modal */}
      <AnimatePresence>
        {selectedNote && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#050508]/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8"
            onClick={() => setSelectedNote(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl max-h-[88vh] overflow-y-auto glass-panel rounded-2xl border border-white/[0.12] p-6 sm:p-10 shadow-2xl"
            >
              <button
                onClick={() => setSelectedNote(null)}
                className="absolute top-6 right-6 p-2 rounded-full border border-white/10 bg-white/[0.04] text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close Note"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs tracking-wider mb-2">
                <BookOpen size={14} />
                {selectedNote.location && <span className="uppercase">{selectedNote.location}</span>}
                {selectedNote.date && (
                  <>
                    <span>•</span>
                    <span className="text-slate-400">{selectedNote.date}</span>
                  </>
                )}
              </div>

              <h3 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight mb-6">
                {selectedNote.title}
              </h3>

              {selectedNote.image && (
                <div className="w-full max-h-[420px] rounded-xl overflow-hidden border border-white/10 mb-6 bg-black/60 flex items-center justify-center p-2">
                  <img src={selectedNote.image} alt={selectedNote.title} className="w-full h-full max-h-[400px] object-contain rounded-lg" />
                </div>
              )}

              {selectedNote.description && (
                <div className="text-slate-300 text-base leading-relaxed whitespace-pre-line space-y-4 font-light text-left border-t border-white/[0.08] pt-6">
                  {selectedNote.description}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
