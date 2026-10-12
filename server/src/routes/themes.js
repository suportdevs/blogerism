const express = require('express');
const { z } = require('zod');
const { authenticate, authorize } = require('../middleware/auth');
const { asyncHandler, HttpError, logActivity } = require('../lib/utils');
const { hasPermission } = require('../lib/permissions');
const { THEMES, publicTheme } = require('../themes');
const { activateTheme, activeThemeId } = require('../lib/themeManager');

const router = express.Router();
router.use(authenticate);

// Active theme features — used by every admin screen to tailor menus, formats and blocks.
router.get('/active', asyncHandler(async (_req, res) => {
  res.json(publicTheme(await activeThemeId()));
}));

router.get('/', authorize('appearance'), asyncHandler(async (_req, res) => {
  const active = await activeThemeId();
  const items = Object.values(THEMES).map((t) => {
    const pages = t.pages();
    return {
      ...publicTheme(t.id),
      description: t.description,
      general: t.general,
      appearance: t.appearance,
      menus: t.menus,
      homeBlocks: pages.find((p) => p.home)?.blocks || [],
      pages: pages.map((p) => ({ slug: p.slug, title: p.title, home: !!p.home })),
    };
  });
  res.json({ active, items });
}));

router.post('/:id/activate', authorize('appearance'), asyncHandler(async (req, res) => {
  const opts = z.object({ appearance: z.boolean().default(true), setup: z.boolean().default(true), demo: z.boolean().default(false) }).parse(req.body || {});
  if (opts.demo && !hasPermission(req.user, 'settings')) throw new HttpError(403, 'Importing demo content requires the Settings permission');
  if (!THEMES[req.params.id]) throw new HttpError(404, 'Theme not found');
  const settings = await activateTheme(req.params.id, opts);
  await logActivity(req, 'updated', 'Theme', req.params.id, `Activated theme "${THEMES[req.params.id].name}"${opts.demo ? ' with demo content' : ''}`);
  res.json({ theme: publicTheme(req.params.id), settings });
}));

module.exports = router;
