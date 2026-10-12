const express = require('express');
const bcrypt = require('bcryptjs');
const { z } = require('zod');
const prisma = require('../lib/prisma');
const { authenticate, authorize } = require('../middleware/auth');
const { asyncHandler, paginate, pageMeta, logActivity, toInt, HttpError, slugify } = require('../lib/utils');
const { PERMISSIONS } = require('../lib/permissions');

const users = express.Router();
users.use(authenticate, authorize('users'));

const userSelect = {
  id: true, name: true, email: true, avatar: true, bio: true, isActive: true, lastLoginAt: true, createdAt: true,
  role: { select: { id: true, name: true, slug: true } },
  _count: { select: { posts: true } },
};

const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  roleId: z.number().int(),
  avatar: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
  isActive: z.boolean().default(true),
});

users.get('/', asyncHandler(async (req, res) => {
  const { page, limit, skip } = paginate(req.query, 20);
  const where = {};
  if (req.query.q) where.OR = ['name', 'email'].map((f) => ({ [f]: { contains: req.query.q, mode: 'insensitive' } }));
  if (req.query.roleId) where.roleId = toInt(req.query.roleId);
  const [items, total] = await Promise.all([
    prisma.user.findMany({ where, select: userSelect, orderBy: { createdAt: 'desc' }, skip, take: limit }),
    prisma.user.count({ where }),
  ]);
  res.json({ items, meta: pageMeta(total, page, limit) });
}));

users.post('/', asyncHandler(async (req, res) => {
  const data = userSchema.parse(req.body);
  const user = await prisma.user.create({
    data: { ...data, email: data.email.toLowerCase(), password: await bcrypt.hash(data.password, 10) },
    select: userSelect,
  });
  await logActivity(req, 'created', 'User', user.id, `Created user ${user.email}`);
  res.status(201).json(user);
}));

users.put('/:id', asyncHandler(async (req, res) => {
  const id = toInt(req.params.id);
  const data = userSchema.partial().extend({ password: z.string().min(8).optional().or(z.literal('')) }).parse(req.body);
  if (id === req.user.id && data.isActive === false) throw new HttpError(400, 'You cannot deactivate your own account');
  if (data.password) data.password = await bcrypt.hash(data.password, 10);
  else delete data.password;
  if (data.email) data.email = data.email.toLowerCase();
  const user = await prisma.user.update({ where: { id }, data, select: userSelect });
  await logActivity(req, 'updated', 'User', user.id, `Updated user ${user.email}`);
  res.json(user);
}));

users.delete('/:id', asyncHandler(async (req, res) => {
  const id = toInt(req.params.id);
  if (id === req.user.id) throw new HttpError(400, 'You cannot delete your own account');
  const user = await prisma.user.delete({ where: { id } });
  await logActivity(req, 'deleted', 'User', id, `Deleted user ${user.email}`);
  res.status(204).end();
}));

const roles = express.Router();
roles.use(authenticate);

roles.get('/', authorize('roles', 'users'), asyncHandler(async (_req, res) => {
  const items = await prisma.role.findMany({ orderBy: { id: 'asc' }, include: { _count: { select: { users: true } } } });
  res.json({ items, permissions: PERMISSIONS });
}));

const roleSchema = z.object({
  name: z.string().min(2),
  description: z.string().nullable().optional(),
  permissions: z.array(z.string()).default([]),
});

roles.post('/', authorize('roles'), asyncHandler(async (req, res) => {
  const data = roleSchema.parse(req.body);
  const role = await prisma.role.create({ data: { ...data, slug: slugify(data.name) } });
  await logActivity(req, 'created', 'Role', role.id, `Created role "${role.name}"`);
  res.status(201).json(role);
}));

roles.put('/:id', authorize('roles'), asyncHandler(async (req, res) => {
  const id = toInt(req.params.id);
  const existing = await prisma.role.findUniqueOrThrow({ where: { id } });
  const data = roleSchema.partial().parse(req.body);
  if (existing.isSystem) delete data.permissions; // super admin always keeps "*"
  const role = await prisma.role.update({ where: { id }, data });
  await logActivity(req, 'updated', 'Role', role.id, `Updated role "${role.name}"`);
  res.json(role);
}));

roles.delete('/:id', authorize('roles'), asyncHandler(async (req, res) => {
  const id = toInt(req.params.id);
  const role = await prisma.role.findUniqueOrThrow({ where: { id }, include: { _count: { select: { users: true } } } });
  if (role.isSystem) throw new HttpError(400, 'System roles cannot be deleted');
  if (role._count.users) throw new HttpError(400, 'Reassign users before deleting this role');
  await prisma.role.delete({ where: { id } });
  await logActivity(req, 'deleted', 'Role', id, `Deleted role "${role.name}"`);
  res.status(204).end();
}));

module.exports = { users, roles };
