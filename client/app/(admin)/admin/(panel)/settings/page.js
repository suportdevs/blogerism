'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Code2, Globe, Heart, Loader2, Mail, Save, Search, Send, Settings, Share2, Facebook, Twitter, Instagram, Linkedin, Youtube, Github, AtSign, MessageCircle, PhoneCall } from 'lucide-react';
import { api } from '@/lib/api';
import { useApi, useSaveShortcut } from '@/lib/hooks';
import { cn } from '@/lib/utils';
import { ImageField } from '@/components/admin/Media';
import { Card, Field, PageHeader, PageLoader, Toggle } from '@/components/admin/ui';

const TABS = [
  { key: 'general', label: 'General', icon: Settings, description: 'Site identity, homepage and reading options' },
  { key: 'seo', label: 'SEO', icon: Search, description: 'Default meta tags, indexing and analytics' },
  { key: 'social', label: 'Social', icon: Share2, description: 'Profiles linked in the header and footer' },
  { key: 'contact', label: 'Contact', icon: Mail, description: 'Details shown on contact blocks and footer' },
  { key: 'engagement', label: 'Engagement', icon: Heart, description: 'Comments, likes, sharing, saving and following on your site' },
  { key: 'email', label: 'Email', icon: AtSign, description: 'SMTP server for notifications, booking confirmations and replies' },
  { key: 'advanced', label: 'Advanced', icon: Code2, description: 'Cookie banner, custom code and feature toggles' },
];

// Common SMTP servers, to fill host/port in one click.
const SMTP_PRESETS = [
  ['Gmail / Google Workspace', 'smtp.gmail.com', 465, true, 'Use an App Password (Google Account → Security → App passwords).'],
  ['Outlook / Microsoft 365', 'smtp.office365.com', 587, false, ''],
  ['Zoho Mail', 'smtp.zoho.com', 465, true, ''],
  ['cPanel / hosting mail', 'mail.yourdomain.com', 465, true, 'Replace yourdomain.com with your domain.'],
  ['Brevo (Sendinblue)', 'smtp-relay.brevo.com', 587, false, ''],
];
const SOCIAL = [['facebook', Facebook], ['twitter', Twitter], ['instagram', Instagram], ['linkedin', Linkedin], ['youtube', Youtube], ['github', Github]];

export default function SettingsPage() {
  const [tab, setTab] = useState(() => (typeof window !== 'undefined' && TABS.some((t) => t.key === new URLSearchParams(window.location.search).get('tab')) ? new URLSearchParams(window.location.search).get('tab') : 'general'));
  const [testTo, setTestTo] = useState('');
  const [testing, setTesting] = useState(false);
  const [all, setAll] = useState(null);
  const [saving, setSaving] = useState(false);
  const { data: pages } = useApi('/admin/pages', { limit: 100, status: 'PUBLISHED' });

  useEffect(() => { api.get('/admin/settings').then(setAll); }, []);
  const save = async () => {
    setSaving(true);
    try {
      setAll(await api.put(`/admin/settings/${tab}`, all[tab]));
      toast.success('Settings saved');
    } catch (e) { toast.error(e.message); } finally { setSaving(false); }
  };
  useSaveShortcut(() => all && save());
  if (!all) return <PageLoader />;

  const s = all[tab];
  const set = (k) => (v) => setAll((a) => ({ ...a, [tab]: { ...a[tab], [k]: v } }));
  const input = (k, props = {}) => <input className="a-input" value={s[k] ?? ''} onChange={(e) => set(k)(props.type === 'number' ? Number(e.target.value) : e.target.value)} {...props} />;
  const meta = TABS.find((t) => t.key === tab);
  const setNested = (k, sub) => (v) => set(k)({ ...(s[k] || {}), [sub]: v });
  const sendTest = async () => {
    setTesting(true);
    try {
      setAll(await api.put('/admin/settings/email', all.email)); // test what is on screen
      const r = await api.post('/admin/settings/email/test', { to: testTo });
      toast.success(r.message);
    } catch (e) { toast.error(e.message, { duration: 10000 }); } finally { setTesting(false); }
  };

  return (
    <>
      <PageHeader title="Settings" description="Configure how your website works." actions={<button onClick={save} disabled={saving} className="a-btn-primary">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}Save changes</button>} />
      <div className="grid items-start gap-6 lg:grid-cols-[240px_1fr]">
        <nav className="a-card p-2 lg:sticky lg:top-24">
          {TABS.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)} className={cn('flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition', tab === t.key ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-200' : 'text-ink-600 hover:bg-ink-50 dark:text-ink-300 dark:hover:bg-white/5')}>
              <t.icon className="h-4 w-4" />{t.label}
            </button>
          ))}
        </nav>

        <Card title={meta.label} description={meta.description}>
          {tab === 'general' && (
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Site name">{input('siteName')}</Field>
              <Field label="Tagline">{input('tagline')}</Field>
              <Field label="Logo (light)" hint="Leave empty to use the generated logo mark."><ImageField value={s.logo} onChange={set('logo')} aspect="aspect-[3/1]" /></Field>
              <Field label="Logo (dark mode)"><ImageField value={s.logoDark} onChange={set('logoDark')} aspect="aspect-[3/1]" /></Field>
              <Field label="Favicon"><ImageField value={s.favicon} onChange={set('favicon')} aspect="aspect-square w-24" /></Field>
              <div className="space-y-5">
                <Field label="Homepage" hint="Which page is shown at the site root.">
                  <select className="a-input" value={s.homepageId || ''} onChange={(e) => set('homepageId')(e.target.value ? Number(e.target.value) : null)}>
                    <option value="">— Page with slug “home” —</option>
                    {pages?.items.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
                  </select>
                </Field>
                <Field label="Posts per page">{input('postsPerPage', { type: 'number', min: 1, max: 50 })}</Field>
              </div>
              <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4 dark:border-amber-500/20 dark:bg-amber-500/5 md:col-span-2">
                <Toggle label="Maintenance mode" description="Visitors see a maintenance screen. The admin panel keeps working." checked={s.maintenanceMode} onChange={set('maintenanceMode')} />
                {s.maintenanceMode && <textarea className="a-textarea mt-3" rows={2} value={s.maintenanceMessage} onChange={(e) => set('maintenanceMessage')(e.target.value)} />}
              </div>
            </div>
          )}

          {tab === 'seo' && (
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Default meta title" className="md:col-span-2">{input('metaTitle')}</Field>
              <Field label="Default meta description" className="md:col-span-2"><textarea className="a-textarea" rows={3} value={s.metaDescription} onChange={(e) => set('metaDescription')(e.target.value)} /></Field>
              <Field label="Keywords" hint="Comma separated">{input('metaKeywords')}</Field>
              <Field label="Title separator" hint="Used as “Post title | Site name”">{input('titleSeparator')}</Field>
              <Field label="Twitter / X handle">{input('twitterHandle', { placeholder: '@yourbrand' })}</Field>
              <Field label="Google Analytics ID">{input('googleAnalyticsId', { placeholder: 'G-XXXXXXX' })}</Field>
              <Field label="Google Tag Manager ID">{input('googleTagManagerId', { placeholder: 'GTM-XXXXXXX' })}</Field>
              <Field label="Facebook (Meta) Pixel ID" hint="Tracks visits for Facebook & Instagram ads">{input('facebookPixelId', { placeholder: '123456789012345' })}</Field>
              <Field label="Google Search Console verification" hint="Only the content value of the meta tag">{input('googleVerification', { placeholder: 'abc123…' })}</Field>
              <Field label="Bing Webmaster verification" hint="Only the content value of the msvalidate.01 tag">{input('bingVerification')}</Field>
              <Field label="Default social image" hint="1200×630 recommended"><ImageField value={s.ogImage} onChange={set('ogImage')} /></Field>
              <div className="space-y-3">
                <Toggle label="Allow search engines to index this site" checked={s.allowIndexing} onChange={set('allowIndexing')} />
                <div className="rounded-xl bg-ink-50 p-4 text-sm text-ink-500 dark:bg-white/5">
                  <Globe className="mb-1 inline h-4 w-4" /> Sitemap: <a className="font-semibold text-brand-600" href="/sitemap.xml" target="_blank">/sitemap.xml</a><br />Robots: <a className="font-semibold text-brand-600" href="/robots.txt" target="_blank">/robots.txt</a>
                </div>
              </div>
            </div>
          )}

          {tab === 'social' && (
            <div className="grid gap-4 md:grid-cols-2">
              {SOCIAL.map(([k, Icon]) => (
                <Field key={k} label={k.charAt(0).toUpperCase() + k.slice(1)}>
                  <div className="relative"><Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" /><input className="a-input pl-9" value={s[k] || ''} onChange={(e) => set(k)(e.target.value)} placeholder={`https://${k}.com/…`} /></div>
                </Field>
              ))}
            </div>
          )}

          {tab === 'contact' && (
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Email">{input('email', { type: 'email' })}</Field>
              <Field label="Phone">{input('phone')}</Field>
              <Field label="Address" className="md:col-span-2">{input('address')}</Field>
              <Field label="Working hours">{input('workingHours')}</Field>
              <Field label="Google Maps embed URL" hint="From Google Maps → Share → Embed a map → src">{input('mapEmbedUrl')}</Field>
              <Field label="WhatsApp number" hint="With country code, e.g. 8801712345678">{input('whatsapp', { placeholder: '8801XXXXXXXXX' })}</Field>
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 dark:border-emerald-500/20 dark:bg-emerald-500/5 md:col-span-2">
                <Toggle label="Floating contact button" description="A WhatsApp / call button in the corner of every page — visitors reach you in one tap" checked={s.floatingButton?.enabled} onChange={setNested('floatingButton', 'enabled')} />
                {s.floatingButton?.enabled && (
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <Toggle label={<span className="flex items-center gap-1.5"><MessageCircle className="h-4 w-4 text-emerald-500" />WhatsApp chat</span>} description={s.whatsapp ? `Opens a chat with +${s.whatsapp.replace(/\D/g, '')}` : 'Add your WhatsApp number above'} checked={s.floatingButton.whatsapp} onChange={setNested('floatingButton', 'whatsapp')} />
                    <Toggle label={<span className="flex items-center gap-1.5"><PhoneCall className="h-4 w-4 text-brand-500" />Call button</span>} description={s.phone ? `Calls ${s.phone}` : 'Add your phone number above'} checked={s.floatingButton.call} onChange={setNested('floatingButton', 'call')} />
                    <Field label="Pre-filled WhatsApp message" className="md:col-span-2"><input className="a-input" value={s.floatingButton.message || ''} onChange={(e) => setNested('floatingButton', 'message')(e.target.value)} /></Field>
                  </div>
                )}
              </div>
            </div>
          )}

          {tab === 'email' && (
            <div className="space-y-6">
              <div className={cn('rounded-xl border p-4', s.enabled ? 'border-emerald-200 bg-emerald-50/50 dark:border-emerald-500/20 dark:bg-emerald-500/5' : 'border-amber-200 bg-amber-50/60 dark:border-amber-500/20 dark:bg-amber-500/5')}>
                <Toggle label="Send email from this site" description="Notifications to you, automatic confirmations to visitors, and replies from Messages" checked={s.enabled} onChange={set('enabled')} />
              </div>
              <div>
                <h4 className="mb-3 text-sm font-bold">SMTP server</h4>
                <div className="mb-4 flex flex-wrap gap-2">
                  {SMTP_PRESETS.map(([label, host, port, secure, note]) => (
                    <button key={label} type="button" onClick={() => { setAll((a) => ({ ...a, email: { ...a.email, host, port, secure } })); if (note) toast.info(note); }} className="a-btn-secondary h-8 text-xs">{label}</button>
                  ))}
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                  <Field label="Host">{input('host', { placeholder: 'smtp.gmail.com' })}</Field>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Port">{input('port', { type: 'number' })}</Field>
                    <Field label="Security"><select className="a-input" value={s.secure ? 'ssl' : 'tls'} onChange={(e) => set('secure')(e.target.value === 'ssl')}><option value="tls">STARTTLS (587)</option><option value="ssl">SSL (465)</option></select></Field>
                  </div>
                  <Field label="Username">{input('user', { autoComplete: 'off' })}</Field>
                  <Field label="Password" hint="Stored on the server and never shown again">{input('pass', { type: 'password', autoComplete: 'new-password' })}</Field>
                  <Field label="From name">{input('fromName', { placeholder: all.general.siteName })}</Field>
                  <Field label="From address" hint="Usually the same as the username">{input('fromEmail', { type: 'email', placeholder: s.user })}</Field>
                </div>
              </div>
              <div className="border-t border-ink-100 pt-6 dark:border-white/5">
                <h4 className="mb-3 text-sm font-bold">Notify me about</h4>
                <Field label="Send notifications to" hint={`Leave empty to use the contact email (${all.contact.email || 'not set'})`} className="mb-4 max-w-md">{input('notifyTo', { type: 'email' })}</Field>
                <div className="grid gap-4 md:grid-cols-2">
                  <Toggle label="Contact messages" checked={s.notifyMessages} onChange={set('notifyMessages')} />
                  <Toggle label="Booking requests" description="Appointments, reservations, consultations…" checked={s.notifyBookings} onChange={set('notifyBookings')} />
                  <Toggle label="New comments" checked={s.notifyComments} onChange={set('notifyComments')} />
                  <Toggle label="New newsletter subscribers" checked={s.notifySubscribers} onChange={set('notifySubscribers')} />
                </div>
              </div>
              <div className="border-t border-ink-100 pt-6 dark:border-white/5">
                <Toggle label="Automatic confirmation to visitors" description="Sent right after someone uses a contact or booking form" checked={s.autoReply} onChange={set('autoReply')} />
                {s.autoReply && (
                  <div className="mt-4 space-y-4">
                    <Field label="Subject">{input('autoReplySubject')}</Field>
                    <Field label="Message" hint="Placeholders: {name} {site} {request} {phone} {email}"><textarea className="a-textarea" rows={7} value={s.autoReplyText} onChange={(e) => set('autoReplyText')(e.target.value)} /></Field>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap items-end gap-3 rounded-xl bg-ink-50 p-4 dark:bg-white/5">
                <Field label="Send a test email to" className="min-w-[240px] flex-1"><input className="a-input" type="email" value={testTo} onChange={(e) => setTestTo(e.target.value)} placeholder={s.notifyTo || all.contact.email || 'you@example.com'} /></Field>
                <button type="button" onClick={sendTest} disabled={testing} className="a-btn-secondary">{testing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}Save & send test</button>
              </div>
            </div>
          )}

          {tab === 'engagement' && (
            <div className="space-y-6">
              <div>
                <h4 className="mb-3 text-sm font-bold">Comments</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <Toggle label="Comments" description="Readers can comment on posts (each post can still turn them off)" checked={s.comments} onChange={set('comments')} />
                  <Toggle label="Hold for moderation" description="New comments wait in Comments until approved" checked={s.moderation} onChange={set('moderation')} />
                  <Toggle label="Threaded replies" description="Readers can reply to each other" checked={s.commentReplies} onChange={set('commentReplies')} />
                </div>
              </div>
              <div className="border-t border-ink-100 pt-6 dark:border-white/5">
                <h4 className="mb-3 text-sm font-bold">Reactions</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <Toggle label="Likes" description="Heart button on articles, videos and episodes" checked={s.likes} onChange={set('likes')} />
                  <Toggle label="Share menu" description="Facebook, X, LinkedIn, WhatsApp, email and copy link" checked={s.share} onChange={set('share')} />
                  <Toggle label="Save for later" description="Reading list / Watch later / My List, stored in the visitor's browser" checked={s.saves} onChange={set('saves')} />
                  <Toggle label="Follow & subscribe" description="Follow podcasts and shows, subscribe to playlists (with counts)" checked={s.subscriptions} onChange={set('subscriptions')} />
                </div>
              </div>
            </div>
          )}

          {tab === 'advanced' && (
            <div className="space-y-5">
              <div className="rounded-xl border border-ink-200/70 p-4 dark:border-white/10">
                <Toggle label="Cookie consent banner" description="Asks visitors before analytics, Tag Manager and the Facebook Pixel load (GDPR-friendly)" checked={s.cookieConsent?.enabled} onChange={setNested('cookieConsent', 'enabled')} />
                {s.cookieConsent?.enabled && (
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <Field label="Banner text" className="md:col-span-2"><textarea className="a-textarea" rows={2} value={s.cookieConsent.text || ''} onChange={(e) => setNested('cookieConsent', 'text')(e.target.value)} /></Field>
                    <Field label="Accept button"><input className="a-input" value={s.cookieConsent.acceptLabel || ''} onChange={(e) => setNested('cookieConsent', 'acceptLabel')(e.target.value)} /></Field>
                    <Field label="Decline button"><input className="a-input" value={s.cookieConsent.declineLabel || ''} onChange={(e) => setNested('cookieConsent', 'declineLabel')(e.target.value)} /></Field>
                    <Field label="Privacy policy link" className="md:col-span-2"><input className="a-input" value={s.cookieConsent.policyUrl || ''} onChange={(e) => setNested('cookieConsent', 'policyUrl')(e.target.value)} placeholder="/privacy-policy" /></Field>
                  </div>
                )}
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Toggle label="Newsletter sign-ups" description="Show newsletter forms in footer and posts" checked={s.enableNewsletter} onChange={set('enableNewsletter')} />
                <Toggle label="Contact form" description="Accept messages from the contact page" checked={s.enableContactForm} onChange={set('enableContactForm')} />
              </div>
              <Field label="Custom CSS" hint="Injected on every page of the site. Theme tokens: rgb(var(--c-primary)), var(--radius)…">
                <textarea className="a-textarea min-h-[200px] bg-ink-950 font-mono text-[13px] text-emerald-300 dark:bg-ink-950" spellCheck={false} value={s.customCss} onChange={(e) => set('customCss')(e.target.value)} placeholder=".my-class { color: rgb(var(--c-primary)); }" />
              </Field>
              <Field label="Header scripts" hint="Analytics, verification tags, pixels… (runs in <head>)">
                <textarea className="a-textarea min-h-[120px] bg-ink-950 font-mono text-[13px] text-sky-300 dark:bg-ink-950" spellCheck={false} value={s.headerScripts} onChange={(e) => set('headerScripts')(e.target.value)} placeholder="<script>…</script>" />
              </Field>
              <Field label="Footer scripts" hint="Chat widgets and other scripts loaded at the end of <body>">
                <textarea className="a-textarea min-h-[120px] bg-ink-950 font-mono text-[13px] text-sky-300 dark:bg-ink-950" spellCheck={false} value={s.footerScripts} onChange={(e) => set('footerScripts')(e.target.value)} />
              </Field>
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
