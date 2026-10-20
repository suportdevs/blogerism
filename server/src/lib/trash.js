const prisma = require('./prisma');
const { deleteRevisions } = require('./revisions');
const { deleteTranslations } = require('./i18n');

/*
 * Trash for posts and pages. Deleting moves an item to the trash (status TRASH); it can be restored as a draft
 * until it is deleted permanently, the trash is emptied, or it has been there for RETENTION_DAYS.
 */

const RETENTION_DAYS = 30;
const MODELS = { post: 'post', page: 'page' };

const trash = (entity, ids) => prisma[MODELS[entity]].updateMany({ where: { id: { in: ids }, NOT: { status: 'TRASH' } }, data: { status: 'TRASH', trashedAt: new Date() } });

const restore = (entity, ids) => prisma[MODELS[entity]].updateMany({ where: { id: { in: ids }, status: 'TRASH' }, data: { status: 'DRAFT', trashedAt: null } });

async function destroy(entity, ids) {
  const { count } = await prisma[MODELS[entity]].deleteMany({ where: { id: { in: ids } } });
  await deleteRevisions(entity, ids);
  await deleteTranslations(entity, ids);
  return count;
}

async function emptyTrash(entity) {
  const rows = await prisma[MODELS[entity]].findMany({ where: { status: 'TRASH' }, select: { id: true } });
  return destroy(entity, rows.map((r) => r.id));
}

// Permanently removes items that have been in the trash longer than RETENTION_DAYS.
async function purgeExpired() {
  const before = new Date(Date.now() - RETENTION_DAYS * 864e5);
  for (const entity of Object.keys(MODELS)) {
    const rows = await prisma[MODELS[entity]].findMany({ where: { status: 'TRASH', trashedAt: { lt: before } }, select: { id: true } });
    if (rows.length) await destroy(entity, rows.map((r) => r.id));
  }
}

module.exports = { trash, restore, destroy, emptyTrash, purgeExpired, RETENTION_DAYS };
