'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Battery, ChevronDown, ChevronRight, FileCode2, FileJson, FileText, Folder, FolderOpen, Github, Linkedin, Mail, Minus, ScrollText, Square, Terminal as TermIcon, Wifi, X } from 'lucide-react';
import { API_URL } from '@/lib/api';
import { cn } from '@/lib/utils';

/*
 * A working terminal for the "Terminal" portfolio: macOS / Ubuntu / Dracula / Matrix themes, a desktop with a dock,
 * a file-tree sidebar, typed or clicked commands (help, about, skills, projects, git log …), Tab completion, history,
 * and an in-terminal contact form. All content comes from the block's data (see TermBlocks.js).
 */

const THEMES = {
  macos: {
    label: 'macOS', chrome: 'mac', bg: 'rgba(24,24,27,0.84)', bar: 'rgba(48,48,52,0.9)', side: 'rgba(36,36,40,0.62)', border: 'rgba(255,255,255,0.12)',
    fg: '#e7e7ea', dim: '#8d8d96', user: '#5af78e', path: '#57c7ff', accent: '#ff6ac1', warn: '#f3f99d', err: '#ff5c57', sel: 'rgba(87,199,255,0.28)',
    wall: 'radial-gradient(at 18% 22%, #ff7a59 0, transparent 42%), radial-gradient(at 82% 12%, #7b5cff 0, transparent 48%), radial-gradient(at 55% 95%, #1fb6ff 0, transparent 52%), linear-gradient(135deg, #1b1340, #0b1838)',
  },
  ubuntu: {
    label: 'Ubuntu', chrome: 'gnome', bg: 'rgba(48,10,36,0.96)', bar: '#2b2b2b', side: 'rgba(28,6,21,0.85)', border: 'rgba(255,255,255,0.08)',
    fg: '#ffffff', dim: '#b58bb0', user: '#8ae234', path: '#729fcf', accent: '#e95420', warn: '#fce94f', err: '#ef2929', sel: 'rgba(233,84,32,0.35)',
    wall: 'radial-gradient(at 72% 28%, #e95420 0, transparent 38%), radial-gradient(at 18% 82%, #9b2c86 0, transparent 52%), linear-gradient(135deg, #2c001e, #5e2750 60%, #2c001e)',
  },
  dracula: {
    label: 'Dracula', chrome: 'mac', bg: 'rgba(40,42,54,0.92)', bar: 'rgba(33,34,44,0.95)', side: 'rgba(33,34,44,0.75)', border: 'rgba(189,147,249,0.18)',
    fg: '#f8f8f2', dim: '#7c83a8', user: '#50fa7b', path: '#bd93f9', accent: '#ff79c6', warn: '#f1fa8c', err: '#ff5555', sel: 'rgba(189,147,249,0.3)',
    wall: 'radial-gradient(at 25% 25%, #ff79c6 0, transparent 40%), radial-gradient(at 80% 70%, #8be9fd 0, transparent 40%), linear-gradient(135deg, #191a21, #44275a)',
  },
  matrix: {
    label: 'Matrix', chrome: 'gnome', bg: 'rgba(0,8,2,0.94)', bar: '#020c04', side: 'rgba(0,14,4,0.85)', border: 'rgba(0,255,102,0.16)',
    fg: '#b6ffcc', dim: '#3f9a5b', user: '#00ff66', path: '#00d1ff', accent: '#00ff66', warn: '#d4ff4f', err: '#ff4d4d', sel: 'rgba(0,255,102,0.25)',
    wall: 'radial-gradient(at 50% 40%, #0b3d1a 0, transparent 60%), repeating-linear-gradient(90deg, rgba(0,255,102,0.05) 0 1px, transparent 1px 22px), #000',
  },
};

const slug = (s = '') => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const hash7 = (s = '') => {
  let h = 2166136261;
  for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); }
  return (h >>> 0).toString(16).padStart(8, '0').slice(0, 7);
};
const ext = (url = '') => /^(https?:|mailto:|tel:)/.test(url) || /\.\w{2,5}([?#].*)?$/.test(url);
const SECTION_HASHES = { about: 'about', skills: 'skills', experience: 'git log', projects: 'projects', education: 'education', contact: 'contact', home: null };

/* ------------------------------ Output helpers ------------------------------ */

const C = ({ c, b, children }) => <span style={{ color: `var(--t-${c})` }} className={b ? 'font-bold' : undefined}>{children}</span>;

function A({ href, children }) {
  return <a href={href} target={/^(mailto:|tel:)/.test(href) ? undefined : '_blank'} rel="noreferrer" className="underline decoration-dotted underline-offset-4 hover:decoration-solid" style={{ color: 'var(--t-path)' }}>{children}</a>;
}

function Section({ title, children }) {
  return (
    <div className="mt-1">
      <div><C c="accent" b>{'## '}{title}</C></div>
      <div className="mt-1">{children}</div>
    </div>
  );
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
  const idRef = useRef(1);
  const inputRef = useRef();
  const scrollRef = useRef();
  const rootRef = useRef();

  const FILES = useMemo(() => ({
    'about.md': 'about', 'skills.json': 'skills', 'experience.log': 'git log', 'education.log': 'education', 'contact.sh': 'contact', ...(d.resumeUrl ? { 'resume.pdf': 'resume' } : {}),
  }), [d.resumeUrl]);
  const PATHS = useMemo(() => [...Object.keys(FILES), 'projects/', ...projects.map((p) => `projects/${p.file}`)], [FILES, projects]);

  /* ---- clickable command ---- */
  const runRef = useRef();
  const Cmd = ({ children, cmd }) => (
    <button type="button" onClick={() => runRef.current(cmd || String(children))} className="rounded px-0.5 underline decoration-dotted underline-offset-4 transition hover:bg-[var(--t-sel)] hover:decoration-solid" style={{ color: 'var(--t-warn)' }}>{children}</button>
  );

  /* ---- outputs ---- */
  const Neofetch = () => {
    const info = (d.info || []).filter((r) => r.label && r.value);
    return (
      <div className="flex flex-col gap-x-8 gap-y-3 sm:flex-row">
        {d.ascii && <pre className="shrink-0 overflow-hidden text-[10px] leading-[1.15] sm:text-[11px]" style={{ color: 'var(--t-user)' }}>{d.ascii}</pre>}
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
        <div><C c="accent" b>built-ins</C>{tools.map(Row)}</div>
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
          {(g.items || []).filter((s) => s.label).map((s, j) => {
            const lv = Math.max(0, Math.min(100, Number(s.level) || 0));
            const n = Math.round(lv / 5);
            return (
              <div key={j} className="grid grid-cols-[minmax(0,9.5rem)_auto_auto] items-center gap-x-3 pl-4 sm:grid-cols-[13rem_auto_auto]">
                <span className="truncate">{s.label}</span>
                <span className="whitespace-pre tracking-tighter"><C c="user">{'█'.repeat(n)}</C><C c="dim">{'░'.repeat(20 - n)}</C></span>
                <C c="warn">{String(lv).padStart(3)}%</C>
              </div>
            );
          })}
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
    <div>
      {socials.map((s, i) => <div key={i} className="grid grid-cols-[7rem_1fr] gap-2"><C c="path" b>{s.label || s.icon}</C><A href={s.url}>{s.url.replace(/^(https?:\/\/|mailto:)/, '')}</A></div>)}
    </div>
  );

  const Ls = ({ dir }) => {
    if (dir === 'projects') return <div className="flex flex-wrap gap-x-6 gap-y-1">{projects.map((p) => <Cmd key={p.file} cmd={`cat projects/${p.file}`}>{p.file}</Cmd>)}</div>;
    return (
      <div className="flex flex-wrap gap-x-6 gap-y-1">
        <button type="button" onClick={() => runRef.current('cd projects')} className="font-bold hover:underline" style={{ color: 'var(--t-path)' }}>projects/</button>
        {Object.keys(FILES).map((f) => <Cmd key={f} cmd={f === 'resume.pdf' ? 'resume' : `cat ${f}`}>{f}</Cmd>)}
      </div>
    );
  };

  const Boot = () => (
    <div className="space-y-3">
      <div style={{ color: 'var(--t-dim)' }}>{d.motd || 'Last login on ttys001'}</div>
      <div className="animate-fade-up"><Neofetch /></div>
      <div className="animate-fade-up [animation-delay:.25s]">
        {d.welcome && <div className="mb-1.5"><C c="fg">{d.welcome}</C></div>}
        <C c="dim">Type </C><Cmd>help</Cmd><C c="dim"> or try </C><Cmd>about</Cmd> <Cmd>projects</Cmd> <Cmd>skills</Cmd> <Cmd>contact</Cmd>
      </div>
    </div>
  );

  const [entries, setEntries] = useState(() => [{ id: 0, out: <Boot /> }]);
  const push = (...items) => setEntries((e) => [...e, ...items.map((it) => ({ id: idRef.current++, ...it }))]);

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
    push({ echo: <><C c="accent">?</C> <C c="fg" b>{step.q}:</C> {step.key === 'confirm' || step.key === 'message' ? v : v || <C c="dim">(skipped)</C>}</> });
    const ok = step.check(v);
    if (ok !== true) { push({ out: <C c="err">✗ {ok}</C> }); return; }
    const data = { ...flow.data, [step.key]: v };
    if (step.key !== 'confirm') { setFlow({ step: flow.step + 1, data }); return; }
    setFlow(null);
    if (/^n/i.test(v)) { push({ out: <C c="dim">Cancelled — nothing was sent.</C> }); return; }
    const id = idRef.current;
    push({ out: <C c="dim">Sending…</C> });
    try {
      const res = await fetch(`${API_URL}/api/public/contact`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: data.name, email: data.email, subject: data.subject || null, message: data.message, website: '' }) });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.message || 'Something went wrong');
      setEntries((e) => e.map((x) => (x.id === id ? { ...x, out: <C c="user">✓ {body.message || 'Message sent!'} I’ll get back to you soon.</C> } : x)));
    } catch (err) {
      setEntries((e) => e.map((x) => (x.id === id ? { ...x, out: <><C c="err">✗ {err.message}</C>{d.email && <> — <C c="dim">you can also email </C><A href={`mailto:${d.email}`}>{d.email}</A></>}</> } : x)));
    }
  };

  /* ---- command runner ---- */
  const resolve = (arg = '') => {
    let p = arg.replace(/^~\//, '').replace(/^\.\//, '');
    if (cwd === '~/projects' && !p.startsWith('projects/') && !FILES[p]) p = `projects/${p}`;
    if (p.startsWith('../')) p = p.slice(3);
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
    const line = raw.trim();
    const [cmd0, ...args] = line.split(/\s+/);
    const cmd = (cmd0 || '').toLowerCase();
    const arg = args.join(' ');
    const out = (node) => push({ out: node });
    switch (cmd) {
      case '': return;
      case 'help': case 'man': case '?': return out(<Help />);
      case 'about': case 'whoami': setActiveFile('about.md'); return out(<About />);
      case 'skills': setActiveFile('skills.json'); return out(<Skills />);
      case 'projects': setActiveFile('projects/'); return out(<Projects />);
      case 'experience': case 'work': setActiveFile('experience.log'); return out(<GitLog />);
      case 'git': return arg.startsWith('log') ? (setActiveFile('experience.log'), out(<GitLog />)) : out(<C c="dim">git: try <Cmd>git log</Cmd></C>);
      case 'education': setActiveFile('education.log'); return out(<Education />);
      case 'contact': setActiveFile('contact.sh'); return out(<Contact />);
      case 'social': case 'socials': return out(<Social />);
      case 'neofetch': case 'fastfetch': return out(<Neofetch />);
      case 'message': case 'mail': case 'hire': case 'hire-me':
        setFlow({ step: 0, data: {} });
        return out(<C c="dim">Let’s write a message. Press <C c="fg">Ctrl+C</C> to cancel at any time.</C>);
      case 'resume': case 'cv':
        if (!d.resumeUrl) return out(<C c="err">resume: not found</C>);
        window.open(d.resumeUrl, '_blank', 'noopener');
        return out(<><C c="user">✓</C> opening <A href={d.resumeUrl}>resume.pdf</A>…</>);
      case 'ls': case 'll': case 'dir': {
        const p = resolve(arg).replace(/\/$/, '');
        return out(<Ls dir={p === 'projects' || (cwd === '~/projects' && (!arg || p === 'projects/')) ? 'projects' : ''} />);
      }
      case 'cd': {
        const p = arg.replace(/\/$/, '');
        if (!p || p === '~' || p === '..' || p === '/') { setCwd('~'); return undefined; }
        if (p === 'projects' || p === '~/projects') { setCwd('~/projects'); return undefined; }
        return out(<C c="err">cd: no such directory: {arg}</C>);
      }
      case 'pwd': return out(<span>/home/{user}{cwd.slice(1)}</span>);
      case 'cat': case 'less': case 'more': case 'bat': {
        if (!arg) return out(<C c="err">{cmd}: missing file — try <Cmd cmd="ls">ls</Cmd></C>);
        const p = resolve(arg);
        if (FILES[p]) return exec(FILES[p]);
        const proj = projects.find((x) => `projects/${x.file}` === p);
        if (proj) { setActiveFile(p); return out(<Project p={proj} />); }
        if (p.replace(/\/$/, '') === 'projects') return out(<C c="err">cat: projects: Is a directory</C>);
        return out(<C c="err">cat: {arg}: No such file or directory</C>);
      }
      case 'open': case 'xdg-open': {
        if (!arg) return out(<C c="err">open: what should I open? e.g. <Cmd cmd="open 1">open 1</Cmd></C>);
        const { url, label } = openTarget(arg);
        if (!url) return out(<C c="err">open: {arg}: not found</C>);
        window.open(url, '_blank', 'noopener');
        return out(<><C c="user">✓</C> opening <A href={url}>{label}</A>…</>);
      }
      case 'theme': {
        if (THEMES[arg]) { setTheme(arg); try { localStorage.setItem('term-theme', arg); } catch { /* storage blocked */ } return out(<><C c="user">✓</C> theme set to {THEMES[arg].label}</>); }
        return out(<div>{Object.entries(THEMES).map(([k, v]) => <div key={k}><Cmd cmd={`theme ${k}`}>{k}</Cmd> <C c="dim">{v.label}{k === theme ? ' (current)' : ''}</C></div>)}</div>);
      }
      case 'history': return out(<div>{past.slice().reverse().map((h, i) => <div key={i}><C c="dim">{String(i + 1).padStart(4)}  </C>{h}</div>)}</div>);
      case 'date': return out(<span>{new Date().toString()}</span>);
      case 'echo': return out(<span>{arg}</span>);
      case 'clear': case 'cls': setEntries([]); return undefined;
      case 'exit': case 'logout': setWin({ open: false, max: false }); return undefined;
      case 'sudo': return out(<span>[sudo] password for {user}: <C c="err">nice try 😄</C> — you could <Cmd cmd="hire">hire me</Cmd> instead.</span>);
      case 'rm': return out(<C c="err">rm: permission denied — please don’t delete my portfolio 🙏</C>);
      case 'vim': case 'vi': case 'nano': case 'emacs': return out(<C c="dim">{cmd}: this is a read-only portfolio. (and yes, you can exit vim: :q)</C>);
      case 'ping': return out(<span>PING {arg || host}: 64 bytes — <C c="user">I’m online</C> and replying within 24h. Try <Cmd>message</Cmd>.</span>);
      default: {
        const guess = [...Object.keys(FILES).map((f) => FILES[f]), 'help', 'projects', 'message', 'social', 'neofetch'].find((c) => c.startsWith(cmd.slice(0, 2)));
        return out(<span><C c="err">zsh: command not found: {cmd0}</C>{guess && <> — did you mean <Cmd>{guess}</Cmd>?</>}</span>);
      }
    }
  };

  const run = (raw) => {
    if (!win.open) setWin({ open: true, max: win.max });
    if (flow) { setFlow(null); push({ out: <C c="dim">^C</C> }); }
    push({ cmd: raw, cwd });
    if (raw.trim()) setPast((p) => [raw, ...p.filter((x) => x !== raw)].slice(0, 50));
    setCursor(-1);
    exec(raw);
    inputRef.current?.focus({ preventScroll: true });
  };
  runRef.current = run;

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
  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [entries, flow]);

  useEffect(() => {
    try { const saved = localStorage.getItem('term-theme'); if (THEMES[saved]) setTheme(saved); } catch { /* storage blocked */ }
    if (window.matchMedia?.('(pointer: fine)').matches) inputRef.current?.focus({ preventScroll: true });
    const tick = () => setClock(new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date()));
    tick();
    const timer = setInterval(tick, 20000);
    // Header links like /#projects run the matching command.
    const onHash = () => {
      const key = window.location.hash.slice(1);
      if (!(key in SECTION_HASHES)) return;
      rootRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (SECTION_HASHES[key]) runRef.current(SECTION_HASHES[key]);
    };
    onHash();
    window.addEventListener('hashchange', onHash);
    return () => { clearInterval(timer); window.removeEventListener('hashchange', onHash); };
  }, []);

  const focusInput = () => { if (!window.getSelection()?.toString()) inputRef.current?.focus({ preventScroll: true }); };

  /* ---- render ---- */
  const vars = Object.fromEntries(['fg', 'dim', 'user', 'path', 'accent', 'warn', 'err', 'sel'].map((k) => [`--t-${k}`, t[k]]));
  const gnome = t.chrome === 'gnome';
  const Prompt = ({ at = cwd }) => (gnome
    ? <><C c="user" b>{user}@{host}</C><C c="fg">:</C><C c="path" b>{at}</C><C c="fg">$</C></>
    : <><C c="user" b>{user}@{host}</C> <C c="path" b>{at}</C> <C c="accent">%</C></>);
  const step = flow ? STEPS[flow.step] : null;

  const dockItems = [
    { icon: TermIcon, label: 'Terminal', onClick: () => setWin({ open: true, max: win.max }), active: win.open },
    { icon: Folder, label: 'Projects', onClick: () => run('projects') },
    { icon: Mail, label: 'Message me', onClick: () => run('message') },
    ...(d.resumeUrl ? [{ icon: FileText, label: 'Résumé', href: d.resumeUrl }] : []),
    ...socials.filter((s) => /github|linkedin/i.test(s.icon)).map((s) => ({ icon: /github/i.test(s.icon) ? Github : Linkedin, label: s.label || s.icon, href: s.url })),
  ];
  const fileIcon = (f) => (f.endsWith('.json') ? FileJson : f.endsWith('.sh') ? FileCode2 : f.endsWith('.log') ? ScrollText : FileText);

  return (
    <div ref={rootRef} className="relative isolate flex min-h-[100svh] scroll-mt-16 flex-col overflow-hidden font-mono" style={{ ...vars, background: t.wall }}>
      {/* Menubar */}
      <div className={cn('relative z-20 flex h-8 shrink-0 items-center justify-between px-3 text-[12px] text-white sm:px-4', gnome ? 'bg-black/90' : 'bg-black/25 backdrop-blur-xl')}>
        <div className="flex items-center gap-4">
          {gnome ? <span className="rounded-full bg-white/10 px-2.5 py-0.5 font-semibold">Activities</span> : <><TermIcon className="h-3.5 w-3.5" /><span className="font-bold">Terminal</span></>}
          {!gnome && <span className="hidden gap-4 text-white/80 md:flex"><span>Shell</span><span>Edit</span><span>View</span><span>Window</span><span>Help</span></span>}
        </div>
        {gnome && <span className="absolute left-1/2 -translate-x-1/2 font-semibold" suppressHydrationWarning>{clock}</span>}
        <div className="flex items-center gap-3">
          <div className="hidden items-center rounded-md bg-white/10 p-0.5 sm:flex" role="radiogroup" aria-label="Terminal theme">
            {Object.entries(THEMES).map(([k, v]) => (
              <button key={k} type="button" role="radio" aria-checked={theme === k} onClick={() => { setTheme(k); try { localStorage.setItem('term-theme', k); } catch { /* storage blocked */ } }}
                className={cn('rounded px-2 py-0.5 transition', theme === k ? 'bg-white text-black' : 'text-white/75 hover:text-white')}>{v.label}</button>
            ))}
          </div>
          <Wifi className="h-3.5 w-3.5" /><Battery className="h-4 w-4" />
          {!gnome && <span className="font-medium" suppressHydrationWarning>{clock}</span>}
        </div>
      </div>

      {/* Desktop */}
      <div className={cn('relative flex flex-1 items-center justify-center px-3 pb-24 pt-6 sm:px-6 sm:pt-10', gnome && 'md:pl-24')}>
        <div
          className={cn('relative flex w-full flex-col overflow-hidden shadow-[0_40px_120px_-20px_rgb(0_0_0/0.7)] ring-1 transition-all duration-500 ease-out',
            gnome ? 'rounded-xl' : 'rounded-[14px]',
            win.max ? 'h-[calc(100svh-9.5rem)] max-w-none' : 'h-[min(680px,calc(100svh-10rem))] max-w-5xl',
            !win.open && 'pointer-events-none translate-y-[30%] scale-75 opacity-0')}
          style={{ background: t.bg, color: t.fg, '--tw-ring-color': t.border, backdropFilter: 'blur(24px) saturate(160%)', WebkitBackdropFilter: 'blur(24px) saturate(160%)' }}
          aria-hidden={!win.open}
        >
          {/* Title bar */}
          <div className="relative flex h-10 shrink-0 items-center px-3 text-[12.5px]" style={{ background: t.bar, borderBottom: `1px solid ${t.border}` }}
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
              {gnome ? `${user}@${host}: ${cwd}` : <><TermIcon className="mr-1.5 inline h-3.5 w-3.5 align-[-2px]" />{user} — {cwd} — zsh — 120×36</>}
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
            <aside className="hidden w-52 shrink-0 overflow-y-auto py-3 text-[12.5px] md:block" style={{ background: t.side, borderRight: `1px solid ${t.border}` }}>
              <div className="px-4 pb-2 text-[10.5px] font-bold uppercase tracking-wider" style={{ color: t.dim }}>~/portfolio</div>
              <button type="button" onClick={() => { setTreeOpen((o) => !o); run('projects'); }} className={cn('flex w-full items-center gap-1.5 px-3 py-1 text-left transition hover:bg-white/5', activeFile === 'projects/' && 'bg-white/10')}>
                {treeOpen ? <ChevronDown className="h-3 w-3 opacity-60" /> : <ChevronRight className="h-3 w-3 opacity-60" />}
                {treeOpen ? <FolderOpen className="h-4 w-4" style={{ color: t.path }} /> : <Folder className="h-4 w-4" style={{ color: t.path }} />}projects
              </button>
              {treeOpen && projects.map((p) => (
                <button key={p.file} type="button" onClick={() => run(`cat projects/${p.file}`)} title={p.title} className={cn('flex w-full items-center gap-1.5 py-1 pl-10 pr-3 text-left transition hover:bg-white/5', activeFile === `projects/${p.file}` && 'bg-white/10')}>
                  <FileText className="h-3.5 w-3.5 shrink-0 opacity-70" /><span className="truncate">{p.file}</span>
                </button>
              ))}
              {Object.keys(FILES).map((f) => {
                const Icon = fileIcon(f);
                return (
                  <button key={f} type="button" onClick={() => run(f === 'resume.pdf' ? 'resume' : `cat ${f}`)} className={cn('flex w-full items-center gap-1.5 py-1 pl-[1.6rem] pr-3 text-left transition hover:bg-white/5', activeFile === f && 'bg-white/10')}>
                    <Icon className="h-3.5 w-3.5 shrink-0" style={{ color: f.endsWith('.pdf') ? t.err : t.warn }} /><span className="truncate">{f}</span>
                  </button>
                );
              })}
            </aside>

            {/* Output + prompt */}
            <div className="flex min-w-0 flex-1 flex-col">
              <div ref={scrollRef} onClick={focusInput} className="min-h-0 flex-1 cursor-text overflow-y-auto overscroll-contain px-4 py-4 text-[12.5px] leading-[1.65] selection:bg-[var(--t-sel)] sm:px-5 sm:text-[13.5px]">
                {entries.map((e) => (
                  <div key={e.id} className="mb-2.5 break-words">
                    {e.cmd != null && <div><Prompt at={e.cwd} /> {e.cmd}</div>}
                    {e.echo && <div>{e.echo}</div>}
                    {e.out && <div className={e.cmd != null ? 'mt-1' : undefined}>{e.out}</div>}
                  </div>
                ))}
                <label className="flex items-center gap-2">
                  <span className="shrink-0 whitespace-nowrap">{step ? <><C c="accent">?</C> <C c="fg" b>{step.q}:</C></> : <Prompt />}</span>
                  <span className="relative min-w-0 flex-1">
                    <input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={onKey} aria-label="Terminal input" autoComplete="off" autoCapitalize="off" autoCorrect="off" spellCheck={false}
                      className="w-full bg-transparent caret-transparent outline-none" style={{ color: t.fg }} />
                    <span aria-hidden className="pointer-events-none absolute top-0 h-full whitespace-pre"><span className="invisible">{input}</span><span className="inline-block h-[1.15em] w-[0.6em] translate-y-[0.2em] animate-pulse" style={{ background: t.fg }} /></span>
                  </span>
                </label>
              </div>
              {/* Status bar with quick commands */}
              <div className="flex shrink-0 items-center gap-3 overflow-x-auto px-3 py-2 text-[11.5px] [scrollbar-width:none]" style={{ background: t.bar, borderTop: `1px solid ${t.border}` }}>
                {['help', 'about', 'skills', 'projects', 'git log', 'contact', 'message'].map((c) => (
                  <button key={c} type="button" onClick={() => run(c)} className="shrink-0 rounded-md px-2.5 py-1 transition hover:brightness-125" style={{ background: 'var(--t-sel)', color: t.fg }}>{c}</button>
                ))}
                <span className="ml-auto hidden shrink-0 sm:inline" style={{ color: t.dim }}>zsh · utf-8 · {THEMES[theme].label}</span>
              </div>
            </div>
          </div>
        </div>

        {!win.open && (
          <button type="button" onClick={() => setWin({ open: true, max: false })} className="absolute inset-0 m-auto flex h-28 w-28 flex-col items-center justify-center gap-2 rounded-2xl text-sm text-white transition hover:bg-white/10">
            <span className="grid h-16 w-16 place-items-center rounded-2xl bg-black/70 shadow-xl ring-1 ring-white/20"><TermIcon className="h-8 w-8" /></span>Terminal
          </button>
        )}
      </div>

      {/* Dock */}
      <nav aria-label="Dock" className={cn('absolute z-20 flex gap-2 p-2 backdrop-blur-2xl',
        gnome ? 'bottom-4 left-1/2 -translate-x-1/2 rounded-2xl bg-black/60 md:bottom-auto md:left-3 md:top-1/2 md:translate-x-0 md:-translate-y-1/2 md:flex-col' : 'bottom-4 left-1/2 -translate-x-1/2 rounded-2xl border border-white/20 bg-white/15')}>
        {dockItems.map((it) => {
          const Icon = it.icon;
          const cls = 'group relative grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-b from-white/25 to-white/5 text-white shadow-lg ring-1 ring-white/20 transition duration-200 hover:-translate-y-1.5 hover:scale-110';
          const tip = <><span className="pointer-events-none absolute -top-9 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-black/80 px-2 py-1 text-[11px] text-white group-hover:block">{it.label}</span>{it.active && <span className="absolute -bottom-1.5 h-1 w-1 rounded-full bg-white" />}</>;
          return it.href
            ? <a key={it.label} href={it.href} target={ext(it.href) ? '_blank' : undefined} rel="noreferrer" aria-label={it.label} className={cls}><Icon className="h-6 w-6" />{tip}</a>
            : <button key={it.label} type="button" onClick={it.onClick} aria-label={it.label} className={cls}><Icon className="h-6 w-6" />{tip}</button>;
        })}
      </nav>
    </div>
  );
}
