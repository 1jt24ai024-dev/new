import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Image as ImageIcon, MapPin, Calendar } from 'lucide-react';

function AutoImageSlideshow({ images, alt }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (images.length < 2) return undefined;
    const interval = setInterval(() => {
      setActiveIndex((index) => (index + 1) % images.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <img
      src={images[activeIndex]}
      alt={alt}
      className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105"
      loading="lazy"
    />
  );
}

export default function ChromaGrid({ items = [], onSelect }) {
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50 });

  return (
    <div
      className="chroma-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 w-full h-auto overflow-visible p-2 sm:p-6 rounded-3xl border border-white/10 bg-slate-950/40 backdrop-blur-xl"
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setSpotlight({
          x: ((event.clientX - rect.left) / rect.width) * 100,
          y: ((event.clientY - rect.top) / rect.height) * 100,
        });
      }}
      style={{ '--spot-x': `${spotlight.x}%`, '--spot-y': `${spotlight.y}%` }}
    >
      {items.map((item, index) => (
        <motion.button
          type="button"
          key={item._id || index}
          onClick={() => onSelect(item)}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          whileHover={{ y: -6, scale: 1.01 }}
          transition={{ duration: 0.5, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
          className="chroma-card group text-left w-full h-auto flex flex-col justify-between rounded-2xl border border-white/10 bg-slate-900/60 p-4 sm:p-5 transition-all duration-300 hover:border-cyan-400/50 hover:shadow-[0_10px_30px_rgba(6,182,212,0.2)]"
        >
          {/* Image Container — Dynamic Aspect Ratio Frame (16:10) without clipping */}
          <div className="image-surface relative w-full aspect-[16/10] overflow-hidden rounded-xl border border-white/10 bg-slate-950/80 mb-4">
            {(item.images?.length ? item.images : item.image ? [item.image] : []).length > 0 ? (
              <AutoImageSlideshow
                images={item.images?.length ? item.images : [item.image]}
                alt={item.title || 'Chronicle visual'}
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-fuchsia-500/10">
                <ImageIcon className="text-slate-600" size={32} />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050813] via-transparent to-transparent opacity-80 group-hover:opacity-40 transition-opacity" />
            <ArrowUpRight size={18} className="absolute right-3 top-3 text-white/70 transition-all duration-300 group-hover:text-cyan-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>

          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2 font-mono text-[10px] sm:text-[11px] tracking-widest text-cyan-400/80 uppercase">
                {item.location && (
                  <span className="flex items-center gap-1">
                    <MapPin size={10} />
                    {item.location}
                  </span>
                )}
                {item.date && (
                  <span className="flex items-center gap-1 text-slate-400">
                    <Calendar size={10} />
                    {item.date}
                  </span>
                )}
                {!item.location && !item.date && <span>LOG // {String(index + 1).padStart(2, '0')}</span>}
              </div>

              <h3 className="font-display text-base sm:text-lg font-semibold tracking-tight text-white group-hover:text-cyan-200 transition-colors line-clamp-2">
                {item.title}
              </h3>
            </div>

            {item.description && (
              <p className="mt-2 text-xs leading-relaxed text-slate-400 line-clamp-3">
                {item.description}
              </p>
            )}
          </div>
        </motion.button>
      ))}
    </div>
  );
}
