const express = require('express');
const { z } = require('zod');
const prisma = require('../lib/prisma');
const { authenticate, authorize } = require('../middleware/auth');
const { asyncHandler, paginate, pageMeta, uniqueSlug, logActivity, toInt } = require('../lib/utils');

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
  if (req.query.status) where.status = req.query.status;
  const [items, total] = await Promise.all([
    prisma.page.findMany({ where, orderBy: { updatedAt: 'desc' }, skip, take: limit, omit: { blocks: true } }),
    prisma.page.count({ where }),
  ]);
  res.json({ items, meta: pageMeta(total, page, limit) });
}));

router.get('/:id', asyncHandler(async (req, res) => {
  res.json(await prisma.page.findUniqueOrThrow({ where: { id: toInt(req.params.id) } }));
}));

router.post('/', asyncHandler(async (req, res) => {
  const { slug, ...data } = pageSchema.parse(req.body);
  const page = await prisma.page.create({ data: { ...data, slug: await uniqueSlug('page', slug || data.title) } });
  await logActivity(req, 'created', 'Page', page.id, `Created page "${page.title}"`);
  res.status(201).json(page);
}));

router.put('/:id', asyncHandler(async (req, res) => {
  const id = toInt(req.params.id);
  const { slug, ...data } = pageSchema.partial().parse(req.body);
  if (slug !== undefined || data.title) data.slug = await uniqueSlug('page', slug || data.title, id);
  const page = await prisma.page.update({ where: { id }, data });
  await logActivity(req, 'updated', 'Page', page.id, `Updated page "${page.title}"`);
  res.json(page);
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

router.delete('/:id', asyncHandler(async (req, res) => {
  const page = await prisma.page.delete({ where: { id: toInt(req.params.id) } });
  await logActivity(req, 'deleted', 'Page', page.id, `Deleted page "${page.title}"`);
  res.status(204).end();
}));

module.exports = router;
