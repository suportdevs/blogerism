const express = require('express');
const { z } = require('zod');
const prisma = require('../lib/prisma');
const { authenticate, authorize } = require('../middleware/auth');
const { asyncHandler, paginate, pageMeta, logActivity, toInt } = require('../lib/utils');

const router = express.Router();
router.use(authenticate, authorize('contacts'));

router.get('/', asyncHandler(async (req, res) => {
  const { page, limit, skip } = paginate(req.query, 20);
  const where = {};
  if (req.query.status) where.status = req.query.status;
  if (req.query.q) {
    where.OR = ['name', 'email', 'subject', 'message'].map((f) => ({ [f]: { contains: req.query.q, mode: 'insensitive' } }));
  }
  const [items, total, counts] = await Promise.all([
    prisma.contactMessage.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take: limit }),
    prisma.contactMessage.count({ where }),
    prisma.contactMessage.groupBy({ by: ['status'], _count: true }),
  ]);
  res.json({ items, meta: pageMeta(total, page, limit), statusCounts: Object.fromEntries(counts.map((c) => [c.status, c._count])) });
}));

router.put('/:id', asyncHandler(async (req, res) => {
  const { status } = z.object({ status: z.enum(['UNREAD', 'READ', 'REPLIED']) }).parse(req.body);
  res.json(await prisma.contactMessage.update({ where: { id: toInt(req.params.id) }, data: { status } }));
}));

router.post('/bulk-delete', asyncHandler(async (req, res) => {
  const ids = (req.body.ids || []).map(toInt).filter(Boolean);
  const { count } = await prisma.contactMessage.deleteMany({ where: { id: { in: ids } } });
  await logActivity(req, 'deleted', 'Contact', ids.join(','), `Deleted ${count} message(s)`);
  res.json({ count });
}));

router.delete('/:id', asyncHandler(async (req, res) => {
  const item = await prisma.contactMessage.delete({ where: { id: toInt(req.params.id) } });
  await logActivity(req, 'deleted', 'Contact', item.id, `Deleted message from ${item.email}`);
  res.status(204).end();
}));

module.exports = router;
