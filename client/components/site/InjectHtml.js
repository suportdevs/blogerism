'use client';

import { useEffect } from 'react';

// Injects admin-provided HTML (analytics snippets, chat widgets…) so that <script> tags actually execute.
export default function InjectHtml({ html, target = 'body' }) {
  useEffect(() => {
    const parent = target === 'head' ? document.head : document.body;
    const fragment = document.createRange().createContextualFragment(html);
    const nodes = Array.from(fragment.childNodes);
    nodes.forEach((n) => parent.appendChild(n));
    return () => nodes.forEach((n) => n.parentNode?.removeChild(n));
  }, [html, target]);
  return null;
}
