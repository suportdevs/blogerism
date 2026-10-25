'use client';

import { useState } from 'react';
import { Shuffle } from 'lucide-react';
import { cn } from '@/lib/utils';

/* Interactive pieces of the "Scrapbook" portfolio blocks (see ScrapBlocks.js). */

// Resting place of each photo in the deck, front to back. Spreads a little further on hover.
const SPOTS = [
  'z-30 rotate-0 group-hover:-rotate-2',
  'z-20 translate-x-[5%] translate-y-[3%] rotate-[5deg] group-hover:translate-x-[11%] group-hover:rotate-[9deg]',
  'z-10 -translate-x-[5%] translate-y-[4%] -rotate-[6deg] group-hover:-translate-x-[11%] group-hover:-rotate-[10deg]',
];

// Up to three project screenshots stacked like printed photos; click (or the shuffle sticker) to bring the next one forward.
export function PhotoDeck({ images = [], title = '', label = 'Next photo' }) {
  const list = images.filter(Boolean).slice(0, 3);
  const [front, setFront] = useState(0);
  if (!list.length) return <div className="aspect-[4/3] rounded-2xl border-4 border-dashed border-fg/15" />;
  const next = () => setFront((f) => (f + 1) % list.length);
  return (
    <div className="group relative mx-auto aspect-[4/3] w-[88%] select-none">
      {list.map((src, i) => {
        const pos = (i - front + list.length) % list.length;
        return (
          <button key={i} type="button" onClick={next} tabIndex={pos === 0 ? 0 : -1} aria-label={pos === 0 ? label : undefined} aria-hidden={pos !== 0}
            className={cn('absolute inset-0 cursor-pointer overflow-hidden rounded-2xl border-[6px] border-white bg-white shadow-[0_24px_50px_-20px_rgb(0_0_0/0.45)] transition-transform duration-500 ease-out', SPOTS[pos])}>
            <img src={src} alt={pos === 0 ? title : ''} loading="lazy" draggable={false} className="h-full w-full rounded-lg object-cover" />
          </button>
        );
      })}
      {list.length > 1 && (
        <button type="button" onClick={next} aria-label={label}
          className="absolute -bottom-5 -right-3 z-40 inline-flex rotate-6 items-center gap-1.5 rounded-full border-2 border-[#1c1a17] bg-accent px-3.5 py-1.5 text-xs font-bold text-[#1c1a17] shadow-[3px_3px_0_#1c1a17] transition hover:rotate-0 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none">
          <Shuffle className="h-3.5 w-3.5" />{front + 1} / {list.length}
        </button>
      )}
    </div>
  );
}
