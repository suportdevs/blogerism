const express = require('express');
const prisma = require('./prisma');
const { asyncHandler, paginate, pageMeta, logActivity, toInt, sendCsv } = require('./utils');
const { authenticate, authorize } = require('../middleware/auth');

/**
 * Builds a standard admin CRUD router for simple models.
 * opts: { model, permission, schema (zod object), searchFields, orderBy, label, csv: [[field, header], …] }
 */
module.exports = function crudRouter({ model, permission, schema, searchFields = [], orderBy = { id: 'desc' }, label, csv }) {
  const router = express.Router();
  router.use(authenticate, authorize(permission));

  router.get('/', asyncHandler(async (req, res) => {
    const { page, limit, skip } = paginate(req.query, 20);
    const where = {};
    if (req.query.q && searchFields.length) {
      where.OR = searchFields.map((f) => ({ [f]: { contains: req.query.q, mode: 'insensitive' } }));
    }
    const [items, total] = await Promise.all([
      prisma[model].findMany({ where, orderBy, skip, take: limit }),
      prisma[model].count({ where }),
    ]);
    res.json({ items, meta: pageMeta(total, page, limit) });
  }));

  if (csv) {
    router.get('/export', asyncHandler(async (req, res) => {
      const rows = await prisma[model].findMany({ orderBy });
      await logActivity(req, 'created', label, null, `Exported ${rows.length} ${label.toLowerCase()} record(s) to CSV`);
      sendCsv(res, `${model}s-${new Date().toISOString().slice(0, 10)}.csv`, csv, rows);
    }));
  }

  router.get('/:id', asyncHandler(async (req, res) => {
    res.json(await prisma[model].findUniqueOrThrow({ where: { id: toInt(req.params.id) } }));
  }));

  router.post('/', asyncHandler(async (req, res) => {
    const data = schema.parse(req.body);
    const item = await prisma[model].create({ data });
    await logActivity(req, 'created', label, item.id, `Created ${label.toLowerCase()} #${item.id}`);
    res.status(201).json(item);
  }));

  router.put('/:id', asyncHandler(async (req, res) => {
    const data = schema.partial().parse(req.body);
    const item = await prisma[model].update({ where: { id: toInt(req.params.id) }, data });
    await logActivity(req, 'updated', label, item.id, `Updated ${label.toLowerCase()} #${item.id}`);
    res.json(item);
  }));

  router.post('/bulk-delete', asyncHandler(async (req, res) => {
    const ids = (req.body.ids || []).map(toInt).filter(Boolean);
    const { count } = await prisma[model].deleteMany({ where: { id: { in: ids } } });
    await logActivity(req, 'deleted', label, ids.join(','), `Deleted ${count} ${label.toLowerCase()} record(s)`);
    res.json({ count });
  }));

  router.delete('/:id', asyncHandler(async (req, res) => {
    const id = toInt(req.params.id);
    await prisma[model].delete({ where: { id } });
    await logActivity(req, 'deleted', label, id, `Deleted ${label.toLowerCase()} #${id}`);
    res.status(204).end();
  }));

  return router;
};
