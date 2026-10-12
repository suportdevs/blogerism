const express = require('express');
const { z } = require('zod');
const prisma = require('../lib/prisma');
const { authenticate, authorize } = require('../middleware/auth');
const { asyncHandler, uniqueSlug, logActivity, toInt } = require('../lib/utils');

// Categories and tags share a router since both are managed under the "categories" permission.
const router = express.Router();
router.use(authenticate, authorize('categories', 'posts'));

const categorySchema = z.object({
  name: z.string().min(1),
  slug: z.string().optional(),
  description: z.string().nullable().optional(),
  color: z.string().optional(),
  order: z.number().int().optional(),
  parentId: z.number().int().nullable().optional(),
});

router.get('/categories', asyncHandler(async (_req, res) => {
  const items = await prisma.category.findMany({ orderBy: [{ order: 'asc' }, { name: 'asc' }], include: { _count: { select: { posts: true } } } });
  res.json({ items });
}));

router.post('/categories', authorize('categories'), asyncHandler(async (req, res) => {
  const { slug, ...data } = categorySchema.parse(req.body);
  const item = await prisma.category.create({ data: { ...data, slug: await uniqueSlug('category', slug || data.name) } });
  await logActivity(req, 'created', 'Category', item.id, `Created category "${item.name}"`);
  res.status(201).json(item);
}));

router.put('/categories/:id', authorize('categories'), asyncHandler(async (req, res) => {
  const id = toInt(req.params.id);
  const { slug, ...data } = categorySchema.partial().parse(req.body);
  if (data.parentId === id) data.parentId = null;
  if (slug !== undefined || data.name) data.slug = await uniqueSlug('category', slug || data.name, id);
  const item = await prisma.category.update({ where: { id }, data });
  await logActivity(req, 'updated', 'Category', item.id, `Updated category "${item.name}"`);
  res.json(item);
}));

router.delete('/categories/:id', authorize('categories'), asyncHandler(async (req, res) => {
  const item = await prisma.category.delete({ where: { id: toInt(req.params.id) } });
  await logActivity(req, 'deleted', 'Category', item.id, `Deleted category "${item.name}"`);
  res.status(204).end();
}));

router.get('/tags', asyncHandler(async (req, res) => {
  const where = req.query.q ? { name: { contains: req.query.q, mode: 'insensitive' } } : {};
  const items = await prisma.tag.findMany({ where, orderBy: { name: 'asc' }, include: { _count: { select: { posts: true } } } });
  res.json({ items });
}));

router.post('/tags', authorize('categories'), asyncHandler(async (req, res) => {
  const { name, slug } = z.object({ name: z.string().min(1), slug: z.string().optional() }).parse(req.body);
  const item = await prisma.tag.create({ data: { name, slug: await uniqueSlug('tag', slug || name) } });
  await logActivity(req, 'created', 'Tag', item.id, `Created tag "${item.name}"`);
  res.status(201).json(item);
}));

router.put('/tags/:id', authorize('categories'), asyncHandler(async (req, res) => {
  const id = toInt(req.params.id);
  const { name, slug } = z.object({ name: z.string().min(1), slug: z.string().optional() }).parse(req.body);
  const item = await prisma.tag.update({ where: { id }, data: { name, slug: await uniqueSlug('tag', slug || name, id) } });
  res.json(item);
}));

router.delete('/tags/:id', authorize('categories'), asyncHandler(async (req, res) => {
  const item = await prisma.tag.delete({ where: { id: toInt(req.params.id) } });
  await logActivity(req, 'deleted', 'Tag', item.id, `Deleted tag "${item.name}"`);
  res.status(204).end();
}));

module.exports = router;
