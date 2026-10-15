// Realistic reader activity for demo content: comments (with a few team replies), likes and followers.

const READERS = [
  ['Ayesha Siddiqua', 'ayesha@example.com'], ['Rahim Uddin', 'rahim@example.com'], ['Sarah Mitchell', 'sarah.m@example.com'],
  ['Tanvir Hossain', 'tanvir@example.com'], ['Emily Carter', 'emily@example.com'], ['Nusrat Jahan', 'nusrat@example.com'],
  ['Daniel Brooks', 'daniel@example.com'], ['Farhan Kabir', 'farhan@example.com'], ['Priya Nair', 'priya@example.com'],
  ['Lucas Martin', 'lucas@example.com'], ['Mehjabin Akter', 'mehjabin@example.com'], ['James Okafor', 'james@example.com'],
];

const LINES = {
  STANDARD: [
    'This is exactly the explanation I was looking for. Bookmarked!',
    'Really well written — the examples made it click for me.',
    'Great read. Would love a follow-up that goes deeper on this.',
    'Sharing this with my team, we were debating this just last week.',
    'Clear, balanced and to the point. More of this please.',
    'I disagree slightly with the second point, but overall a solid piece.',
    'Thanks for including the sources, that makes a big difference.',
  ],
  VIDEO: [
    'The animation in this is absolutely stunning.',
    'Watched it twice already. The ending gets me every time 😄',
    'Incredible that this was made with open-source tools.',
    'The sound design deserves more credit!',
    'Saving this to show my students next week.',
    'Can you upload a behind-the-scenes version?',
  ],
  AUDIO: [
    'One of the best episodes so far. The guest was brilliant.',
    'Listened to this on my commute — had to replay the middle part.',
    'Would love a part two with the same guest!',
    'The production quality keeps getting better.',
    'This conversation changed how I think about my work.',
    'Great show notes too, thanks for the links.',
  ],
};
const REPLIES = [
  'Thank you so much — glad it was useful!',
  'Great question. We are planning a follow-up on exactly this.',
  'Thanks for listening and for the kind words 🙏',
  'Appreciate the feedback, noted for the next one!',
];

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (list) => list[rand(0, list.length - 1)];

async function seedEngagement(prisma) {
  const staff = await prisma.user.findFirst({ orderBy: { id: 'asc' }, select: { id: true, name: true, email: true } });
  const posts = await prisma.post.findMany({ where: { status: 'PUBLISHED' }, orderBy: { publishedAt: 'desc' }, take: 14, select: { id: true, format: true, likes: true, publishedAt: true } });
  for (const [i, post] of posts.entries()) {
    if (!post.likes) await prisma.post.update({ where: { id: post.id }, data: { likes: rand(12, 900) } });
    const lines = LINES[post.format] || LINES.STANDARD;
    const count = i < 4 ? rand(3, 5) : rand(0, 3);
    const start = (post.publishedAt || new Date()).getTime();
    for (let n = 0; n < count; n += 1) {
      const [name, email] = pick(READERS);
      const createdAt = new Date(Math.min(Date.now(), start + rand(1, 72) * 3600 * 1000));
      const comment = await prisma.comment.create({
        data: { postId: post.id, name, email, content: pick(lines), status: 'APPROVED', likes: rand(0, 40), createdAt },
      });
      if (staff && Math.random() < 0.3) {
        await prisma.comment.create({
          data: { postId: post.id, parentId: comment.id, userId: staff.id, name: staff.name, email: staff.email, content: pick(REPLIES), status: 'APPROVED', likes: rand(0, 12), createdAt: new Date(createdAt.getTime() + 3 * 3600 * 1000) },
        });
      }
    }
  }
  // A couple waiting for moderation so the admin queue has something in it.
  for (const post of posts.slice(0, 2)) {
    const [name, email] = pick(READERS);
    await prisma.comment.create({ data: { postId: post.id, name, email, content: pick(LINES[post.format] || LINES.STANDARD), status: 'PENDING' } });
  }
  const series = await prisma.series.findMany({ select: { id: true } });
  for (const s of series) await prisma.series.update({ where: { id: s.id }, data: { subscribers: rand(240, 58000) } });
}

module.exports = { seedEngagement };
