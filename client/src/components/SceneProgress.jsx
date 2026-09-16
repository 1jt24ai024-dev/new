import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SceneProgress({ sceneIndex, totalScenes, sceneIds }) {
  const currentNum = String(sceneIndex + 1).padStart(2, '0');
  const totalNum = String(totalScenes).padStart(2, '0');
  const sceneName = sceneIds[sceneIndex]?.toUpperCase() || '';

  return (
    <div className="scene-progress-dock fixed bottom-6 sm:bottom-8 right-6 sm:right-8 z-[90] flex flex-col items-end gap-2 pointer-events-none mix-blend-difference opacity-80">
      <div className="scene-progress-label font-mono text-[9px] sm:text-[10px] tracking-widest text-slate-300 uppercase">
        SCENE {currentNum} · {sceneName}
      </div>
      <div className="flex items-center gap-3">
        <span className="font-mono text-[9px] text-slate-400">{currentNum}</span>
        <div className="w-16 sm:w-24 h-px bg-white/20 overflow-hidden relative">
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: (sceneIndex + 1) / totalScenes }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 bg-cyan-400 origin-left"
          />
        </div>
        <span className="font-mono text-[9px] text-slate-400">{totalNum}</span>
      </div>
    </div>
  );
}
