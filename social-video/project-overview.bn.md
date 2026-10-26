# Themewright — বিস্তারিত project walkthrough

এই বিশ্লেষণ repository source থেকে। App চালিয়ে end-to-end যাচাই হয়নি। প্রকৃত নির্মাতার ব্যক্তিগত উদ্দেশ্য জানা নেই; reusable client builder-এর উদ্দেশ্য architecture ও export workflow থেকে বোঝা যায়।

## উদ্দেশ্য
প্রতিটি client website-এর জন্য editor, content management, media, permissions ও delivery packaging বারবার না বানিয়ে reusable foundation থেকে বিভিন্ন site তৈরি। Content team admin থেকে কাজ করবে; client source-সহ standalone project পাবে।

## Frontend
Next.js 14.2.35, React 18.3.1, JavaScript, Tailwind CSS 3.4.17। client/app/(site) public website; client/app/(admin) admin dashboard।
TipTap editor, Recharts charts, Lucide icons, Sonner notifications।
PageBuilder: schema-defined blocks, drag/drop, style controls, undo/redo, section templates, desktop/tablet/mobile preview।
Public server components data fetch করে; interactive widgets client components।
client/lib/server.js server fetch; client/lib/api.js admin/browser request ও cache invalidation। Admin JWT localStorage-এ থাকে।

## Backend/database
Node.js, Express 4.21.1 REST API; Prisma 5.22.0; PostgreSQL 16। এটি MongoDB-based MERN নয়।
JWT authentication, bcrypt hashing, module-level role permissions, Zod validation, Helmet headers, CORS, login/public form rate limits।
Models: User, Role, Post, Series, Category, Tag, Page, Media, Menu, settings, messages, subscribers, comments, revisions, translations, redirects ও theme workspaces।
Multer local uploads: server/uploads; 20MB limit, MIME filters। Nodemailer SMTP; optional Anthropic translation integration।

## পুরো workflow
1. Docker Compose দিয়ে PostgreSQL; dependencies install; Prisma generate; setup-এ schema push ও demo seed।
2. API localhost:4000, Next.js localhost:3000; admin /admin।
3. Login -> password check -> JWT -> authenticated admin request -> permission check।
4. Theme নির্বাচন, optional demo import, pages/blocks, menus, media ও settings configure।
5. Save -> Express authorization/validation -> Prisma -> PostgreSQL।
6. Browser /api/revalidate call করে; Next.js route API দিয়ে token verify করে layout cache revalidate করে।
7. Public server components /api/public থেকে content নিয়ে render করে; route অনুযায়ী fetch revalidation cache আছে।
8. Public API published ও due scheduled posts দেখায়।
9. Visitors messages, booking requests, newsletter ও enabled engagement features ব্যবহার করে।
10. Revisions, trash, redirects/404 monitor, logs ও backups দিয়ে maintenance।
11. Export -> active theme-locked source + snapshot + used media + generated Docker/PM2/Nginx config -> standalone ZIP।

## ব্যবহার ও theme workspaces
Business, restaurant, clinic, agency, law, real estate, gym, travel, academy, hotel, nonprofit, portfolio, news, video/show ও podcast sites।
Formats: articles, gallery, video, audio; series: shows/seasons/episodes, playlists, podcasts।
Switch-এ outgoing theme family content save ও incoming family restore। Variants একই family content share করতে পারে। Users/roles/media/messages/subscribers shared। একসঙ্গে বহু independent client site serve করা multi-tenant SaaS প্রমাণিত নয়।
Bookings inquiry/confirmation flow; course listing বা donation block মানেই পূর্ণ LMS বা payment processing নয়।

## SEO/ভাষা
Metadata, Open Graph, structured data, sitemap, robots, RSS। Language-prefixed pages, hreflang ও translations। Claude-এর জন্য valid API key এবং usable model config প্রয়োজন। Live translation test হয়নি।

## সীমাবদ্ধতা
JSON backup-এ media records থাকে; binary uploads আলাদা backup চাই।
Root docker-compose.yml কেবল database চালায়; exporter-generated compose আলাদা।
Custom HTML/scripts trusted editors-এর জন্য। Production deployment/security audit হয়নি। Performance, users, revenue বা conversion-এর অযাচাইকৃত দাবি করা হয়নি।

## যাচাই করা sources
package.json; client/package.json; server/package.json; README.md; docker-compose.yml; server/prisma/schema.prisma; server/src/index.js; routes/auth.js, pages.js, public.js, themes.js, media.js; middleware/auth.js; lib/permissions.js, workspace.js, exporter.js, backup.js, translator.js; themes/index.js; client/components/admin/PageBuilder.js; client/lib/api.js, server.js; client/app/api/revalidate/route.js; client/app/(site)/page.js।

## Video
1080x1350 4:5 MP4, 30fps, H.264 + AAC; English synthetic narration ও readable English scene text।
বাংলা/English SRT, cover, complete script, storyboard ও renderer included।
Illustrated code-based explanation; live app screen recording নয়।

