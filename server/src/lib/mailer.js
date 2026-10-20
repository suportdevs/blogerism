const nodemailer = require('nodemailer');
const prisma = require('./prisma');
const { getSettings } = require('./settings');

/*
 * Outgoing email through the SMTP server set in Settings → Email: notifications to the site owner (new messages,
 * booking requests, comments, subscribers), an automatic confirmation to visitors, and replies sent from Messages.
 * Sending never blocks or fails a visitor's request — problems are written to the activity log instead.
 */

const PASSWORD_MASK = '••••••••';

const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const fill = (tpl, vars) => String(tpl || '').replace(/\{(\w+)\}/g, (m, k) => (vars[k] != null ? vars[k] : m));

function transportFor(cfg) {
  return nodemailer.createTransport({
    host: cfg.host,
    port: Number(cfg.port) || 587,
    secure: !!cfg.secure, // true for port 465
    auth: cfg.user ? { user: cfg.user, pass: cfg.pass } : undefined,
    connectionTimeout: 15000,
  });
}

// A simple branded HTML version of a plain-text email.
function layout(settings, text) {
  const color = settings.appearance?.primaryColor || '#6d5dfc';
  const name = esc(settings.general?.siteName || '');
  const body = esc(text).replace(/\n/g, '<br>');
  return `<!doctype html><html><body style="margin:0;background:#f4f5f7;font-family:Segoe UI,Arial,sans-serif;color:#1f2430">
<div style="max-width:560px;margin:24px auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e6e8ee">
<div style="background:${color};color:#fff;padding:18px 24px;font-size:18px;font-weight:700">${name}</div>
<div style="padding:24px;font-size:15px;line-height:1.6">${body}</div>
</div></body></html>`;
}

async function send(settings, { to, subject, text, replyTo }) {
  const cfg = settings.email;
  const from = cfg.fromEmail || cfg.user;
  if (!cfg.host || !from) throw new Error('Email is not set up — add your SMTP server in Settings → Email');
  return transportFor(cfg).sendMail({
    from: cfg.fromName ? `"${cfg.fromName.replace(/"/g, '')}" <${from}>` : from,
    to, subject, text, html: layout(settings, text), replyTo,
  });
}

async function logFailure(what, e) {
  console.error(`Email (${what}) failed:`, e.message);
  try {
    await prisma.activityLog.create({ data: { action: 'failed', entity: 'Email', description: `Could not send ${what}: ${e.message}`.slice(0, 500) } });
  } catch { /* logging must never throw */ }
}

const TOGGLE = { message: 'notifyMessages', booking: 'notifyBookings', comment: 'notifyComments', subscriber: 'notifySubscribers' };

/** Notifies the site owner. type: message | booking | comment | subscriber. Fire-and-forget. */
function notifyOwner(type, { subject, text, replyTo }) {
  (async () => {
    const settings = await getSettings();
    const cfg = settings.email;
    if (!cfg.enabled || !cfg[TOGGLE[type]]) return;
    const to = cfg.notifyTo || settings.contact?.email;
    if (!to) return;
    await send(settings, { to, subject: `[${settings.general.siteName}] ${subject}`, text, replyTo });
  })().catch((e) => logFailure(`${type} notification`, e));
}

/** Automatic "we got your message" email to the visitor. Fire-and-forget. */
function autoReply({ to, name, kind }) {
  (async () => {
    const settings = await getSettings();
    const cfg = settings.email;
    if (!cfg.enabled || !cfg.autoReply || !to) return;
    const vars = { name: name || 'there', site: settings.general.siteName, request: kind === 'contact' ? 'message' : `${kind} request`, phone: settings.contact?.phone || '', email: settings.contact?.email || '' };
    await send(settings, { to, subject: fill(cfg.autoReplySubject, vars), text: fill(cfg.autoReplyText, vars), replyTo: cfg.notifyTo || settings.contact?.email || undefined });
  })().catch((e) => logFailure('auto-reply', e));
}

/** Sends now and throws on failure (replies from the admin, test emails). */
async function sendNow(message) {
  const settings = await getSettings();
  return send(settings, { replyTo: settings.email.notifyTo || settings.contact?.email || undefined, ...message });
}

async function verify(cfg) {
  if (!cfg.host) throw new Error('Enter the SMTP host first');
  await transportFor(cfg).verify();
}

module.exports = { notifyOwner, autoReply, sendNow, verify, PASSWORD_MASK };
