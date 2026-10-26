// Builder with a selected block + live theme previews (Preview modal, no activation).
const puppeteer = require('puppeteer-core');
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const { token } = await (await fetch('http://localhost:4000/api/auth/login', {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email: 'admin@novacms.dev', password: 'admin123' }),
  })).json();
  const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', args: ['--hide-scrollbars'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1.5 });
  await page.goto('http://localhost:3000/admin/login', { waitUntil: 'networkidle2' });
  await page.evaluate((t) => localStorage.setItem('nova_token', t), token);

  await page.goto('http://localhost:3000/admin/pages/393', { waitUntil: 'networkidle2' });
  await wait(6000);
  await page.evaluate(() => { const el = [...document.querySelectorAll('button,div')].find((e) => e.textContent.trim().startsWith('Video gridVideo grid')); el?.click(); });
  await wait(5000);
  await page.screenshot({ path: 'shots/admin-builder.png' });
  console.log('ok builder');

  const themes = process.argv.slice(2);
  for (const name of themes) {
    await page.goto('http://localhost:3000/admin/themes', { waitUntil: 'networkidle2' });
    await wait(2500);
    const ok = await page.evaluate((name) => {
      const h = [...document.querySelectorAll('h1,h2,h3,h4,p,span,div')].find((e) => e.children.length === 0 && e.textContent.trim() === name);
      if (!h) return false;
      let card = h; for (let i = 0; i < 8 && card; i++) { const b = [...card.querySelectorAll('button')].find((x) => x.textContent.trim() === 'Preview'); if (b) { b.click(); return true; } card = card.parentElement; }
      return false;
    }, name);
    if (!ok) { console.log('no card', name); continue; }
    await wait(9000);
    await page.screenshot({ path: `shots/theme-${name.toLowerCase()}.png` });
    console.log('ok', name);
  }
  await browser.close();
})();
