const { B: block, m, un, face, slug, rand, seedFaqs, commonPages } = require('./helpers');

const B = (type, data, style = {}) => block(type, data, { animate: true, ...style });
const HERO = { paddingY: 'none', width: 'full', animate: false };

const P = {
  boatLake: '1476514525535-07fb3b4ae5f1', lakeBoat: '1501785888041-af3ef285b470', santorini: '1570077188670-e3a8d69ac5ff', santorini2: '1533105079780-92b9be482077',
  bali: '1537996194471-e657df975ab4', baliSunset: '1518548419970-58e3b4079ab2', kyoto: '1493976040374-85c8e12f0c0e', tokyo: '1540959733332-eab4deabeeaf',
  machu: '1526392060635-9d6019884377', maldives: '1514282401047-d79a71a590e8', maldives2: '1573843981267-be1999ff37cd', cappadocia: '1530789253388-582c481c54b0',
  cinque: '1516483638261-f4dbaf036963', venice: '1523906834658-6e24ef2386f9', paris: '1502602898657-3e91760cbb34', parisBridge: '1499856871958-5b9627545d1a',
  london: '1513635269975-59663e0ac1ad', halong: '1528127269322-539801943592', morocco: '1539020140153-e479b8c22e70', iceland: '1504893524553-b855bce32c67',
  mountains: '1464822759023-fed622ff2c3b', peaks: '1506905925346-21bda4d32df4', valley: '1469474968028-56623f02e42e', beach: '1507525428034-b723cf961d3e',
  palm: '1519046904884-53103b34b206', aerial: '1506929562872-bb421503ef21', wing: '1436491865332-7a61a109cc05', clouds: '1500835556837-99ac94a94552',
  flatlay: '1488646953014-85cb44e25828', backpacker: '1527631746610-bca00a040d60', friends: '1539635278303-d4002c07eae3', airport: '1504150558240-0b4fd8946624',
};

const tour = (image, badge, category, title, subtitle, price, rating, days, group, extra) => ({
  image: un(image, 1000), badge, category, title, subtitle, price, period: ' / person', rating, url: '/contact',
  meta: [`Clock: ${days} days`, `Users: Max ${group}`, extra],
});

const TOURS = [
  tour(P.santorini, 'Bestseller', 'Beach & islands', 'Greek Island Hopping', 'Athens · Mykonos · Santorini', '$2,490', '4.9', 10, 14, 'Ship: Ferries incl.'),
  tour(P.kyoto, 'New', 'Culture', 'Japan: Temples & Tokyo Lights', 'Tokyo · Hakone · Kyoto · Osaka', '$3,890', '5.0', 12, 12, 'Ticket: Rail pass'),
  tour(P.machu, '', 'Adventure', 'Inca Trail to Machu Picchu', 'Cusco · Sacred Valley · Machu Picchu', '$2,950', '4.9', 9, 10, 'Mountain: Guided trek'),
  tour(P.bali, 'Early bird -15%', 'Beach & islands', 'Bali Wellness Escape', 'Ubud · Canggu · Nusa Penida', '$1,790', '4.8', 8, 12, 'Leaf: Daily yoga'),
  tour(P.iceland, '', 'Adventure', 'Iceland Ring Road', 'Reykjavík · Vík · Glacier Lagoon', '$3,250', '4.9', 10, 12, 'Car: 4x4 included'),
  tour(P.morocco, '', 'Culture', 'Moroccan Medinas & Sahara', 'Marrakech · Fes · Merzouga', '$1,990', '4.8', 9, 14, 'Tent: Desert camp'),
];

const DESTINATIONS = [
  [P.santorini2, 'Greece', 'Santorini', 'Whitewashed villages & caldera sunsets'],
  [P.baliSunset, 'Indonesia', 'Bali', 'Temples, rice terraces & surf'],
  [P.tokyo, 'Japan', 'Tokyo', 'Neon nights & quiet shrines'],
  [P.maldives2, 'Maldives', 'Malé Atolls', 'Overwater villas & reefs'],
  [P.cappadocia, 'Türkiye', 'Cappadocia', 'Hot-air balloons at dawn'],
  [P.cinque, 'Italy', 'Cinque Terre', 'Colourful cliffside villages'],
  [P.halong, 'Vietnam', 'Ha Long Bay', 'Limestone karsts & junk boats'],
];

const POSTS = [
  ['Guides', 'The perfect 10 days in Japan for first-timers', 'Our route, our favourite ryokans and the mistakes to avoid.', P.kyoto],
  ['Tips', 'How to pack for two weeks in a carry-on', 'The capsule wardrobe our tour leaders swear by.', P.flatlay],
  ['Inspiration', '12 places to see before they change forever', 'From glaciers to coral reefs — travel thoughtfully, travel soon.', P.iceland],
  ['Guides', 'Island hopping in Greece: which islands, which order', 'A practical guide to ferries, beaches and the best sunsets.', P.santorini2],
  ['Tips', 'Travel insurance explained (without the small print)', 'What you actually need and what you can skip.', P.airport],
];

const body = (t) => `<p>${t}. Written by our tour leaders, who spend most of the year on the road.</p><h2>Before you go</h2><ul><li>Book flights 8 – 12 weeks ahead for the best fares.</li><li>Check passport validity — many countries need six months.</li><li>Download offline maps and translation packs.</li></ul><blockquote><p>“Travel is the only thing you buy that makes you richer.”</p></blockquote><h2>Travel with us</h2><p>Prefer someone else to handle the details? <a href="/tours">Browse our small-group tours</a> or ask us to design a trip just for you.</p>`;

module.exports = {
  id: 'wanderly',
  name: 'Wanderly',
  category: 'Travel & tours',
  description: 'A sun-soaked travel agency website: transparent split header, full-screen search hero with trip tabs, destination carousel, bookable tour cards with ratings, photo journal and an early-bird countdown.',
  features: { formats: ['STANDARD', 'GALLERY'], series: [], blocks: ['Headers', 'Business', 'Interactive', 'Media', 'Content', 'Conversion', 'Dynamic', 'Layout'] },
  layout: { header: 'overlay', article: 'blog', listing: 'cards' },
  general: { siteName: 'Wanderly', tagline: 'Small-group tours & tailor-made trips' },
  contact: { email: 'trips@wanderly.example', phone: '+1 (415) 555-0136', address: '77 Embarcadero, San Francisco, CA 94105', workingHours: 'Every day, 8:00 – 20:00' },
  social: { instagram: 'https://instagram.com', facebook: 'https://facebook.com', youtube: 'https://youtube.com', twitter: '', linkedin: '', github: '' },
  seo: { metaTitle: 'Wanderly — Small-group tours & tailor-made trips', metaDescription: 'Hand-crafted small-group tours to 60+ countries. Expert local guides, flexible booking and 4.9-star reviews.' },
  appearance: {
    preset: 'wanderly', primaryColor: '#e8590c', accentColor: '#0ea5a4', backgroundColor: '#fffaf5', surfaceColor: '#fdf0e4', textColor: '#1c1410',
    darkBackgroundColor: '#0f0b08', darkSurfaceColor: '#1b140f', darkTextColor: '#f8ede4', headingFont: 'Bricolage Grotesque', bodyFont: 'DM Sans',
    radius: 20, colorMode: 'light', headerStyle: 'glass', headerSticky: true, footerStyle: 'big', containerWidth: 1280, backToTop: true, blogLayout: 'grid',
    footerText: 'Fully protected bookings. Travel responsibly.',
    headerCta: { enabled: true, label: 'Plan my trip', url: '/contact' },
    announcement: { enabled: false, text: '', linkLabel: '', url: '' },
  },
  menus: {
    header: {
      name: 'Main menu',
      items: [
        m('Tours', '/tours', [m('Beach & islands', '/tours'), m('Culture', '/tours'), m('Adventure', '/tours')]),
        m('Destinations', '/destinations'),
        m('About', '/about'),
        m('Journal', '/blog'),
        m('FAQ', '/faq'),
        m('Contact', '/contact'),
      ],
    },
    footer: { name: 'Travel', items: [m('All tours', '/tours'), m('Destinations', '/destinations'), m('Tailor-made trips', '/contact'), m('Gift cards', '/contact')] },
    'footer-2': { name: 'Wanderly', items: [m('About us', '/about'), m('Journal', '/blog'), m('FAQ', '/faq'), m('Contact', '/contact'), m('Privacy', '/privacy-policy')] },
  },
  pages: () => [
    {
      slug: 'wanderly-home', title: 'Home', home: true, template: 'full-width', seoTitle: 'Wanderly — Small-group tours & tailor-made trips',
      blocks: [
        B('searchHero', {
          image: un(P.boatLake, 2200), overlay: 40, height: 'full', align: 'center', eyebrow: '60+ countries · 4.9★ from 12,000 travellers', title: 'The world is waiting. Go see it.',
          subtitle: 'Small-group tours and tailor-made trips, planned by people who have been there.',
          tabs: ['Tours', 'Tailor-made', 'Honeymoons'], buttonLabel: 'Find trips', action: '/tours',
          fields: [
            { label: 'Destination', icon: 'MapPin', type: 'text', placeholder: 'Where to?', options: [] },
            { label: 'Departure', icon: 'Calendar', type: 'date', placeholder: '', options: [] },
            { label: 'Travellers', icon: 'Users', type: 'select', placeholder: '2 adults', options: ['1 traveller', '2 travellers', '3 – 4 travellers', '5+ travellers'] },
          ],
          stats: [],
        }, HERO),
        B('trustBar', { variant: 'pills', items: [
          { icon: 'Award', title: 'Award-winning tours', text: '' }, { icon: 'Users', title: 'Max 14 travellers', text: '' }, { icon: 'ShieldCheck', title: 'Fully protected bookings', text: '' },
          { icon: 'Calendar', title: 'Free date changes', text: '' }, { icon: 'Leaf', title: 'Carbon-balanced trips', text: '' },
        ] }, { paddingY: 'md' }),
        B('cardCarousel', { eyebrow: 'Trending now', title: 'Destinations everyone is talking about', subtitle: '', cardStyle: 'overlay', size: 'md',
          items: DESTINATIONS.map(([id, tag, title, text]) => ({ image: un(id, 900), tag, title, text, url: '/destinations' })) }, { paddingY: 'lg', width: 'wide' }),
        B('listingCards', { eyebrow: 'Popular tours', title: 'Trips our travellers love', subtitle: 'Small groups, expert local guides and hand-picked places to stay.', variant: 'card', columns: 3, filters: true, buttonLabel: 'View all tours', buttonUrl: '/tours', items: TOURS }, { background: 'surface', paddingY: 'xl', width: 'wide' }),
        B('serviceCards', { eyebrow: 'Travel your way', title: 'However you like to explore', subtitle: '', variant: 'icon', columns: 4, buttonLabel: '', buttonUrl: '', items: [
          { icon: 'Users', title: 'Small-group tours', text: 'Max 14 like-minded travellers and a brilliant local leader.', image: '', url: '/tours', linkLabel: 'Browse tours' },
          { icon: 'Compass', title: 'Tailor-made', text: 'Your dates, your pace, your style — designed around you.', image: '', url: '/contact', linkLabel: 'Plan a trip' },
          { icon: 'Heart', title: 'Honeymoons', text: 'Unforgettable escapes with every detail taken care of.', image: '', url: '/contact', linkLabel: 'Get ideas' },
          { icon: 'Smile', title: 'Family adventures', text: 'Kid-friendly trips with activities the whole family loves.', image: '', url: '/contact', linkLabel: 'Explore' },
        ] }, { paddingY: 'xl', width: 'wide' }),
        B('stats', { items: [{ value: '60+', label: 'Countries' }, { value: '12,000+', label: 'Happy travellers' }, { value: '4.9/5', label: 'Average review' }, { value: '14', label: 'Max group size' }] }, { background: 'primary', paddingY: 'lg' }),
        B('masonryGallery', { eyebrow: 'From the road', title: 'Moments our travellers shared', subtitle: '', columns: 4, filters: false, items: [P.cappadocia, P.palm, P.venice, P.peaks, P.friends, P.aerial, P.parisBridge, P.maldives, P.halong, P.backpacker, P.valley, P.london].map((id) => ({ src: un(id, 800), title: '', category: '', caption: '' })) }, { paddingY: 'xl', width: 'wide' }),
        B('testimonials', { eyebrow: 'Reviews', title: '4.9 stars from 12,000+ travellers' }, { background: 'surface', paddingY: 'xl' }),
        B('countdown', { eyebrow: 'Early-bird sale', title: 'Save 15% on 2027 departures', text: 'Lock in this year’s prices with a $200 deposit — free changes up to 60 days before you travel.', date: '2027-01-31T23:59', variant: 'image', image: un(P.maldives2, 2000), expiredText: 'The sale has ended — new offers soon!', buttonLabel: 'See sale tours', buttonUrl: '/tours' }, { paddingY: 'lg', width: 'wide' }),
        B('newsletter', { title: 'Travel inspiration, monthly', text: 'New tours, travel tips and subscriber-only offers. No spam, ever.' }, { paddingY: 'lg' }),
      ],
    },
    {
      slug: 'tours', title: 'Tours', template: 'default', seoTitle: 'Small-group tours — Wanderly',
      blocks: [
        B('searchHero', { image: un(P.mountains, 2000), overlay: 45, height: 'tall', align: 'left', eyebrow: 'All tours', title: 'Find your next adventure', subtitle: '', tabs: [], buttonLabel: 'Search', action: '/tours', fields: [
          { label: 'Destination', icon: 'MapPin', type: 'text', placeholder: 'Anywhere', options: [] },
          { label: 'Style', icon: 'Compass', type: 'select', placeholder: 'Any style', options: ['Beach & islands', 'Culture', 'Adventure', 'Wellness'] },
          { label: 'Month', icon: 'Calendar', type: 'select', placeholder: 'Any month', options: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'] },
        ], stats: [] }, HERO),
        B('listingCards', { eyebrow: '', title: '', subtitle: '', variant: 'card', columns: 3, filters: true, buttonLabel: '', buttonUrl: '', items: TOURS }, { paddingY: 'xl', width: 'wide' }),
        B('faq', { eyebrow: 'FAQ', title: 'Booking questions' }, { background: 'surface', paddingY: 'xl' }),
      ],
    },
    {
      slug: 'destinations', title: 'Destinations', template: 'default', seoTitle: 'Destinations — Wanderly',
      blocks: [
        B('pageHeader', { title: 'Destinations', subtitle: 'Sixty countries, hand-picked by people who have explored every one.' }, { background: 'surface', paddingY: 'lg', animate: false }),
        B('listingCards', { eyebrow: '', title: '', subtitle: '', variant: 'overlay', columns: 4, filters: false, buttonLabel: '', buttonUrl: '', items: [
          ...DESTINATIONS, [P.paris, 'France', 'Paris', 'Cafés, art & long walks'], [P.machu, 'Peru', 'Machu Picchu', 'The lost city of the Incas'],
          [P.iceland, 'Iceland', 'South Coast', 'Waterfalls, glaciers & black sand'], [P.morocco, 'Morocco', 'Fes', 'Souks, riads & mint tea'], [P.beach, 'Mexico', 'Tulum', 'Turquoise water & Mayan ruins'],
        ].map(([id, category, title, subtitle]) => ({ image: un(id, 900), badge: '', category, title, subtitle, price: '', period: '', rating: '', meta: [], url: '/tours' })) }, { paddingY: 'xl', width: 'wide' }),
        B('ctaBanner', { variant: 'image', image: un(P.wing, 1800), eyebrow: 'Tailor-made', title: 'Can’t decide? We will plan it for you', text: 'Tell us your dates and dreams — a travel designer will send ideas within 48 hours.', primaryLabel: 'Plan my trip', primaryUrl: '/contact', phone: '+1 (415) 555-0136' }, { paddingY: 'lg', width: 'wide' }),
      ],
    },
    {
      slug: 'about', title: 'About', template: 'default', seoTitle: 'About Wanderly',
      blocks: [
        B('pageHeader', { title: 'We travel so you can travel better', subtitle: 'Founded in 2011 by two tour leaders who believed group travel could be small, personal and kind to the places we visit.' }, { background: 'surface', paddingY: 'lg', animate: false }),
        B('accordionImage', { eyebrow: 'Why Wanderly', title: 'Travel, done thoughtfully', subtitle: '', imagePosition: 'left', autoplay: true, items: [
          { title: 'Local leaders', text: 'Every tour is led by someone who grew up there — the stories, the shortcuts, the best food.', image: un(P.friends, 1200) },
          { title: 'Small groups', text: 'Never more than 14 travellers, so you see more and disturb less.', image: un(P.backpacker, 1200) },
          { title: 'Responsible by design', text: 'Locally owned stays, fair wages and every trip carbon-balanced.', image: un(P.valley, 1200) },
        ] }, { paddingY: 'xl' }),
        B('team', { eyebrow: 'Travel designers', title: 'The people planning your trip', subtitle: '', variant: 'round', columns: 4, members: [
          { name: 'Sophie Martin', role: 'Co-founder · Europe', image: face('w1'), bio: '', linkedin: '', twitter: '', email: '' },
          { name: 'Diego Alvarez', role: 'Co-founder · Latin America', image: face('m6'), bio: '', linkedin: '', twitter: '', email: '' },
          { name: 'Aiko Tanaka', role: 'Asia specialist', image: face('w4'), bio: '', linkedin: '', twitter: '', email: '' },
          { name: 'Sam Okoro', role: 'Africa & Middle East', image: face('m2'), bio: '', linkedin: '', twitter: '', email: '' },
        ] }, { background: 'surface', paddingY: 'xl' }),
      ],
    },
    commonPages.privacy(),
  ],

  async demo(prisma, { authors }) {
    const cats = {};
    for (const [order, [name, color]] of [['Guides', '#e8590c'], ['Tips', '#0ea5a4'], ['Inspiration', '#a855f7']].entries()) {
      cats[name] = await prisma.category.create({ data: { name, slug: slug(name), color, order } });
    }
    for (const [i, [cat, title, excerpt, img]] of POSTS.entries()) {
      const date = new Date(Date.now() - (i + 1) * 4 * 864e5);
      await prisma.post.create({
        data: {
          title, slug: slug(title), excerpt, content: body(title), coverImage: un(img, 1600), status: 'PUBLISHED', featured: i === 0,
          publishedAt: date, createdAt: date, readingTime: 6, views: rand(400, 7000), authorId: authors[i % authors.length].id,
          categories: { connect: [{ id: cats[cat].id }] },
        },
      });
    }
    await prisma.testimonial.createMany({
      data: [
        { name: 'Emily Walker', position: 'Japan: Temples & Tokyo Lights', company: '', avatar: face('w2', 200), content: 'Twelve perfect days. Our leader Aiko knew every hidden ramen bar and quiet temple garden. Already planning our next trip with Wanderly.', rating: 5, order: 0 },
        { name: 'David & Priya Shah', position: 'Bali Wellness Escape', company: '', avatar: face('m3', 200), content: 'The best honeymoon we could have imagined — every detail was taken care of, and the group felt like friends by day two.', rating: 5, order: 1 },
        { name: 'Laura Bennett', position: 'Inca Trail to Machu Picchu', company: '', avatar: face('w3', 200), content: 'Challenging, magical and incredibly well organised. Seeing Machu Picchu at sunrise was a life highlight.', rating: 5, order: 2 },
      ],
    });
    await seedFaqs(prisma, [
      ['How big are the groups?', 'Never more than 14 travellers, and often fewer.'],
      ['Are flights included?', 'International flights are not included, so you can fly from wherever suits you. We are happy to help you find the best options.'],
      ['Can I change my dates?', 'Yes — date changes are free up to 60 days before departure.'],
      ['Is my booking protected?', 'Every booking is fully financially protected, so your money is safe.'],
      ['Do you offer private trips?', 'Yes. Any tour can be run privately, or we can design a completely tailor-made trip.'],
    ]);
  },
};
