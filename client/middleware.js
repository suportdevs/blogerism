import { NextResponse } from 'next/server';

/*
 * Site middleware: applies the redirects managed in Admin → Redirects (cached for a minute; "/old/*" prefix rules supported).
 */

const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const TTL = 60 * 1000;
let cache = { at: 0, exact: new Map(), prefix: [] };

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
  let path = pathname;
  try { path = decodeURI(pathname); } catch { /* malformed escape: match the raw path */ }
  const found = match(await redirects(), path);
  if (found) {
    event.waitUntil(fetch(`${API_URL}/api/public/redirects/${found.rule.id}/hit`, { method: 'POST' }).catch(() => {}));
    const target = /^https?:\/\//i.test(found.to) ? new URL(found.to) : new URL(found.to, request.url);
    if (!target.search && search) target.search = search; // keep campaign parameters
    return NextResponse.redirect(target, found.rule.code);
  }
  return NextResponse.next();
}

// Site pages only — not the admin, API routes, Next internals or uploads.
export const config = {
  matcher: ['/((?!admin(?:/|$)|api/|_next/|uploads/|preview(?:/|$)).*)'],
};
