const { B: block, m, un, face, slug, rand, seedFaqs, commonPages } = require('./helpers');

const B = (type, data, style = {}) => block(type, data, { animate: true, ...style });
const HERO = { paddingY: 'none', width: 'full', animate: false };

const P = {
  villa: '1613490493576-7fde63acd811', whiteVilla: '1613977257363-707ba9348227', poolVilla: '1600596542815-ffad4c1539a9', modernPool: '1580587771525-78b9dba3b914',
  evening: '1600585154340-be6161a56a0c', modern: '1600047509807-ba8f99d2cdde', wood: '1600566753190-17f0baa2a6c3', classic: '1570129477492-45c003edd2be',
  redRoof: '1576941089067-2de3c901e126', suburban: '1583608205776-bfd35f0d9f83', brick: '1605276374104-dee2a0ed3cd6', tropical: '1564013799919-ab600027ffc6',
  living: '1600210492486-724fe5c67fb0', livingLux: '1598928506311-c55ded91a20c', interior: '1600607687939-ce8a6c25118c', bright: '1560448204-e02f11c3d0e2',
  kitchen: '1556912173-3bb406ef7e77', kitchen2: '1484154218962-a197022b5858', apartment: '1522708323590-d24dbb6b0267', cozy: '1502672260266-1c1ef2d93688',
  chair: '1586023492125-27b2c045efd7', loft: '1493809842364-78817add7ffb', glassPool: '1600573472550-8090b5e0745e',
};

const home = (image, badge, category, title, subtitle, price, period, beds, baths, area) => ({
  image: un(image, 1000), badge, category, title, subtitle, price, period, rating: '', url: '/contact',
  meta: [`BedDouble: ${beds} beds`, `Bath: ${baths} baths`, `Ruler: ${area}`],
});

const FEATURED = [
  home(P.villa, 'Featured', 'For sale', 'Azure Cliff Villa', 'Malibu, California', '$4,850,000', '', 5, 6, '6,200 sq ft'),
  home(P.evening, 'New', 'For sale', 'The Glasshouse', 'Westwood, Los Angeles', '$2,390,000', '', 4, 3, '3,850 sq ft'),
  home(P.apartment, '', 'For rent', 'Skyline Loft Residence', 'Downtown, Austin', '$3,200', '/month', 2, 2, '1,240 sq ft'),
  home(P.modernPool, 'Open house', 'For sale', 'Palm Grove Modern', 'Coral Gables, Miami', '$3,150,000', '', 5, 4, '4,900 sq ft'),
  home(P.cozy, '', 'For rent', 'Garden Courtyard Flat', 'Brooklyn, New York', '$2,750', '/month', 1, 1, '820 sq ft'),
  home(P.wood, 'New build', 'New build', 'Cedar Ridge House', 'Boulder, Colorado', '$1,680,000', '', 4, 3, '3,300 sq ft'),
];

const MORE = [
  home(P.whiteVilla, 'Price drop', 'For sale', 'Mirage Pool House', 'Scottsdale, Arizona', '$2,975,000', '', 5, 5, '5,400 sq ft'),
  home(P.classic, '', 'For sale', 'Willow Lane Farmhouse', 'Greenwich, Connecticut', '$1,450,000', '', 4, 3, '3,600 sq ft'),
  home(P.bright, '', 'For rent', 'Sunlit Riverside Apartment', 'Portland, Oregon', '$2,400', '/month', 2, 1, '980 sq ft'),
  home(P.modern, 'New build', 'New build', 'Linea Townhomes', 'Seattle, Washington', '$1,120,000', '', 3, 3, '2,100 sq ft'),
  home(P.brick, '', 'For sale', 'Maple Court Residence', 'Naperville, Illinois', '$865,000', '', 4, 3, '3,050 sq ft'),
  home(P.loft, '', 'For rent', 'Arts District Loft', 'Denver, Colorado', '$2,950', '/month', 2, 2, '1,350 sq ft'),
];

const AGENTS = [
  { name: 'Isabella Cruz', role: 'Luxury homes specialist', image: face('w2'), bio: '$420M in residential sales across coastal California.', linkedin: '#', twitter: '', email: 'isabella@haven.example' },
  { name: 'Ethan Brooks', role: 'Senior buyer’s agent', image: face('m6'), bio: 'Helps first-time buyers win in competitive markets.', linkedin: '#', twitter: '', email: '' },
  { name: 'Grace Whitfield', role: 'Rentals & relocation', image: face('w4'), bio: 'Moves 300+ families a year to their next city.', linkedin: '#', twitter: '', email: '' },
  { name: 'Liam Carter', role: 'New developments', image: face('m3'), bio: 'Works with builders on off-plan and new-build launches.', linkedin: '#', twitter: '', email: '' },
];

const POSTS = [
  ['Market report', 'Home prices in Q3: what buyers and sellers need to know', 'Inventory is rising, rates are easing and the balance of power is shifting.', P.suburban],
  ['Buying', 'The first-time buyer checklist we give every client', 'From pre-approval to closing day, here is everything in the right order.', P.kitchen2],
  ['Selling', 'Seven staging tricks that add value before a sale', 'Small, inexpensive changes that make listings photograph — and sell — better.', P.livingLux],
  ['Design', 'Inside the Glasshouse: a modern home built around light', 'A tour of one of our favourite listings of the year.', P.interior],
  ['Market report', 'Renting vs. buying in 2027: the real numbers', 'We modelled ten cities so you don’t have to.', P.apartment],
];

const body = (t) => `<p>${t}. Our agents share what they are seeing on the ground every week — here is the short version.</p><h2>The headline</h2><p>Well-presented homes in good locations are still selling quickly, while overpriced listings are sitting longer than they did a year ago.</p><h2>What it means for you</h2><ul><li><b>Buyers:</b> get pre-approved and be ready to move on the right home.</li><li><b>Sellers:</b> price accurately from day one and invest in great photography.</li><li><b>Renters:</b> longer leases are increasingly negotiable.</li></ul><p>Want a personal view on your neighbourhood? <a href="/valuation">Book a free valuation</a>.</p>`;

module.exports = {
  id: 'haven',
  name: 'Haven',
  category: 'Real estate & property',
  description: 'A real-estate agency website: floating pill header, full-screen search hero with buy/rent tabs, filterable property cards, neighbourhood tiles, agents and valuation booking.',
  features: { formats: ['STANDARD'], series: [], blocks: ['Headers', 'Business', 'Interactive', 'Content', 'Conversion', 'Dynamic', 'Media', 'Layout'] },
  layout: { header: 'floating', article: 'blog', listing: 'cards' },
  general: { siteName: 'Haven', tagline: 'Homes worth coming home to.' },
  contact: { email: 'hello@haven-homes.example', phone: '+1 (310) 555-0172', address: '1250 Ocean Avenue, Santa Monica, CA 90401', workingHours: 'Mon – Sat, 9:00 – 19:00' },
  social: { instagram: 'https://instagram.com', facebook: 'https://facebook.com', linkedin: 'https://linkedin.com', youtube: 'https://youtube.com', twitter: '', github: '' },
  seo: { metaTitle: 'Haven — Homes worth coming home to', metaDescription: 'Buy, sell or rent with Haven. Hand-picked homes, expert local agents and free property valuations.' },
  appearance: {
    preset: 'haven', primaryColor: '#0f766e', accentColor: '#d4a373', backgroundColor: '#fbfaf7', surfaceColor: '#f2efe8', textColor: '#1b1f1d',
    darkBackgroundColor: '#0b1110', darkSurfaceColor: '#131c1a', darkTextColor: '#e9efec', headingFont: 'Fraunces', bodyFont: 'DM Sans',
    radius: 14, colorMode: 'light', headerStyle: 'glass', headerSticky: true, footerStyle: 'big', containerWidth: 1240, backToTop: true, blogLayout: 'grid',
    footerText: 'Licensed real estate brokerage.',
    headerCta: { enabled: true, label: 'Free valuation', url: '/valuation' },
    announcement: { enabled: false, text: '', linkLabel: '', url: '' },
  },
  menus: {
    header: {
      name: 'Main menu',
      items: [
        m('Home', '/'),
        m('Properties', '/properties', [
          m('Homes for sale', '/properties', [], { icon: 'Home', description: 'Houses, villas & townhomes' }),
          m('Homes for rent', '/properties', [], { icon: 'Key', description: 'Apartments & long lets' }),
          m('New developments', '/properties', [], { icon: 'Building', description: 'Off-plan & new builds', badge: 'New' }),
        ]),
        m('Sell', '/valuation'),
        m('Agents', '/about#agents'),
        m('Journal', '/blog'),
        m('Contact', '/contact'),
      ],
    },
    footer: { name: 'Explore', items: [m('Homes for sale', '/properties'), m('Homes for rent', '/properties'), m('Free valuation', '/valuation'), m('Market reports', '/blog')] },
    'footer-2': { name: 'Company', items: [m('About', '/about'), m('Our agents', '/about#agents'), m('FAQ', '/faq'), m('Contact', '/contact'), m('Privacy', '/privacy-policy')] },
  },
  pages: () => [
    {
      slug: 'haven-home', title: 'Home', home: true, template: 'full-width', seoTitle: 'Haven — Homes worth coming home to',
      blocks: [
        B('searchHero', {
          image: un(P.villa, 2200), overlay: 50, height: 'full', align: 'center', eyebrow: 'Over 1,200 hand-picked homes', title: 'Find a home that fits the way you live',
          subtitle: 'Buy, sell or rent with local experts who know every street, school and sunset.',
          tabs: ['Buy', 'Rent', 'New builds'], buttonLabel: 'Search homes', action: '/properties',
          fields: [
            { label: 'Location', icon: 'MapPin', type: 'text', placeholder: 'City, neighbourhood or ZIP', options: [] },
            { label: 'Property type', icon: 'Home', type: 'select', placeholder: 'Any type', options: ['House', 'Apartment', 'Villa', 'Townhouse', 'Loft'] },
            { label: 'Price', icon: 'Wallet', type: 'select', placeholder: 'Any price', options: ['Up to $500k', '$500k – $1M', '$1M – $2M', '$2M – $5M', '$5M+'] },
          ],
          stats: [{ value: '1,200+', label: 'Homes listed' }, { value: '$2.1B', label: 'Sold last year' }, { value: '98%', label: 'Happy clients' }],
        }, HERO),
        B('listingCards', { eyebrow: 'Featured properties', title: 'Homes we love this week', subtitle: '', variant: 'card', columns: 3, filters: true, buttonLabel: 'View all properties', buttonUrl: '/properties', items: FEATURED }, { paddingY: 'xl', width: 'wide' }),
        B('trustBar', { variant: 'strip', items: [
          { icon: 'BadgeCheck', title: 'Verified listings', text: 'Every home inspected by our team.' },
          { icon: 'Key', title: 'Virtual tours', text: '3D walkthroughs for most homes.' },
          { icon: 'Handshake', title: 'Expert negotiators', text: 'We average 4% above asking.' },
          { icon: 'Wallet', title: 'Mortgage support', text: 'Independent advice, free.' },
        ] }, { background: 'surface', paddingY: 'lg' }),
        B('listingCards', { eyebrow: 'Neighbourhoods', title: 'Explore where you could live', subtitle: 'From oceanfront villas to downtown lofts.', variant: 'overlay', columns: 4, filters: false, buttonLabel: '', buttonUrl: '', items: [
          { image: un(P.tropical, 900), badge: 'Coastal', category: 'California', title: 'Malibu', subtitle: 'Ocean views & privacy', price: '86 homes', period: '', rating: '', meta: ['Waves: Beachfront', 'School: Top schools'], url: '/properties' },
          { image: un(P.evening, 900), badge: 'Trending', category: 'Los Angeles', title: 'Westwood', subtitle: 'Modern family living', price: '142 homes', period: '', rating: '', meta: ['Car: 15 min to downtown', 'Leaf: Parks nearby'], url: '/properties' },
          { image: un(P.loft, 900), badge: 'Urban', category: 'Colorado', title: 'Denver Arts District', subtitle: 'Lofts & galleries', price: '64 homes', period: '', rating: '', meta: ['Coffee: Cafés & bars', 'Bike: Bike friendly'], url: '/properties' },
          { image: un(P.classic, 900), badge: 'Family', category: 'Connecticut', title: 'Greenwich', subtitle: 'Classic New England', price: '58 homes', period: '', rating: '', meta: ['School: Great schools', 'Leaf: Quiet streets'], url: '/properties' },
        ] }, { paddingY: 'xl', width: 'wide' }),
        B('accordionImage', { eyebrow: 'Selling with Haven', title: 'We sell homes faster — and for more', subtitle: '', imagePosition: 'right', autoplay: true, items: [
          { title: 'Accurate, data-led pricing', text: 'Our valuation model combines recent sales, live demand and local knowledge to price your home right from day one.', image: un(P.livingLux, 1200) },
          { title: 'Magazine-quality marketing', text: 'Professional photography, video, floor plans and a 3D tour — included with every listing.', image: un(P.interior, 1200) },
          { title: 'A buyer network ready to move', text: 'More than 18,000 pre-approved buyers receive our new listings before they go public.', image: un(P.kitchen, 1200) },
          { title: 'Negotiation that pays for itself', text: 'Our agents sell for an average of 4% above asking price.', image: un(P.glassPool, 1200) },
        ] }, { background: 'surface', paddingY: 'xl' }),
        B('stats', { items: [{ value: '1,200+', label: 'Homes listed' }, { value: '21', label: 'Days on market (avg.)' }, { value: '+4%', label: 'Above asking (avg.)' }, { value: '4.9/5', label: 'Client rating' }] }, { paddingY: 'lg' }),
        B('team', { eyebrow: 'Our agents', title: 'Local experts on your side', subtitle: 'Licensed, full-time and genuinely nice to work with.', variant: 'cards', columns: 4, members: AGENTS }, { background: 'surface', paddingY: 'xl', anchor: 'agents' }),
        B('testimonials', { eyebrow: 'Reviews', title: 'Stories from new homeowners' }, { paddingY: 'xl' }),
        B('ctaBanner', { variant: 'split', image: un(P.whiteVilla, 1400), eyebrow: 'Thinking of selling?', title: 'Get a free, no-obligation valuation', text: 'Find out what your home is worth in today’s market — usually within 24 hours.', primaryLabel: 'Book a valuation', primaryUrl: '/valuation', secondaryLabel: 'How we sell', secondaryUrl: '/about', phone: '+1 (310) 555-0172' }, { paddingY: 'lg', width: 'wide' }),
        B('latestPosts', { eyebrow: 'Journal', title: 'Market reports & home inspiration', count: 3, buttonLabel: 'Read the journal', buttonUrl: '/blog' }, { paddingY: 'xl' }),
      ],
    },
    {
      slug: 'properties', title: 'Properties', template: 'default', seoTitle: 'Properties for sale & rent — Haven',
      blocks: [
        B('searchHero', { image: un(P.poolVilla, 2000), overlay: 55, height: 'tall', align: 'left', eyebrow: 'Properties', title: 'Every home, one search', subtitle: '', tabs: ['Buy', 'Rent'], buttonLabel: 'Search', action: '/properties', fields: [
          { label: 'Location', icon: 'MapPin', type: 'text', placeholder: 'Anywhere', options: [] },
          { label: 'Bedrooms', icon: 'BedDouble', type: 'select', placeholder: 'Any', options: ['1+', '2+', '3+', '4+', '5+'] },
          { label: 'Price', icon: 'Wallet', type: 'select', placeholder: 'Any price', options: ['Up to $500k', '$500k – $1M', '$1M – $2M', '$2M+'] },
        ], stats: [] }, HERO),
        B('listingCards', { eyebrow: '', title: '', subtitle: '', variant: 'card', columns: 3, filters: true, buttonLabel: '', buttonUrl: '', items: [...FEATURED, ...MORE] }, { paddingY: 'xl', width: 'wide' }),
        B('ctaBanner', { variant: 'image', image: un(P.living, 1800), eyebrow: 'Can’t find it?', title: 'Tell us what you are looking for', text: 'Our agents hear about homes before they hit the market.', primaryLabel: 'Talk to an agent', primaryUrl: '/contact', phone: '+1 (310) 555-0172' }, { paddingY: 'lg', width: 'wide' }),
      ],
    },
    {
      slug: 'valuation', title: 'Free valuation', template: 'default', seoTitle: 'Free home valuation — Haven',
      blocks: [
        B('splitHero', { variant: 'arch', eyebrow: 'Sell with Haven', title: 'What is your home', highlight: 'really worth?', subtitle: 'Get an accurate, data-led valuation from a local expert — free and with no obligation.', bullets: ['Answer within 24 hours', 'In-person or virtual visit', 'Personal marketing plan', 'No obligation'], primaryLabel: 'Book a valuation', primaryUrl: '#book', secondaryLabel: '', secondaryUrl: '', image: un(P.tropical, 1000), image2: '', badges: [{ icon: 'TrendingUp', value: '+4%', label: 'Above asking (avg.)' }, { icon: 'Clock', value: '21', label: 'Days to sell (avg.)' }], proof: '600+ homes sold last year', avatars: [face('w2', 120), face('m6', 120), face('w4', 120)] }, { background: 'surface', paddingY: 'xl', animate: false }),
        B('steps', { eyebrow: 'How it works', title: 'From valuation to sold', variant: 'cards', items: [
          { icon: 'Calendar', title: 'Book a visit', text: 'Pick a time that suits you — in person or by video.' },
          { icon: 'LineChart', title: 'Get your valuation', text: 'A detailed report with comparable sales and a pricing strategy.' },
          { icon: 'Camera', title: 'Go to market', text: 'Photography, video and a launch to our buyer network.' },
          { icon: 'Key', title: 'Hand over the keys', text: 'We negotiate, manage the paperwork and get you to closing.' },
        ] }, { paddingY: 'xl' }),
        B('appointment', { eyebrow: 'Book online', title: 'Request your free valuation', text: 'Choose a time and one of our agents will visit your home.', serviceLabel: 'I would like', services: ['A free valuation', 'Advice on selling', 'A viewing of a listed home', 'Mortgage advice'], firstSlot: '09:00', lastSlot: '18:00', interval: 60, image: '', phone: '+1 (310) 555-0172', bullets: ['Accurate pricing based on live market data', 'A marketing plan tailored to your home', 'No fees unless we sell'] }, { background: 'surface', paddingY: 'xl', anchor: 'book' }),
        B('faq', { eyebrow: 'FAQ', title: 'Selling questions, answered' }, { paddingY: 'xl' }),
      ],
    },
    {
      slug: 'about', title: 'About', template: 'default', seoTitle: 'About Haven',
      blocks: [
        B('pageHeader', { title: 'About Haven', subtitle: 'An independent agency built on local knowledge, honest advice and beautiful marketing.' }, { background: 'surface', paddingY: 'lg', animate: false }),
        B('accordionImage', { eyebrow: 'Our approach', title: 'Real estate, done with care', subtitle: '', imagePosition: 'left', autoplay: true, items: [
          { title: 'Local, not national', text: 'Our agents live in the neighbourhoods they sell — and it shows in every negotiation.', image: un(P.suburban, 1200) },
          { title: 'Honest pricing', text: 'We would rather tell you the truth than win your listing with a number we cannot achieve.', image: un(P.kitchen2, 1200) },
          { title: 'Marketing that stands out', text: 'Every listing gets the photography, video and design it deserves.', image: un(P.chair, 1200) },
        ] }, { paddingY: 'xl' }),
        B('team', { eyebrow: 'Our agents', title: 'Meet the team', variant: 'portrait', columns: 4, members: AGENTS }, { background: 'surface', paddingY: 'xl', anchor: 'agents' }),
        B('logoWall', { title: 'As featured in', variant: 'grid', speed: 30, logos: ['Habitat Weekly', 'The Coastal Review', 'Modern Living', 'Property Times', 'Interiors Now', 'City Homes'].map((name) => ({ name, image: '', url: '' })) }, { paddingY: 'lg' }),
      ],
    },
    commonPages.privacy(),
  ],

  async demo(prisma, { authors }) {
    const cats = {};
    for (const [order, [name, color]] of [['Market report', '#0f766e'], ['Buying', '#d4a373'], ['Selling', '#b45309'], ['Design', '#64748b']].entries()) {
      cats[name] = await prisma.category.create({ data: { name, slug: slug(name), color, order } });
    }
    for (const [i, [cat, title, excerpt, img]] of POSTS.entries()) {
      const date = new Date(Date.now() - (i + 1) * 4 * 864e5);
      await prisma.post.create({
        data: {
          title, slug: slug(title), excerpt, content: body(title), coverImage: un(img, 1600), status: 'PUBLISHED', featured: i === 0,
          publishedAt: date, createdAt: date, readingTime: 4 + (i % 3), views: rand(200, 4000), authorId: authors[i % authors.length].id,
          categories: { connect: [{ id: cats[cat].id }] },
        },
      });
    }
    await prisma.testimonial.createMany({
      data: [
        { name: 'Rachel & Tom Bennett', position: 'Bought in Westwood', company: '', avatar: face('w7', 200), content: 'Isabella found us a home that was never even listed publicly. Calm, honest and brilliant at negotiating — we saved $60k.', rating: 5, order: 0 },
        { name: 'Marcus Lee', position: 'Sold in Malibu', company: '', avatar: face('m2', 200), content: 'Sold in 11 days, 6% over asking. The photography and video made our home look like a magazine cover.', rating: 5, order: 1 },
        { name: 'Ana Ferreira', position: 'Relocated to Austin', company: '', avatar: face('w1', 200), content: 'Grace organised viewings by video while I was still in Lisbon. I signed my lease before I even landed.', rating: 5, order: 2 },
      ],
    });
    await seedFaqs(prisma, [
      ['How much does a valuation cost?', 'Nothing. Valuations are free and come with no obligation to list with us.'],
      ['What are your selling fees?', 'Our fee is a percentage of the final sale price, agreed upfront. You pay nothing unless we sell.'],
      ['How long does it take to sell?', 'Our average is 21 days from listing to accepted offer, depending on the market and price point.'],
      ['Do you help with mortgages?', 'Yes — our independent mortgage partners compare lenders for you, free of charge.'],
      ['Can I view homes virtually?', 'Most of our listings include a 3D tour, and our agents can host live video viewings.'],
    ]);
  },
};
