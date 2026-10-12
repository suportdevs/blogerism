'use client';

import { useEffect, useState } from 'react';

// Types out each role, pauses, deletes it, then moves to the next one.
export function RoleRotator({ roles = [] }) {
  const list = roles.filter(Boolean);
  const [index, setIndex] = useState(0);
  const [text, setText] = useState(list[0] || '');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (list.length < 2) return undefined;
    const word = list[index % list.length];
    let delay = deleting ? 35 : 70;
    if (!deleting && text === word) delay = 1800;
    const t = setTimeout(() => {
      if (!deleting && text === word) setDeleting(true);
      else if (deleting && text === '') { setDeleting(false); setIndex((i) => (i + 1) % list.length); }
      else setText(deleting ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1));
    }, delay);
    return () => clearTimeout(t);
  }, [text, deleting, index, list]);

  return (
    <span className="bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] bg-clip-text text-transparent [animation:shine_6s_linear_infinite]">
      {text}<span className="ml-0.5 inline-block w-[3px] animate-pulse bg-accent align-middle" style={{ height: '0.9em' }} />
    </span>
  );
}
