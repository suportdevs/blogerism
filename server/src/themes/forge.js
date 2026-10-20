const { B: block, m, un, face, slug, rand, seedFaqs, commonPages } = require('./helpers');

const B = (type, data, style = {}) => block(type, data, { animate: true, ...style });
const HERO = { paddingY: 'none', width: 'full', animate: false };

const P = {
  darkLifter: '1605296867304-46d5465a13f1', barbell: '1517836357463-d25dfeac3438', barbell2: '1517963879433-6ad2b056d712', bar3: '1517838277536-f5f99be501cd',
  ropes: '1599058917212-d750089bc07e', curl: '1581009146145-b5ef050c2e1e', pullup: '1541534741688-6078c6bfb5c5', womanBw: '1574680096145-d05b474e2155',
  gymDark: '1571902943202-507ec2618e8f', dumbbells: '1534438327276-14e5300c3a48', rack: '1576678927484-cc907957088c', class: '1518611012118-696072aa579a',
  yoga: '1544367567-0f2fcb009e0b', meditate: '1506126613408-eca07ce68773', runners: '1552674605-db6ffd4facb5', pushup: '1594737625785-a6cbdabd333c',
  situps: '1571019613454-1cb2f99b2d8b', muscle: '1526506118085-60ce8714f8c5', hand: '1583454110551-21f2fa2afe61', gymBright: '1540497077202-7c8a3999166f',
  weights: '1549060279-7e168fcee0c2', womanDark: '1550345332-09e3ac987658', band: '1584735935682-2f2b69dff9d2',
};

const PROGRAMS = [
  ['Dumbbell', 'Strength & power', 'Barbell-based programming that builds real, usable strength — coached in small groups.', P.barbell],
  ['Flame', 'HIIT conditioning', '45 minutes of intervals that leave you breathless and stronger every week.', P.ropes],
  ['Target', 'Boxing & combat', 'Pad work, footwork and fitness — no experience required, gloves provided.', P.weights],
  ['Leaf', 'Yoga & mobility', 'Move better, recover faster and stay injury-free with flow and mobility classes.', P.yoga],
  ['Medal', 'Personal training', 'One-to-one coaching with a plan built entirely around your goals.', P.curl],
  ['Waves', 'Recovery lab', 'Sauna, ice baths and compression — the other half of training.', P.meditate],
];

const S = (time, title, host, location, tag = '') => ({ time, title, host, location, tag });
const DAYS = [
  { label: 'Monday', sessions: [S('06:30', 'Strength Foundations', 'Coach Marcus', '60 min · Rack zone', 'All levels'), S('12:15', 'Lunch HIIT', 'Coach Ava', '45 min · Studio 1', 'Popular'), S('18:00', 'Boxing Fundamentals', 'Coach Dre', '60 min · Ring'), S('19:30', 'Power Yoga', 'Coach Lena', '60 min · Studio 2')] },
  { label: 'Tuesday', sessions: [S('06:30', 'Engine Builder', 'Coach Ava', '45 min · Studio 1', 'Cardio'), S('17:30', 'Olympic Lifting', 'Coach Marcus', '75 min · Platforms', 'Advanced'), S('19:00', 'Mobility & Stretch', 'Coach Lena', '45 min · Studio 2')] },
  { label: 'Wednesday', sessions: [S('06:30', 'Strength Foundations', 'Coach Marcus', '60 min · Rack zone'), S('12:15', 'Core Blast', 'Coach Ava', '30 min · Studio 1', 'New'), S('18:00', 'Fight Club', 'Coach Dre', '60 min · Ring', 'Popular'), S('19:30', 'Yin Yoga', 'Coach Lena', '60 min · Studio 2')] },
  { label: 'Thursday', sessions: [S('06:30', 'Engine Builder', 'Coach Ava', '45 min · Studio 1'), S('17:30', 'Powerlifting Club', 'Coach Marcus', '90 min · Rack zone', 'Advanced'), S('19:00', 'Boxing Conditioning', 'Coach Dre', '45 min · Ring')] },
  { label: 'Friday', sessions: [S('06:30', 'Friday Burner', 'Coach Ava', '45 min · Studio 1', 'Popular'), S('12:15', 'Strength Express', 'Coach Marcus', '30 min · Rack zone'), S('18:00', 'Sauna & Stretch', 'Coach Lena', '45 min · Recovery lab')] },
  { label: 'Saturday', sessions: [S('08:00', 'Team WOD', 'All coaches', '60 min · Main floor', 'Community'), S('09:30', 'Open Gym', '', '3 hours · Everywhere'), S('11:00', 'Slow Flow Yoga', 'Coach Lena', '60 min · Studio 2')] },
];

const COACHES = [
  { name: 'Marcus Steele', role: 'Head of Strength', image: face('m3'), bio: 'Former national-level powerlifter. 12 years coaching barbell strength.', linkedin: '', twitter: '#', email: '' },
  { name: 'Ava Rodriguez', role: 'Conditioning Coach', image: face('w3'), bio: 'Marathoner and HIIT specialist who makes cardio genuinely fun.', linkedin: '', twitter: '#', email: '' },
  { name: 'Andre “Dre” Wallace', role: 'Boxing Coach', image: face('m2'), bio: 'Former amateur boxing champion. Teaches technique first, sweat second.', linkedin: '', twitter: '#', email: '' },
  { name: 'Lena Hart', role: 'Yoga & Mobility', image: face('w1'), bio: '500-hour certified yoga teacher and movement coach.', linkedin: '', twitter: '#', email: '' },
];

const POSTS = [
  ['Training', 'The beginner’s guide to lifting your first barbell', 'Five lifts, three sessions a week, one simple plan to get started safely.', P.bar3],
  ['Nutrition', 'How much protein do you actually need?', 'Our coaches cut through the noise with simple, science-backed numbers.', P.hand],
  ['Recovery', 'Ice bath or sauna? What the research says', 'Both work — but for different things. Here is how to use them.', P.meditate],
  ['Training', 'Why your conditioning is holding back your strength', 'A stronger engine means better lifts. Here is the plan.', P.runners],
  ['Community', 'Meet the members: 12 months of Forge transformations', 'Real people, real results, real stories from our floor.', P.class],
];

const body = (t) => `<p>${t}. Our coaches put this guide together from years of working with members of every level.</p><h2>The short version</h2><ul><li>Consistency beats intensity — show up three times a week.</li><li>Learn the movement before you load it.</li><li>Sleep, eat and recover like it matters, because it does.</li></ul><blockquote><p>“Strong is a skill. Like any skill, it is built one rep at a time.”</p></blockquote><h2>Train with us</h2><p>Your first week at Forge is free — <a href="/membership">claim your pass</a> and book your first class today.</p>`;

module.exports = {
  id: 'forge',
  name: 'Forge',
  category: 'Gym & fitness',
  description: 'A high-energy gym website: bold athletic header with full-screen menu, slideshow hero, scrolling marquee, program cards, weekly class timetable, coaches and membership pricing.',
  features: { formats: ['STANDARD'], series: [], blocks: ['Headers', 'Business', 'Interactive', 'Conversion', 'Content', 'Dynamic', 'Media', 'Layout'] },
  layout: { header: 'bold', article: 'blog', listing: 'cards' },
  general: { siteName: 'Forge', tagline: 'Stronger every single week.' },
  contact: { email: 'team@forgegym.example', phone: '+1 (646) 555-0119', address: '88 Mercer Street, New York, NY 10012', workingHours: 'Mon – Fri 5:30 – 23:00 · Sat – Sun 7:00 – 20:00' },
  social: { instagram: 'https://instagram.com', youtube: 'https://youtube.com', facebook: 'https://facebook.com', twitter: '', linkedin: '', github: '' },
  seo: { metaTitle: 'Forge — Strength, conditioning & boxing gym', metaDescription: 'Coached strength, HIIT, boxing and yoga classes. Your first week is free.' },
  appearance: {
    preset: 'forge', primaryColor: '#ff4d1a', accentColor: '#ffb800', backgroundColor: '#f7f7f5', surfaceColor: '#ececea', textColor: '#0d0d0d',
    darkBackgroundColor: '#0a0a0a', darkSurfaceColor: '#151515', darkTextColor: '#f2f2f0', headingFont: 'Barlow Condensed', bodyFont: 'Inter',
    radius: 4, colorMode: 'dark', headerStyle: 'solid', headerSticky: true, footerStyle: 'big', containerWidth: 1280, backToTop: true, blogLayout: 'grid',
    footerText: 'No excuses. Just progress.',
    headerCta: { enabled: true, label: 'Free week', url: '/membership' },
    announcement: { enabled: false, text: '', linkLabel: '', url: '' },
  },
  menus: {
    header: {
      name: 'Main menu',
      items: [
        m('Home', '/'),
        m('Classes', '/classes', [m('Timetable', '/classes#timetable'), m('Programs', '/classes#programs'), m('Personal training', '/classes#programs')]),
        m('Membership', '/membership'),
        m('Coaches', '/about#coaches'),
        m('Blog', '/blog'),
        m('Contact', '/contact'),
      ],
    },
    footer: { name: 'Train', items: [m('Timetable', '/classes'), m('Membership', '/membership'), m('Personal training', '/classes'), m('Free week', '/membership')] },
    'footer-2': { name: 'Forge', items: [m('About', '/about'), m('Blog', '/blog'), m('FAQ', '/faq'), m('Contact', '/contact'), m('Privacy', '/privacy-policy')] },
  },
  pages: () => [
    {
      slug: 'forge-home', title: 'Home', home: true, template: 'full-width', seoTitle: 'Forge — Strength, conditioning & boxing gym',
      blocks: [
        B('heroSlideshow', { height: 'full', align: 'left', interval: 6, slides: [
          { image: un(P.darkLifter, 2200), eyebrow: 'Strength · Conditioning · Boxing', title: 'No limits. Just results.', subtitle: 'Coached classes and serious equipment for people who want to get properly strong.', buttonLabel: 'Claim your free week', buttonUrl: '/membership' },
          { image: un(P.ropes, 2200), eyebrow: '60+ classes every week', title: 'Train hard. Train together.', subtitle: 'HIIT, boxing, lifting and yoga — led by coaches who know your name.', buttonLabel: 'See the timetable', buttonUrl: '/classes' },
          { image: un(P.pullup, 2200), eyebrow: 'Personal training', title: 'Your goals. Our plan.', subtitle: 'One-to-one coaching built entirely around you.', buttonLabel: 'Meet the coaches', buttonUrl: '/about#coaches' },
        ] }, HERO),
        B('textMarquee', { items: ['Strength', 'Conditioning', 'Boxing', 'Yoga', 'HIIT', 'Recovery'], speed: 30, twoRows: true }, { background: 'dark', paddingY: 'md', width: 'full', animate: false }),
        B('serviceCards', { eyebrow: 'Programs', title: 'Find the training that fits you', subtitle: '', variant: 'image', columns: 3, buttonLabel: 'All classes', buttonUrl: '/classes',
          items: PROGRAMS.map(([icon, title, text, img]) => ({ icon, title, text, image: un(img, 900), url: '/classes', linkLabel: 'Explore' })) }, { paddingY: 'xl', width: 'wide', anchor: 'programs' }),
        B('stats', { items: [{ value: '60+', label: 'Classes a week' }, { value: '12', label: 'Expert coaches' }, { value: '2,400+', label: 'Members' }, { value: '24/7', label: 'Member access' }] }, { background: 'surface', paddingY: 'lg' }),
        B('schedule', { eyebrow: 'Timetable', title: 'This week at Forge', subtitle: 'Book your spot in the app or at the front desk — classes are capped at 16.', buttonLabel: 'Book', buttonUrl: '/membership', hostIcon: 'Users', locationIcon: 'Clock', days: DAYS }, { paddingY: 'xl', anchor: 'timetable' }),
        B('team', { eyebrow: 'Coaches', title: 'Coached by the best', subtitle: 'Certified, experienced and obsessed with your progress.', variant: 'portrait', columns: 4, members: COACHES }, { background: 'surface', paddingY: 'xl' }),
        B('pricingToggle', {
          eyebrow: 'Membership', title: 'Pick your plan. Start this week.', subtitle: 'No joining fee. Freeze or cancel anytime.', currency: '$', yearlyNote: '2 months free',
          plans: [
            { name: 'Open Gym', description: 'Full access to the floor & equipment', monthly: '59', yearly: '49', features: ['24/7 gym access', 'Locker & showers', 'Free induction', 'Member app'], buttonLabel: 'Start free week', buttonUrl: '/contact', highlighted: false },
            { name: 'Unlimited', description: 'Every class, every week', monthly: '129', yearly: '107', features: ['Everything in Open Gym', 'Unlimited classes', 'Recovery lab access', '1 PT session / month'], buttonLabel: 'Start free week', buttonUrl: '/contact', highlighted: true },
            { name: 'Elite PT', description: 'One-to-one coaching', monthly: '349', yearly: '290', features: ['Everything in Unlimited', '8 PT sessions / month', 'Nutrition plan', 'Body composition scans'], buttonLabel: 'Book a consult', buttonUrl: '/contact', highlighted: false },
          ],
        }, { paddingY: 'xl', anchor: 'pricing' }),
        B('countdown', { eyebrow: 'The 30-day challenge', title: 'Summer Shred starts soon', text: 'Four weeks of coached training, nutrition and accountability. Prizes for the top transformations.', date: '2027-05-03T06:00', variant: 'image', image: un(P.gymDark, 2000), expiredText: 'The challenge is live!', buttonLabel: 'Reserve your spot', buttonUrl: '/contact' }, { paddingY: 'lg', width: 'wide' }),
        B('testimonials', { eyebrow: 'Members', title: 'Real people. Real progress.' }, { paddingY: 'xl' }),
        B('ctaBanner', { variant: 'image', image: un(P.barbell2, 1800), eyebrow: 'First week free', title: 'Your strongest year starts here', text: 'Try every class for seven days. No card, no contract, no pressure.', primaryLabel: 'Claim your free week', primaryUrl: '/membership', secondaryLabel: 'Visit the gym', secondaryUrl: '/contact', phone: '+1 (646) 555-0119' }, { paddingY: 'lg', width: 'wide' }),
      ],
    },
    {
      slug: 'classes', title: 'Classes', template: 'default', seoTitle: 'Classes & timetable — Forge',
      blocks: [
        B('heroSlideshow', { height: 'tall', align: 'left', interval: 7, slides: [{ image: un(P.class, 2000), eyebrow: 'Classes', title: '60+ classes. One timetable.', subtitle: 'Strength, conditioning, boxing and yoga for every level.', buttonLabel: 'Book your first class', buttonUrl: '#timetable' }] }, HERO),
        B('schedule', { eyebrow: 'Timetable', title: 'Weekly schedule', subtitle: '', buttonLabel: 'Book', buttonUrl: '/membership', hostIcon: 'Users', locationIcon: 'Clock', days: DAYS }, { paddingY: 'xl', anchor: 'timetable' }),
        B('serviceCards', { eyebrow: 'Programs', title: 'What we teach', subtitle: '', variant: 'icon', columns: 3, items: PROGRAMS.map(([icon, title, text]) => ({ icon, title, text, image: '', url: '/membership', linkLabel: 'Try it free' })) }, { background: 'surface', paddingY: 'xl', anchor: 'programs' }),
      ],
    },
    {
      slug: 'membership', title: 'Membership', template: 'default', seoTitle: 'Membership — Forge',
      blocks: [
        B('pageHeader', { title: 'Membership', subtitle: 'Simple plans, no joining fee, and your first week is on us.' }, { background: 'surface', paddingY: 'lg', animate: false }),
        B('comparison', { eyebrow: 'Compare plans', title: 'What is included', columns: ['Open Gym', 'Unlimited', 'Elite PT'], highlight: 2, highlightLabel: 'Most popular', groups: true, rows: [
          { group: 'Access', feature: '24/7 gym floor', values: ['yes', 'yes', 'yes'] },
          { group: 'Access', feature: 'Group classes', values: ['no', 'Unlimited', 'Unlimited'] },
          { group: 'Access', feature: 'Recovery lab', values: ['no', 'yes', 'yes'] },
          { group: 'Coaching', feature: 'Personal training', values: ['no', '1 / month', '8 / month'] },
          { group: 'Coaching', feature: 'Nutrition plan', values: ['no', 'no', 'yes'] },
          { group: 'Price', feature: 'Monthly', values: ['$59', '$129', '$349'] },
        ], buttons: [{ label: 'Join', url: '/contact' }, { label: 'Join', url: '/contact' }, { label: 'Book a consult', url: '/contact' }] }, { paddingY: 'xl' }),
        B('appointment', { requestType: 'booking', buttonLabel: 'Book my free trial', eyebrow: 'Free week', title: 'Book your free trial', text: 'Choose your first session and we will have a coach ready to welcome you.', serviceLabel: 'First session', services: ['Gym induction', 'Group class', 'Personal training consult', 'Boxing taster'], firstSlot: '06:00', lastSlot: '20:00', interval: 60, image: un(P.dumbbells, 1000), phone: '+1 (646) 555-0119', bullets: ['7 days unlimited access', 'No card, no contract', 'Free body composition scan'] }, { background: 'surface', paddingY: 'xl' }),
        B('faq', { eyebrow: 'FAQ', title: 'Good to know' }, { paddingY: 'xl' }),
      ],
    },
    {
      slug: 'about', title: 'About', template: 'default', seoTitle: 'About Forge',
      blocks: [
        B('pageHeader', { title: 'Built for people who show up', subtitle: 'Forge opened in 2016 with one rack, two coaches and a simple belief: everyone can get strong.' }, { background: 'surface', paddingY: 'lg', animate: false }),
        B('stats', { items: [{ value: '2016', label: 'Founded' }, { value: '18,000', label: 'Sq ft of training space' }, { value: '12', label: 'Coaches' }, { value: '2,400+', label: 'Members' }] }, { paddingY: 'lg' }),
        B('team', { eyebrow: 'Coaches', title: 'The team', variant: 'cards', columns: 4, members: COACHES }, { background: 'surface', paddingY: 'xl', anchor: 'coaches' }),
        B('masonryGallery', { eyebrow: 'Inside Forge', title: 'The gym', subtitle: '', columns: 3, filters: false, items: [P.gymBright, P.rack, P.womanBw, P.situps, P.dumbbells, P.pushup].map((id) => ({ src: un(id, 900), title: '', category: '', caption: '' })) }, { paddingY: 'xl', width: 'wide' }),
      ],
    },
    commonPages.privacy(),
  ],

  async demo(prisma, { authors }) {
    const cats = {};
    for (const [order, [name, color]] of [['Training', '#ff4d1a'], ['Nutrition', '#16a34a'], ['Recovery', '#0ea5e9'], ['Community', '#ffb800']].entries()) {
      cats[name] = await prisma.category.create({ data: { name, slug: slug(name), color, order } });
    }
    for (const [i, [cat, title, excerpt, img]] of POSTS.entries()) {
      const date = new Date(Date.now() - (i + 1) * 3 * 864e5);
      await prisma.post.create({
        data: {
          title, slug: slug(title), excerpt, content: body(title), coverImage: un(img, 1600), status: 'PUBLISHED', featured: i === 0,
          publishedAt: date, createdAt: date, readingTime: 4, views: rand(300, 6000), authorId: authors[i % authors.length].id,
          categories: { connect: [{ id: cats[cat].id }] },
        },
      });
    }
    await prisma.testimonial.createMany({
      data: [
        { name: 'Jasmine Park', position: 'Member since 2023', company: '', avatar: face('w4', 200), content: 'I couldn’t do a single push-up when I joined. Eighteen months later I deadlift twice my bodyweight. The coaches here genuinely care.', rating: 5, order: 0 },
        { name: 'Chris Morgan', position: 'Unlimited member', company: '', avatar: face('m7', 200), content: 'Best community I have ever trained in. Fight Club on Wednesday is the highlight of my week.', rating: 5, order: 1 },
        { name: 'Olivia Grant', position: 'Elite PT client', company: '', avatar: face('w2', 200), content: 'Lost 14kg and gained confidence I didn’t know I had. Marcus’s programming is next level.', rating: 5, order: 2 },
      ],
    });
    await seedFaqs(prisma, [
      ['Is the free week really free?', 'Yes. Seven days of unlimited access, no card and no contract.'],
      ['I am a complete beginner — is Forge for me?', 'Absolutely. Every class has scaling options and coaches will teach you every movement from scratch.'],
      ['Can I freeze my membership?', 'Yes, up to three months a year for travel, injury or anything else.'],
      ['Do you have showers and lockers?', 'Yes — plus towels, toiletries and a recovery lab with sauna and ice baths.'],
      ['How do I book classes?', 'Through the member app, online or at the front desk. Classes open for booking seven days ahead.'],
    ]);
  },
};
