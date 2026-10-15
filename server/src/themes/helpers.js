// Helpers shared by theme definitions (pages, menus and demo content).

const uid = () => Math.random().toString(36).slice(2, 10);
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const pic = (seed, w = 1600, h = 900) => `https://picsum.photos/seed/${seed}/${w}/${h}`;
const hoursAgo = (h) => new Date(Date.now() - h * 3600 * 1000);
const yt = (id) => ({ videoUrl: `https://www.youtube.com/watch?v=${id}`, coverImage: `https://i.ytimg.com/vi/${id}/hqdefault.jpg` });
const mp3 = (n) => `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${n}.mp3`;
// Unsplash CDN photo (ids verified to exist).
const un = (id, w = 1600) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;
const MDN_VIDEO = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos';

// Page-builder block.
const B = (type, data, style = {}) => ({ id: uid(), type, data, style: { paddingY: 'md', width: 'normal', animate: false, ...style } });
// Menu item.
// extra: { description, icon, badge, image, mega } for rich dropdowns and mega menus.
const m = (label, url, children = [], extra = {}) => ({ label, url, target: '_self', ...extra, children });

// Verified Blender open-movie uploads on YouTube: [id, title, seconds].
const FILMS = {
  elephants: ['TLkA0RELQ1g', 'Elephants Dream', 654],
  bunny: ['aqz-KE-bpKQ', 'Big Buck Bunny', 635],
  sintel: ['eRsGyueVLvQ', 'Sintel', 888],
  steel: ['R6MlUcmOul8', 'Tears of Steel', 734],
  cosmos: ['Y-rmzh0PI3c', 'Cosmos Laundromat', 724],
  spring: ['WhWc3b3KhnY', 'Spring', 464],
  sprite: ['_cMxraX_5RE', 'Sprite Fright', 629],
  charge: ['UXqq0ZvbOnk', 'Charge', 236],
  agent: ['mN0zPOpADL4', 'Agent 327: Operation Barbershop', 231],
  hero: ['pKmSdY56VtY', 'Hero', 237],
  coffee: ['PVGeM40dABA', 'Coffee Run', 184],
  llama2: ['Z4C82eyhwgU', 'Caminandes 2: Gran Dillama', 146],
  llama3: ['SkVqJ1SGeL0', 'Caminandes 3: Llamigos', 150],
};

async function createCategories(prisma, defs) {
  const map = {};
  for (const [order, [name, color]] of defs.entries()) {
    map[name] = await prisma.category.create({ data: { name, slug: slug(name), color, order, description: `Latest from ${name}.` } });
  }
  return map;
}

const rand = (min, max) => Math.floor(Math.random() * (max - min)) + min;

// Pages most themes share. Each theme lists the ones it wants.
const commonPages = {
  about: (name, text) => ({
    slug: 'about', title: 'About',
    blocks: [
      B('pageHeader', { title: `About ${name}`, subtitle: text }, { background: 'gradient', paddingY: 'lg' }),
      B('richText', { html: `<h2>Our mission</h2><p>${name} exists to publish work that informs, entertains and inspires. We believe in craft, independence and respect for our audience.</p><h2>Get in touch</h2><p>Have a tip, a question or a partnership idea? <a href="/contact">Contact us</a> — we read everything.</p>` }, { width: 'narrow', paddingY: 'lg' }),
    ],
  }),
  privacy: () => ({
    slug: 'privacy-policy', title: 'Privacy policy',
    blocks: [
      B('pageHeader', { title: 'Privacy policy', subtitle: 'Last updated: October 2026' }, { background: 'surface' }),
      B('richText', { html: '<p>Your privacy is important to us. This policy explains what information we collect and how we use it.</p><h2>Information we collect</h2><p>We collect information you provide directly, such as when you subscribe to our newsletter or contact us.</p><h2>How we use it</h2><p>We use your information only to respond to you and to send the updates you requested.</p>' }, { width: 'narrow', paddingY: 'lg' }),
    ],
  }),
};

async function seedFaqs(prisma, faqs) {
  await prisma.faq.createMany({ data: faqs.map(([question, answer], order) => ({ question, answer, order, category: 'General' })) });
}

module.exports = { un, uid, slug, pic, hoursAgo, yt, mp3, MDN_VIDEO, B, m, FILMS, createCategories, rand, commonPages, seedFaqs };
