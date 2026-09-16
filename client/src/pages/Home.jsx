import React, { useEffect, useLayoutEffect } from 'react';
import { useContent } from '../context/ContentContext';
import useScrollAnimations from '../hooks/useScrollAnimations';
import CustomCursor from '../components/CustomCursor';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import CinematicContent from '../components/CinematicContent';

export default function Home() {
  const { content } = useContent();
  useScrollAnimations();

  useLayoutEffect(() => {
    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

    return () => {
      window.history.scrollRestoration = previousRestoration;
    };
  }, []);

  useEffect(() => {
    const sections = [...document.querySelectorAll('main > section')];
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const animateSectionContents = (section) => {
      if (reducedMotion || document.documentElement.classList.contains('rocket-launching')) return;
      if (section.id === 'grid-motion') {
        const grid = section.querySelector('.grid-motion-shell');
        if (grid && !grid.dataset.revealed) {
          grid.dataset.revealed = 'true';
          grid.animate(
            [{ opacity: 0, transform: 'scale(.96)' }, { opacity: 1, transform: 'scale(1)' }],
            { duration: 820, delay: 180, easing: 'cubic-bezier(.16, 1, .3, 1)', fill: 'both' }
          );
        }
        return;
      }

      const targets = [...section.querySelectorAll('h2, h3, p, img:not(.hero-grounded-portrait), .glass-panel, .project-card, .experience-row, .chroma-card, form, input, textarea')]
        .filter((element) => !element.dataset.revealed);

      targets.forEach((element, index) => {
        element.dataset.revealed = 'true';
        const isImage = element.tagName === 'IMG';
        const isField = ['INPUT', 'TEXTAREA'].includes(element.tagName);
        const keyframes = isImage
          ? [{ opacity: 0, transform: 'scale(.92)' }, { opacity: 1, transform: 'scale(1)' }]
          : isField
            ? [{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'translateY(0)' }]
            : [{ opacity: 0, transform: 'translateY(22px)' }, { opacity: 1, transform: 'translateY(0)' }];
        element.animate(keyframes, {
          duration: isImage ? 720 : 620,
          delay: 150 + Math.min(index * 58, 520),
          easing: 'cubic-bezier(.16, 1, .3, 1)',
          fill: 'both',
        });
      });
    };
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (!entry.isIntersecting || entry.target.dataset.revealed === 'true') return;
        if (document.documentElement.classList.contains('rocket-launching')) return;
        entry.target.dataset.revealed = 'true';
        if (entry.target.id === 'home' || entry.target.id === 'grid-motion') return;
        const index = sections.indexOf(entry.target);
        const offset = index % 2 === 0 ? 32 : -32;
        if (reducedMotion) return;
        entry.target.animate(
          [
            { opacity: 0, transform: `translate3d(${offset}px, 42px, 0) scale(.985)` },
            { opacity: 1, transform: 'translate3d(0, 0, 0) scale(1)' },
          ],
          { duration: 780, delay: 40, easing: 'cubic-bezier(.16, 1, .3, 1)', fill: 'both' }
        );
        animateSectionContents(entry.target);
      }),
      { threshold: 0.12 }
    );
    sections.forEach((section) => observer.observe(section));

    const addRipple = (event) => {
      const target = event.target.closest('.interactive-hit');
      if (!target) return;
      const bounds = target.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'tap-ripple';
      ripple.style.left = `${event.clientX - bounds.left}px`;
      ripple.style.top = `${event.clientY - bounds.top}px`;
      target.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
    };

    window.addEventListener('pointerdown', addRipple, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener('pointerdown', addRipple);
    };
  }, [content]);

  const visibility = {
    home: true,
    about: Boolean(content?.about?.bio || content?.about?.image || content?.about?.heading),
    education: content?.education?.visible !== false && content?.education?.items?.length > 0,
    experience: content?.experience?.visible !== false && content?.experience?.items?.length > 0,
    certifications: content?.certifications?.visible !== false && content?.certifications?.items?.length > 0,
    projects: content?.projects?.visible !== false && content?.projects?.items?.length > 0,
    chronicles: content?.chronicles?.visible !== false && content?.chronicles?.items?.length > 0,
    contact: true,
  };


  return (
    <div className="portfolio-shell relative isolate min-h-screen overflow-x-clip bg-[#050508] text-slate-100 selection:bg-cyan-500/20 selection:text-cyan-100">
      {/* Awwwards scroll progress bar */}
      <div id="scroll-progress" style={{ transform: 'scaleX(0)' }} />
      <a className="skip-link" href="#main-content">Skip to content</a>
      <CustomCursor />
      <Navbar visibility={visibility} />

      <main
        id="main-content"
        className="relative z-10"
        onPointerMove={(event) => {
          const section = event.target.closest('main > section');
          if (!section) return;
          const rect = section.getBoundingClientRect();
          section.style.setProperty('--section-x', `${((event.clientX - rect.left) / rect.width) * 100}%`);
          section.style.setProperty('--section-y', `${((event.clientY - rect.top) / rect.height) * 100}%`);
        }}
      >
        <Hero data={content?.hero} />
        <CinematicContent content={content} />
      </main>
    </div>
  );
}
