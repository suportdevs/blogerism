const { B: block, m, un, face, slug, rand, seedFaqs, commonPages } = require('./helpers');

const B = (type, data, style = {}) => block(type, data, { animate: true, ...style });

const P = {
  group: '1522202176988-66273c2fd55f', headphones: '1513258496099-48168024aec0', outdoor: '1517486808906-6ca8b3f04846', classroom: '1571260899304-425eee4c7efc',
  lecture: '1524178232363-1fb2b075b655', hall: '1606761568499-6d2451b23c66', graduation: '1541339907198-e08756dedf3f', library: '1427504494785-3a9ca7044f45',
  writing: '1434030216411-0b793f4b4173', books: '1456513080510-7bf3a84b82f8', desk: '1488190211105-8b0e65b80b4e', stack: '1497633762265-9d179a990aa6',
  laptop: '1501504905252-473c47e087f8', loveLearn: '1546410531-bb4caa6b424d', apple: '1503676260728-1c00da094a0b',
  design: '1561070791-2526d30994b5', code: '1559028012-481c04fa702d', charts: '1551288049-bebda4e38f71', analytics: '1460925895917-afdab827c52f',
  wireframes: '1522542550221-31fd19575a2d', team: '1531482615713-2afd69097998', meeting: '1552664730-d307ca884978', notes: '1454165804606-c3d57bc86b40',
};

const course = (image, badge, category, title, instructor, price, rating, lessons, weeks, level) => ({
  image: un(image, 1000), badge, category, title, subtitle: instructor, price, period: '', rating, url: '/contact',
  meta: [`BookOpen: ${lessons} lessons`, `Clock: ${weeks} weeks`, `BarChart3: ${level}`],
});

const COURSES = [
  course(P.design, 'Bestseller', 'Design', 'UX & Product Design Professional', 'with Hannah Cole', '$349', '4.9', 48, 12, 'Beginner'),
  course(P.code, '', 'Development', 'Full-Stack JavaScript Bootcamp', 'with Daniel Moss', '$499', '4.8', 86, 16, 'Intermediate'),
  course(P.charts, 'New', 'Data', 'Data Analytics with Python & SQL', 'with Priya Raman', '$399', '4.9', 62, 10, 'Beginner'),
  course(P.meeting, '', 'Business', 'Product Management Essentials', 'with Michael Grant', '$299', '4.7', 36, 8, 'All levels'),
  course(P.wireframes, '', 'Design', 'Design Systems Masterclass', 'with Hannah Cole', '$249', '5.0', 28, 6, 'Advanced'),
  course(P.analytics, 'Popular', 'Data', 'Machine Learning Foundations', 'with Priya Raman', '$449', '4.8', 70, 14, 'Intermediate'),
  course(P.laptop, '', 'Development', 'React & Next.js in Production', 'with Daniel Moss', '$349', '4.9', 54, 10, 'Advanced'),
  course(P.team, '', 'Business', 'Leadership for New Managers', 'with Michael Grant', '$199', '4.7', 24, 5, 'All levels'),
];

const INSTRUCTORS = [
  { name: 'Hannah Cole', role: 'Product Design', image: face('w5'), bio: 'Led product design teams at two global marketplaces for a decade.', linkedin: '#', twitter: '#', email: '' },
  { name: 'Daniel Moss', role: 'Engineering', image: face('m7'), bio: 'Full-stack engineer and open-source maintainer.', linkedin: '#', twitter: '#', email: '' },
  { name: 'Priya Raman', role: 'Data Science', image: face('w7'), bio: 'Data scientist turned teacher with 40,000 students taught.', linkedin: '#', twitter: '', email: '' },
  { name: 'Michael Grant', role: 'Product Management', image: face('m4'), bio: 'Shipped products used by millions; now coaches new PMs.', linkedin: '#', twitter: '', email: '' },
];

const POSTS = [
  ['Careers', 'How to switch into tech at 30 (or 40, or 50)', 'Six graduates share the plan that got them hired.', P.headphones],
  ['Learning', 'The science of learning faster: spaced repetition explained', 'Why cramming fails and what to do instead.', P.writing],
  ['Design', 'Building a UX portfolio that gets interviews', 'What hiring managers actually look for — from the people who hire.', P.design],
  ['Careers', 'The 2027 tech salary guide', 'What designers, developers and analysts earn, by city and level.', P.charts],
  ['Learning', 'Learning while working full-time: a realistic weekly plan', 'Ten hours a week, three habits, zero burnout.', P.desk],
];

const body = (t) => `<p>${t}. Our instructors and career coaches wrote this guide to help you learn smarter and progress faster.</p><h2>Start here</h2><ul><li>Pick one goal and one course — focus beats variety.</li><li>Learn in short, regular sessions rather than long weekend marathons.</li><li>Build real projects you can show to employers.</li></ul><blockquote><p>“The expert in anything was once a beginner.”</p></blockquote><h2>Keep going</h2><p>Ready for the next step? <a href="/courses">Explore our courses</a> — every one includes mentor support and a certificate.</p>`;

module.exports = {
  id: 'scholar',
  name: 'Scholar',
  category: 'Education & courses',
  description: 'A modern online-academy website: collage hero with floating stats, filterable course catalogue with ratings, auto-playing learning tabs, instructors, pricing and a next-cohort countdown.',
  features: { formats: ['STANDARD'], series: [], blocks: ['Headers', 'Business', 'Interactive', 'Content', 'Conversion', 'Dynamic', 'Media', 'Layout'] },
  layout: { header: 'default', article: 'blog', listing: 'cards' },
  general: { siteName: 'Scholar', tagline: 'Learn the skills that move careers.' },
  contact: { email: 'learn@scholar.example', phone: '+1 (617) 555-0164', address: '1 Kendall Square, Cambridge, MA 02139', workingHours: 'Support: Mon – Fri, 9:00 – 21:00' },
  social: { youtube: 'https://youtube.com', linkedin: 'https://linkedin.com', instagram: 'https://instagram.com', twitter: 'https://x.com', facebook: '', github: '' },
  seo: { metaTitle: 'Scholar — Online courses that move careers', metaDescription: 'Project-based courses in design, development, data and business, taught by industry experts. Certificates included.' },
  appearance: {
    preset: 'scholar', primaryColor: '#4f46e5', accentColor: '#f59e0b', backgroundColor: '#ffffff', surfaceColor: '#f5f5ff', textColor: '#14122b',
    darkBackgroundColor: '#0a0a1a', darkSurfaceColor: '#14142b', darkTextColor: '#e8e8f7', headingFont: 'Archivo', bodyFont: 'Inter',
    radius: 16, colorMode: 'system', headerStyle: 'glass', headerSticky: true, footerStyle: 'columns', containerWidth: 1240, backToTop: true, blogLayout: 'grid',
    footerText: 'Learn anything. Go anywhere.',
    headerCta: { enabled: true, label: 'Start learning', url: '/courses' },
    announcement: { enabled: true, text: 'Spring cohort enrolment is open — save 20% until Friday.', linkLabel: 'See courses', url: '/courses' },
  },
  menus: {
    header: {
      name: 'Main menu',
      items: [
        m('Home', '/'),
        m('Courses', '/courses', [
          m('By subject', '#', [
            m('Design', '/courses', [], { icon: 'PenTool', description: 'UX, UI & design systems' }),
            m('Development', '/courses', [], { icon: 'Code2', description: 'JavaScript, React & Node' }),
            m('Data', '/courses', [], { icon: 'BarChart3', description: 'Python, SQL & machine learning' }),
            m('Business', '/courses', [], { icon: 'Briefcase', description: 'Product & leadership' }),
          ]),
          m('Programmes', '#', [
            m('Career tracks', '/courses', [], { icon: 'GraduationCap', description: 'Job-ready in 6 months', badge: 'New' }),
            m('For teams', '/contact', [], { icon: 'Users', description: 'Upskill your whole team' }),
            m('Scholarships', '/contact', [], { icon: 'Gift', description: '200 places every year' }),
          ]),
        ], { mega: true, image: un(P.group, 800), description: 'Project-based courses taught by people who do the work.' }),
        m('Instructors', '/instructors'),
        m('Pricing', '/#pricing'),
        m('Blog', '/blog'),
      ],
    },
    footer: { name: 'Learn', items: [m('All courses', '/courses'), m('Career tracks', '/courses'), m('Instructors', '/instructors'), m('Pricing', '/#pricing')] },
    'footer-2': { name: 'Scholar', items: [m('About', '/about'), m('Blog', '/blog'), m('FAQ', '/faq'), m('Contact', '/contact'), m('Privacy', '/privacy-policy')] },
  },
  pages: () => [
    {
      slug: 'scholar-home', title: 'Home', home: true, template: 'full-width', seoTitle: 'Scholar — Online courses that move careers',
      blocks: [
        B('splitHero', {
          variant: 'collage', eyebrow: 'Spring cohort now enrolling', title: 'Learn the skills', highlight: 'that move careers',
          subtitle: 'Project-based courses in design, development, data and business — taught live by people who do the work every day.',
          bullets: [], primaryLabel: 'Explore courses', primaryUrl: '/courses', secondaryLabel: 'How it works', secondaryUrl: '#how',
          image: un(P.group, 1000), image2: un(P.headphones, 700),
          badges: [{ icon: 'GraduationCap', value: '48,000+', label: 'Graduates' }, { icon: 'Star', value: '4.8/5', label: 'Average rating' }],
          proof: 'Joined by learners in 120 countries', avatars: [face('w1', 120), face('m2', 120), face('w3', 120), face('m6', 120)],
        }, { background: 'gradient', paddingY: 'xl', animate: false }),
        B('logoWall', { title: 'Our graduates work at', variant: 'marquee', speed: 30, logos: ['Lumen', 'Northwind', 'Orbit', 'Helix', 'Quanta', 'Polar', 'Vertex', 'Bluefin'].map((name) => ({ name, image: '', url: '' })) }, { paddingY: 'md' }),
        B('listingCards', { eyebrow: 'Popular courses', title: 'Start with a course our students love', subtitle: '', variant: 'card', columns: 4, filters: true, subtitleIcon: 'GraduationCap', buttonLabel: 'Browse all courses', buttonUrl: '/courses', items: COURSES }, { paddingY: 'xl', width: 'wide' }),
        B('featureTabs', { eyebrow: 'How it works', title: 'Learning that actually sticks', subtitle: '', variant: 'side', autoplay: true, tabs: [
          { icon: 'Video', label: 'Live classes', title: 'Learn live, or on your schedule', text: 'Join weekly live sessions with your instructor — or watch the recordings whenever suits you.', bullets: ['Weekly live workshops', 'Recordings within the hour'], image: un(P.lecture, 1200), buttonLabel: '', buttonUrl: '' },
          { icon: 'Puzzle', label: 'Real projects', title: 'Build a portfolio as you learn', text: 'Every module ends with a real-world project reviewed by an industry mentor.', bullets: ['8+ portfolio projects', 'Personal code & design reviews'], image: un(P.laptop, 1200), buttonLabel: '', buttonUrl: '' },
          { icon: 'Users', label: 'Mentors', title: 'A mentor in your corner', text: 'Weekly 1:1 calls with a mentor who works in the job you want.', bullets: ['1:1 mentor calls', 'Community of 40,000 learners'], image: un(P.outdoor, 1200), buttonLabel: '', buttonUrl: '' },
          { icon: 'Award', label: 'Certificates', title: 'Credentials employers trust', text: 'Graduate with a verified certificate and career coaching to land your next role.', bullets: ['Verified certificates', 'Career coaching & job board'], image: un(P.graduation, 1200), buttonLabel: '', buttonUrl: '' },
        ] }, { background: 'surface', paddingY: 'xl', anchor: 'how' }),
        B('stats', { items: [{ value: '48,000+', label: 'Graduates' }, { value: '120', label: 'Countries' }, { value: '87%', label: 'Career outcome rate' }, { value: '4.8/5', label: 'Course rating' }] }, { background: 'primary', paddingY: 'lg' }),
        B('team', { eyebrow: 'Instructors', title: 'Learn from people who do the work', subtitle: 'Every instructor has at least ten years in industry.', variant: 'round', columns: 4, members: INSTRUCTORS }, { paddingY: 'xl' }),
        B('pricingToggle', {
          eyebrow: 'Pricing', title: 'One course or all of them', subtitle: 'Every plan includes certificates and a 14-day money-back guarantee.', currency: '$', yearlyNote: 'Save 35%',
          plans: [
            { name: 'Self-paced', description: 'One learning track at a time', monthly: '19', yearly: '12', features: ['Any one track', 'Projects & certificate', 'Community access'], buttonLabel: 'Browse courses', buttonUrl: '/courses', highlighted: false },
            { name: 'All-access', description: 'Every course, every track', monthly: '39', yearly: '25', features: ['All 120+ courses', 'Live workshops', 'Monthly 1:1 mentor call', 'Career coaching'], buttonLabel: 'Start 7-day trial', buttonUrl: '/contact', highlighted: true },
            { name: 'Teams', description: 'Per seat, for companies upskilling staff', monthly: '29', yearly: '19', features: ['Everything in All-access', 'Team dashboard & reporting', 'Custom learning paths', 'Dedicated success manager'], buttonLabel: 'Talk to sales', buttonUrl: '/contact', highlighted: false },
          ],
        }, { background: 'surface', paddingY: 'xl', anchor: 'pricing' }),
        B('testimonials', { eyebrow: 'Student stories', title: 'Careers changed at Scholar' }, { paddingY: 'xl' }),
        B('countdown', { eyebrow: 'Next live cohort', title: 'Spring cohort starts in', text: 'Learn alongside 200 classmates with live classes, deadlines and a community that keeps you going.', date: '2027-03-02T17:00', variant: 'cards', image: '', expiredText: 'Classes have started — join the waitlist for summer!', buttonLabel: 'Reserve your seat', buttonUrl: '/courses' }, { background: 'gradient', paddingY: 'xl' }),
        B('faq', { eyebrow: 'FAQ', title: 'Questions before you enrol' }, { paddingY: 'xl' }),
        B('cta', { title: 'Your next chapter starts today', text: 'Try any course free for 7 days. Cancel anytime.', primaryLabel: 'Start learning', primaryUrl: '/courses', secondaryLabel: 'Talk to an advisor', secondaryUrl: '/contact' }, { paddingY: 'lg' }),
      ],
    },
    {
      slug: 'courses', title: 'Courses', template: 'default', seoTitle: 'All courses — Scholar',
      blocks: [
        B('pageHeader', { title: 'All courses', subtitle: '120+ project-based courses in design, development, data and business.' }, { background: 'gradient', paddingY: 'lg', animate: false }),
        B('listingCards', { eyebrow: '', title: '', subtitle: '', variant: 'card', columns: 4, filters: true, subtitleIcon: 'GraduationCap', buttonLabel: '', buttonUrl: '', items: COURSES }, { paddingY: 'xl', width: 'wide' }),
        B('comparison', { eyebrow: 'Compare', title: 'Self-paced or live cohort?', columns: ['Self-paced', 'Live cohort'], highlight: 2, highlightLabel: 'Best results', groups: false, rows: [
          { group: '', feature: 'Start date', values: ['Any time', 'Every quarter'] },
          { group: '', feature: 'Live workshops', values: ['Recordings', 'yes'] },
          { group: '', feature: '1:1 mentor calls', values: ['Monthly', 'Weekly'] },
          { group: '', feature: 'Project reviews', values: ['yes', 'yes'] },
          { group: '', feature: 'Career coaching', values: ['no', 'yes'] },
          { group: '', feature: 'Completion rate', values: ['62%', '91%'] },
        ], buttons: [{ label: 'Start now', url: '/contact' }, { label: 'Join a cohort', url: '/contact' }] }, { background: 'surface', paddingY: 'xl' }),
      ],
    },
    {
      slug: 'instructors', title: 'Instructors', template: 'default', seoTitle: 'Instructors — Scholar',
      blocks: [
        B('pageHeader', { title: 'Our instructors', subtitle: 'Practitioners first, teachers second — and brilliant at both.' }, { background: 'gradient', paddingY: 'lg', animate: false }),
        B('team', { eyebrow: '', title: '', subtitle: '', variant: 'cards', columns: 4, members: INSTRUCTORS }, { paddingY: 'xl' }),
        B('jobs', { eyebrow: 'Teach with us', title: 'Become an instructor', subtitle: 'Share what you know with 40,000 motivated learners.', applyEmail: 'teach@scholar.example', items: [
          { title: 'Cloud & DevOps Instructor', department: 'Development', location: 'Remote', type: 'Part-time', description: 'Create and teach our new AWS and Kubernetes track.', url: '' },
          { title: 'Product Marketing Instructor', department: 'Business', location: 'Remote', type: 'Contract', description: 'Teach positioning, launches and go-to-market strategy.', url: '' },
          { title: 'Mentor — UX Design', department: 'Design', location: 'Remote', type: 'Flexible', description: 'Give weekly 1:1 feedback to students on their portfolio projects.', url: '' },
        ] }, { background: 'surface', paddingY: 'xl' }),
      ],
    },
    commonPages.about('Scholar', 'We believe a great career should be open to anyone willing to learn.'),
    commonPages.privacy(),
  ],

  async demo(prisma, { authors }) {
    const cats = {};
    for (const [order, [name, color]] of [['Careers', '#4f46e5'], ['Learning', '#f59e0b'], ['Design', '#ec4899']].entries()) {
      cats[name] = await prisma.category.create({ data: { name, slug: slug(name), color, order } });
    }
    for (const [i, [cat, title, excerpt, img]] of POSTS.entries()) {
      const date = new Date(Date.now() - (i + 1) * 3 * 864e5);
      await prisma.post.create({
        data: {
          title, slug: slug(title), excerpt, content: body(title), coverImage: un(img, 1600), status: 'PUBLISHED', featured: i === 0,
          publishedAt: date, createdAt: date, readingTime: 5, views: rand(500, 8000), authorId: authors[i % authors.length].id,
          categories: { connect: [{ id: cats[cat].id }] },
        },
      });
    }
    await prisma.testimonial.createMany({
      data: [
        { name: 'Tasha Williams', position: 'Product Designer', company: 'Lumen', avatar: face('w2', 200), content: 'I went from retail manager to product designer in eight months. The mentor calls and portfolio reviews made all the difference.', rating: 5, order: 0 },
        { name: 'Javier Morales', position: 'Data Analyst', company: 'Northwind', avatar: face('m6', 200), content: 'The Python & SQL course was the most practical learning I have ever done. I used my final project in every interview.', rating: 5, order: 1 },
        { name: 'Grace Kim', position: 'Front-end Engineer', company: 'Orbit', avatar: face('w4', 200), content: 'Daniel is a phenomenal teacher. Live cohorts kept me accountable while working full-time.', rating: 5, order: 2 },
      ],
    });
    await seedFaqs(prisma, [
      ['Do I need any experience?', 'No. Every beginner course starts from zero, and advanced courses list their prerequisites clearly.'],
      ['How much time do I need each week?', 'Most students spend 6 – 10 hours a week. Self-paced courses fit around any schedule.'],
      ['Will I get a certificate?', 'Yes — every course includes a verified certificate you can add to LinkedIn.'],
      ['Is there a refund policy?', 'Yes. If a course is not right for you, ask for a full refund within 14 days.'],
      ['Do you offer scholarships?', 'We award 200 full scholarships every year to people from under-represented groups in tech.'],
    ]);
  },
};
