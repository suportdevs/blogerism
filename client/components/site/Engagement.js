'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AArrowDown, AArrowUp, Bell, BellRing, Bookmark, BookmarkCheck, Check, CornerDownRight, Facebook, Heart, Link2, Linkedin, Loader2, Mail,
  MessageCircle, Plus, Printer, Send, Share2, Trash2, Twitter, X,
} from 'lucide-react';
import { API_URL } from '@/lib/api';
import { cn, compact, postUrl, seriesUrl, timeAgo } from '@/lib/utils';

/* ------------------------------------------------------------------------
 * Visitor memory: what this browser liked, saved and followed.
 * Stored in localStorage and kept in sync across components via an event.
 * ---------------------------------------------------------------------- */
const EVENT = 'nova:engagement';
const read = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
const write = (key, value) => {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  window.dispatchEvent(new CustomEvent(EVENT, { detail: key }));
};

function useStored(key, fallback) {
  const [value, setValue] = useState(fallback);
  useEffect(() => {
    setValue(read(key, fallback));
    const sync = (e) => { if (!e.detail || e.detail === key) setValue(read(key, fallback)); };
    const storage = (e) => { if (e.key === key) setValue(read(key, fallback)); };
    window.addEventListener(EVENT, sync);
    window.addEventListener('storage', storage);
    return () => { window.removeEventListener(EVENT, sync); window.removeEventListener('storage', storage); };
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps
  const set = useCallback((next) => write(key, typeof next === 'function' ? next(read(key, fallback)) : next), [key]); // eslint-disable-line react-hooks/exhaustive-deps
  return [value, set];
}

const post = (path, body) => fetch(`${API_URL}/api/public${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body || {}) });

// Shared button look: "pill" (default), "ghost" (luxe / minimal) or "icon".
const BTN = {
  pill: (on) => cn('inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition active:scale-95', on ? 'bg-primary text-white' : 'bg-fg/5 text-fg hover:bg-fg/10'),
  ghost: (on) => cn('inline-flex items-center gap-2 border-b border-transparent pb-0.5 text-[11px] font-medium uppercase tracking-[0.2em] transition', on ? 'border-primary text-primary' : 'text-fg/60 hover:border-fg/40 hover:text-fg'),
  icon: (on) => cn('grid h-10 w-10 place-items-center rounded-full border transition active:scale-90', on ? 'border-primary bg-primary text-white' : 'border-fg/15 text-fg/70 hover:border-primary hover:text-primary'),
};

/* --------------------------------- Like --------------------------------- */
export function LikeButton({ slug, initial = 0, variant = 'pill' }) {
  const [liked, setLiked] = useStored('nova:liked', []);
  const [count, setCount] = useState(initial || 0);
  const [pop, setPop] = useState(false);
  const on = liked.includes(slug);
  const toggle = async () => {
    const undo = on;
    setLiked((l) => (undo ? l.filter((s) => s !== slug) : [...l, slug]));
    setCount((n) => Math.max(0, n + (undo ? -1 : 1)));
    if (!undo) { setPop(true); setTimeout(() => setPop(false), 450); }
    try {
      const r = await post(`/posts/${slug}/like`, { undo });
      if (r.ok) setCount((await r.json()).likes);
    } catch {}
  };
  return (
    <button type="button" onClick={toggle} aria-pressed={on} aria-label={on ? 'Unlike' : 'Like'} className={BTN[variant](on)}>
      <Heart className={cn('h-4 w-4 transition-transform', on && 'fill-current', pop && 'scale-150')} />
      {variant !== 'icon' && <span className="tabular-nums">{compact(count)}</span>}
    </button>
  );
}

/* ---------------------------- Save / favourite ---------------------------- */
export function SaveButton({ item, labels, variant = 'pill', iconOnly }) {
  const [saved, setSaved] = useStored('nova:saved', []);
  const on = saved.some((s) => s.type === item.type && s.slug === item.slug);
  const toggle = () => setSaved((list) => (on ? list.filter((s) => !(s.type === item.type && s.slug === item.slug)) : [{ ...item, savedAt: Date.now() }, ...list]));
  const Icon = on ? BookmarkCheck : item.type === 'series' ? Plus : Bookmark;
  return (
    <button type="button" onClick={toggle} aria-pressed={on} title={on ? labels.saved : labels.save} className={iconOnly ? BTN.icon(on) : BTN[variant](on)}>
      {on && item.type === 'series' ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
      {!iconOnly && <span>{on ? labels.saved : labels.save}</span>}
    </button>
  );
}

// Header icon linking to the saved page, with a count badge.
export function SavedLink({ label = 'Saved', className }) {
  const [saved] = useStored('nova:saved', []);
  return (
    <Link href="/saved" aria-label={label} title={label} className={cn('relative grid h-10 w-10 place-items-center rounded-full text-fg/70 transition hover:bg-fg/5 hover:text-fg', className)}>
      <Bookmark className="h-[18px] w-[18px]" />
      {saved.length > 0 && <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">{saved.length > 99 ? '99+' : saved.length}</span>}
    </Link>
  );
}

/* --------------------------------- Share --------------------------------- */
export function ShareButton({ title, variant = 'pill', label = 'Share' }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState('');
  const ref = useRef();
  useEffect(() => { setUrl(window.location.href.split('#')[0]); }, []);
  useEffect(() => {
    if (!open) return undefined;
    const close = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    const esc = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('mousedown', close); document.removeEventListener('keydown', esc); };
  }, [open]);

  const onClick = async () => {
    // Phones get the native share sheet; desktops get the menu.
    if (navigator.share && window.matchMedia('(pointer: coarse)').matches) {
      try { await navigator.share({ title, url }); return; } catch { return; }
    }
    setOpen((o) => !o);
  };
  const copy = async () => {
    try { await navigator.clipboard.writeText(url); } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title || '');
  const targets = [
    ['Facebook', Facebook, `https://www.facebook.com/sharer/sharer.php?u=${u}`, '#1877f2'],
    ['X (Twitter)', Twitter, `https://twitter.com/intent/tweet?url=${u}&text=${t}`, '#111111'],
    ['LinkedIn', Linkedin, `https://www.linkedin.com/sharing/share-offsite/?url=${u}`, '#0a66c2'],
    ['WhatsApp', MessageCircle, `https://wa.me/?text=${t}%20${u}`, '#25d366'],
    ['Email', Mail, `mailto:?subject=${t}&body=${u}`, '#6b7280'],
  ];
  return (
    <div ref={ref} className="relative inline-block">
      <button type="button" onClick={onClick} aria-expanded={open} aria-label={label} className={BTN[variant](open)}>
        <Share2 className="h-4 w-4" />{variant !== 'icon' && <span>{label}</span>}
      </button>
      {open && (
        <div className="absolute left-0 top-full z-50 mt-2 w-60 origin-top-left animate-fade-up rounded-theme border border-fg/10 bg-bg p-2 text-fg shadow-2xl sm:left-auto sm:right-0">
          {targets.map(([name, Icon, href, color]) => (
            <a key={name} href={href} target="_blank" rel="noreferrer" onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-theme px-3 py-2.5 text-sm font-medium transition hover:bg-fg/5">
              <span className="grid h-8 w-8 place-items-center rounded-full text-white" style={{ background: color }}><Icon className="h-4 w-4" /></span>{name}
            </a>
          ))}
          <button type="button" onClick={copy} className="mt-1 flex w-full items-center gap-3 rounded-theme border-t border-fg/10 px-3 py-2.5 text-left text-sm font-medium transition hover:bg-fg/5">
            <span className={cn('grid h-8 w-8 place-items-center rounded-full text-white transition', copied ? 'bg-emerald-500' : 'bg-primary')}>{copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}</span>
            {copied ? 'Link copied!' : 'Copy link'}
          </button>
        </div>
      )}
    </div>
  );
}

/* ------------------------------ Post actions ------------------------------ */
// The bar under a post: like · comments · save · share. `engagement` = site switches.
export function PostActions({ post: p, engagement, labels, variant = 'pill', className, extra }) {
  const showComments = engagement.comments && p.allowComments !== false;
  return (
    <div className={cn('flex flex-wrap items-center', variant === 'ghost' ? 'gap-6' : 'gap-2', className)}>
      {engagement.likes && <LikeButton slug={p.slug} initial={p.likes} variant={variant} />}
      {showComments && (
        <a href="#comments" className={BTN[variant](false)}>
          <MessageCircle className="h-4 w-4" /><span className="tabular-nums">{compact(p.commentCount || 0)}</span>
        </a>
      )}
      {engagement.saves && <SaveButton item={{ type: 'post', slug: p.slug, title: p.title }} labels={labels} variant={variant} />}
      {engagement.share && <ShareButton title={p.title} variant={variant} />}
      {extra}
    </div>
  );
}

/* ----------------------------- Follow a series ----------------------------- */
export function SubscribeButton({ series, labels, initial = 0, className, dark }) {
  const [followed, setFollowed] = useStored('nova:following', []);
  const [count, setCount] = useState(initial || 0);
  const on = followed.includes(series.slug);
  const toggle = async () => {
    const undo = on;
    setFollowed((l) => (undo ? l.filter((s) => s !== series.slug) : [...l, series.slug]));
    setCount((n) => Math.max(0, n + (undo ? -1 : 1)));
    try {
      const r = await post(`/series/${series.slug}/subscribe`, { undo });
      if (r.ok) setCount((await r.json()).subscribers);
    } catch {}
  };
  return (
    <div className={cn('inline-flex items-center gap-3', className)}>
      <button
        type="button"
        onClick={toggle}
        aria-pressed={on}
        className={cn('inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition active:scale-95',
          on ? (dark ? 'bg-white/15 text-white hover:bg-white/25' : 'bg-fg/10 text-fg hover:bg-fg/15') : (dark ? 'bg-white text-gray-900 hover:bg-white/90' : 'bg-fg text-bg hover:opacity-90'))}
      >
        {on ? <BellRing className="h-4 w-4" /> : <Bell className="h-4 w-4" />}{on ? labels.done : labels.action}
      </button>
      <span className={cn('text-sm', dark ? 'text-white/70' : 'text-fg/55')}><b className={dark ? 'text-white' : 'text-fg'}>{compact(count)}</b> {count === 1 ? labels.noun.replace(/s$/, '') : labels.noun}</span>
    </div>
  );
}

/* ------------------------------- Reading tools ------------------------------- */
// A− / A+ for article text; applies to elements with [data-reader-text].
export function TextSizer({ className }) {
  const [scale, setScale] = useStored('nova:text-scale', 1);
  useEffect(() => { document.documentElement.style.setProperty('--reader-scale', String(scale)); }, [scale]);
  const step = (d) => setScale((s) => Math.min(1.4, Math.max(0.85, Math.round((s + d) * 100) / 100)));
  return (
    <div className={cn('inline-flex items-center rounded-full border border-fg/15', className)}>
      <button type="button" onClick={() => step(-0.1)} aria-label="Smaller text" className="grid h-9 w-10 place-items-center text-fg/70 hover:text-fg disabled:opacity-30" disabled={scale <= 0.85}><AArrowDown className="h-4 w-4" /></button>
      <span className="h-5 w-px bg-fg/15" />
      <button type="button" onClick={() => step(0.1)} aria-label="Larger text" className="grid h-9 w-10 place-items-center text-fg/70 hover:text-fg disabled:opacity-30" disabled={scale >= 1.4}><AArrowUp className="h-4 w-4" /></button>
    </div>
  );
}

export function PrintButton({ className }) {
  return <button type="button" onClick={() => window.print()} aria-label="Print" className={cn('grid h-9 w-9 place-items-center rounded-full border border-fg/15 text-fg/70 hover:text-fg', className)}><Printer className="h-4 w-4" /></button>;
}

/* --------------------------------- Comments --------------------------------- */
const HUES = [210, 340, 160, 30, 270, 190, 0, 120];
function Avatar({ name, src, staff }) {
  if (src) return <img src={src} alt="" className="h-10 w-10 shrink-0 rounded-full object-cover" />;
  const hue = HUES[[...(name || '?')].reduce((n, c) => n + c.charCodeAt(0), 0) % HUES.length];
  const initials = (name || '?').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  return <span className={cn('grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm font-bold text-white', staff && 'ring-2 ring-primary ring-offset-2 ring-offset-bg')} style={{ background: `hsl(${hue} 55% 48%)` }}>{initials}</span>;
}

function CommentForm({ slug, parentId, onPosted, onCancel, autoFocus, compactForm }) {
  const [me, setMe] = useStored('nova:commenter', { name: '', email: '' });
  const [form, setForm] = useState({ name: '', email: '', content: '', website: '' });
  const [state, setState] = useState({ busy: false, error: '' });
  useEffect(() => { setForm((f) => ({ ...f, name: f.name || me.name, email: f.email || me.email })); }, [me.name, me.email]);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const submit = async (e) => {
    e.preventDefault();
    setState({ busy: true, error: '' });
    try {
      const r = await post(`/posts/${slug}/comments`, { ...form, parentId: parentId || null });
      const body = await r.json();
      if (!r.ok) throw new Error(body.errors?.[0]?.message || body.message || 'Could not post your comment');
      setMe({ name: form.name, email: form.email });
      setForm((f) => ({ ...f, content: '' }));
      setState({ busy: false, error: '' });
      onPosted(body.comment, body.message);
    } catch (err) {
      setState({ busy: false, error: err.message });
    }
  };
  const known = me.name && me.email && form.name === me.name && form.email === me.email;
  return (
    <form onSubmit={submit} className={cn('rounded-theme-lg border border-fg/10 bg-surface p-4 sm:p-5', compactForm && 'mt-3')}>
      <textarea
        required
        autoFocus={autoFocus}
        value={form.content}
        onChange={set('content')}
        maxLength={3000}
        rows={compactForm ? 3 : 4}
        placeholder={parentId ? 'Write a reply…' : 'Join the conversation…'}
        className="w-full resize-y rounded-theme border border-fg/10 bg-bg px-4 py-3 text-fg outline-none transition placeholder:text-fg/40 focus:border-primary focus:ring-4 focus:ring-primary/10"
      />
      {/* Honeypot: hidden from people, irresistible to bots. */}
      <input tabIndex={-1} autoComplete="off" value={form.website} onChange={set('website')} name="website" className="absolute -left-[9999px] h-0 w-0 opacity-0" aria-hidden />
      {known ? (
        <p className="mt-3 text-sm text-fg/55">Commenting as <b className="text-fg">{me.name}</b> · <button type="button" onClick={() => setMe({ name: '', email: '' })} className="font-semibold text-primary hover:underline">change</button></p>
      ) : (
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <input required value={form.name} onChange={set('name')} placeholder="Your name" maxLength={80} className="rounded-theme border border-fg/10 bg-bg px-4 py-2.5 text-sm text-fg outline-none focus:border-primary" />
          <input required type="email" value={form.email} onChange={set('email')} placeholder="Email (never shown)" maxLength={160} className="rounded-theme border border-fg/10 bg-bg px-4 py-2.5 text-sm text-fg outline-none focus:border-primary" />
        </div>
      )}
      {state.error && <p className="mt-3 text-sm font-medium text-rose-500">{state.error}</p>}
      <div className="mt-3 flex items-center justify-between gap-3">
        <span className="text-xs text-fg/40">{form.content.length}/3000</span>
        <div className="flex gap-2">
          {onCancel && <button type="button" onClick={onCancel} className="rounded-full px-4 py-2 text-sm font-semibold text-fg/60 hover:text-fg">Cancel</button>}
          <button disabled={state.busy || !form.content.trim()} className="btn-site-primary !px-5 !py-2 text-sm disabled:opacity-50">
            {state.busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}{parentId ? 'Reply' : 'Post comment'}
          </button>
        </div>
      </div>
    </form>
  );
}

function CommentItem({ c, slug, canReply, onReply, depth = 0 }) {
  const [likedC, setLikedC] = useStored('nova:comment-likes', []);
  const [likes, setLikes] = useState(c.likes);
  const [replying, setReplying] = useState(false);
  const on = likedC.includes(c.id);
  const like = async () => {
    if (!c.id || c.status === 'PENDING') return;
    const undo = on;
    setLikedC((l) => (undo ? l.filter((x) => x !== c.id) : [...l, c.id]));
    setLikes((n) => Math.max(0, n + (undo ? -1 : 1)));
    try { const r = await post(`/comments/${c.id}/like`, { undo }); if (r.ok) setLikes((await r.json()).likes); } catch {}
  };
  return (
    <li className={cn('animate-fade-up', depth > 0 && 'mt-4')}>
      <div className="flex gap-3 sm:gap-4">
        <Avatar name={c.name} src={c.avatar} staff={c.isStaff} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <span className="font-bold text-fg">{c.name}</span>
            {c.isStaff && <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">Team</span>}
            <span className="text-xs text-fg/45" title={new Date(c.createdAt).toLocaleString()}>{timeAgo(c.createdAt)}</span>
            {c.status === 'PENDING' && <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-600">Awaiting approval</span>}
          </div>
          <p className="mt-1.5 whitespace-pre-line break-words leading-relaxed text-fg/80">{c.content}</p>
          {c.status !== 'PENDING' && (
            <div className="mt-2 flex items-center gap-4 text-sm">
              <button type="button" onClick={like} className={cn('inline-flex items-center gap-1.5 font-semibold transition', on ? 'text-primary' : 'text-fg/50 hover:text-fg')}>
                <Heart className={cn('h-3.5 w-3.5', on && 'fill-current')} />{likes > 0 ? likes : 'Like'}
              </button>
              {canReply && depth < 2 && (
                <button type="button" onClick={() => setReplying((r) => !r)} className="inline-flex items-center gap-1.5 font-semibold text-fg/50 hover:text-fg"><CornerDownRight className="h-3.5 w-3.5" />Reply</button>
              )}
            </div>
          )}
          {replying && <CommentForm slug={slug} parentId={c.id} compactForm autoFocus onCancel={() => setReplying(false)} onPosted={(r, msg) => { setReplying(false); onReply(c.id, r, msg); }} />}
          {c.replies?.length > 0 && (
            <ul className="mt-2 border-l-2 border-fg/10 pl-4 sm:pl-6">
              {c.replies.map((r) => <CommentItem key={r.id || r.tempId} c={r} slug={slug} canReply={canReply} onReply={onReply} depth={depth + 1} />)}
            </ul>
          )}
        </div>
      </div>
    </li>
  );
}

const SORTS = { top: 'Top', newest: 'Newest', oldest: 'Oldest' };
const score = (c) => c.likes + (c.replies?.length || 0) * 2;

export function Comments({ slug, title = 'Comments' }) {
  const [data, setData] = useState(null);
  const [sort, setSort] = useState('top');
  const [notice, setNotice] = useState('');
  useEffect(() => {
    let alive = true;
    fetch(`${API_URL}/api/public/posts/${slug}/comments`).then((r) => r.json()).then((d) => alive && setData(d)).catch(() => alive && setData({ items: [], count: 0, open: false }));
    return () => { alive = false; };
  }, [slug]);

  const sorted = useMemo(() => {
    const list = [...(data?.items || [])];
    if (sort === 'top') list.sort((a, b) => score(b) - score(a) || new Date(b.createdAt) - new Date(a.createdAt));
    if (sort === 'newest') list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (sort === 'oldest') list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    // Pending comments by this visitor stay on top where they can see them.
    return [...list.filter((c) => c.status === 'PENDING'), ...list.filter((c) => c.status !== 'PENDING')];
  }, [data, sort]);

  const add = (comment, msg) => {
    const c = { ...comment, tempId: Date.now(), replies: [] };
    setData((d) => ({ ...d, items: [c, ...d.items], count: d.count + (c.status === 'APPROVED' ? 1 : 0) }));
    setNotice(msg);
  };
  const addReply = (parentId, reply, msg) => {
    const r = { ...reply, tempId: Date.now(), replies: [] };
    const attach = (list) => list.map((c) => (c.id === parentId ? { ...c, replies: [...(c.replies || []), r] } : { ...c, replies: attach(c.replies || []) }));
    setData((d) => ({ ...d, items: attach(d.items), count: d.count + (r.status === 'APPROVED' ? 1 : 0) }));
    setNotice(msg);
  };

  if (!data) return <section id="comments" className="scroll-mt-28 py-10"><div className="h-6 w-40 animate-pulse rounded bg-fg/10" /><div className="mt-6 h-32 animate-pulse rounded-theme-lg bg-fg/5" /></section>;
  if (!data.open && !data.count) return null;

  return (
    <section id="comments" className="scroll-mt-28 py-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <h2 className="flex items-center gap-3 font-heading text-2xl font-extrabold tracking-tight text-fg sm:text-3xl">
          {title}<span className="rounded-full bg-primary/10 px-3 py-0.5 text-base font-bold text-primary">{data.count}</span>
        </h2>
        {data.items.length > 1 && (
          <div className="flex rounded-full bg-fg/5 p-1 text-sm">
            {Object.entries(SORTS).map(([k, l]) => <button key={k} type="button" onClick={() => setSort(k)} className={cn('rounded-full px-3.5 py-1.5 font-semibold transition', sort === k ? 'bg-bg text-fg shadow-sm' : 'text-fg/55 hover:text-fg')}>{l}</button>)}
          </div>
        )}
      </div>
      {data.open ? <CommentForm slug={slug} onPosted={add} /> : <p className="rounded-theme-lg border border-fg/10 bg-surface p-4 text-sm text-fg/55">Comments are closed for this post.</p>}
      {notice && (
        <div className="mt-4 flex items-center justify-between gap-3 rounded-theme border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-fg/80">
          <span className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" />{notice}</span>
          <button type="button" onClick={() => setNotice('')} aria-label="Dismiss"><X className="h-4 w-4 text-fg/40" /></button>
        </div>
      )}
      {sorted.length > 0 ? (
        <ul className="mt-8 space-y-7">
          {sorted.map((c) => <CommentItem key={c.id || c.tempId} c={c} slug={slug} canReply={data.open && data.replies} onReply={addReply} />)}
        </ul>
      ) : data.open && <p className="mt-8 text-center text-fg/45">No comments yet — start the conversation.</p>}
    </section>
  );
}

/* ------------------------------- Saved page ------------------------------- */
export function SavedList({ labels }) {
  const [saved, setSaved] = useStored('nova:saved', null);
  const [items, setItems] = useState(null);
  useEffect(() => {
    if (!saved) return;
    const slugs = (type) => saved.filter((s) => s.type === type).map((s) => s.slug);
    const get = (path, list) => (list.length ? fetch(`${API_URL}/api/public${path}?slugs=${encodeURIComponent(list.join(','))}&limit=100`).then((r) => r.json()).then((d) => d.items || []).catch(() => []) : Promise.resolve([]));
    Promise.all([get('/posts', slugs('post')), get('/series', slugs('series'))]).then(([posts, series]) => {
      const find = (s) => (s.type === 'series' ? series.find((x) => x.slug === s.slug) : posts.find((x) => x.slug === s.slug));
      setItems(saved.map((s) => ({ ...s, data: find(s) })).filter((s) => s.data));
    });
  }, [saved]);
  const remove = (s) => setSaved((list) => list.filter((x) => !(x.type === s.type && x.slug === s.slug)));

  if (!items) return <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{[0, 1, 2].map((i) => <div key={i} className="aspect-[4/3] animate-pulse rounded-theme-lg bg-fg/5" />)}</div>;
  if (!items.length) {
    return (
      <div className="mx-auto max-w-md rounded-theme-lg border-2 border-dashed border-fg/10 p-12 text-center">
        <Bookmark className="mx-auto h-10 w-10 text-fg/25" />
        <p className="mt-4 text-fg/60">{labels.empty}</p>
        <Link href="/" className="btn-site-primary mt-6">Start exploring</Link>
      </div>
    );
  }
  return (
    <>
      <div className="mb-6 flex items-center justify-between text-sm text-fg/55">
        <span>{items.length} item{items.length === 1 ? '' : 's'}</span>
        <button type="button" onClick={() => setSaved([])} className="inline-flex items-center gap-1.5 font-semibold hover:text-rose-500"><Trash2 className="h-4 w-4" />Clear all</button>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((s) => {
          const d = s.data;
          const series = s.type === 'series';
          const href = series ? seriesUrl(d) : postUrl(d);
          const img = series ? d.backdrop || d.poster : d.coverImage || d.series?.poster;
          return (
            <div key={`${s.type}:${s.slug}`} className="group relative overflow-hidden rounded-theme-lg border border-fg/10 bg-bg transition hover:-translate-y-1 hover:shadow-xl">
              <Link href={href} className="block">
                <div className="aspect-video overflow-hidden bg-surface">{img && <img src={img} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />}</div>
                <div className="p-4">
                  <div className="text-xs font-bold uppercase tracking-wider text-primary">{series ? d.type?.toLowerCase() : { VIDEO: 'Video', AUDIO: 'Episode', GALLERY: 'Gallery' }[d.format] || 'Article'}</div>
                  <h3 className="mt-1 line-clamp-2 font-heading text-lg font-bold text-fg group-hover:text-primary">{d.title}</h3>
                  <p className="mt-1 text-xs text-fg/45">Saved {timeAgo(s.savedAt)}</p>
                </div>
              </Link>
              <button type="button" onClick={() => remove(s)} aria-label="Remove" className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-black/55 text-white opacity-0 backdrop-blur transition hover:bg-rose-500 group-hover:opacity-100 max-sm:opacity-100"><X className="h-4 w-4" /></button>
            </div>
          );
        })}
      </div>
    </>
  );
}
