const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const prisma = require('./prisma');

/*
 * Content snapshots: a JSON copy of everything that makes up a site (settings, pages, posts, menus,
 * media records…). Used by "Export project" so a client project boots with exactly this content.
 * User passwords are never exported.
 */

const SNAPSHOT_VERSION = 1;

async function createSnapshot({ includeMessages = false, includeUsers = true } = {}) {
  const [roles, users, categories, tags, series, posts, comments, pages, mediaFolders, media, menus, menuItems, faqs, testimonials, settings, subscribers, contactMessages] = await Promise.all([
    prisma.role.findMany({ orderBy: { id: 'asc' } }),
    prisma.user.findMany({ orderBy: { id: 'asc' }, select: { id: true, name: true, email: true, avatar: true, bio: true, isActive: true, roleId: true, createdAt: true } }),
    prisma.category.findMany({ orderBy: { id: 'asc' } }),
    prisma.tag.findMany({ orderBy: { id: 'asc' } }),
    prisma.series.findMany({ orderBy: { id: 'asc' } }),
    prisma.post.findMany({ orderBy: { id: 'asc' }, include: { categories: { select: { id: true } }, tags: { select: { id: true } } } }),
    prisma.comment.findMany({ orderBy: { id: 'asc' } }),
    prisma.page.findMany({ orderBy: { id: 'asc' } }),
    prisma.mediaFolder.findMany({ orderBy: { id: 'asc' } }),
    prisma.media.findMany({ orderBy: { id: 'asc' } }),
    prisma.menu.findMany({ orderBy: { id: 'asc' } }),
    prisma.menuItem.findMany({ orderBy: { id: 'asc' } }),
    prisma.faq.findMany({ orderBy: { id: 'asc' } }),
    prisma.testimonial.findMany({ orderBy: { id: 'asc' } }),
    prisma.setting.findMany(),
    includeMessages ? prisma.subscriber.findMany({ orderBy: { id: 'asc' } }) : [],
    includeMessages ? prisma.contactMessage.findMany({ orderBy: { id: 'asc' } }) : [],
  ]);

  const theme = settings.find((s) => s.key === 'theme')?.value?.active || 'nova';
  return {
    version: SNAPSHOT_VERSION,
    createdAt: new Date().toISOString(),
    theme,
    data: {
      roles, users: includeUsers ? users : [], categories, tags, series,
      // Without team members, posts lose their author here and are given to the client's admin on restore.
      posts: posts.map(({ categories: c, tags: t, ...p }) => ({ ...p, authorId: includeUsers ? p.authorId : null, categoryIds: c.map((x) => x.id), tagIds: t.map((x) => x.id) })),
      comments: comments.map((c) => ({ ...c, userId: includeUsers ? c.userId : null })),
      pages, mediaFolders, media, menus, menuItems, faqs, testimonials,
      settings: settings.map(({ key, value }) => ({ key, value })),
      subscribers, contactMessages,
    },
  };
}

// Every "/uploads/<file>" referenced anywhere in the snapshot (posts, pages, settings, media…).
function referencedUploads(snapshot) {
  const files = new Set();
  const re = /\/uploads\/([\w.\-]+)/g;
  const text = JSON.stringify(snapshot.data);
  let m;
  while ((m = re.exec(text))) files.add(m[1]);
  return [...files];
}

const TABLES = ['Role', 'User', 'Category', 'Tag', 'Series', 'Post', 'Comment', 'Page', 'MediaFolder', 'Media', 'Menu', 'MenuItem', 'Faq', 'Testimonial', 'Subscriber', 'ContactMessage', 'ActivityLog'];

// Keep autoincrement sequences ahead of explicitly inserted ids.
async function resetSequences(tables) {
  for (const table of tables) {
    await prisma.$executeRawUnsafe(
      `SELECT setval(pg_get_serial_sequence('"${table}"', 'id'), COALESCE((SELECT MAX(id) FROM "${table}"), 1), (SELECT COUNT(*) > 0 FROM "${table}"))`,
    );
  }
}

// Inserts rows whose self-referencing parent may come later: create without parent, then link.
async function insertTree(model, rows, parentKey) {
  for (const r of rows) await prisma[model].create({ data: { ...r, [parentKey]: null } });
  for (const r of rows) if (r[parentKey]) await prisma[model].update({ where: { id: r.id }, data: { [parentKey]: r[parentKey] } });
}

/**
 * Restores a snapshot into an empty-or-disposable database (all content tables are cleared).
 * admin = { email, password, name } — this account becomes (or is updated to) a Super Admin.
 */
async function restoreSnapshot(snapshot, { admin } = {}) {
  if (snapshot.version !== SNAPSHOT_VERSION) throw new Error(`Unsupported snapshot version ${snapshot.version}`);
  const d = snapshot.data;

  await prisma.$transaction([
    prisma.activityLog.deleteMany(), prisma.revision.deleteMany(), prisma.menuItem.deleteMany(), prisma.menu.deleteMany(), prisma.comment.deleteMany(), prisma.post.deleteMany(), prisma.series.deleteMany(),
    prisma.category.deleteMany(), prisma.tag.deleteMany(), prisma.page.deleteMany(), prisma.media.deleteMany(), prisma.mediaFolder.deleteMany(),
    prisma.faq.deleteMany(), prisma.testimonial.deleteMany(), prisma.subscriber.deleteMany(), prisma.contactMessage.deleteMany(),
    prisma.setting.deleteMany(), prisma.user.deleteMany(), prisma.role.deleteMany(),
  ]);

  for (const r of d.roles) await prisma.role.create({ data: r });
  // Team members come across without passwords (a random one is set) — the admin can reset them in Users.
  const placeholder = await bcrypt.hash(crypto.randomBytes(24).toString('hex'), 10);
  for (const u of d.users) await prisma.user.create({ data: { ...u, password: placeholder } });

  await insertTree('category', d.categories, 'parentId');
  for (const t of d.tags) await prisma.tag.create({ data: t });
  for (const s of d.series) await prisma.series.create({ data: s });
  for (const { categoryIds, tagIds, ...p } of d.posts) {
    await prisma.post.create({ data: { ...p, categories: { connect: categoryIds.map((id) => ({ id })) }, tags: { connect: tagIds.map((id) => ({ id })) } } });
  }
  await insertTree('comment', d.comments || [], 'parentId');
  for (const p of d.pages) await prisma.page.create({ data: p });
  await insertTree('mediaFolder', d.mediaFolders, 'parentId');
  for (const m of d.media) await prisma.media.create({ data: m });
  for (const m of d.menus) await prisma.menu.create({ data: m });
  await insertTree('menuItem', d.menuItems, 'parentId');
  for (const f of d.faqs) await prisma.faq.create({ data: f });
  for (const t of d.testimonials) await prisma.testimonial.create({ data: t });
  for (const s of d.settings) await prisma.setting.create({ data: s });
  for (const s of d.subscribers || []) await prisma.subscriber.create({ data: s });
  for (const c of d.contactMessages || []) await prisma.contactMessage.create({ data: c });

  await resetSequences(TABLES);

  if (admin?.email && admin?.password) {
    let role = await prisma.role.findFirst({ where: { OR: [{ slug: 'super-admin' }, { permissions: { has: '*' } }] } });
    if (!role) role = await prisma.role.create({ data: { name: 'Super Admin', slug: 'super-admin', permissions: ['*'], isSystem: true } });
    const password = await bcrypt.hash(admin.password, 10);
    const email = admin.email.toLowerCase();
    const user = await prisma.user.upsert({
      where: { email },
      update: { password, roleId: role.id, isActive: true },
      create: { email, password, name: admin.name || 'Administrator', roleId: role.id },
    });
    await prisma.post.updateMany({ where: { authorId: null }, data: { authorId: user.id } });
  }
}

module.exports = { createSnapshot, restoreSnapshot, referencedUploads, insertTree, resetSequences, SNAPSHOT_VERSION };
