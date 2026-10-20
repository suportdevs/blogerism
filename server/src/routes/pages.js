const express = require('express');
const { z } = require('zod');
const prisma = require('../lib/prisma');
const { authenticate, authorize } = require('../middleware/auth');
const { asyncHandler, paginate, pageMeta, uniqueSlug, logActivity, toInt } = require('../lib/utils');
const { saveRevision, listRevisions, getRevision } = require('../lib/revisions');
const trashBin = require('../lib/trash');
const { pagePath, autoRedirect } = require('../lib/redirects');

const router = express.Router();
router.use(authenticate, authorize('pages'));

const pageSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().optional(),
  template: z.enum(['default', 'full-width', 'landing', 'sidebar']).default('default'),
  blocks: z.array(z.object({ id: z.string(), type: z.string(), data: z.record(z.any()), style: z.record(z.any()).optional() }).passthrough()).default([]),
  status: z.enum(['DRAFT', 'PUBLISHED', 'SCHEDULED']).default('DRAFT'),
  seoTitle: z.string().nullable().optional(),
  seoDescription: z.string().nullable().optional(),
  ogImage: z.string().nullable().optional(),
});

router.get('/', asyncHandler(async (req, res) => {
  const { page, limit, skip } = paginate(req.query, 20);
  const where = {};
  if (req.query.q) where.title = { contains: req.query.q, mode: 'insensitive' };
  where.status = req.query.status || { not: 'TRASH' };
  const [items, total, counts] = await Promise.all([
    prisma.page.findMany({ where, orderBy: { updatedAt: 'desc' }, skip, take: limit, omit: { blocks: true } }),
    prisma.page.count({ where }),
    prisma.page.groupBy({ by: ['status'], _count: true }),
  ]);
  res.json({ items, meta: pageMeta(total, page, limit), statusCounts: Object.fromEntries(counts.map((c) => [c.status, c._count])) });
}));

router.get('/:id', asyncHandler(async (req, res) => {
  res.json(await prisma.page.findUniqueOrThrow({ where: { id: toInt(req.params.id) } }));
}));

router.post('/', asyncHandler(async (req, res) => {
  const { slug, ...data } = pageSchema.parse(req.body);
  const page = await prisma.page.create({ data: { ...data, slug: await uniqueSlug('page', slug || data.title) } });
  await saveRevision('page', page, req.user);
  await logActivity(req, 'created', 'Page', page.id, `Created page "${page.title}"`);
  res.status(201).json(page);
}));

router.put('/:id', asyncHandler(async (req, res) => {
  const id = toInt(req.params.id);
  const { slug, ...data } = pageSchema.partial().parse(req.body);
  if (slug !== undefined || data.title) data.slug = await uniqueSlug('page', slug || data.title, id);
  const before = await prisma.page.findUniqueOrThrow({ where: { id }, select: { slug: true, status: true } });
  const page = await prisma.page.update({ where: { id }, data });
  if (before.status === 'PUBLISHED') await autoRedirect(pagePath(before), pagePath(page));
  await saveRevision('page', page, req.user);
  await logActivity(req, 'updated', 'Page', page.id, `Updated page "${page.title}"`);
  res.json(page);
}));

router.get('/:id/revisions', asyncHandler(async (req, res) => {
  res.json(await listRevisions('page', toInt(req.params.id)));
}));

router.get('/:id/revisions/:revId', asyncHandler(async (req, res) => {
  res.json(await getRevision('page', toInt(req.params.id), toInt(req.params.revId)));
}));

router.post('/:id/revisions/:revId/restore', asyncHandler(async (req, res) => {
  const id = toInt(req.params.id);
  const rev = await getRevision('page', id, toInt(req.params.revId));
  const page = await prisma.page.update({ where: { id }, data: { ...rev.data, blocks: rev.data.blocks || [] } });
  await saveRevision('page', page, req.user);
  await logActivity(req, 'updated', 'Page', page.id, `Restored a revision of page "${page.title}"`);
  res.json(page);
}));

router.post('/:id/restore', asyncHandler(async (req, res) => {
  const id = toInt(req.params.id);
  await trashBin.restore('page', [id]);
  const page = await prisma.page.findUniqueOrThrow({ where: { id }, select: { id: true, title: true } });
  await logActivity(req, 'updated', 'Page', id, `Restored page "${page.title}" from the trash`);
  res.json(page);
}));

router.post('/empty-trash', asyncHandler(async (req, res) => {
  const count = await trashBin.emptyTrash('page');
  await logActivity(req, 'deleted', 'Page', null, `Emptied the trash (${count} page(s))`);
  res.json({ count });
}));

router.post('/:id/duplicate', asyncHandler(async (req, res) => {
  const src = await prisma.page.findUniqueOrThrow({ where: { id: toInt(req.params.id) } });
  const title = `${src.title} (Copy)`;
  const page = await prisma.page.create({
    data: { title, slug: await uniqueSlug('page', title), template: src.template, blocks: src.blocks, status: 'DRAFT', seoTitle: src.seoTitle, seoDescription: src.seoDescription },
  });
  await logActivity(req, 'created', 'Page', page.id, `Duplicated page "${src.title}"`);
  res.status(201).json(page);
}));

// Moves the page to the trash; a page already in the trash (or ?permanent=1) is deleted for good.
router.delete('/:id', asyncHandler(async (req, res) => {
  const page = await prisma.page.findUniqueOrThrow({ where: { id: toInt(req.params.id) }, select: { id: true, title: true, status: true } });
  if (page.status === 'TRASH' || req.query.permanent === '1') {
    await trashBin.destroy('page', [page.id]);
    await logActivity(req, 'deleted', 'Page', page.id, `Permanently deleted page "${page.title}"`);
  } else {
    await trashBin.trash('page', [page.id]);
    await logActivity(req, 'deleted', 'Page', page.id, `Moved page "${page.title}" to the trash`);
  }
  res.status(204).end();
}));

module.exports = router;
