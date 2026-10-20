const express = require('express');
const { z } = require('zod');
const prisma = require('../lib/prisma');
const { authenticate, authorize } = require('../middleware/auth');
const { asyncHandler, HttpError, logActivity, toInt } = require('../lib/utils');
const { getSettings } = require('../lib/settings');
const { sourceSegments } = require('../lib/i18n');
const { translateSegments, TranslationError } = require('../lib/translator');

// Translation manager: per-item status, the segment editor and AI translation.
const router = express.Router();
router.use(authenticate, authorize('translations'));

const notTrash = { status: { not: 'TRASH' } };
const ENTITIES = {
  page: { list: () => prisma.page.findMany({ where: notTrash, orderBy: { updatedAt: 'desc' } }), one: (id) => prisma.page.findUnique({ where: { id } }), title: (r) => r.title },
  post: { list: () => prisma.post.findMany({ where: notTrash, orderBy: { createdAt: 'desc' }, take: 300 }), one: (id) => prisma.post.findUnique({ where: { id } }), title: (r) => r.title },
  menuItem: { list: () => prisma.menuItem.findMany({ include: { menu: { select: { name: true, location: true } } }, orderBy: [{ menuId: 'asc' }, { order: 'asc' }] }), one: (id) => prisma.menuItem.findUnique({ where: { id } }), title: (r) => r.label, group: (r) => r.menu?.name },
  category: { list: () => prisma.category.findMany({ orderBy: { name: 'asc' } }), one: (id) => prisma.category.findUnique({ where: { id } }), title: (r) => r.name },
  tag: { list: () => prisma.tag.findMany({ orderBy: { name: 'asc' } }), one: (id) => prisma.tag.findUnique({ where: { id } }), title: (r) => r.name },
  series: { list: () => prisma.series.findMany({ orderBy: { title: 'asc' } }), one: (id) => prisma.series.findUnique({ where: { id } }), title: (r) => r.title },
  faq: { list: () => prisma.faq.findMany({ orderBy: { order: 'asc' } }), one: (id) => prisma.faq.findUnique({ where: { id } }), title: (r) => r.question },
  testimonial: { list: () => prisma.testimonial.findMany({ orderBy: { order: 'asc' } }), one: (id) => prisma.testimonial.findUnique({ where: { id } }), title: (r) => r.name },
  settings: { list: async () => [{ id: 0, ...(await getSettings()) }], one: async () => getSettings(), title: () => 'Site name, tagline, footer & SEO text' },
  ui: { list: async () => [{ id: 0 }], one: async () => ({}), title: () => 'Buttons, labels & messages' },
};

async function context() {
  const settings = await getSettings();
  const cfg = settings.i18n;
  const locales = cfg.languages.map((l) => l.code).filter((c) => c !== cfg.defaultLanguage);
  return { settings, cfg, locales };
}
const entityOf = (name) => {
  if (!ENTITIES[name]) throw new HttpError(404, `Unknown content type "${name}"`);
  return ENTITIES[name];
};
const checkLocale = (cfg, locale) => {
  if (locale === cfg.defaultLanguage || !cfg.languages.some((l) => l.code === locale)) throw new HttpError(400, 'Add this language in Settings → Languages first');
};

// Progress of one item in one language.
function progress(segments, fields = {}) {
  let done = 0;
  let outdated = 0;
  for (const s of segments) {
    const t = fields[s.key];
    if (t?.text?.trim()) { done++; if (t.src !== s.source) outdated++; }
  }
  return { total: segments.length, done, outdated };
}

router.get('/overview', asyncHandler(async (req, res) => {
  const { cfg, locales } = await context();
  const types = Object.keys(ENTITIES);
  const rows = await prisma.translation.findMany({ where: { locale: { in: locales } }, select: { entity: true, entityId: true, locale: true, fields: true } });
  const byKey = new Map(rows.map((r) => [`${r.entity}:${r.entityId}:${r.locale}`, r.fields]));
  const summary = {};
  const items = {};
  const wanted = req.query.entity ? [entityOf(req.query.entity) && req.query.entity] : types;
  for (const type of types) {
    const list = await ENTITIES[type].list();
    summary[type] = Object.fromEntries(locales.map((l) => [l, { items: list.length, complete: 0, outdated: 0 }]));
    const out = [];
    for (const record of list) {
      const segments = sourceSegments(type, record);
      const status = {};
      for (const l of locales) {
        const p = progress(segments, byKey.get(`${type}:${record.id}:${l}`));
        status[l] = p;
        if (p.total && p.done === p.total) summary[type][l].complete++;
        if (p.outdated) summary[type][l].outdated++;
      }
      if (wanted.includes(type)) out.push({ id: record.id, title: ENTITIES[type].title(record), group: ENTITIES[type].group?.(record) || null, segments: segments.length, status });
    }
    if (wanted.includes(type)) items[type] = out;
  }
  res.json({ defaultLanguage: cfg.defaultLanguage, languages: cfg.languages, locales, summary, items, aiReady: !!(cfg.ai?.apiKey || process.env.ANTHROPIC_API_KEY) });
}));

async function loadItem(entity, id) {
  const record = await entityOf(entity).one(id);
  if (!record) throw new HttpError(404, 'Item not found');
  return record;
}

router.get('/:entity/:id/:locale', asyncHandler(async (req, res) => {
  const { cfg } = await context();
  const { entity, locale } = req.params;
  checkLocale(cfg, locale);
  const id = toInt(req.params.id) || 0;
  const record = await loadItem(entity, id);
  const row = await prisma.translation.findUnique({ where: { entity_entityId_locale: { entity, entityId: id, locale } } });
  const fields = row?.fields || {};
  res.json({
    title: entityOf(entity).title(record),
    segments: sourceSegments(entity, record).map((s) => ({ ...s, text: fields[s.key]?.text || '', outdated: !!fields[s.key]?.text && fields[s.key].src !== s.source })),
    updatedAt: row?.updatedAt || null,
  });
}));

// Saves texts (keyed by segment) with the current source text, so later edits to the original can be detected.
async function save(entity, id, locale, record, texts) {
  const segments = sourceSegments(entity, record);
  const row = await prisma.translation.findUnique({ where: { entity_entityId_locale: { entity, entityId: id, locale } } });
  const fields = { ...(row?.fields || {}) };
  for (const s of segments) {
    if (!(s.key in texts)) continue;
    const text = String(texts[s.key] ?? '');
    if (text.trim()) fields[s.key] = { src: s.source, text };
    else delete fields[s.key];
  }
  for (const k of Object.keys(fields)) if (!segments.some((s) => s.key === k)) delete fields[k]; // segments that no longer exist
  return prisma.translation.upsert({ where: { entity_entityId_locale: { entity, entityId: id, locale } }, update: { fields }, create: { entity, entityId: id, locale, fields } });
}

router.put('/:entity/:id/:locale', asyncHandler(async (req, res) => {
  const { cfg } = await context();
  const { entity, locale } = req.params;
  checkLocale(cfg, locale);
  const id = toInt(req.params.id) || 0;
  const { texts } = z.object({ texts: z.record(z.string(), z.string().max(200000)) }).parse(req.body);
  const record = await loadItem(entity, id);
  await save(entity, id, locale, record, texts);
  await logActivity(req, 'updated', 'Translation', `${entity}:${id}`, `Saved the ${locale} translation of ${entity} “${entityOf(entity).title(record)}”`);
  res.json({ ok: true });
}));

// AI translation. mode: "missing" (empty or outdated segments) or "all". save: write the result straight away.
router.post('/:entity/:id/:locale/ai', asyncHandler(async (req, res) => {
  const { cfg, settings } = await context();
  const { entity, locale } = req.params;
  checkLocale(cfg, locale);
  const id = toInt(req.params.id) || 0;
  const { mode, keys, save: persist } = z.object({ mode: z.enum(['missing', 'all']).default('missing'), keys: z.array(z.string()).optional(), save: z.boolean().default(false) }).parse(req.body || {});
  const record = await loadItem(entity, id);
  const row = await prisma.translation.findUnique({ where: { entity_entityId_locale: { entity, entityId: id, locale } } });
  const fields = row?.fields || {};
  let segments = sourceSegments(entity, record);
  if (keys?.length) segments = segments.filter((s) => keys.includes(s.key));
  else if (mode === 'missing') segments = segments.filter((s) => !fields[s.key]?.text?.trim() || fields[s.key].src !== s.source);
  let texts;
  try {
    texts = await translateSegments(segments, { from: cfg.defaultLanguage, to: locale, siteName: settings.general.siteName, cfg: cfg.ai });
  } catch (e) {
    if (e instanceof TranslationError) throw new HttpError(e.status, e.message);
    throw e;
  }
  if (persist && Object.keys(texts).length) {
    await save(entity, id, locale, record, texts);
    await logActivity(req, 'updated', 'Translation', `${entity}:${id}`, `AI-translated ${Object.keys(texts).length} segment(s) of ${entity} “${entityOf(entity).title(record)}” to ${locale}`);
  }
  res.json({ texts, translated: Object.keys(texts).length, requested: segments.length });
}));

router.delete('/:entity/:id/:locale', asyncHandler(async (req, res) => {
  const { entity, locale } = req.params;
  const id = toInt(req.params.id) || 0;
  entityOf(entity);
  await prisma.translation.deleteMany({ where: { entity, entityId: id, locale } });
  await logActivity(req, 'deleted', 'Translation', `${entity}:${id}`, `Deleted the ${locale} translation of ${entity} #${id}`);
  res.status(204).end();
}));

module.exports = router;
