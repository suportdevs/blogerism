const express = require('express');
const { z } = require('zod');
const prisma = require('../lib/prisma');
const { authenticate, authorize } = require('../middleware/auth');
const { asyncHandler, logActivity, toInt, HttpError } = require('../lib/utils');

const router = express.Router();
router.use(authenticate, authorize('menus'));

const MAX_DEPTH = 3; // top level, dropdown, sub-dropdown / mega column links
const opt = (max) => z.string().trim().max(max).optional().nullable().transform((v) => v || null);
const itemSchema = z.lazy(() => z.object({
  label: z.string().trim().min(1, 'Every menu item needs a label').max(120),
  url: z.string().trim().min(1, 'Every menu item needs a URL (use # for a heading)').max(500),
  target: z.enum(['_self', '_blank']).default('_self'),
  description: opt(240),
  icon: opt(40),
  badge: opt(24),
  image: opt(500),
  mega: z.boolean().default(false),
  children: z.array(itemSchema).default([]),
}));
const depthOf = (items) => (items.length ? 1 + Math.max(...items.map((i) => depthOf(i.children || []))) : 0);

const menuInclude = { items: { orderBy: { order: 'asc' } } };

// Flat DB rows -> nested tree for the editor/front-end.
function toTree(items, parentId = null) {
  return items
    .filter((i) => i.parentId === parentId)
    .sort((a, b) => a.order - b.order)
    .map((i) => ({
      id: i.id, label: i.label, url: i.url, target: i.target,
      description: i.description, icon: i.icon, badge: i.badge, image: i.image, mega: i.mega,
      children: toTree(items, i.id),
    }));
}

const serialize = (menu) => ({ ...menu, items: toTree(menu.items) });

router.get('/', asyncHandler(async (_req, res) => {
  const menus = await prisma.menu.findMany({ include: menuInclude, orderBy: { id: 'asc' } });
  res.json({ items: menus.map(serialize) });
}));

router.post('/', asyncHandler(async (req, res) => {
  const data = z.object({ name: z.string().min(1), location: z.string().min(1).regex(/^[a-z0-9-]+$/, 'Use lowercase letters, numbers and dashes') }).parse(req.body);
  const menu = await prisma.menu.create({ data, include: menuInclude });
  await logActivity(req, 'created', 'Menu', menu.id, `Created menu "${menu.name}"`);
  res.status(201).json(serialize(menu));
}));

// Replaces the whole item tree in one transaction — simplest way to persist drag & drop ordering.
router.put('/:id', asyncHandler(async (req, res) => {
  const id = toInt(req.params.id);
  const { name, items } = z.object({ name: z.string().min(1).optional(), items: z.array(itemSchema) }).parse(req.body);
  if (depthOf(items) > MAX_DEPTH) throw new HttpError(422, `Menus can be at most ${MAX_DEPTH} levels deep`);

  await prisma.$transaction(async (tx) => {
    if (name) await tx.menu.update({ where: { id }, data: { name } });
    await tx.menuItem.deleteMany({ where: { menuId: id } });
    const insert = async (list, parentId) => {
      for (const [order, item] of list.entries()) {
        const { children, ...fields } = item;
        // Only top-level items can open a mega menu.
        const created = await tx.menuItem.create({ data: { ...fields, mega: parentId === null && fields.mega, menuId: id, parentId, order } });
        if (item.children?.length) await insert(item.children, created.id);
      }
    };
    await insert(items, null);
  });

  const menu = await prisma.menu.findUniqueOrThrow({ where: { id }, include: menuInclude });
  await logActivity(req, 'updated', 'Menu', id, `Updated menu "${menu.name}"`);
  res.json(serialize(menu));
}));

router.delete('/:id', asyncHandler(async (req, res) => {
  const menu = await prisma.menu.delete({ where: { id: toInt(req.params.id) } });
  await logActivity(req, 'deleted', 'Menu', menu.id, `Deleted menu "${menu.name}"`);
  res.status(204).end();
}));

module.exports = { router, toTree };
