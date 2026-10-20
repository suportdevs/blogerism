const prisma = require('./prisma');

/*
 * Revision history for posts and pages. A copy is stored every time one is saved (identical saves are skipped),
 * and only the newest KEEP copies are kept per item. Restoring copies a revision's content back onto the item.
 */

const KEEP = 30;

// The fields that make up a revision — content only; slug, status and stats are left alone on restore.
const FIELDS = {
  post: ['title', 'subtitle', 'excerpt', 'content', 'coverImage', 'format', 'videoUrl', 'audioUrl', 'duration', 'gallery', 'seriesId', 'season', 'episode', 'seoTitle', 'seoDescription'],
  page: ['title', 'template', 'blocks', 'seoTitle', 'seoDescription', 'ogImage'],
};

function revisionData(entity, record) {
  const data = Object.fromEntries(FIELDS[entity].map((k) => [k, record[k] ?? null]));
  if (entity === 'post') {
    data.categoryIds = (record.categories || []).map((c) => c.id);
    data.tags = (record.tags || []).map((t) => t.name);
  }
  return data;
}

// Key-order independent JSON (Postgres jsonb does not keep key order), for spotting identical saves.
const canonical = (v) => (Array.isArray(v) ? `[${v.map(canonical).join(',')}]`
  : v && typeof v === 'object' ? `{${Object.keys(v).sort().map((k) => `${JSON.stringify(k)}:${canonical(v[k])}`).join(',')}}`
    : JSON.stringify(v ?? null));

async function saveRevision(entity, record, user) {
  const data = revisionData(entity, record);
  const latest = await prisma.revision.findFirst({ where: { entity, entityId: record.id }, orderBy: { id: 'desc' }, select: { data: true } });
  if (latest && canonical(latest.data) === canonical(data)) return;
  await prisma.revision.create({ data: { entity, entityId: record.id, title: record.title, data, userId: user?.id ?? null, userName: user?.name ?? null } });
  const old = await prisma.revision.findMany({ where: { entity, entityId: record.id }, orderBy: { id: 'desc' }, skip: KEEP, select: { id: true } });
  if (old.length) await prisma.revision.deleteMany({ where: { id: { in: old.map((r) => r.id) } } });
}

// Newest first, without the (possibly large) content.
const listRevisions = (entity, entityId) => prisma.revision.findMany({
  where: { entity, entityId }, orderBy: { id: 'desc' }, select: { id: true, title: true, userName: true, createdAt: true },
});

async function getRevision(entity, entityId, id) {
  return prisma.revision.findFirstOrThrow({ where: { id, entity, entityId } });
}

const deleteRevisions = (entity, ids) => prisma.revision.deleteMany({ where: { entity, entityId: { in: ids } } });

module.exports = { saveRevision, listRevisions, getRevision, deleteRevisions, revisionData };
