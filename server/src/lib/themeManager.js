const prisma = require('./prisma');
const { getSettings, saveGroup } = require('./settings');
const { THEMES, DEFAULT_THEME } = require('../themes');
const { HttpError } = require('./utils');
const { saveWorkspace, loadWorkspace, clearContent } = require('./workspace');

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

async function activeThemeId() {
  const { theme } = await getSettings();
  return THEMES[theme?.active] ? theme.active : DEFAULT_THEME;
}

/**
 * Activates a theme. The outgoing theme's content is always saved to its workspace first.
 * opts.demo       — (re)install this theme's demo content (only this theme's content is replaced)
 * opts.restore    — when switching, bring back this theme's saved content if it has any (default)
 * opts.appearance — apply the theme's design preset (skipped when saved content was restored)
 * opts.setup      — create the theme's pages & menus (skipped when saved content was restored)
 */
async function activateTheme(id, { appearance = true, setup = true, demo = false, restore = true } = {}) {
  const theme = THEMES[id];
  if (!theme) throw new HttpError(404, `Unknown theme "${id}"`);
  const current = await activeThemeId();
  const switching = current !== id;

  if (switching) await saveWorkspace(current);

  let restored = false;
  if (demo) {
    await clearContent();
    const authors = await prisma.user.findMany({ orderBy: { id: 'asc' }, take: 3 });
    await theme.demo(prisma, { authors });
  } else if (switching) {
    restored = restore && (await loadWorkspace(id));
    if (!restored) await clearContent(); // a never-used theme starts with a clean slate
  }

  if (appearance && !restored) {
    await prisma.setting.deleteMany({ where: { key: 'appearance' } });
    await saveGroup('appearance', theme.appearance);
  }
  if ((setup && !restored) || demo) {
    const homepageId = await applyPages(theme.pages());
    await applyMenus(theme.menus);
    await saveGroup('general', { ...(demo || switching ? theme.general : {}), homepageId });
    // Optional per-theme defaults for contact details, social links and SEO.
    if (demo) for (const group of ['contact', 'social', 'seo']) if (theme[group]) await saveGroup(group, theme[group]);
  }
  await saveGroup('theme', { active: id });
  return { settings: await getSettings(), restored };
}

module.exports = { activateTheme, activeThemeId };
