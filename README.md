# Themewright

A modern, fully customizable content management system inspired by Botble CMS.

- **Backend:** Express 4, Prisma ORM, PostgreSQL 16, JWT auth, role-based permissions
- **Frontend:** Next.js 14 (App Router), Tailwind CSS, TipTap editor, Recharts

## Features

| Area | What you get |
| --- | --- |
| **Visual page builder** | 18 block types (hero, features, pricing, testimonials, FAQ, gallery, video, latest posts, contact form, newsletter, custom HTMLâ€¦). Drag-and-drop layers, per-block style options (background, padding, width, alignment, animation, anchor, hide), live iframe preview with desktop/tablet/mobile, undo/redo, page templates |
| **Theme customizer** | 6 presets, light + dark palettes, 22 Google fonts, radius, container width, header style (glass/solid/centered), footer style, announcement bar, blog layout â€” previewed live before publishing |
| **Blog** | Posts with rich text editor, cover image, categories (nested, colored), tags, featured flag, scheduled publishing, reading time, views, SEO + Google preview, bulk actions, duplicate |
| **Media library** | Drag-and-drop uploads, folders, grid/list views, alt text, picker used across the admin |
| **Menus** | Multiple menus by location (`header`, `footer`, `footer-2`), nested dropdowns |
| **Engagement** | Contact inbox (unread/read/replied) and newsletter subscribers, both with CSV export, testimonials, FAQs |
| **System** | Users, roles with granular permissions, activity log, settings (general, SEO, social, contact, custom CSS/scripts, maintenance mode) |
| **News portals** | Breaking ticker, headline layouts (lead + list, center lead, mosaic), category sections (4 layouts), multi-category columns, latest + most-read sidebar, kicker/strapline and "breaking" flag on posts, Bangla fonts and a Bangla news preset |
| **Video platforms** | Video posts (YouTube/Vimeo links or uploaded MP4), YouTube-style watch page (up next, likes, share), video grid with category chips, featured player |
| **Streaming** | Shows with seasons/episodes, billboard hero, Top 10 row, poster/landscape rows, show page with season tabs, playlists |
| **Audio / podcasts** | Audio posts and podcast series, persistent mini-player that keeps playing across pages (queue, Â±15s, speed), episode playlists |
| **Admin UX** | âŒ˜K command palette, dark mode, collapsible sidebar, Ctrl+S to save, unsaved-changes warnings |
| **SEO** | Per-page/post meta, Open Graph, structured data (BlogPosting / NewsArticle / VideoObject / Episode / PodcastEpisode / TVSeries / PodcastSeries), `sitemap.xml`, `robots.txt`, RSS feeds |
| **Content safety** | **Trash** for posts and pages (restore as draft, auto-purged after 30 days, undo on delete) and **revision history** â€” every save is kept (latest 30), compare with the saved version and restore in one click |
| **Redirects & 404 monitor** | 301/302/307/308 redirects with hit counts, `/old/*` wildcard rules, automatic 301 when a published post or page changes its URL, and a log of missing addresses visitors hit (one click to redirect them) |
| **Backup & restore** | One-click backups of all content, settings, media records, subscribers, messages, redirects and every theme's workspace; download, upload, restore (a safety copy is taken first). Users and passwords are never touched |
| **Email** | SMTP set-up in Settings → Email (presets for Gmail, Outlook, Zoho, cPanel, Brevo; test button). Notifies you about messages, bookings, comments and subscribers, sends visitors an automatic confirmation, and lets you reply from Messages. Failures never block a visitor and are written to the activity log |
| **Bookings** | Appointment, reservation, consultation, valuation and donation forms save structured details (date, time, guests, amount…) into Messages → Bookings; confirm or decline with ready-made emails. Listing cards and search/donate buttons pass their context to the contact form |
| **Client essentials** | Floating WhatsApp / call button, cookie consent banner (analytics, Tag Manager and Meta Pixel load only after Accept), Google Search Console & Bing verification, spam honeypot on every public form, and business structured data typed by theme (Restaurant, MedicalClinic, LegalService, Hotel, RealEstateAgent…) |
| **Multilingual + AI translation** | Settings → Languages: pick languages (24 presets incl. বাংলা, हिन्दी, العربية with RTL). Every page gets a language address (/bn/about), a header switcher, hreflang tags and sitemap alternates. Admin → Translations shows progress per language for pages (text inside every block), posts, menus, categories, tags, series, FAQs, testimonials, site text and interface labels; edit side by side or click **AI translate** (Claude — key in settings or ANTHROPIC_API_KEY). Changed originals are flagged as outdated; untranslated text falls back to the original |
| **Feeds** | `/feed.xml` (filter with `?category=` or `?tag=`), and `/series/:slug/feed.xml` per series â€” podcasts get iTunes tags for Apple Podcasts / Spotify |

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

Admin panel: <http://localhost:3000/admin> â€” demo accounts (password `admin123`):

| Email | Role |
| --- | --- |
| admin@novacms.dev | Super Admin |
| editor@novacms.dev | Editor |
| author@novacms.dev | Author |

`npm run db:seed` in `server/` resets the database to the demo content.

## Themes

The site is one kind of website at a time, chosen under **Admin â†’ Appearance â†’ Themes**:

| Theme | Kind of site | Header / layout | Content formats |
| --- | --- | --- | --- |
| **Themewright** (default) | Business & blog | Glass header, landing page, card blog | Articles, galleries |
| **Herald** | News portal | Newspaper masthead + section nav, breaking ticker, newspaper article page | Articles, galleries, videos |
| **Vidora** | Video sharing | Search-first header + sidebar, recommended grid, playlists | Videos, playlists |
| **Marquee** | Streaming service | Dark cinematic header, billboard, Top 10, poster rows | Videos, shows with seasons |
| **Waveform** | Podcast network | Warm header, show artwork grid, persistent player | Audio, podcasts |
| **Saffron** | Restaurant & cafÃ© | Transparent split header over a full-screen food slideshow, tabbed menu with prices, table reservations, live â€œopen nowâ€ hours | Articles, galleries |
| **Pulse** | SaaS & startup | Mouse-reactive aurora hero with a 3D dashboard mockup, bento features with spotlight hover, count-up stats, monthly/yearly pricing toggle | Articles |
| **Lens** | Photography & studio | Minimal editorial header + full-screen mobile menu, Ken Burns slideshow, giant scrolling type, filterable masonry gallery with lightbox | Articles, galleries |
| **Folio** | Personal portfolio | Floating pill nav, one-page sections: profile hero, about, skills, timeline, projects, contact | Articles (optional) |

| **Atlas** | Consulting & finance | Corporate header (contact top bar), framed split hero, overlapping trust bar, sticky stacking case studies | Articles |
| **Haven** | Real estate | Floating pill header, full-screen search hero with Buy/Rent tabs, filterable property cards, valuation booking | Articles |
| **Forge** | Gym & fitness | Bold athletic header + full-screen menu, slideshow hero, class timetable, coaches, membership pricing | Articles |
| **Vitalis** | Medical clinic | Corporate header, arch-image hero, department tiles, doctors, appointment booking, opening hours | Articles |
| **Sterling** | Law firm | Centered classic header, serif slideshow, numbered practice-area rows, notable results, consultation form | Articles |
| **Kinetic** | Creative agency | Fixed sidebar navigation, kinetic-type hero with rotating words, stacking case studies, statement footer | Articles, galleries |
| **Wanderly** | Travel & tours | Transparent split header, trip search hero, destination carousel, bookable tour cards, itinerary | Articles, galleries |
| **Scholar** | Online academy | Collage hero, filterable course catalogue, learning tabs, instructors, cohort countdown | Articles |
| **Aurelia** | Hotel & spa | Luxe design language: framed hero, room cards with nightly rates, spa & dining, reservation request | Articles, galleries |
| **Evergreen** | Nonprofit | Slideshow hero, donation widget (live goal, impact per amount, monthly), programmes, events calendar | Articles, galleries |

**Client-ready business themes.** The last ten themes above are complete, independent client sites (own demo content, pages, menus, sections and page designs). They add four header layouts (`corporate`, `floating`, `bold`, `sidebar`), a *Statement* footer (`footerStyle: 'big'`) and a **Business** block category: split hero, search hero, kinetic-type hero, trust bar, service cards, listings (properties/rooms/tours/courses), case studies, schedule, donation, appointment booking and CTA banner.

**Luxe versions.** Themewright, Herald, Vidora, Marquee, Waveform and Folio each have a *Luxe* version â€” the same theme and the same content with a different design language: a framed full-screen hero, luxe header with a full-screen numbered menu, serif typography, gold hairlines, magazine article and archive layouts, and luxury blocks (statement, framed split, editorial list with cursor-following images, magazine feature, quote carousel, parallax CTA). Switching Classic â†” Luxe never touches content; each version remembers its own customised design.

**Homepage demos.** Herald, Vidora, Marquee, Folio and Forge each come with 10 extra homepage demos â€” client-ready designs with their own header style, colours, fonts and homepage built from different blocks. All of them share the theme's content (posts, series, pages), so switching demos never touches content. Pick a demo from the theme card's **Design** dropdown on the Themes page.

| Theme | Demos |
|---|---|
| **Herald** | Daily, Broadsheet, Tech, Business, Sports, Culture, City, Live, Reader, Investigations |
| **Vidora** | Creators, Toons, Festival, Academy, Neon, Newsroom, Gallery, Shorts, Studio, Live, **Porda** |
| **Marquee** | Prime, Kids, Docs, Anime, Premiere, Binge, Indie, Landing, Noir, Family |
| **Folio** | Minimal, Terminal, Studio, Corporate, Swiss, Freelancer, Neon, Brutal, Story, Gazette, **Glow**, **Bento**, **Loop** |
| **Forge** | Zen, Box, Fight, Coach, Club, Her, Run, App, Dojo, Chain |

**Porda** (Vidora) is a Bengali OTT streaming demo â€” Bengali fonts and menus, top-10 row, series rails, à§³ subscription plans. It is the one demo that brings its own content: *Install demo & activate* adds Bengali series, episodes, categories and FAQs (this replaces the Vidora family's content, so the other Vidora versions will show it too).

**Every theme keeps its own content.** Content (posts, pages, series, menus, settings) is stored per theme family in a workspace. Switching themes saves the current theme's content and restores the other theme's, so nothing is ever lost. Users, media, messages and subscribers are shared. Seed all themes at once with `node prisma/seed.js nova --all`.

Activating a theme can (each optional): apply its design, create its homepage/pages and menus, and **import its demo content** (replaces posts, pages, series, categories, menus, FAQs and testimonials; keeps users, media, messages and subscribers). The admin then shows only that theme's formats and blocks (with "show all" escape hatches). Themes can be previewed live before activating.

Seed straight into a theme: `node prisma/seed.js herald` (or `nova`, `vidora`, `marquee`, `waveform`, `folio`, `saffron`, `pulse`, `lens`, `atlas`, `haven`, `forge`, `vitalis`, `sterling`, `kinetic`, `wanderly`, `scholar`, `aurelia`, `evergreen`).

Themes live in `server/src/themes/*.js` â€” copy one to create your own (layout keys: `header` = `default | masthead | video | streaming | portfolio | overlay | minimal | luxe | corporate | floating | bold | sidebar`, `article` = `blog | news`, `listing` = `cards | news | video | audio`).

### Theme sections & page designs

Every theme (and each Luxe version) ships a library of **designed sections**: ready-made, theme-specific sections with their own content, imagery and styling (e.g. Herald: columnists, election countdown, editorial standards; Marquee: coming-soon countdown, cast & crew, plan comparison; Waveform: latest episode, hosts, sponsorship packages). In the page builder open the **Sections** tab and click (or drag) a section in, then edit it like any block. Use the dropdown to browse other themes' sections. **New page** also offers complete page designs built from the active theme's sections.

They are built on twelve interactive blocks (category *Interactive*): team, process steps, feature tabs, comparison table, before/after slider, accordion + image, logo wall, video lightbox, card carousel, careers/jobs, countdown and episode spotlight. Each has several design variants.

Sections are defined in `client/lib/sections.js` (`THEME_SECTIONS`, `THEME_PAGE_DESIGNS`) â€” the business themes' sections live in `client/lib/businessSections.js` â€” so adding one means adding an entry there.

### Menus: 3 levels, mega menus, drag & drop

In **Admin â†’ Menus**, drag an item by its handle to reorder it, and drag it left or right to change its level. A menu can be up to three levels deep, and sub-items move with their parent. You can also drag pages, categories and custom links in from the left panel, or click + to add them. Each item can have a description, icon and badge (for example *New*). These show in dropdowns and mega menus.

- **Dropdowns**: level 2 opens below the top item, and level 3 opens to the side.
- **Mega menu**: switch it on for a top-level item. Its level-2 items become columns (use `#` as the URL for a plain heading), level-3 items become the links inside them, and an optional promo image shows as a feature card.
- **Mobile**: menus become a three-level accordion.

This works in every theme's header. The Themewright and Herald default menus include examples, which are applied when you set up the theme or import its demo.

### Reader engagement

Every theme gets likes, comments, sharing, saving and following. Each feature can be switched off in **Settings â†’ Engagement**.

- **Comments**: threaded replies, a spam honeypot and rate limiting. With *Hold for moderation* on, new comments wait in **Admin â†’ Comments** (the sidebar badge shows how many). There you can approve, mark as spam, edit, delete or bulk-moderate, and reply as the team; team replies get a *Team* badge. Comments can also be turned off per post in the post editor.
- **Likes**: a like/unlike toggle on articles, videos and episodes. **Share**: the phone's native share sheet, or Facebook, X, LinkedIn, WhatsApp, email and copy link.
- **Save for later**: called *Reading list*, *Saved stories*, *Watch later*, *My List* or *Listen later* depending on the theme. It's stored in the visitor's browser (no account needed) and listed at `/saved`, linked from the header.
- **Follow / subscribe** to podcasts, shows and playlists, with follower counts.
- **Reading tools**: reading progress bar and Aâˆ’/A+ text size on articles, plus a print button on news articles.
- **Podcast player**: resumes each episode where the listener stopped, remembers playback speed, and supports lock-screen and headphone controls.

Importing a theme's demo content also adds sample comments, likes and follower counts.

### Content formats

Each post has a **format** (Article, Video, Audio, Gallery) that picks its page layout:

| Format | URL | Layout |
| --- | --- | --- |
| Article / Gallery | `/blog/:slug` (also `/news/:slug`) | Article with table of contents; galleries show an image grid |
| Video | `/watch/:slug` | Player, likes/share, episode list or "up next" |
| Audio | `/listen/:slug` | Artwork hero, persistent player, show notes, episodes |

**Shows & podcasts** (admin â†’ Shows & podcasts) group posts into a *show* (seasons + episodes), *playlist* or *podcast*, each with a page at `/series/:slug`. Every news/video/audio block has its own data source settings (category, format, series, sort, count).

## Exporting a client project

This installation is the **builder**: pick a theme, prepare the client's content, then go to **Admin â†’ System â†’ Export project**. You get a ZIP of a standalone, production-ready project:

- full source code locked to the active theme (other themes removed, theme switcher and exporter disabled, client branding in the admin)
- the site's content as `server/prisma/data/snapshot.json` â€” imported automatically on first start
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
  src/routes/                 auth, posts, pages, media, menus, settings, users/roles, public APIâ€¦
client/
  app/(site)/                 public website (server-rendered, themed from settings)
  app/(admin)/admin/          admin panel
  components/site/Blocks.js   renders page-builder blocks
  components/admin/           admin UI kit, page builder, editor, media library
  lib/blocks.js               block registry (defaults + field schema) â€” add new blocks here
  lib/theme.js                theme presets, fonts, CSS variable generation
```

## Extending

- **New block type:** add an entry to `client/lib/blocks.js` (defaults + fields) and a renderer in `client/components/site/Blocks.js`. The builder UI is generated from the schema.
- **New setting:** add it to `DEFAULT_SETTINGS` in `server/src/lib/settings.js`; stored values are deep-merged over defaults, so no migration is needed.
- **New permission:** add it to `server/src/lib/permissions.js` and guard routes with `authorize('key')`.

## Production notes

- Set `JWT_SECRET`, `CLIENT_URL`, `NEXT_PUBLIC_API_URL`, `API_URL` and `NEXT_PUBLIC_SITE_URL` for your domains.
- Uploaded files live in `server/uploads/` â€” mount persistent storage there.
- Rich text, custom HTML blocks and custom scripts are rendered unsanitized by design; only give `posts`/`pages`/`settings` permissions to trusted users.
# express-next-cms
