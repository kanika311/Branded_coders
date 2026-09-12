import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CYCLER_ITEMS = [
  {
    id: 'google',
    label: 'Google & Search',
    badgeClass: 'badge-google',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
      </svg>
    ),
  },
  {
    id: 'apps',
    label: 'Web & Mobile Apps',
    badgeClass: 'badge-apps',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
        <line x1="12" y1="18" x2="12.01" y2="18"/>
      </svg>
    ),
  },
  {
    id: 'meta',
    label: 'Meta & Paid Ads',
    badgeClass: 'badge-meta',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EA580C" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
        <polyline points="17 6 23 6 23 12"/>
      </svg>
    ),
  },
  {
    id: 'ai',
    label: 'AI Platforms',
    badgeClass: 'badge-ai',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    ),
  },
  {
    id: 'cloud',
    label: 'Cloud & APIs',
    badgeClass: 'badge-cloud',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
      </svg>
    ),
  },
];

export default function HeroWordCycler() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % CYCLER_ITEMS.length);
    }, 2700);

    return () => clearInterval(timer);
  }, []);

  const current = CYCLER_ITEMS[index];

  return (
    <span className="hero-cycler-container" aria-live="polite">
      <AnimatePresence mode="wait">
        <motion.span
          key={current.id}
          className={`hero-cycler-badge ${current.badgeClass}`}
          initial={{ opacity: 0, y: 16, filter: 'blur(4px)', scale: 0.94 }}
          animate={{
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            scale: 1,
            transition: { duration: 0.38, ease: [0.16, 1, 0.3, 1] },
          }}
          exit={{
            opacity: 0,
            y: -14,
            filter: 'blur(4px)',
            scale: 0.94,
            transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] },
          }}
        >
          <span className="hero-cycler-icon-wrap">{current.icon}</span>
          <span>{current.label}</span>
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
