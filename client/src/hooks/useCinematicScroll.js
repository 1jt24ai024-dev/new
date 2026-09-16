import { useEffect, useRef, useState } from 'react';

const SCENE_IDS = ['home', 'about', 'education', 'experience', 'certifications', 'projects', 'chronicles', 'contact'];

/**
 * useCinematicScroll
 * Tracks which scene is currently the "camera focus" and exposes the
 * normalized scroll progress (0→1) within each scene.
 */
export function useCinematicScroll() {
  const [activeScene, setActiveScene] = useState('home');
  const [sceneIndex, setSceneIndex] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    const update = () => {
      const scrollY = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const progress = total > 0 ? scrollY / total : 0;
      setOverallProgress(progress);

      // Determine active scene by viewport center
      const viewportMid = scrollY + window.innerHeight * 0.45;
      let found = 'home';
      let foundIdx = 0;
      SCENE_IDS.forEach((id, idx) => {
        const el = document.getElementById(id);
        if (!el) return;
        const sectionTop = el.getBoundingClientRect().top + scrollY;
        if (sectionTop <= viewportMid) {
          found = id;
          foundIdx = idx;
        }
      });
      setActiveScene(found);
      setSceneIndex(foundIdx);
    };

    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    update(); // initial
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return { activeScene, sceneIndex, overallProgress, totalScenes: SCENE_IDS.length, sceneIds: SCENE_IDS };
}

export default useCinematicScroll;
