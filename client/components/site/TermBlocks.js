import Terminal from './TermClient';

/*
 * "Terminal" portfolio: the whole homepage is a working terminal on a desktop (see TermClient.js). The terminal
 * shows content on demand, so a plain-text copy is rendered for search engines and screen readers.
 */

function TermShell({ d }) {
  const paragraphs = String(d.about || '').split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  return (
    <>
      <Terminal d={d} />
      <div className="sr-only">
        <h1>{[d.name, d.role].filter(Boolean).join(' — ')}</h1>
        {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
        <h2>Projects</h2>
        <ul>{(d.projects || []).filter((p) => p.title).map((p, i) => <li key={i}>{p.live ? <a href={p.live}>{p.title}</a> : p.title}: {p.summary}</li>)}</ul>
        <h2>Experience</h2>
        <ul>{(d.experience || []).filter((e) => e.title).map((e, i) => <li key={i}>{e.title}, {e.org} ({e.period})</li>)}</ul>
        <h2>Skills</h2>
        <ul>{(d.skills || []).map((g, i) => <li key={i}>{g.title}: {(g.items || []).map((s) => s.label).join(', ')}</li>)}</ul>
        {d.email && <p>Email: <a href={`mailto:${d.email}`}>{d.email}</a></p>}
      </div>
    </>
  );
}

export const TERM_RENDERERS = { termShell: TermShell };
