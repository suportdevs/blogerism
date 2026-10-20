'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Cookie, MessageCircle, Phone, X } from 'lucide-react';
import { cn } from '@/lib/utils';

/*
 * Site-wide widgets: analytics/marketing tags (Google Analytics, Tag Manager, Meta Pixel), the cookie consent banner
 * (when it is on, tags only load after "Accept") and the floating WhatsApp / call button. Nothing runs inside the
 * admin's preview frame.
 */

const CONSENT_KEY = 'cookie-consent';
const readConsent = () => { try { return localStorage.getItem(CONSENT_KEY); } catch { return null; } };
const writeConsent = (v) => { try { localStorage.setItem(CONSENT_KEY, v); } catch { /* private mode */ } };

function addScript({ src, code }) {
  const s = document.createElement('script');
  if (src) { s.src = src; s.async = true; } else s.text = code;
  document.head.appendChild(s);
}

const safeId = (v) => String(v || '').trim().replace(/[^\w-]/g, '');

function loadTrackers(seo) {
  if (window.__siteTrackersLoaded) return;
  window.__siteTrackersLoaded = true;
  const ga = safeId(seo.googleAnalyticsId);
  const gtm = safeId(seo.googleTagManagerId);
  const pixel = safeId(seo.facebookPixelId);
  if (ga) {
    addScript({ src: `https://www.googletagmanager.com/gtag/js?id=${ga}` });
    addScript({ code: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${ga}');` });
  }
  if (gtm) addScript({ code: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtm}');` });
  if (pixel) addScript({ code: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${pixel}');fbq('track','PageView');` });
}

function CookieBanner({ consent, onChoice }) {
  return (
    <div role="dialog" aria-live="polite" aria-label="Cookie consent" className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-3xl animate-fade-up rounded-theme-lg border border-fg/10 bg-bg/95 p-4 shadow-2xl backdrop-blur-xl sm:inset-x-6 sm:bottom-6 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex flex-1 gap-3">
          <Cookie className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <p className="text-sm leading-relaxed text-fg/75">
            {consent.text}{' '}
            {consent.policyUrl && <Link href={consent.policyUrl} className="font-semibold text-primary underline-offset-2 hover:underline">Learn more</Link>}
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button onClick={() => onChoice('declined')} className="btn-site-ghost !px-4 !py-2 text-sm">{consent.declineLabel || 'Decline'}</button>
          <button onClick={() => onChoice('accepted')} className="btn-site-primary !px-5 !py-2 text-sm">{consent.acceptLabel || 'Accept'}</button>
        </div>
      </div>
    </div>
  );
}

function FloatingContact({ contact }) {
  const fb = contact.floatingButton || {};
  const [hint, setHint] = useState(false);
  const wa = String(contact.whatsapp || '').replace(/\D/g, '');
  const phone = String(contact.phone || '').replace(/[^\d+]/g, '');
  const showWa = fb.whatsapp && wa;
  const showCall = fb.call && phone;
  useEffect(() => {
    if (!showWa) return undefined;
    const t = setTimeout(() => setHint(true), 6000);
    return () => clearTimeout(t);
  }, [showWa]);
  if (!showWa && !showCall) return null;
  return (
    <div className="fixed bottom-24 right-6 z-40 flex flex-col items-end gap-3">
      {hint && showWa && (
        <div className="relative max-w-[220px] animate-fade-up rounded-2xl rounded-br-sm bg-bg px-4 py-3 text-sm text-fg shadow-xl ring-1 ring-fg/10">
          <button onClick={() => setHint(false)} aria-label="Close" className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-fg/80 text-bg"><X className="h-3.5 w-3.5" /></button>
          👋 Need help? Chat with us on WhatsApp.
        </div>
      )}
      {showCall && (
        <a href={`tel:${phone}`} aria-label={`Call ${contact.phone}`} title={`Call ${contact.phone}`} className="grid h-12 w-12 place-items-center rounded-full bg-primary text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-glow">
          <Phone className="h-5 w-5" />
        </a>
      )}
      {showWa && (
        <a
          href={`https://wa.me/${wa}${fb.message ? `?text=${encodeURIComponent(fb.message)}` : ''}`}
          target="_blank"
          rel="noreferrer"
          aria-label="Chat on WhatsApp"
          title="Chat on WhatsApp"
          onClick={() => setHint(false)}
          className="relative grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/40 transition hover:-translate-y-0.5"
        >
          <span aria-hidden className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-25" />
          <MessageCircle className="relative h-7 w-7" />
        </a>
      )}
    </div>
  );
}

export default function SiteWidgets({ seo = {}, contact = {}, consent = {} }) {
  const [state, setState] = useState({ ready: false, choice: null, preview: false });

  useEffect(() => {
    const preview = window.parent !== window;
    const choice = readConsent();
    setState({ ready: true, choice, preview });
    if (preview) return;
    if (!consent.enabled || choice === 'accepted') loadTrackers(seo);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const choose = (choice) => {
    writeConsent(choice);
    setState((s) => ({ ...s, choice }));
    if (choice === 'accepted') loadTrackers(seo);
  };

  if (!state.ready || state.preview) return null;
  return (
    <>
      {contact.floatingButton?.enabled && <FloatingContact contact={contact} />}
      {consent.enabled && !state.choice && <CookieBanner consent={consent} onChoice={choose} />}
    </>
  );
}

// Re-opens the cookie banner (e.g. from a "Cookie settings" link in the footer or privacy page).
export function resetCookieConsent() {
  try { localStorage.removeItem(CONSENT_KEY); } catch { /* ignore */ }
  window.location.reload();
}
export function CookieSettingsLink({ className, children = 'Cookie settings' }) {
  return <button type="button" onClick={resetCookieConsent} className={cn('hover:text-primary', className)}>{children}</button>;
}
