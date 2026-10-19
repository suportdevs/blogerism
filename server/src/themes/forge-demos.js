// Ten homepage demos for Forge — different kinds of fitness businesses on the same content (blog, testimonials, FAQs,
// classes and membership pages). Each has its own header, homepage, colours and fonts.
const { B: block, un, face, demoVariant } = require('./helpers');
const forge = require('./forge');

const B = (type, data, style = {}) => block(type, data, { animate: true, ...style });
const HERO = { paddingY: 'none', width: 'full', animate: false };
const W = { width: 'wide' };
const demo = (def) => demoVariant(forge, { source: 'forge-demos.js', blocks: ['Luxury', 'Showcase'], ...def });

const IMG = {
  darkLifter: '1605296867304-46d5465a13f1', barbell: '1517836357463-d25dfeac3438', barbell2: '1517963879433-6ad2b056d712', bar3: '1517838277536-f5f99be501cd',
  ropes: '1599058917212-d750089bc07e', curl: '1581009146145-b5ef050c2e1e', pullup: '1541534741688-6078c6bfb5c5', womanBw: '1574680096145-d05b474e2155',
  gymDark: '1571902943202-507ec2618e8f', dumbbells: '1534438327276-14e5300c3a48', rack: '1576678927484-cc907957088c', classW: '1518611012118-696072aa579a',
  yogaSunset: '1544367567-0f2fcb009e0b', meditate: '1506126613408-eca07ce68773', runners: '1552674605-db6ffd4facb5', pushup: '1594737625785-a6cbdabd333c',
  situps: '1571019613454-1cb2f99b2d8b', gymBright: '1540497077202-7c8a3999166f', weights: '1549060279-7e168fcee0c2', womanDark: '1550345332-09e3ac987658',
  band: '1584735935682-2f2b69dff9d2', beachYoga: '1545205597-3d9d02c29597', yogaPose: '1575052814086-f385e2e2ad1b', downDog: '1599901860904-17e6ed7083a0',
  karate: '1555597673-b21d5c935865', dance: '1518310383802-640c2de311b2', sprint: '1461896836934-ffe607ba8211', runner: '1571008887538-b36bb32f4571',
  stairs: '1476480862126-209bfaa8edc8', cycling: '1517649763962-0c623066013b', massage: '1544161515-4ab6ce6db874', stones: '1600334089648-b0d9d3028eb2',
  towels: '1540555700478-4be289fbecef', pool: '1571896349842-33c89424de2d', muscle: '1526506118085-60ce8714f8c5',
};

const S = (time, title, host, location, tag = '') => ({ time, title, host, location, tag });
const week = (rows) => Object.entries(rows).map(([label, sessions]) => ({ label, sessions: sessions.map((s) => S(...s)) }));
const testimonials = (title, style = {}) => B('testimonials', { eyebrow: 'Members', title }, { paddingY: 'xl', ...style });

/* 1 ─ Zen: yoga studio */
const zen = demo({
  id: 'forge-zen', name: 'Zen Yoga',
  description: 'A calm yoga studio: transparent header over a sunrise slideshow, serif statement, class styles, weekly timetable, teachers and pricing.',
  layout: { header: 'overlay' },
  appearance: { primaryColor: '#65803a', accentColor: '#c08457', backgroundColor: '#f8f6f0', surfaceColor: '#eeebe0', textColor: '#1d1f17', darkBackgroundColor: '#0d0e0a', darkSurfaceColor: '#181a12', darkTextColor: '#eceee3', headingFont: 'Cormorant Garamond', bodyFont: 'Jost', radius: 24, colorMode: 'light', footerStyle: 'luxe', headerCta: { enabled: true, label: 'Book a class', url: '/classes' } },
  home: () => [
    B('heroSlideshow', { height: 'full', align: 'center', interval: 7, slides: [
      { image: un(IMG.beachYoga, 2200), eyebrow: 'Breathe · Move · Rest', title: 'Find your stillness', subtitle: 'Yoga, breathwork and meditation for every body.', buttonLabel: 'See the timetable', buttonUrl: '#timetable' },
      { image: un(IMG.yogaSunset, 2200), eyebrow: 'Sunrise flow', title: 'Begin each day gently', subtitle: 'Morning classes from 6:30.', buttonLabel: 'Book your first class', buttonUrl: '/membership' },
    ] }, HERO),
    B('luxeStatement', { overline: 'Our studio', text: 'Yoga is not about touching your toes. It is about what you learn on the way down.', signature: 'The Zen teachers' }, { paddingY: 'xl' }),
    B('serviceCards', { eyebrow: 'Practice', title: 'Find your style', subtitle: '', variant: 'image', columns: 4, buttonLabel: '', buttonUrl: '', items: [['Leaf', 'Hatha', 'Slow, grounding postures for every level.', IMG.yogaPose], ['Waves', 'Vinyasa flow', 'Breath-led movement that builds heat.', IMG.downDog], ['Sunrise', 'Yin & restore', 'Long holds to release deep tension.', IMG.meditate], ['Heart', 'Breathwork', 'Calm the nervous system in 30 minutes.', IMG.beachYoga]].map(([icon, title, text, img]) => ({ icon, title, text, image: un(img, 800), url: '/classes', linkLabel: 'Explore' })) }, { paddingY: 'xl', ...W }),
    B('schedule', { eyebrow: 'Timetable', title: 'This week on the mat', subtitle: '', buttonLabel: 'Book', buttonUrl: '/membership', hostIcon: 'Users', locationIcon: 'Clock', days: week({
      Monday: [['06:30', 'Sunrise Vinyasa', 'Maya', '60 min', 'All levels'], ['18:30', 'Yin & Restore', 'Lena', '75 min', '']],
      Wednesday: [['07:00', 'Hatha Foundations', 'Maya', '60 min', 'Beginners'], ['19:00', 'Breathwork', 'Arun', '30 min', 'New']],
      Saturday: [['09:00', 'Weekend Flow', 'Lena', '90 min', 'Popular'], ['11:00', 'Family Yoga', 'Maya', '45 min', '']],
    }) }, { background: 'surface', paddingY: 'xl', anchor: 'timetable' }),
    B('team', { eyebrow: 'Teachers', title: 'Guided with care', variant: 'round', columns: 3, members: [{ name: 'Maya Lin', role: 'Hatha & Vinyasa', image: face('w4'), bio: '500-hour certified, 12 years teaching.', linkedin: '', twitter: '', email: '' }, { name: 'Lena Hart', role: 'Yin & Restorative', image: face('w1'), bio: 'Former dancer, gentle and precise.', linkedin: '', twitter: '', email: '' }, { name: 'Arun Das', role: 'Breathwork', image: face('m2'), bio: 'Pranayama and meditation coach.', linkedin: '', twitter: '', email: '' }] }, { paddingY: 'xl' }),
    B('pricing', { eyebrow: 'Memberships', title: 'Practise your way', plans: [
      { name: 'Drop-in', price: '$18', period: '/class', description: 'Come when you can', features: ['Any class', 'Mat & props included'], buttonLabel: 'Book', buttonUrl: '/membership', highlighted: false },
      { name: 'Unlimited', price: '$99', period: '/month', description: 'Our most loved plan', features: ['Unlimited classes', 'Workshops 20% off', 'Guest pass'], buttonLabel: 'Join', buttonUrl: '/membership', highlighted: true },
      { name: '10-class card', price: '$150', period: '', description: 'Valid 4 months', features: ['10 classes', 'Share with a friend'], buttonLabel: 'Buy', buttonUrl: '/membership', highlighted: false },
    ] }, { background: 'surface', paddingY: 'xl' }),
  ],
});

/* 2 ─ Box: CrossFit-style */
const box = demo({
  id: 'forge-box', name: 'The Box',
  description: 'A functional-fitness box: corporate header with hours bar, framed hero, stats, WOD timetable, transformation slider, plans and FAQ.',
  layout: { header: 'corporate' },
  appearance: { primaryColor: '#dc2626', accentColor: '#111827', backgroundColor: '#ffffff', surfaceColor: '#f4f4f5', textColor: '#0b0b0d', darkBackgroundColor: '#09090b', darkSurfaceColor: '#141417', darkTextColor: '#ededf0', headingFont: 'Archivo', bodyFont: 'Inter', radius: 6, colorMode: 'light', footerStyle: 'columns', headerCta: { enabled: true, label: 'Free intro', url: '/membership' } },
  home: () => [
    B('splitHero', { variant: 'framed', eyebrow: 'Functional fitness · Est. 2016', title: 'Stronger, fitter,', highlight: 'together', subtitle: 'Coached group classes that scale to every level — from first timers to competitors.', bullets: ['Coached every session', 'Max 14 per class', 'Free intro session', 'Open gym included'], primaryLabel: 'Book a free intro', primaryUrl: '/membership', secondaryLabel: 'Today’s WOD', secondaryUrl: '#wod', image: un(IMG.barbell, 1200), image2: '', badges: [{ icon: 'Users', value: '600+', label: 'Members' }, { icon: 'Medal', value: '9', label: 'Certified coaches' }], proof: '4.9 on Google from 380 reviews', avatars: [face('w3', 120), face('m7', 120), face('w2', 120), face('m3', 120)] }, { background: 'surface', paddingY: 'xl', animate: false }),
    B('stats', { items: [{ value: '42', label: 'Classes a week' }, { value: '14', label: 'Max class size' }, { value: '600+', label: 'Members' }, { value: '9', label: 'Coaches' }] }, { background: 'primary', paddingY: 'lg' }),
    B('schedule', { eyebrow: 'WOD', title: 'Workout of the day', subtitle: 'Every workout is scaled to you.', buttonLabel: 'Book', buttonUrl: '/membership', hostIcon: 'Dumbbell', locationIcon: 'Timer', days: week({
      Today: [['06:00', 'Strength: back squat 5x5', 'Barbell', '20 min', 'Strength'], ['06:30', 'Metcon: 21-15-9 thrusters & pull-ups', 'Barbell + rig', 'For time', 'Conditioning']],
      Tomorrow: [['06:00', 'Engine: 4 x 1k row', 'Rower', '30 min', 'Cardio'], ['18:00', 'Gymnastics skills', 'Rings & bars', '45 min', 'Skill']],
    }) }, { paddingY: 'xl', anchor: 'wod' }),
    B('beforeAfter', { eyebrow: 'Real results', title: '16 weeks of consistent training', text: 'Drag to compare — member photos shared with permission.', before: `${un(IMG.womanBw, 1600)}&sat=-100`, after: un(IMG.pullup, 1600), beforeLabel: 'Week 1', afterLabel: 'Week 16', start: 50, layout: 'split', ratio: '4/3' }, { background: 'surface', paddingY: 'xl' }),
    B('pricingToggle', { eyebrow: 'Memberships', title: 'No contracts. Just results.', subtitle: '', currency: '$', yearlyNote: '-15%', plans: [
      { name: '3x a week', description: 'Most people start here', monthly: '119', yearly: '101', features: ['12 classes / month', 'Open gym', 'Nutrition guide'], buttonLabel: 'Start', buttonUrl: '/membership', highlighted: false },
      { name: 'Unlimited', description: 'Train as much as you like', monthly: '159', yearly: '135', features: ['Unlimited classes', 'Open gym', 'Monthly body scan'], buttonLabel: 'Start', buttonUrl: '/membership', highlighted: true },
    ] }, { paddingY: 'xl' }),
    B('faq', { eyebrow: 'FAQ', title: 'New to functional fitness?' }, { background: 'surface', paddingY: 'xl' }),
  ],
});

/* 3 ─ Fight: boxing club */
const fight = demo({
  id: 'forge-fight', name: 'Fight Club',
  description: 'A dark boxing & MMA club: sidebar navigation, kinetic “train harder” hero, numbered disciplines, fight-night countdown and coach portraits.',
  layout: { header: 'sidebar' },
  appearance: { primaryColor: '#b91c1c', accentColor: '#f59e0b', backgroundColor: '#f7f7f6', surfaceColor: '#ececea', textColor: '#0e0d0c', darkBackgroundColor: '#0a0909', darkSurfaceColor: '#151313', darkTextColor: '#efedeb', headingFont: 'Barlow Condensed', bodyFont: 'Inter', radius: 2, colorMode: 'dark', footerStyle: 'big', headerCta: { enabled: true, label: 'Free trial', url: '/membership' } },
  home: () => [
    B('kineticHero', { eyebrow: 'Boxing · Muay Thai · MMA', lines: ['Train'], rotate: ['harder.', 'smarter.', 'together.'], subtitle: 'Technique-first coaching for beginners, fitness boxers and fighters. Gloves provided.', primaryLabel: 'Book a free trial', primaryUrl: '/membership', secondaryLabel: 'Disciplines', secondaryUrl: '#disciplines', image: un(IMG.weights, 500), badge: 'Fight ready ✦ Fight ready ✦ ', marquee: ['Boxing', 'Muay Thai', 'MMA', 'Conditioning', 'Sparring'] }, { paddingY: 'xl', width: 'wide', animate: false }),
    B('serviceCards', { eyebrow: 'Disciplines', title: 'Pick your fight', subtitle: '', variant: 'rows', columns: 3, buttonLabel: '', buttonUrl: '', items: [['Target', 'Boxing', 'Footwork, combinations and defence — from day one.', IMG.weights], ['Flame', 'Muay Thai', 'The art of eight limbs, taught by ex-pros.', IMG.ropes], ['Shield', 'MMA', 'Striking meets grappling, safely.', IMG.muscle], ['Timer', 'Fight conditioning', 'Rounds-based circuits that build an engine.', IMG.gymDark]].map(([icon, title, text, img]) => ({ icon, title, text, image: un(img, 600), url: '/classes', linkLabel: '' })) }, { paddingY: 'xl', anchor: 'disciplines', ...W }),
    B('countdown', { eyebrow: 'Fight night', title: 'Club championship', text: 'Twelve bouts, one belt. Tickets for members and guests.', date: '2027-04-10T19:00', variant: 'image', image: un(IMG.darkLifter, 2000), expiredText: 'Fight night is on!', buttonLabel: 'Get tickets', buttonUrl: '/contact' }, { paddingY: 'lg', ...W }),
    B('team', { eyebrow: 'Coaches', title: 'In your corner', variant: 'portrait', columns: 4, members: [{ name: 'Andre Wallace', role: 'Head boxing coach', image: face('m2'), bio: '', linkedin: '', twitter: '#', email: '' }, { name: 'Kiko Santos', role: 'Muay Thai', image: face('m3'), bio: '', linkedin: '', twitter: '#', email: '' }, { name: 'Rosa Vega', role: 'MMA & grappling', image: face('w3'), bio: '', linkedin: '', twitter: '#', email: '' }, { name: 'Dan Cole', role: 'Strength & conditioning', image: face('m7'), bio: '', linkedin: '', twitter: '#', email: '' }] }, { background: 'surface', paddingY: 'xl', ...W }),
    testimonials('Fighters talk', W),
    B('ctaBanner', { variant: 'image', image: un(IMG.muscle, 1800), eyebrow: 'First class free', title: 'Step into the ring', text: 'No experience needed. Wraps and gloves on us.', primaryLabel: 'Book your trial', primaryUrl: '/membership', phone: '+1 (646) 555-0119' }, { paddingY: 'lg', ...W }),
  ],
});

/* 4 ─ Coach: personal trainer */
const coach = demo({
  id: 'forge-coach', name: 'Coach',
  description: 'A personal trainer’s site: floating pill nav, arch hero with stats, client transformations, coaching packages and session booking.',
  layout: { header: 'portfolio' },
  appearance: { primaryColor: '#0ea5e9', accentColor: '#f97316', backgroundColor: '#f7fbfe', surfaceColor: '#eaf4fb', textColor: '#0a1620', darkBackgroundColor: '#050d14', darkSurfaceColor: '#0d1a25', darkTextColor: '#e3eff8', headingFont: 'Lexend', bodyFont: 'Inter', radius: 20, colorMode: 'light', footerStyle: 'simple', headerCta: { enabled: true, label: 'Book a session', url: '/#book' } },
  home: () => [
    B('splitHero', { variant: 'arch', eyebrow: 'Personal training · online & in person', title: 'Your goals, my', highlight: 'whole focus', subtitle: 'Hi, I’m Marcus — a strength coach who builds programmes around your life, not the other way round.', bullets: ['Custom programme', 'Weekly check-ins', 'Nutrition coaching', 'App tracking'], primaryLabel: 'Book a free consult', primaryUrl: '#book', secondaryLabel: 'Client results', secondaryUrl: '#results', image: un(IMG.curl, 1000), image2: '', badges: [{ icon: 'Users', value: '240+', label: 'Clients coached' }, { icon: 'Medal', value: '12 yrs', label: 'Experience' }], proof: '', avatars: [] }, { paddingY: 'xl', animate: false }),
    B('caseStudies', { eyebrow: 'Results', title: 'Client transformations', subtitle: 'Shared with permission. Results vary — consistency doesn’t.', variant: 'grid', items: [
      { image: un(IMG.womanBw, 1200), client: 'Sarah, 34', title: 'From zero push-ups to a 100kg deadlift', text: 'Twelve months of three sessions a week and a plan she actually enjoyed.', metrics: [{ value: '100kg', label: 'Deadlift' }, { value: '-9kg', label: 'Body weight' }], tags: ['Strength'], url: '' },
      { image: un(IMG.runner, 1200), client: 'James, 41', title: 'First marathon at 41', text: 'A hybrid strength-and-running plan built around a busy job.', metrics: [{ value: '3:58', label: 'Marathon' }, { value: '16 wks', label: 'Plan' }], tags: ['Endurance'], url: '' },
    ] }, { background: 'surface', paddingY: 'xl', anchor: 'results', ...W }),
    B('pricing', { eyebrow: 'Coaching', title: 'Choose your support', plans: [
      { name: 'Online', price: '$129', period: '/month', description: 'Train anywhere', features: ['Custom programme', 'Weekly check-in', 'App tracking'], buttonLabel: 'Start', buttonUrl: '#book', highlighted: false },
      { name: 'Hybrid', price: '$249', period: '/month', description: 'Best results', features: ['Everything in Online', '4 in-person sessions', 'Nutrition plan'], buttonLabel: 'Start', buttonUrl: '#book', highlighted: true },
      { name: '1:1 in person', price: '$65', period: '/session', description: 'Pay as you go', features: ['60-minute session', 'Form coaching'], buttonLabel: 'Book', buttonUrl: '#book', highlighted: false },
    ] }, { paddingY: 'xl' }),
    B('appointment', { eyebrow: 'Free consultation', title: 'Let’s talk about your goals', text: 'A relaxed 20-minute call — no pressure, no sales pitch.', serviceLabel: 'I’m interested in', services: ['Online coaching', 'Hybrid coaching', 'In-person sessions', 'Nutrition only'], firstSlot: '07:00', lastSlot: '20:00', interval: 60, image: '', phone: '+1 (646) 555-0119', bullets: ['Free and without obligation', 'Video or phone', 'Reply within 24 hours'] }, { background: 'surface', paddingY: 'xl', anchor: 'book' }),
    testimonials('What clients say'),
  ],
});

/* 5 ─ Club: luxury wellness */
const club = demo({
  id: 'forge-club', name: 'Wellness Club',
  description: 'A members-only wellness club in the luxe language: framed hero, statement, framed splits for gym, spa and pool, and a parallax invitation.',
  layout: { header: 'luxe', style: 'luxe' },
  appearance: { primaryColor: '#a3824a', accentColor: '#2f3e34', backgroundColor: '#f7f4ee', surfaceColor: '#ede8de', textColor: '#1b1915', darkBackgroundColor: '#0d0c0a', darkSurfaceColor: '#181612', darkTextColor: '#eee8dc', headingFont: 'Bodoni Moda', bodyFont: 'Jost', radius: 0, colorMode: 'light', footerStyle: 'luxe', headerCta: { enabled: true, label: 'Enquire', url: '/contact' } },
  home: () => [
    B('luxeHero', { image: un(IMG.gymBright, 2200), video: '', overline: 'Private members’ club', title: 'Wellness,', italic: 'elevated', subtitle: 'A training floor, spa and pool reserved for 400 members.', buttonLabel: 'Request membership', buttonUrl: '/contact', height: 'full', align: 'center', overlay: 45 }, HERO),
    B('luxeStatement', { overline: 'The club', text: 'No queues for equipment, no crowded classes — just space, expert care and time for yourself.', signature: 'Forge Wellness Club' }, { paddingY: 'xl' }),
    B('luxeSplit', { number: '01', overline: 'Training', title: 'A floor designed for focus', text: 'Hand-picked equipment, private studios and coaches on hand all day.\n\nPersonal programming is included in every membership.', image: un(IMG.rack, 1200), imagePosition: 'left', buttonLabel: 'The training floor', buttonUrl: '/classes' }, { paddingY: 'xl', ...W }),
    B('luxeSplit', { number: '02', overline: 'Spa', title: 'Recovery is part of the plan', text: 'Massage, hot stones, sauna and cold plunge — booked through your member app.', image: un(IMG.massage, 1200), imagePosition: 'right', buttonLabel: 'Spa treatments', buttonUrl: '/contact' }, { paddingY: 'xl', ...W }),
    B('luxeSplit', { number: '03', overline: 'Pool', title: 'Twenty-five metres of calm', text: 'Lane swimming at dawn, aqua classes by day, lounging by night.', image: un(IMG.pool, 1200), imagePosition: 'left', buttonLabel: 'Pool hours', buttonUrl: '/contact' }, { paddingY: 'xl', ...W }),
    B('luxeQuote', { overline: 'Members say', title: '' }, { paddingY: 'xl' }),
    B('luxeCta', { image: un(IMG.towels, 2000), overline: 'By application', title: 'Membership is limited to 400', text: 'Request a private tour of the club.', buttonLabel: 'Request a tour', buttonUrl: '/contact' }, { paddingY: 'none', width: 'full' }),
  ],
});

/* 6 ─ Her: women's studio */
const her = demo({
  id: 'forge-her', name: 'Her Studio',
  description: 'A women-only training studio: floating header, collage hero, class timetable, coach cards, flexible pricing and member stories.',
  layout: { header: 'floating' },
  appearance: { primaryColor: '#db2777', accentColor: '#7c3aed', backgroundColor: '#fff8fb', surfaceColor: '#fdecf3', textColor: '#1e0d16', darkBackgroundColor: '#12070c', darkSurfaceColor: '#1f0f17', darkTextColor: '#fbe8f0', headingFont: 'Outfit', bodyFont: 'DM Sans', radius: 22, colorMode: 'light', footerStyle: 'big', headerCta: { enabled: true, label: 'Join now', url: '/membership' } },
  home: () => [
    B('splitHero', { variant: 'collage', eyebrow: 'Women-only studio', title: 'Strong looks', highlight: 'good on you', subtitle: 'Strength, dance and HIIT classes in a supportive space built for women.', bullets: ['Women-only floor', 'Free childcare hours', 'Expert female coaches', 'Beginner friendly'], primaryLabel: 'Try a free class', primaryUrl: '/membership', secondaryLabel: 'Timetable', secondaryUrl: '#timetable', image: un(IMG.dance, 1000), image2: un(IMG.womanDark, 700), badges: [{ icon: 'Heart', value: '1,500+', label: 'Members' }, { icon: 'Star', value: '4.9', label: 'Average rating' }], proof: 'Loved by women of every age', avatars: [face('w1', 120), face('w2', 120), face('w4', 120), face('w7', 120)] }, { paddingY: 'xl', animate: false }),
    B('schedule', { eyebrow: 'Timetable', title: 'Classes this week', subtitle: '', buttonLabel: 'Book', buttonUrl: '/membership', hostIcon: 'Users', locationIcon: 'Clock', days: week({
      Monday: [['07:00', 'Glute & Core', 'Ava', '45 min', 'Popular'], ['18:00', 'Dance Cardio', 'Mia', '50 min', '']],
      Tuesday: [['09:30', 'Mums & Bubs', 'Ava', '45 min', 'Childcare'], ['19:00', 'Strength 101', 'Rosa', '60 min', 'Beginners']],
      Thursday: [['07:00', 'HIIT Express', 'Mia', '30 min', ''], ['18:30', 'Barbell Club', 'Rosa', '75 min', 'Strength']],
    }) }, { background: 'surface', paddingY: 'xl', anchor: 'timetable' }),
    B('team', { eyebrow: 'Coaches', title: 'Your coaching team', variant: 'cards', columns: 3, members: [{ name: 'Ava Rodriguez', role: 'Strength & HIIT', image: face('w3'), bio: 'Pre- and post-natal certified.', linkedin: '', twitter: '#', email: '' }, { name: 'Mia Chen', role: 'Dance cardio', image: face('w4'), bio: 'Former professional dancer.', linkedin: '', twitter: '#', email: '' }, { name: 'Rosa Vega', role: 'Barbell coach', image: face('w5'), bio: 'National-level powerlifter.', linkedin: '', twitter: '#', email: '' }] }, { paddingY: 'xl' }),
    B('pricingToggle', { eyebrow: 'Membership', title: 'Flexible plans', subtitle: 'Freeze anytime — life happens.', currency: '$', yearlyNote: '-20%', plans: [
      { name: 'Starter', description: '8 classes a month', monthly: '69', yearly: '55', features: ['8 classes', 'App booking', 'Free intro session'], buttonLabel: 'Join', buttonUrl: '/membership', highlighted: false },
      { name: 'Unlimited', description: 'Every class, every week', monthly: '109', yearly: '87', features: ['Unlimited classes', 'Childcare hours', 'Monthly check-in'], buttonLabel: 'Join', buttonUrl: '/membership', highlighted: true },
    ] }, { background: 'surface', paddingY: 'xl' }),
    testimonials('Member stories'),
  ],
});

/* 7 ─ Run: running club */
const run = demo({
  id: 'forge-run', name: 'Run Club',
  description: 'A running club & race team: glass header, motion slideshow, race-day countdown, weekly runs, stats, upcoming races and newsletter.',
  layout: { header: 'default' },
  appearance: { primaryColor: '#0d9488', accentColor: '#f97316', backgroundColor: '#f8fbfb', surfaceColor: '#eaf4f3', textColor: '#0a1817', darkBackgroundColor: '#051110', darkSurfaceColor: '#0c1d1b', darkTextColor: '#e1f0ee', headingFont: 'Sora', bodyFont: 'Inter', radius: 16, colorMode: 'light', headerStyle: 'glass', footerStyle: 'columns', headerCta: { enabled: true, label: 'Join the club', url: '/membership' } },
  home: () => [
    B('heroSlideshow', { height: 'tall', align: 'left', interval: 6, slides: [
      { image: un(IMG.runners, 2200), eyebrow: 'Run club', title: 'Every pace is welcome', subtitle: 'Social runs, track sessions and race training — three times a week.', buttonLabel: 'See weekly runs', buttonUrl: '#runs' },
      { image: un(IMG.sprint, 2200), eyebrow: 'Track Tuesdays', title: 'Get faster, together', subtitle: 'Coached intervals on the city track.', buttonLabel: 'Join a session', buttonUrl: '/membership' },
      { image: un(IMG.cycling, 2200), eyebrow: 'Cross-training', title: 'Ride days for stronger legs', subtitle: '', buttonLabel: 'Learn more', buttonUrl: '/classes' },
    ] }, HERO),
    B('countdown', { eyebrow: 'Race day', title: 'City Half Marathon starts in', text: 'Our 16-week training plan is free for members.', date: '2027-04-25T07:00', variant: 'cards', image: '', expiredText: 'Race day — go get it!', buttonLabel: 'Get the plan', buttonUrl: '/membership' }, { background: 'surface', paddingY: 'xl' }),
    B('schedule', { eyebrow: 'Weekly runs', title: 'Lace up', subtitle: '', buttonLabel: 'Join', buttonUrl: '/membership', hostIcon: 'MapPin', locationIcon: 'Ruler', days: week({
      Tuesday: [['18:30', 'Track intervals', 'City Track', '6–8 km', 'Speed']],
      Thursday: [['18:30', 'Social 5K', 'Riverside café', '5 km', 'All paces'], ['19:15', 'Tempo run', 'Riverside café', '10 km', '']],
      Sunday: [['08:00', 'Long run', 'Lakeside Park', '12–21 km', 'Race training']],
    }) }, { paddingY: 'xl', anchor: 'runs' }),
    B('stats', { items: [{ value: '850', label: 'Members' }, { value: '3', label: 'Runs a week' }, { value: '42k', label: 'Km run this year' }, { value: '120', label: 'Race finishes' }] }, { background: 'primary', paddingY: 'lg' }),
    B('listingCards', { eyebrow: 'Races', title: 'Upcoming races', subtitle: 'Members get discounted entries and a team shirt.', variant: 'overlay', columns: 3, filters: false, subtitleIcon: 'MapPin', buttonLabel: '', buttonUrl: '', items: [[IMG.runners, 'Half marathon', 'City Half', 'Downtown', '25 Apr'], [IMG.stairs, 'Trail', 'Hill Climb 10K', 'North Hills', '16 May'], [IMG.runner, 'Road', 'Midsummer 5K', 'Lakeside Park', '21 Jun']].map(([img, category, title, subtitle, price]) => ({ image: un(img, 900), badge: 'Team entry', category, title, subtitle, price, period: '', rating: '', meta: ['Users: Team of 40', 'Medal: Medal for all'], url: '/contact' })) }, { paddingY: 'xl', ...W }),
    B('newsletter', { title: 'The weekly route', text: 'Run times, routes and race news every Monday.' }, { background: 'surface', paddingY: 'lg' }),
  ],
});

/* 8 ─ App: online coaching platform */
const app = demo({
  id: 'forge-app', name: 'Coaching App',
  description: 'An online coaching app: solid header, aurora spotlight hero with a 3D dashboard, bento features, feature tabs, plans and FAQ.',
  layout: { header: 'default' },
  appearance: { primaryColor: '#6366f1', accentColor: '#22d3ee', backgroundColor: '#ffffff', surfaceColor: '#f4f5fd', textColor: '#0d0f24', darkBackgroundColor: '#06071a', darkSurfaceColor: '#0e1029', darkTextColor: '#e7e9fb', headingFont: 'Plus Jakarta Sans', bodyFont: 'Inter', radius: 18, colorMode: 'dark', headerStyle: 'glass', footerStyle: 'columns', headerCta: { enabled: true, label: 'Start free', url: '/membership' } },
  home: () => [
    B('spotlightHero', { badge: 'New: AI form check', badgeUrl: '/blog', title: 'Your coach,', highlight: 'in your pocket', subtitle: 'Personal programmes, video form feedback and nutrition tracking — from real coaches, in one app.', primaryLabel: 'Start 14-day trial', primaryUrl: '/membership', secondaryLabel: 'How it works', secondaryUrl: '#features', note: 'Trusted by 50,000 athletes', domain: 'app.forge.fit', image: '' }, { paddingY: 'none', width: 'wide', animate: false }),
    B('bentoGrid', { eyebrow: 'Features', title: 'Everything to train smarter', subtitle: '', items: [
      { icon: 'Activity', title: 'Adaptive programming', text: 'Your plan adjusts to every logged set.', size: 'lg', visual: 'chart', image: '' },
      { icon: 'Video', title: 'Form feedback', text: 'Upload a lift, get notes from your coach.', size: 'tall', visual: '', image: un(IMG.bar3, 800) },
      { icon: 'Utensils', title: 'Nutrition', text: 'Macros made simple.', size: 'sm', visual: '', image: '' },
      { icon: 'Users', title: 'Community', text: 'Challenges and leaderboards.', size: 'wide', visual: 'avatars', image: '' },
      { icon: 'Timer', title: 'Smart timer', text: 'Rest periods, done for you.', size: 'sm', visual: '', image: '' },
    ] }, { paddingY: 'xl', anchor: 'features', ...W }),
    B('featureTabs', { eyebrow: 'How it works', title: 'Three steps to stronger', subtitle: '', variant: 'top', autoplay: true, tabs: [
      { icon: 'Target', label: 'Set goals', title: 'Tell us what you want', text: 'Strength, fat loss or a race — your coach builds the plan.', bullets: ['Goal assessment', 'Equipment check'], image: un(IMG.dumbbells, 1200), buttonLabel: '', buttonUrl: '' },
      { icon: 'Dumbbell', label: 'Train', title: 'Follow your programme', text: 'Videos for every exercise, logs that take seconds.', bullets: ['Exercise library', 'Offline mode'], image: un(IMG.pushup, 1200), buttonLabel: '', buttonUrl: '' },
      { icon: 'TrendingUp', label: 'Progress', title: 'Watch the numbers move', text: 'Weekly reviews with your coach keep you on track.', bullets: ['Progress charts', 'Coach chat'], image: un(IMG.situps, 1200), buttonLabel: '', buttonUrl: '' },
    ] }, { background: 'surface', paddingY: 'xl' }),
    B('pricingToggle', { eyebrow: 'Pricing', title: 'Less than one PT session a month', subtitle: '14-day free trial. Cancel anytime.', currency: '$', yearlyNote: '-30%', plans: [
      { name: 'Self-guided', description: 'Programmes & tracking', monthly: '9', yearly: '6', features: ['Programme library', 'Workout logging', 'Community'], buttonLabel: 'Start trial', buttonUrl: '/membership', highlighted: false },
      { name: 'Coached', description: 'A real coach, every week', monthly: '49', yearly: '34', features: ['Custom programme', 'Form feedback', 'Weekly check-in', 'Nutrition plan'], buttonLabel: 'Start trial', buttonUrl: '/membership', highlighted: true },
    ] }, { paddingY: 'xl' }),
    B('faq', { eyebrow: 'FAQ', title: 'Questions' }, { background: 'surface', paddingY: 'xl' }),
  ],
});

/* 9 ─ Dojo: martial arts */
const dojo = demo({
  id: 'forge-dojo', name: 'Dojo',
  description: 'A traditional martial-arts dojo: minimal transparent header, sunset slideshow, philosophy statement, belt journey, classes and senseis.',
  layout: { header: 'minimal' },
  appearance: { primaryColor: '#b91c1c', accentColor: '#1c1917', backgroundColor: '#faf8f4', surfaceColor: '#f0ebe2', textColor: '#1c1917', darkBackgroundColor: '#0c0a09', darkSurfaceColor: '#171412', darkTextColor: '#efe9e1', headingFont: 'EB Garamond', bodyFont: 'Inter', radius: 0, colorMode: 'light', footerStyle: 'luxe' },
  home: () => [
    B('heroSlideshow', { height: 'full', align: 'center', interval: 8, slides: [{ image: un(IMG.karate, 2200), eyebrow: 'Karate · Judo · Self-defence', title: 'Discipline. Respect. Strength.', subtitle: 'Traditional martial arts for children and adults since 1998.', buttonLabel: 'Book a trial lesson', buttonUrl: '/membership' }] }, HERO),
    B('luxeStatement', { overline: 'Our philosophy', text: 'The ultimate aim of martial arts is not winning or losing, but the perfection of character.', signature: 'Sensei Kenji Mori' }, { paddingY: 'xl' }),
    B('steps', { eyebrow: 'The path', title: 'From white belt to black', variant: 'vertical', items: [{ icon: 'Star', title: 'White belt', text: 'Stances, etiquette and the basic blocks.' }, { icon: 'Target', title: 'Yellow & orange', text: 'Combinations, kata and controlled sparring.' }, { icon: 'Shield', title: 'Green to brown', text: 'Advanced kata, self-defence and teaching juniors.' }, { icon: 'Medal', title: 'Black belt', text: 'Mastery begins — usually after five years.' }] }, { background: 'surface', paddingY: 'xl', width: 'narrow' }),
    B('schedule', { eyebrow: 'Classes', title: 'Weekly training', subtitle: '', buttonLabel: 'Try free', buttonUrl: '/membership', hostIcon: 'Users', locationIcon: 'Clock', days: week({
      Monday: [['16:30', 'Little Dragons (4–7)', 'Sensei Aiko', '40 min', 'Kids'], ['19:00', 'Adult Karate', 'Sensei Kenji', '90 min', '']],
      Wednesday: [['17:00', 'Juniors (8–14)', 'Sensei Aiko', '60 min', 'Kids'], ['19:00', 'Judo', 'Sensei Tomas', '90 min', '']],
      Saturday: [['10:00', 'Self-defence for women', 'Sensei Rosa', '60 min', 'Open'], ['11:30', 'Family class', 'All senseis', '60 min', '']],
    }) }, { paddingY: 'xl' }),
    B('team', { eyebrow: 'Senseis', title: 'Our teachers', variant: 'round', columns: 4, members: [{ name: 'Kenji Mori', role: '6th dan, karate', image: face('m1'), bio: '', linkedin: '', twitter: '', email: '' }, { name: 'Aiko Tanaka', role: 'Kids programme', image: face('w4'), bio: '', linkedin: '', twitter: '', email: '' }, { name: 'Tomas Ruiz', role: '4th dan, judo', image: face('m5'), bio: '', linkedin: '', twitter: '', email: '' }, { name: 'Rosa Vega', role: 'Self-defence', image: face('w5'), bio: '', linkedin: '', twitter: '', email: '' }] }, { background: 'surface', paddingY: 'xl' }),
    B('ctaBanner', { variant: 'split', image: un(IMG.karate, 1400), eyebrow: 'First lesson free', title: 'Begin your journey', text: 'Uniform included with every annual membership.', primaryLabel: 'Book a trial', primaryUrl: '/membership', phone: '+1 (646) 555-0119' }, { paddingY: 'lg', ...W }),
  ],
});

/* 10 ─ Chain: 24/7 gym network */
const chain = demo({
  id: 'forge-chain', name: '24/7 Chain',
  description: 'A 24/7 gym chain: centered header, “find a gym” search hero, location cards with amenities, plan comparison, stats and app banner.',
  layout: { header: 'default' },
  appearance: { primaryColor: '#7c3aed', accentColor: '#facc15', backgroundColor: '#ffffff', surfaceColor: '#f5f3fd', textColor: '#110d1e', darkBackgroundColor: '#08060f', darkSurfaceColor: '#120e1e', darkTextColor: '#ece9f8', headingFont: 'Red Hat Display', bodyFont: 'Inter', radius: 14, colorMode: 'light', headerStyle: 'centered', footerStyle: 'columns', headerCta: { enabled: true, label: 'Join online', url: '/membership' } },
  home: () => [
    B('searchHero', { image: un(IMG.gymDark, 2200), overlay: 55, height: 'tall', align: 'center', eyebrow: '38 gyms · open 24/7', title: 'Train any time, at any gym', subtitle: 'One membership, every location, no contract.', tabs: [], buttonLabel: 'Find a gym', action: '/contact', fields: [{ label: 'Location', icon: 'MapPin', type: 'text', placeholder: 'City or postcode', options: [] }, { label: 'Membership', icon: 'Key', type: 'select', placeholder: 'Any', options: ['Home gym', 'All gyms', 'All gyms + classes'] }], stats: [{ value: '38', label: 'Gyms' }, { value: '24/7', label: 'Access' }, { value: '$0', label: 'Joining fee' }] }, HERO),
    B('listingCards', { eyebrow: 'Locations', title: 'Gyms near you', subtitle: '', variant: 'card', columns: 3, filters: true, subtitleIcon: 'MapPin', buttonLabel: 'All 38 gyms', buttonUrl: '/contact', items: [[IMG.gymBright, 'City centre', 'Forge Central', '12 Market Street', ['Waves: Pool', 'Users: Classes']], [IMG.dumbbells, 'City centre', 'Forge Riverside', '4 Harbour Walk', ['Dumbbell: Free weights', 'Timer: Open 24/7']], [IMG.rack, 'Suburbs', 'Forge Northgate', '88 North Road', ['Car: Free parking', 'Users: Classes']], [IMG.gymDark, 'Suburbs', 'Forge Westfield', 'Westfield Mall', ['Car: Free parking', 'Timer: Open 24/7']], [IMG.weights, 'Campus', 'Forge University', 'Student Union', ['GraduationCap: Student price', 'Dumbbell: Free weights']], [IMG.situps, 'Campus', 'Forge Tech Park', 'Innovation Way', ['Waves: Sauna', 'Users: Classes']]].map(([img, category, title, subtitle, meta], i) => ({ image: un(img, 900), badge: i === 0 ? 'Flagship' : '', category, title, subtitle, price: '', period: '', rating: '', meta, url: '/contact' })) }, { paddingY: 'xl', ...W }),
    B('comparison', { eyebrow: 'Memberships', title: 'Simple, flexible plans', columns: ['Home gym', 'All gyms', 'All gyms + classes'], highlight: 2, highlightLabel: 'Most popular', groups: false, rows: [
      { group: '', feature: '24/7 access', values: ['1 gym', '38 gyms', '38 gyms'] }, { group: '', feature: 'Group classes', values: ['no', 'no', 'Unlimited'] }, { group: '', feature: 'Bring a friend', values: ['no', '4x / month', 'Unlimited'] }, { group: '', feature: 'Contract', values: ['None', 'None', 'None'] }, { group: '', feature: 'Price', values: ['$24 / mo', '$32 / mo', '$45 / mo'] },
    ], buttons: [{ label: 'Join', url: '/membership' }, { label: 'Join', url: '/membership' }, { label: 'Join', url: '/membership' }] }, { background: 'surface', paddingY: 'xl', ...W }),
    B('stats', { items: [{ value: '38', label: 'Gyms' }, { value: '120k', label: 'Members' }, { value: '900+', label: 'Classes a week' }, { value: '24/7', label: 'Open' }] }, { background: 'primary', paddingY: 'lg' }),
    B('ctaBanner', { variant: 'image', image: un(IMG.bar3, 1800), eyebrow: 'Forge app', title: 'Your membership card is in your phone', text: 'Scan in, book classes and track workouts.', primaryLabel: 'Join online', primaryUrl: '/membership', secondaryLabel: 'Find a gym', secondaryUrl: '/contact', phone: '' }, { paddingY: 'lg', ...W }),
  ],
});

module.exports = [zen, box, fight, coach, club, her, run, app, dojo, chain];
