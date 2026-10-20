'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Check, ChevronDown, Languages } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UI_DEFAULTS } from '@/lib/i18n';

/*
 * Site language context: the current language, the enabled languages, the translated interface strings (t) and a
 * language switcher. Content itself arrives already translated from the API.
 */

const I18nContext = createContext({ enabled: false, lang: 'en', defaultLanguage: 'en', languages: [], ui: UI_DEFAULTS, switcher: false });

// Language prefixes in use on this page, so link helpers outside React (active-link checks) can strip them.
let prefixes = new Set();
export const unprefix = (url) => {
  if (typeof url !== 'string') return url;
  const m = url.match(/^\/([a-z]{2,3}(?:-[a-z]{2})?)(?=\/|$|#|\?)/i);
  return m && prefixes.has(m[1].toLowerCase()) ? url.slice(m[0].length) || '/' : url;
};

export function I18nProvider({ value, children }) {
  prefixes = new Set((value?.languages || []).map((l) => l.code).filter((c) => c !== value?.defaultLanguage));
  return <I18nContext.Provider value={value || undefined}>{children}</I18nContext.Provider>;
}

export const useI18n = () => useContext(I18nContext);

// t('readMore') → the interface string in the visitor's language (falls back to the key's English default).
export function useT() {
  const { ui } = useI18n();
  return (key, fallback) => ui?.[key] || UI_DEFAULTS[key] || fallback || key;
}

const stripLocale = (pathname, lang, def) => {
  if (!pathname || lang === def) return pathname || '/';
  if (pathname === `/${lang}`) return '/';
  return pathname.startsWith(`/${lang}/`) ? pathname.slice(lang.length + 1) : pathname;
};

// The page path without the language prefix (/bn/about → /about) — for "is this the homepage?" and active links.
export function usePagePath() {
  const pathname = usePathname();
  const { lang, defaultLanguage } = useI18n();
  return stripLocale(pathname, lang, defaultLanguage);
}

export const localeHref = (href, lang, def) => (lang && lang !== def && typeof href === 'string' && href.startsWith('/') && !href.startsWith(`/${lang}/`) && href !== `/${lang}` ? `/${lang}${href === '/' ? '' : href}` : href);

// Same-language link target for an internal path.
export function useLocaleHref() {
  const { lang, defaultLanguage } = useI18n();
  return (href) => localeHref(href, lang, defaultLanguage);
}

export function LanguageSwitcher({ className, compact }) {
  const { enabled, switcher, lang, defaultLanguage, languages, ui } = useI18n();
  const path = usePagePath();
  const [open, setOpen] = useState(false);
  const ref = useRef();
  useEffect(() => {
    if (!open) return undefined;
    const close = (e) => !ref.current?.contains(e.target) && setOpen(false);
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);
  if (!enabled || !switcher || languages.length < 2) return null;
  const current = languages.find((l) => l.code === lang) || languages[0];

  const choose = (code) => {
    document.cookie = `site-lang=${code === defaultLanguage ? '' : code}; path=/; max-age=${code === defaultLanguage ? 0 : 31536000}; samesite=lax`;
    const search = window.location.search;
    window.location.href = `${code === defaultLanguage ? path : `/${code}${path === '/' ? '' : path}`}${search}`;
  };

  return (
    <div ref={ref} className={cn('relative', className)}>
      <button type="button" onClick={() => setOpen((o) => !o)} aria-haspopup="listbox" aria-expanded={open} aria-label={ui?.language || 'Language'}
        className="flex h-10 items-center gap-1.5 rounded-full px-2.5 text-sm font-semibold text-fg/75 transition hover:bg-fg/5 hover:text-fg">
        <Languages className="h-[18px] w-[18px]" />
        {!compact && <span className="uppercase">{current.code}</span>}
        <ChevronDown className={cn('h-3.5 w-3.5 transition', open && 'rotate-180')} />
      </button>
      {open && (
        <ul role="listbox" className="absolute right-0 top-full z-[80] mt-2 min-w-[180px] overflow-hidden rounded-theme border border-fg/10 bg-bg p-1 text-fg shadow-xl">
          {languages.map((l) => (
            <li key={l.code}>
              <button type="button" role="option" aria-selected={l.code === lang} lang={l.code} dir={l.dir} onClick={() => choose(l.code)}
                className={cn('flex w-full items-center justify-between gap-3 rounded-[calc(var(--radius)*0.6)] px-3 py-2 text-left text-sm transition hover:bg-fg/5', l.code === lang && 'font-semibold text-primary')}>
                <span>{l.native}</span>
                {l.code === lang ? <Check className="h-4 w-4" /> : <span className="font-mono text-[11px] uppercase text-fg/40">{l.code}</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
