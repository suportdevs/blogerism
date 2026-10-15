require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const { z } = require('zod');

const crud = require('./lib/crud');
const errorHandler = require('./middleware/error');
const { users, roles } = require('./routes/users');

const app = express();
app.set('trust proxy', 1);

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: (process.env.CLIENT_URL || 'http://localhost:3000').split(','), credentials: true }));
app.use(compression());
app.use(express.json({ limit: '5mb' }));
if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads'), { maxAge: '30d' }));

app.get('/api/health', (_req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

app.use('/api/public', require('./routes/public'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin/posts', require('./routes/posts'));
app.use('/api/admin/taxonomy', require('./routes/taxonomy'));
app.use('/api/admin/pages', require('./routes/pages'));
app.use('/api/admin/series', require('./routes/series'));
app.use('/api/admin/themes', require('./routes/themes'));
app.use('/api/admin/media', require('./routes/media'));
app.use('/api/admin/menus', require('./routes/menus').router);
app.use('/api/admin/settings', require('./routes/settings'));
app.use('/api/admin/contacts', require('./routes/contacts'));
app.use('/api/admin/comments', require('./routes/comments'));
app.use('/api/admin/users', users);
app.use('/api/admin/roles', roles);
app.use('/api/admin/system', require('./routes/system'));

app.use('/api/admin/faqs', crud({
  model: 'faq',
  permission: 'faqs',
  label: 'FAQ',
  searchFields: ['question', 'answer'],
  orderBy: [{ order: 'asc' }, { id: 'asc' }],
  schema: z.object({
    question: z.string().min(3),
    answer: z.string().min(1),
    category: z.string().nullable().optional(),
    order: z.number().int().default(0),
    isActive: z.boolean().default(true),
  }),
}));

app.use('/api/admin/testimonials', crud({
  model: 'testimonial',
  permission: 'testimonials',
  label: 'Testimonial',
  searchFields: ['name', 'company', 'content'],
  orderBy: [{ order: 'asc' }, { id: 'asc' }],
  schema: z.object({
    name: z.string().min(2),
    position: z.string().nullable().optional(),
    company: z.string().nullable().optional(),
    avatar: z.string().nullable().optional(),
    content: z.string().min(5),
    rating: z.number().int().min(1).max(5).default(5),
    order: z.number().int().default(0),
    isActive: z.boolean().default(true),
  }),
}));

app.use('/api/admin/subscribers', crud({
  model: 'subscriber',
  permission: 'newsletter',
  label: 'Subscriber',
  searchFields: ['email', 'name'],
  orderBy: { createdAt: 'desc' },
  schema: z.object({ email: z.string().email(), name: z.string().nullable().optional(), isActive: z.boolean().default(true) }),
}));

app.use('/api', (_req, res) => res.status(404).json({ message: 'Endpoint not found' }));
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Themewright API running on http://localhost:${PORT}`));
