const prisma = require('./prisma');
const { getSettings, saveGroup } = require('./settings');
const { THEMES, DEFAULT_THEME } = require('../themes');
const { HttpError } = require('./utils');

// Removes site content (keeps users, roles, media, settings, subscribers and messages).
async function wipeContent() {
  await prisma.$transaction([
    prisma.menuItem.deleteMany(), prisma.menu.deleteMany(), prisma.post.deleteMany(), prisma.series.deleteMany(),
    prisma.tag.deleteMany(), prisma.category.deleteMany(), prisma.page.deleteMany(), prisma.faq.deleteMany(), prisma.testimonial.deleteMany(),
  ]);
}

async function applyMenus(menus) {
  for (const [location, def] of Object.entries(menus)) {
    const menu = await prisma.menu.upsert({ where: { location }, update: { name: def.name }, create: { location, name: def.name } });
    await prisma.menuItem.deleteMany({ where: { menuId: menu.id } });
    const insert = async (items, parentId) => {
      for (const [order, item] of items.entries()) {
        const created = await prisma.menuItem.create({ data: { menuId: menu.id, parentId, order, label: item.label, url: item.url, target: item.target || '_self' } });
        if (item.children?.length) await insert(item.children, created.id);
      }
    };
    await insert(def.items, null);
  }
}

// Creates the theme's pages. Existing pages with the same slug are kept (they may have been edited).
async function applyPages(pages) {
  let homeId = null;
  for (const p of pages) {
    const existing = await prisma.page.findUnique({ where: { slug: p.slug } });
    const page = existing || await prisma.page.create({
      data: { title: p.title, slug: p.slug, template: p.template || 'default', status: 'PUBLISHED', blocks: p.blocks, seoTitle: p.seoTitle || null },
    });
    if (p.home) homeId = page.id;
  }
  return homeId;
}

/**
 * Activates a theme.
 * opts.appearance — replace colors/fonts/header/footer settings with the theme's preset
 * opts.setup      — create the theme's homepage + pages and replace menus
 * opts.demo       — wipe content and import the theme's demo content (implies setup)
 */
async function activateTheme(id, { appearance = true, setup = true, demo = false } = {}) {
  const theme = THEMES[id];
  if (!theme) throw new HttpError(404, `Unknown theme "${id}"`);

  if (demo) {
    await wipeContent();
    const authors = await prisma.user.findMany({ orderBy: { id: 'asc' }, take: 3 });
    await theme.demo(prisma, { authors });
  }
  if (appearance) {
    await prisma.setting.deleteMany({ where: { key: 'appearance' } });
    await saveGroup('appearance', theme.appearance);
  }
  if (setup || demo) {
    const homepageId = await applyPages(theme.pages());
    await applyMenus(theme.menus);
    await saveGroup('general', { ...(demo ? theme.general : {}), homepageId });
    // Optional per-theme defaults for contact details, social links and SEO (applied with demo content).
    if (demo) for (const group of ['contact', 'social', 'seo']) if (theme[group]) await saveGroup(group, theme[group]);
  }
  await saveGroup('theme', { active: id });
  return getSettings();
}

async function activeThemeId() {
  const { theme } = await getSettings();
  return THEMES[theme?.active] ? theme.active : DEFAULT_THEME;
}

module.exports = { activateTheme, activeThemeId, wipeContent };
