'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ChevronDown, ChevronRight } from 'lucide-react';
import { ICONS } from '@/lib/icons';
import { cn } from '@/lib/utils';

/*
 * Shared navigation for every theme header.
 * Menus are up to three levels deep: top items open a dropdown (level 2) whose items open a
 * flyout (level 3) — or, when the top item is marked "mega", a full-width panel where level 2
 * items become columns and level 3 items the links inside them.
 */

export const isActive = (pathname, url) => !!url && url !== '#' && (url === '/' ? pathname === '/' : pathname.startsWith(url.split('#')[0] || '#'));
const hasKids = (item) => item.children?.length > 0;
const isHeading = (item) => !item.url || item.url === '#';

function ItemLink({ item, className, children, onNavigate }) {
  if (isHeading(item)) return <span className={className}>{children}</span>;
  return <Link href={item.url} target={item.target} onClick={onNavigate} className={className}>{children}</Link>;
}

const Badge = ({ text }) => (text ? <span className="rounded-full bg-primary px-1.5 py-px text-[10px] font-bold uppercase leading-4 tracking-wide text-white">{text}</span> : null);

function Icon({ name, className }) {
  const I = ICONS[name];
  return I ? <I className={className} /> : null;
}

// One row inside a dropdown / mega column: icon, label, badge and description.
function RichLink({ item, onNavigate, active, trailing }) {
  return (
    <ItemLink
      item={item}
      onNavigate={onNavigate}
      className={cn('group/link flex items-start gap-3 rounded-[calc(var(--radius)*0.6)] px-3 py-2.5 transition', active ? 'bg-primary/10 text-primary' : 'text-fg/80 hover:bg-primary/10 hover:text-primary')}
    >
      {item.icon && (
        <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-[calc(var(--radius)*0.6)] bg-primary/10 text-primary transition group-hover/link:bg-primary group-hover/link:text-white">
          <Icon name={item.icon} className="h-4 w-4" />
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2 text-sm font-semibold">{item.label}<Badge text={item.badge} /></span>
        {item.description && <span className="mt-0.5 block text-xs leading-snug text-fg/55">{item.description}</span>}
      </span>
      {trailing}
    </ItemLink>
  );
}

/* --------------------------- Classic dropdown (+ flyout) --------------------------- */
function Dropdown({ item, pathname, onNavigate, align }) {
  const wide = item.children.some((c) => c.description || c.icon);
  return (
    <div className={cn('rounded-theme border border-fg/10 bg-bg p-2 text-fg shadow-2xl', wide ? 'w-80' : 'w-60')}>
      {item.children.map((c) => (
        <div key={c.id} className="group/sub relative">
          <RichLink
            item={c}
            onNavigate={onNavigate}
            active={isActive(pathname, c.url)}
            trailing={hasKids(c) && <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-fg/40 transition group-hover/sub:translate-x-0.5 group-hover/sub:text-primary" />}
          />
          {hasKids(c) && (
            // Level 3 flyout; opens to the left when the dropdown is near the right edge.
            <div className={cn('invisible absolute top-0 z-10 opacity-0 transition duration-200 group-hover/sub:visible group-hover/sub:opacity-100 group-focus-within/sub:visible group-focus-within/sub:opacity-100', align === 'right' ? 'right-full pr-2' : 'left-full pl-2')}>
              <div className={cn('rounded-theme border border-fg/10 bg-bg p-2 shadow-2xl', c.children.some((x) => x.description || x.icon) ? 'w-72' : 'w-56')}>
                {c.children.map((g) => <RichLink key={g.id} item={g} onNavigate={onNavigate} active={isActive(pathname, g.url)} />)}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------ Mega panel ------------------------------------ */
function MegaPanel({ item, pathname, onNavigate }) {
  const columns = item.children;
  const feature = item.image || item.description;
  const cols = Math.min(4, Math.max(2, columns.length));
  return (
    <div className="border-y border-fg/10 bg-bg text-fg shadow-2xl">
      <div className={cn('mx-auto grid max-w-container gap-8 px-5 py-8 sm:px-8', feature && 'lg:grid-cols-[1fr_300px]')}>
        <div className="grid gap-x-6 gap-y-8" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
          {columns.map((col) => (hasKids(col) ? (
            <div key={col.id} className="min-w-0">
              <ItemLink item={col} onNavigate={onNavigate} className={cn('mb-2 flex items-center gap-2 px-3 text-xs font-bold uppercase tracking-[0.15em]', isHeading(col) ? 'text-fg/45' : 'text-fg/45 hover:text-primary')}>
                {col.icon && <Icon name={col.icon} className="h-3.5 w-3.5" />}{col.label}<Badge text={col.badge} />
              </ItemLink>
              {col.description && <p className="mb-2 px-3 text-xs text-fg/50">{col.description}</p>}
              <div className="space-y-0.5">{col.children.map((g) => <RichLink key={g.id} item={g} onNavigate={onNavigate} active={isActive(pathname, g.url)} />)}</div>
            </div>
          ) : (
            // A level-2 item without children is shown as a single rich link.
            <div key={col.id} className="min-w-0"><RichLink item={col} onNavigate={onNavigate} active={isActive(pathname, col.url)} /></div>
          )))}
        </div>
        {feature && (
          <ItemLink item={item} onNavigate={onNavigate} className="group/feat relative hidden min-h-[220px] overflow-hidden rounded-theme-lg bg-gradient-to-br from-primary to-accent text-white lg:block">
            {item.image && <img src={item.image} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover/feat:scale-105" />}
            <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <span className="absolute inset-x-0 bottom-0 p-5">
              <span className="block font-heading text-xl font-bold">{item.label}</span>
              {item.description && <span className="mt-1 block text-sm text-white/80">{item.description}</span>}
              {!isHeading(item) && <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold">Explore<ArrowRight className="h-4 w-4 transition group-hover/feat:translate-x-1" /></span>}
            </span>
          </ItemLink>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------ Desktop nav ------------------------------------ */
/**
 * items: menu tree. renderTop(item, { active, open, hasChildren }) returns the top-level label.
 * Mega panels are positioned against the nearest positioned ancestor (the header bar), so the
 * nav itself must not be `relative`.
 */
export function DesktopNav({ items, className, renderTop, megaClassName }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(null);
  const timer = useRef();
  useEffect(() => { setOpen(null); }, [pathname]);
  useEffect(() => {
    const esc = (e) => e.key === 'Escape' && setOpen(null);
    document.addEventListener('keydown', esc);
    return () => document.removeEventListener('keydown', esc);
  }, []);
  // Small hover-intent delay so moving diagonally into a panel doesn't close it.
  const enter = (id) => { clearTimeout(timer.current); setOpen(id); };
  const leave = () => { clearTimeout(timer.current); timer.current = setTimeout(() => setOpen(null), 160); };
  const close = () => setOpen(null);

  return (
    <nav className={className} onMouseLeave={leave}>
      {items.map((item, i) => {
        const kids = hasKids(item);
        const on = open === item.id;
        const active = isActive(pathname, item.url) || (item.children || []).some((c) => isActive(pathname, c.url) || (c.children || []).some((g) => isActive(pathname, g.url)));
        const label = renderTop(item, { active, open: on, hasChildren: kids });
        return (
          <div
            key={item.id}
            className={cn(!item.mega && 'relative')}
            onMouseEnter={() => (kids ? enter(item.id) : (clearTimeout(timer.current), setOpen(null)))}
            onFocus={() => kids && enter(item.id)}
          >
            {isHeading(item) ? (
              <button type="button" aria-expanded={kids ? on : undefined} onClick={() => setOpen(on ? null : item.id)} className="contents">{label}</button>
            ) : (
              <Link href={item.url} target={item.target} aria-expanded={kids ? on : undefined} onClick={close} className="contents">{label}</Link>
            )}
            {kids && (
              <div
                onMouseEnter={() => enter(item.id)}
                className={cn(
                  'absolute top-full z-50 transition duration-200',
                  item.mega ? cn('inset-x-0', megaClassName) : cn('pt-3', i > items.length / 2 && items.length > 3 ? 'right-0' : 'left-1/2 -translate-x-1/2'),
                  on ? 'visible translate-y-0 opacity-100' : 'invisible translate-y-2 opacity-0',
                  item.mega && !on && 'translate-y-0',
                )}
              >
                {item.mega ? <MegaPanel item={item} pathname={pathname} onNavigate={close} /> : <Dropdown item={item} pathname={pathname} onNavigate={close} align={i > items.length / 2 && items.length > 3 ? 'right' : 'left'} />}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}

// Small chevron for top-level items that have a dropdown.
export const Caret = ({ open, className }) => <ChevronDown className={cn('h-3.5 w-3.5 transition-transform duration-200', open && 'rotate-180', className)} />;

/* ------------------------------------ Mobile tree ------------------------------------ */
// Accordion used by every mobile drawer. `size` controls the top-level text size.
export function MobileNavTree({ items, onNavigate, size = 'md', className }) {
  const pathname = usePathname();
  return <div className={cn('flex flex-col', className)}>{items.map((item) => <MobileNode key={item.id} item={item} depth={0} pathname={pathname} onNavigate={onNavigate} size={size} />)}</div>;
}

function MobileNode({ item, depth, pathname, onNavigate, size }) {
  const contains = (it) => isActive(pathname, it.url) || (it.children || []).some(contains);
  // Branches start closed unless the current page is inside them.
  const [open, setOpen] = useState(() => hasKids(item) && (item.children || []).some(contains));
  const kids = hasKids(item);
  const active = isActive(pathname, item.url);
  const text = depth === 0 ? (size === 'lg' ? 'font-heading text-3xl' : 'font-semibold') : depth === 1 ? 'text-[15px] font-medium' : 'text-sm';
  return (
    <div className={cn(depth > 0 && 'border-l border-fg/10', depth === 1 && 'ml-4', depth === 2 && 'ml-3')}>
      <div className="flex items-center">
        <ItemLink
          item={item}
          onNavigate={onNavigate}
          className={cn('flex min-w-0 flex-1 items-center gap-2.5 rounded-theme px-4 py-2.5 transition', text, active ? 'text-primary' : depth ? 'text-fg/70 hover:text-primary' : 'text-fg hover:text-primary', isHeading(item) && kids && 'cursor-default')}
        >
          {item.icon && <Icon name={item.icon} className="h-4 w-4 shrink-0 text-primary" />}
          <span className="truncate">{item.label}</span><Badge text={item.badge} />
        </ItemLink>
        {kids && (
          <button type="button" onClick={() => setOpen(!open)} aria-label={open ? 'Collapse' : 'Expand'} aria-expanded={open} className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-fg/50 hover:bg-fg/5 hover:text-fg">
            <ChevronDown className={cn('h-4 w-4 transition-transform', open && 'rotate-180')} />
          </button>
        )}
      </div>
      {kids && (
        <div className={cn('grid transition-all duration-300', open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0')}>
          <div className="overflow-hidden">
            {item.children.map((c) => <MobileNode key={c.id} item={c} depth={depth + 1} pathname={pathname} onNavigate={onNavigate} size={size} />)}
          </div>
        </div>
      )}
    </div>
  );
}
