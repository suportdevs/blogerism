const express = require('express');
const rateLimit = require('express-rate-limit');
const { z } = require('zod');
const prisma = require('../lib/prisma');
const { asyncHandler, paginate, pageMeta, HttpError } = require('../lib/utils');
const { getSettings, publicSettings } = require('../lib/settings');
const { notifyOwner, autoReply } = require('../lib/mailer');
const { toTree } = require('./menus');
const { publicTheme } = require('../themes');
const { normalizePath } = require('../lib/redirects');

// Unauthenticated endpoints consumed by the Next.js storefront.
const router = express.Router();
// Likes, follows and comment likes: generous, but stops scripted inflation.
const reactLimiter = rateLimit({ windowMs: 10 * 60 * 1000, limit: 120, standardHeaders: true, legacyHeaders: false, message: { message: 'Slow down a little and try again shortly.' } });
const commentLimiter = rateLimit({ windowMs: 10 * 60 * 1000, limit: 6, standardHeaders: true, legacyHeaders: false, message: { message: 'You are commenting too quickly. Please wait a few minutes.' } });
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
  year: true, maturity: true, genres: true, featured: true, subscribers: true,
};

router.get('/bootstrap', asyncHandler(async (_req, res) => {
  const [settings, menus] = await Promise.all([
    getSettings(),
    prisma.menu.findMany({ include: { items: true } }),
  ]);
  res.json({ settings: publicSettings(settings), theme: publicTheme(settings.theme.active), menus: Object.fromEntries(menus.map((m) => [m.location, { name: m.name, items: toTree(m.items) }])) });
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
  if (req.query.slugs) where.slug = { in: String(req.query.slugs).split(',').slice(0, 100) };
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
      _count: { select: { comments: { where: { status: 'APPROVED' } } } },
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
  const { _count, ...rest } = post;
  res.json({ post: { ...rest, commentCount: _count.comments }, related, prev, next, episodes, upNext });
}));

// Reactions. The browser remembers what a visitor liked/followed; { undo: true } reverses it.
const counter = async (model, where, field, undo) => {
  const row = await prisma[model].findFirst({ where, select: { id: true, [field]: true } });
  if (!row) throw new HttpError(404, 'Not found');
  if (undo && row[field] <= 0) return { [field]: 0 };
  return prisma[model].update({ where: { id: row.id }, data: { [field]: undo ? { decrement: 1 } : { increment: 1 } }, select: { [field]: true } });
};

router.post('/posts/:slug/like', reactLimiter, asyncHandler(async (req, res) => {
  if (!(await getSettings()).engagement.likes) throw new HttpError(403, 'Likes are turned off.');
  res.json(await counter('post', { ...live(), slug: req.params.slug }, 'likes', !!req.body?.undo));
}));

router.post('/series/:slug/subscribe', reactLimiter, asyncHandler(async (req, res) => {
  if (!(await getSettings()).engagement.subscriptions) throw new HttpError(403, 'Subscriptions are turned off.');
  res.json(await counter('series', { slug: req.params.slug, status: 'PUBLISHED' }, 'subscribers', !!req.body?.undo));
}));

/* ------------------------------- Comments ------------------------------- */
const publicComment = (c) => ({
  id: c.id, parentId: c.parentId, name: c.user?.name || c.name, avatar: c.user?.avatar || null, content: c.content,
  likes: c.likes, createdAt: c.createdAt, isStaff: !!c.userId, status: c.status,
});

router.get('/posts/:slug/comments', asyncHandler(async (req, res) => {
  const { engagement } = await getSettings();
  const post = await prisma.post.findFirst({ where: { ...live(), slug: req.params.slug }, select: { id: true, title: true, allowComments: true } });
  if (!post) throw new HttpError(404, 'Post not found');
  const rows = await prisma.comment.findMany({
    where: { postId: post.id, status: 'APPROVED' },
    include: { user: { select: { name: true, avatar: true } } },
    orderBy: { createdAt: 'asc' },
  });
  const all = rows.map(publicComment);
  const byParent = {};
  all.forEach((c) => { (byParent[c.parentId || 0] = byParent[c.parentId || 0] || []).push(c); });
  const nest = (c) => ({ ...c, replies: (byParent[c.id] || []).map(nest) });
  res.json({
    items: (byParent[0] || []).map(nest),
    count: all.length,
    open: engagement.comments && post.allowComments,
    replies: engagement.commentReplies,
    moderated: engagement.moderation,
  });
}));

router.post('/posts/:slug/comments', commentLimiter, asyncHandler(async (req, res) => {
  const { engagement } = await getSettings();
  const data = z.object({
    name: z.string().trim().min(2, 'Please enter your name').max(80),
    email: z.string().trim().email('Please enter a valid email').max(160),
    content: z.string().trim().min(2, 'Write a comment first').max(3000, 'Comments are limited to 3,000 characters'),
    parentId: z.number().int().positive().optional().nullable(),
    website: z.string().optional(), // honeypot: humans never see this field
  }).parse(req.body);
  const post = await prisma.post.findFirst({ where: { ...live(), slug: req.params.slug }, select: { id: true, allowComments: true } });
  if (!post) throw new HttpError(404, 'Post not found');
  if (!engagement.comments || !post.allowComments) throw new HttpError(403, 'Comments are closed for this post.');
  if (data.parentId) {
    if (!engagement.commentReplies) throw new HttpError(403, 'Replies are turned off.');
    const parent = await prisma.comment.findFirst({ where: { id: data.parentId, postId: post.id, status: 'APPROVED' } });
    if (!parent) throw new HttpError(400, 'The comment you are replying to no longer exists.');
  }
  const pending = { id: 0, parentId: data.parentId || null, name: data.name, avatar: null, content: data.content, likes: 0, createdAt: new Date(), isStaff: false, status: 'PENDING' };
  if (data.website) return res.status(201).json({ comment: pending, message: 'Thanks! Your comment is awaiting moderation.' }); // bot

  // Link-stuffed comments always wait for a human, even with moderation off.
  const links = (data.content.match(/https?:\/\//gi) || []).length;
  const status = engagement.moderation || links > 2 ? 'PENDING' : 'APPROVED';
  const comment = await prisma.comment.create({
    data: { postId: post.id, parentId: data.parentId || null, name: data.name, email: data.email.toLowerCase(), content: data.content, status, ip: req.ip },
  });
  notifyOwner('comment', {
    subject: `New comment on "${post.title}"${status === 'PENDING' ? ' (awaiting approval)' : ''}`,
    text: `${data.name} <${data.email}> wrote:

${data.content}

Moderate it in the admin: Comments.`,
  });
  res.status(201).json({
    comment: publicComment(comment),
    message: status === 'APPROVED' ? 'Thanks for joining the conversation!' : 'Thanks! Your comment will appear once it has been approved.',
  });
}));

router.post('/comments/:id/like', reactLimiter, asyncHandler(async (req, res) => {
  res.json(await counter('comment', { id: parseInt(req.params.id, 10) || 0, status: 'APPROVED' }, 'likes', !!req.body?.undo));
}));

// Series: shows (Netflix-style), playlists (YouTube) and podcasts.
router.get('/series', asyncHandler(async (req, res) => {
  const limit = Math.min(50, parseInt(req.query.limit, 10) || 12);
  const where = { status: 'PUBLISHED' };
  if (SERIES_TYPES.includes(req.query.type)) where.type = req.query.type;
  if (req.query.featured === 'true') where.featured = true;
  if (req.query.slugs) where.slug = { in: String(req.query.slugs).split(',').slice(0, 100) };
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

// Active redirects, read (and cached briefly) by the site's middleware.
router.get('/redirects', asyncHandler(async (_req, res) => {
  res.json({ items: await prisma.redirect.findMany({ where: { isActive: true }, select: { id: true, from: true, to: true, code: true } }) });
}));

router.post('/redirects/:id/hit', asyncHandler(async (req, res) => {
  await prisma.redirect.updateMany({ where: { id: parseInt(req.params.id, 10) || 0 }, data: { hits: { increment: 1 }, lastHitAt: new Date() } });
  res.status(204).end();
}));

// The 404 monitor: visitors' browsers report paths that did not exist. Static files and admin/API paths are ignored.
const NOT_FOUND_CAP = 2000;
const notFoundLimiter = rateLimit({ windowMs: 60 * 1000, limit: 30, standardHeaders: true, legacyHeaders: false, message: { message: 'Too many requests' } });
router.post('/not-found', notFoundLimiter, asyncHandler(async (req, res) => {
  const { path, referrer } = z.object({ path: z.string().min(1).max(500), referrer: z.string().max(500).optional().nullable() }).parse(req.body);
  const p = normalizePath(path);
  if (/^\/(_next|api|admin|uploads)(\/|$)/.test(p) || /\.(js|css|map|png|jpe?g|gif|svg|ico|webp|avif|woff2?|txt|xml)$/i.test(p)) return res.status(204).end();
  const existing = await prisma.notFoundLog.findUnique({ where: { path: p } });
  if (existing) await prisma.notFoundLog.update({ where: { path: p }, data: { hits: { increment: 1 }, lastSeenAt: new Date(), ...(referrer ? { referrer } : {}) } });
  else if ((await prisma.notFoundLog.count()) < NOT_FOUND_CAP) await prisma.notFoundLog.create({ data: { path: p, referrer: referrer || null } });
  res.status(204).end();
}));

// Contact messages and booking requests. `kind` marks bookings (appointment, reservation…) and `details` holds their fields.
const KINDS = ['contact', 'appointment', 'reservation', 'consultation', 'valuation', 'booking', 'enquiry', 'enrolment', 'donation'];
router.post('/contact', formLimiter, asyncHandler(async (req, res) => {
  if (!(await getSettings()).advanced.enableContactForm) throw new HttpError(403, 'The contact form is currently disabled.');
  const { website, ...data } = z.object({
    name: z.string().min(2, 'Please enter your name').max(120),
    email: z.string().email('Please enter a valid email'),
    phone: z.string().max(40).optional().nullable(),
    subject: z.string().max(200).optional().nullable(),
    message: z.string().min(2, 'Please write a short message').max(5000),
    kind: z.enum(KINDS).default('contact'),
    details: z.record(z.string().max(60), z.union([z.string().max(300), z.number()])).refine((d) => Object.keys(d).length <= 20, 'Too many details').optional().nullable(),
    website: z.string().optional(), // honeypot: humans never see this field
  }).parse(req.body);
  if (website) return res.status(201).json({ message: 'Thanks! Your message has been sent.' }); // bot
  const msg = await prisma.contactMessage.create({ data: { ...data, ip: req.ip } });
  const isBooking = data.kind !== 'contact';
  const lines = Object.entries(data.details || {}).map(([k, v]) => `${k}: ${v}`);
  notifyOwner(isBooking ? 'booking' : 'message', {
    subject: isBooking ? `New ${data.kind} request from ${data.name}` : `New message from ${data.name}${data.subject ? ` — ${data.subject}` : ''}`,
    text: [`From: ${data.name} <${data.email}>`, data.phone && `Phone: ${data.phone}`, ...lines, '', data.message, '', `Open it in the admin: Messages → #${msg.id}`].filter((l) => l !== null && l !== undefined && l !== false).join('\n'),
    replyTo: data.email,
  });
  autoReply({ to: data.email, name: data.name, kind: data.kind });
  res.status(201).json({ message: isBooking ? 'Thanks! Your request has been received.' : 'Thanks! Your message has been sent.' });
}));

router.post('/subscribe', formLimiter, asyncHandler(async (req, res) => {
  if (!(await getSettings()).advanced.enableNewsletter) throw new HttpError(403, 'Newsletter sign-ups are currently disabled.');
  const { email, name, website } = z.object({ email: z.string().email('Please enter a valid email'), name: z.string().optional(), website: z.string().optional() }).parse(req.body);
  if (website) return res.status(201).json({ message: 'You are subscribed. Welcome aboard!' }); // honeypot: a bot
  const existing = await prisma.subscriber.findUnique({ where: { email: email.toLowerCase() } });
  await prisma.subscriber.upsert({ where: { email: email.toLowerCase() }, update: { isActive: true }, create: { email: email.toLowerCase(), name } });
  if (!existing) notifyOwner('subscriber', { subject: `New subscriber: ${email.toLowerCase()}`, text: `${email.toLowerCase()}${name ? ` (${name})` : ''} subscribed to the newsletter.` });
  res.status(201).json({ message: 'You are subscribed. Welcome aboard!' });
}));

module.exports = router;
