'use client';

import { useEffect } from 'react';
import { api } from '@/lib/api';

// Reports the missing address to the 404 monitor (Admin → Redirects). It runs in the browser only when the
// 404 page is actually shown — the server also renders not-found boundaries for normal pages, so it can't report there.
export function ReportNotFound() {
  useEffect(() => {
    if (window.parent !== window) return; // admin preview
    api.post('/public/not-found', { path: window.location.pathname, referrer: document.referrer || null }).catch(() => {});
  }, []);
  return null;
}
