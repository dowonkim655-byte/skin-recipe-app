'use client';
import { useEffect, useState } from 'react';

// Inline script injected into <head> to avoid flash-of-wrong-theme
// Runs before React hydration
export function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})()`,
      }}
    />
  );
}

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDark(saved === 'dark' || (!saved && prefersDark));
    } catch { setDark(false); }
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    if (next) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try { localStorage.setItem('theme', next ? 'dark' : 'light'); } catch { /* ignore */ }
  }

  return (
    <button
      onClick={toggle}
      aria-label={dark ? '라이트 모드로 전환' : '다크 모드로 전환'}
      className="w-8 h-8 rounded-full flex items-center justify-center text-base transition-all active:scale-90"
      style={{ backgroundColor: dark ? '#2a2521' : '#f0e8dc' }}
    >
      {dark ? '☀️' : '🌙'}
    </button>
  );
}
