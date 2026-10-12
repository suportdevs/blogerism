const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const { z } = require('zod');
const prisma = require('../lib/prisma');
const { authenticate, authorize } = require('../middleware/auth');
const { asyncHandler, paginate, pageMeta, logActivity, toInt, slugify, HttpError } = require('../lib/utils');

const UPLOAD_DIR = path.join(__dirname, '..', '..', 'uploads');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const ALLOWED = /^(image\/(png|jpe?g|gif|webp|svg\+xml|avif)|video\/(mp4|webm)|application\/pdf|audio\/(mpeg|wav))$/;

const upload = multer({
  storage: multer.diskStorage({
    destination: UPLOAD_DIR,
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      const base = slugify(path.basename(file.originalname, ext)).slice(0, 60);
      cb(null, `${base}-${crypto.randomBytes(4).toString('hex')}${ext}`);
    },
  }),
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => (ALLOWED.test(file.mimetype) ? cb(null, true) : cb(new HttpError(400, `File type ${file.mimetype} is not allowed`))),
});

const router = express.Router();
router.use(authenticate);

// Any signed-in editor can browse/upload media so pickers work inside posts & pages.
router.get('/', asyncHandler(async (req, res) => {
  const { page, limit, skip } = paginate(req.query, 40);
  const where = {};
  if (req.query.q) where.originalName = { contains: req.query.q, mode: 'insensitive' };
  if (req.query.type) where.mime = { startsWith: req.query.type };
  if (req.query.folderId !== undefined && req.query.folderId !== '') {
    where.folderId = req.query.folderId === 'root' ? null : toInt(req.query.folderId);
  }
  const [items, total, folders] = await Promise.all([
    prisma.media.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take: limit }),
    prisma.media.count({ where }),
    prisma.mediaFolder.findMany({ orderBy: { name: 'asc' }, include: { _count: { select: { files: true } } } }),
  ]);
  res.json({ items, folders, meta: pageMeta(total, page, limit) });
}));

router.post('/upload', authorize('media', 'posts', 'pages'), upload.array('files', 20), asyncHandler(async (req, res) => {
  const folderId = toInt(req.body.folderId) || null;
  const items = await Promise.all((req.files || []).map((f) => prisma.media.create({
    data: { filename: f.filename, originalName: f.originalname, url: `/uploads/${f.filename}`, mime: f.mimetype, size: f.size, folderId },
  })));
  await logActivity(req, 'uploaded', 'Media', items.map((i) => i.id).join(','), `Uploaded ${items.length} file(s)`);
  res.status(201).json({ items });
}));

router.put('/:id', authorize('media'), asyncHandler(async (req, res) => {
  const data = z.object({ alt: z.string().nullable().optional(), originalName: z.string().optional(), folderId: z.number().nullable().optional() }).parse(req.body);
  res.json(await prisma.media.update({ where: { id: toInt(req.params.id) }, data }));
}));

async function removeFiles(items) {
  await Promise.all(items.map((m) => fs.promises.unlink(path.join(UPLOAD_DIR, m.filename)).catch(() => {})));
}

router.post('/bulk-delete', authorize('media'), asyncHandler(async (req, res) => {
  const ids = (req.body.ids || []).map(toInt).filter(Boolean);
  const items = await prisma.media.findMany({ where: { id: { in: ids } } });
  await prisma.media.deleteMany({ where: { id: { in: ids } } });
  await removeFiles(items);
  await logActivity(req, 'deleted', 'Media', ids.join(','), `Deleted ${items.length} file(s)`);
  res.json({ count: items.length });
}));

router.delete('/:id', authorize('media'), asyncHandler(async (req, res) => {
  const item = await prisma.media.delete({ where: { id: toInt(req.params.id) } });
  await removeFiles([item]);
  await logActivity(req, 'deleted', 'Media', item.id, `Deleted file "${item.originalName}"`);
  res.status(204).end();
}));

router.post('/folders', authorize('media'), asyncHandler(async (req, res) => {
  const data = z.object({ name: z.string().min(1), parentId: z.number().nullable().optional() }).parse(req.body);
  res.status(201).json(await prisma.mediaFolder.create({ data }));
}));

router.put('/folders/:id', authorize('media'), asyncHandler(async (req, res) => {
  const data = z.object({ name: z.string().min(1) }).parse(req.body);
  res.json(await prisma.mediaFolder.update({ where: { id: toInt(req.params.id) }, data }));
}));

router.delete('/folders/:id', authorize('media'), asyncHandler(async (req, res) => {
  await prisma.mediaFolder.delete({ where: { id: toInt(req.params.id) } });
  res.status(204).end();
}));

module.exports = router;
