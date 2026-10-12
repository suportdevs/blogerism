const { ZodError } = require('zod');
const { Prisma } = require('@prisma/client');

// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, _next) => {
  if (err instanceof ZodError) {
    return res.status(422).json({
      message: err.issues[0] ? `${err.issues[0].path.join('.')}: ${err.issues[0].message}` : 'Validation failed',
      errors: err.issues.map((i) => ({ path: i.path.join('.'), message: i.message })),
    });
  }
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') return res.status(409).json({ message: `A record with this ${(err.meta?.target || []).join(', ')} already exists` });
    if (err.code === 'P2025') return res.status(404).json({ message: 'Record not found' });
  }
  if (err.name === 'MulterError') return res.status(400).json({ message: err.message });
  const status = err.status || 500;
  if (status >= 500) console.error(err);
  return res.status(status).json({ message: status >= 500 ? 'Internal server error' : err.message, details: err.details });
};
