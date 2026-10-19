'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, CalendarCheck, Check, Clock, Heart, Loader2, MapPin, Search, Star, User } from 'lucide-react';
import { API_URL } from '@/lib/api';
import { ICONS } from '@/lib/icons';
import { cn, slugify } from '@/lib/utils';

const fieldName = (f, i) => slugify(f.label || '') || `field-${i}`;

/* ------------------------------ Search hero bar ------------------------------ */
export function SearchBar({ d, className }) {
  const router = useRouter();
  const tabs = (d.tabs || []).filter(Boolean);
  const fields = d.fields || [];
  const ButtonIcon = ICONS[d.buttonIcon] || Search;
  const [tab, setTab] = useState(tabs[0] || '');
  const [values, setValues] = useState({});
  const submit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (tab) params.set('type', tab);
    Object.entries(values).forEach(([k, v]) => v && params.set(k, v));
    const q = params.toString();
    router.push(`${d.action || '/contact'}${q ? `?${q}` : ''}`);
  };

  return (
    <form onSubmit={submit} className={cn('text-left', className)}>
      {tabs.length > 0 && (
        <div className="inline-flex gap-1 rounded-t-theme-lg bg-bg/95 p-1.5 pb-0 backdrop-blur">
          {tabs.map((t) => (
            <button key={t} type="button" onClick={() => setTab(t)} className={cn('rounded-theme px-5 py-2 text-sm font-bold transition', tab === t ? 'bg-primary text-white shadow-glow' : 'text-fg/60 hover:text-fg')}>{t}</button>
          ))}
        </div>
      )}
      <div className={cn('grid gap-2 rounded-theme-lg bg-bg p-2.5 shadow-2xl shadow-black/30 md:grid-flow-col md:auto-cols-fr md:gap-0', tabs.length && 'rounded-tl-none')}>
        {fields.map((f, i) => {
          const Icon = ICONS[f.icon] || Search;
          const name = fieldName(f, i);
          const set = (e) => setValues((v) => ({ ...v, [name]: e.target.value }));
          const input = 'mt-0.5 w-full truncate bg-transparent text-[15px] font-semibold text-fg outline-none placeholder:font-medium placeholder:text-fg/40';
          return (
            <label key={i} className={cn('block cursor-text rounded-theme px-4 py-2.5 transition hover:bg-fg/[.04]', i > 0 && 'md:rounded-none md:border-l md:border-fg/10')}>
              <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-fg/45"><Icon className="h-3.5 w-3.5 text-primary" />{f.label}</span>
              {f.type === 'select' ? (
                <select value={values[name] || ''} onChange={set} className={cn(input, 'cursor-pointer appearance-none')}>
                  <option value="">{f.placeholder || 'Any'}</option>
                  {(f.options || []).map((o) => <option key={o}>{o}</option>)}
                </select>
              ) : (
                <input type={f.type === 'date' ? 'date' : 'text'} value={values[name] || ''} onChange={set} placeholder={f.placeholder} className={input} />
              )}
            </label>
          );
        })}
        <button className="btn-site-primary min-h-[56px] px-8 md:ml-2 md:w-auto"><ButtonIcon className="h-4 w-4" />{d.buttonLabel || 'Search'}</button>
      </div>
    </form>
  );
}

/* ------------------------------ Rotating word ------------------------------ */
export function RotatingWord({ words = [], interval = 2400 }) {
  const list = words.filter(Boolean);
  const [i, setI] = useState(0);
  useEffect(() => {
    if (list.length < 2) return undefined;
    const t = setInterval(() => setI((n) => (n + 1) % list.length), interval);
    return () => clearInterval(t);
  }, [list.length, interval]);
  if (!list.length) return null;
  return (
    <span className="inline-block [perspective:600px]">
      <span key={i} className="inline-block origin-bottom animate-[word-in_.7s_cubic-bezier(.2,.7,.2,1)_both]">{list[i]}</span>
    </span>
  );
}

/* ------------------------------ Listings ------------------------------ */
// "BedDouble: 3 beds" → icon + text; anything else is plain text.
function Meta({ value }) {
  const m = String(value).match(/^([A-Z][A-Za-z0-9]+):\s*(.+)$/);
  const Icon = m && ICONS[m[1]];
  return <span className="flex items-center gap-1.5">{Icon && <Icon className="h-4 w-4 text-primary" />}{Icon ? m[2] : value}</span>;
}

function SaveButton() {
  const [on, setOn] = useState(false);
  return (
    <button type="button" aria-label="Save" onClick={(e) => { e.preventDefault(); setOn((v) => !v); }} className={cn('grid h-9 w-9 place-items-center rounded-full backdrop-blur transition hover:scale-110', on ? 'bg-primary text-white' : 'bg-white/90 text-gray-900')}>
      <Heart className={cn('h-4 w-4', on && 'fill-current')} />
    </button>
  );
}

function ListingCard({ it, SubIcon }) {
  const meta = (it.meta || []).filter(Boolean);
  return (
    <article className="group flex flex-col overflow-hidden rounded-theme-lg border border-fg/10 bg-bg transition duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-black/10">
      <Link href={it.url || '#'} className="relative block aspect-[4/3] overflow-hidden">
        {it.image && <img src={it.image} alt={it.title} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/10" />
        {it.badge && <span className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-xs font-bold text-white shadow-glow">{it.badge}</span>}
        <span className="absolute right-4 top-4"><SaveButton /></span>
        {it.price && <div className="absolute bottom-4 left-4 text-white"><span className="font-heading text-2xl font-extrabold">{it.price}</span>{it.period && <span className="text-sm text-white/80">{it.period}</span>}</div>}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-3 text-xs font-bold uppercase tracking-wider text-primary">
          <span>{it.category}</span>
          {it.rating && <span className="flex items-center gap-1 text-sm normal-case tracking-normal text-fg/70"><Star className="h-4 w-4 fill-amber-400 text-amber-400" />{it.rating}</span>}
        </div>
        <h3 className="mt-2 font-heading text-lg font-bold leading-snug text-fg transition group-hover:text-primary"><Link href={it.url || '#'}>{it.title}</Link></h3>
        {it.subtitle && <p className="mt-1.5 flex items-center gap-1.5 text-sm text-fg/55"><SubIcon className="h-4 w-4 shrink-0" />{it.subtitle}</p>}
        <div className="min-h-4 flex-1" />
        {meta.length > 0 && <div className="flex flex-wrap gap-x-5 gap-y-2 border-t border-fg/10 pt-4 text-sm text-fg/70">{meta.map((x, i) => <Meta key={i} value={x} />)}</div>}
      </div>
    </article>
  );
}

function ListingOverlay({ it, SubIcon }) {
  return (
    <Link href={it.url || '#'} className="group relative block aspect-[3/4] overflow-hidden rounded-theme-lg">
      {it.image && <img src={it.image} alt={it.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110" />}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
      <div className="absolute inset-x-4 top-4 flex items-start justify-between gap-2">
        {it.badge ? <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">{it.badge}</span> : <span />}
        {it.price && <span className="rounded-full bg-primary px-3 py-1 text-sm font-extrabold text-white shadow-glow">{it.price}<span className="font-medium text-white/80">{it.period}</span></span>}
      </div>
      <div className="absolute inset-x-0 bottom-0 p-6 text-white">
        {it.category && <div className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">{it.category}</div>}
        <h3 className="mt-1 font-heading text-2xl font-bold leading-tight">{it.title}</h3>
        {it.subtitle && <p className="mt-1 flex items-center gap-1.5 text-sm text-white/75"><SubIcon className="h-4 w-4" />{it.subtitle}</p>}
        <div className="grid grid-rows-[0fr] transition-all duration-500 group-hover:grid-rows-[1fr]">
          <div className="overflow-hidden">
            <div className="flex flex-wrap gap-x-4 gap-y-1 pt-3 text-sm text-white/85">{(it.meta || []).filter(Boolean).map((x, i) => <Meta key={i} value={x} />)}</div>
            <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold">Explore<ArrowRight className="h-4 w-4" /></span>
          </div>
        </div>
      </div>
    </Link>
  );
}

const COLS = { 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-2 lg:grid-cols-3', 4: 'sm:grid-cols-2 lg:grid-cols-4' };

export function ListingGrid({ d }) {
  const items = d.items || [];
  const cats = useMemo(() => [...new Set(items.map((i) => i.category).filter(Boolean))], [items]);
  const [cat, setCat] = useState('');
  const shown = cat ? items.filter((i) => i.category === cat) : items;
  const Card = d.variant === 'overlay' ? ListingOverlay : ListingCard;
  const SubIcon = ICONS[d.subtitleIcon] || MapPin;
  return (
    <>
      {d.filters && cats.length > 1 && (
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {['', ...cats].map((c) => (
            <button key={c || 'all'} onClick={() => setCat(c)} className={cn('rounded-full px-5 py-2 text-sm font-semibold transition', cat === c ? 'bg-primary text-white shadow-glow' : 'bg-fg/5 text-fg/70 hover:bg-fg/10 hover:text-fg')}>{c || 'All'}</button>
          ))}
        </div>
      )}
      <div key={cat} className={cn('grid gap-6 text-left', COLS[d.columns] || COLS[3])}>
        {shown.map((it, i) => <div key={`${it.title}-${i}`} className="animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}><Card it={it} SubIcon={SubIcon} /></div>)}
      </div>
    </>
  );
}

/* ------------------------------ Schedule ------------------------------ */
export function ScheduleTabs({ d }) {
  const days = d.days || [];
  const [i, setI] = useState(0);
  const sessions = days[i]?.sessions || [];
  const HostIcon = ICONS[d.hostIcon] || User;
  const PlaceIcon = ICONS[d.locationIcon] || Clock;
  return (
    <div className="text-left">
      <div className="-mx-5 mb-8 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:mx-0 sm:justify-center sm:px-0">
        {days.map((day, n) => (
          <button key={n} onClick={() => setI(n)} className={cn('shrink-0 rounded-full px-5 py-2.5 text-sm font-bold transition', n === i ? 'bg-primary text-white shadow-glow' : 'bg-fg/5 text-fg/60 hover:bg-fg/10 hover:text-fg')}>{day.label}</button>
        ))}
      </div>
      <div key={i} className="divide-y divide-fg/10 overflow-hidden rounded-theme-lg border border-fg/10 bg-bg">
        {sessions.length === 0 && <p className="p-8 text-center text-fg/50">Nothing scheduled — enjoy the day off.</p>}
        {sessions.map((s, n) => (
          <div key={n} className="group grid animate-fade-up items-center gap-3 p-5 transition hover:bg-fg/[.03] sm:grid-cols-[110px_1fr_auto] sm:gap-6 sm:p-6" style={{ animationDelay: `${n * 50}ms` }}>
            <div className="font-heading text-2xl font-extrabold tabular-nums text-fg">{s.time}</div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-heading text-lg font-bold text-fg">{s.title}</h3>
                {s.tag && <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-primary">{s.tag}</span>}
              </div>
              <div className="mt-1 flex flex-wrap gap-x-5 gap-y-1 text-sm text-fg/55">
                {s.host && <span className="flex items-center gap-1.5"><HostIcon className="h-4 w-4" />{s.host}</span>}
                {s.location && <span className="flex items-center gap-1.5"><PlaceIcon className="h-4 w-4" />{s.location}</span>}
              </div>
            </div>
            {d.buttonLabel && <Link href={d.buttonUrl || '#'} className="btn-site-ghost w-full !py-2.5 transition group-hover:border-primary group-hover:bg-primary group-hover:text-white sm:w-auto">{d.buttonLabel}</Link>}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------ Donation ------------------------------ */
const money = (n) => Number(n || 0).toLocaleString('en-US');

export function DonationWidget({ d }) {
  const router = useRouter();
  const amounts = (d.amounts || []).filter(Boolean);
  const [amount, setAmount] = useState(amounts[1] || amounts[0] || '50');
  const [custom, setCustom] = useState('');
  const [monthly, setMonthly] = useState(false);
  const [bar, setBar] = useState(0);
  const goal = Number(d.goal) || 0;
  const pct = goal ? Math.min(100, Math.round(((Number(d.raised) || 0) / goal) * 100)) : 0;
  useEffect(() => { const t = setTimeout(() => setBar(pct), 200); return () => clearTimeout(t); }, [pct]);
  const value = custom || amount;
  const impact = (d.impact || []).find((x) => String(x.amount) === String(value));
  const cur = d.currency || '$';
  const give = () => {
    const params = new URLSearchParams({ amount: value, frequency: monthly ? 'monthly' : 'once' });
    router.push(`${d.url || '/contact'}?${params}`);
  };

  return (
    <div className="rounded-theme-lg border border-fg/10 bg-bg p-6 text-left shadow-2xl shadow-black/5 sm:p-8">
      {goal > 0 && (
        <div className="mb-7">
          <div className="flex items-end justify-between gap-4">
            <div><span className="font-heading text-3xl font-extrabold text-fg">{cur}{money(d.raised)}</span><span className="ml-1.5 text-sm text-fg/55">raised of {cur}{money(goal)}</span></div>
            <span className="font-heading text-lg font-bold text-primary">{pct}%</span>
          </div>
          <div className="mt-3 h-3 overflow-hidden rounded-full bg-fg/10"><div className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-[width] duration-[1600ms] ease-out" style={{ width: `${bar}%` }} /></div>
          {d.supporters > 0 && <p className="mt-2 text-sm text-fg/55"><b className="text-fg">{money(d.supporters)}</b> supporters so far</p>}
        </div>
      )}
      {d.monthly && (
        <div className="mb-5 grid grid-cols-2 gap-1 rounded-theme bg-fg/5 p-1">
          {[[false, 'Give once'], [true, 'Monthly']].map(([v, label]) => (
            <button key={label} type="button" onClick={() => setMonthly(v)} className={cn('flex items-center justify-center gap-1.5 rounded-[calc(var(--radius)*0.8)] py-2.5 text-sm font-bold transition', monthly === v ? 'bg-bg text-fg shadow' : 'text-fg/55 hover:text-fg')}>{v && <Heart className="h-3.5 w-3.5 text-primary" />}{label}</button>
          ))}
        </div>
      )}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {amounts.map((a) => (
          <button key={a} type="button" onClick={() => { setAmount(a); setCustom(''); }} className={cn('rounded-theme border-2 py-3 font-heading text-lg font-bold transition', !custom && amount === a ? 'border-primary bg-primary text-white shadow-glow' : 'border-fg/10 text-fg hover:border-primary/50')}>{cur}{a}</button>
        ))}
      </div>
      <label className="mt-2 flex items-center gap-2 rounded-theme border-2 border-fg/10 px-4 focus-within:border-primary">
        <span className="font-heading font-bold text-fg/50">{cur}</span>
        <input inputMode="numeric" value={custom} onChange={(e) => setCustom(e.target.value.replace(/[^\d]/g, ''))} placeholder="Other amount" className="w-full bg-transparent py-3 font-semibold text-fg outline-none placeholder:text-fg/40" />
      </label>
      <div className={cn('grid transition-all duration-500', impact ? 'mt-5 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0')}>
        <div className="overflow-hidden">
          <div className="flex items-start gap-3 rounded-theme bg-primary/10 p-4 text-sm text-fg/80"><Heart className="mt-0.5 h-4 w-4 shrink-0 fill-primary text-primary" /><span><b className="text-fg">{cur}{value}{monthly ? '/month' : ''}</b> — {impact?.text}</span></div>
        </div>
      </div>
      <button onClick={give} disabled={!value} className="btn-site-primary mt-5 w-full !py-4 text-base">{d.buttonLabel || 'Donate'} {cur}{value}{monthly ? ' / month' : ''}<ArrowRight className="h-4 w-4" /></button>
      <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-fg/45"><Check className="h-3.5 w-3.5" />Secure payment · Cancel monthly gifts anytime</p>
    </div>
  );
}

/* ------------------------------ Appointment ------------------------------ */
const toMin = (t) => { const [h, m] = String(t).split(':').map(Number); return (h || 0) * 60 + (m || 0); };
const fmt = (m) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;

export function AppointmentForm({ d }) {
  const services = (d.services || []).filter(Boolean);
  const step = Math.max(10, Number(d.interval) || 30);
  const slots = [];
  for (let m = toMin(d.firstSlot || '09:00'); m <= toMin(d.lastSlot || '17:00') && slots.length < 48; m += step) slots.push(fmt(m));
  const [form, setForm] = useState({ service: services[0] || '', date: '', time: '', name: '', email: '', phone: '', notes: '' });
  const [state, setState] = useState({ status: 'idle' });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const label = 'mb-1.5 block text-xs font-bold uppercase tracking-wider text-fg/50';

  const submit = async (e) => {
    e.preventDefault();
    if (!form.time) { setState({ status: 'error', message: 'Please choose a time.' }); return; }
    setState({ status: 'loading' });
    try {
      const res = await fetch(`${API_URL}/api/public/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name, email: form.email, phone: form.phone,
          subject: `Appointment request — ${form.service || 'General'}, ${form.date} at ${form.time}`,
          message: `Appointment request\n${d.serviceLabel || 'Service'}: ${form.service || '—'}\nDate: ${form.date}\nTime: ${form.time}\n\nNotes: ${form.notes || '—'}`,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Could not send your request');
      setState({ status: 'done' });
    } catch (err) {
      setState({ status: 'error', message: err.message });
    }
  };

  if (state.status === 'done') {
    return (
      <div className="flex animate-scale-in flex-col items-center rounded-theme-lg border border-fg/10 bg-bg p-10 text-center shadow-2xl shadow-black/5">
        <div className="mb-5 grid h-16 w-16 place-items-center rounded-full bg-emerald-500/15 text-emerald-500"><CalendarCheck className="h-8 w-8" /></div>
        <h3 className="font-heading text-2xl font-bold text-fg">Request received!</h3>
        <p className="mt-2 max-w-sm text-fg/60">{form.service} on {form.date} at {form.time}. We’ll confirm by email shortly.</p>
        <button onClick={() => setState({ status: 'idle' })} className="btn-site-ghost mt-6">Book another</button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-5 rounded-theme-lg border border-fg/10 bg-bg p-6 text-left shadow-2xl shadow-black/5 sm:grid-cols-2 sm:p-8">
      {services.length > 0 && (
        <label className="sm:col-span-2"><span className={label}>{d.serviceLabel || 'Service'}</span>
          <select className="site-input" value={form.service} onChange={set('service')}>{services.map((s) => <option key={s}>{s}</option>)}</select>
        </label>
      )}
      <label className="sm:col-span-2"><span className={label}>Date</span><input required type="date" min={new Date().toISOString().slice(0, 10)} className="site-input" value={form.date} onChange={set('date')} /></label>
      <div className="sm:col-span-2">
        <span className={label}>Time</span>
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
          {slots.map((t) => (
            <button key={t} type="button" onClick={() => setForm((f) => ({ ...f, time: t }))} className={cn('rounded-theme border py-2 text-sm font-semibold tabular-nums transition', form.time === t ? 'border-primary bg-primary text-white' : 'border-fg/10 text-fg/75 hover:border-primary/50 hover:text-fg')}>{t}</button>
          ))}
        </div>
      </div>
      <input required className="site-input" placeholder="Full name *" value={form.name} onChange={set('name')} />
      <input required type="email" className="site-input" placeholder="Email *" value={form.email} onChange={set('email')} />
      <input className="site-input sm:col-span-2" placeholder="Phone" value={form.phone} onChange={set('phone')} />
      <textarea className="site-input min-h-[90px] sm:col-span-2" placeholder="Anything we should know?" value={form.notes} onChange={set('notes')} />
      {state.status === 'error' && <p className="text-sm text-rose-500 sm:col-span-2">{state.message}</p>}
      <button disabled={state.status === 'loading'} className="btn-site-primary !py-4 sm:col-span-2">
        {state.status === 'loading' ? <Loader2 className="h-4 w-4 animate-spin" /> : <CalendarCheck className="h-4 w-4" />}Request appointment
      </button>
    </form>
  );
}
