'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import {
  Activity, Bell, ChevronsLeft, ExternalLink, FileText, FolderTree, HelpCircle, Image as ImageIcon, Inbox, LayoutDashboard,
  LogOut, Mail, Menu as MenuIcon, MessageSquareQuote, Moon, Newspaper, Palette, Search, Settings, ShieldCheck, Sun, Tags,
  UserCircle, Users, X, Command, Plus, CornerDownLeft, Clapperboard, Brush, PackageOpen, MessagesSquare, Route, DatabaseBackup,
} from 'lucide-react';
import { useAuth } from './AuthProvider';
import { useSiteTheme } from './SiteTheme';
import { EDITION } from '@/lib/edition';
import { Avatar, Dropdown, DropdownItem } from './ui';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';

export const NAV = [
  { group: null, items: [{ href: '/admin', label: 'Dashboard', icon: LayoutDashboard }] },
  { group: 'Content', items: [
    { href: '/admin/posts', label: 'Posts', icon: Newspaper, perm: 'posts' },
    { href: '/admin/categories', label: 'Categories', icon: FolderTree, perm: 'categories' },
    { href: '/admin/tags', label: 'Tags', icon: Tags, perm: 'categories' },
    { href: '/admin/series', label: 'Shows & podcasts', icon: Clapperboard, perm: 'series', needsSeries: true },
    { href: '/admin/pages', label: 'Pages', icon: FileText, perm: 'pages' },
    { href: '/admin/media', label: 'Media library', icon: ImageIcon, perm: 'media' },
  ] },
  { group: 'Appearance', items: [
    { href: '/admin/themes', label: 'Themes', icon: Brush, perm: 'appearance', builderOnly: true },
    { href: '/admin/appearance', label: 'Customize', icon: Palette, perm: 'appearance' },
    { href: '/admin/menus', label: 'Menus', icon: MenuIcon, perm: 'menus' },
  ] },
  { group: 'Engagement', items: [
    { href: '/admin/contacts', label: 'Messages', icon: Inbox, perm: 'contacts', badge: 'unread' },
    { href: '/admin/comments', label: 'Comments', icon: MessagesSquare, perm: 'comments', badge: 'pending' },
    { href: '/admin/newsletter', label: 'Newsletter', icon: Mail, perm: 'newsletter' },
    { href: '/admin/testimonials', label: 'Testimonials', icon: MessageSquareQuote, perm: 'testimonials' },
    { href: '/admin/faqs', label: 'FAQs', icon: HelpCircle, perm: 'faqs' },
  ] },
  { group: 'System', items: [
    { href: '/admin/users', label: 'Users', icon: Users, perm: 'users' },
    { href: '/admin/roles', label: 'Roles & permissions', icon: ShieldCheck, perm: 'roles' },
    { href: '/admin/settings', label: 'Settings', icon: Settings, perm: 'settings' },
    { href: '/admin/redirects', label: 'Redirects', icon: Route, perm: 'redirects' },
    { href: '/admin/backups', label: 'Backup & restore', icon: DatabaseBackup, perm: 'backups' },
    { href: '/admin/logs', label: 'Activity logs', icon: Activity, perm: 'logs' },
    { href: '/admin/export', label: 'Export project', icon: PackageOpen, perm: 'settings', builderOnly: true },
  ] },
];

const isActive = (pathname, href) => (href === '/admin' ? pathname === '/admin' : pathname.startsWith(href));

export function toggleAdminTheme() {
  const dark = !document.documentElement.classList.contains('dark');
  document.documentElement.classList.toggle('dark', dark);
  try { localStorage.setItem('admin-theme', dark ? 'dark' : 'light'); } catch {}
}

function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen, unread, pending }) {
  const pathname = usePathname();
  const { can } = useAuth();
  const { theme, usesSeries } = useSiteTheme();
  const nav = NAV.map((g) => ({ ...g, items: g.items.filter((i) => (!i.perm || can(i.perm)) && (!i.needsSeries || usesSeries) && !(i.builderOnly && EDITION.singleTheme)) })).filter((g) => g.items.length);

  return (
    <>
      <div onClick={() => setMobileOpen(false)} className={cn('fixed inset-0 z-40 bg-ink-950/50 backdrop-blur-sm transition lg:hidden', mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0')} />
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col border-r border-white/5 bg-ink-950 text-ink-300 transition-all duration-300',
          collapsed ? 'lg:w-[76px]' : 'lg:w-[264px]',
          'w-[264px]',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
      >
        {/* glow */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-brand-500/25 blur-[90px]" />
        <div className={cn('relative flex h-16 shrink-0 items-center gap-3 px-5', collapsed && 'lg:justify-center lg:px-0')}>
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand-400 via-brand-500 to-fuchsia-500 font-black text-white shadow-brand-glow">{EDITION.brand[0]}</span>
          <div className={cn('leading-tight', collapsed && 'lg:hidden')}>
            <div className="truncate font-extrabold tracking-tight text-white">{EDITION.brand}</div>
            <div className="text-[11px] font-medium text-ink-500">{theme ? `${theme.name} theme` : 'Content platform'}</div>
          </div>
          <button onClick={() => setMobileOpen(false)} className="ml-auto rounded-lg p-1.5 hover:bg-white/5 lg:hidden"><X className="h-5 w-5" /></button>
        </div>

        <nav className="a-scroll relative flex-1 space-y-6 overflow-y-auto px-3 py-4">
          {nav.map((g) => (
            <div key={g.group || 'main'}>
              {g.group && <div className={cn('mb-2 px-3 text-[10.5px] font-bold uppercase tracking-[.14em] text-ink-500', collapsed && 'lg:hidden')}>{g.group}</div>}
              <ul className="space-y-0.5">
                {g.items.map((item) => {
                  const active = isActive(pathname, item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        title={collapsed ? item.label : undefined}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          'group relative flex items-center gap-3 rounded-xl px-3 py-2 text-[13.5px] font-semibold transition',
                          active ? 'bg-white/[.07] text-white' : 'hover:bg-white/[.04] hover:text-white',
                          collapsed && 'lg:justify-center lg:px-0',
                        )}
                      >
                        {active && <span className="absolute -left-3 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-brand-400 shadow-[0_0_12px_2px_rgb(138_119_255/.6)]" />}
                        <item.icon className={cn('h-[18px] w-[18px] shrink-0', active ? 'text-brand-300' : 'text-ink-500 group-hover:text-ink-300')} />
                        <span className={cn('truncate', collapsed && 'lg:hidden')}>{item.label}</span>
                        {item.badge === 'pending' && pending > 0 && (
                          <span className={cn('ml-auto rounded-full bg-amber-500 px-1.5 py-0.5 text-[10px] font-bold text-white', collapsed && 'lg:absolute lg:right-1 lg:top-0.5')}>{pending}</span>
                        )}
                        {item.badge === 'unread' && unread > 0 && (
                          <span className={cn('ml-auto rounded-full bg-brand-500 px-1.5 py-0.5 text-[10px] font-bold text-white', collapsed && 'lg:absolute lg:right-1 lg:top-0.5')}>{unread}</span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="relative hidden border-t border-white/5 p-3 lg:block">
          <button onClick={() => setCollapsed(!collapsed)} className={cn('flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-ink-500 transition hover:bg-white/[.04] hover:text-white', collapsed && 'justify-center px-0')}>
            <ChevronsLeft className={cn('h-[18px] w-[18px] transition', collapsed && 'rotate-180')} />
            {!collapsed && 'Collapse'}
          </button>
        </div>
      </aside>
    </>
  );
}

function CommandPalette({ open, setOpen }) {
  const router = useRouter();
  const { can } = useAuth();
  const [q, setQ] = useState('');
  const [results, setResults] = useState(null);
  const [index, setIndex] = useState(0);

  useEffect(() => { if (!open) { setQ(''); setResults(null); setIndex(0); } }, [open]);
  useEffect(() => {
    if (q.trim().length < 2) { setResults(null); return undefined; }
    const t = setTimeout(() => api.get('/admin/system/search', { q }).then(setResults).catch(() => {}), 200);
    return () => clearTimeout(t);
  }, [q]);

  const items = useMemo(() => {
    const actions = [
      { label: 'New post', href: '/admin/posts/new', icon: Plus, group: 'Actions', perm: 'posts' },
      { label: 'New page', href: '/admin/pages/new', icon: Plus, group: 'Actions', perm: 'pages' },
      ...NAV.flatMap((g) => g.items.map((i) => ({ ...i, group: 'Navigate' }))),
    ].filter((i) => !i.perm || can(i.perm));
    const needle = q.toLowerCase();
    const list = actions.filter((a) => a.label.toLowerCase().includes(needle));
    if (results) {
      list.push(...results.posts.map((p) => ({ label: p.title, href: `/admin/posts/${p.id}`, icon: Newspaper, group: 'Posts' })));
      list.push(...results.pages.map((p) => ({ label: p.title, href: `/admin/pages/${p.id}`, icon: FileText, group: 'Pages' })));
      list.push(...(results.categories || []).map((c) => ({ label: c.name, href: '/admin/categories', icon: FolderTree, group: 'Categories' })));
    }
    return list.slice(0, 14);
  }, [q, results, can]);

  const go = (item) => { setOpen(false); router.push(item.href); };
  const onKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setIndex((i) => Math.min(items.length - 1, i + 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setIndex((i) => Math.max(0, i - 1)); }
    if (e.key === 'Enter' && items[index]) go(items[index]);
    if (e.key === 'Escape') setOpen(false);
  };

  if (!open) return null;
  let lastGroup = null;
  return (
    <div className="fixed inset-0 z-[110] flex items-start justify-center p-4 pt-[12vh]">
      <div className="fixed inset-0 bg-ink-950/50 backdrop-blur-sm animate-fade-in" onClick={() => setOpen(false)} />
      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-ink-200/60 bg-white shadow-2xl animate-scale-in dark:border-white/10 dark:bg-ink-900">
        <div className="flex items-center gap-3 border-b border-ink-100 px-4 dark:border-white/5">
          <Search className="h-5 w-5 text-ink-400" />
          <input autoFocus value={q} onChange={(e) => { setQ(e.target.value); setIndex(0); }} onKeyDown={onKey} placeholder="Search content or jump to…" className="h-14 flex-1 bg-transparent text-ink-900 outline-none placeholder:text-ink-400 dark:text-white" />
          <kbd className="rounded-md border border-ink-200 px-1.5 py-0.5 text-[11px] font-semibold text-ink-400 dark:border-white/10">ESC</kbd>
        </div>
        <div className="a-scroll max-h-[50vh] overflow-y-auto p-2">
          {items.length === 0 && <p className="py-10 text-center text-sm text-ink-400">No results for “{q}”</p>}
          {items.map((item, i) => {
            const header = item.group !== lastGroup ? item.group : null;
            lastGroup = item.group;
            return (
              <div key={`${item.group}-${item.href}-${item.label}`}>
                {header && <div className="px-3 pb-1 pt-3 text-[11px] font-bold uppercase tracking-wider text-ink-400">{header}</div>}
                <button
                  onMouseEnter={() => setIndex(i)}
                  onClick={() => go(item)}
                  className={cn('flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium', i === index ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-200' : 'text-ink-700 dark:text-ink-200')}
                >
                  <item.icon className="h-4 w-4 opacity-70" />
                  <span className="flex-1 truncate">{item.label}</span>
                  {i === index && <CornerDownLeft className="h-3.5 w-3.5 opacity-60" />}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function Shell({ children }) {
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const [pending, setPending] = useState(0);
  const pathname = usePathname();
  const { can } = useAuth();

  useEffect(() => {
    try { setCollapsed(localStorage.getItem('admin-sidebar') === 'collapsed'); } catch {}
  }, []);
  const setCollapsedPersist = (v) => { setCollapsed(v); try { localStorage.setItem('admin-sidebar', v ? 'collapsed' : 'open'); } catch {} };

  useEffect(() => {
    if (!can('contacts')) return;
    api.get('/admin/contacts', { status: 'UNREAD', limit: 1 }).then((r) => setUnread(r.meta.total)).catch(() => {});
  }, [pathname, can]);

  useEffect(() => {
    if (!can('comments')) return;
    api.get('/admin/comments/pending-count').then((r) => setPending(r.count)).catch(() => {});
  }, [pathname, can]);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setPaletteOpen((o) => !o); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Full-bleed editors (page builder, theme customizer) manage their own layout.
  const fullBleed = /^\/admin\/(pages\/(new|\d+)|appearance)/.test(pathname);

  return (
    <div className="min-h-screen bg-ink-50 font-admin text-ink-800 dark:bg-ink-950 dark:text-ink-200">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsedPersist} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} unread={unread} pending={pending} />
      <div className={cn('transition-all duration-300', collapsed ? 'lg:pl-[76px]' : 'lg:pl-[264px]')}>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-ink-200/60 bg-white/75 px-4 backdrop-blur-xl dark:border-white/5 dark:bg-ink-950/75 sm:px-6">
          <button onClick={() => setMobileOpen(true)} className="a-btn-ghost a-btn-icon lg:hidden"><MenuIcon className="h-5 w-5" /></button>
          <button onClick={() => setPaletteOpen(true)} className="flex h-10 w-full max-w-sm items-center gap-3 rounded-xl border border-ink-200 bg-ink-50/80 px-3 text-sm text-ink-400 transition hover:border-ink-300 dark:border-white/10 dark:bg-white/[.03]">
            <Search className="h-4 w-4" />
            <span className="flex-1 text-left">Search…</span>
            <kbd className="hidden items-center gap-0.5 rounded-md border border-ink-200 bg-white px-1.5 py-0.5 text-[11px] font-semibold dark:border-white/10 dark:bg-white/5 sm:flex"><Command className="h-3 w-3" />K</kbd>
          </button>
          <div className="ml-auto flex items-center gap-1">
            <a href="/" target="_blank" rel="noreferrer" className="a-btn-ghost hidden sm:inline-flex"><ExternalLink className="h-4 w-4" />View site</a>
            <button onClick={toggleAdminTheme} className="a-btn-ghost a-btn-icon" aria-label="Toggle theme">
              <Sun className="hidden h-[18px] w-[18px] dark:block" /><Moon className="h-[18px] w-[18px] dark:hidden" />
            </button>
            {can('contacts') && (
              <Link href="/admin/contacts?status=UNREAD" className="a-btn-ghost a-btn-icon relative" aria-label="Messages">
                <Bell className="h-[18px] w-[18px]" />
                {unread > 0 && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-ink-950" />}
              </Link>
            )}
            <Dropdown
              trigger={(
                <button className="ml-1 flex items-center gap-2.5 rounded-xl p-1 pr-2 transition hover:bg-ink-100 dark:hover:bg-white/5">
                  <Avatar src={user?.avatar} name={user?.name} size={32} />
                  <span className="hidden text-left leading-tight md:block">
                    <span className="block text-sm font-bold text-ink-900 dark:text-white">{user?.name}</span>
                    <span className="block text-[11px] text-ink-400">{user?.role?.name}</span>
                  </span>
                </button>
              )}
            >
              <div className="border-b border-ink-100 px-3 pb-2.5 pt-1.5 dark:border-white/5">
                <div className="text-sm font-bold text-ink-900 dark:text-white">{user?.name}</div>
                <div className="text-xs text-ink-400">{user?.email}</div>
              </div>
              <div className="pt-1.5">
                <Link href="/admin/profile" className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-ink-700 hover:bg-ink-50 dark:text-ink-200 dark:hover:bg-white/5"><UserCircle className="h-4 w-4" />My profile</Link>
                <DropdownItem icon={LogOut} onClick={logout} danger>Sign out</DropdownItem>
              </div>
            </Dropdown>
          </div>
        </header>
        <main className={cn(!fullBleed && 'mx-auto max-w-[1400px] p-4 sm:p-6 lg:p-8')}>{children}</main>
      </div>
      <CommandPalette open={paletteOpen} setOpen={setPaletteOpen} />
    </div>
  );
}
