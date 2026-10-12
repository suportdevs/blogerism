const express = require('express');
const { z } = require('zod');
const prisma = require('../lib/prisma');
const { authenticate, authorize } = require('../middleware/auth');
const { asyncHandler, paginate, pageMeta, uniqueSlug, logActivity, toInt } = require('../lib/utils');

const router = express.Router();
router.use(authenticate);

const seriesSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().optional(),
  type: z.enum(['SHOW', 'PLAYLIST', 'PODCAST']).default('SHOW'),
  tagline: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  poster: z.string().nullable().optional(),
  backdrop: z.string().nullable().optional(),
  trailerUrl: z.string().nullable().optional(),
  year: z.number().int().nullable().optional(),
  maturity: z.string().nullable().optional(),
  genres: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  status: z.enum(['DRAFT', 'PUBLISHED', 'SCHEDULED']).default('PUBLISHED'),
  order: z.number().int().default(0),
});

// Listing is open to post editors too, so the post editor can assign episodes to a series.
router.get('/', authorize('series', 'posts'), asyncHandler(async (req, res) => {
  const { page, limit, skip } = paginate(req.query, 50);
  const where = {};
  if (req.query.type) where.type = req.query.type;
  if (req.query.q) where.title = { contains: req.query.q, mode: 'insensitive' };
  const [items, total] = await Promise.all([
    prisma.series.findMany({ where, orderBy: [{ order: 'asc' }, { createdAt: 'desc' }], skip, take: limit, include: { _count: { select: { posts: true } } } }),
    prisma.series.count({ where }),
  ]);
  res.json({ items, meta: pageMeta(total, page, limit) });
}));

router.get('/:id', authorize('series'), asyncHandler(async (req, res) => {
  res.json(await prisma.series.findUniqueOrThrow({
    where: { id: toInt(req.params.id) },
    include: { posts: { select: { id: true, title: true, status: true, season: true, episode: true, duration: true, coverImage: true }, orderBy: [{ season: 'asc' }, { episode: 'asc' }] } },
  }));
}));

router.post('/', authorize('series'), asyncHandler(async (req, res) => {
  const { slug, ...data } = seriesSchema.parse(req.body);
  const item = await prisma.series.create({ data: { ...data, slug: await uniqueSlug('series', slug || data.title) } });
  await logActivity(req, 'created', 'Series', item.id, `Created ${item.type.toLowerCase()} "${item.title}"`);
  res.status(201).json(item);
}));

router.put('/:id', authorize('series'), asyncHandler(async (req, res) => {
  const id = toInt(req.params.id);
  const { slug, ...data } = seriesSchema.partial().parse(req.body);
  if (slug !== undefined || data.title) data.slug = await uniqueSlug('series', slug || data.title, id);
  const item = await prisma.series.update({ where: { id }, data });
  await logActivity(req, 'updated', 'Series', item.id, `Updated ${item.type.toLowerCase()} "${item.title}"`);
  res.json(item);
}));

router.delete('/:id', authorize('series'), asyncHandler(async (req, res) => {
  const item = await prisma.series.delete({ where: { id: toInt(req.params.id) } });
  await logActivity(req, 'deleted', 'Series', item.id, `Deleted ${item.type.toLowerCase()} "${item.title}"`);
  res.status(204).end();
}));

module.exports = router;
