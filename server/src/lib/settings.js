const prisma = require('./prisma');

// Default values for every settings group. Stored values are deep-merged over these,
// so adding a new option here makes it available everywhere without a migration.
const DEFAULT_SETTINGS = {
  theme: { active: 'nova' },
  general: {
    siteName: 'Nova CMS',
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
    footerText: 'Crafted with care using Nova CMS.',
    blogLayout: 'grid',
    showAuthor: true,
    showReadingTime: true,
    announcement: { enabled: true, text: 'Nova CMS 1.0 is here — fully customizable, blazing fast.', linkLabel: 'Read more', url: '/blog' },
    backToTop: true,
  },
  seo: {
    metaTitle: 'Nova CMS — Modern content management',
    titleSeparator: '|',
    metaDescription: 'A modern, fully customizable CMS built with Express, Next.js and PostgreSQL.',
    metaKeywords: 'cms, nextjs, express, postgresql',
    ogImage: '',
    twitterHandle: '',
    allowIndexing: true,
    googleAnalyticsId: '',
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
  },
  advanced: {
    customCss: '',
    headerScripts: '',
    footerScripts: '',
    enableNewsletter: true,
    enableContactForm: true,
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

module.exports = { DEFAULT_SETTINGS, getSettings, saveGroup };
