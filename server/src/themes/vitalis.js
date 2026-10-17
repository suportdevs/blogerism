const { B: block, m, un, face, slug, rand, seedFaqs, commonPages } = require('./helpers');

const B = (type, data, style = {}) => block(type, data, { animate: true, ...style });

const P = {
  drWoman: '1559839734-2b71ea197ec2', drMan: '1612349317150-e413f6a5b16d', drScrubs: '1622253692010-333f2da6031d', nurse: '1594824476967-48c8b964273f',
  drPink: '1537368910025-700350fe46c7', drMask: '1582750433449-648ed127bb54', patient: '1631217868264-e5b90bb7e133', reception: '1519494026892-80bbd2d6fd0d',
  exam: '1551076805-e1869033e561', ward: '1538108149393-fbbd81895907', lab: '1532187863486-abf9dbad1b69', tubes: '1581594693702-fbdc51b2763b',
  xray: '1530497610245-94d3c16cda28', dental: '1629909613654-28e377c37b09', steth: '1584982751601-97dcc096659c', hands: '1584515933487-779824d29309',
  phone: '1576091160399-112ba8d25d1d', laptop: '1576091160550-2173dba999ef', surgeons: '1579684385127-1ef15d508118',
};

const DEPARTMENTS = [
  ['Stethoscope', 'General practice', 'Check-ups, chronic conditions and everyday care for the whole family.', P.exam],
  ['HeartPulse', 'Cardiology', 'ECGs, stress tests and heart-health plans from experienced cardiologists.', P.steth],
  ['Baby', 'Pediatrics', 'Gentle, thorough care for newborns, children and teenagers.', P.patient],
  ['Brain', 'Neurology', 'Diagnosis and treatment for headaches, sleep, memory and nerve conditions.', P.xray],
  ['Smile', 'Dental care', 'Cleanings, whitening, implants and emergency dental appointments.', P.dental],
  ['Microscope', 'Diagnostics & lab', 'Blood tests, imaging and results online — usually within 24 hours.', P.lab],
];

const DOCTORS = [
  { name: 'Dr. Sarah Mitchell', role: 'Family Medicine', image: un(P.drWoman, 600), bio: '15 years in family practice. Special interest in women’s health.', linkedin: '#', twitter: '', email: '' },
  { name: 'Dr. James Carter', role: 'Cardiologist', image: un(P.drMan, 600), bio: 'Board-certified cardiologist with 18 years of hospital practice.', linkedin: '#', twitter: '', email: '' },
  { name: 'Dr. Raj Patel', role: 'Pediatrician', image: un(P.drScrubs, 600), bio: 'Makes check-ups something kids actually look forward to.', linkedin: '#', twitter: '', email: '' },
  { name: 'Dr. Elena Rossi', role: 'Neurologist', image: un(P.nurse, 600), bio: 'Specialist in migraine, sleep medicine and epilepsy.', linkedin: '#', twitter: '', email: '' },
];

const POSTS = [
  ['Wellness', '10 small habits that add years to your life', 'Our family doctors share the everyday changes with the biggest health payoff.', P.hands],
  ['Heart health', 'Know your numbers: blood pressure explained', 'What the readings mean, when to worry and how to bring them down.', P.steth],
  ['Children', 'A parent’s guide to childhood vaccinations', 'Which vaccines, when — and answers to the questions parents ask most.', P.patient],
  ['Clinic news', 'Same-day appointments are now available every weekday', 'Book online by 10am and see a doctor the same day.', P.reception],
  ['Wellness', 'Sleep better tonight: advice from our neurologist', 'Simple, evidence-based steps for deeper, more restful sleep.', P.laptop],
];

const body = (t) => `<p>${t}. This article was written by our clinical team to help you make informed decisions about your health.</p><h2>Key points</h2><ul><li>Small, consistent changes matter more than dramatic ones.</li><li>Regular check-ups catch problems early, when they are easiest to treat.</li><li>Always talk to your doctor before starting a new treatment.</li></ul><h2>When to see a doctor</h2><p>If you are worried about any symptoms, <a href="/appointments">book an appointment</a> — same-day slots are available every weekday.</p><p><em>This article is for general information and is not a substitute for professional medical advice.</em></p>`;

module.exports = {
  id: 'vitalis',
  name: 'Vitalis',
  category: 'Medical & healthcare',
  description: 'A calm, trustworthy clinic website: contact top bar, arch-image hero with floating stats, department tiles, doctors, online appointment booking and opening hours.',
  features: { formats: ['STANDARD'], series: [], blocks: ['Headers', 'Business', 'Interactive', 'Content', 'Conversion', 'Dynamic', 'Restaurant', 'Media', 'Layout'] },
  layout: { header: 'corporate', article: 'blog', listing: 'cards' },
  general: { siteName: 'Vitalis', tagline: 'Modern healthcare for the whole family' },
  contact: { email: 'care@vitalis-clinic.example', phone: '+1 (555) 014-2200', address: '410 Wellness Drive, Boston, MA 02115', workingHours: 'Mon – Sat, 8:00 – 20:00 · Emergencies 24/7' },
  social: { facebook: 'https://facebook.com', instagram: 'https://instagram.com', linkedin: 'https://linkedin.com', youtube: '', twitter: '', github: '' },
  seo: { metaTitle: 'Vitalis — Modern healthcare for the whole family', metaDescription: 'Same-day appointments, specialist doctors and on-site diagnostics. Book your visit online.' },
  appearance: {
    preset: 'vitalis', primaryColor: '#0e7490', accentColor: '#10b981', backgroundColor: '#ffffff', surfaceColor: '#eef7f9', textColor: '#0b2530',
    darkBackgroundColor: '#061317', darkSurfaceColor: '#0c1f25', darkTextColor: '#e2f1f4', headingFont: 'Lexend', bodyFont: 'Figtree',
    radius: 18, colorMode: 'light', headerStyle: 'solid', headerSticky: true, footerStyle: 'columns', containerWidth: 1240, backToTop: true, blogLayout: 'grid',
    footerText: 'Fully accredited, patient-first care.',
    headerCta: { enabled: true, label: 'Book appointment', url: '/appointments' },
    announcement: { enabled: false, text: '', linkLabel: '', url: '' },
  },
  menus: {
    header: {
      name: 'Main menu',
      items: [
        m('Home', '/'),
        m('Departments', '/departments', DEPARTMENTS.map(([icon, title], i) => m(title, '/departments', [], { icon, description: ['Everyday family care', 'Heart health & ECGs', 'Children & teens', 'Brain, nerves & sleep', 'Cleanings to implants', 'Tests & imaging'][i] }))),
        m('Doctors', '/doctors'),
        m('Appointments', '/appointments'),
        m('Health tips', '/blog'),
        m('Contact', '/contact'),
      ],
    },
    footer: { name: 'Patients', items: [m('Book appointment', '/appointments'), m('Departments', '/departments'), m('Our doctors', '/doctors'), m('FAQ', '/faq')] },
    'footer-2': { name: 'Clinic', items: [m('About', '/about'), m('Health tips', '/blog'), m('Contact', '/contact'), m('Privacy', '/privacy-policy')] },
  },
  pages: () => [
    {
      slug: 'vitalis-home', title: 'Home', home: true, template: 'full-width', seoTitle: 'Vitalis — Modern healthcare for the whole family',
      blocks: [
        B('splitHero', {
          variant: 'arch', eyebrow: 'Family & specialist care', title: 'Healthcare that puts', highlight: 'you first',
          subtitle: 'Experienced doctors, short waiting times and on-site diagnostics — all under one roof, with appointments available today.',
          bullets: ['Same-day appointments', 'Board-certified doctors', 'Most insurance accepted', 'Results online in 24h'],
          primaryLabel: 'Book an appointment', primaryUrl: '/appointments', secondaryLabel: 'Find a doctor', secondaryUrl: '/doctors',
          image: un(P.drWoman, 1000), image2: '',
          badges: [{ icon: 'HeartPulse', value: '24/7', label: 'Emergency care' }, { icon: 'Star', value: '4.9/5', label: 'Patient rating' }],
          proof: 'Trusted by 12,000+ patients', avatars: [face('w7', 120), face('m6', 120), face('w2', 120), face('m1', 120)],
        }, { background: 'surface', paddingY: 'xl', animate: false }),
        B('trustBar', { variant: 'overlap', items: [
          { icon: 'Stethoscope', title: 'Expert doctors', text: '40+ specialists across 12 fields.' },
          { icon: 'Clock', title: 'Short waits', text: 'Average wait under 15 minutes.' },
          { icon: 'ShieldCheck', title: 'Insurance friendly', text: 'We accept most major plans.' },
          { icon: 'Microscope', title: 'On-site lab', text: 'Tests and imaging in one visit.' },
        ] }, { paddingY: 'sm' }),
        B('serviceCards', { eyebrow: 'Departments', title: 'Complete care under one roof', subtitle: 'From routine check-ups to specialist treatment.', variant: 'icon', columns: 3, buttonLabel: '', buttonUrl: '',
          items: DEPARTMENTS.map(([icon, title, text]) => ({ icon, title, text, image: '', url: '/departments', linkLabel: 'Learn more' })) }, { paddingY: 'xl' }),
        B('accordionImage', { eyebrow: 'Why Vitalis', title: 'Care that feels personal', subtitle: '', imagePosition: 'right', autoplay: true, items: [
          { title: 'Time to listen', text: 'Our appointments are 20 minutes as standard — long enough for real conversations, not rushed checklists.', image: un(P.patient, 1200) },
          { title: 'Everything in one visit', text: 'Blood tests, ECG, X-ray and ultrasound are on-site, so you leave with answers instead of referrals.', image: un(P.lab, 1200) },
          { title: 'Your records, online', text: 'See results, prescriptions and letters in our secure patient portal — and message your doctor.', image: un(P.phone, 1200) },
          { title: 'Here when it matters', text: 'Our urgent care unit is open 24 hours a day, 365 days a year.', image: un(P.ward, 1200) },
        ] }, { background: 'surface', paddingY: 'xl' }),
        B('stats', { items: [{ value: '40+', label: 'Specialists' }, { value: '12,000+', label: 'Patients a year' }, { value: '15 min', label: 'Average wait' }, { value: '98%', label: 'Would recommend us' }] }, { background: 'primary', paddingY: 'lg' }),
        B('team', { eyebrow: 'Our doctors', title: 'Meet the specialists', subtitle: 'Board-certified physicians who take the time to listen.', variant: 'round', columns: 4, members: DOCTORS }, { paddingY: 'xl' }),
        B('appointment', { eyebrow: 'Appointments', title: 'Book your visit in under a minute', text: 'Choose a department and a time that suits you. We will confirm by email and send a reminder the day before.', serviceLabel: 'Department', services: DEPARTMENTS.map(([, t]) => t), firstSlot: '08:00', lastSlot: '19:00', interval: 60, image: '', phone: '+1 (555) 014-2200', bullets: ['Same-day slots every weekday', 'Video consultations available', 'Free cancellation up to 2 hours before'] }, { background: 'surface', paddingY: 'xl', anchor: 'book' }),
        B('testimonials', { eyebrow: 'Patient stories', title: 'Kind words from our patients' }, { paddingY: 'xl' }),
        B('faq', { eyebrow: 'FAQ', title: 'Questions patients often ask' }, { background: 'surface', paddingY: 'xl' }),
        B('ctaBanner', { variant: 'split', image: un(P.surgeons, 1400), eyebrow: 'Urgent care', title: 'Need help now? We are open 24/7', text: 'Walk in any time or call ahead and we will be ready for you.', primaryLabel: 'Get directions', primaryUrl: '/contact', secondaryLabel: '', secondaryUrl: '', phone: '+1 (555) 014-2200' }, { paddingY: 'lg', width: 'wide' }),
        B('latestPosts', { eyebrow: 'Health tips', title: 'Advice from our doctors', count: 3, buttonLabel: 'All articles', buttonUrl: '/blog' }, { paddingY: 'xl' }),
      ],
    },
    {
      slug: 'departments', title: 'Departments', template: 'default', seoTitle: 'Departments — Vitalis',
      blocks: [
        B('pageHeader', { title: 'Departments', subtitle: 'Twelve specialties, one coordinated team — so you never have to tell your story twice.' }, { background: 'surface', paddingY: 'lg', animate: false }),
        B('serviceCards', { eyebrow: '', title: '', subtitle: '', variant: 'image', columns: 3, items: DEPARTMENTS.map(([icon, title, text, img]) => ({ icon, title, text, image: un(img, 900), url: '/appointments', linkLabel: 'Book an appointment' })) }, { paddingY: 'xl' }),
        B('steps', { eyebrow: 'Your visit', title: 'What to expect', variant: 'timeline', items: [
          { icon: 'Calendar', title: 'Book', text: 'Online, by phone or walk in.' },
          { icon: 'FileCheck2', title: 'Check in', text: 'Fill in your forms online before you arrive.' },
          { icon: 'Stethoscope', title: 'See your doctor', text: 'A 20-minute appointment, never rushed.' },
          { icon: 'Laptop', title: 'Follow up', text: 'Results and next steps in your patient portal.' },
        ] }, { background: 'surface', paddingY: 'xl' }),
        B('ctaBanner', { variant: 'image', image: un(P.reception, 1800), eyebrow: 'Ready when you are', title: 'Book an appointment today', text: 'Same-day slots available every weekday.', primaryLabel: 'Book online', primaryUrl: '/appointments', phone: '+1 (555) 014-2200' }, { paddingY: 'lg', width: 'wide' }),
      ],
    },
    {
      slug: 'doctors', title: 'Doctors', template: 'default', seoTitle: 'Our doctors — Vitalis',
      blocks: [
        B('pageHeader', { title: 'Our doctors', subtitle: 'Board-certified, experienced and genuinely kind.' }, { background: 'surface', paddingY: 'lg', animate: false }),
        B('team', { eyebrow: '', title: '', subtitle: '', variant: 'cards', columns: 4, members: DOCTORS }, { paddingY: 'xl' }),
        B('testimonials', { eyebrow: 'Patient stories', title: 'Why patients choose Vitalis' }, { background: 'surface', paddingY: 'xl' }),
      ],
    },
    {
      slug: 'appointments', title: 'Appointments', template: 'default', seoTitle: 'Book an appointment — Vitalis',
      blocks: [
        B('pageHeader', { title: 'Book an appointment', subtitle: 'Pick a department and time — we will confirm by email within the hour.' }, { background: 'surface', paddingY: 'lg', animate: false }),
        B('appointment', { eyebrow: '', title: 'Request a visit', text: 'Existing patients can also book in the patient portal.', serviceLabel: 'Department', services: DEPARTMENTS.map(([, t]) => t), firstSlot: '08:00', lastSlot: '19:30', interval: 30, image: un(P.reception, 1000), phone: '+1 (555) 014-2200', bullets: ['Same-day slots every weekday', 'Video consultations available', 'Free cancellation up to 2 hours before'] }, { paddingY: 'xl' }),
        B('hours', { eyebrow: 'Visit us', title: 'Opening hours & location', address: '', phone: '', email: '', mapEmbedUrl: '', image: un(P.exam, 1200), rows: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => ({ day, open: '08:00', close: day === 'Saturday' ? '16:00' : '20:00', closed: day === 'Sunday' })) }, { background: 'surface', paddingY: 'xl' }),
      ],
    },
    commonPages.about('Vitalis', 'An independent, doctor-led clinic caring for families since 2005.'),
    commonPages.privacy(),
  ],

  async demo(prisma, { authors }) {
    const cats = {};
    for (const [order, [name, color]] of [['Wellness', '#10b981'], ['Heart health', '#e11d48'], ['Children', '#f59e0b'], ['Clinic news', '#0e7490']].entries()) {
      cats[name] = await prisma.category.create({ data: { name, slug: slug(name), color, order } });
    }
    for (const [i, [cat, title, excerpt, img]] of POSTS.entries()) {
      const date = new Date(Date.now() - (i + 1) * 4 * 864e5);
      await prisma.post.create({
        data: {
          title, slug: slug(title), excerpt, content: body(title), coverImage: un(img, 1600), status: 'PUBLISHED', featured: i === 0,
          publishedAt: date, createdAt: date, readingTime: 4, views: rand(200, 5000), authorId: authors[i % authors.length].id,
          categories: { connect: [{ id: cats[cat].id }] },
        },
      });
    }
    await prisma.testimonial.createMany({
      data: [
        { name: 'Linda Thompson', position: 'Patient since 2018', company: '', avatar: face('w6', 200), content: 'Dr. Mitchell is the first doctor who has ever really listened to me. I was seen on time and had my blood results the next morning.', rating: 5, order: 0 },
        { name: 'Michael Chen', position: 'Cardiology patient', company: '', avatar: face('m1', 200), content: 'From the ECG to the follow-up, everything happened in one building in one afternoon. Exceptional care.', rating: 5, order: 1 },
        { name: 'Amira Hassan', position: 'Mother of two', company: '', avatar: face('w2', 200), content: 'Dr. Patel is wonderful with my children — they actually ask when they can go back to see him!', rating: 5, order: 2 },
      ],
    });
    await seedFaqs(prisma, [
      ['Do you accept my insurance?', 'We accept most major insurance plans. Call us or check the list in the patient portal before your visit.'],
      ['Can I get a same-day appointment?', 'Yes — book online before 10am on weekdays and we will see you the same day.'],
      ['Do you offer video consultations?', 'Yes, for many follow-ups and minor conditions. Choose “video” when booking.'],
      ['How do I get my test results?', 'Most results appear in your secure patient portal within 24 hours, with notes from your doctor.'],
      ['What should I bring to my first visit?', 'A photo ID, your insurance card and a list of any medicines you take.'],
    ]);
  },
};
