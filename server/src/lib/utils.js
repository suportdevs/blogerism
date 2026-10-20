const slugifyLib = require('slugify');
const prisma = require('./prisma');

const slugify = (text) =>
  slugifyLib(String(text || ''), { lower: true, strict: true, trim: true }) || `item-${Date.now()}`;

// Generate a slug unique within the given Prisma model, ignoring the record being edited.
async function uniqueSlug(model, text, excludeId) {
  const base = slugify(text);
  let slug = base;
  let i = 1;
  while (await prisma[model].findFirst({ where: { slug, ...(excludeId ? { NOT: { id: excludeId } } : {}) } })) {
    slug = `${base}-${i++}`;
  }
  return slug;
}

const paginate = (query, defaults = 12) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || defaults));
  return { page, limit, skip: (page - 1) * limit };
};

const pageMeta = (total, page, limit) => ({ total, page, limit, pages: Math.max(1, Math.ceil(total / limit)) });

const readingTime = (html = '') => {
  const words = html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
};

const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

class HttpError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

async function logActivity(req, action, entity, entityId, description) {
  try {
    await prisma.activityLog.create({
      data: {
        userId: req.user?.id ?? null,
        action,
        entity,
        entityId: entityId != null ? String(entityId) : null,
        description,
        ip: req.ip,
      },
    });
  } catch (e) {
    console.error('activity log failed', e.message);
  }
}

const toInt = (v) => {
  const n = parseInt(v, 10);
  return Number.isNaN(n) ? undefined : n;
};

// CSV download. Cells that spreadsheet apps would run as formulas are prefixed with a quote.
function sendCsv(res, filename, columns, rows) {
  const cell = (v) => {
    let s = v == null ? '' : v instanceof Date ? v.toISOString() : String(v);
    if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [columns.map(([, label]) => cell(label)).join(','), ...rows.map((r) => columns.map(([key]) => cell(r[key])).join(','))];
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.send(`\uFEFF${lines.join('\r\n')}`); // BOM so Excel reads UTF-8 (e.g. Bengali names) correctly
}

module.exports = { sendCsv, slugify, uniqueSlug, paginate, pageMeta, readingTime, asyncHandler, HttpError, logActivity, toInt };
