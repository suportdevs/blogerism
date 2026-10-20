const express = require('express');
const { z } = require('zod');
const prisma = require('../lib/prisma');
const { authenticate, authorize } = require('../middleware/auth');
const { asyncHandler, paginate, pageMeta, logActivity, toInt, sendCsv, HttpError } = require('../lib/utils');
const { sendNow } = require('../lib/mailer');
const { getSettings } = require('../lib/settings');

const router = express.Router();
router.use(authenticate, authorize('contacts'));

router.get('/', asyncHandler(async (req, res) => {
  const { page, limit, skip } = paginate(req.query, 20);
  const where = {};
  if (req.query.status) where.status = req.query.status;
  if (req.query.kind === 'bookings') where.kind = { not: 'contact' };
  else if (req.query.kind) where.kind = req.query.kind;
  if (req.query.q) {
    where.OR = ['name', 'email', 'subject', 'message'].map((f) => ({ [f]: { contains: req.query.q, mode: 'insensitive' } }));
  }
  const [items, total, counts, bookings, settings] = await Promise.all([
    prisma.contactMessage.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take: limit }),
    prisma.contactMessage.count({ where }),
    prisma.contactMessage.groupBy({ by: ['status'], _count: true }),
    prisma.contactMessage.count({ where: { kind: { not: 'contact' }, status: 'UNREAD' } }),
    getSettings(),
  ]);
  const emailReady = !!(settings.email.enabled && settings.email.host);
  res.json({ items, meta: pageMeta(total, page, limit), statusCounts: Object.fromEntries(counts.map((c) => [c.status, c._count])), newBookings: bookings, emailReady, siteName: settings.general.siteName, contactPhone: settings.contact.phone });
}));

router.get('/export', asyncHandler(async (req, res) => {
  const rows = (await prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } }))
    .map((r) => ({ ...r, details: Object.entries(r.details || {}).map(([k, v]) => `${k}: ${v}`).join('; ') }));
  await logActivity(req, 'created', 'Contact', null, `Exported ${rows.length} message(s) to CSV`);
  sendCsv(res, `messages-${new Date().toISOString().slice(0, 10)}.csv`, [['createdAt', 'Received'], ['name', 'Name'], ['email', 'Email'], ['phone', 'Phone'], ['kind', 'Type'], ['subject', 'Subject'], ['details', 'Details'], ['message', 'Message'], ['status', 'Status']], rows);
}));

router.put('/:id', asyncHandler(async (req, res) => {
  const { status } = z.object({ status: z.enum(['UNREAD', 'READ', 'REPLIED', 'CONFIRMED', 'CANCELLED']) }).parse(req.body);
  res.json(await prisma.contactMessage.update({ where: { id: toInt(req.params.id) }, data: { status } }));
}));

// Emails the visitor (a reply, or a booking confirmation / cancellation) and updates the status.
router.post('/:id/reply', asyncHandler(async (req, res) => {
  const { subject, body, status } = z.object({
    subject: z.string().min(1, 'Add a subject').max(200),
    body: z.string().min(1, 'Write your reply').max(10000),
    status: z.enum(['REPLIED', 'CONFIRMED', 'CANCELLED']).default('REPLIED'),
  }).parse(req.body);
  const msg = await prisma.contactMessage.findUniqueOrThrow({ where: { id: toInt(req.params.id) } });
  try {
    await sendNow({ to: msg.email, subject, text: body });
  } catch (e) {
    throw new HttpError(400, `Could not send the email: ${e.message}`);
  }
  const updated = await prisma.contactMessage.update({ where: { id: msg.id }, data: { status } });
  await logActivity(req, 'updated', 'Contact', msg.id, `Emailed ${msg.email} (${status.toLowerCase()})`);
  res.json(updated);
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
