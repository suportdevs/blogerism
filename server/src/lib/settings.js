const prisma = require('./prisma');

// Default values for every settings group. Stored values are deep-merged over these,
// so adding a new option here makes it available everywhere without a migration.
const DEFAULT_SETTINGS = {
  theme: { active: 'nova' },
  general: {
    siteName: 'Themewright',
    tagline: 'Build beautiful websites, faster.',
    logo: '',
    logoDark: '',
    favicon: '',
    homepageId: null,
    postsPerPage: 9,
    timezone: 'UTC',
    dateFormat: 'MMM d, yyyy',
    maintenanceMode: false,
    maintenanceMessage: 'We are performing scheduled maintenance. Please check back soon.',
  },
  appearance: {
    preset: 'aurora',
    primaryColor: '#6d5dfc',
    accentColor: '#16c79a',
    backgroundColor: '#ffffff',
    surfaceColor: '#f6f7fb',
    textColor: '#0f172a',
    darkBackgroundColor: '#0b0d17',
    darkSurfaceColor: '#141729',
    darkTextColor: '#e7e9f3',
    colorMode: 'system',
    headingFont: 'Plus Jakarta Sans',
    bodyFont: 'Inter',
    baseFontSize: 16,
    radius: 16,
    containerWidth: 1200,
    headerStyle: 'glass',
    headerSticky: true,
    headerCta: { enabled: true, label: 'Get started', url: '/contact' },
    footerStyle: 'columns',
    footerText: 'Crafted with care using Themewright.',
    blogLayout: 'grid',
    showAuthor: true,
    showReadingTime: true,
    announcement: { enabled: true, text: 'Themewright 1.0 is here — fully customizable, blazing fast.', linkLabel: 'Read more', url: '/blog' },
    backToTop: true,
  },
  seo: {
    metaTitle: 'Themewright — Modern content management',
    titleSeparator: '|',
    metaDescription: 'A modern, fully customizable CMS built with Express, Next.js and PostgreSQL.',
    metaKeywords: 'cms, nextjs, express, postgresql',
    ogImage: '',
    twitterHandle: '',
    allowIndexing: true,
    googleAnalyticsId: '',
    googleTagManagerId: '',
    facebookPixelId: '',
    googleVerification: '',
    bingVerification: '',
  },
  social: {
    facebook: 'https://facebook.com',
    twitter: 'https://x.com',
    instagram: 'https://instagram.com',
    linkedin: 'https://linkedin.com',
    youtube: '',
    github: 'https://github.com',
  },
  contact: {
    email: 'hello@novacms.dev',
    phone: '+1 (555) 010-2030',
    address: '221B Market Street, San Francisco, CA',
    mapEmbedUrl: '',
    workingHours: 'Mon – Fri, 9:00 – 18:00',
    whatsapp: '',
    // Floating WhatsApp / call button shown on every page.
    floatingButton: { enabled: false, whatsapp: true, call: true, message: 'Hello! I have a question.' },
  },
  advanced: {
    customCss: '',
    headerScripts: '',
    footerScripts: '',
    enableNewsletter: true,
    enableContactForm: true,
    // Cookie banner; when on, analytics and pixels only load after the visitor accepts.
    cookieConsent: { enabled: false, text: 'We use cookies to understand how our site is used and to improve your experience.', acceptLabel: 'Accept', declineLabel: 'Decline', policyUrl: '/privacy-policy' },
  },
  // Languages. The default language is the content you write; others are translations (see Translations).
  i18n: {
    enabled: false,
    defaultLanguage: 'en',
    languages: [{ code: 'en', name: 'English', native: 'English', dir: 'ltr' }],
    switcher: true,
    // AI translation with Claude. The key never leaves the server; ANTHROPIC_API_KEY works too.
    ai: { apiKey: '', model: 'claude-opus-5-5', effort: 'medium', glossary: '' },
  },
  // Outgoing email (SMTP). Never sent to the public site; shared by all themes.
  email: {
    enabled: false,
    host: '',
    port: 587,
    secure: false,
    user: '',
    pass: '',
    fromName: '',
    fromEmail: '',
    notifyTo: '',
    notifyMessages: true,
    notifyBookings: true,
    notifyComments: false,
    notifySubscribers: false,
    autoReply: true,
    autoReplySubject: 'We received your {request}',
    autoReplyText: 'Hi {name},\n\nThank you for contacting {site}. We have received your {request} and will get back to you shortly.\n\nIf it is urgent, call us on {phone}.\n\n— {site}',
  },
  // Admin panel branding: sidebar, login screen and browser tab. Empty values fall back to the product defaults.
  admin: {
    name: '',
    logo: '',
    favicon: '',
    subtitle: '',
    loginBadge: 'Version 1.0',
    loginTitle: 'Craft your website,',
    loginHighlight: 'block by block.',
    loginText: 'Visual page builder, theme customizer, media library and team permissions — all in one beautiful dashboard.',
    loginImage: '',
    welcomeTitle: 'Welcome back 👋',
    welcomeText: 'Sign in to manage your website.',
    footerText: '',
  },
  // Reader engagement on posts and series.
  engagement: {
    comments: true,
    moderation: true, // new comments wait for approval
    commentReplies: true,
    likes: true,
    share: true,
    saves: true,
    subscriptions: true,
  },
};

const isObject = (v) => v && typeof v === 'object' && !Array.isArray(v);

function deepMerge(base, override) {
  if (!isObject(base) || !isObject(override)) return override === undefined ? base : override;
  const out = { ...base };
  for (const [k, v] of Object.entries(override)) out[k] = isObject(base[k]) ? deepMerge(base[k], v) : v;
  return out;
}

async function getSettings() {
  const rows = await prisma.setting.findMany();
  const stored = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  const result = {};
  for (const group of Object.keys(DEFAULT_SETTINGS)) result[group] = deepMerge(DEFAULT_SETTINGS[group], stored[group] || {});
  return result;
}

async function saveGroup(group, value) {
  const current = await prisma.setting.findUnique({ where: { key: group } });
  const merged = deepMerge(current?.value || {}, value);
  await prisma.setting.upsert({ where: { key: group }, update: { value: merged }, create: { key: group, value: merged } });
}

// Settings safe to send to the public site (no email/SMTP credentials).
function publicSettings(settings) {
  const { email, ...rest } = settings; // eslint-disable-line no-unused-vars
  const { ai, ...i18n } = settings.i18n || {}; // eslint-disable-line no-unused-vars
  return { ...rest, i18n };
}

module.exports = { DEFAULT_SETTINGS, getSettings, saveGroup, publicSettings };
