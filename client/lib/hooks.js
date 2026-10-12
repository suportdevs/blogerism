'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from './api';

// Minimal data-fetching hook with refetch + optimistic setter.
export function useApi(path, params) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const key = JSON.stringify(params || {});
  const seq = useRef(0);

  const load = useCallback(async () => {
    if (!path) return;
    const id = ++seq.current;
    setLoading(true);
    try {
      const res = await api.get(path, JSON.parse(key));
      if (id === seq.current) { setData(res); setError(null); }
    } catch (e) {
      if (id === seq.current) setError(e);
    } finally {
      if (id === seq.current) setLoading(false);
    }
  }, [path, key]);

  useEffect(() => { load(); }, [load]);
  return { data, error, loading, reload: load, setData };
}

// Selection helper for bulk actions in tables.
export function useSelection(items = []) {
  const [selected, setSelected] = useState([]);
  const ids = items.map((i) => i.id);
  useEffect(() => { setSelected((s) => s.filter((id) => ids.includes(id))); }, [ids.join(',')]); // eslint-disable-line react-hooks/exhaustive-deps
  return {
    selected,
    clear: () => setSelected([]),
    isSelected: (id) => selected.includes(id),
    toggle: (id) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id])),
    allSelected: ids.length > 0 && ids.every((id) => selected.includes(id)),
    someSelected: selected.length > 0 && !ids.every((id) => selected.includes(id)),
    toggleAll: () => setSelected((s) => (ids.every((id) => s.includes(id)) ? [] : ids)),
  };
}

// Warn before leaving with unsaved changes.
export function useUnsavedWarning(dirty) {
  useEffect(() => {
    if (!dirty) return undefined;
    const handler = (e) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [dirty]);
}

// Ctrl/Cmd + S shortcut.
export function useSaveShortcut(fn) {
  const ref = useRef(fn);
  ref.current = fn;
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') { e.preventDefault(); ref.current(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);
}
