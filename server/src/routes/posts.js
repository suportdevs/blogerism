const express = require('express');
const { z } = require('zod');
const prisma = require('../lib/prisma');
const { authenticate, authorize } = require('../middleware/auth');
const { asyncHandler, paginate, pageMeta, uniqueSlug, readingTime, logActivity, toInt } = require('../lib/utils');

const router = express.Router();
router.use(authenticate, authorize('posts'));

const postSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().optional(),
  excerpt: z.string().nullable().optional(),
  content: z.string().default(''),
  coverImage: z.string().nullable().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'SCHEDULED']).default('DRAFT'),
  format: z.enum(['STANDARD', 'VIDEO', 'AUDIO', 'GALLERY']).default('STANDARD'),
  subtitle: z.string().nullable().optional(),
  videoUrl: z.string().nullable().optional(),
  audioUrl: z.string().nullable().optional(),
  duration: z.number().int().min(0).nullable().optional(),
  gallery: z.array(z.object({ src: z.string(), caption: z.string().optional() })).default([]),
  isBreaking: z.boolean().default(false),
  seriesId: z.number().int().nullable().optional(),
  season: z.number().int().nullable().optional(),
  episode: z.number().int().nullable().optional(),
  featured: z.boolean().default(false),
  allowComments: z.boolean().default(true),
  categoryIds: z.array(z.number()).default([]),
  tags: z.array(z.string()).default([]),
  seoTitle: z.string().nullable().optional(),
  seoDescription: z.string().nullable().optional(),
  publishedAt: z.string().nullable().optional(),
});

const include = {
  author: { select: { id: true, name: true, avatar: true } },
  categories: { select: { id: true, name: true, slug: true, color: true } },
  tags: { select: { id: true, name: true, slug: true } },
  series: { select: { id: true, title: true, slug: true, type: true } },
};

// Resolve tag names to ids, creating missing tags on the fly.
async function resolveTags(names) {
  const unique = [...new Set(names.map((n) => n.trim()).filter(Boolean))];
  const tags = [];
  for (const name of unique) {
    const existing = await prisma.tag.findFirst({ where: { name: { equals: name, mode: 'insensitive' } } });
    tags.push(existing || (await prisma.tag.create({ data: { name, slug: await uniqueSlug('tag', name) } })));
  }
  return tags.map((t) => ({ id: t.id }));
}

async function buildData(input, existingId) {
  const { categoryIds, tags, publishedAt, slug, ...rest } = input;
  const data = { ...rest };
  if (input.title !== undefined || slug !== undefined) data.slug = await uniqueSlug('post', slug || input.title, existingId);
  if (input.content !== undefined) data.readingTime = readingTime(input.content);
  if (publishedAt !== undefined) data.publishedAt = publishedAt ? new Date(publishedAt) : null;
  if (input.status === 'PUBLISHED' && !data.publishedAt) data.publishedAt = new Date();
  if (categoryIds) data.categories = { set: categoryIds.map((id) => ({ id })) };
  if (tags) data.tags = { set: await resolveTags(tags) };
  return data;
}

router.get('/', asyncHandler(async (req, res) => {
  const { page, limit, skip } = paginate(req.query, 15);
  const where = {};
  if (req.query.q) where.title = { contains: req.query.q, mode: 'insensitive' };
  if (req.query.status) where.status = req.query.status;
  if (req.query.format) where.format = req.query.format;
  if (req.query.series) where.seriesId = toInt(req.query.series);
  if (req.query.category) where.categories = { some: { id: toInt(req.query.category) } };
  const sortable = ['createdAt', 'title', 'views', 'publishedAt'];
  const sort = sortable.includes(req.query.sort) ? req.query.sort : 'createdAt';
  const [items, total, counts] = await Promise.all([
    prisma.post.findMany({ where, include, orderBy: { [sort]: req.query.order === 'asc' ? 'asc' : 'desc' }, skip, take: limit, omit: { content: true } }),
    prisma.post.count({ where }),
    prisma.post.groupBy({ by: ['status'], _count: true }),
  ]);
  const statusCounts = Object.fromEntries(counts.map((c) => [c.status, c._count]));
  res.json({ items, meta: pageMeta(total, page, limit), statusCounts });
}));

router.get('/:id', asyncHandler(async (req, res) => {
  res.json(await prisma.post.findUniqueOrThrow({ where: { id: toInt(req.params.id) }, include }));
}));

router.post('/', asyncHandler(async (req, res) => {
  const input = postSchema.parse(req.body);
  const data = await buildData(input);
  data.categories = { connect: input.categoryIds.map((id) => ({ id })) };
  data.tags = { connect: await resolveTags(input.tags) };
  const post = await prisma.post.create({ data: { ...data, authorId: req.user.id }, include });
  await logActivity(req, 'created', 'Post', post.id, `Created post "${post.title}"`);
  res.status(201).json(post);
}));

router.put('/:id', asyncHandler(async (req, res) => {
  const id = toInt(req.params.id);
  const input = postSchema.partial().parse(req.body);
  const post = await prisma.post.update({ where: { id }, data: await buildData(input, id), include });
  await logActivity(req, 'updated', 'Post', post.id, `Updated post "${post.title}"`);
  res.json(post);
}));

router.post('/:id/duplicate', asyncHandler(async (req, res) => {
  const src = await prisma.post.findUniqueOrThrow({ where: { id: toInt(req.params.id) }, include });
  const title = `${src.title} (Copy)`;
  const post = await prisma.post.create({
    data: {
      title,
      slug: await uniqueSlug('post', title),
      excerpt: src.excerpt,
      content: src.content,
      coverImage: src.coverImage,
      format: src.format,
      subtitle: src.subtitle,
      videoUrl: src.videoUrl,
      audioUrl: src.audioUrl,
      duration: src.duration,
      gallery: src.gallery,
      seriesId: src.seriesId,
      readingTime: src.readingTime,
      status: 'DRAFT',
      authorId: req.user.id,
      seoTitle: src.seoTitle,
      seoDescription: src.seoDescription,
      categories: { connect: src.categories.map((c) => ({ id: c.id })) },
      tags: { connect: src.tags.map((t) => ({ id: t.id })) },
    },
  });
  await logActivity(req, 'created', 'Post', post.id, `Duplicated post "${src.title}"`);
  res.status(201).json(post);
}));

router.post('/bulk', asyncHandler(async (req, res) => {
  const { ids, action } = z.object({ ids: z.array(z.number()).min(1), action: z.enum(['publish', 'draft', 'delete']) }).parse(req.body);
  let count;
  if (action === 'delete') ({ count } = await prisma.post.deleteMany({ where: { id: { in: ids } } }));
  else if (action === 'publish') ({ count } = await prisma.post.updateMany({ where: { id: { in: ids } }, data: { status: 'PUBLISHED', publishedAt: new Date() } }));
  else ({ count } = await prisma.post.updateMany({ where: { id: { in: ids } }, data: { status: 'DRAFT' } }));
  await logActivity(req, action === 'delete' ? 'deleted' : 'updated', 'Post', ids.join(','), `Bulk ${action} on ${count} post(s)`);
  res.json({ count });
}));

router.delete('/:id', asyncHandler(async (req, res) => {
  const post = await prisma.post.delete({ where: { id: toInt(req.params.id) } });
  await logActivity(req, 'deleted', 'Post', post.id, `Deleted post "${post.title}"`);
  res.status(204).end();
}));

module.exports = router;
