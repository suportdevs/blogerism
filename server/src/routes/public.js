const express = require('express');
const rateLimit = require('express-rate-limit');
const { z } = require('zod');
const prisma = require('../lib/prisma');
const { asyncHandler, paginate, pageMeta, HttpError } = require('../lib/utils');
const { getSettings } = require('../lib/settings');
const { toTree } = require('./menus');
const { publicTheme } = require('../themes');

// Unauthenticated endpoints consumed by the Next.js storefront.
const router = express.Router();
const formLimiter = rateLimit({ windowMs: 10 * 60 * 1000, limit: 10, standardHeaders: true, legacyHeaders: false, message: { message: 'Too many submissions, please try again later.' } });

// Published posts (optionally with a future date) and scheduled posts whose date has passed.
const live = () => {
  const now = new Date();
  return {
    OR: [
      { status: 'PUBLISHED', OR: [{ publishedAt: null }, { publishedAt: { lte: now } }] },
      { status: 'SCHEDULED', publishedAt: { lte: now } },
    ],
  };
};
const cardSelect = {
  id: true, title: true, slug: true, excerpt: true, coverImage: true, featured: true, views: true, readingTime: true, publishedAt: true, createdAt: true,
  format: true, subtitle: true, videoUrl: true, audioUrl: true, duration: true, isBreaking: true, season: true, episode: true, likes: true,
  author: { select: { id: true, name: true, avatar: true } },
  categories: { select: { id: true, name: true, slug: true, color: true } },
  series: { select: { id: true, title: true, slug: true, type: true, poster: true } },
};
const FORMATS = ['STANDARD', 'VIDEO', 'AUDIO', 'GALLERY'];
const SERIES_TYPES = ['SHOW', 'PLAYLIST', 'PODCAST'];
const episodeOrder = [{ season: 'asc' }, { episode: 'asc' }, { publishedAt: 'asc' }];
const seriesCard = {
  id: true, title: true, slug: true, type: true, tagline: true, description: true, poster: true, backdrop: true, trailerUrl: true,
  year: true, maturity: true, genres: true, featured: true,
};

router.get('/bootstrap', asyncHandler(async (_req, res) => {
  const [settings, menus] = await Promise.all([
    getSettings(),
    prisma.menu.findMany({ include: { items: true } }),
  ]);
  res.json({ settings, theme: publicTheme(settings.theme.active), menus: Object.fromEntries(menus.map((m) => [m.location, { name: m.name, items: toTree(m.items) }])) });
}));

router.get('/home', asyncHandler(async (_req, res) => {
  const { general } = await getSettings();
  let page = general.homepageId ? await prisma.page.findFirst({ where: { id: general.homepageId, status: 'PUBLISHED' } }) : null;
  if (!page) page = await prisma.page.findFirst({ where: { slug: 'home', status: 'PUBLISHED' } });
  res.json({ page });
}));

router.get('/posts', asyncHandler(async (req, res) => {
  const { page, limit, skip } = paginate(req.query, 9);
  const where = live();
  if (req.query.category) where.categories = { some: { slug: req.query.category } };
  if (req.query.tag) where.tags = { some: { slug: req.query.tag } };
  if (req.query.author) where.authorId = parseInt(req.query.author, 10) || undefined;
  if (req.query.featured === 'true') where.featured = true;
  if (req.query.breaking === 'true') where.isBreaking = true;
  if (req.query.format) {
    const formats = String(req.query.format).split(',').filter((f) => FORMATS.includes(f));
    if (formats.length) where.format = { in: formats };
  }
  if (req.query.series) where.series = { slug: req.query.series };
  if (req.query.exclude) where.id = { notIn: String(req.query.exclude).split(',').map(Number).filter(Boolean) };
  if (req.query.q) {
    where.AND = [{ OR: ['title', 'excerpt', 'content'].map((f) => ({ [f]: { contains: req.query.q, mode: 'insensitive' } })) }];
  }
  const SORTS = { popular: { views: 'desc' }, oldest: { publishedAt: 'asc' }, liked: { likes: 'desc' }, episodes: episodeOrder };
  const orderBy = SORTS[req.query.sort] || { publishedAt: 'desc' };
  const [items, total] = await Promise.all([
    prisma.post.findMany({ where, select: cardSelect, orderBy, skip, take: limit }),
    prisma.post.count({ where }),
  ]);
  res.json({ items, meta: pageMeta(total, page, limit) });
}));

router.get('/posts/:slug', asyncHandler(async (req, res) => {
  const post = await prisma.post.findFirst({
    where: { ...live(), slug: req.params.slug },
    include: {
      author: { select: { id: true, name: true, avatar: true, bio: true } },
      categories: { select: { id: true, name: true, slug: true, color: true } },
      tags: { select: { id: true, name: true, slug: true } },
      series: { select: seriesCard },
    },
  });
  if (!post) throw new HttpError(404, 'Post not found');
  if (req.query.view !== 'false') await prisma.post.update({ where: { id: post.id }, data: { views: { increment: 1 } } });

  const date = post.publishedAt || post.createdAt;
  const sameFormat = { format: post.format };
  const [related, prev, next, episodes, upNext] = await Promise.all([
    prisma.post.findMany({
      where: { ...live(), ...sameFormat, id: { not: post.id }, categories: { some: { id: { in: post.categories.map((c) => c.id) } } } },
      select: cardSelect, take: post.format === 'STANDARD' ? 3 : 6, orderBy: { publishedAt: 'desc' },
    }),
    prisma.post.findFirst({ where: { ...live(), ...sameFormat, publishedAt: { lt: date } }, orderBy: { publishedAt: 'desc' }, select: { title: true, slug: true, format: true } }),
    prisma.post.findFirst({ where: { ...live(), ...sameFormat, publishedAt: { gt: date } }, orderBy: { publishedAt: 'asc' }, select: { title: true, slug: true, format: true } }),
    // Every episode in the same series (for season lists / playlists / podcast feeds).
    post.seriesId ? prisma.post.findMany({ where: { ...live(), seriesId: post.seriesId }, select: cardSelect, orderBy: episodeOrder }) : [],
    // Media "up next" list for watch/listen pages when the post isn't part of a series.
    post.format !== 'STANDARD' ? prisma.post.findMany({ where: { ...live(), ...sameFormat, id: { not: post.id } }, select: cardSelect, take: 10, orderBy: { publishedAt: 'desc' } }) : [],
  ]);
  res.json({ post, related, prev, next, episodes, upNext });
}));

router.post('/posts/:slug/like', formLimiter, asyncHandler(async (req, res) => {
  const post = await prisma.post.update({ where: { slug: req.params.slug }, data: { likes: { increment: 1 } }, select: { likes: true } });
  res.json(post);
}));

// Series: shows (Netflix-style), playlists (YouTube) and podcasts.
router.get('/series', asyncHandler(async (req, res) => {
  const limit = Math.min(50, parseInt(req.query.limit, 10) || 12);
  const where = { status: 'PUBLISHED' };
  if (SERIES_TYPES.includes(req.query.type)) where.type = req.query.type;
  if (req.query.featured === 'true') where.featured = true;
  const all = await prisma.series.findMany({
    where,
    select: {
      ...seriesCard, order: true, createdAt: true,
      posts: { where: live(), select: { slug: true, views: true, season: true, format: true }, orderBy: episodeOrder },
    },
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
  });
  let items = all.map(({ posts, ...s }) => ({
    ...s,
    episodeCount: posts.length,
    seasons: new Set(posts.map((p) => p.season || 1)).size,
    views: posts.reduce((n, p) => n + p.views, 0),
    firstEpisode: posts[0] ? { slug: posts[0].slug, format: posts[0].format } : null,
  }));
  if (req.query.sort === 'popular') items = items.sort((a, b) => b.views - a.views);
  if (req.query.sort === 'latest') items = items.sort((a, b) => b.createdAt - a.createdAt);
  res.json({ items: items.slice(0, limit) });
}));

router.get('/series/:slug', asyncHandler(async (req, res) => {
  const series = await prisma.series.findFirst({ where: { slug: req.params.slug, status: 'PUBLISHED' }, select: seriesCard });
  if (!series) throw new HttpError(404, 'Series not found');
  const episodes = await prisma.post.findMany({ where: { ...live(), seriesId: series.id }, select: cardSelect, orderBy: episodeOrder });
  res.json({ series, episodes });
}));

router.get('/categories', asyncHandler(async (_req, res) => {
  const items = await prisma.category.findMany({
    orderBy: [{ order: 'asc' }, { name: 'asc' }],
    include: { _count: { select: { posts: { where: { status: 'PUBLISHED' } } } } },
  });
  res.json({ items });
}));

router.get('/categories/:slug', asyncHandler(async (req, res) => {
  const item = await prisma.category.findUnique({ where: { slug: req.params.slug } });
  if (!item) throw new HttpError(404, 'Category not found');
  res.json(item);
}));

router.get('/tags', asyncHandler(async (_req, res) => {
  const items = await prisma.tag.findMany({ include: { _count: { select: { posts: true } } }, orderBy: { posts: { _count: 'desc' } }, take: 30 });
  res.json({ items });
}));

router.get('/tags/:slug', asyncHandler(async (req, res) => {
  const item = await prisma.tag.findUnique({ where: { slug: req.params.slug } });
  if (!item) throw new HttpError(404, 'Tag not found');
  res.json(item);
}));

router.get('/pages/:slug', asyncHandler(async (req, res) => {
  const page = await prisma.page.findFirst({ where: { slug: req.params.slug, status: 'PUBLISHED' } });
  if (!page) throw new HttpError(404, 'Page not found');
  res.json(page);
}));

router.get('/faqs', asyncHandler(async (_req, res) => {
  res.json({ items: await prisma.faq.findMany({ where: { isActive: true }, orderBy: [{ order: 'asc' }, { id: 'asc' }] }) });
}));

router.get('/testimonials', asyncHandler(async (_req, res) => {
  res.json({ items: await prisma.testimonial.findMany({ where: { isActive: true }, orderBy: [{ order: 'asc' }, { id: 'asc' }] }) });
}));

router.get('/sitemap', asyncHandler(async (_req, res) => {
  const [posts, pages, categories, series] = await Promise.all([
    prisma.post.findMany({ where: live(), select: { slug: true, updatedAt: true, format: true } }),
    prisma.page.findMany({ where: { status: 'PUBLISHED' }, select: { slug: true, updatedAt: true } }),
    prisma.category.findMany({ select: { slug: true, updatedAt: true } }),
    prisma.series.findMany({ where: { status: 'PUBLISHED' }, select: { slug: true, updatedAt: true } }),
  ]);
  res.json({ posts, pages, categories, series });
}));

router.post('/contact', formLimiter, asyncHandler(async (req, res) => {
  if (!(await getSettings()).advanced.enableContactForm) throw new HttpError(403, 'The contact form is currently disabled.');
  const data = z.object({
    name: z.string().min(2, 'Please enter your name').max(120),
    email: z.string().email('Please enter a valid email'),
    phone: z.string().max(40).optional().nullable(),
    subject: z.string().max(200).optional().nullable(),
    message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
  }).parse(req.body);
  await prisma.contactMessage.create({ data: { ...data, ip: req.ip } });
  res.status(201).json({ message: 'Thanks! Your message has been sent.' });
}));

router.post('/subscribe', formLimiter, asyncHandler(async (req, res) => {
  if (!(await getSettings()).advanced.enableNewsletter) throw new HttpError(403, 'Newsletter sign-ups are currently disabled.');
  const { email, name } = z.object({ email: z.string().email('Please enter a valid email'), name: z.string().optional() }).parse(req.body);
  await prisma.subscriber.upsert({ where: { email: email.toLowerCase() }, update: { isActive: true }, create: { email: email.toLowerCase(), name } });
  res.status(201).json({ message: 'You are subscribed. Welcome aboard!' });
}));

module.exports = router;
