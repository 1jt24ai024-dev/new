import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Awwwards-grade scroll animation system.
 * - Lenis smooth scroll
 * - Parallax layers
 * - Text split reveals (word-by-word)
 * - Section scale-in entrances
 * - Image parallax zoom
 * - Staggered grid reveals
 * - Horizontal marquee on scroll
 */
export default function useScrollAnimations() {
  const lenisRef = useRef(null);

  useEffect(() => {
    // Skip on mobile or reduced-motion
    const isMobile = window.innerWidth < 768;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    /* ─── 1. LENIS SMOOTH SCROLL ─── */
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: !isMobile,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    // Sync Lenis with GSAP ScrollTrigger + drive progress bar
    const progressBar = document.getElementById('scroll-progress');
    lenis.on('scroll', ({ progress }) => {
      ScrollTrigger.update();
      if (progressBar) {
        progressBar.style.transform = `scaleX(${progress})`;
      }
    });
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    /* ─── 2. SCENE CINEMATIC TRANSITIONS ─── */
    const sections = document.querySelectorAll('main > section:not(#home):not(#projects)');
    sections.forEach((section) => {
      gsap.fromTo(section, 
        { 
          scale: 0.95, 
          opacity: 0,
          y: 60
        },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            end: 'top 40%',
            scrub: 1,
          },
        }
      );
    });

    /* ─── 3. TEXT SPLIT WORD REVEALS ─── */
    const headings = document.querySelectorAll('.scroll-text-reveal');
    headings.forEach((heading) => {
      const text = heading.textContent;
      const words = text.split(' ');
      heading.innerHTML = '';
      heading.style.overflow = 'hidden';

      words.forEach((word, i) => {
        const wordSpan = document.createElement('span');
        wordSpan.className = 'scroll-word';
        wordSpan.style.cssText = `
          display: inline-block;
          transform: translateY(110%);
          opacity: 0;
          margin-right: 0.3em;
        `;
        wordSpan.textContent = word;
        heading.appendChild(wordSpan);
      });

      gsap.to(heading.querySelectorAll('.scroll-word'), {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.06,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: heading,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    });

    /* ─── 4. PARALLAX ON IMAGES ─── */
    const parallaxImages = document.querySelectorAll('.image-surface img, .hero-grounded-portrait');
    parallaxImages.forEach((img) => {
      gsap.fromTo(img,
        { yPercent: -8 },
        {
          yPercent: 8,
          ease: 'none',
          scrollTrigger: {
            trigger: img.closest('section') || img.parentElement,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
          },
        }
      );
    });

    /* ─── 5. HORIZONTAL MARQUEE ON SCROLL ─── */
    const marquees = document.querySelectorAll('.scroll-marquee');
    marquees.forEach((marquee) => {
      const speed = marquee.dataset.speed || 100;
      gsap.to(marquee, {
        xPercent: -50,
        ease: 'none',
        scrollTrigger: {
          trigger: marquee.closest('section') || marquee,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.5,
        },
      });
    });

    /* ─── 6. STAGGERED GRID REVEALS ─── */
    const grids = document.querySelectorAll('.scroll-stagger-grid');
    grids.forEach((grid) => {
      const children = grid.children;
      gsap.fromTo(children,
        { y: 60, opacity: 0, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: grid,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    /* ─── 7. COUNTER / NUMBER ANIMATIONS ─── */
    const counters = document.querySelectorAll('.scroll-counter');
    counters.forEach((counter) => {
      const endVal = parseFloat(counter.dataset.value || counter.textContent);
      const obj = { val: 0 };
      gsap.to(obj, {
        val: endVal,
        duration: 1.5,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: counter,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
        onUpdate: () => {
          counter.textContent = Math.round(obj.val);
        },
      });
    });

    /* ─── 8. MAGNETIC HOVER ON INTERACTIVE ELEMENTS (desktop only) ─── */
    if (!isMobile) {
      const magneticEls = document.querySelectorAll('.scroll-magnetic');
      magneticEls.forEach((el) => {
        el.addEventListener('mousemove', (e) => {
          const rect = el.getBoundingClientRect();
          const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
          const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
          gsap.to(el, { x, y, duration: 0.3, ease: 'power2.out' });
        });
        el.addEventListener('mouseleave', () => {
          gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
        });
      });
    }

    /* ─── 9. FADE-UP REVEAL FOR GENERIC ELEMENTS ─── */
    const fadeUps = document.querySelectorAll('.scroll-fade-up');
    gsap.fromTo(fadeUps,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: fadeUps[0]?.closest('section') || document.body,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      }
    );

    /* ─── 10. LINE DRAW ANIMATIONS ─── */
    const lines = document.querySelectorAll('.scroll-line-draw');
    lines.forEach((line) => {
      gsap.fromTo(line,
        { scaleX: 0, transformOrigin: 'left center' },
        {
          scaleX: 1,
          duration: 1,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: line,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    /* ─── CLEANUP ─── */
    return () => {
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
    };
  }, []);

  return lenisRef;
}
