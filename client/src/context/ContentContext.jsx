import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../api/axios';

const EMPTY_CONTENT = {
  hero: { name: '', tagline: '', image: '', socials: [] },
  about: { heading: '', bio: '', image: '', resumeUrl: '' },
  education: { visible: true, items: [] },
  experience: { visible: true, items: [] },
  certifications: { visible: true, items: [] },
  projects: { visible: true, items: [] },
  chronicles: { visible: true, items: [] },
  gridMotion: { visible: true, items: [] },
  banner: { heading: '', text: '', image: '' },
  contact: { heading: '', email: '', phone: '', image: '', socials: [] },
};

const ContentContext = createContext(null);

export function ContentProvider({ children }) {
  const [content, setContent] = useState(() => {
    try {
      const cached = localStorage.getItem('portfolio_content');
      return cached ? JSON.parse(cached) : EMPTY_CONTENT;
    } catch {
      return EMPTY_CONTENT;
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const refresh = useCallback(async () => {
    setError(false);
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000);
      const res = await api.get('/content', { signal: controller.signal });
      clearTimeout(timeout);
      if (res.data && typeof res.data === 'object') {
        setContent(res.data);
        try {
          localStorage.setItem('portfolio_content', JSON.stringify(res.data));
        } catch {}
      }
    } catch (err) {
      console.warn('Could not fetch from remote API, using local CMS state:', err.message);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const onFocus = () => refresh();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [refresh]);

  return (
    <ContentContext.Provider value={{ content, setContent, loading, error, refresh }}>
      {children}
    </ContentContext.Provider>
  );
}

export const useContent = () => useContext(ContentContext);
