import { NextResponse } from 'next/server';

/*
 * Site middleware:
 *  - Languages: /bn/about is served by the /about route with x-locale: bn (the API then returns Bengali content).
 *    The chosen language is remembered in a cookie, so links without a prefix keep visitors in their language.
 *  - Redirects managed in Admin → Redirects (cached for a minute; "/old/*" prefix rules supported).
 */

const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const TTL = 60 * 1000;
const LANG_COOKIE = 'site-lang';
let cache = { at: 0, exact: new Map(), prefix: [] };
let i18n = { at: 0, enabled: false, defaultLanguage: 'en', codes: new Set() };

async function redirects() {
  if (Date.now() - cache.at < TTL) return cache;
  try {
    const res = await fetch(`${API_URL}/api/public/redirects`, { cache: 'no-store' });
    const { items } = await res.json();
    const exact = new Map();
    const prefix = [];
    for (const r of items) {
      if (r.from.endsWith('/*')) prefix.push({ ...r, base: r.from.slice(0, -2).toLowerCase() });
      else exact.set(r.from.toLowerCase(), r);
    }
    prefix.sort((a, b) => b.base.length - a.base.length); // most specific first
    cache = { at: Date.now(), exact, prefix };
  } catch {
    cache = { ...cache, at: Date.now() }; // API down: keep the last list, retry after the TTL
  }
  return cache;
}

async function languages() {
  if (Date.now() - i18n.at < 30 * 1000) return i18n;
  try {
    const res = await fetch(`${API_URL}/api/public/i18n`, { cache: 'no-store' });
    const d = await res.json();
    i18n = { at: Date.now(), enabled: d.enabled, defaultLanguage: d.defaultLanguage, codes: new Set(d.languages.map((l) => l.code).filter((c) => c !== d.defaultLanguage)) };
  } catch {
    i18n = { ...i18n, at: Date.now() };
  }
  return i18n;
}

function match({ exact, prefix }, pathname) {
  const path = (pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname).toLowerCase();
  const hit = exact.get(path);
  if (hit) return { rule: hit, to: hit.to };
  for (const r of prefix) {
    if (path === r.base || path.startsWith(`${r.base}/`)) {
      const rest = pathname.slice(r.base.length).replace(/^\//, '');
      return { rule: r, to: r.to.includes('*') ? r.to.replace('*', rest) : r.to };
    }
  }
  return null;
}

export async function middleware(request, event) {
  const { pathname, search } = request.nextUrl;
  // Static files skip the lookup; old .html/.php addresses (common after a migration) can still be redirected.
  if (/\.(?!html?$|php$|aspx?$)\w+$/i.test(pathname)) return NextResponse.next();

  // Language prefix (/bn, /bn/…)
  const langs = await languages();
  let locale = '';
  let path = pathname;
  if (langs.enabled) {
    const first = pathname.split('/')[1]?.toLowerCase();
    if (first && langs.codes.has(first)) {
      locale = first;
      path = pathname.slice(first.length + 1) || '/';
    } else {
      // A visitor who chose another language follows plain links in that language.
      const chosen = request.cookies.get(LANG_COOKIE)?.value;
      if (chosen && langs.codes.has(chosen) && request.method === 'GET' && !request.headers.get('purpose')) {
        return NextResponse.redirect(new URL(`/${chosen}${pathname === '/' ? '' : pathname}${search}`, request.url), 307);
      }
    }
  }

  let decoded = path;
  try { decoded = decodeURI(path); } catch { /* malformed escape: match the raw path */ }
  const found = match(await redirects(), decoded);
  if (found) {
    event.waitUntil(fetch(`${API_URL}/api/public/redirects/${found.rule.id}/hit`, { method: 'POST' }).catch(() => {}));
    const external = /^https?:\/\//i.test(found.to);
    const to = !external && locale ? `/${locale}${found.to === '/' ? '' : found.to}` : found.to;
    const target = external ? new URL(to) : new URL(to, request.url);
    if (!target.search && search) target.search = search; // keep campaign parameters
    return NextResponse.redirect(target, found.rule.code);
  }

  if (!langs.enabled) return NextResponse.next();
  // The layout needs the language-free path for hreflang links and the language switcher.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-locale-path', path);
  if (!locale) return NextResponse.next({ request: { headers: requestHeaders } });
  requestHeaders.set('x-locale', locale);
  const res = NextResponse.rewrite(new URL(`${path}${search}`, request.url), { request: { headers: requestHeaders } });
  if (request.cookies.get(LANG_COOKIE)?.value !== locale) res.cookies.set(LANG_COOKIE, locale, { path: '/', maxAge: 60 * 60 * 24 * 365, sameSite: 'lax' });
  return res;
}

// Site pages only — not the admin, API routes, Next internals or uploads.
export const config = {
  matcher: ['/((?!admin(?:/|$)|api/|_next/|uploads/|preview(?:/|$)).*)'],
};
