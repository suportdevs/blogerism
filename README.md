# Themewright

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
| **Themewright** (default) | Business & blog | Glass header, landing page, card blog | Articles, galleries |
| **Herald** | News portal | Newspaper masthead + section nav, breaking ticker, newspaper article page | Articles, galleries, videos |
| **Vidora** | Video sharing | Search-first header + sidebar, recommended grid, playlists | Videos, playlists |
| **Marquee** | Streaming service | Dark cinematic header, billboard, Top 10, poster rows | Videos, shows with seasons |
| **Waveform** | Podcast network | Warm header, show artwork grid, persistent player | Audio, podcasts |
| **Saffron** | Restaurant & café | Transparent split header over a full-screen food slideshow, tabbed menu with prices, table reservations, live “open now” hours | Articles, galleries |
| **Pulse** | SaaS & startup | Mouse-reactive aurora hero with a 3D dashboard mockup, bento features with spotlight hover, count-up stats, monthly/yearly pricing toggle | Articles |
| **Lens** | Photography & studio | Minimal editorial header + full-screen mobile menu, Ken Burns slideshow, giant scrolling type, filterable masonry gallery with lightbox | Articles, galleries |
| **Folio** | Personal portfolio | Floating pill nav, one-page sections: profile hero, about, skills, timeline, projects, contact | Articles (optional) |

**Luxe versions.** Themewright, Herald, Vidora, Marquee, Waveform and Folio each have a *Luxe* version — the same theme and the same content with a different design language: a framed full-screen hero, luxe header with a full-screen numbered menu, serif typography, gold hairlines, magazine article and archive layouts, and luxury blocks (statement, framed split, editorial list with cursor-following images, magazine feature, quote carousel, parallax CTA). Switching Classic ↔ Luxe never touches content; each version remembers its own customised design.

**Every theme keeps its own content.** Content (posts, pages, series, menus, settings) is stored per theme family in a workspace. Switching themes saves the current theme's content and restores the other theme's, so nothing is ever lost. Users, media, messages and subscribers are shared. Seed all themes at once with `node prisma/seed.js nova --all`.

Activating a theme can (each optional): apply its design, create its homepage/pages and menus, and **import its demo content** (replaces posts, pages, series, categories, menus, FAQs and testimonials; keeps users, media, messages and subscribers). The admin then shows only that theme's formats and blocks (with "show all" escape hatches). Themes can be previewed live before activating.

Seed straight into a theme: `node prisma/seed.js herald` (or `nova`, `vidora`, `marquee`, `waveform`, `folio`, `saffron`, `pulse`, `lens`).

Themes live in `server/src/themes/*.js` — copy one to create your own (layout keys: `header` = `default | masthead | video | streaming | portfolio | overlay | minimal`, `article` = `blog | news`, `listing` = `cards | news | video | audio`).

### Theme sections & page designs

Every theme (and each Luxe version) ships a library of **designed sections**: ready-made, theme-specific sections with their own content, imagery and styling (e.g. Herald: columnists, election countdown, editorial standards; Marquee: coming-soon countdown, cast & crew, plan comparison; Waveform: latest episode, hosts, sponsorship packages). In the page builder open the **Sections** tab and click (or drag) a section in, then edit it like any block. Use the dropdown to browse other themes' sections. **New page** also offers complete page designs built from the active theme's sections.

They are built on twelve interactive blocks (category *Interactive*): team, process steps, feature tabs, comparison table, before/after slider, accordion + image, logo wall, video lightbox, card carousel, careers/jobs, countdown and episode spotlight. Each has several design variants.

Sections are defined in `client/lib/sections.js` (`THEME_SECTIONS`, `THEME_PAGE_DESIGNS`), so adding one means adding an entry there.

### Menus: 3 levels, mega menus, drag & drop

In **Admin → Menus**, drag an item by its handle to reorder it, and drag it left or right to change its level. A menu can be up to three levels deep, and sub-items move with their parent. You can also drag pages, categories and custom links in from the left panel, or click + to add them. Each item can have a description, icon and badge (for example *New*). These show in dropdowns and mega menus.

- **Dropdowns**: level 2 opens below the top item, and level 3 opens to the side.
- **Mega menu**: switch it on for a top-level item. Its level-2 items become columns (use `#` as the URL for a plain heading), level-3 items become the links inside them, and an optional promo image shows as a feature card.
- **Mobile**: menus become a three-level accordion.

This works in every theme's header. The Themewright and Herald default menus include examples, which are applied when you set up the theme or import its demo.

### Reader engagement

Every theme gets likes, comments, sharing, saving and following. Each feature can be switched off in **Settings → Engagement**.

- **Comments**: threaded replies, a spam honeypot and rate limiting. With *Hold for moderation* on, new comments wait in **Admin → Comments** (the sidebar badge shows how many). There you can approve, mark as spam, edit, delete or bulk-moderate, and reply as the team; team replies get a *Team* badge. Comments can also be turned off per post in the post editor.
- **Likes**: a like/unlike toggle on articles, videos and episodes. **Share**: the phone's native share sheet, or Facebook, X, LinkedIn, WhatsApp, email and copy link.
- **Save for later**: called *Reading list*, *Saved stories*, *Watch later*, *My List* or *Listen later* depending on the theme. It's stored in the visitor's browser (no account needed) and listed at `/saved`, linked from the header.
- **Follow / subscribe** to podcasts, shows and playlists, with follower counts.
- **Reading tools**: reading progress bar and A−/A+ text size on articles, plus a print button on news articles.
- **Podcast player**: resumes each episode where the listener stopped, remembers playback speed, and supports lock-screen and headphone controls.

Importing a theme's demo content also adds sample comments, likes and follower counts.

### Content formats

Each post has a **format** (Article, Video, Audio, Gallery) that picks its page layout:

| Format | URL | Layout |
| --- | --- | --- |
| Article / Gallery | `/blog/:slug` (also `/news/:slug`) | Article with table of contents; galleries show an image grid |
| Video | `/watch/:slug` | Player, likes/share, episode list or "up next" |
| Audio | `/listen/:slug` | Artwork hero, persistent player, show notes, episodes |

**Shows & podcasts** (admin → Shows & podcasts) group posts into a *show* (seasons + episodes), *playlist* or *podcast*, each with a page at `/series/:slug`. Every news/video/audio block has its own data source settings (category, format, series, sort, count).

## Exporting a client project

This installation is the **builder**: pick a theme, prepare the client's content, then go to **Admin → System → Export project**. You get a ZIP of a standalone, production-ready project:

- full source code locked to the active theme (other themes removed, theme switcher and exporter disabled, client branding in the admin)
- the site's content as `server/prisma/data/snapshot.json` — imported automatically on first start
- only the uploaded media the content uses
- `docker-compose.yml` (PostgreSQL + API + website), Dockerfiles, PM2 `ecosystem.config.js`, `deploy/nginx.conf`
- `.env` files with fresh secrets, the client's URLs and admin account, plus a README for the client

The client runs `docker compose up -d --build` (or follows the VPS steps in its README) and can modify the code freely. Passwords are never exported; team members are optional.

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
