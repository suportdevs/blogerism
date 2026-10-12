const express = require('express');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');
const { z } = require('zod');
const prisma = require('../lib/prisma');
const { signToken, authenticate } = require('../middleware/auth');
const { asyncHandler, HttpError, logActivity } = require('../lib/utils');
const { PERMISSIONS } = require('../lib/permissions');

const router = express.Router();
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: true, legacyHeaders: false });

router.post('/login', loginLimiter, asyncHandler(async (req, res) => {
  const { email, password } = z.object({ email: z.string().email(), password: z.string().min(1) }).parse(req.body);
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() }, include: { role: true } });
  if (!user || !(await bcrypt.compare(password, user.password))) throw new HttpError(401, 'Invalid email or password');
  if (!user.isActive) throw new HttpError(403, 'Your account has been disabled');
  await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  req.user = user;
  await logActivity(req, 'login', 'Auth', user.id, `${user.name} signed in`);
  delete user.password;
  res.json({ token: signToken(user), user });
}));

router.get('/me', authenticate, (req, res) => res.json({ user: req.user, permissions: PERMISSIONS }));

router.put('/me', authenticate, asyncHandler(async (req, res) => {
  const data = z.object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
    avatar: z.string().nullable().optional(),
    bio: z.string().nullable().optional(),
  }).parse(req.body);
  if (data.email) data.email = data.email.toLowerCase();
  const user = await prisma.user.update({ where: { id: req.user.id }, data, include: { role: true } });
  delete user.password;
  await logActivity(req, 'updated', 'Profile', user.id, 'Updated own profile');
  res.json({ user });
}));

router.put('/me/password', authenticate, asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = z.object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  }).parse(req.body);
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  if (!(await bcrypt.compare(currentPassword, user.password))) throw new HttpError(400, 'Current password is incorrect');
  await prisma.user.update({ where: { id: user.id }, data: { password: await bcrypt.hash(newPassword, 10) } });
  await logActivity(req, 'updated', 'Profile', user.id, 'Changed password');
  res.json({ message: 'Password updated' });
}));

module.exports = router;
