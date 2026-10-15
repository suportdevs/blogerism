const express = require('express');
const { z } = require('zod');
const prisma = require('../lib/prisma');
const { authenticate, authorize } = require('../middleware/auth');
const { asyncHandler, paginate, pageMeta, logActivity, toInt, HttpError } = require('../lib/utils');

// Comment moderation: approve, mark as spam, reply as staff, edit and delete.
const router = express.Router();
router.use(authenticate, authorize('comments'));

const STATUSES = ['PENDING', 'APPROVED', 'SPAM'];
const include = {
  post: { select: { id: true, title: true, slug: true, format: true } },
  parent: { select: { id: true, name: true, content: true } },
  user: { select: { id: true, name: true, avatar: true } },
  _count: { select: { replies: true } },
};

router.get('/', asyncHandler(async (req, res) => {
  const { page, limit, skip } = paginate(req.query, 20);
  const where = {};
  if (STATUSES.includes(req.query.status)) where.status = req.query.status;
  if (req.query.postId) where.postId = toInt(req.query.postId);
  if (req.query.q) where.OR = ['name', 'email', 'content'].map((f) => ({ [f]: { contains: req.query.q, mode: 'insensitive' } }));
  const [items, total, counts] = await Promise.all([
    prisma.comment.findMany({ where, include, orderBy: { createdAt: 'desc' }, skip, take: limit }),
    prisma.comment.count({ where }),
    prisma.comment.groupBy({ by: ['status'], _count: true }),
  ]);
  res.json({ items, meta: pageMeta(total, page, limit), statusCounts: Object.fromEntries(counts.map((c) => [c.status, c._count])) });
}));

router.get('/pending-count', asyncHandler(async (_req, res) => {
  res.json({ count: await prisma.comment.count({ where: { status: 'PENDING' } }) });
}));

router.put('/:id', asyncHandler(async (req, res) => {
  const data = z.object({ status: z.enum(STATUSES).optional(), content: z.string().trim().min(1).max(3000).optional() }).parse(req.body);
  const comment = await prisma.comment.update({ where: { id: toInt(req.params.id) }, data, include });
  if (data.status) await logActivity(req, 'updated', 'Comment', comment.id, `Marked comment by ${comment.name} as ${data.status.toLowerCase()}`);
  res.json(comment);
}));

// Staff reply: published immediately, shown with a "Team" badge. Replying also approves the comment.
router.post('/:id/reply', asyncHandler(async (req, res) => {
  const { content } = z.object({ content: z.string().trim().min(1, 'Write a reply first').max(3000) }).parse(req.body);
  const parent = await prisma.comment.findUnique({ where: { id: toInt(req.params.id) } });
  if (!parent) throw new HttpError(404, 'Comment not found');
  if (parent.status !== 'APPROVED') await prisma.comment.update({ where: { id: parent.id }, data: { status: 'APPROVED' } });
  const user = await prisma.user.findUnique({ where: { id: req.user.id }, select: { id: true, name: true, email: true } });
  const reply = await prisma.comment.create({
    data: { postId: parent.postId, parentId: parent.id, userId: user.id, name: user.name, email: user.email, content, status: 'APPROVED' },
    include,
  });
  await logActivity(req, 'created', 'Comment', reply.id, `Replied to ${parent.name}`);
  res.status(201).json(reply);
}));

router.post('/bulk', asyncHandler(async (req, res) => {
  const { ids, action } = z.object({ ids: z.array(z.number().int()).min(1), action: z.enum(['APPROVED', 'PENDING', 'SPAM', 'delete']) }).parse(req.body);
  const { count } = action === 'delete'
    ? await prisma.comment.deleteMany({ where: { id: { in: ids } } })
    : await prisma.comment.updateMany({ where: { id: { in: ids } }, data: { status: action } });
  await logActivity(req, action === 'delete' ? 'deleted' : 'updated', 'Comment', ids.join(','), `${action === 'delete' ? 'Deleted' : `Marked ${action.toLowerCase()}`} ${count} comment(s)`);
  res.json({ count });
}));

router.delete('/:id', asyncHandler(async (req, res) => {
  const item = await prisma.comment.delete({ where: { id: toInt(req.params.id) } });
  await logActivity(req, 'deleted', 'Comment', item.id, `Deleted comment by ${item.name}`);
  res.status(204).end();
}));

module.exports = router;
