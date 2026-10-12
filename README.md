# Nova CMS

A modern, fully customizable content management system inspired by Botble CMS.

- **Backend:** Express 4, Prisma ORM, PostgreSQL 16, JWT auth, role-based permissions
- **Frontend:** Next.js 14 (App Router), Tailwind CSS, TipTap editor, Recharts

## Features

| Area | What you get |
| --- | --- |
| **Visual page builder** | 18 block types (hero, features, pricing, testimonials, FAQ, gallery, video, latest posts, contact form, newsletter, custom HTML…). Drag-and-drop layers, per-block style options (background, padding, width, alignment, animation, anchor, hide), live iframe preview with desktop/tablet/mobile, undo/redo, page templates |
| **Theme customizer** | 6 presets, light + dark palettes, 22 Google fonts, radius, container width, header style (glass/solid/centered), footer style, announcement bar, blog layout — previewed live before publishing |
| **Blog** | Posts with rich text editor, cover image, categories (nested, colored), tags, featured flag, scheduled publishing, reading time, views, SEO + Google preview, bulk actions, duplicate |
| **Media library** | Drag-and-drop uploads, folders, grid/list views, alt text, picker used across the admin |
| **Menus** | Multiple menus by location (`header`, `footer`, `footer-2`), nested dropdowns |
| **Engagement** | Contact inbox (unread/read/replied), newsletter subscribers with CSV export, testimonials, FAQs |
| **System** | Users, roles with granular permissions, activity log, settings (general, SEO, social, contact, custom CSS/scripts, maintenance mode) |
| **News portals** | Breaking ticker, headline layouts (lead + list, center lead, mosaic), category sections (4 layouts), multi-category columns, latest + most-read sidebar, kicker/strapline and "breaking" flag on posts, Bangla fonts and a Bangla news preset |
| **Video platforms** | Video posts (YouTube/Vimeo links or uploaded MP4), YouTube-style watch page (up next, likes, share), video grid with category chips, featured player |
| **Streaming** | Shows with seasons/episodes, billboard hero, Top 10 row, poster/landscape rows, show page with season tabs, playlists |
| **Audio / podcasts** | Audio posts and podcast series, persistent mini-player that keeps playing across pages (queue, ±15s, speed), episode playlists |
| **Admin UX** | ⌘K command palette, dark mode, collapsible sidebar, Ctrl+S to save, unsaved-changes warnings |
| **SEO** | Per-page/post meta, Open Graph, JSON-LD, `sitemap.xml`, `robots.txt` |

## Quick start

Requirements: Node 18+ and Docker (or any PostgreSQL instance).

```bash
# 1. Database (PostgreSQL on localhost:5434)
docker compose up -d

# 2. API
cd server
cp .env.example .env          # set a strong JWT_SECRET
npm install
npx prisma generate
npm run setup                 # create tables + seed demo content
npm run dev                   # http://localhost:4000

# 3. Website + admin (new terminal)
cd client
cp .env.example .env.local
npm install
npm run dev                   # http://localhost:3000
```

Admin panel: <http://localhost:3000/admin> — demo accounts (password `admin123`):

| Email | Role |
| --- | --- |
| admin@novacms.dev | Super Admin |
| editor@novacms.dev | Editor |
| author@novacms.dev | Author |

`npm run db:seed` in `server/` resets the database to the demo content.

## Themes

The site is one kind of website at a time, chosen under **Admin → Appearance → Themes**:

| Theme | Kind of site | Header / layout | Content formats |
| --- | --- | --- | --- |
| **Nova** (default) | Business & blog | Glass header, landing page, card blog | Articles, galleries |
| **Herald** | News portal | Newspaper masthead + section nav, breaking ticker, newspaper article page | Articles, galleries, videos |
| **Vidora** | Video sharing | Search-first header + sidebar, recommended grid, playlists | Videos, playlists |
| **Marquee** | Streaming service | Dark cinematic header, billboard, Top 10, poster rows | Videos, shows with seasons |
| **Waveform** | Podcast network | Warm header, show artwork grid, persistent player | Audio, podcasts |

Activating a theme can (each optional): apply its design, create its homepage/pages and menus, and **import its demo content** (replaces posts, pages, series, categories, menus, FAQs and testimonials; keeps users, media, messages and subscribers). The admin then shows only that theme's formats and blocks (with "show all" escape hatches). Themes can be previewed live before activating.

Seed straight into a theme: `node prisma/seed.js herald` (or `nova`, `vidora`, `marquee`, `waveform`).

Themes live in `server/src/themes/*.js` — copy one to create your own (layout keys: `header` = `default | masthead | video | streaming`, `article` = `blog | news`, `listing` = `cards | news | video | audio`).

### Content formats

Each post has a **format** (Article, Video, Audio, Gallery) that picks its page layout:

| Format | URL | Layout |
| --- | --- | --- |
| Article / Gallery | `/blog/:slug` (also `/news/:slug`) | Article with table of contents; galleries show an image grid |
| Video | `/watch/:slug` | Player, likes/share, episode list or "up next" |
| Audio | `/listen/:slug` | Artwork hero, persistent player, show notes, episodes |

**Shows & podcasts** (admin → Shows & podcasts) group posts into a *show* (seasons + episodes), *playlist* or *podcast*, each with a page at `/series/:slug`. Every news/video/audio block has its own data source settings (category, format, series, sort, count).

## Project structure

```
server/
  prisma/schema.prisma        data model
  prisma/seed.js              demo content
  src/index.js                app + route mounting
  src/lib/                    prisma client, settings defaults, permissions, CRUD factory
  src/routes/                 auth, posts, pages, media, menus, settings, users/roles, public API…
client/
  app/(site)/                 public website (server-rendered, themed from settings)
  app/(admin)/admin/          admin panel
  components/site/Blocks.js   renders page-builder blocks
  components/admin/           admin UI kit, page builder, editor, media library
  lib/blocks.js               block registry (defaults + field schema) — add new blocks here
  lib/theme.js                theme presets, fonts, CSS variable generation
```

## Extending

- **New block type:** add an entry to `client/lib/blocks.js` (defaults + fields) and a renderer in `client/components/site/Blocks.js`. The builder UI is generated from the schema.
- **New setting:** add it to `DEFAULT_SETTINGS` in `server/src/lib/settings.js`; stored values are deep-merged over defaults, so no migration is needed.
- **New permission:** add it to `server/src/lib/permissions.js` and guard routes with `authorize('key')`.

## Production notes

- Set `JWT_SECRET`, `CLIENT_URL`, `NEXT_PUBLIC_API_URL`, `API_URL` and `NEXT_PUBLIC_SITE_URL` for your domains.
- Uploaded files live in `server/uploads/` — mount persistent storage there.
- Rich text, custom HTML blocks and custom scripts are rendered unsanitized by design; only give `posts`/`pages`/`settings` permissions to trusted users.
# express-next-cms
