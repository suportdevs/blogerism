const fs = require('fs');
const path = require('path');
const prisma = require('./prisma');
const { captureContent, restoreContent } = require('./workspace');
const { insertTree, resetSequences } = require('./snapshot');

/*
 * Site backups: a JSON file with all content and settings, media records, subscribers, messages, redirects and every
 * theme's saved workspace. Users, roles and passwords are not included and are never touched by a restore.
 * Uploaded files themselves live in server/uploads — back that folder up alongside these files.
 */

const BACKUP_DIR = path.join(__dirname, '..', '..', 'backups');
const KIND = 'blogerism-backup';
const LEGACY_KINDS = ['themewright-backup']; // backups made before the rename still restore
const VERSION = 1;
const NAME_RE = /^[\w.-]+\.json$/;

const ensureDir = () => fs.mkdirSync(BACKUP_DIR, { recursive: true });
const fileFor = (name) => {
  if (!NAME_RE.test(name)) throw Object.assign(new Error('Invalid backup name'), { status: 400 });
  return path.join(BACKUP_DIR, name);
};
const stamp = () => new Date().toISOString().replace(/[:T]/g, '-').slice(0, 19);

async function buildBackup() {
  const [content, mediaFolders, media, subscribers, contactMessages, redirects, workspaces, theme] = await Promise.all([
    captureContent(),
    prisma.mediaFolder.findMany({ orderBy: { id: 'asc' } }),
    prisma.media.findMany({ orderBy: { id: 'asc' } }),
    prisma.subscriber.findMany({ orderBy: { id: 'asc' } }),
    prisma.contactMessage.findMany({ orderBy: { id: 'asc' } }),
    prisma.redirect.findMany({ orderBy: { id: 'asc' } }),
    prisma.themeWorkspace.findMany(),
    prisma.setting.findUnique({ where: { key: 'theme' } }),
  ]);
  const general = content.settings.find((s) => s.key === 'general')?.value || {};
  return {
    kind: KIND,
    version: VERSION,
    createdAt: new Date().toISOString(),
    siteName: general.siteName || '',
    theme: theme?.value?.active || null,
    counts: { posts: content.posts.length, pages: content.pages.length, series: content.series.length, media: media.length, subscribers: subscribers.length, redirects: redirects.length, themes: workspaces.length },
    data: { content, theme: theme?.value || null, mediaFolders, media, subscribers, contactMessages, redirects, workspaces: workspaces.map(({ themeId, data }) => ({ themeId, data })) },
  };
}

function meta(name) {
  const file = fileFor(name);
  const stat = fs.statSync(file);
  let info = {};
  try {
    // The header fields describe what is inside (site, theme and counts).
    const head = JSON.parse(fs.readFileSync(file, 'utf8'));
    info = { siteName: head.siteName, theme: head.theme, counts: head.counts, createdAt: head.createdAt };
  } catch { info = { invalid: true }; }
  return { name, size: stat.size, auto: name.startsWith('auto-'), uploaded: name.startsWith('uploaded-'), createdAt: info.createdAt || stat.mtime, ...info };
}

function listBackups() {
  ensureDir();
  return fs.readdirSync(BACKUP_DIR).filter((n) => NAME_RE.test(n)).map(meta).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

async function createBackup(prefix = 'backup') {
  ensureDir();
  const name = `${prefix}-${stamp()}.json`;
  fs.writeFileSync(fileFor(name), JSON.stringify(await buildBackup()));
  return meta(name);
}

function validate(backup) {
  if (![KIND, ...LEGACY_KINDS].includes(backup?.kind) || !backup.data?.content) throw Object.assign(new Error('This file is not a Blogerism backup'), { status: 400 });
  if (backup.version !== VERSION) throw Object.assign(new Error(`Unsupported backup version ${backup.version}`), { status: 400 });
}

function saveUploaded(buffer) {
  const backup = JSON.parse(buffer.toString('utf8'));
  validate(backup);
  ensureDir();
  const name = `uploaded-${stamp()}.json`;
  fs.writeFileSync(fileFor(name), buffer);
  return meta(name);
}

async function restoreBackup(name) {
  const backup = JSON.parse(fs.readFileSync(fileFor(name), 'utf8'));
  validate(backup);
  const d = backup.data;
  const safety = await createBackup('auto-before-restore');

  await restoreContent(d.content);
  if (d.theme) await prisma.setting.upsert({ where: { key: 'theme' }, update: { value: d.theme }, create: { key: 'theme', value: d.theme } });

  await prisma.$transaction([
    prisma.media.deleteMany(), prisma.mediaFolder.deleteMany(), prisma.subscriber.deleteMany(),
    prisma.contactMessage.deleteMany(), prisma.redirect.deleteMany(), prisma.themeWorkspace.deleteMany(),
  ]);
  await insertTree('mediaFolder', d.mediaFolders || [], 'parentId');
  if (d.media?.length) await prisma.media.createMany({ data: d.media });
  if (d.subscribers?.length) await prisma.subscriber.createMany({ data: d.subscribers });
  if (d.contactMessages?.length) await prisma.contactMessage.createMany({ data: d.contactMessages });
  if (d.redirects?.length) await prisma.redirect.createMany({ data: d.redirects });
  if (d.workspaces?.length) await prisma.themeWorkspace.createMany({ data: d.workspaces });
  await resetSequences(['MediaFolder', 'Media', 'Subscriber', 'ContactMessage', 'Redirect']);
  return { restored: meta(name), safety };
}

const deleteBackup = (name) => fs.unlinkSync(fileFor(name));

module.exports = { listBackups, createBackup, restoreBackup, saveUploaded, deleteBackup, fileFor };
