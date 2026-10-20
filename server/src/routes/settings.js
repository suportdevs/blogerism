const express = require('express');
const prisma = require('../lib/prisma');
const { authenticate, authorize } = require('../middleware/auth');
const { asyncHandler, HttpError, logActivity } = require('../lib/utils');
const { DEFAULT_SETTINGS, getSettings, saveGroup } = require('../lib/settings');
const { hasPermission } = require('../lib/permissions');
const { verify, sendNow, PASSWORD_MASK } = require('../lib/mailer');

const router = express.Router();
router.use(authenticate);

// Appearance is editable with the "appearance" permission; everything else requires "settings".
const groupPermission = (group) => (group === 'appearance' ? 'appearance' : 'settings');

// The SMTP password is never sent back to the browser.
const masked = (s) => ({
  ...s,
  email: { ...s.email, pass: s.email.pass ? PASSWORD_MASK : '' },
  i18n: { ...s.i18n, ai: { ...s.i18n.ai, apiKey: s.i18n.ai?.apiKey ? PASSWORD_MASK : '', envKey: !!process.env.ANTHROPIC_API_KEY } },
});

router.get('/', authorize('settings', 'appearance'), asyncHandler(async (_req, res) => {
  res.json(masked(await getSettings()));
}));

// Checks the SMTP connection and sends a test email (uses the saved settings).
router.post('/email/test', authorize('settings'), asyncHandler(async (req, res) => {
  const settings = await getSettings();
  const to = String(req.body?.to || settings.email.notifyTo || settings.contact.email || '').trim();
  if (!to) throw new HttpError(400, 'Enter an address to send the test to');
  try {
    await verify(settings.email);
    await sendNow({ to, subject: `Test email from ${settings.general.siteName}`, text: `It works! ${settings.general.siteName} can send email through ${settings.email.host}.\n\nNotifications and confirmations will be sent from ${settings.email.fromEmail || settings.email.user}.` });
  } catch (e) {
    throw new HttpError(400, `Could not send: ${e.message}`);
  }
  await logActivity(req, 'updated', 'Settings', 'email', `Sent a test email to ${to}`);
  res.json({ message: `Test email sent to ${to}` });
}));

function checkGroup(req) {
  const { group } = req.params;
  if (!DEFAULT_SETTINGS[group]) throw new HttpError(404, `Unknown settings group "${group}"`);
  if (!hasPermission(req.user, groupPermission(group))) throw new HttpError(403, 'You do not have permission to change these settings');
  return group;
}

router.put('/:group', asyncHandler(async (req, res) => {
  const group = checkGroup(req);
  const body = { ...(req.body || {}) };
  if (group === 'email' && body.pass === PASSWORD_MASK) delete body.pass; // unchanged
  if (group === 'i18n' && body.ai) {
    body.ai = { ...body.ai };
    if (body.ai.apiKey === PASSWORD_MASK) delete body.ai.apiKey;
    delete body.ai.envKey;
  }
  if (group === 'i18n' && Array.isArray(body.languages)) {
    // Languages replace (not merge) and must include the default language.
    const current = (await getSettings()).i18n;
    const def = body.defaultLanguage || current.defaultLanguage;
    if (!body.languages.some((l) => l.code === def)) throw new HttpError(422, 'The default language must stay in the list');
    await saveGroup('i18n', { languages: [] });
  }
  await saveGroup(group, body);
  await logActivity(req, 'updated', 'Settings', group, `Updated ${group} settings`);
  res.json(masked(await getSettings()));
}));

router.post('/:group/reset', asyncHandler(async (req, res) => {
  const group = checkGroup(req);
  await prisma.setting.deleteMany({ where: { key: group } });
  await logActivity(req, 'updated', 'Settings', group, `Reset ${group} settings to defaults`);
  res.json(masked(await getSettings()));
}));

module.exports = router;
