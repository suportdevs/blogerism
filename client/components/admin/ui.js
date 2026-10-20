'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, ChevronLeft, ChevronRight, Inbox, Loader2, Search, X } from 'lucide-react';
import { cn, initials } from '@/lib/utils';

export function Spinner({ className }) {
  return <Loader2 className={cn('h-4 w-4 animate-spin', className)} />;
}

export function PageLoader() {
  return (
    <div className="grid min-h-[50vh] place-items-center">
      <div className="flex items-center gap-3 text-sm font-medium text-ink-400"><Spinner className="h-5 w-5 text-brand-500" />Loading…</div>
    </div>
  );
}

export function PageHeader({ title, description, actions, back }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        {back}
        <h1 className="text-2xl font-extrabold tracking-tight text-ink-900 dark:text-white">{title}</h1>
        {description && <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Card({ className, children, title, description, actions, bodyClassName }) {
  return (
    <div className={cn('a-card', className)}>
      {(title || actions) && (
        <div className="flex items-center justify-between gap-4 border-b border-ink-100 px-5 py-4 dark:border-white/5">
          <div>
            {title && <h3 className="font-bold text-ink-900 dark:text-white">{title}</h3>}
            {description && <p className="mt-0.5 text-xs text-ink-400">{description}</p>}
          </div>
          {actions}
        </div>
      )}
      <div className={cn('p-5', bodyClassName)}>{children}</div>
    </div>
  );
}

const BADGE = {
  gray: 'bg-ink-100 text-ink-600 dark:bg-white/5 dark:text-ink-300',
  green: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
  amber: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
  red: 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400',
  blue: 'bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400',
  brand: 'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300',
};

export function Badge({ color = 'gray', children, dot, className }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold', BADGE[color], className)}>
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}

export const STATUS_COLORS = { PUBLISHED: 'green', DRAFT: 'gray', SCHEDULED: 'blue', TRASH: 'red', CONFIRMED: 'green', CANCELLED: 'red', UNREAD: 'brand', READ: 'gray', REPLIED: 'green', PENDING: 'amber', APPROVED: 'green', SPAM: 'red' };
export function StatusBadge({ status }) {
  return <Badge color={STATUS_COLORS[status] || 'gray'} dot>{status.charAt(0) + status.slice(1).toLowerCase()}</Badge>;
}

export function Avatar({ src, name, size = 36, className }) {
  if (src) return <img src={src} alt={name} style={{ width: size, height: size }} className={cn('shrink-0 rounded-full object-cover', className)} />;
  return (
    <span style={{ width: size, height: size, fontSize: size * 0.38 }} className={cn('grid shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-400 to-fuchsia-500 font-bold text-white', className)}>
      {initials(name)}
    </span>
  );
}

export function Field({ label, hint, error, children, className, required }) {
  return (
    <div className={className}>
      {label && <label className="a-label">{label}{required && <span className="text-rose-500"> *</span>}</label>}
      {children}
      {error ? <p className="mt-1 text-xs text-rose-500">{error}</p> : hint && <p className="a-hint">{hint}</p>}
    </div>
  );
}

export function Toggle({ checked, onChange, label, description, className }) {
  return (
    <label className={cn('flex cursor-pointer items-start justify-between gap-4', className)}>
      {(label || description) && (
        <span>
          {label && <span className="block text-sm font-semibold text-ink-800 dark:text-ink-100">{label}</span>}
          {description && <span className="block text-xs text-ink-400">{description}</span>}
        </span>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={!!checked}
        onClick={() => onChange(!checked)}
        className={cn('relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition', checked ? 'bg-brand-500' : 'bg-ink-200 dark:bg-white/10')}
      >
        <span className={cn('absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all', checked ? 'left-[22px]' : 'left-0.5')} />
      </button>
    </label>
  );
}

export function SearchInput({ value, onChange, placeholder = 'Search…', className }) {
  const [local, setLocal] = useState(value || '');
  const timer = useRef();
  useEffect(() => setLocal(value || ''), [value]);
  return (
    <div className={cn('relative', className)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
      <input
        value={local}
        placeholder={placeholder}
        onChange={(e) => {
          setLocal(e.target.value);
          clearTimeout(timer.current);
          const v = e.target.value;
          timer.current = setTimeout(() => onChange(v), 300);
        }}
        className="a-input pl-9"
      />
    </div>
  );
}

export function Tabs({ tabs, value, onChange, className }) {
  return (
    <div className={cn('inline-flex flex-wrap gap-1 rounded-xl bg-ink-100/80 p-1 dark:bg-white/5', className)}>
      {tabs.map((t) => (
        <button
          key={t.value}
          type="button"
          onClick={() => onChange(t.value)}
          className={cn(
            'flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-semibold transition',
            value === t.value ? 'bg-white text-ink-900 shadow-sm dark:bg-ink-800 dark:text-white' : 'text-ink-500 hover:text-ink-800 dark:text-ink-400 dark:hover:text-white',
          )}
        >
          {t.icon && <t.icon className="h-4 w-4" />}
          {t.label}
          {t.count != null && <span className="rounded-full bg-ink-200/70 px-1.5 text-[11px] dark:bg-white/10">{t.count}</span>}
        </button>
      ))}
    </div>
  );
}

export function EmptyState({ icon: Icon = Inbox, title = 'Nothing here yet', description, action }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-500 dark:bg-brand-500/10"><Icon className="h-6 w-6" /></div>
      <h3 className="font-bold text-ink-900 dark:text-white">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-ink-500">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function Pagination({ meta, onChange }) {
  if (!meta || meta.pages <= 1) return null;
  const from = (meta.page - 1) * meta.limit + 1;
  const to = Math.min(meta.total, meta.page * meta.limit);
  return (
    <div className="flex items-center justify-between gap-4 border-t border-ink-100 px-4 py-3 text-sm dark:border-white/5">
      <span className="text-ink-500">Showing <b className="text-ink-800 dark:text-ink-100">{from}–{to}</b> of {meta.total}</span>
      <div className="flex gap-1">
        <button className="a-btn-secondary a-btn-icon h-8 w-8" disabled={meta.page <= 1} onClick={() => onChange(meta.page - 1)}><ChevronLeft className="h-4 w-4" /></button>
        <span className="grid h-8 min-w-8 place-items-center px-2 font-semibold">{meta.page} / {meta.pages}</span>
        <button className="a-btn-secondary a-btn-icon h-8 w-8" disabled={meta.page >= meta.pages} onClick={() => onChange(meta.page + 1)}><ChevronRight className="h-4 w-4" /></button>
      </div>
    </div>
  );
}

export function Modal({ open, onClose, title, description, children, footer, size = 'md' }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open, onClose]);
  if (!open || !mounted) return null;
  const width = { sm: 'max-w-md', md: 'max-w-xl', lg: 'max-w-3xl', xl: 'max-w-5xl', full: 'max-w-[1200px]' }[size];
  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto p-4 sm:items-center">
      <div className="fixed inset-0 bg-ink-950/50 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className={cn('relative my-8 flex max-h-[calc(100vh-4rem)] w-full flex-col overflow-hidden rounded-2xl border border-ink-200/60 bg-white shadow-2xl animate-scale-in dark:border-white/10 dark:bg-ink-900', width)}>
        {title && (
          <div className="flex items-start justify-between gap-4 border-b border-ink-100 px-6 py-4 dark:border-white/5">
            <div>
              <h2 className="text-lg font-bold text-ink-900 dark:text-white">{title}</h2>
              {description && <p className="mt-0.5 text-sm text-ink-500">{description}</p>}
            </div>
            <button onClick={onClose} className="a-btn-ghost a-btn-icon -mr-2 h-8 w-8"><X className="h-4 w-4" /></button>
          </div>
        )}
        <div className="a-scroll flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {footer && <div className="flex justify-end gap-2 border-t border-ink-100 bg-ink-50/50 px-6 py-3.5 dark:border-white/5 dark:bg-white/[.02]">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}

/* ---- Confirm dialog (promise based) ---- */
const ConfirmContext = createContext(null);

export function ConfirmProvider({ children }) {
  const [state, setState] = useState(null);
  const confirm = useCallback((opts) => new Promise((resolve) => setState({ ...opts, resolve })), []);
  const close = (v) => { state?.resolve(v); setState(null); };
  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <Modal open={!!state} onClose={() => close(false)} size="sm">
        {state && (
          <div className="flex gap-4">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-rose-50 text-rose-500 dark:bg-rose-500/10"><AlertTriangle className="h-5 w-5" /></div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-ink-900 dark:text-white">{state.title || 'Are you sure?'}</h3>
              <p className="mt-1 text-sm text-ink-500">{state.message || 'This action cannot be undone.'}</p>
              <div className="mt-6 flex justify-end gap-2">
                <button className="a-btn-secondary" onClick={() => close(false)}>Cancel</button>
                <button className="a-btn-danger" autoFocus onClick={() => close(true)}>{state.confirmLabel || 'Delete'}</button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </ConfirmContext.Provider>
  );
}

export const useConfirm = () => useContext(ConfirmContext);

export function Dropdown({ trigger, children, align = 'right', className }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  useEffect(() => {
    const onClick = (e) => !ref.current?.contains(e.target) && setOpen(false);
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);
  return (
    <div ref={ref} className="relative">
      <div onClick={() => setOpen((o) => !o)}>{trigger}</div>
      {open && (
        <div onClick={() => setOpen(false)} className={cn('absolute z-50 mt-2 min-w-[200px] rounded-xl border border-ink-200/70 bg-white p-1.5 shadow-xl animate-scale-in dark:border-white/10 dark:bg-ink-850', align === 'right' ? 'right-0' : 'left-0', className)}>
          {children}
        </div>
      )}
    </div>
  );
}

export function DropdownItem({ icon: Icon, children, onClick, danger, href }) {
  const cls = cn('flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium transition', danger ? 'text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10' : 'text-ink-700 hover:bg-ink-50 dark:text-ink-200 dark:hover:bg-white/5');
  if (href) return <a href={href} target="_blank" rel="noreferrer" className={cls}>{Icon && <Icon className="h-4 w-4" />}{children}</a>;
  return <button type="button" onClick={onClick} className={cls}>{Icon && <Icon className="h-4 w-4" />}{children}</button>;
}

export function Checkbox({ checked, onChange, indeterminate }) {
  const ref = useRef();
  useEffect(() => { if (ref.current) ref.current.indeterminate = !!indeterminate; }, [indeterminate]);
  return (
    <input
      ref={ref}
      type="checkbox"
      checked={!!checked}
      onChange={(e) => onChange(e.target.checked)}
      className="h-4 w-4 cursor-pointer rounded border-ink-300 accent-brand-500"
    />
  );
}

export function ColorInput({ value, onChange }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-ink-200 bg-white p-1 pr-3 dark:border-white/10 dark:bg-ink-950/60">
      <label className="relative h-8 w-8 shrink-0 cursor-pointer overflow-hidden rounded-lg ring-1 ring-black/10" style={{ background: value }}>
        <input type="color" value={value || '#000000'} onChange={(e) => onChange(e.target.value)} className="absolute inset-0 cursor-pointer opacity-0" />
      </label>
      <input value={value || ''} onChange={(e) => onChange(e.target.value)} className="w-full bg-transparent font-mono text-sm uppercase text-ink-800 outline-none dark:text-ink-100" />
    </div>
  );
}
