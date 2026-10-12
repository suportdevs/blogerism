/* eslint-disable no-console */
// Usage: node prisma/seed.js [theme]   — theme: nova (default) | herald | vidora | marquee | waveform
require('dotenv').config();
const bcrypt = require('bcryptjs');
const prisma = require('../src/lib/prisma');
const { THEMES, DEFAULT_THEME } = require('../src/themes');
const { activateTheme } = require('../src/lib/themeManager');

async function main() {
  const themeId = process.argv[2] || DEFAULT_THEME;
  if (!THEMES[themeId]) throw new Error(`Unknown theme "${themeId}". Choose one of: ${Object.keys(THEMES).join(', ')}`);
  console.log(`🌱 Seeding database with the “${THEMES[themeId].name}” theme…`);

  await prisma.$transaction([
    prisma.activityLog.deleteMany(), prisma.menuItem.deleteMany(), prisma.menu.deleteMany(), prisma.post.deleteMany(), prisma.series.deleteMany(),
    prisma.category.deleteMany(), prisma.tag.deleteMany(), prisma.page.deleteMany(), prisma.media.deleteMany(),
    prisma.mediaFolder.deleteMany(), prisma.faq.deleteMany(), prisma.testimonial.deleteMany(), prisma.subscriber.deleteMany(),
    prisma.contactMessage.deleteMany(), prisma.setting.deleteMany(), prisma.user.deleteMany(), prisma.role.deleteMany(),
  ]);

  const [adminRole, editorRole, authorRole] = await Promise.all([
    prisma.role.create({ data: { name: 'Super Admin', slug: 'super-admin', description: 'Full access to everything', permissions: ['*'], isSystem: true } }),
    prisma.role.create({ data: { name: 'Editor', slug: 'editor', description: 'Manage all content, media and menus', permissions: ['posts', 'categories', 'series', 'pages', 'media', 'faqs', 'testimonials', 'menus', 'contacts', 'newsletter'] } }),
    prisma.role.create({ data: { name: 'Author', slug: 'author', description: 'Write and publish posts', permissions: ['posts', 'media'] } }),
  ]);

  const password = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({ data: { name: 'Alex Morgan', email: 'admin@novacms.dev', password, roleId: adminRole.id, bio: 'Founder & editor-in-chief.', avatar: 'https://i.pravatar.cc/200?img=12' } });
  await prisma.user.create({ data: { name: 'Priya Shah', email: 'editor@novacms.dev', password, roleId: editorRole.id, bio: 'Content lead obsessed with clear writing.', avatar: 'https://i.pravatar.cc/200?img=47' } });
  await prisma.user.create({ data: { name: 'Diego Ramos', email: 'author@novacms.dev', password, roleId: authorRole.id, bio: 'Staff writer and producer.', avatar: 'https://i.pravatar.cc/200?img=33' } });

  await activateTheme(themeId, { appearance: true, setup: true, demo: true });

  await prisma.subscriber.createMany({ data: Array.from({ length: 18 }, (_, i) => ({ email: `reader${i + 1}@example.com`, createdAt: new Date(Date.now() - i * 1.5 * 864e5) })) });
  await prisma.contactMessage.createMany({
    data: [
      { name: 'Jordan Lee', email: 'jordan@example.com', subject: 'Partnership inquiry', message: 'Hi! We would love to explore a partnership with your team. When are you available for a call?' },
      { name: 'Fatima Noor', email: 'fatima@example.com', subject: 'Feature request', message: 'Could you add support for multilingual content? It would be amazing for our use case.', status: 'READ' },
      { name: 'Tom Becker', email: 'tom@example.com', subject: 'Question', message: 'Do you accept guest contributions?', status: 'REPLIED' },
    ],
  });
  await prisma.activityLog.create({ data: { userId: admin.id, action: 'created', entity: 'System', description: `Installed Nova CMS with the ${THEMES[themeId].name} theme` } });

  console.log('✅ Done. Login: admin@novacms.dev / admin123');
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
