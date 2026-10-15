'use client';

import Link from 'next/link';
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { ListMusic, Loader2, Pause, Play, RotateCcw, RotateCw, SkipBack, SkipForward, X } from 'lucide-react';
import { cn, formatDuration } from '@/lib/utils';

const AudioContext = createContext(null);
const SPEEDS = [1, 1.25, 1.5, 2];
// Listening position per episode, so a visitor can pick up where they left off.
const POS_KEY = 'nova:audio-positions';
const positions = () => { try { return JSON.parse(localStorage.getItem(POS_KEY)) || {}; } catch { return {}; } };
const savePosition = (id, t, d) => {
  try {
    const all = positions();
    if (!d || t < 10 || t > d - 15) delete all[id]; else all[id] = Math.floor(t); // finished or barely started
    localStorage.setItem(POS_KEY, JSON.stringify(all));
  } catch {}
};


/*
 * Global audio player. Lives in the site layout, so playback continues while the visitor
 * navigates between pages (client-side routing keeps the layout mounted).
 */
export function AudioProvider({ children }) {
  const audio = useRef(null);
  const [queue, setQueue] = useState([]);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [resumed, setResumed] = useState(0);
  const lastSave = useRef(0);
  const [showQueue, setShowQueue] = useState(false);
  const current = queue[index];

  const play = useCallback((tracks, start = 0) => {
    const list = (Array.isArray(tracks) ? tracks : [tracks]).filter((t) => t.src);
    if (!list.length) return;
    const same = current && list[start]?.id === current.id;
    if (same) { audio.current.paused ? audio.current.play() : audio.current.pause(); return; }
    setQueue(list);
    setIndex(start);
  }, [current]);

  useEffect(() => {
    const el = audio.current;
    if (!el || !current) return;
    el.src = current.src;
    el.playbackRate = speed;
    const at = positions()[current.id];
    if (at) { el.currentTime = at; setResumed(at); setTimeout(() => setResumed(0), 4000); }
    el.play().catch(() => setPlaying(false));
    // Lock-screen / headphone controls.
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new window.MediaMetadata({ title: current.title, artist: current.subtitle || '', artwork: current.cover ? [{ src: current.cover, sizes: '512x512' }] : [] });
    }
  }, [current]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { try { const v = Number(localStorage.getItem('nova:audio-speed')); if (SPEEDS.includes(v)) setSpeed(v); } catch {} }, []);
  useEffect(() => {
    if (audio.current) audio.current.playbackRate = speed;
    try { localStorage.setItem('nova:audio-speed', String(speed)); } catch {}
  }, [speed]);

  const toggle = () => (audio.current.paused ? audio.current.play() : audio.current.pause());
  const skip = (s) => { audio.current.currentTime = Math.max(0, Math.min(duration, audio.current.currentTime + s)); };
  const next = () => index < queue.length - 1 && setIndex(index + 1);
  const prev = () => (time > 5 ? (audio.current.currentTime = 0) : index > 0 && setIndex(index - 1));
  const close = () => { audio.current.pause(); setQueue([]); };

  useEffect(() => {
    if (!('mediaSession' in navigator) || !current) return;
    const ms = navigator.mediaSession;
    const handlers = { play: () => audio.current.play(), pause: () => audio.current.pause(), seekbackward: () => skip(-15), seekforward: () => skip(15), previoustrack: index > 0 ? prev : null, nexttrack: index < queue.length - 1 ? next : null };
    Object.entries(handlers).forEach(([k, h]) => { try { ms.setActionHandler(k, h); } catch {} });
  });

  const value = { play, current, playing, toggle };

  return (
    <AudioContext.Provider value={value}>
      {children}
      <audio
        ref={audio}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onWaiting={() => setLoading(true)}
        onCanPlay={() => setLoading(false)}
        onTimeUpdate={(e) => {
          const el = e.currentTarget;
          setTime(el.currentTime);
          if (current && Date.now() - lastSave.current > 5000) { lastSave.current = Date.now(); savePosition(current.id, el.currentTime, el.duration); }
        }}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={() => { if (current) savePosition(current.id, 0, 0); next(); }}
      />
      {current && (
        <>
          <div className="h-24" />
          <div className="fixed inset-x-0 bottom-0 z-50 border-t border-fg/10 bg-bg/90 backdrop-blur-xl animate-fade-up">
            <div className="absolute inset-x-0 top-0 h-1 bg-fg/10">
              <div className="h-full bg-gradient-to-r from-primary to-accent" style={{ width: `${duration ? (time / duration) * 100 : 0}%` }} />
            </div>
            <input
              type="range" min={0} max={duration || 0} step={1} value={time} aria-label="Seek"
              onChange={(e) => { audio.current.currentTime = Number(e.target.value); }}
              className="absolute inset-x-0 -top-1.5 h-4 w-full cursor-pointer opacity-0"
            />
            <div className="site-container flex h-20 items-center gap-4">
              <Link href={current.href} className="flex min-w-0 flex-1 items-center gap-3">
                {current.cover ? <img src={current.cover} alt="" className={cn('h-12 w-12 shrink-0 rounded-[calc(var(--radius)*0.6)] object-cover', playing && 'animate-pulse [animation-duration:3s]')} /> : <div className="h-12 w-12 rounded bg-primary/20" />}
                <div className="min-w-0">
                  <div className="truncate text-sm font-bold text-fg">{current.title}</div>
                  <div className="truncate text-xs text-fg/55">{resumed ? <span className="font-semibold text-primary">Resumed at {formatDuration(resumed)}</span> : current.subtitle}</div>
                </div>
              </Link>
              <div className="flex items-center gap-1 sm:gap-2">
                <button onClick={prev} aria-label="Previous" className="hidden h-9 w-9 place-items-center rounded-full text-fg/70 hover:bg-fg/5 sm:grid"><SkipBack className="h-4 w-4" /></button>
                <button onClick={() => skip(-15)} aria-label="Back 15 seconds" className="grid h-9 w-9 place-items-center rounded-full text-fg/70 hover:bg-fg/5"><RotateCcw className="h-4 w-4" /></button>
                <button onClick={toggle} aria-label={playing ? 'Pause' : 'Play'} className="grid h-12 w-12 place-items-center rounded-full bg-primary text-white shadow-glow transition hover:scale-105">
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : playing ? <Pause className="h-5 w-5 fill-current" /> : <Play className="ml-0.5 h-5 w-5 fill-current" />}
                </button>
                <button onClick={() => skip(15)} aria-label="Forward 15 seconds" className="grid h-9 w-9 place-items-center rounded-full text-fg/70 hover:bg-fg/5"><RotateCw className="h-4 w-4" /></button>
                <button onClick={next} disabled={index >= queue.length - 1} aria-label="Next" className="hidden h-9 w-9 place-items-center rounded-full text-fg/70 hover:bg-fg/5 disabled:opacity-30 sm:grid"><SkipForward className="h-4 w-4" /></button>
              </div>
              <div className="hidden flex-1 items-center justify-end gap-3 md:flex">
                <span className="font-mono text-xs text-fg/55">{formatDuration(time)} / {formatDuration(duration)}</span>
                <button onClick={() => setSpeed(SPEEDS[(SPEEDS.indexOf(speed) + 1) % SPEEDS.length])} className="rounded-full border border-fg/15 px-2.5 py-1 text-xs font-bold text-fg/70 hover:border-primary hover:text-primary">{speed}×</button>
                {queue.length > 1 && (
                  <button onClick={() => setShowQueue(!showQueue)} aria-label="Queue" className={cn('grid h-9 w-9 place-items-center rounded-full hover:bg-fg/5', showQueue ? 'text-primary' : 'text-fg/70')}><ListMusic className="h-4 w-4" /></button>
                )}
              </div>
              <button onClick={close} aria-label="Close player" className="grid h-9 w-9 place-items-center rounded-full text-fg/50 hover:bg-fg/5 hover:text-fg"><X className="h-4 w-4" /></button>
            </div>
            {showQueue && (
              <div className="site-container pb-4">
                <div className="max-h-64 overflow-y-auto rounded-theme border border-fg/10 bg-bg p-2">
                  {queue.map((t, i) => (
                    <button key={t.id} onClick={() => setIndex(i)} className={cn('flex w-full items-center gap-3 rounded-[calc(var(--radius)*0.6)] px-3 py-2 text-left text-sm', i === index ? 'bg-primary/10 font-bold text-primary' : 'text-fg/75 hover:bg-fg/5')}>
                      <span className="w-5 text-xs opacity-60">{i + 1}</span><span className="flex-1 truncate">{t.title}</span><span className="text-xs opacity-60">{formatDuration(t.duration)}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </AudioContext.Provider>
  );
}

export const useAudio = () => useContext(AudioContext) || { play: () => {}, current: null, playing: false };

// Play button usable from server components: pass the list of tracks and the index to start at.
export function PlayButton({ tracks, index = 0, className, size = 'md', label }) {
  const { play, current, playing } = useAudio();
  const active = current && current.id === tracks[index]?.id;
  const dims = size === 'lg' ? 'h-14 w-14' : size === 'sm' ? 'h-9 w-9' : 'h-11 w-11';
  const icon = size === 'lg' ? 'h-6 w-6' : 'h-4 w-4';
  return (
    <button
      type="button"
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); play(tracks, index); }}
      aria-label={active && playing ? 'Pause' : 'Play'}
      className={cn(label ? 'btn-site-primary' : cn('grid shrink-0 place-items-center rounded-full bg-primary text-white shadow-glow transition hover:scale-105', dims), className)}
    >
      {active && playing ? <Pause className={cn(icon, 'fill-current')} /> : <Play className={cn(icon, 'ml-0.5 fill-current')} />}
      {label && <span>{active && playing ? 'Pause' : label}</span>}
    </button>
  );
}

// Animated equalizer bars shown next to the currently playing episode.
export function NowPlaying({ id }) {
  const { current, playing } = useAudio();
  if (!current || current.id !== id) return null;
  return (
    <span className="flex h-4 items-end gap-0.5" aria-label="Now playing">
      {[0, 1, 2].map((i) => (
        <span key={i} className={cn('w-1 rounded-full bg-primary', playing ? 'animate-pulse' : '')} style={{ height: `${[60, 100, 40][i]}%`, animationDelay: `${i * 0.2}s`, animationDuration: '0.8s' }} />
      ))}
    </span>
  );
}
