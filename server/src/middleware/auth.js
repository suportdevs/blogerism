const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');
const { hasPermission } = require('../lib/permissions');
const { HttpError } = require('../lib/utils');

const signToken = (user) =>
  jwt.sign({ sub: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

async function authenticate(req, _res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) throw new HttpError(401, 'Authentication required');
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: payload.sub }, include: { role: true } });
    if (!user || !user.isActive) throw new HttpError(401, 'Account not found or disabled');
    delete user.password;
    req.user = user;
    next();
  } catch (err) {
    next(err instanceof HttpError ? err : new HttpError(401, 'Invalid or expired session'));
  }
}

const authorize = (...keys) => (req, _res, next) => {
  if (keys.some((k) => hasPermission(req.user, k))) return next();
  return next(new HttpError(403, 'You do not have permission to perform this action'));
};

module.exports = { signToken, authenticate, authorize };
