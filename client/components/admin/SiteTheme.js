'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api } from '@/lib/api';

// Active site theme (layout + features) so admin screens show only what the theme uses.
const SiteThemeContext = createContext({ theme: null, reload: () => {} });

const ALL_FORMATS = ['STANDARD', 'VIDEO', 'AUDIO', 'GALLERY'];

export function SiteThemeProvider({ children }) {
  const [theme, setTheme] = useState(null);
  const reload = useCallback(() => api.get('/admin/themes/active').then(setTheme).catch(() => {}), []);
  useEffect(() => { reload(); }, [reload]);
  return <SiteThemeContext.Provider value={{ theme, reload }}>{children}</SiteThemeContext.Provider>;
}

export function useSiteTheme() {
  const { theme, reload } = useContext(SiteThemeContext);
  const f = theme?.features;
  return {
    theme,
    reload,
    formats: f?.formats?.length ? f.formats : ALL_FORMATS,
    seriesTypes: f?.series || [],
    blockCategories: f?.blocks || null,
    usesSeries: !!f?.series?.length,
  };
}
