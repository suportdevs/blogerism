## THE IDEA

Meet Themewright, a full stack content management system and website builder. Its design addresses a familiar problem: rebuilding the same content tools for every client website.

Themewright একটি full stack CMS ও website builder। প্রতিটি client website-এর জন্য একই content tools বারবার তৈরির সমস্যা সমাধানের লক্ষ্য নিয়ে এর নকশা।

## 01 / FRONTEND

The frontend uses Next.js fourteen, React eighteen, and Tailwind CSS. Visitors see server-rendered pages, while the admin dashboard manages content, media, and design, with TipTap for rich text editing.

Frontend-এ Next.js 14, React 18 ও Tailwind CSS। Public server-rendered pages এবং content, media ও design পরিচালনার admin dashboard আছে। TipTap দিয়ে rich text edit করা যায়।

## 02 / PAGE BUILDER

Choose a theme, arrange page blocks, and preview different screen sizes before publishing. Theme workspaces preserve each theme family's content when you switch designs.

Theme বেছে blocks সাজান ও বিভিন্ন screen size-এ preview করে publish করুন। Theme বদলালে প্রতিটি theme family-এর content workspace সংরক্ষিত থাকে।

## 03 / BACKEND

Node.js and Express expose REST APIs. Prisma connects to PostgreSQL. JWT authentication, hashed passwords, and role permissions control administrative access. The database is PostgreSQL, rather than MongoDB.

Node.js ও Express REST API দেয়; Prisma দিয়ে PostgreSQL-এ data রাখা হয়। JWT, hashed passwords ও role permissions admin access নিয়ন্ত্রণ করে।

## 04 / THE FULL FLOW

An editor saves content through an authenticated request. Express checks access, and Prisma writes to the database. Next.js revalidates its cache and renders website content through the public API.

Editor authenticated request দিয়ে save করেন। Express access যাচাই করে; Prisma database-এ লেখে। Next.js cache revalidate করে public API থেকে website render করে।

## 05 / USE CASES

Themes support business sites, portfolios, news portals, video libraries, and podcasts. Content formats include articles, galleries, video, and audio, with shows, playlists, and podcast series.

Business site, portfolio, news portal, video library ও podcast তৈরি করা যায়। Article, gallery, video, audio, show, playlist ও podcast series আছে।

## 06 / OPERATIONS

Operations include messages, booking requests, and newsletters. SEO includes metadata, structured data, sitemaps, and feeds. Multilingual tools offer optional Claude translation with a configured API key.

Messages, booking requests ও newsletter পরিচালনা করা যায়। SEO-তে metadata, structured data, sitemap ও feed আছে। API key configure করলে Claude translation ব্যবহার করা যায়।

## 07 / CONTENT CONTROL

Revision history, trash recovery, redirects, and activity logs support maintenance. Content backups preserve records; uploaded files need a separate backup. Team roles define who can manage each area.

Revision, trash restore, redirects ও logs maintenance-এ সহায়তা করে। Content backup-এর পাশাপাশি uploaded files আলাদা backup নিতে হয়। Team roles permissions নিয়ন্ত্রণ করে।

## 08 / CLIENT EXPORT

The standout feature is client export. Package the active theme, source code, content, and referenced media as a standalone project, including generated Docker, PM2, and Nginx deployment files.

বিশেষ feature হলো client export। Active theme, source, content ও ব্যবহৃত media-সহ standalone project পাওয়া যায়; সঙ্গে generated Docker, PM2 ও Nginx config থাকে।

## THE TAKEAWAY

Themewright combines visual editing, structured publishing, and client ownership in one reusable foundation. Build different websites without rebuilding the same management system every time.

Themewright reusable foundation-এ visual editing, structured publishing ও client ownership একসঙ্গে আনে। বারবার একই management system তৈরি না করে বিভিন্ন website বানানো যায়।


