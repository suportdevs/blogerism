const fs = require('fs');
const express = require('express');
const multer = require('multer');
const { authenticate, authorize } = require('../middleware/auth');
const { asyncHandler, HttpError, logActivity } = require('../lib/utils');
const backups = require('../lib/backup');

const router = express.Router();
router.use(authenticate, authorize('backups'));

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 200 * 1024 * 1024 } });
const exists = (name) => {
  if (!fs.existsSync(backups.fileFor(name))) throw new HttpError(404, 'Backup not found');
};

router.get('/', asyncHandler(async (_req, res) => {
  res.json({ items: backups.listBackups() });
}));

router.post('/', asyncHandler(async (req, res) => {
  const item = await backups.createBackup();
  await logActivity(req, 'created', 'Backup', item.name, `Created backup ${item.name}`);
  res.status(201).json(item);
}));

router.post('/upload', upload.single('file'), asyncHandler(async (req, res) => {
  if (!req.file) throw new HttpError(400, 'Choose a backup file');
  let item;
  try {
    item = backups.saveUploaded(req.file.buffer);
  } catch (e) {
    throw new HttpError(400, e.status ? e.message : 'This file is not valid JSON');
  }
  await logActivity(req, 'created', 'Backup', item.name, `Uploaded backup ${req.file.originalname}`);
  res.status(201).json(item);
}));

router.get('/:name/download', asyncHandler(async (req, res) => {
  exists(req.params.name);
  res.download(backups.fileFor(req.params.name), req.params.name);
}));

router.post('/:name/restore', asyncHandler(async (req, res) => {
  exists(req.params.name);
  const result = await backups.restoreBackup(req.params.name);
  await logActivity(req, 'updated', 'Backup', req.params.name, `Restored backup ${req.params.name} (safety copy: ${result.safety.name})`);
  res.json(result);
}));

router.delete('/:name', asyncHandler(async (req, res) => {
  exists(req.params.name);
  backups.deleteBackup(req.params.name);
  await logActivity(req, 'deleted', 'Backup', req.params.name, `Deleted backup ${req.params.name}`);
  res.status(204).end();
}));

module.exports = router;
