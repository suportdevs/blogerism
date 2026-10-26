// Capture real screenshots of the running Themewright site + admin.
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, 'shots');
fs.mkdirSync(OUT, { recursive: true });
const BASE = 'http://localhost:3000';
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const targets = (process.argv[2] ? JSON.parse(process.argv[2]) : [
  ['site-home', '/', false],
  ['site-mobile', '/', false, { width: 390, height: 844, mobile: true }],
  ['admin-dashboard', '/admin', true],
  ['admin-pages', '/admin/pages', true],
  ['admin-themes', '/admin/themes', true],
  ['admin-menus', '/admin/menus', true],
  ['admin-translations', '/admin/translations', true],
  ['admin-export', '/admin/export', true],
  ['admin-settings', '/admin/settings', true],
  ['admin-media', '/admin/media', true],
  ['admin-posts', '/admin/posts', true],
  ['admin-roles', '/admin/roles', true],
]);

(async () => {
  const res = await fetch('http://localhost:4000/api/auth/login', {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email: 'admin@novacms.dev', password: 'admin123' }),
  });
  const { token } = await res.json();
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new', args: ['--hide-scrollbars'],
  });
  const page = await browser.newPage();
  await page.goto(BASE + '/admin/login', { waitUntil: 'networkidle2' });
  await page.evaluate((t) => localStorage.setItem('nova_token', t), token);

  for (const [name, url, , vp] of targets) {
    await page.setViewport(vp ? { width: vp.width, height: vp.height, deviceScaleFactor: 2, isMobile: !!vp.mobile, hasTouch: !!vp.mobile } : { width: 1440, height: 900, deviceScaleFactor: 1.5 });
    try {
      await page.goto(BASE + url, { waitUntil: 'networkidle2', timeout: 60000 });
    } catch (e) { console.log('timeout', name); }
    await wait(2500);
    await page.screenshot({ path: path.join(OUT, name + '.png') });
    console.log('ok', name);
  }
  await browser.close();
})();
