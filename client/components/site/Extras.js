'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowRight, ArrowUp, X } from 'lucide-react';
import { googleFontsUrl, themeVars } from '@/lib/theme';
import { cn } from '@/lib/utils';

export function AnnouncementBar({ announcement }) {
  const key = `announce-${announcement.text}`;
  const [hidden, setHidden] = useState(false);
  useEffect(() => { try { setHidden(sessionStorage.getItem(key) === '1'); } catch {} }, [key]);
  if (!announcement?.enabled || !announcement.text || hidden) return null;
  return (
    <div className="relative bg-gradient-to-r from-primary to-accent px-10 py-2.5 text-center text-sm font-medium text-white">
      {announcement.text}
      {announcement.url && (
        <Link href={announcement.url} className="ml-2 inline-flex items-center gap-1 font-bold underline-offset-4 hover:underline">
          {announcement.linkLabel || 'Learn more'}<ArrowRight className="h-3.5 w-3.5" />
        </Link>
      )}
      <button
        aria-label="Dismiss"
        onClick={() => { setHidden(true); try { sessionStorage.setItem(key, '1'); } catch {} }}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 opacity-70 hover:bg-white/15 hover:opacity-100"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <button
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={cn('fixed bottom-6 right-6 z-40 grid h-12 w-12 place-items-center rounded-full bg-primary text-white shadow-glow transition-all duration-300 hover:-translate-y-1', show ? 'opacity-100' : 'pointer-events-none translate-y-4 opacity-0')}
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}

export function ReadingProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setP(h > 0 ? (window.scrollY / h) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return <div className="fixed left-0 top-0 z-[60] h-1 bg-gradient-to-r from-primary to-accent transition-[width]" style={{ width: `${p}%` }} />;
}

/*
 * When the site is rendered inside the admin Theme Customizer iframe, the parent posts unsaved
 * appearance values here so changes show instantly without saving.
 */
export function PreviewListener() {
  useEffect(() => {
    if (window.parent === window) return undefined;
    const onMessage = (e) => {
      if (e.origin !== window.location.origin || e.data?.type !== 'nova:appearance') return;
      const a = e.data.appearance;
      const root = document.documentElement;
      const dark = e.data.mode === 'dark';
      root.classList.toggle('dark', dark);
      Object.entries(themeVars(a, dark ? 'dark' : 'light')).forEach(([k, v]) => root.style.setProperty(k, v));
      root.style.fontSize = `${a.baseFontSize || 16}px`;
      let link = document.getElementById('nova-preview-fonts');
      if (!link) {
        link = document.createElement('link');
        link.id = 'nova-preview-fonts';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
      }
      link.href = googleFontsUrl([a.headingFont, a.bodyFont]);
    };
    window.addEventListener('message', onMessage);
    window.parent.postMessage({ type: 'nova:preview-ready' }, window.location.origin);
    return () => window.removeEventListener('message', onMessage);
  }, []);
  return null;
}
