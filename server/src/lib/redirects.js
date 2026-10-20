const prisma = require('./prisma');

/*
 * Redirects are applied by the site's middleware. `from` is a path ("/old-post"); a trailing "/*" matches everything
 * below it, and a "*" in `to` is replaced with the matched remainder. Changing a post's or page's URL adds a 301
 * from the old address automatically.
 */

// Same rules as the site's postUrl() in client/lib/utils.js.
const postPath = (p) => (p.format === 'VIDEO' ? `/watch/${p.slug}` : p.format === 'AUDIO' ? `/listen/${p.slug}` : `/blog/${p.slug}`);
const pagePath = (p) => `/${p.slug}`;

function normalizePath(path) {
  let p = String(path || '').trim();
  try { if (/^https?:\/\//i.test(p)) p = new URL(p).pathname; } catch { /* keep as typed */ }
  p = `/${p.replace(/^\/+/, '')}`.replace(/[?#].*$/, '');
  return p.length > 1 ? p.replace(/\/+$/, '') : p;
}

async function autoRedirect(oldPath, newPath) {
  if (oldPath === newPath) return;
  // Never leave a redirect that would send visitors away from the new address, and repoint chains to it.
  await prisma.redirect.deleteMany({ where: { from: newPath } });
  await prisma.redirect.updateMany({ where: { to: oldPath }, data: { to: newPath } });
  await prisma.redirect.upsert({
    where: { from: oldPath },
    update: { to: newPath, code: 301, isActive: true },
    create: { from: oldPath, to: newPath, code: 301, note: 'Added automatically when the URL changed' },
  });
  await prisma.notFoundLog.deleteMany({ where: { path: oldPath } });
}

module.exports = { postPath, pagePath, normalizePath, autoRedirect };
