/*
 * Section library for the client-ready business themes (Atlas, Haven, Forge, Vitalis, Sterling, Kinetic,
 * Wanderly, Scholar, Aurelia, Evergreen). Merged into THEME_SECTIONS / THEME_PAGE_DESIGNS in sections.js.
 */

// Verified Unsplash photo ids only.
const un = (id, w = 1600) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;
const S = (type, data = {}, style = {}) => ({ type, data, style });
const sec = (key, name, description, ...blocks) => ({ key, name, description, blocks });
const SURFACE = { background: 'surface' };
const words = (list) => list.map((name) => ({ name, image: '', url: '' }));
const rows = (group, list) => list.map(([feature, ...values]) => ({ group, feature, values }));
const FACE = {
  w1: '1438761681033-6461ffad8d80', w2: '1494790108377-be9c29b29330', w3: '1517841905240-472988babdf9', w4: '1544005313-94ddf0286df2', w5: '1573496359142-b8d87734a5a2', w6: '1573497019940-1c28c88b4f3e', w7: '1580489944761-15a19d654956',
  m1: '1472099645785-5658abf4ff4e', m2: '1500648767791-00dcc994a43e', m3: '1506794778202-cad84cf45f1d', m4: '1507679799987-c73779587ccf', m5: '1519085360753-af0119f7cbe7', m6: '1531427186611-ecfd6d936c79', m7: '1557862921-37829c790f19', m8: '1560250097-0b93528c311a',
};
const face = (k, w = 600) => un(FACE[k], w);
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

/* ================================== Atlas ================================== */
const atlas = [
  sec('atlas-intro', 'Page intro', 'Framed split hero with floating stats',
    S('splitHero', { variant: 'framed', eyebrow: 'Mergers & acquisitions', title: 'Buy, sell and merge', highlight: 'with confidence', subtitle: 'Senior-led advice from the first approach to the last day of integration.', bullets: ['Buy-side & sell-side', 'Valuation & due diligence', 'Post-merger integration', 'Fixed-fee options'], primaryLabel: 'Speak to a partner', primaryUrl: '/contact', secondaryLabel: '', secondaryUrl: '', image: un('1600880292089-90a7e086ee0c', 1200), badges: [{ icon: 'Handshake', value: '$9B', label: 'Deals closed' }, { icon: 'Clock', value: '11 wks', label: 'Avg. to close' }], proof: '', avatars: [] }, { ...SURFACE, paddingY: 'xl' })),
  sec('atlas-sectors', 'Industries', 'Image service cards for sectors',
    S('serviceCards', { eyebrow: 'Industries', title: 'Deep expertise where you operate', variant: 'image', columns: 3, items: [
      ['Truck', 'Logistics & transport', '1486406146926-c627a92ad1ab'], ['HeartPulse', 'Healthcare', '1551288049-bebda4e38f71'], ['Cpu', 'Technology', '1460925895917-afdab827c52f'],
    ].map(([icon, title, id]) => ({ icon, title, text: 'Sector specialists who know your market, regulators and competitors.', image: un(id, 900), url: '/contact', linkLabel: 'Learn more' })) })),
  sec('atlas-engagement', 'Engagement models', 'Comparison table',
    S('comparison', { eyebrow: 'Engagements', title: 'Ways to work with Atlas', columns: ['Diagnostic', 'Programme', 'Retainer'], highlight: 2, highlightLabel: 'Most chosen', groups: false, rows: rows('', [['Duration', '2 weeks', '3 – 9 months', 'Ongoing'], ['Partner involvement', 'Weekly', 'Daily', 'Monthly board'], ['Implementation support', 'no', 'yes', 'yes'], ['Pricing', 'Fixed fee', 'Fixed + success fee', 'Monthly fee']]), buttons: [{ label: 'Book', url: '/contact' }, { label: 'Discuss', url: '/contact' }, { label: 'Enquire', url: '/contact' }] }, SURFACE)),
  sec('atlas-results', 'Case studies', 'Sticky stacking result cards',
    S('caseStudies', { eyebrow: 'Results', title: 'Recent engagements', variant: 'stack', items: [
      { image: un('1542744173-8e7e53415bb0', 1400), client: 'Crestline Foods', title: 'A new growth strategy that doubled export revenue', text: 'Market prioritisation, pricing and a distributor programme across eight countries.', metrics: [{ value: '2x', label: 'Export revenue' }, { value: '8', label: 'New markets' }], tags: ['Strategy'], url: '/contact' },
      { image: un('1531482615713-2afd69097998', 1400), client: 'Vantage Group', title: 'Cutting operating costs without cutting corners', text: 'Process redesign and automation across finance, HR and procurement.', metrics: [{ value: '-22%', label: 'Operating costs' }, { value: '6 mo', label: 'Payback' }], tags: ['Operations'], url: '/contact' },
    ] }, { paddingY: 'xl' })),
  sec('atlas-cta', 'Consultation banner', 'Image CTA with phone number',
    S('ctaBanner', { variant: 'image', image: un('1560179707-f14e90ef3623', 1800), eyebrow: 'Free 30-minute call', title: 'Talk to a partner this week', text: 'Confidential, no obligation.', primaryLabel: 'Book a call', primaryUrl: '/contact', phone: '+1 (212) 555-0148' }, { width: 'wide' })),
  sec('atlas-trust', 'Trust bar', 'Overlapping highlights card',
    S('trustBar', { variant: 'overlap', items: [{ icon: 'ShieldCheck', title: 'Independent', text: 'No commissions, ever.' }, { icon: 'Users', title: 'Senior-led', text: 'Partners on every project.' }, { icon: 'Globe', title: '14 countries', text: 'Local teams, global reach.' }] }, { paddingY: 'sm' })),
];

/* ================================== Haven ================================== */
const haven = [
  sec('haven-search', 'Property search', 'Full-bleed search hero with tabs',
    S('searchHero', { image: un('1600596542815-ffad4c1539a9', 2200), overlay: 45, height: 'tall', align: 'center', eyebrow: 'Luxury collection', title: 'Exceptional homes, privately presented', tabs: ['Buy', 'Rent'], buttonLabel: 'Search', action: '/properties', fields: [{ label: 'Location', icon: 'MapPin', type: 'text', placeholder: 'Anywhere', options: [] }, { label: 'Budget', icon: 'Wallet', type: 'select', placeholder: 'Any', options: ['$1M – $2M', '$2M – $5M', '$5M+'] }], stats: [] }, { paddingY: 'none', width: 'full' })),
  sec('haven-luxury', 'Luxury listings', 'Overlay property cards',
    S('listingCards', { eyebrow: 'The luxury collection', title: 'Homes beyond the ordinary', variant: 'overlay', columns: 3, filters: false, items: [
      ['1613977257363-707ba9348227', 'Bel Air Contemporary', 'Los Angeles', '$8,950,000'], ['1580587771525-78b9dba3b914', 'Ocean Terrace Villa', 'Miami Beach', '$6,400,000'], ['1600585154340-be6161a56a0c', 'Canyon Glass House', 'Malibu', '$7,200,000'],
    ].map(([id, title, subtitle, price]) => ({ image: un(id, 900), badge: 'Exclusive', category: 'For sale', title, subtitle, price, period: '', rating: '', meta: ['BedDouble: 6 beds', 'Bath: 7 baths', 'Waves: Pool'], url: '/contact' })) }, { paddingY: 'xl', width: 'wide' })),
  sec('haven-mortgage', 'Mortgage advice', 'Split CTA with phone',
    S('ctaBanner', { variant: 'split', image: un('1556912173-3bb406ef7e77', 1400), eyebrow: 'Mortgages', title: 'Find the right mortgage in one call', text: 'Our independent advisers compare 90+ lenders for you — free.', primaryLabel: 'Book a call', primaryUrl: '/contact', phone: '+1 (310) 555-0172' }, { width: 'wide' })),
  sec('haven-buying', 'Buying steps', 'Four-step timeline',
    S('steps', { eyebrow: 'Buying with Haven', title: 'Your keys in four steps', variant: 'timeline', items: [{ icon: 'Search', title: 'Search', text: 'Tell us what matters and get matched homes.' }, { icon: 'Home', title: 'View', text: 'In person or by live video tour.' }, { icon: 'Handshake', title: 'Offer', text: 'We negotiate the best price and terms.' }, { icon: 'Key', title: 'Move in', text: 'We manage everything through to closing.' }] }, SURFACE)),
  sec('haven-agents', 'Agents', 'Portrait team grid',
    S('team', { eyebrow: 'Agents', title: 'Your local experts', variant: 'portrait', columns: 3, members: [{ name: 'Isabella Cruz', role: 'Luxury homes', image: face('w2') }, { name: 'Ethan Brooks', role: 'Buyer’s agent', image: face('m6') }, { name: 'Grace Whitfield', role: 'Rentals', image: face('w4') }] })),
  sec('haven-valuation', 'Valuation booking', 'Appointment form',
    S('appointment', { eyebrow: 'Free valuation', title: 'What is your home worth?', text: 'Book a visit with a local agent.', serviceLabel: 'I would like', services: ['A free valuation', 'Advice on selling', 'Rental appraisal'], firstSlot: '09:00', lastSlot: '18:00', interval: 60, phone: '+1 (310) 555-0172', bullets: ['Answer within 24 hours', 'No obligation'] }, SURFACE)),
];

/* ================================== Forge ================================== */
const forge = [
  sec('forge-transform', 'Transformation', 'Before / after slider',
    S('beforeAfter', { eyebrow: 'Transformation', title: '12 weeks. Real results.', text: 'Drag to see what consistent, coached training can do.', before: `${un('1574680096145-d05b474e2155', 1600)}&sat=-100`, after: un('1574680096145-d05b474e2155', 1600), beforeLabel: 'Week 1', afterLabel: 'Week 12', start: 50, layout: 'split', ratio: '4/3' })),
  sec('forge-timetable', 'Class timetable', 'Day tabs with sessions',
    S('schedule', { eyebrow: 'Timetable', title: 'Weekend classes', buttonLabel: 'Book', buttonUrl: '/membership', days: [
      { label: 'Saturday', sessions: [{ time: '08:00', title: 'Team WOD', host: 'All coaches', location: '60 min', tag: 'Community' }, { time: '11:00', title: 'Slow Flow Yoga', host: 'Coach Lena', location: '60 min', tag: '' }] },
      { label: 'Sunday', sessions: [{ time: '09:00', title: 'Recovery & Mobility', host: 'Coach Lena', location: '45 min', tag: 'Recovery' }, { time: '10:30', title: 'Open Boxing', host: 'Coach Dre', location: '90 min', tag: '' }] },
    ] })),
  sec('forge-programs', 'Program tiles', 'Icon tiles that fill on hover',
    S('serviceCards', { eyebrow: 'Programs', title: 'Pick your path', variant: 'icon', columns: 4, items: [['Dumbbell', 'Strength'], ['Flame', 'HIIT'], ['Target', 'Boxing'], ['Leaf', 'Yoga']].map(([icon, title]) => ({ icon, title, text: 'Coached classes for every level, every day.', image: '', url: '/classes', linkLabel: 'View classes' })) })),
  sec('forge-marquee', 'Word marquee', 'Giant scrolling words',
    S('textMarquee', { items: ['Lift', 'Sweat', 'Recover', 'Repeat'], speed: 26, twoRows: false }, { background: 'dark', paddingY: 'md', width: 'full' })),
  sec('forge-challenge', 'Challenge countdown', 'Countdown over an image',
    S('countdown', { eyebrow: 'New challenge', title: 'The 6-week strength block', text: 'A structured program, weekly testing and a community cheering you on.', date: '2027-02-02T06:00', variant: 'image', image: un('1605296867304-46d5465a13f1', 2000), buttonLabel: 'Join the challenge', buttonUrl: '/contact' }, { width: 'wide' })),
  sec('forge-free-week', 'Free week banner', 'Image CTA',
    S('ctaBanner', { variant: 'image', image: un('1517963879433-6ad2b056d712', 1800), eyebrow: 'Free week', title: 'Train with us for 7 days — on us', primaryLabel: 'Claim your pass', primaryUrl: '/membership', phone: '+1 (646) 555-0119' }, { width: 'wide' })),
];

/* ================================== Vitalis ================================== */
const vitalis = [
  sec('vitalis-checkups', 'Health check packages', 'Pricing cards for check-ups',
    S('pricing', { eyebrow: 'Health checks', title: 'Preventive check-up packages', plans: [
      { name: 'Essential', price: '$149', period: '', description: 'For adults under 40', features: ['Doctor consultation', 'Blood panel', 'Blood pressure & BMI'], buttonLabel: 'Book', buttonUrl: '/appointments', highlighted: false },
      { name: 'Complete', price: '$349', period: '', description: 'Our most comprehensive check', features: ['Everything in Essential', 'ECG & heart screening', 'Ultrasound', 'Nutrition review'], buttonLabel: 'Book', buttonUrl: '/appointments', highlighted: true },
      { name: 'Executive', price: '$690', period: '', description: 'Full-day assessment', features: ['Everything in Complete', 'Stress test', 'Specialist reviews', 'Same-day results'], buttonLabel: 'Book', buttonUrl: '/appointments', highlighted: false },
    ] }, SURFACE)),
  sec('vitalis-doctors', 'Doctors', 'Round avatars with bios',
    S('team', { eyebrow: 'Our doctors', title: 'Specialists who listen', variant: 'round', columns: 3, members: [
      { name: 'Dr. Sarah Mitchell', role: 'Family Medicine', image: un('1559839734-2b71ea197ec2', 600) }, { name: 'Dr. James Carter', role: 'Cardiology', image: un('1612349317150-e413f6a5b16d', 600) }, { name: 'Dr. Raj Patel', role: 'Pediatrics', image: un('1622253692010-333f2da6031d', 600) },
    ] })),
  sec('vitalis-booking', 'Appointment booking', 'Department, date & time slots',
    S('appointment', { eyebrow: 'Appointments', title: 'Book online in a minute', serviceLabel: 'Department', services: ['General practice', 'Cardiology', 'Pediatrics', 'Dental care'], firstSlot: '08:00', lastSlot: '18:00', interval: 30, phone: '+1 (555) 014-2200', bullets: ['Same-day slots', 'Video consultations'] })),
  sec('vitalis-hours', 'Opening hours', 'Live “open now” + location',
    S('hours', { eyebrow: 'Visit us', title: 'Clinic hours', image: un('1519494026892-80bbd2d6fd0d', 1200), rows: DAYS.map((day) => ({ day, open: '08:00', close: '20:00', closed: day === 'Sunday' })) }, SURFACE)),
  sec('vitalis-emergency', 'Emergency banner', 'Split CTA with phone',
    S('ctaBanner', { variant: 'split', image: un('1579684385127-1ef15d508118', 1400), eyebrow: '24/7 urgent care', title: 'Need care right now?', text: 'Walk in any time — no appointment needed.', primaryLabel: 'Get directions', primaryUrl: '/contact', phone: '+1 (555) 014-2200' }, { width: 'wide' })),
  sec('vitalis-trust', 'Trust highlights', 'Pill badges',
    S('trustBar', { variant: 'pills', items: [{ icon: 'ShieldCheck', title: 'Insurance accepted' }, { icon: 'Clock', title: 'Same-day appointments' }, { icon: 'Microscope', title: 'On-site lab' }, { icon: 'Laptop', title: 'Online results' }] }, { paddingY: 'md' })),
];

/* ================================== Sterling ================================== */
const sterling = [
  sec('sterling-practice', 'Practice areas', 'Numbered rows with hover images',
    S('serviceCards', { eyebrow: 'Practice areas', title: 'How we can help', variant: 'rows', items: [
      ['Corporate & commercial', '1542744173-8e7e53415bb0'], ['Litigation & disputes', '1575505586569-646b2ca898fc'], ['Family law', '1450101499163-c8848c66ca85'], ['Real estate', '1486406146926-c627a92ad1ab'],
    ].map(([title, id]) => ({ icon: 'Scale', title, text: 'Experienced counsel focused on practical, cost-effective outcomes.', image: un(id, 600), url: '/consultation', linkLabel: '' })) })),
  sec('sterling-results', 'Notable results', 'Case result cards',
    S('caseStudies', { eyebrow: 'Results', title: 'Recent outcomes', variant: 'grid', items: [
      { image: un('1453945619913-79ec89a82c51', 1200), client: 'Appeals', title: 'Appellate win restores a $6M judgment', text: 'The court reversed on all grounds after our appellate team took over.', metrics: [{ value: '$6M', label: 'Judgment restored' }, { value: '3-0', label: 'Panel decision' }], tags: ['Litigation'] },
      { image: un('1521791055366-0d553872125f', 1200), client: 'Employment', title: 'Executive severance negotiated without litigation', text: 'A confidential settlement secured in under four weeks.', metrics: [{ value: '4 wks', label: 'To resolution' }, { value: '2.5x', label: 'Initial offer' }], tags: ['Employment'] },
    ] }, SURFACE)),
  sec('sterling-consult', 'Consultation form', 'Practice area booking form',
    S('appointment', { eyebrow: 'Free consultation', title: 'Speak with an attorney', serviceLabel: 'Practice area', services: ['Corporate', 'Litigation', 'Family law', 'Real estate', 'Employment', 'Immigration'], firstSlot: '09:00', lastSlot: '17:30', interval: 30, phone: '+1 (312) 555-0190', bullets: ['First 30 minutes free', 'Strictly confidential'] })),
  sec('sterling-history', 'Firm history', 'Timeline of milestones',
    S('timeline', { eyebrow: 'Our history', title: 'Nearly four decades', items: [{ period: '1987', title: 'Founded in Chicago', org: '', location: '', description: '', bullets: [], tags: [] }, { period: '2005', title: 'Federal appellate practice opens', org: '', location: '', description: '', bullets: [], tags: [] }, { period: '2026', title: 'Law Firm of the Year', org: '', location: '', description: '', bullets: [], tags: [] }] }, { width: 'narrow' })),
  sec('sterling-partners', 'Partners', 'Portrait grid',
    S('team', { eyebrow: 'Partners', title: 'Your legal team', variant: 'portrait', columns: 4, members: [{ name: 'Victoria Sterling', role: 'Litigation', image: face('w5') }, { name: 'Robert Vale', role: 'Corporate', image: face('m8') }, { name: 'Amelia Ward', role: 'Family law', image: face('w6') }, { name: 'Henry Okafor', role: 'Real estate', image: face('m5') }] })),
  sec('sterling-cta', 'Consultation banner', 'Split CTA',
    S('ctaBanner', { variant: 'split', image: un('1589829545856-d10d557cf95f', 1400), eyebrow: 'Confidential', title: 'Discuss your matter with a partner', primaryLabel: 'Request a consultation', primaryUrl: '/consultation', phone: '+1 (312) 555-0190' }, { width: 'wide' })),
];

/* ================================== Kinetic ================================== */
const kinetic = [
  sec('kinetic-hero', 'Kinetic headline', 'Giant type with rotating word',
    S('kineticHero', { eyebrow: 'Services', lines: ['Design that'], rotate: ['performs.', 'converts.', 'lasts.'], subtitle: 'Strategy, identity and digital — under one roof.', primaryLabel: 'Start a project', primaryUrl: '/contact', image: un('1618005182384-a83a8bd57fbe', 500), badge: 'Let’s talk ✦ Let’s talk ✦ ', marquee: [] }, { paddingY: 'lg', width: 'wide' })),
  sec('kinetic-cases', 'Case study stack', 'Sticky stacking project cards',
    S('caseStudies', { eyebrow: 'Work', title: 'Recent launches', variant: 'stack', items: [
      { image: un('1634017839464-5c339ebe3cb4', 1400), client: 'Polar', title: 'A climate brand that feels optimistic', text: 'Identity, website and launch film.', metrics: [{ value: '+150%', label: 'Sign-ups' }, { value: '2', label: 'Awards' }], tags: ['Brand', 'Web'], url: '/contact' },
      { image: un('1557672172-298e090bd0f1', 1400), client: 'Helix', title: 'Packaging that sold out in a week', text: 'A tactile, colourful system for a wellness range.', metrics: [{ value: '100%', label: 'Sell-through' }, { value: '7 days', label: 'To sell out' }], tags: ['Packaging'], url: '/contact' },
    ] }, { paddingY: 'xl', width: 'wide' })),
  sec('kinetic-services', 'Service rows', 'Numbered rows with hover thumbnails',
    S('serviceCards', { eyebrow: 'Capabilities', title: 'What we make', variant: 'rows', items: [['Brand identity', '1561070791-2526d30994b5'], ['Websites', '1542744094-3a31f272c490'], ['Motion', '1558655146-9f40138edfeb']].map(([title, id]) => ({ icon: 'PenTool', title, text: 'Crafted end to end by a senior, multidisciplinary team.', image: un(id, 600), url: '/contact', linkLabel: '' })) }, { width: 'wide' })),
  sec('kinetic-clients', 'Client grid', 'Bordered logo grid',
    S('logoWall', { title: 'Selected clients', variant: 'grid', logos: words(['Lumen', 'Orbit', 'Tidal', 'Bloom', 'Polar', 'Helix', 'Quanta', 'Vertex']) }, { width: 'wide' })),
  sec('kinetic-jobs', 'Careers', 'Filterable openings',
    S('jobs', { eyebrow: 'Careers', title: 'Make great work with us', applyEmail: 'jobs@kinetic.studio', items: [{ title: 'Brand Designer', department: 'Design', location: 'London', type: 'Full-time', description: 'Craft identities for ambitious brands.', url: '' }, { title: 'Producer', department: 'Production', location: 'London', type: 'Full-time', description: 'Keep projects on time, on budget and fun.', url: '' }] }, SURFACE)),
  sec('kinetic-cta', 'Project banner', 'Split CTA with gradient',
    S('ctaBanner', { variant: 'split', image: un('1604079628040-94301bb21b91', 1400), eyebrow: 'New business', title: 'Let’s make something bold', primaryLabel: 'Start a project', primaryUrl: '/contact' }, { width: 'wide' })),
];

/* ================================== Wanderly ================================== */
const wanderly = [
  sec('wanderly-search', 'Trip search', 'Search hero with trip tabs',
    S('searchHero', { image: un('1501785888041-af3ef285b470', 2200), overlay: 40, height: 'tall', align: 'center', eyebrow: 'Plan your escape', title: 'Where will you wake up next?', tabs: ['Tours', 'Tailor-made'], buttonLabel: 'Find trips', action: '/tours', fields: [{ label: 'Destination', icon: 'MapPin', type: 'text', placeholder: 'Where to?', options: [] }, { label: 'When', icon: 'Calendar', type: 'date', placeholder: '', options: [] }], stats: [] }, { paddingY: 'none', width: 'full' })),
  sec('wanderly-tours', 'Tour cards', 'Bookable tours with ratings',
    S('listingCards', { eyebrow: 'Small-group tours', title: 'Departing soon', variant: 'card', columns: 3, filters: false, items: [
      ['1523906834658-6e24ef2386f9', 'Italian Lakes & Venice', 'Milan · Como · Venice', '$2,690'], ['1502602898657-3e91760cbb34', 'Paris & Provence', 'Paris · Avignon · Nice', '$2,450'], ['1540959733332-eab4deabeeaf', 'Tokyo After Dark', 'Tokyo · Nikko', '$1,990'],
    ].map(([id, title, subtitle, price]) => ({ image: un(id, 1000), badge: 'Few spots left', category: 'Culture', title, subtitle, price, period: ' / person', rating: '4.9', meta: ['Clock: 8 days', 'Users: Max 12'], url: '/contact' })) }, { paddingY: 'xl', width: 'wide' })),
  sec('wanderly-destinations', 'Destination carousel', 'Swipeable overlay cards',
    S('cardCarousel', { eyebrow: 'Inspiration', title: 'Dream destinations', cardStyle: 'overlay', items: [['1570077188670-e3a8d69ac5ff', 'Greece', 'Santorini'], ['1537996194471-e657df975ab4', 'Indonesia', 'Bali'], ['1526392060635-9d6019884377', 'Peru', 'Machu Picchu'], ['1514282401047-d79a71a590e8', 'Maldives', 'Malé'], ['1530789253388-582c481c54b0', 'Türkiye', 'Cappadocia']].map(([id, tag, title]) => ({ image: un(id, 900), tag, title, text: 'Explore tours', url: '/tours' })) }, { width: 'wide' })),
  sec('wanderly-gallery', 'Travel gallery', 'Masonry photo wall',
    S('masonryGallery', { eyebrow: 'Gallery', title: 'Through our travellers’ eyes', columns: 4, filters: false, items: ['1506929562872-bb421503ef21', '1516483638261-f4dbaf036963', '1464822759023-fed622ff2c3b', '1528127269322-539801943592', '1539020140153-e479b8c22e70', '1507525428034-b723cf961d3e', '1499856871958-5b9627545d1a', '1504893524553-b855bce32c67'].map((id) => ({ src: un(id, 800), title: '', category: '', caption: '' })) }, { width: 'wide' })),
  sec('wanderly-itinerary', 'Day-by-day itinerary', 'Schedule tabs as an itinerary',
    S('schedule', { eyebrow: 'Itinerary', title: 'Greek Island Hopping — day by day', buttonLabel: '', buttonUrl: '', hostIcon: 'Sparkles', locationIcon: 'Clock', days: [
      { label: 'Days 1–3', sessions: [{ time: 'Day 1', title: 'Arrive in Athens', host: 'Welcome dinner in Plaka', location: 'Overnight in Athens', tag: '' }, { time: 'Day 2', title: 'Acropolis & Agora', host: 'Guided by an archaeologist', location: 'Full day', tag: 'Highlight' }, { time: 'Day 3', title: 'Ferry to Mykonos', host: 'Sunset in Little Venice', location: '4 hrs by ferry', tag: '' }] },
      { label: 'Days 4–7', sessions: [{ time: 'Day 4', title: 'Delos island', host: 'Ancient ruins by boat', location: 'Half day', tag: '' }, { time: 'Day 6', title: 'Santorini caldera', host: 'Catamaran & swim stops', location: 'Full day', tag: 'Highlight' }] },
    ] }, SURFACE)),
  sec('wanderly-sale', 'Sale countdown', 'Countdown over a beach image',
    S('countdown', { eyebrow: 'Flash sale', title: '48 hours: up to 25% off', date: '2027-01-15T23:59', variant: 'image', image: un('1519046904884-53103b34b206', 2000), buttonLabel: 'Shop the sale', buttonUrl: '/tours' }, { width: 'wide' })),
];

/* ================================== Scholar ================================== */
const scholar = [
  sec('scholar-hero', 'Course hero', 'Collage hero with stats',
    S('splitHero', { variant: 'collage', eyebrow: 'Career track', title: 'Become a data analyst', highlight: 'in 16 weeks', subtitle: 'Live classes, real projects and a mentor — with a job guarantee.', bullets: ['Python & SQL', 'Dashboards & storytelling', 'Weekly mentor calls', 'Job guarantee'], primaryLabel: 'Apply now', primaryUrl: '/contact', image: un('1522202176988-66273c2fd55f', 1000), image2: un('1551288049-bebda4e38f71', 700), badges: [{ icon: 'TrendingUp', value: '87%', label: 'Hired in 6 months' }, { icon: 'Star', value: '4.9/5', label: 'Course rating' }], proof: '', avatars: [] }, { background: 'gradient', paddingY: 'xl' })),
  sec('scholar-courses', 'Course cards', 'Filterable course listings',
    S('listingCards', { eyebrow: 'Short courses', title: 'Learn something new this month', variant: 'card', columns: 3, filters: true, items: [
      ['1561070791-2526d30994b5', 'Design', 'Colour Theory for Designers', '$79'], ['1559028012-481c04fa702d', 'Development', 'TypeScript in a Weekend', '$99'], ['1460925895917-afdab827c52f', 'Data', 'Excel to Python', '$89'],
    ].map(([id, category, title, price]) => ({ image: un(id, 1000), badge: '', category, title, subtitle: 'Self-paced', price, period: '', rating: '4.8', meta: ['BookOpen: 12 lessons', 'Clock: 2 weeks'], url: '/contact' })) })),
  sec('scholar-curriculum', 'Curriculum', 'Week-by-week schedule tabs',
    S('schedule', { eyebrow: 'Curriculum', title: 'What you will learn', buttonLabel: '', buttonUrl: '', hostIcon: 'BookOpen', locationIcon: 'Clock', days: [
      { label: 'Month 1', sessions: [{ time: 'Wk 1', title: 'Foundations of data', host: 'Spreadsheets & thinking in data', location: '6 hrs', tag: '' }, { time: 'Wk 2', title: 'SQL essentials', host: 'Queries, joins & aggregations', location: '8 hrs', tag: 'Project' }] },
      { label: 'Month 2', sessions: [{ time: 'Wk 5', title: 'Python for analysis', host: 'Pandas & notebooks', location: '8 hrs', tag: '' }, { time: 'Wk 7', title: 'Visualisation', host: 'Dashboards that tell stories', location: '6 hrs', tag: 'Project' }] },
    ] }, SURFACE)),
  sec('scholar-instructors', 'Instructors', 'Cards with sliding bios',
    S('team', { eyebrow: 'Instructors', title: 'Taught by practitioners', variant: 'cards', columns: 3, members: [{ name: 'Hannah Cole', role: 'Product Design', image: face('w5') }, { name: 'Daniel Moss', role: 'Engineering', image: face('m7') }, { name: 'Priya Raman', role: 'Data Science', image: face('w7') }] })),
  sec('scholar-cohort', 'Cohort countdown', 'Countdown cards',
    S('countdown', { eyebrow: 'Next cohort', title: 'Applications close in', date: '2027-02-20T23:59', variant: 'cards', buttonLabel: 'Apply now', buttonUrl: '/contact' }, { background: 'gradient', paddingY: 'xl' })),
  sec('scholar-teams', 'For teams', 'Image CTA',
    S('ctaBanner', { variant: 'image', image: un('1524178232363-1fb2b075b655', 1800), eyebrow: 'Scholar for Teams', title: 'Upskill your whole team', text: 'Custom learning paths, live workshops and reporting.', primaryLabel: 'Talk to sales', primaryUrl: '/contact' }, { width: 'wide' })),
];

/* ================================== Aurelia ================================== */
const aurelia = [
  sec('aurelia-welcome', 'Welcome statement', 'Large serif statement',
    S('luxeStatement', { overline: 'Since 1898', text: 'Some places are visited. Others are remembered. We hope Aurelia becomes one of yours.', signature: 'The Aurelia family' }, { paddingY: 'xl' })),
  sec('aurelia-rooms', 'Room cards', 'Rooms with nightly rates',
    S('listingCards', { eyebrow: 'Stay', title: 'Suites with a view', variant: 'card', columns: 3, filters: false, items: [['1578683010236-d716f9a3f461', 'Panorama Suite', '$780'], ['1611892440504-42a792e24d32', 'Terrace Suite', '$520'], ['1631049307264-da0ec9d70304', 'Garden Room', '$340']].map(([id, title, price]) => ({ image: un(id, 1000), badge: '', category: 'Rooms', title, subtitle: 'Breakfast & spa included', price, period: ' / night', rating: '', meta: ['BedDouble: King bed', 'Users: 2 guests'], url: '/rooms' })) }, { paddingY: 'xl', width: 'wide' })),
  sec('aurelia-spa', 'Spa feature', 'Framed split with number',
    S('luxeSplit', { number: '03', overline: 'Wellness', title: 'The thermal journey', text: 'Cedar sauna, steam room, plunge pool and a relaxation lounge overlooking the lake.\n\nIncluded for every hotel guest.', image: un('1600334089648-b0d9d3028eb2', 1200), imagePosition: 'left', buttonLabel: 'Discover the spa', buttonUrl: '/spa' }, { paddingY: 'xl', width: 'wide' })),
  sec('aurelia-reserve', 'Reservation request', 'Room & arrival booking form',
    S('appointment', { eyebrow: 'Reservations', title: 'Request your stay', serviceLabel: 'Room', services: ['Garden Room', 'Terrace Suite', 'Panorama Suite', 'The Lake Pavilion'], firstSlot: '14:00', lastSlot: '22:00', interval: 60, phone: '+41 91 555 01 98', bullets: ['Best rate guaranteed', 'Free cancellation up to 7 days'] }, SURFACE)),
  sec('aurelia-experiences', 'Experiences', 'Frosted-glass carousel',
    S('cardCarousel', { eyebrow: 'Experiences', title: 'Curated for you', cardStyle: 'glass', items: [['1584132967334-10e028bd69f7', 'Wellness', 'Sunrise yoga'], ['1514933651103-005eec06c04b', 'Evenings', 'Aperitivo hour'], ['1544161515-4ab6ce6db874', 'Spa', 'Couples ritual'], ['1520250497591-112f2f40a3f4', 'Summer', 'Boat trips']].map(([id, tag, title]) => ({ image: un(id, 900), tag, title, text: 'Ask our concierge to arrange.', url: '/contact' })) }, { width: 'wide' })),
  sec('aurelia-cta', 'Parallax invitation', 'Fixed-background CTA',
    S('luxeCta', { image: un('1551882547-ff40c63fe5fa', 2000), overline: 'Book direct', title: 'Your lakeside escape awaits', buttonLabel: 'Reserve', buttonUrl: '/rooms#book' }, { paddingY: 'none', width: 'full' })),
];

/* ================================== Evergreen ================================== */
const evergreen = [
  sec('evergreen-donate', 'Donation widget', 'Goal progress, amounts & impact',
    S('donation', { eyebrow: 'Give monthly', title: 'Become a monthly champion', text: 'Regular gifts let us plan ahead and respond fastest in emergencies.', image: un('1497486751825-1233686d5d80', 1000), currency: '$', goal: 100000, raised: 61200, supporters: 1240, amounts: ['10', '25', '50', '100'], impact: [{ amount: '10', text: 'gives a child clean water for a year' }, { amount: '25', text: 'funds a week of school meals' }, { amount: '50', text: 'plants 50 trees' }, { amount: '100', text: 'feeds a family for a month' }], monthly: true, buttonLabel: 'Give', url: '/donate' })),
  sec('evergreen-programs', 'Programme rows', 'Numbered programme list',
    S('serviceCards', { eyebrow: 'Our work', title: 'Where your gift goes', variant: 'rows', items: [['Droplets', 'Clean water', '1501785888041-af3ef285b470'], ['School', 'Education', '1529390079861-591de354faf5'], ['Sprout', 'Reforestation', '1466692476868-aef1dfb1e735']].map(([icon, title, id]) => ({ icon, title, text: 'Designed with communities and measured honestly every year.', image: un(id, 600), url: '/programs', linkLabel: '' })) })),
  sec('evergreen-events', 'Events calendar', 'Month tabs with events',
    S('schedule', { eyebrow: 'Events', title: 'Upcoming events', buttonLabel: 'Join', buttonUrl: '/get-involved', hostIcon: 'MapPin', locationIcon: 'Clock', days: [{ label: 'This month', sessions: [{ time: '14 Nov', title: 'Volunteer Planting Day', host: 'Riverside Park', location: '09:00 – 13:00', tag: 'Volunteers' }, { time: '22 Nov', title: 'Community Supper', host: 'Main hall', location: '18:00', tag: '' }] }, { label: 'Next month', sessions: [{ time: '6 Dec', title: 'Winter Food Drive', host: 'All hubs', location: 'All day', tag: 'Donate' }] }] }, SURFACE)),
  sec('evergreen-stories', 'Impact stories', 'Story cards with metrics',
    S('caseStudies', { eyebrow: 'Impact', title: 'Stories from the field', variant: 'grid', items: [
      { image: un('1509099836639-18ba1795216d', 1200), client: 'Water · Kenya', title: 'Clean water reaches 12 more villages', text: 'New wells and hygiene training now serve 9,000 people.', metrics: [{ value: '9,000', label: 'People served' }, { value: '12', label: 'Villages' }], tags: ['Water'] },
      { image: un('1416879595882-3373a0480b5b', 1200), client: 'Forests · Peru', title: 'Farmers restore 400 hectares of land', text: 'Native trees bring back soil, shade and income.', metrics: [{ value: '120,000', label: 'Trees' }, { value: '400 ha', label: 'Restored' }], tags: ['Forests'] },
    ] })),
  sec('evergreen-volunteer', 'Volunteer roles', 'Filterable openings',
    S('jobs', { eyebrow: 'Volunteer', title: 'Lend a hand', applyEmail: 'volunteer@evergreen-foundation.example', items: [{ title: 'Event Volunteer', department: 'Events', location: 'Portland', type: 'Flexible', description: 'Help run our runs, galas and community days.', url: '' }, { title: 'Translator', department: 'Communications', location: 'Remote', type: 'Flexible', description: 'Translate stories and reports into Spanish or French.', url: '' }] })),
  sec('evergreen-trust', 'Trust card', 'Overlapping highlights',
    S('trustBar', { variant: 'overlap', items: [{ icon: 'PieChart', title: '92% to programmes', text: 'Audited every year.' }, { icon: 'BadgeCheck', title: 'Transparent', text: 'Every dollar reported.' }, { icon: 'Users', title: 'Community-led', text: 'Local partners, local leaders.' }] }, { paddingY: 'sm' })),
];

export const BUSINESS_SECTIONS = { atlas, haven, forge, vitalis, sterling, kinetic, wanderly, scholar, aurelia, evergreen };

export const BUSINESS_PAGE_DESIGNS = {
  atlas: [
    { key: 'service', label: 'Service page', sections: ['atlas-intro', 'atlas-trust', 'atlas-sectors', 'atlas-results', 'atlas-cta'] },
    { key: 'engage', label: 'How we engage', sections: ['header', 'atlas-engagement', 'atlas-results', 'atlas-cta'] },
  ],
  haven: [
    { key: 'luxury', label: 'Luxury collection', sections: ['haven-search', 'haven-luxury', 'haven-agents', 'haven-mortgage'] },
    { key: 'buy', label: 'Buying guide', sections: ['header', 'haven-buying', 'haven-mortgage', 'haven-valuation'] },
  ],
  forge: [
    { key: 'challenge', label: 'Challenge landing', sections: ['forge-challenge', 'forge-transform', 'forge-programs', 'forge-free-week'] },
    { key: 'weekend', label: 'Weekend classes', sections: ['header', 'forge-marquee', 'forge-timetable', 'forge-free-week'] },
  ],
  vitalis: [
    { key: 'checkups', label: 'Health checks', sections: ['header', 'vitalis-trust', 'vitalis-checkups', 'vitalis-booking'] },
    { key: 'visit', label: 'Plan your visit', sections: ['header', 'vitalis-doctors', 'vitalis-hours', 'vitalis-emergency'] },
  ],
  sterling: [
    { key: 'practice', label: 'Practice area', sections: ['header', 'sterling-practice', 'sterling-results', 'sterling-consult'] },
    { key: 'firm', label: 'The firm', sections: ['header', 'sterling-history', 'sterling-partners', 'sterling-cta'] },
  ],
  kinetic: [
    { key: 'services', label: 'Services', sections: ['kinetic-hero', 'kinetic-services', 'kinetic-cases', 'kinetic-cta'] },
    { key: 'careers', label: 'Careers', sections: ['header', 'kinetic-clients', 'kinetic-jobs'] },
  ],
  wanderly: [
    { key: 'tour', label: 'Tour detail', sections: ['wanderly-search', 'wanderly-itinerary', 'wanderly-gallery', 'wanderly-tours'] },
    { key: 'sale', label: 'Sale landing', sections: ['wanderly-sale', 'wanderly-tours', 'wanderly-destinations'] },
  ],
  scholar: [
    { key: 'track', label: 'Career track', sections: ['scholar-hero', 'scholar-curriculum', 'scholar-instructors', 'scholar-cohort'] },
    { key: 'teams', label: 'For teams', sections: ['header', 'scholar-courses', 'scholar-teams'] },
  ],
  aurelia: [
    { key: 'stay', label: 'Stay with us', sections: ['header', 'aurelia-welcome', 'aurelia-rooms', 'aurelia-reserve'] },
    { key: 'wellness', label: 'Wellness', sections: ['header', 'aurelia-spa', 'aurelia-experiences', 'aurelia-cta'] },
  ],
  evergreen: [
    { key: 'appeal', label: 'Appeal page', sections: ['header', 'evergreen-trust', 'evergreen-donate', 'evergreen-stories'] },
    { key: 'volunteer', label: 'Volunteer', sections: ['header', 'evergreen-events', 'evergreen-volunteer', 'evergreen-programs'] },
  ],
};
