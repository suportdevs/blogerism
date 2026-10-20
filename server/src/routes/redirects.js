const express = require('express');
const { z } = require('zod');
const prisma = require('../lib/prisma');
const { authenticate, authorize } = require('../middleware/auth');
const { asyncHandler, paginate, pageMeta, HttpError, logActivity, toInt } = require('../lib/utils');
const { normalizePath } = require('../lib/redirects');

// Redirect manager and 404 monitor.
const router = express.Router();
router.use(authenticate, authorize('redirects'));

const schema = z.object({
  from: z.string().min(1, 'Enter the old path').transform(normalizePath),
  to: z.string().min(1, 'Enter where it should go').transform((v) => (/^https?:\/\//i.test(v.trim()) ? v.trim() : normalizePath(v))),
  code: z.union([z.literal(301), z.literal(302), z.literal(307), z.literal(308)]).default(301),
  isActive: z.boolean().default(true),
  note: z.string().max(200).nullable().optional(),
}).refine((d) => d.from !== d.to, { message: 'A redirect cannot point to itself', path: ['to'] })
  .refine((d) => d.from !== '/', { message: 'The homepage cannot be redirected', path: ['from'] });

const taken = async (from, id) => {
  if (await prisma.redirect.findFirst({ where: { from, ...(id ? { NOT: { id } } : {}) } })) throw new HttpError(409, `A redirect from ${from} already exists`);
};

router.get('/', asyncHandler(async (req, res) => {
  const { page, limit, skip } = paginate(req.query, 25);
  const where = req.query.q ? { OR: ['from', 'to', 'note'].map((f) => ({ [f]: { contains: req.query.q, mode: 'insensitive' } })) } : {};
  const [items, total, hits] = await Promise.all([
    prisma.redirect.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take: limit }),
    prisma.redirect.count({ where }),
    prisma.redirect.aggregate({ _sum: { hits: true } }),
  ]);
  res.json({ items, meta: pageMeta(total, page, limit), totalHits: hits._sum.hits || 0 });
}));

router.post('/', asyncHandler(async (req, res) => {
  const data = schema.parse(req.body);
  await taken(data.from);
  const item = await prisma.redirect.create({ data });
  await prisma.notFoundLog.deleteMany({ where: { path: data.from } }); // fixed
  await logActivity(req, 'created', 'Redirect', item.id, `Added redirect ${item.from} → ${item.to}`);
  res.status(201).json(item);
}));

router.put('/:id', asyncHandler(async (req, res) => {
  const id = toInt(req.params.id);
  const current = await prisma.redirect.findUniqueOrThrow({ where: { id } });
  const data = schema.parse({ ...current, ...req.body });
  await taken(data.from, id);
  const item = await prisma.redirect.update({ where: { id }, data });
  await logActivity(req, 'updated', 'Redirect', id, `Updated redirect ${item.from} → ${item.to}`);
  res.json(item);
}));

router.post('/bulk-delete', asyncHandler(async (req, res) => {
  const ids = (req.body.ids || []).map(toInt).filter(Boolean);
  const { count } = await prisma.redirect.deleteMany({ where: { id: { in: ids } } });
  await logActivity(req, 'deleted', 'Redirect', ids.join(','), `Deleted ${count} redirect(s)`);
  res.json({ count });
}));

router.delete('/:id', asyncHandler(async (req, res) => {
  const item = await prisma.redirect.delete({ where: { id: toInt(req.params.id) } });
  await logActivity(req, 'deleted', 'Redirect', item.id, `Deleted redirect ${item.from}`);
  res.status(204).end();
}));

// 404 monitor: most-hit missing paths first.
router.get('/not-found', asyncHandler(async (req, res) => {
  const { page, limit, skip } = paginate(req.query, 25);
  const where = req.query.q ? { path: { contains: req.query.q, mode: 'insensitive' } } : {};
  const [items, total] = await Promise.all([
    prisma.notFoundLog.findMany({ where, orderBy: [{ hits: 'desc' }, { lastSeenAt: 'desc' }], skip, take: limit }),
    prisma.notFoundLog.count({ where }),
  ]);
  res.json({ items, meta: pageMeta(total, page, limit) });
}));

router.delete('/not-found/all', asyncHandler(async (req, res) => {
  const { count } = await prisma.notFoundLog.deleteMany();
  await logActivity(req, 'deleted', 'Redirect', null, `Cleared the 404 log (${count} path(s))`);
  res.json({ count });
}));

router.delete('/not-found/:id', asyncHandler(async (req, res) => {
  await prisma.notFoundLog.delete({ where: { id: toInt(req.params.id) } });
  res.status(204).end();
}));

module.exports = router;
