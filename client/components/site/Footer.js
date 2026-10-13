import Link from 'next/link';
import { Facebook, Github, Instagram, Linkedin, Mail, MapPin, Phone, Twitter, Youtube } from 'lucide-react';
import { Logo } from './Header';
import { NewsletterForm } from './forms';

const SOCIAL_ICONS = { facebook: Facebook, twitter: Twitter, instagram: Instagram, linkedin: Linkedin, youtube: Youtube, github: Github };

export function SocialLinks({ social }) {
  return (
    <div className="flex gap-2">
      {Object.entries(SOCIAL_ICONS).filter(([k]) => social[k]).map(([k, Icon]) => (
        <a key={k} href={social[k]} target="_blank" rel="noreferrer" aria-label={k} className="grid h-10 w-10 place-items-center rounded-full border border-fg/10 text-fg/60 transition hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:text-white">
          <Icon className="h-4 w-4" />
        </a>
      ))}
    </div>
  );
}

export default function Footer({ settings, menus }) {
  const { general, appearance, social, contact, advanced } = settings;
  const columns = [menus.footer, menus['footer-2']].filter(Boolean);
  const year = new Date().getFullYear();

  if (appearance.footerStyle === 'luxe') {
    const links = columns.flatMap((m) => m.items);
    return (
      <footer className="border-t border-fg/10 bg-surface">
        <div className="site-container py-20 text-center">
          <Link href="/" className="font-heading text-4xl uppercase tracking-[0.3em] text-fg sm:text-5xl">{general.siteName}</Link>
          {general.tagline && <p className="mt-4 font-heading text-lg italic text-fg/60">{general.tagline}</p>}
          <div className="mx-auto my-10 flex items-center justify-center gap-4 text-primary"><span className="h-px w-16 bg-primary/50" />✦<span className="h-px w-16 bg-primary/50" /></div>
          <nav className="flex flex-wrap justify-center gap-x-10 gap-y-3">
            {links.map((i) => <Link key={i.id} href={i.url} className="text-[11px] font-medium uppercase tracking-[0.3em] text-fg/70 transition hover:text-primary">{i.label}</Link>)}
          </nav>
          {advanced.enableNewsletter && (
            <div className="mx-auto mt-14 max-w-md">
              <div className="mb-4 text-[11px] font-medium uppercase tracking-[0.3em] text-fg/60">Join the private list</div>
              <NewsletterForm compact />
            </div>
          )}
          <div className="mt-12 flex justify-center"><SocialLinks social={social} /></div>
        </div>
        <div className="border-t border-fg/10 py-6 text-center text-[10.5px] uppercase tracking-[0.3em] text-fg/45">
          © {year} {general.siteName}{appearance.footerText && <span> · {appearance.footerText}</span>}
        </div>
      </footer>
    );
  }

  if (appearance.footerStyle === 'simple') {
    return (
      <footer className="border-t border-fg/10 bg-bg">
        <div className="site-container flex flex-col items-center justify-between gap-6 py-10 md:flex-row">
          <Logo general={general} />
          <nav className="flex flex-wrap justify-center gap-6">
            {columns.flatMap((m) => m.items).map((i) => <Link key={i.id} href={i.url} className="text-sm font-medium text-fg/60 hover:text-primary">{i.label}</Link>)}
          </nav>
          <SocialLinks social={social} />
        </div>
        <div className="border-t border-fg/10 py-5 text-center text-sm text-fg/50">© {year} {general.siteName}. {appearance.footerText}</div>
      </footer>
    );
  }

  return (
    <footer className="relative overflow-hidden border-t border-fg/10 bg-surface">
      <div className="pointer-events-none absolute -bottom-48 left-1/2 h-96 w-[800px] -translate-x-1/2 rounded-full bg-primary/10 blur-[100px]" />
      <div className="site-container relative grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <Logo general={general} />
          <p className="mt-4 max-w-xs leading-relaxed text-fg/60">{general.tagline}</p>
          <div className="mt-6"><SocialLinks social={social} /></div>
        </div>
        {columns.map((menu) => (
          <div key={menu.name}>
            <h4 className="mb-4 font-heading text-sm font-bold uppercase tracking-wider text-fg">{menu.name.replace(/^Footer\s*[—-]\s*/i, '')}</h4>
            <ul className="space-y-3">
              {menu.items.map((i) => <li key={i.id}><Link href={i.url} target={i.target} className="text-fg/60 transition hover:text-primary">{i.label}</Link></li>)}
            </ul>
          </div>
        ))}
        <div>
          <h4 className="mb-4 font-heading text-sm font-bold uppercase tracking-wider text-fg">Contact</h4>
          <ul className="space-y-3 text-fg/60">
            {contact.email && <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /><a href={`mailto:${contact.email}`} className="hover:text-primary">{contact.email}</a></li>}
            {contact.phone && <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" />{contact.phone}</li>}
            {contact.address && <li className="flex items-start gap-2"><MapPin className="mt-1 h-4 w-4 shrink-0 text-primary" />{contact.address}</li>}
          </ul>
        </div>
      </div>
      {advanced.enableNewsletter && (
        <div className="site-container relative">
          <div className="flex flex-col items-center gap-6 rounded-theme-lg border border-fg/10 bg-bg p-6 md:flex-row md:p-8">
            <div className="flex-1 text-center md:text-left">
              <h4 className="font-heading text-xl font-bold text-fg">Join our newsletter</h4>
              <p className="text-sm text-fg/60">The best articles, delivered monthly.</p>
            </div>
            <NewsletterForm className="md:max-w-md" />
          </div>
        </div>
      )}
      <div className="site-container relative flex flex-col items-center justify-between gap-2 py-8 text-sm text-fg/50 md:flex-row">
        <span>© {year} {general.siteName}. All rights reserved.</span>
        <span>{appearance.footerText}</span>
      </div>
    </footer>
  );
}
