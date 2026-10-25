'use client';

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Battery, ChevronDown, ChevronRight, FileCode2, FileJson, FileText, Folder, FolderOpen, Github, Linkedin, Mail, Minus, ScrollText, Square, Terminal as TermIcon, Wifi, X } from 'lucide-react';
import { API_URL } from '@/lib/api';
import { cn } from '@/lib/utils';

/*
 * A working, animated terminal for the "Terminal" portfolio: a boot sequence, commands that type themselves when
 * clicked, a spinner before each output, output that streams in line by line and progress-bar skills. macOS /
 * Ubuntu / Dracula / Matrix themes, a desktop with a dock, a file-tree sidebar, Tab completion, history and an
 * in-terminal contact form. All content comes from the block's data (see TermBlocks.js).
 */

const THEMES = {
  macos: {
    label: 'macOS', chrome: 'mac', bg: 'rgba(24,24,27,0.84)', bar: 'rgba(48,48,52,0.9)', side: 'rgba(36,36,40,0.62)', border: 'rgba(255,255,255,0.12)',
    fg: '#e7e7ea', dim: '#8d8d96', user: '#5af78e', path: '#57c7ff', accent: '#ff6ac1', warn: '#f3f99d', err: '#ff5c57', sel: 'rgba(87,199,255,0.28)',
    wall: 'linear-gradient(135deg, #1b1340, #0b1838)', blobs: ['#ff7a59', '#7b5cff', '#1fb6ff'],
  },
  ubuntu: {
    label: 'Ubuntu', chrome: 'gnome', bg: 'rgba(48,10,36,0.96)', bar: '#2b2b2b', side: 'rgba(28,6,21,0.85)', border: 'rgba(255,255,255,0.08)',
    fg: '#ffffff', dim: '#b58bb0', user: '#8ae234', path: '#729fcf', accent: '#e95420', warn: '#fce94f', err: '#ef2929', sel: 'rgba(233,84,32,0.35)',
    wall: 'linear-gradient(135deg, #2c001e, #5e2750 60%, #2c001e)', blobs: ['#e95420', '#9b2c86', '#f99b11'],
  },
  dracula: {
    label: 'Dracula', chrome: 'mac', bg: 'rgba(40,42,54,0.92)', bar: 'rgba(33,34,44,0.95)', side: 'rgba(33,34,44,0.75)', border: 'rgba(189,147,249,0.18)',
    fg: '#f8f8f2', dim: '#7c83a8', user: '#50fa7b', path: '#bd93f9', accent: '#ff79c6', warn: '#f1fa8c', err: '#ff5555', sel: 'rgba(189,147,249,0.3)',
    wall: 'linear-gradient(135deg, #191a21, #44275a)', blobs: ['#ff79c6', '#8be9fd', '#bd93f9'],
  },
  matrix: {
    label: 'Matrix', chrome: 'gnome', bg: 'rgba(0,8,2,0.9)', bar: '#020c04', side: 'rgba(0,14,4,0.85)', border: 'rgba(0,255,102,0.16)',
    fg: '#b6ffcc', dim: '#3f9a5b', user: '#00ff66', path: '#00d1ff', accent: '#00ff66', warn: '#d4ff4f', err: '#ff4d4d', sel: 'rgba(0,255,102,0.25)',
    wall: '#000', blobs: [], rain: true,
  },
};

// Commands that "work" for a moment before printing, with the spinner label shown meanwhile.
const SPIN = {
  about: 'reading about.md', whoami: 'reading about.md', skills: 'parsing skills.json', projects: 'scanning ~/portfolio/projects', experience: 'git log --decorate',
  work: 'git log --decorate', git: 'git log --decorate', education: 'reading education.log', contact: 'sourcing contact.sh', neofetch: 'collecting system info',
  cat: 'reading file', social: 'resolving links',
};
const BOOT = ['Started portfolio.service — personal site daemon', 'Mounted /home/~/projects', 'Loaded skills.json (4 groups)', 'Reached target Developer Mode'];
const SPINNER = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

const slug = (s = '') => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const hash7 = (s = '') => {
  let h = 2166136261;
  for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); }
  return (h >>> 0).toString(16).padStart(8, '0').slice(0, 7);
};
const ext = (url = '') => /^(https?:|mailto:|tel:)/.test(url) || /\.\w{2,5}([?#].*)?$/.test(url);
const SECTION_HASHES = { about: 'about', skills: 'skills', experience: 'git log', projects: 'projects', education: 'education', contact: 'contact', home: null };
const reducedMotion = () => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/* ------------------------------ Animated pieces ------------------------------ */

// Streams an output in: every leaf line fades and slides in, one after another.
function Reveal({ children }) {
  const ref = useRef();
  useIsoLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    const leaves = [...root.querySelectorAll('div, p')].filter((el) => !el.querySelector('div, p'));
    (leaves.length ? leaves : [root]).forEach((el, i) => {
      el.style.animation = 'term-line .32s cubic-bezier(.2,.7,.2,1) backwards';
      el.style.animationDelay = `${Math.min(i, 60) * 32}ms`;
    });
  }, []);
  return <div ref={ref}>{children}</div>;
}

function Spinner({ label }) {
  const [f, setF] = useState(0);
  useEffect(() => { const t = setInterval(() => setF((x) => x + 1), 80); return () => clearInterval(t); }, []);
  return <span style={{ color: 'var(--t-dim)' }}><span style={{ color: 'var(--t-accent)' }}>{SPINNER[f % SPINNER.length]}</span> {label}…</span>;
}

// A progress bar that fills up to the skill level.
function Bar({ level }) {
  const n = Math.round(level / 5);
  const [shown, setShown] = useState(0);
  useEffect(() => {
    if (reducedMotion()) { setShown(n); return undefined; }
    let i = 0;
    const t = setInterval(() => { i += 1; setShown(Math.min(i, n)); if (i >= n) clearInterval(t); }, 28);
    return () => clearInterval(t);
  }, [n]);
  // Real segments instead of █░ glyphs, which many fonts draw at uneven widths.
  return (
    <>
      <span className="flex gap-[2px]">
        {Array.from({ length: 20 }, (_, i) => (
          <span key={i} className="h-[0.85em] w-[0.42em] rounded-[1px] transition-colors duration-150 sm:w-[0.55em]"
            style={{ background: i < shown ? 'var(--t-user)' : 'var(--t-sel)', boxShadow: i === shown - 1 ? '0 0 8px var(--t-user)' : undefined }} />
        ))}
      </span>
      <span className="text-right tabular-nums" style={{ color: 'var(--t-warn)' }}>{Math.round((shown / 20) * 100)}%</span>
    </>
  );
}

// Falling glyphs behind the Matrix theme.
function MatrixRain() {
  const ref = useRef();
  useEffect(() => {
    if (reducedMotion()) return undefined;
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    const glyphs = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789<>/{}=+*';
    let drops = [];
    let raf;
    let last = 0;
    const size = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      drops = Array.from({ length: Math.ceil(canvas.width / 16) }, () => Math.random() * -50);
    };
    const draw = (time) => {
      raf = requestAnimationFrame(draw);
      if (time - last < 55) return;
      last = time;
      ctx.fillStyle = 'rgba(0,0,0,0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = '15px monospace';
      drops.forEach((y, i) => {
        ctx.fillStyle = Math.random() > 0.96 ? '#d4ffe0' : '#00ff66';
        ctx.fillText(glyphs[Math.floor(Math.random() * glyphs.length)], i * 16, y * 16);
        drops[i] = y * 16 > canvas.height && Math.random() > 0.975 ? 0 : y + 1;
      });
    };
    size();
    raf = requestAnimationFrame(draw);
    window.addEventListener('resize', size);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', size); };
  }, []);
  return <canvas ref={ref} aria-hidden className="absolute inset-0 h-full w-full opacity-60" />;
}

/* ------------------------------ Output helpers ------------------------------ */

const C = ({ c, b, children }) => <span style={{ color: `var(--t-${c})` }} className={b ? 'font-bold' : undefined}>{children}</span>;

function A({ href, children }) {
  return <a href={href} target={/^(mailto:|tel:)/.test(href) ? undefined : '_blank'} rel="noreferrer" className="underline decoration-dotted underline-offset-4 hover:decoration-solid" style={{ color: 'var(--t-path)' }}>{children}</a>;
}

/* ------------------------------ Terminal ------------------------------ */

export default function Terminal({ d }) {
  const user = d.user || 'guest';
  const host = d.host || 'portfolio';
  const projects = useMemo(() => (d.projects || []).filter((p) => p.title).map((p) => ({ ...p, file: `${slug(p.title)}.md` })), [d.projects]);
  const socials = (d.socials || []).filter((s) => s.url);
  const [theme, setTheme] = useState(THEMES[d.theme] ? d.theme : 'macos');
  const t = THEMES[theme];
  const [cwd, setCwd] = useState('~');
  const [input, setInput] = useState('');
  const [past, setPast] = useState([]);
  const [cursor, setCursor] = useState(-1);
  const [flow, setFlow] = useState(null); // in-terminal contact form: { step, data }
  const [win, setWin] = useState({ open: true, max: false });
  const [treeOpen, setTreeOpen] = useState(true);
  const [activeFile, setActiveFile] = useState('');
  const [clock, setClock] = useState('');
  const [booting, setBooting] = useState(true);
  const [typing, setTyping] = useState(false);
  const [entries, setEntries] = useState([]);
  const idRef = useRef(1);
  const inputRef = useRef();
  const scrollRef = useRef();
  const rootRef = useRef();
  const runRef = useRef();
  const typeRef = useRef();
  const timers = useRef([]);
  const bootAlive = useRef(false);

  const later = (fn, ms) => { const id = setTimeout(fn, ms); timers.current.push(id); return id; };
  const sleep = (ms) => new Promise((r) => later(r, ms));
  const push = (...items) => {
    const made = items.map((it) => ({ id: idRef.current++, ...it }));
    setEntries((e) => [...e, ...made]);
    return made;
  };
  const setEntry = (id, patch) => setEntries((e) => e.map((x) => (x.id === id ? { ...x, ...patch } : x)));

  const FILES = useMemo(() => ({
    'about.md': 'about', 'skills.json': 'skills', 'experience.log': 'git log', 'education.log': 'education', 'contact.sh': 'contact', ...(d.resumeUrl ? { 'resume.pdf': 'resume' } : {}),
  }), [d.resumeUrl]);
  const PATHS = useMemo(() => [...Object.keys(FILES), 'projects/', ...projects.map((p) => `projects/${p.file}`)], [FILES, projects]);

  // Clickable command: types itself into the prompt, then runs.
  const Cmd = ({ children, cmd }) => (
    <button type="button" onClick={() => typeRef.current(cmd || String(children))} className="rounded px-0.5 underline decoration-dotted underline-offset-4 transition hover:bg-[var(--t-sel)] hover:decoration-solid" style={{ color: 'var(--t-warn)' }}>{children}</button>
  );

  /* ---- outputs ---- */
  const Neofetch = () => {
    const info = (d.info || []).filter((r) => r.label && r.value);
    return (
      <div className="flex flex-col gap-x-8 gap-y-3 sm:flex-row">
        {/* System monospace fonts carry the box-drawing glyphs that web fonts often subset away. */}
        {d.ascii && <div className="shrink-0 overflow-hidden text-[11px] leading-[1.05] tracking-normal sm:text-[14px]" style={{ color: 'var(--t-user)', fontFamily: 'Consolas, "Cascadia Mono", Menlo, "DejaVu Sans Mono", "Liberation Mono", monospace' }}>{d.ascii.split('\n').map((l, i) => <div key={i} className="whitespace-pre">{l}</div>)}</div>}
        <div className="min-w-0">
          <div><C c="user" b>{user}</C><C c="dim">@</C><C c="user" b>{host}</C></div>
          <div style={{ color: 'var(--t-dim)' }}>{'-'.repeat(Math.min(28, user.length + host.length + 1))}</div>
          {d.name && <div><C c="path" b>Name</C>: {d.name}</div>}
          {d.role && <div><C c="path" b>Role</C>: {d.role}</div>}
          {info.map((r, i) => <div key={i} className="break-words"><C c="path" b>{r.label}</C>: {r.value}</div>)}
          <div className="mt-2 flex">{['#000000', 'var(--t-err)', 'var(--t-user)', 'var(--t-warn)', 'var(--t-path)', 'var(--t-accent)', '#00d1d1', 'var(--t-fg)'].map((c, i) => <span key={i} className="h-3.5 w-6" style={{ background: c }} />)}</div>
        </div>
      </div>
    );
  };

  const Help = () => {
    const rows = [
      ['about', 'who I am'], ['skills', 'the tech I work with'], ['projects', 'things I’ve built'], ['git log', 'work history'], ['education', 'where I studied'],
      ['contact', 'how to reach me'], ['message', 'send me a message right here'], ...(d.resumeUrl ? [['resume', 'open my résumé']] : []), ['social', 'find me online'], ['neofetch', 'system info'],
    ];
    const tools = [['ls', 'list files'], ['cd <dir>', 'change directory'], ['cat <file>', 'print a file'], ['open <name>', 'open a project / link'], ['theme <name>', Object.keys(THEMES).join(' | ')], ['history', 'commands you ran'], ['clear', 'clear the screen (Ctrl+L)']];
    const Row = ([c, desc]) => <div key={c} className="grid grid-cols-[8.5rem_1fr] gap-2 sm:grid-cols-[10rem_1fr]"><span><Cmd cmd={c.split(' <')[0]}>{c}</Cmd></span><C c="dim">{desc}</C></div>;
    return (
      <div className="space-y-3">
        <div><C c="dim">Explore by typing a command or clicking one.</C></div>
        <div>{rows.map(Row)}</div>
        <div><div><C c="accent" b>built-ins</C></div>{tools.map(Row)}</div>
        <div><C c="dim">Tip: <C c="fg">Tab</C> completes, <C c="fg">↑ ↓</C> walk history.</C></div>
      </div>
    );
  };

  const About = () => {
    const paragraphs = String(d.about || '').split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
    const facts = (d.facts || []).filter((f) => f.value);
    return (
      <div className="space-y-2.5">
        <div><C c="dim">#</C> <C c="accent" b>{d.name}</C></div>
        {paragraphs.map((p, i) => <p key={i} className="max-w-3xl">{p}</p>)}
        {facts.length > 0 && <div className="pt-1">{facts.map((f, i) => <div key={i}><C c="dim">- </C><C c="path" b>{f.label}:</C> {f.value}</div>)}</div>}
        <div className="pt-1"><C c="dim">next → </C><Cmd>skills</Cmd> <Cmd>projects</Cmd> <Cmd>git log</Cmd></div>
      </div>
    );
  };

  const Skills = () => (
    <div className="space-y-3">
      <div><C c="dim">{'{'}</C></div>
      {(d.skills || []).filter((g) => g.title).map((g, i) => (
        <div key={i} className="pl-4">
          <div><C c="path">&quot;{g.title}&quot;</C><C c="dim">: [</C></div>
          {(g.items || []).filter((s) => s.label).map((s, j) => (
            <div key={j} className="grid grid-cols-[minmax(0,8rem)_auto_2.75rem] items-center justify-start gap-x-3 pl-4 sm:grid-cols-[13rem_auto_3.25rem] sm:gap-x-4">
              <span className="truncate">{s.label}</span>
              <Bar level={Math.max(0, Math.min(100, Number(s.level) || 0))} />
            </div>
          ))}
          <div><C c="dim">]</C></div>
        </div>
      ))}
      <div><C c="dim">{'}'}</C></div>
    </div>
  );

  const Projects = () => (
    <div>
      <div className="hidden grid-cols-[2.5rem_minmax(0,1fr)_12rem_7rem] gap-3 sm:grid" style={{ color: 'var(--t-dim)' }}><span>#</span><span>NAME</span><span>TYPE</span><span>LINKS</span></div>
      {projects.map((p, i) => (
        <div key={p.file} className="grid grid-cols-[2rem_minmax(0,1fr)] gap-x-3 py-0.5 sm:grid-cols-[2.5rem_minmax(0,1fr)_12rem_7rem]">
          <C c="dim">{String(i + 1).padStart(2, '0')}</C>
          <span className="truncate"><Cmd cmd={`cat projects/${p.file}`}>{p.title}</Cmd></span>
          <span className="col-start-2 truncate sm:col-start-auto" style={{ color: 'var(--t-dim)' }}>{p.category}</span>
          <span className="col-start-2 space-x-2 sm:col-start-auto">{p.live && <A href={p.live}>live</A>}{p.code && <A href={p.code}>code</A>}</span>
        </div>
      ))}
      <div className="mt-2"><C c="dim">click a name or run </C><C c="fg">cat projects/&lt;name&gt;.md</C><C c="dim"> · </C><C c="fg">open &lt;#&gt;</C></div>
    </div>
  );

  const Project = ({ p }) => (
    <div className="space-y-2">
      <div><C c="dim">#</C> <C c="accent" b>{p.title}</C></div>
      <div style={{ color: 'var(--t-dim)' }}>{[p.category, p.year].filter(Boolean).join(' · ')}</div>
      {p.summary && <p className="max-w-3xl">{p.summary}</p>}
      {p.stack?.length > 0 && <div className="flex flex-wrap gap-x-2 gap-y-1">{p.stack.map((s) => <span key={s} className="rounded px-1.5" style={{ background: 'var(--t-sel)' }}>{s}</span>)}</div>}
      <div className="space-x-4">{p.live && <A href={p.live}>↗ {p.live.replace(/^https?:\/\//, '').replace(/\/$/, '')}</A>}{p.code && <A href={p.code}>⌥ source</A>}</div>
    </div>
  );

  const GitLog = () => (
    <div className="space-y-4">
      {(d.experience || []).filter((e) => e.title).map((e, i) => (
        <div key={i}>
          <div><C c="warn">commit {hash7(`${e.title}${e.org}`)}{hash7(e.period || '')}</C>{i === 0 && <> <C c="warn">(</C><C c="path" b>HEAD -&gt; </C><C c="user" b>main</C><C c="warn">)</C></>}</div>
          <div>Author: {e.org}{e.location && <C c="dim"> &lt;{e.location}&gt;</C>}</div>
          <div>Date:   {e.period}</div>
          <div className="mt-1.5 pl-6 sm:pl-8"><C c="fg" b>{e.title}</C></div>
          {(e.bullets || []).map((b, j) => <div key={j} className="pl-6 sm:pl-8"><C c="dim">- </C>{b}</div>)}
        </div>
      ))}
      <div><C c="dim">(END) · see also </C><Cmd>education</Cmd></div>
    </div>
  );

  const Education = () => (
    <div className="space-y-2">
      {(d.education || []).filter((e) => e.title).map((e, i) => (
        <div key={i}>
          <div><C c="user">●</C> <C c="fg" b>{e.title}</C></div>
          <div className="pl-5"><C c="path">{e.org}</C>{e.period && <C c="dim"> · {e.period}</C>}</div>
        </div>
      ))}
    </div>
  );

  const Contact = () => (
    <div className="space-y-1">
      <div><C c="dim">#!/bin/sh</C></div>
      {d.email && <div><C c="accent">EMAIL</C>=<A href={`mailto:${d.email}`}>{d.email}</A></div>}
      {d.phone && <div><C c="accent">PHONE</C>=<A href={`tel:${d.phone}`}>{d.phone}</A></div>}
      {d.location && <div><C c="accent">LOCATION</C>=&quot;{d.location}&quot;</div>}
      {socials.map((s, i) => <div key={i}><C c="accent">{(s.label || s.icon).toUpperCase()}</C>=<A href={s.url}>{s.url.replace(/^(https?:\/\/|mailto:)/, '')}</A></div>)}
      <div className="pt-2"><C c="dim">or just run </C><Cmd>message</Cmd><C c="dim"> to write to me from here.</C></div>
    </div>
  );

  const Social = () => (
    <div>{socials.map((s, i) => <div key={i} className="grid grid-cols-[7rem_1fr] gap-2"><C c="path" b>{s.label || s.icon}</C><A href={s.url}>{s.url.replace(/^(https?:\/\/|mailto:)/, '')}</A></div>)}</div>
  );

  const Ls = ({ dir }) => (
    <div className="flex flex-wrap gap-x-6 gap-y-1">
      {dir === 'projects'
        ? projects.map((p) => <Cmd key={p.file} cmd={`cat projects/${p.file}`}>{p.file}</Cmd>)
        : <>
          <button type="button" onClick={() => typeRef.current('cd projects')} className="font-bold hover:underline" style={{ color: 'var(--t-path)' }}>projects/</button>
          {Object.keys(FILES).map((f) => <Cmd key={f} cmd={f === 'resume.pdf' ? 'resume' : `cat ${f}`}>{f}</Cmd>)}
        </>}
    </div>
  );

  const BootLine = ({ text }) => <div><C c="dim">[</C><C c="user" b>  OK  </C><C c="dim">]</C> {text}</div>;
  const Hint = () => (
    <div>
      {d.welcome && <div className="mb-1.5"><C c="fg">{d.welcome}</C></div>}
      <div><C c="dim">Type </C><Cmd>help</Cmd><C c="dim"> or try </C><Cmd>about</Cmd> <Cmd>projects</Cmd> <Cmd>skills</Cmd> <Cmd>contact</Cmd></div>
    </div>
  );

  /* ---- contact form inside the terminal ---- */
  const STEPS = [
    { key: 'name', q: 'Your name', check: (v) => v.length >= 2 || 'Please enter at least 2 characters.' },
    { key: 'email', q: 'Your email', check: (v) => /^\S+@\S+\.\S+$/.test(v) || 'That doesn’t look like an email address.' },
    { key: 'subject', q: 'Subject (optional, Enter to skip)', check: () => true },
    { key: 'message', q: 'Message', check: (v) => v.length >= 2 || 'Please write a short message.' },
    { key: 'confirm', q: 'Send it? (y/n)', check: (v) => /^(y|yes|n|no)$/i.test(v) || 'Please answer y or n.' },
  ];
  const answer = async (value) => {
    const step = STEPS[flow.step];
    const v = value.trim();
    push({ echo: <><C c="accent">?</C> <C c="fg" b>{step.q}:</C> {step.key === 'subject' && !v ? <C c="dim">(skipped)</C> : v}</> });
    const ok = step.check(v);
    if (ok !== true) { push({ out: <C c="err">✗ {ok}</C> }); return; }
    const data = { ...flow.data, [step.key]: v };
    if (step.key !== 'confirm') { setFlow({ step: flow.step + 1, data }); return; }
    setFlow(null);
    if (/^n/i.test(v)) { push({ out: <C c="dim">Cancelled — nothing was sent.</C> }); return; }
    const [entry] = push({ pending: 'sending message' });
    try {
      const res = await fetch(`${API_URL}/api/public/contact`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: data.name, email: data.email, subject: data.subject || null, message: data.message, website: '' }) });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.message || 'Something went wrong');
      setEntry(entry.id, { pending: null, out: <C c="user">✓ {body.message || 'Message sent!'} I’ll get back to you soon.</C> });
    } catch (err) {
      setEntry(entry.id, { pending: null, out: <><C c="err">✗ {err.message}</C>{d.email && <> — <C c="dim">you can also email </C><A href={`mailto:${d.email}`}>{d.email}</A></>}</> });
    }
  };

  /* ---- command runner: exec returns what to print ---- */
  const resolve = (arg = '') => {
    let p = arg.replace(/^~\//, '').replace(/^\.\//, '');
    if (p.startsWith('../')) p = p.slice(3);
    if (cwd === '~/projects' && !p.startsWith('projects') && !FILES[p]) p = `projects/${p}`;
    return p;
  };
  const openTarget = (arg) => {
    const a = arg.toLowerCase();
    const n = Number(a);
    const proj = (n && projects[n - 1]) || projects.find((p) => slug(p.title) === slug(a) || p.file === a || p.file === a.replace(/^projects\//, ''));
    const social = socials.find((s) => (s.label || s.icon).toLowerCase() === a);
    const url = proj ? proj.live || proj.code : social ? social.url : a === 'resume' ? d.resumeUrl : /^https?:\/\//.test(arg) ? arg : '';
    return { url, label: proj?.title || social?.label || arg };
  };

  const exec = (raw) => {
    const [cmd0, ...args] = raw.trim().split(/\s+/);
    const cmd = (cmd0 || '').toLowerCase();
    const arg = args.join(' ');
    switch (cmd) {
      case '': return null;
      case 'help': case 'man': case '?': return <Help />;
      case 'about': case 'whoami': setActiveFile('about.md'); return <About />;
      case 'skills': setActiveFile('skills.json'); return <Skills />;
      case 'projects': setActiveFile('projects/'); return <Projects />;
      case 'experience': case 'work': setActiveFile('experience.log'); return <GitLog />;
      case 'git': if (!arg.startsWith('log')) return <C c="dim">git: try <Cmd>git log</Cmd></C>; setActiveFile('experience.log'); return <GitLog />;
      case 'education': setActiveFile('education.log'); return <Education />;
      case 'contact': setActiveFile('contact.sh'); return <Contact />;
      case 'social': case 'socials': return <Social />;
      case 'neofetch': case 'fastfetch': return <Neofetch />;
      case 'message': case 'mail': case 'hire': case 'hire-me':
        setFlow({ step: 0, data: {} });
        return <C c="dim">Let’s write a message. Press <C c="fg">Ctrl+C</C> to cancel at any time.</C>;
      case 'resume': case 'cv':
        if (!d.resumeUrl) return <C c="err">resume: not found</C>;
        window.open(d.resumeUrl, '_blank', 'noopener');
        return <><C c="user">✓</C> opening <A href={d.resumeUrl}>resume.pdf</A>…</>;
      case 'ls': case 'll': case 'dir': {
        const p = resolve(arg).replace(/\/$/, '');
        return <Ls dir={p === 'projects' || (cwd === '~/projects' && !arg) ? 'projects' : ''} />;
      }
      case 'cd': {
        const p = arg.replace(/\/$/, '');
        if (!p || p === '~' || p === '..' || p === '/') { setCwd('~'); return null; }
        if (p === 'projects' || p === '~/projects') { setCwd('~/projects'); return null; }
        return <C c="err">cd: no such directory: {arg}</C>;
      }
      case 'pwd': return <span>/home/{user}{cwd.slice(1)}</span>;
      case 'cat': case 'less': case 'more': case 'bat': {
        if (!arg) return <C c="err">{cmd}: missing file — try <Cmd>ls</Cmd></C>;
        const p = resolve(arg);
        if (FILES[p]) return exec(FILES[p]);
        const proj = projects.find((x) => `projects/${x.file}` === p);
        if (proj) { setActiveFile(p); return <Project p={proj} />; }
        if (p.replace(/\/$/, '') === 'projects') return <C c="err">cat: projects: Is a directory</C>;
        return <C c="err">cat: {arg}: No such file or directory</C>;
      }
      case 'open': case 'xdg-open': {
        if (!arg) return <C c="err">open: what should I open? e.g. <Cmd>open 1</Cmd></C>;
        const { url, label } = openTarget(arg);
        if (!url) return <C c="err">open: {arg}: not found</C>;
        window.open(url, '_blank', 'noopener');
        return <><C c="user">✓</C> opening <A href={url}>{label}</A>…</>;
      }
      case 'theme': {
        if (THEMES[arg]) { setTheme(arg); try { localStorage.setItem('term-theme', arg); } catch { /* storage blocked */ } return <><C c="user">✓</C> theme set to {THEMES[arg].label}</>; }
        return <div>{Object.entries(THEMES).map(([k, v]) => <div key={k}><Cmd cmd={`theme ${k}`}>{k}</Cmd> <C c="dim">{v.label}{k === theme ? ' (current)' : ''}</C></div>)}</div>;
      }
      case 'history': return <div>{past.slice().reverse().map((h, i) => <div key={i}><C c="dim">{String(i + 1).padStart(4)}  </C>{h}</div>)}</div>;
      case 'date': return <span>{new Date().toString()}</span>;
      case 'echo': return <span>{arg}</span>;
      case 'clear': case 'cls': setEntries([]); return null;
      case 'exit': case 'logout': setWin({ open: false, max: false }); return null;
      case 'sudo': return <span>[sudo] password for {user}: <C c="err">nice try 😄</C> — you could <Cmd cmd="hire">hire me</Cmd> instead.</span>;
      case 'rm': return <C c="err">rm: permission denied — please don’t delete my portfolio 🙏</C>;
      case 'vim': case 'vi': case 'nano': case 'emacs': return <C c="dim">{cmd}: this is a read-only portfolio. (and yes, you can exit vim: :q)</C>;
      case 'ping': return <span>PING {arg || host}: 64 bytes — <C c="user">I’m online</C> and replying within 24h. Try <Cmd>message</Cmd>.</span>;
      default: {
        const guess = [...Object.values(FILES), 'help', 'projects', 'message', 'social', 'neofetch'].find((c) => c.startsWith(cmd.slice(0, 2)));
        return <span><C c="err">zsh: command not found: {cmd0}</C>{guess && <> — did you mean <Cmd>{guess}</Cmd>?</>}</span>;
      }
    }
  };

  // Prints the command line, then (after a short spinner for "heavy" commands) its output.
  const run = (raw, fast = false) => {
    if (!win.open) setWin((w) => ({ ...w, open: true }));
    if (flow) { setFlow(null); push({ out: <C c="dim">^C</C> }); }
    push({ cmd: raw, cwd });
    if (raw.trim()) setPast((p) => [raw, ...p.filter((x) => x !== raw)].slice(0, 50));
    setCursor(-1);
    const node = exec(raw);
    inputRef.current?.focus({ preventScroll: true });
    if (node == null) return;
    const label = SPIN[raw.trim().split(/\s+/)[0].toLowerCase()];
    if (!label || fast || reducedMotion()) { push({ out: node }); return; }
    const [entry] = push({ pending: label });
    later(() => setEntry(entry.id, { pending: null, out: node }), 380 + Math.round(Math.random() * 320));
  };
  runRef.current = run;

  // Types a command into the prompt one character at a time, then runs it.
  const typeOut = (cmd) => new Promise((done) => {
    setTyping(true);
    setInput('');
    [...cmd].forEach((_, i) => later(() => setInput(cmd.slice(0, i + 1)), 45 + i * (34 + (i % 3) * 8)));
    later(() => { setInput(''); setTyping(false); done(); }, 45 + cmd.length * 42 + 220);
  });
  const typeAndRun = async (cmd) => {
    if (typing) return;
    if (booting) skipBoot();
    if (reducedMotion()) { runRef.current(cmd); return; }
    await typeOut(cmd);
    runRef.current(cmd);
  };
  typeRef.current = typeAndRun;

  /* ---- boot ---- */
  const finalBoot = () => [
    ...BOOT.map((text) => ({ out: <BootLine text={text} /> })),
    { out: <div style={{ color: 'var(--t-dim)' }}>{d.motd || 'Last login on ttys001'}</div> },
    { cmd: 'neofetch', cwd: '~' }, { out: <Neofetch /> }, { out: <Hint /> },
  ];
  function skipBoot() {
    if (!bootAlive.current) return;
    bootAlive.current = false;
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setTyping(false);
    setInput('');
    setEntries(finalBoot().map((it) => ({ id: idRef.current++, ...it })));
    setBooting(false);
  }

  useEffect(() => {
    const hashKey = window.location.hash.slice(1);
    const afterBoot = () => {
      setBooting(false);
      if (SECTION_HASHES[hashKey]) { rootRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); typeRef.current(SECTION_HASHES[hashKey]); }
    };
    if (reducedMotion()) {
      setEntries(finalBoot().map((it) => ({ id: idRef.current++, ...it })));
      afterBoot();
      return undefined;
    }
    bootAlive.current = true;
    setEntries([]);
    (async () => {
      await sleep(650);
      for (const text of BOOT) {
        if (!bootAlive.current) return;
        push({ out: <BootLine text={text} /> });
        await sleep(170 + Math.round(Math.random() * 160));
      }
      if (!bootAlive.current) return;
      push({ out: <div style={{ color: 'var(--t-dim)' }}>{d.motd || 'Last login on ttys001'}</div> });
      await sleep(450);
      if (!bootAlive.current) return;
      await typeOut('neofetch');
      if (!bootAlive.current) return;
      push({ cmd: 'neofetch', cwd: '~' });
      const [p] = push({ pending: SPIN.neofetch });
      await sleep(600);
      if (!bootAlive.current) return;
      setEntry(p.id, { pending: null, out: <Neofetch /> });
      await sleep(900);
      if (!bootAlive.current) return;
      push({ out: <Hint /> });
      bootAlive.current = false;
      afterBoot();
    })();
    const tm = timers.current;
    return () => { bootAlive.current = false; tm.forEach(clearTimeout); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---- keyboard ---- */
  const complete = () => {
    const parts = input.split(' ');
    if (parts.length === 1) {
      const cmds = ['help', 'about', 'whoami', 'skills', 'projects', 'experience', 'education', 'contact', 'message', 'resume', 'social', 'neofetch', 'ls', 'cd', 'cat', 'open', 'theme', 'history', 'clear', 'git log', 'pwd', 'date', 'echo', 'exit'];
      const hits = cmds.filter((c) => c.startsWith(parts[0]));
      if (hits.length === 1) setInput(`${hits[0]} `);
      else if (hits.length > 1) push({ cmd: input, cwd }, { out: <div className="flex flex-wrap gap-x-5">{hits.map((h) => <span key={h}>{h}</span>)}</div> });
      return;
    }
    const last = parts.at(-1);
    const pool = parts[0] === 'theme' ? Object.keys(THEMES) : parts[0] === 'open' ? [...projects.map((_, i) => String(i + 1)), ...socials.map((s) => (s.label || s.icon).toLowerCase()), 'resume'] : cwd === '~/projects' ? projects.map((p) => p.file) : PATHS;
    const hits = pool.filter((p) => p.startsWith(last));
    if (hits.length === 1) setInput([...parts.slice(0, -1), hits[0]].join(' '));
    else if (hits.length > 1) push({ cmd: input, cwd }, { out: <div className="flex flex-wrap gap-x-5">{hits.map((h) => <span key={h}>{h}</span>)}</div> });
  };

  const onKey = (e) => {
    if (booting) { e.preventDefault(); skipBoot(); return; }
    if (typing) { e.preventDefault(); return; }
    if (e.key === 'Enter') {
      e.preventDefault();
      const v = input;
      setInput('');
      if (flow) answer(v); else run(v);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      if (!flow) complete();
    } else if (e.key === 'ArrowUp' && !flow) {
      e.preventDefault();
      const c = Math.min(past.length - 1, cursor + 1);
      if (past[c] != null) { setCursor(c); setInput(past[c]); }
    } else if (e.key === 'ArrowDown' && !flow) {
      e.preventDefault();
      const c = cursor - 1;
      setCursor(Math.max(-1, c));
      setInput(c < 0 ? '' : past[c]);
    } else if (e.key.toLowerCase() === 'l' && e.ctrlKey) {
      e.preventDefault();
      setEntries([]);
    } else if (e.key.toLowerCase() === 'c' && e.ctrlKey && !window.getSelection()?.toString()) {
      e.preventDefault();
      push({ cmd: `${input}^C`, cwd });
      setInput('');
      if (flow) { setFlow(null); push({ out: <C c="dim">Cancelled.</C> }); }
    }
  };

  /* ---- effects ---- */
  // Follow the output: long outputs scroll to their command line, short ones to the bottom.
  useEffect(() => {
    const box = scrollRef.current;
    if (!box) return;
    const last = [...box.querySelectorAll('[data-entry]')].at(-1);
    const top = last && last.offsetHeight > box.clientHeight * 0.8 ? last.offsetTop - 12 : box.scrollHeight;
    box.scrollTo({ top, behavior: reducedMotion() ? 'auto' : 'smooth' });
  }, [entries, flow]);

  useEffect(() => {
    try { const saved = localStorage.getItem('term-theme'); if (THEMES[saved]) setTheme(saved); } catch { /* storage blocked */ }
    if (window.matchMedia?.('(pointer: fine)').matches) inputRef.current?.focus({ preventScroll: true });
    const tick = () => setClock(new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date()));
    tick();
    const timer = setInterval(tick, 20000);
    // Header links like /#projects type and run the matching command.
    const onHash = () => {
      const key = window.location.hash.slice(1);
      if (!(key in SECTION_HASHES)) return;
      rootRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (SECTION_HASHES[key]) typeRef.current(SECTION_HASHES[key]);
    };
    window.addEventListener('hashchange', onHash);
    return () => { clearInterval(timer); window.removeEventListener('hashchange', onHash); };
  }, []);

  const onScreenClick = () => {
    if (booting) { skipBoot(); return; }
    if (!window.getSelection()?.toString()) inputRef.current?.focus({ preventScroll: true });
  };

  /* ---- render ---- */
  const vars = Object.fromEntries(['fg', 'dim', 'user', 'path', 'accent', 'warn', 'err', 'sel'].map((k) => [`--t-${k}`, t[k]]));
  const gnome = t.chrome === 'gnome';
  const Prompt = ({ at = cwd }) => (gnome
    ? <><C c="user" b>{user}@{host}</C><C c="fg">:</C><C c="path" b>{at}</C><C c="fg">$</C></>
    : <><C c="user" b>{user}@{host}</C> <C c="path" b>{at}</C> <C c="accent">%</C></>);
  const step = flow ? STEPS[flow.step] : null;
  const pickTheme = (k) => { setTheme(k); try { localStorage.setItem('term-theme', k); } catch { /* storage blocked */ } };

  const dockItems = [
    { icon: TermIcon, label: 'Terminal', onClick: () => setWin((w) => ({ ...w, open: true })), active: win.open },
    { icon: Folder, label: 'Projects', onClick: () => typeAndRun('projects') },
    { icon: Mail, label: 'Message me', onClick: () => typeAndRun('message') },
    ...(d.resumeUrl ? [{ icon: FileText, label: 'Résumé', href: d.resumeUrl }] : []),
    ...socials.filter((s) => /github|linkedin/i.test(s.icon)).map((s) => ({ icon: /github/i.test(s.icon) ? Github : Linkedin, label: s.label || s.icon, href: s.url })),
  ];
  const fileIcon = (f) => (f.endsWith('.json') ? FileJson : f.endsWith('.sh') ? FileCode2 : f.endsWith('.log') ? ScrollText : FileText);

  return (
    <div ref={rootRef} className="relative isolate flex min-h-[calc(100svh-4.5rem)] scroll-mt-16 flex-col overflow-hidden font-mono transition-[background] duration-700" style={{ ...vars, background: t.wall }}>
      {/* Wallpaper motion */}
      {t.rain ? <MatrixRain key="rain" /> : (
        <div aria-hidden className="pointer-events-none absolute inset-0">
          {t.blobs.map((c, i) => (
            <span key={`${theme}-${i}`} className="absolute h-[55vmax] w-[55vmax] rounded-full opacity-50 blur-[110px] transition-colors duration-700"
              style={{ background: c, left: ['-12%', '55%', '20%'][i], top: ['-18%', '-10%', '55%'][i], animation: `term-drift ${18 + i * 5}s ease-in-out ${i * -4}s infinite` }} />
          ))}
        </div>
      )}

      {/* Menubar */}
      <div className={cn('relative z-20 flex h-8 shrink-0 animate-fade-in items-center justify-between px-3 text-[12px] text-white sm:px-4', gnome ? 'bg-black/90' : 'bg-black/25 backdrop-blur-xl')}>
        <div className="flex items-center gap-4">
          {gnome ? <span className="rounded-full bg-white/10 px-2.5 py-0.5 font-semibold">Activities</span> : <><TermIcon className="h-3.5 w-3.5" /><span className="font-bold">Terminal</span></>}
          {!gnome && <span className="hidden gap-4 text-white/80 md:flex"><span>Shell</span><span>Edit</span><span>View</span><span>Window</span><span>Help</span></span>}
        </div>
        {gnome && <span className="absolute left-1/2 -translate-x-1/2 font-semibold">{clock}</span>}
        <div className="flex items-center gap-3">
          <div className="hidden items-center rounded-md bg-white/10 p-0.5 sm:flex" role="radiogroup" aria-label="Terminal theme">
            {Object.entries(THEMES).map(([k, v]) => (
              <button key={k} type="button" role="radio" aria-checked={theme === k} onClick={() => pickTheme(k)}
                className={cn('rounded px-2 py-0.5 transition', theme === k ? 'bg-white text-black' : 'text-white/75 hover:text-white')}>{v.label}</button>
            ))}
          </div>
          <Wifi className="h-3.5 w-3.5" /><Battery className="h-4 w-4" />
          {!gnome && <span className="font-medium">{clock}</span>}
        </div>
      </div>

      {/* Desktop */}
      <div className={cn('relative flex flex-1 items-center justify-center px-3 pb-24 pt-6 sm:px-6 sm:pt-10', gnome && 'md:pl-24')}>
        <div
          className={cn('relative flex w-full flex-col overflow-hidden shadow-[0_40px_120px_-20px_rgb(0_0_0/0.7)] ring-1 transition-all duration-500 ease-out',
            gnome ? 'rounded-xl' : 'rounded-[14px]',
            win.max ? 'h-[calc(100svh-13rem)] max-w-none' : 'h-[min(660px,calc(100svh-14.5rem))] max-w-5xl',
            !win.open && 'pointer-events-none translate-y-[30%] scale-75 opacity-0')}
          style={{ background: t.bg, color: t.fg, '--tw-ring-color': t.border, backdropFilter: 'blur(24px) saturate(160%)', WebkitBackdropFilter: 'blur(24px) saturate(160%)', animation: 'term-open .8s cubic-bezier(.2,.8,.2,1) .15s backwards' }}
          aria-hidden={!win.open}
        >
          {/* Title bar */}
          <div className="relative flex h-10 shrink-0 items-center px-3 text-[12.5px] transition-colors duration-500" style={{ background: t.bar, borderBottom: `1px solid ${t.border}` }}
            onDoubleClick={() => setWin((w) => ({ ...w, max: !w.max }))}>
            {!gnome && (
              <div className="group flex gap-2">
                {[['#ff5f57', X, () => setWin({ open: false, max: false }), 'Close'], ['#febc2e', Minus, () => setWin((w) => ({ ...w, open: false })), 'Minimize'], ['#28c840', Square, () => setWin((w) => ({ ...w, max: !w.max })), 'Zoom']].map(([bg, Icon, fn, label]) => (
                  <button key={label} type="button" onClick={fn} aria-label={label} className="grid h-3 w-3 place-items-center rounded-full text-black/60" style={{ background: bg }}>
                    <Icon className="h-2 w-2 opacity-0 group-hover:opacity-100" strokeWidth={3} />
                  </button>
                ))}
              </div>
            )}
            <div className="pointer-events-none absolute inset-x-0 text-center font-semibold" style={{ color: t.dim }}>
              {gnome ? `${user}@${host}: ${cwd}` : <><TermIcon className="mr-1.5 inline h-3.5 w-3.5 align-[-2px]" />{user} — {cwd} — {typing ? 'typing…' : 'zsh'} — 120×36</>}
            </div>
            {gnome && (
              <div className="ml-auto flex gap-2">
                {[[Minus, () => setWin((w) => ({ ...w, open: false })), 'Minimize'], [Square, () => setWin((w) => ({ ...w, max: !w.max })), 'Maximize'], [X, () => setWin({ open: false, max: false }), 'Close']].map(([Icon, fn, label], i) => (
                  <button key={label} type="button" onClick={fn} aria-label={label} className={cn('grid h-6 w-6 place-items-center rounded-full transition', i === 2 ? 'bg-[#e95420] text-white hover:brightness-110' : 'bg-white/10 text-white hover:bg-white/20')}>
                    <Icon className="h-3 w-3" strokeWidth={2.5} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex min-h-0 flex-1">
            {/* File tree */}
            <aside className="hidden w-52 shrink-0 overflow-y-auto py-3 text-[12.5px] transition-colors duration-500 md:block" style={{ background: t.side, borderRight: `1px solid ${t.border}` }}>
              <div className="px-4 pb-2 text-[10.5px] font-bold uppercase tracking-wider" style={{ color: t.dim }}>~/portfolio</div>
              <div className={cn('flex items-center transition hover:bg-white/5', activeFile === 'projects/' && 'bg-white/10')}>
                <button type="button" onClick={() => setTreeOpen((o) => !o)} aria-label={treeOpen ? 'Collapse projects' : 'Expand projects'} aria-expanded={treeOpen} className="py-1 pl-3 pr-1">
                  {treeOpen ? <ChevronDown className="h-3 w-3 opacity-60" /> : <ChevronRight className="h-3 w-3 opacity-60" />}
                </button>
                <button type="button" onClick={() => { setTreeOpen(true); typeAndRun('projects'); }} className="flex flex-1 items-center gap-1.5 py-1 pr-3 text-left">
                  {treeOpen ? <FolderOpen className="h-4 w-4" style={{ color: t.path }} /> : <Folder className="h-4 w-4" style={{ color: t.path }} />}projects
                </button>
              </div>
              <div className={cn('grid transition-[grid-template-rows] duration-300', treeOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}>
                <div className="overflow-hidden">
                  {projects.map((p) => (
                    <button key={p.file} type="button" onClick={() => typeAndRun(`cat projects/${p.file}`)} title={p.title} className={cn('flex w-full items-center gap-1.5 py-1 pl-10 pr-3 text-left transition hover:bg-white/5', activeFile === `projects/${p.file}` && 'bg-white/10')}>
                      <FileText className="h-3.5 w-3.5 shrink-0 opacity-70" /><span className="truncate">{p.file}</span>
                    </button>
                  ))}
                </div>
              </div>
              {Object.keys(FILES).map((f) => {
                const Icon = fileIcon(f);
                return (
                  <button key={f} type="button" onClick={() => typeAndRun(f === 'resume.pdf' ? 'resume' : `cat ${f}`)} className={cn('flex w-full items-center gap-1.5 py-1 pl-[1.6rem] pr-3 text-left transition hover:bg-white/5', activeFile === f && 'bg-white/10')}>
                    <Icon className="h-3.5 w-3.5 shrink-0" style={{ color: f.endsWith('.pdf') ? t.err : t.warn }} /><span className="truncate">{f}</span>
                  </button>
                );
              })}
            </aside>

            {/* Output + prompt */}
            <div className="flex min-w-0 flex-1 flex-col">
              <div ref={scrollRef} onClick={onScreenClick} className="relative min-h-0 flex-1 cursor-text overflow-y-auto overscroll-contain px-4 py-4 text-[12.5px] leading-[1.65] selection:bg-[var(--t-sel)] sm:px-5 sm:text-[13.5px]">
                {entries.map((e) => (
                  <div key={e.id} data-entry className={cn('break-words first:mt-0', e.cmd != null ? 'mt-3' : 'mt-1')}>
                    {e.cmd != null && <div className="animate-fade-in"><Prompt at={e.cwd} /> {e.cmd}</div>}
                    {e.echo && <div className="animate-fade-in">{e.echo}</div>}
                    {e.pending && <div className="mt-1"><Spinner label={e.pending} /></div>}
                    {e.out && <div className={e.cmd != null ? 'mt-1' : undefined}><Reveal>{e.out}</Reveal></div>}
                  </div>
                ))}
                <label className="flex items-center gap-2">
                  <span className="shrink-0 whitespace-nowrap">{step ? <><C c="accent">?</C> <C c="fg" b>{step.q}:</C></> : <Prompt />}</span>
                  <span className="relative min-w-0 flex-1">
                    <input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={onKey} readOnly={typing} aria-label="Terminal input" autoComplete="off" autoCapitalize="off" autoCorrect="off" spellCheck={false}
                      className="w-full bg-transparent caret-transparent outline-none" style={{ color: t.fg }} />
                    <span aria-hidden className="pointer-events-none absolute left-0 top-0 h-full whitespace-pre">
                      <span className="invisible">{input}</span>
                      <span className="inline-block h-[1.15em] w-[0.6em] translate-y-[0.2em]" style={{ background: t.fg, animation: typing ? 'none' : 'term-blink 1.05s steps(1) infinite' }} />
                    </span>
                  </span>
                </label>
                {booting && <div className="pointer-events-none sticky bottom-0 mt-3 text-right text-[11px]" style={{ color: t.dim }}>press any key to skip ⏎</div>}
              </div>
              {/* Status bar with quick commands */}
              <div className="flex shrink-0 items-center gap-2 overflow-x-auto px-3 py-2 text-[11.5px] transition-colors duration-500 [scrollbar-width:none]" style={{ background: t.bar, borderTop: `1px solid ${t.border}` }}>
                {['help', 'about', 'skills', 'projects', 'git log', 'contact', 'message'].map((c, i) => (
                  <button key={c} type="button" onClick={() => typeAndRun(c)} disabled={typing}
                    className="shrink-0 rounded-md px-2.5 py-1 transition hover:-translate-y-0.5 hover:brightness-125 disabled:opacity-50"
                    style={{ background: 'var(--t-sel)', color: t.fg, animation: `term-line .4s ease-out ${0.9 + i * 0.07}s backwards` }}>{c}</button>
                ))}
                <span className="ml-auto hidden shrink-0 items-center gap-1.5 sm:flex" style={{ color: t.dim }}>
                  <span className={cn('h-1.5 w-1.5 rounded-full', typing || entries.some((x) => x.pending) ? 'animate-pulse' : '')} style={{ background: typing || entries.some((x) => x.pending) ? t.warn : t.user }} />
                  zsh · utf-8 · {THEMES[theme].label}
                </span>
              </div>
            </div>
          </div>
        </div>

        {!win.open && (
          <button type="button" onClick={() => setWin({ open: true, max: false })} className="absolute inset-0 m-auto flex h-28 w-28 animate-fade-in flex-col items-center justify-center gap-2 rounded-2xl text-sm text-white transition hover:bg-white/10">
            <span className="grid h-16 w-16 place-items-center rounded-2xl bg-black/70 shadow-xl ring-1 ring-white/20"><TermIcon className="h-8 w-8" /></span>Terminal
          </button>
        )}
      </div>

      {/* Dock */}
      <nav aria-label="Dock" className={cn('absolute z-20 flex gap-2 p-2 backdrop-blur-2xl',
        gnome ? 'bottom-4 left-1/2 -translate-x-1/2 rounded-2xl bg-black/60 md:bottom-auto md:left-3 md:top-1/2 md:translate-x-0 md:-translate-y-1/2 md:flex-col' : 'bottom-4 left-1/2 -translate-x-1/2 rounded-2xl border border-white/20 bg-white/15')}
        style={{ animation: 'term-open .7s cubic-bezier(.2,.8,.2,1) .5s backwards' }}>
        {dockItems.map((it) => {
          const Icon = it.icon;
          const cls = 'group relative grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-b from-white/25 to-white/5 text-white shadow-lg ring-1 ring-white/20 transition duration-200 hover:-translate-y-2 hover:scale-[1.18]';
          const tip = <><span className="pointer-events-none absolute -top-9 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-black/80 px-2 py-1 text-[11px] text-white group-hover:block">{it.label}</span>{it.active && <span className="absolute -bottom-1.5 h-1 w-1 rounded-full bg-white" />}</>;
          return it.href
            ? <a key={it.label} href={it.href} target={ext(it.href) ? '_blank' : undefined} rel="noreferrer" aria-label={it.label} className={cls}><Icon className="h-6 w-6" />{tip}</a>
            : <button key={it.label} type="button" onClick={it.onClick} aria-label={it.label} className={cls}><Icon className="h-6 w-6" />{tip}</button>;
        })}
      </nav>
    </div>
  );
}
