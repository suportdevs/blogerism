const express = require('express');
const prisma = require('../lib/prisma');
const { authenticate, authorize } = require('../middleware/auth');
const { z } = require('zod');
const { asyncHandler, paginate, pageMeta, HttpError, logActivity } = require('../lib/utils');
const { buildExportContext, streamExport } = require('../lib/exporter');
const { publicTheme } = require('../themes');

// Dashboard analytics + activity log endpoints.
const router = express.Router();
router.use(authenticate);

router.get('/dashboard', asyncHandler(async (_req, res) => {
  const since = new Date();
  since.setDate(since.getDate() - 29);
  since.setHours(0, 0, 0, 0);

  const [posts, published, pages, users, media, unread, subscribers, views, comments, pendingComments, topPosts, recentPosts, recentMessages, recentActivity, postsByDay, subsByDay, categories] =
    await Promise.all([
      prisma.post.count(),
      prisma.post.count({ where: { status: 'PUBLISHED' } }),
      prisma.page.count(),
      prisma.user.count(),
      prisma.media.count(),
      prisma.contactMessage.count({ where: { status: 'UNREAD' } }),
      prisma.subscriber.count({ where: { isActive: true } }),
      prisma.post.aggregate({ _sum: { views: true, likes: true } }),
      prisma.comment.count({ where: { status: 'APPROVED' } }),
      prisma.comment.count({ where: { status: 'PENDING' } }),
      prisma.post.findMany({ where: { status: 'PUBLISHED' }, orderBy: { views: 'desc' }, take: 5, select: { id: true, title: true, slug: true, views: true, coverImage: true } }),
      prisma.post.findMany({ orderBy: { createdAt: 'desc' }, take: 5, select: { id: true, title: true, status: true, createdAt: true, author: { select: { name: true } } } }),
      prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
      prisma.activityLog.findMany({ orderBy: { createdAt: 'desc' }, take: 8, include: { user: { select: { name: true, avatar: true } } } }),
      prisma.$queryRaw`SELECT to_char(date_trunc('day', "createdAt"), 'YYYY-MM-DD') AS day, COUNT(*)::int AS count FROM "Post" WHERE "createdAt" >= ${since} GROUP BY 1`,
      prisma.$queryRaw`SELECT to_char(date_trunc('day', "createdAt"), 'YYYY-MM-DD') AS day, COUNT(*)::int AS count FROM "Subscriber" WHERE "createdAt" >= ${since} GROUP BY 1`,
      prisma.category.findMany({ select: { name: true, color: true, _count: { select: { posts: true } } }, orderBy: { posts: { _count: 'desc' } }, take: 6 }),
    ]);

  const toMap = (rows) => Object.fromEntries(rows.map((r) => [r.day, r.count]));
  const p = toMap(postsByDay);
  const s = toMap(subsByDay);
  const timeline = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(since);
    d.setDate(d.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    return { day: key, posts: p[key] || 0, subscribers: s[key] || 0 };
  });

  res.json({
    stats: { posts, published, drafts: posts - published, pages, users, media, unread, subscribers, views: views._sum.views || 0, likes: views._sum.likes || 0, comments, pendingComments },
    timeline,
    categories: categories.map((c) => ({ name: c.name, color: c.color, value: c._count.posts })),
    topPosts,
    recentPosts,
    recentMessages,
    recentActivity,
  });
}));

router.get('/logs', authorize('logs'), asyncHandler(async (req, res) => {
  const { page, limit, skip } = paginate(req.query, 30);
  const where = {};
  if (req.query.entity) where.entity = req.query.entity;
  if (req.query.action) where.action = req.query.action;
  if (req.query.q) where.description = { contains: req.query.q, mode: 'insensitive' };
  const [items, total, entities] = await Promise.all([
    prisma.activityLog.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take: limit, include: { user: { select: { id: true, name: true, avatar: true } } } }),
    prisma.activityLog.count({ where }),
    prisma.activityLog.findMany({ distinct: ['entity'], select: { entity: true } }),
  ]);
  res.json({ items, meta: pageMeta(total, page, limit), entities: entities.map((e) => e.entity) });
}));

router.delete('/logs', authorize('logs'), asyncHandler(async (_req, res) => {
  const { count } = await prisma.activityLog.deleteMany();
  res.json({ count });
}));

/* ---------------- Export project (standalone client package) ---------------- */
const exportEnabled = () => process.env.ENABLE_EXPORT !== 'false';

router.get('/export/summary', authorize('settings'), asyncHandler(async (_req, res) => {
  const { snapshot, uploads } = await buildExportContext({ name: 'preview', siteUrl: 'https://example.com', apiUrl: 'https://api.example.com', adminEmail: '', adminPassword: '' });
  const d = snapshot.data;
  const general = d.settings.find((s) => s.key === 'general')?.value || {};
  res.json({
    enabled: exportEnabled(),
    theme: publicTheme(snapshot.theme),
    siteName: general.siteName,
    counts: { posts: d.posts.length, pages: d.pages.length, series: d.series.length, categories: d.categories.length, menus: d.menus.length, users: d.users.length, mediaFiles: uploads.length },
  });
}));

router.post('/export', authorize('settings'), asyncHandler(async (req, res) => {
  if (!exportEnabled()) throw new HttpError(403, 'Project export is disabled on this installation');
  const url = z.string().url('Enter a full URL, e.g. https://example.com');
  const opts = z.object({
    name: z.string().min(2, 'Project name is required').max(60),
    siteUrl: url,
    apiUrl: url,
    adminEmail: z.string().email('Enter the admin email'),
    adminPassword: z.string().min(8, 'Admin password must be at least 8 characters'),
    adminName: z.string().max(80).optional(),
    includeMessages: z.boolean().default(false),
    includeUsers: z.boolean().default(false),
  }).parse(req.body);
  await logActivity(req, 'created', 'Export', null, `Exported project "${opts.name}"`);
  await streamExport(res, opts);
}));

// Global admin search across content types (powers the ⌘K command palette).
router.get('/search', asyncHandler(async (req, res) => {
  const q = String(req.query.q || '').trim();
  if (q.length < 2) return res.json({ posts: [], pages: [], users: [] });
  const contains = { contains: q, mode: 'insensitive' };
  const [posts, pages, categories] = await Promise.all([
    prisma.post.findMany({ where: { title: contains }, take: 6, select: { id: true, title: true, status: true } }),
    prisma.page.findMany({ where: { title: contains }, take: 6, select: { id: true, title: true, status: true } }),
    prisma.category.findMany({ where: { name: contains }, take: 4, select: { id: true, name: true } }),
  ]);
  res.json({ posts, pages, categories });
}));

module.exports = router;
