const express = require('express');
const { z } = require('zod');
const prisma = require('../lib/prisma');
const { authenticate, authorize } = require('../middleware/auth');
const { asyncHandler, paginate, pageMeta, uniqueSlug, readingTime, logActivity, toInt } = require('../lib/utils');
const { saveRevision, listRevisions, getRevision } = require('../lib/revisions');
const trashBin = require('../lib/trash');
const { postPath, autoRedirect } = require('../lib/redirects');

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
  where.status = req.query.status || { not: 'TRASH' };
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
  await saveRevision('post', post, req.user);
  await logActivity(req, 'created', 'Post', post.id, `Created post "${post.title}"`);
  res.status(201).json(post);
}));

router.put('/:id', asyncHandler(async (req, res) => {
  const id = toInt(req.params.id);
  const input = postSchema.partial().parse(req.body);
  const before = await prisma.post.findUniqueOrThrow({ where: { id }, select: { slug: true, format: true, status: true } });
  const post = await prisma.post.update({ where: { id }, data: await buildData(input, id), include });
  if (before.status === 'PUBLISHED' || before.status === 'SCHEDULED') await autoRedirect(postPath(before), postPath(post));
  await saveRevision('post', post, req.user);
  await logActivity(req, 'updated', 'Post', post.id, `Updated post "${post.title}"`);
  res.json(post);
}));

router.get('/:id/revisions', asyncHandler(async (req, res) => {
  res.json(await listRevisions('post', toInt(req.params.id)));
}));

router.get('/:id/revisions/:revId', asyncHandler(async (req, res) => {
  res.json(await getRevision('post', toInt(req.params.id), toInt(req.params.revId)));
}));

// Copies a revision's content back onto the post (slug and status stay as they are).
router.post('/:id/revisions/:revId/restore', asyncHandler(async (req, res) => {
  const id = toInt(req.params.id);
  const rev = await getRevision('post', id, toInt(req.params.revId));
  const { categoryIds = [], tags = [], ...fields } = rev.data;
  if (fields.seriesId && !(await prisma.series.findUnique({ where: { id: fields.seriesId }, select: { id: true } }))) fields.seriesId = null;
  const categories = await prisma.category.findMany({ where: { id: { in: categoryIds } }, select: { id: true } });
  const post = await prisma.post.update({
    where: { id },
    data: { ...fields, gallery: fields.gallery || [], readingTime: readingTime(fields.content || ''), categories: { set: categories }, tags: { set: await resolveTags(tags) } },
    include,
  });
  await saveRevision('post', post, req.user);
  await logActivity(req, 'updated', 'Post', post.id, `Restored a revision of post "${post.title}"`);
  res.json(post);
}));

router.post('/:id/restore', asyncHandler(async (req, res) => {
  const id = toInt(req.params.id);
  await trashBin.restore('post', [id]);
  const post = await prisma.post.findUniqueOrThrow({ where: { id }, select: { id: true, title: true } });
  await logActivity(req, 'updated', 'Post', id, `Restored post "${post.title}" from the trash`);
  res.json(post);
}));

router.post('/empty-trash', asyncHandler(async (req, res) => {
  const count = await trashBin.emptyTrash('post');
  await logActivity(req, 'deleted', 'Post', null, `Emptied the trash (${count} post(s))`);
  res.json({ count });
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
  const { ids, action } = z.object({ ids: z.array(z.number()).min(1), action: z.enum(['publish', 'draft', 'trash', 'restore', 'delete']) }).parse(req.body);
  const live = { id: { in: ids }, NOT: { status: 'TRASH' } };
  let count;
  if (action === 'delete') count = await trashBin.destroy('post', ids);
  else if (action === 'trash') ({ count } = await trashBin.trash('post', ids));
  else if (action === 'restore') ({ count } = await trashBin.restore('post', ids));
  else if (action === 'publish') ({ count } = await prisma.post.updateMany({ where: live, data: { status: 'PUBLISHED', publishedAt: new Date() } }));
  else ({ count } = await prisma.post.updateMany({ where: live, data: { status: 'DRAFT' } }));
  await logActivity(req, action === 'delete' || action === 'trash' ? 'deleted' : 'updated', 'Post', ids.join(','), `Bulk ${action} on ${count} post(s)`);
  res.json({ count });
}));

// Moves the post to the trash; a post already in the trash (or ?permanent=1) is deleted for good.
router.delete('/:id', asyncHandler(async (req, res) => {
  const post = await prisma.post.findUniqueOrThrow({ where: { id: toInt(req.params.id) }, select: { id: true, title: true, status: true } });
  if (post.status === 'TRASH' || req.query.permanent === '1') {
    await trashBin.destroy('post', [post.id]);
    await logActivity(req, 'deleted', 'Post', post.id, `Permanently deleted post "${post.title}"`);
  } else {
    await trashBin.trash('post', [post.id]);
    await logActivity(req, 'deleted', 'Post', post.id, `Moved post "${post.title}" to the trash`);
  }
  res.status(204).end();
}));

module.exports = router;
