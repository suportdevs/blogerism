const prisma = require('./prisma');
const { insertTree, resetSequences } = require('./snapshot');

/*
 * Theme workspaces. Content (categories, tags, series, posts and their comments, pages, menus, FAQs, testimonials and
 * site settings) belongs to the active theme. When the theme changes, the outgoing theme's content
 * is saved and the incoming theme's saved content is restored — so no theme ever loses its data.
 * Users, roles, media files, messages and subscribers are shared by all themes.
 */

const GLOBAL_SETTINGS = ['theme', 'email'];
const CONTENT_TABLES = ['Category', 'Tag', 'Series', 'Post', 'Comment', 'Page', 'Menu', 'MenuItem', 'Faq', 'Testimonial', 'Revision'];

async function captureContent() {
  const [categories, tags, series, posts, comments, pages, menus, menuItems, faqs, testimonials, revisions, settings] = await Promise.all([
    prisma.category.findMany({ orderBy: { id: 'asc' } }),
    prisma.tag.findMany({ orderBy: { id: 'asc' } }),
    prisma.series.findMany({ orderBy: { id: 'asc' } }),
    prisma.post.findMany({ orderBy: { id: 'asc' }, include: { categories: { select: { id: true } }, tags: { select: { id: true } } } }),
    prisma.comment.findMany({ orderBy: { id: 'asc' } }),
    prisma.page.findMany({ orderBy: { id: 'asc' } }),
    prisma.menu.findMany({ orderBy: { id: 'asc' } }),
    prisma.menuItem.findMany({ orderBy: { id: 'asc' } }),
    prisma.faq.findMany({ orderBy: { id: 'asc' } }),
    prisma.testimonial.findMany({ orderBy: { id: 'asc' } }),
    prisma.revision.findMany({ orderBy: { id: 'asc' } }),
    prisma.setting.findMany({ where: { key: { notIn: GLOBAL_SETTINGS } } }),
  ]);
  return {
    categories, tags, series, comments, pages, menus, menuItems, faqs, testimonials, revisions,
    posts: posts.map(({ categories: c, tags: t, ...p }) => ({ ...p, categoryIds: c.map((x) => x.id), tagIds: t.map((x) => x.id) })),
    settings: settings.map(({ key, value }) => ({ key, value })),
  };
}

async function clearContent() {
  await prisma.$transaction([
    prisma.menuItem.deleteMany(), prisma.menu.deleteMany(), prisma.comment.deleteMany(), prisma.post.deleteMany(), prisma.series.deleteMany(),
    prisma.tag.deleteMany(), prisma.category.deleteMany(), prisma.page.deleteMany(), prisma.faq.deleteMany(), prisma.testimonial.deleteMany(),
    prisma.revision.deleteMany(), prisma.setting.deleteMany({ where: { key: { notIn: GLOBAL_SETTINGS } } }),
  ]);
}

async function restoreContent(d) {
  await clearContent();
  const userIds = new Set((await prisma.user.findMany({ select: { id: true } })).map((u) => u.id));
  await insertTree('category', d.categories, 'parentId');
  for (const t of d.tags) await prisma.tag.create({ data: t });
  for (const s of d.series) await prisma.series.create({ data: s });
  for (const { categoryIds, tagIds, ...p } of d.posts) {
    await prisma.post.create({
      data: {
        ...p,
        authorId: userIds.has(p.authorId) ? p.authorId : null, // the author may have been deleted since
        categories: { connect: categoryIds.map((id) => ({ id })) },
        tags: { connect: tagIds.map((id) => ({ id })) },
      },
    });
  }
  // Workspaces saved before comments existed have none.
  await insertTree('comment', (d.comments || []).map((c) => ({ ...c, userId: userIds.has(c.userId) ? c.userId : null })), 'parentId');
  for (const p of d.pages) await prisma.page.create({ data: p });
  for (const m of d.menus) await prisma.menu.create({ data: m });
  await insertTree('menuItem', d.menuItems, 'parentId');
  for (const f of d.faqs) await prisma.faq.create({ data: f });
  for (const t of d.testimonials) await prisma.testimonial.create({ data: t });
  // Revision history belongs to this content (ids match); workspaces saved before revisions existed have none.
  if (d.revisions?.length) await prisma.revision.createMany({ data: d.revisions });
  for (const s of d.settings) await prisma.setting.create({ data: s });
  await resetSequences(CONTENT_TABLES);
}

// Workspaces are keyed by theme family (a classic theme and its luxe version share content);
// `variant` remembers which version was active when it was saved.
async function saveWorkspace(themeId, variant = themeId) {
  const data = { ...(await captureContent()), variant };
  if (!data.pages.length && !data.posts.length) return; // nothing worth keeping (e.g. a fresh install)
  await prisma.themeWorkspace.upsert({ where: { themeId }, update: { data }, create: { themeId, data } });
}

// Restores a family's saved content. Returns the variant it was saved with, or false.
async function loadWorkspace(themeId) {
  const ws = await prisma.themeWorkspace.findUnique({ where: { themeId } });
  if (!ws) return false;
  await restoreContent(ws.data);
  return ws.data.variant || themeId;
}

// { themeId: { savedAt, posts, pages, series } } for the Themes screen.
async function workspaceSummary() {
  const rows = await prisma.themeWorkspace.findMany();
  return Object.fromEntries(rows.map((w) => [w.themeId, {
    savedAt: w.updatedAt, posts: w.data.posts?.length || 0, pages: w.data.pages?.length || 0, series: w.data.series?.length || 0,
  }]));
}

module.exports = { saveWorkspace, loadWorkspace, clearContent, workspaceSummary, captureContent, restoreContent };
