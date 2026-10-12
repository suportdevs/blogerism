'use client';

import { useEffect, useRef, useState } from 'react';
import Blocks from '@/components/site/Blocks';
import { API_URL } from '@/lib/api';
import { loadFeeds } from '@/lib/blockData';

const get = (p) => fetch(`${API_URL}/api/public${p}`).then((r) => (r.ok ? r.json() : null));

// Live preview target for the admin page builder. The builder posts its unsaved blocks here.
export default function PreviewPage() {
  const [blocks, setBlocks] = useState([]);
  const [ctx, setCtx] = useState({ posts: [], testimonials: [], faqs: [], feeds: {}, categories: [] });
  const [settings, setSettings] = useState(null);
  const feedsRef = useRef({});

  useEffect(() => {
    Promise.all([get('/posts?limit=6'), get('/testimonials'), get('/faqs'), get('/bootstrap'), get('/categories')]).then(([p, t, f, b, c]) => {
      setCtx((x) => ({ ...x, posts: p?.items || [], testimonials: t?.items || [], faqs: f?.items || [], categories: c?.items || [] }));
      setSettings(b?.settings);
    });

    const onMessage = (e) => {
      if (e.origin !== window.location.origin) return;
      if (e.data?.type === 'nova:blocks') setBlocks(e.data.blocks || []);
      if (e.data?.type === 'nova:scroll-to') {
        document.querySelector(`[data-block-id="${e.data.id}"]`)?.parentElement?.parentElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };
    window.addEventListener('message', onMessage);
    window.parent?.postMessage({ type: 'nova:preview-ready' }, window.location.origin);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  // Fetch data for dynamic blocks whenever their query settings change (cached by key + path).
  useEffect(() => {
    const t = setTimeout(() => {
      loadFeeds(blocks, get, feedsRef.current).then((feeds) => {
        feedsRef.current = feeds;
        setCtx((x) => ({ ...x, feeds }));
      });
    }, 250);
    return () => clearTimeout(t);
  }, [blocks]);

  if (!blocks.length) {
    return <div className="grid min-h-[60vh] place-items-center text-fg/40">Add blocks to see the live preview.</div>;
  }
  return <Blocks blocks={blocks} ctx={ctx} settings={settings} />;
}
