const express = require('express');
const prisma = require('../lib/prisma');
const { authenticate, authorize } = require('../middleware/auth');
const { asyncHandler, HttpError, logActivity } = require('../lib/utils');
const { DEFAULT_SETTINGS, getSettings, saveGroup } = require('../lib/settings');
const { hasPermission } = require('../lib/permissions');

const router = express.Router();
router.use(authenticate);

// Appearance is editable with the "appearance" permission; everything else requires "settings".
const groupPermission = (group) => (group === 'appearance' ? 'appearance' : 'settings');

router.get('/', authorize('settings', 'appearance'), asyncHandler(async (_req, res) => {
  res.json(await getSettings());
}));

function checkGroup(req) {
  const { group } = req.params;
  if (!DEFAULT_SETTINGS[group]) throw new HttpError(404, `Unknown settings group "${group}"`);
  if (!hasPermission(req.user, groupPermission(group))) throw new HttpError(403, 'You do not have permission to change these settings');
  return group;
}

router.put('/:group', asyncHandler(async (req, res) => {
  const group = checkGroup(req);
  await saveGroup(group, req.body || {});
  await logActivity(req, 'updated', 'Settings', group, `Updated ${group} settings`);
  res.json(await getSettings());
}));

router.post('/:group/reset', asyncHandler(async (req, res) => {
  const group = checkGroup(req);
  await prisma.setting.deleteMany({ where: { key: group } });
  await logActivity(req, 'updated', 'Settings', group, `Reset ${group} settings to defaults`);
  res.json(await getSettings());
}));

module.exports = router;
