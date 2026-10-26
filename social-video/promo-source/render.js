// Render video.html frame by frame into ffmpeg.
//   node render.js stills 2 6 12 ...   -> stills/t<sec>.jpg
//   node render.js video               -> frames.mp4 (silent)
const puppeteer = require('puppeteer-core');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const FFMPEG = 'D:/mern/cms/social-video/tools/package/ffmpeg.exe';
const FPS = 30;
const [mode, ...rest] = process.argv.slice(2);

(async () => {
  const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', args: ['--hide-scrollbars', '--allow-file-access-from-files'] });
  const page = await browser.newPage();
  page.on('pageerror', (e) => console.log('PAGE ERROR', e.message));
  await page.setViewport({ width: 1080, height: 1350, deviceScaleFactor: 1 });
  await page.goto('file:///' + path.join(__dirname, 'video.html').replace(/\\/g, '/'), { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => Promise.all([...document.images].map((i) => i.decode().catch(() => {}))));

  if (mode === 'stills') {
    fs.mkdirSync(path.join(__dirname, 'stills'), { recursive: true });
    for (const t of rest.map(Number)) {
      await page.evaluate((t) => window.seek(t), t);
      await page.screenshot({ path: path.join(__dirname, 'stills', `t${t}.jpg`), type: 'jpeg', quality: 85 });
    }
  } else {
    const total = await page.evaluate(() => window.TOTAL);
    const frames = Math.round(total * FPS);
    const ff = spawn(FFMPEG, ['-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
      '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p', '-r', String(FPS), path.join(__dirname, 'frames.mp4')], { stdio: ['pipe', 'inherit', 'inherit'] });
    const t0 = Date.now();
    for (let f = 0; f < frames; f++) {
      await page.evaluate((t) => window.seek(t), f / FPS);
      const buf = await page.screenshot({ type: 'jpeg', quality: 95, optimizeForSpeed: true });
      if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
      if (f % 150 === 0) console.log(`frame ${f}/${frames}  ${((Date.now() - t0) / 1000).toFixed(0)}s`);
    }
    ff.stdin.end();
    await new Promise((r) => ff.on('close', r));
    console.log('done in', ((Date.now() - t0) / 1000).toFixed(0), 's');
  }
  await browser.close();
})();
