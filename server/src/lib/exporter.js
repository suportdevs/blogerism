const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const archiver = require('archiver');
const { createSnapshot, referencedUploads } = require('./snapshot');
const { THEMES } = require('../themes');

/*
 * "Export project": packages a standalone, production-ready copy of the CMS for one client —
 * full source code locked to the client's theme, their content as a snapshot, the media it uses,
 * env files, Docker / PM2 / Nginx configs and a README. The main project keeps working as the builder.
 */

const PROJECT_ROOT = process.env.PROJECT_ROOT || path.resolve(__dirname, '..', '..', '..');

const SKIP_DIRS = new Set(['node_modules', '.next', '.git', 'uploads', 'backups', 'coverage', 'dist', '.turbo']);
const SKIP_FILE = (name) => /^\.env(\..*)?$/.test(name) || name.endsWith('.log') || name === '.DS_Store' || name.endsWith('.tsbuildinfo');

function walk(dir, base, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) walk(path.join(dir, entry.name), path.posix.join(base, entry.name), out);
    } else if (!SKIP_FILE(entry.name)) {
      out.push(path.posix.join(base, entry.name));
    }
  }
  return out;
}

const slugify = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'site';
const secret = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');

/* ------------------------------ generated files ------------------------------ */

// Versions of a theme live in a file that builds on the classic theme files it requires:
// luxe.js for Luxe versions, <theme>-demos.js for homepage demos (theme.source).
const variantFile = (theme) => theme.source || 'luxe.js';

function themeSourceFiles(theme) {
  if (!theme.variantOf) return ['helpers.js', `${theme.id}.js`];
  const file = variantFile(theme);
  const src = fs.readFileSync(path.join(PROJECT_ROOT, 'server/src/themes', file), 'utf8');
  const required = [...src.matchAll(/require\('\.\/([a-z-]+)'\)/g)].map((m) => `${m[1]}.js`);
  return [file, ...new Set(required)];
}

function themeIndex(theme) {
  const entry = theme.variantOf ? `...require('./${variantFile(theme).replace(/\.js$/, '')}').filter((t) => t.id === '${theme.id}')` : `require('./${theme.id}')`;
  const src = fs.readFileSync(path.join(PROJECT_ROOT, 'server/src/themes/index.js'), 'utf8');
  return src
    .replace(/const THEMES = Object\.fromEntries\(\[[\s\S]*?\]\.map/, `const THEMES = Object.fromEntries([\n  ${entry},\n].map`)
    .replace(/const DEFAULT_THEME = '[^']*';/, `const DEFAULT_THEME = '${theme.id}';`);
}

const seedFile = (c) => `/* eslint-disable no-console */
// Restores this site's content (prisma/data/snapshot.json) and creates the admin account from .env.
// Usage: node prisma/seed.js            — (re)install content, replacing what is in the database
//        node prisma/seed.js --if-empty — only when the database has never been set up (used by Docker)
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const prisma = require('../src/lib/prisma');
const { restoreSnapshot } = require('../src/lib/snapshot');

async function main() {
  if (process.argv.includes('--if-empty') && (await prisma.setting.count()) > 0) {
    console.log('Database already initialised — skipping content import.');
    return;
  }
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD in server/.env first.');
  const snapshot = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'snapshot.json'), 'utf8'));
  await restoreSnapshot(snapshot, { admin: { email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD, name: process.env.ADMIN_NAME } });
  console.log('✅ ${c.name} content installed. Admin: ' + process.env.ADMIN_EMAIL);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
`;

const serverEnv = (c, { example = false } = {}) => `# ${c.name} — API configuration
# With Docker, DATABASE_URL is overridden by docker-compose.yml. On a VPS point it at your PostgreSQL server.
DATABASE_URL="postgresql://cms:${example ? 'change-me' : c.dbPassword}@localhost:5432/${c.dbName}?schema=public"
PORT=4000
JWT_SECRET="${example ? 'generate-a-long-random-string' : c.jwtSecret}"
JWT_EXPIRES_IN="7d"
# Public URL of the website (allowed CORS origin) and of this API
CLIENT_URL="${c.siteUrl}"
PUBLIC_URL="${c.apiUrl}"
# Admin account created on first install — change the password after your first login
ADMIN_EMAIL="${c.adminEmail}"
ADMIN_PASSWORD="${example ? 'change-me' : c.adminPassword}"
ADMIN_NAME="${c.adminName || 'Administrator'}"
ENABLE_EXPORT=false
`;

const clientEnvProduction = (c) => `# Baked into the production build (npm run build)
NEXT_PUBLIC_API_URL=${c.apiUrl}
NEXT_PUBLIC_SITE_URL=${c.siteUrl}
# How the Next.js server reaches the API (internal address). Docker overrides this with http://api:4000
API_URL=http://127.0.0.1:4000
`;

const clientEnvDevelopment = () => `NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
API_URL=http://localhost:4000
`;

const rootEnv = (c) => `# docker compose settings
POSTGRES_PASSWORD=${c.dbPassword}
WEB_PORT=3000
API_PORT=4000
NEXT_PUBLIC_API_URL=${c.apiUrl}
NEXT_PUBLIC_SITE_URL=${c.siteUrl}
`;

const compose = (c) => `name: ${c.slug}

services:
  db:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_USER: cms
      POSTGRES_PASSWORD: \${POSTGRES_PASSWORD}
      POSTGRES_DB: ${c.dbName}
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U cms -d ${c.dbName}"]
      interval: 5s
      timeout: 5s
      retries: 30

  api:
    build: ./server
    restart: unless-stopped
    env_file: ./server/.env
    environment:
      DATABASE_URL: postgresql://cms:\${POSTGRES_PASSWORD}@db:5432/${c.dbName}?schema=public
      NODE_ENV: production
    depends_on:
      db:
        condition: service_healthy
    volumes:
      - uploads:/app/uploads
    ports:
      - "\${API_PORT:-4000}:4000"

  web:
    build:
      context: ./client
      args:
        NEXT_PUBLIC_API_URL: \${NEXT_PUBLIC_API_URL}
        NEXT_PUBLIC_SITE_URL: \${NEXT_PUBLIC_SITE_URL}
        API_URL: http://api:4000
    restart: unless-stopped
    environment:
      API_URL: http://api:4000
    depends_on:
      - api
    ports:
      - "\${WEB_PORT:-3000}:3000"

volumes:
  pgdata:
  uploads:
`;

const serverDockerfile = () => `FROM node:20-alpine
RUN apk add --no-cache openssl
WORKDIR /app
COPY package*.json ./
RUN npm install --no-audit --no-fund
COPY . .
RUN npx prisma generate
ENV NODE_ENV=production
EXPOSE 4000
# Create/upgrade tables, import the site content on first boot only, then start the API.
CMD ["sh", "-c", "npx prisma db push --skip-generate && node prisma/seed.js --if-empty && node src/index.js"]
`;

const clientDockerfile = () => `FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --no-audit --no-fund
COPY . .
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_SITE_URL
ARG API_URL=http://api:4000
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL \\
    NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \\
    API_URL=$API_URL \\
    NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/next.config.js ./
EXPOSE 3000
CMD ["npx", "next", "start", "-p", "3000"]
`;

const dockerignore = (extra = '') => `${extra}node_modules
.next
.env.development
npm-debug.log
`;

const pm2 = (c) => `// PM2 process file for a VPS deployment: pm2 start ecosystem.config.js && pm2 save
module.exports = {
  apps: [
    { name: '${c.slug}-api', cwd: './server', script: 'src/index.js', env: { NODE_ENV: 'production' } },
    { name: '${c.slug}-web', cwd: './client', script: 'node_modules/next/dist/bin/next', args: 'start -p 3000', env: { NODE_ENV: 'production' } },
  ],
};
`;

const nginx = (c) => {
  const host = (u) => u.replace(/^https?:\/\//, '').replace(/[:/].*$/, '');
  return `# Example Nginx reverse proxy. Add HTTPS with: sudo certbot --nginx
server {
    listen 80;
    server_name ${host(c.siteUrl)};
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 80;
    server_name ${host(c.apiUrl)};
    client_max_body_size 25m;
    location / {
        proxy_pass http://127.0.0.1:4000;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
`;
};

const rootPackage = (c) => JSON.stringify({
  name: c.slug,
  private: true,
  scripts: {
    'install:all': 'npm --prefix server install && npm --prefix client install && npm --prefix server exec prisma generate',
    setup: 'npm --prefix server run setup',
    'dev:server': 'npm --prefix server run dev',
    'dev:client': 'npm --prefix client run dev',
    build: 'npm --prefix client run build',
  },
}, null, 2) + '\n';

const gitignore = () => `node_modules
.next
.env
.env.local
server/uploads/*
!server/uploads/.gitkeep
`;

const readme = (c) => `# ${c.name}

Website and admin panel built on **Blogerism** — ${c.theme.name} theme (${c.theme.category}).
Express + PostgreSQL API (\`server/\`) and a Next.js website + admin panel (\`client/\`).

| | |
| --- | --- |
| Website | ${c.siteUrl} |
| API | ${c.apiUrl} |
| Admin panel | ${c.siteUrl}/admin |
| Admin login | \`${c.adminEmail}\` (password in \`server/.env\` → \`ADMIN_PASSWORD\`) |

> **Change the admin password after your first login** (Admin → My profile). Other team members were exported without passwords — set new ones in Admin → Users.

## Deploy with Docker (recommended)

Requirements: Docker + Docker Compose.

\`\`\`bash
docker compose up -d --build
\`\`\`

- Website: http://localhost:3000 · API: http://localhost:4000 (ports are set in \`.env\`).
- On first start the API creates the database tables and imports this site's content (\`server/prisma/data/snapshot.json\`). Restarts never overwrite your data.
- Uploaded files are stored in the \`uploads\` volume, the database in \`pgdata\`.
- Put Nginx (see \`deploy/nginx.conf\`) or any reverse proxy with HTTPS in front of ports 3000 and 4000.

If you change \`NEXT_PUBLIC_API_URL\` / \`NEXT_PUBLIC_SITE_URL\` in \`.env\`, rebuild the website: \`docker compose up -d --build web\`.

## Deploy on a VPS without Docker

Requirements: Node.js 18+, PostgreSQL 14+, Nginx, PM2 (\`npm i -g pm2\`).

\`\`\`bash
# 1. Database
sudo -u postgres psql -c "CREATE USER cms WITH PASSWORD '<password>';"
sudo -u postgres psql -c "CREATE DATABASE ${c.dbName} OWNER cms;"

# 2. API — set DATABASE_URL in server/.env, then:
cd server && npm install && npx prisma generate && npm run setup && cd ..

# 3. Website — check client/.env.production, then:
cd client && npm install && npm run build && cd ..

# 4. Run both with PM2
pm2 start ecosystem.config.js && pm2 save

# 5. Nginx — copy deploy/nginx.conf to /etc/nginx/sites-available/, enable it, then: sudo certbot --nginx
\`\`\`

## Local development

\`\`\`bash
docker compose up -d db                 # or use your own PostgreSQL
cd server && npm install && npx prisma generate && npm run setup && npm run dev
cd client && npm install && npm run dev  # http://localhost:3000
\`\`\`

For local development set \`DATABASE_URL\` in \`server/.env\` to your local database and \`CLIENT_URL=http://localhost:3000\`.

## Project structure

\`\`\`
server/                 Express API, Prisma schema, theme definition
  prisma/data/          snapshot.json — the content this project was exported with
  src/themes/           ${c.theme.id}.js — layout, design, pages & menus of the ${c.theme.name} theme
client/                 Next.js website (app/(site)) and admin panel (app/(admin))
  components/site/      Page-builder blocks and layouts
  lib/blocks.js         Block registry — add your own block types here
deploy/nginx.conf       Reverse proxy example
ecosystem.config.js     PM2 process file
\`\`\`

## Customizing

- **Content, pages, menus, design:** everything is editable in the admin panel (Pages → visual builder, Appearance → Customize, Menus, Settings).
- **Code:** this is the full source code — change components in \`client/components/site\`, add API routes in \`server/src/routes\`, extend the database in \`server/prisma/schema.prisma\` (then \`npx prisma db push\`).
- **Reinstall the original content:** \`cd server && node prisma/seed.js\` (⚠ replaces all content).

## Backups

\`\`\`bash
docker compose exec db pg_dump -U cms ${c.dbName} > backup.sql
docker compose cp api:/app/uploads ./uploads-backup
\`\`\`

Exported on ${new Date().toISOString().slice(0, 10)}.
`;

const editionFile = (c) => `// Generated by "Export project": this project is locked to a single theme.
export const EDITION = { singleTheme: '${c.theme.id}', brand: ${JSON.stringify(c.name)} };
`;

/* ------------------------------ export ------------------------------ */

async function buildExportContext(opts) {
  const snapshot = await createSnapshot({ includeMessages: opts.includeMessages, includeUsers: opts.includeUsers });
  const theme = THEMES[snapshot.theme];
  if (!theme) throw new Error(`Active theme "${snapshot.theme}" not found`);
  const slug = slugify(opts.name);
  return {
    snapshot,
    uploads: referencedUploads(snapshot),
    ctx: {
      name: opts.name, slug, theme,
      dbName: slug.replace(/-/g, '_').slice(0, 40),
      siteUrl: opts.siteUrl.replace(/\/$/, ''),
      apiUrl: opts.apiUrl.replace(/\/$/, ''),
      adminEmail: opts.adminEmail,
      adminName: opts.adminName || 'Administrator',
      adminPassword: opts.adminPassword,
      jwtSecret: secret(32),
      dbPassword: secret(12),
    },
  };
}

/** Streams the export ZIP into a writable (an Express response). */
async function streamExport(res, opts) {
  const { snapshot, uploads, ctx } = await buildExportContext(opts);
  const root = ctx.slug;
  const themeFiles = new Set(themeSourceFiles(ctx.theme));

  const archive = archiver('zip', { zlib: { level: 9 } });
  archive.on('warning', (e) => console.warn('export warning', e.message));
  archive.on('error', (e) => { console.error('export failed', e); res.destroy(e); });
  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', `attachment; filename="${root}.zip"`);
  archive.pipe(res);

  // Source code (minus generated/replaced files and other themes).
  const replaced = new Set([
    'server/prisma/seed.js', 'server/src/themes/index.js', 'client/lib/edition.js', 'server/package.json', 'client/package.json',
  ]);
  for (const area of ['server', 'client']) {
    for (const rel of walk(path.join(PROJECT_ROOT, area), area)) {
      if (replaced.has(rel)) continue;
      const m = rel.match(/^server\/src\/themes\/([^/]+)$/);
      if (m && !themeFiles.has(m[1])) continue;
      archive.file(path.join(PROJECT_ROOT, rel), { name: `${root}/${rel}` });
    }
  }

  const add = (name, content) => archive.append(content, { name: `${root}/${name}` });
  const pkg = (area, suffix) => {
    const json = JSON.parse(fs.readFileSync(path.join(PROJECT_ROOT, area, 'package.json'), 'utf8'));
    json.name = `${ctx.slug}-${suffix}`;
    return `${JSON.stringify(json, null, 2)}\n`;
  };

  add('server/package.json', pkg('server', 'server'));
  add('client/package.json', pkg('client', 'client'));
  add('server/src/themes/index.js', themeIndex(ctx.theme));
  add('server/prisma/seed.js', seedFile(ctx));
  add('server/prisma/data/snapshot.json', JSON.stringify(snapshot, null, 2));
  add('server/.env', serverEnv(ctx));
  add('server/.env.example', serverEnv(ctx, { example: true }));
  add('server/Dockerfile', serverDockerfile());
  add('server/.dockerignore', dockerignore('.env\n'));
  add('server/uploads/.gitkeep', '');
  add('client/.env.production', clientEnvProduction(ctx));
  add('client/.env.development', clientEnvDevelopment());
  add('client/.env.example', clientEnvProduction(ctx));
  add('client/lib/edition.js', editionFile(ctx));
  add('client/Dockerfile', clientDockerfile());
  add('client/.dockerignore', dockerignore());
  add('docker-compose.yml', compose(ctx));
  add('.env', rootEnv(ctx));
  add('.env.example', rootEnv({ ...ctx, dbPassword: 'change-me' }));
  add('ecosystem.config.js', pm2(ctx));
  add('deploy/nginx.conf', nginx(ctx));
  add('package.json', rootPackage(ctx));
  add('.gitignore', gitignore());
  add('README.md', readme(ctx));

  // Only the uploaded files this site's content actually uses.
  const uploadDir = path.join(PROJECT_ROOT, 'server', 'uploads');
  for (const file of uploads) {
    const p = path.join(uploadDir, file);
    if (fs.existsSync(p)) archive.file(p, { name: `${root}/server/uploads/${file}` });
  }

  await archive.finalize();
}

module.exports = { streamExport, buildExportContext, PROJECT_ROOT };
