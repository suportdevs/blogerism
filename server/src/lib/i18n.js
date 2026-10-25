const prisma = require('./prisma');

/*
 * Multilingual content. The default language lives in the normal tables; every other language is stored in
 * Translation rows as text segments: fields = { key: { src, text } }. `src` is the original text the translation was
 * made from, so a changed original shows up as "outdated". Public API responses are localized by walking the JSON,
 * recognising entities (post, page, category…) and overlaying their translated segments.
 */

const LANGUAGE_PRESETS = [
  ['en', 'English', 'English', 'ltr'], ['bn', 'Bengali', 'বাংলা', 'ltr'], ['hi', 'Hindi', 'हिन्दी', 'ltr'], ['ur', 'Urdu', 'اردو', 'rtl'],
  ['ar', 'Arabic', 'العربية', 'rtl'], ['es', 'Spanish', 'Español', 'ltr'], ['fr', 'French', 'Français', 'ltr'], ['de', 'German', 'Deutsch', 'ltr'],
  ['pt', 'Portuguese', 'Português', 'ltr'], ['it', 'Italian', 'Italiano', 'ltr'], ['nl', 'Dutch', 'Nederlands', 'ltr'], ['tr', 'Turkish', 'Türkçe', 'ltr'],
  ['ru', 'Russian', 'Русский', 'ltr'], ['zh', 'Chinese (Simplified)', '简体中文', 'ltr'], ['ja', 'Japanese', '日本語', 'ltr'], ['ko', 'Korean', '한국어', 'ltr'],
  ['id', 'Indonesian', 'Bahasa Indonesia', 'ltr'], ['ms', 'Malay', 'Bahasa Melayu', 'ltr'], ['th', 'Thai', 'ไทย', 'ltr'], ['vi', 'Vietnamese', 'Tiếng Việt', 'ltr'],
  ['fa', 'Persian', 'فارسی', 'rtl'], ['ta', 'Tamil', 'தமிழ்', 'ltr'], ['ne', 'Nepali', 'नेपाली', 'ltr'], ['sw', 'Swahili', 'Kiswahili', 'ltr'],
].map(([code, name, native, dir]) => ({ code, name, native, dir }));

// Translatable fields per entity; `html` marks rich text.
const FIELDS = {
  post: [['title'], ['subtitle'], ['excerpt'], ['content', 'html'], ['seoTitle'], ['seoDescription']],
  page: [['title'], ['seoTitle'], ['seoDescription']], // + text inside blocks
  category: [['name'], ['description']],
  tag: [['name']],
  series: [['title'], ['tagline'], ['description']],
  faq: [['question'], ['answer', 'html']],
  testimonial: [['content'], ['position'], ['company']],
  menuItem: [['label'], ['description'], ['badge']],
};

// Site-wide text from settings that visitors read.
const SETTINGS_PATHS = [
  'general.siteName', 'general.tagline', 'general.maintenanceMessage',
  'appearance.footerText', 'appearance.announcement.text', 'appearance.announcement.linkLabel', 'appearance.headerCta.label',
  'seo.metaTitle', 'seo.metaDescription', 'contact.address', 'contact.workingHours', 'contact.floatingButton.message',
  'advanced.cookieConsent.text', 'advanced.cookieConsent.acceptLabel', 'advanced.cookieConsent.declineLabel',
];

// Fixed interface text used by the site's components (see client/lib/i18n.js — keys must match).
const UI_STRINGS = {
  search: 'Search', searchPlaceholder: 'Search…', menu: 'Menu', close: 'Close', explore: 'Explore', language: 'Language',
  readMore: 'Read more', minRead: 'min read', viewAll: 'View all', backHome: 'Back home', backToBlog: 'Back to blog',
  notFoundTitle: 'This page drifted into space', notFoundText: 'The page you’re looking for doesn’t exist or has been moved.', searchSite: 'Search the site…',
  yourName: 'Your name *', emailAddress: 'Email address *', phoneOptional: 'Phone (optional)', subject: 'Subject', howCanWeHelp: 'How can we help? *',
  sendMessage: 'Send message', messageSent: 'Message sent!', sendAnother: 'Send another', subscribe: 'Subscribe', emailPlaceholder: 'you@company.com',
  searchResults: 'Search results', noResults: 'Nothing found', allPosts: 'All posts', latestArticles: 'Latest articles', comments: 'Comments',
  resultsFor: 'Results for', resultsFound: 'results found', nothingMatched: 'Nothing matched your search. Try different keywords.',
  typeToSearch: 'Type something to start searching.', findArticles: 'Find articles by keyword.', searchArticles: 'Search articles…',
};

const get = (o, path) => path.split('.').reduce((v, k) => (v == null ? undefined : v[k]), o);
const set = (o, path, value) => {
  const keys = path.split('.');
  let cur = o;
  keys.slice(0, -1).forEach((k) => { if (cur[k] == null || typeof cur[k] !== 'object') cur[k] = {}; cur = cur[k]; });
  cur[keys.at(-1)] = value;
};

/* ---------------- Page blocks: which strings are text worth translating ---------------- */

const NON_TEXT_KEY = /(url|href|link|image|img|src|photo|avatar|logo|icon|color|colour|anchor|slug|video|audio|poster|backdrop|cover|email|phone|whatsapp|code|timezone|username|variant|layout|align|position|size|kind|requesttype|sort|format|source|style|map|embed|action|domain|background|file|id|type|mode|interval|slot|count|columns|height|overlay|width|padding|target|lang|filter|theme|user|host|ascii)$/i;
const FILTER_KEYS = new Set(['category', 'categories', 'series', 'tag', 'tags', 'playlist', 'show', 'exclude', 'slugs']);
const isText = (key, value, parentKey) => {
  if (typeof value !== 'string' || !value.trim()) return false;
  if (NON_TEXT_KEY.test(key)) return false;
  if (!/\p{L}/u.test(value)) return false; // numbers, prices, symbols
  if (/^(https?:|mailto:|tel:|\/|#)/i.test(value.trim())) return false;
  if ((FILTER_KEYS.has(key) || FILTER_KEYS.has(parentKey)) && /^[a-z0-9]+(-[a-z0-9]+)*$/.test(value)) return false; // slugs used as filters
  return true;
};

function blockSegments(blocks = []) {
  const out = [];
  const walk = (v, path, key, parentKey) => {
    if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${path}.${i}`, key, key));
    else if (v && typeof v === 'object') Object.entries(v).forEach(([k, x]) => walk(x, `${path}.${k}`, k, key));
    else if (isText(key, v, parentKey)) out.push({ key: path, source: v, html: key === 'html' || /<\/?[a-z][\s\S]*>/i.test(v) });
  };
  blocks.forEach((b) => b?.id && b.data && walk(b.data, `blocks.${b.id}`, '', ''));
  return out;
}

// Every source segment of an item: [{ key, source, html }].
function sourceSegments(entity, record) {
  if (!record) return [];
  if (entity === 'settings') return SETTINGS_PATHS.map((p) => ({ key: p, source: get(record, p) })).filter((s) => typeof s.source === 'string' && s.source.trim());
  if (entity === 'ui') return Object.entries(UI_STRINGS).map(([key, source]) => ({ key, source }));
  const fields = (FIELDS[entity] || []).map(([key, kind]) => ({ key, source: record[key], html: kind === 'html' })).filter((s) => typeof s.source === 'string' && s.source.trim());
  return entity === 'page' ? [...fields, ...blockSegments(record.blocks)] : fields;
}

// Overlays translated text onto a (copied) record.
function applyFields(entity, record, fields = {}) {
  const out = entity === 'page' ? { ...record, blocks: structuredClone(record.blocks || []) } : { ...record };
  for (const [key, val] of Object.entries(fields)) {
    const text = val?.text;
    if (typeof text !== 'string' || !text.trim()) continue;
    if (key.startsWith('blocks.')) {
      const [, blockId, ...path] = key.split('.');
      const block = out.blocks.find((b) => b.id === blockId);
      if (block && get(block.data, path.join('.')) !== undefined) set(block.data, path.join('.'), text);
    } else if (entity === 'settings') set(out, key, text);
    else if (key in out) out[key] = text;
  }
  return out;
}

/* ---------------- Localizing API responses ---------------- */

const SERIES_TYPES = new Set(['SHOW', 'PLAYLIST', 'PODCAST']);
function kindOf(o) {
  if (o.general && o.appearance) return 'settings';
  if (o.id == null) return null;
  if ('question' in o && 'answer' in o) return 'faq';
  if ('rating' in o && 'content' in o && 'name' in o) return 'testimonial';
  if ('label' in o && 'url' in o) return 'menuItem';
  if ('slug' in o && 'title' in o && Array.isArray(o.blocks)) return 'page';
  if ('slug' in o && 'title' in o && SERIES_TYPES.has(o.type)) return 'series';
  if ('slug' in o && 'title' in o) return 'post';
  if ('slug' in o && 'name' in o && 'color' in o) return 'category';
  if ('slug' in o && 'name' in o) return 'tag';
  return null;
}

async function i18nConfig() {
  const { getSettings } = require('./settings'); // lazy: settings.js requires nothing from here
  return (await getSettings()).i18n;
}

// Files (/cv.pdf, /logo.png) are not pages, so they never get a language prefix.
const isInternal = (url) => typeof url === 'string' && url.startsWith('/') && !url.startsWith('//') && !/^\/(uploads|api|admin)(\/|$)/.test(url) && !/\.\w{2,5}([?#].*)?$/.test(url);

/**
 * Returns a localized copy of an API response body. Entities found anywhere in the body get their translations;
 * internal menu links get the language prefix so visitors stay in their language.
 */
async function localize(body, lang) {
  const found = [];
  const collect = (v) => {
    if (Array.isArray(v)) v.forEach(collect);
    else if (v && typeof v === 'object' && !(v instanceof Date)) {
      const kind = kindOf(v);
      if (kind) found.push([kind, v]);
      Object.values(v).forEach(collect);
    }
  };
  collect(body);
  if (!found.length) return body;
  const ids = {};
  for (const [kind, v] of found) (ids[kind] ||= new Set()).add(kind === 'settings' ? 0 : v.id);
  const rows = await prisma.translation.findMany({
    where: { locale: lang, OR: Object.entries(ids).map(([entity, set_]) => ({ entity, entityId: { in: [...set_] } })) },
  });
  const byKey = new Map(rows.map((r) => [`${r.entity}:${r.entityId}`, r.fields]));
  const replace = (v) => {
    if (Array.isArray(v)) return v.map(replace);
    if (!v || typeof v !== 'object' || v instanceof Date) return v;
    const kind = kindOf(v);
    let out = Object.fromEntries(Object.entries(v).map(([k, x]) => [k, replace(x)]));
    if (kind) {
      const fields = byKey.get(`${kind}:${kind === 'settings' ? 0 : v.id}`);
      if (fields) out = applyFields(kind, out, fields);
      if (kind === 'menuItem' && isInternal(out.url)) out.url = `/${lang}${out.url === '/' ? '' : out.url}`;
    }
    return out;
  };
  return replace(body);
}

// The UI dictionary for a language (English defaults with translations overlaid).
async function uiStrings(lang, defaultLang) {
  if (!lang || lang === defaultLang) return { ...UI_STRINGS };
  const row = await prisma.translation.findUnique({ where: { entity_entityId_locale: { entity: 'ui', entityId: 0, locale: lang } } });
  const out = { ...UI_STRINGS };
  for (const [k, v] of Object.entries(row?.fields || {})) if (v?.text && k in out) out[k] = v.text;
  return out;
}

// Removes translations of deleted items.
const deleteTranslations = (entity, ids) => prisma.translation.deleteMany({ where: { entity, entityId: { in: ids } } });

module.exports = { LANGUAGE_PRESETS, FIELDS, SETTINGS_PATHS, UI_STRINGS, sourceSegments, applyFields, localize, uiStrings, i18nConfig, deleteTranslations, isInternal };
