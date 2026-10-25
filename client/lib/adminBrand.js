'use client';

import { useEffect, useState } from 'react';
import { API_URL } from './api';
import { EDITION } from './edition';

// Admin panel branding (Settings → Admin panel). Empty settings fall back to these defaults.
export const ADMIN_BRAND_DEFAULTS = {
  name: EDITION.brand,
  logo: '',
  favicon: '',
  subtitle: '',
  loginBadge: 'Version 1.0',
  loginTitle: 'Craft your website,',
  loginHighlight: 'block by block.',
  loginText: 'Visual page builder, theme customizer, media library and team permissions — all in one beautiful dashboard.',
  loginImage: '',
  welcomeTitle: 'Welcome back 👋',
  welcomeText: 'Sign in to manage your website.',
  footerText: '',
};

export const withBrandDefaults = (b = {}) => Object.fromEntries(Object.entries(ADMIN_BRAND_DEFAULTS).map(([k, v]) => [k, b[k] || v]));

// Shared across components so a save in Settings updates the sidebar immediately.
let cache = null;
const listeners = new Set();

export function setAdminBrand(b) {
  cache = withBrandDefaults(b);
  listeners.forEach((fn) => fn(cache));
}

export function useAdminBrand() {
  const [brand, setBrand] = useState(cache || ADMIN_BRAND_DEFAULTS);
  useEffect(() => {
    listeners.add(setBrand);
    if (!cache) fetch(`${API_URL}/api/public/admin-brand`).then((r) => (r.ok ? r.json() : {})).then(setAdminBrand).catch(() => {});
    else setBrand(cache);
    return () => listeners.delete(setBrand);
  }, []);
  return brand;
}
