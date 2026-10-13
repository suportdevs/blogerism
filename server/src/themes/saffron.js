const { B: block, m, un, commonPages, seedFaqs } = require('./helpers');

// Sections reveal on scroll (heroes opt out explicitly).
const B = (type, data, style = {}) => block(type, data, { animate: true, ...style });

const P = {
  dining: '1414235077428-338989a2e8c0', spread: '1504674900247-0877df9cc836', interior: '1517248135467-4c7edcad34c4',
  interior2: '1559339352-11d035aa65de', interior3: '1555396273-367ea4eb4db5', interior4: '1551218808-94e220e084d2', chef: '1466978913421-dad2ebd01d17',
  salad: '1540189549336-e6e99c3679fe', pizza: '1565299624946-b28f40a0ae38', pancakes: '1567620905732-2d1ec7ab7445', bowl: '1546069901-ba9599a7e63c',
  saladBowl: '1512621776951-a57141f2eefd', pasta: '1473093295043-cdd812d0e601', dessert: '1488477181946-6428a0291777', cake: '1563729784474-d77dbb933a9e',
  coffee: '1495474472287-4d71bcdd2085', coffee2: '1509042239860-f550ce710b93', plate: '1544025162-d76694265947', sweet: '1565958011703-44f9829ba187',
  dish: '1504754524776-8f4f37790ca0', breakfast: '1482049016688-2d3e1b311543', food: '1529042410759-befb1204b468', drinks: '1514933651103-005eec06c04b',
};

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const hours = DAYS.map((day) => ({ day, open: day === 'Friday' || day === 'Saturday' ? '12:00' : '11:30', close: day === 'Friday' || day === 'Saturday' ? '23:30' : '22:30', closed: day === 'Monday' }));

const MENU = {
  eyebrow: 'Our menu', title: 'Seasonal plates, made from scratch', subtitle: 'Locally sourced ingredients, open-fire cooking and a love for bold flavours.', currency: '৳',
  sections: [
    { name: 'Starters', note: 'Perfect for sharing', items: [
      { name: 'Garden Burrata', price: '650', description: 'Heirloom tomatoes, basil oil, toasted sourdough.', tags: ['Vegetarian'], image: un(P.salad, 300) },
      { name: 'Smoked Chicken Wings', price: '590', description: 'Chipotle glaze, lime, spring onions.', tags: ['Spicy'], image: un(P.food, 300) },
      { name: 'Poke Bowl', price: '720', description: 'Sesame tuna, avocado, edamame, pickled ginger.', tags: ['New'], image: un(P.bowl, 300) },
      { name: 'Harvest Salad', price: '540', description: 'Roasted squash, quinoa, pomegranate, tahini.', tags: ['Vegan'], image: un(P.saladBowl, 300) },
    ] },
    { name: 'Mains', note: 'From the open fire', items: [
      { name: 'Wood-fired Margherita', price: '890', description: 'San Marzano tomato, fior di latte, basil.', tags: ['Vegetarian'], image: un(P.pizza, 300) },
      { name: 'Ribeye Steak', price: '2450', description: '300g grass-fed ribeye, chimichurri, fries.', tags: ['Chef’s pick'], image: un(P.plate, 300) },
      { name: 'Prawn Linguine', price: '1150', description: 'Garlic butter, chilli, lemon, parsley.', tags: ['Spicy'], image: un(P.pasta, 300) },
      { name: 'Saffron Signature Platter', price: '1890', description: 'A seasonal tasting of the chef’s favourites.', tags: ['For two'], image: un(P.dish, 300) },
    ] },
    { name: 'Desserts', note: '', items: [
      { name: 'Berry Pavlova', price: '480', description: 'Crisp meringue, vanilla cream, seasonal berries.', tags: ['Gluten free'], image: un(P.dessert, 300) },
      { name: 'Chocolate Layer Cake', price: '520', description: 'Dark chocolate ganache, sea salt.', tags: [], image: un(P.cake, 300) },
      { name: 'Buttermilk Pancakes', price: '450', description: 'Maple syrup, berries, whipped butter.', tags: ['Brunch'], image: un(P.pancakes, 300) },
      { name: 'Sweet of the Day', price: '390', description: 'Ask your server about today’s creation.', tags: [], image: un(P.sweet, 300) },
    ] },
    { name: 'Drinks', note: 'Mocktails, coffee & tea', items: [
      { name: 'Flat White', price: '320', description: 'Single-origin espresso, silky milk.', tags: [], image: un(P.coffee, 300) },
      { name: 'Iced Mocha', price: '380', description: 'Cold brew, dark chocolate, cream.', tags: [], image: un(P.coffee2, 300) },
      { name: 'Saffron Sunset', price: '420', description: 'Mango, passion fruit, saffron syrup, soda.', tags: ['Signature'], image: un(P.drinks, 300) },
      { name: 'Fresh Lime Mint', price: '280', description: 'Muddled mint, lime, sparkling water.', tags: ['Vegan'], image: un(P.breakfast, 300) },
    ] },
  ],
};

module.exports = {
  id: 'saffron',
  name: 'Saffron',
  category: 'Restaurant & café',
  description: 'An elegant restaurant site: full-screen food slideshow, tabbed menu with prices, table reservations and live opening hours.',
  features: { formats: ['STANDARD', 'GALLERY'], series: [], blocks: ['Restaurant', 'Headers', 'Content', 'Media', 'Conversion', 'Layout'] },
  layout: { header: 'overlay', article: 'blog', listing: 'cards' },
  general: { siteName: 'Saffron', tagline: 'Kitchen & Bar' },
  contact: { email: 'hello@saffron.example', phone: '+880 1700 000000', address: '12 Gulshan Avenue, Dhaka 1212', workingHours: 'Tue – Sun, 11:30 – 22:30' },
  social: { instagram: 'https://instagram.com', facebook: 'https://facebook.com', twitter: '', linkedin: '', github: '', youtube: '' },
  seo: { metaTitle: 'Saffron — Kitchen & Bar', metaDescription: 'Seasonal plates, open-fire cooking and handcrafted drinks in the heart of the city. Book your table online.' },
  appearance: {
    preset: 'saffron', primaryColor: '#b45309', accentColor: '#b8892b', backgroundColor: '#fbf7f1', surfaceColor: '#f3eadc', textColor: '#1f1712',
    darkBackgroundColor: '#120d0a', darkSurfaceColor: '#1d1611', darkTextColor: '#f3ece4', headingFont: 'Playfair Display', bodyFont: 'DM Sans',
    radius: 14, colorMode: 'light', footerStyle: 'columns', containerWidth: 1240, backToTop: true,
    footerText: 'Seasonal plates & handcrafted drinks since 2014.',
    headerCta: { enabled: true, label: 'Book a table', url: '/reservations' },
    announcement: { enabled: false, text: '', linkLabel: '', url: '' },
  },
  menus: {
    header: { name: 'Main menu', items: [m('Home', '/'), m('Menu', '/menu'), m('About', '/about'), m('Reservations', '/reservations'), m('Contact', '/contact')] },
    footer: { name: 'Visit', items: [m('Menu', '/menu'), m('Reservations', '/reservations'), m('About', '/about'), m('FAQ', '/faq')] },
    'footer-2': { name: 'Info', items: [m('Contact', '/contact'), m('Privacy', '/privacy-policy')] },
  },
  pages: () => [
    {
      slug: 'saffron-home', title: 'Home', home: true, template: 'full-width', seoTitle: 'Saffron — Kitchen & Bar',
      blocks: [
        B('heroSlideshow', { height: 'full', align: 'center', interval: 6, slides: [
          { image: un(P.dining, 2000), eyebrow: 'Kitchen & Bar · Est. 2014', title: 'A taste of the season', subtitle: 'Open-fire cooking, local produce and a table waiting for you.', buttonLabel: 'View the menu', buttonUrl: '/menu' },
          { image: un(P.spread, 2000), eyebrow: 'Made from scratch', title: 'Plates worth sharing', subtitle: 'Small plates, big flavours — perfect for long evenings with friends.', buttonLabel: 'Book a table', buttonUrl: '/reservations' },
          { image: un(P.interior, 2000), eyebrow: 'Private dining', title: 'Celebrate with us', subtitle: 'Birthdays, anniversaries and team dinners for up to 40 guests.', buttonLabel: 'Enquire now', buttonUrl: '/contact' },
        ] }, { paddingY: 'none', width: 'full', animate: false }),
        B('imageText', { eyebrow: 'Our story', title: 'Cooked over fire, served with heart', text: 'Saffron began as a twelve-seat kitchen with one wood-fired oven. Today our chefs still cook every dish to order, using produce from farms we know by name.', image: un(P.chef, 1200), imagePosition: 'left', bullets: ['Seasonal menu, updated monthly', 'Locally sourced ingredients', 'Vegan & gluten-free options'], buttonLabel: 'Meet the team', buttonUrl: '/about' }, { paddingY: 'xl' }),
        B('stats', { items: [{ value: '12', label: 'Years serving' }, { value: '4.9', label: 'Guest rating' }, { value: '48', label: 'Seasonal dishes' }, { value: '25,000+', label: 'Happy guests' }] }, { background: 'primary', paddingY: 'md' }),
        B('menuList', { ...MENU, layout: 'tabs' }, { background: 'surface', paddingY: 'xl', anchor: 'menu' }),
        B('masonryGallery', { eyebrow: 'Moments', title: 'Life at Saffron', subtitle: '', columns: 3, filters: false, items: [P.interior2, P.pizza, P.drinks, P.dessert, P.interior3, P.pasta, P.coffee, P.interior4, P.bowl].map((id, i) => ({ src: un(id, 900), title: '', category: '', caption: '' })) }, { paddingY: 'xl', width: 'wide' }),
        B('testimonials', { eyebrow: 'Kind words', title: 'What our guests say' }, { background: 'surface', paddingY: 'xl' }),
        B('reservation', { eyebrow: 'Reservations', title: 'Your table is waiting', text: 'Book online in seconds — we’ll confirm by email.', image: un(P.interior2, 1000), maxGuests: 12, firstSlot: '12:00', lastSlot: '22:00' }, { paddingY: 'xl', anchor: 'book' }),
        B('hours', { eyebrow: 'Visit us', title: 'Hours & location', address: '', phone: '', email: '', mapEmbedUrl: '', image: un(P.interior3, 1200), rows: hours }, { background: 'surface', paddingY: 'xl' }),
        B('newsletter', { title: 'Seasonal menus & events', text: 'Be first to hear about tasting nights and new dishes.' }, { paddingY: 'md' }),
      ],
    },
    {
      slug: 'menu', title: 'Menu', template: 'default', seoTitle: 'Menu — Saffron',
      blocks: [
        B('heroSlideshow', { height: 'tall', align: 'center', interval: 7, slides: [{ image: un(P.spread, 2000), eyebrow: 'Our menu', title: 'Eat well, share often', subtitle: 'Seasonal, made from scratch, cooked to order.', buttonLabel: '', buttonUrl: '' }] }, { paddingY: 'none', width: 'full', animate: false }),
        B('menuList', { ...MENU, eyebrow: '', title: '', subtitle: '', layout: 'list' }, { paddingY: 'xl' }),
        B('cta', { title: 'Hungry yet?', text: 'Reserve your table online in under a minute.', primaryLabel: 'Book a table', primaryUrl: '/reservations' }, { paddingY: 'lg' }),
      ],
    },
    {
      slug: 'reservations', title: 'Reservations', template: 'default', seoTitle: 'Reservations — Saffron',
      blocks: [
        B('pageHeader', { title: 'Reserve a table', subtitle: 'Online bookings for up to 12 guests. For larger groups, please call us.' }, { background: 'surface', paddingY: 'lg' }),
        B('reservation', { eyebrow: '', title: '', text: '', image: '', maxGuests: 12, firstSlot: '12:00', lastSlot: '22:00' }, { paddingY: 'lg', width: 'narrow' }),
        B('hours', { eyebrow: 'Visit us', title: 'Hours & location', rows: hours, image: un(P.interior4, 1200) }, { background: 'surface', paddingY: 'xl' }),
        B('faq', { eyebrow: 'Good to know', title: 'Before you visit' }, { paddingY: 'lg' }),
      ],
    },
    commonPages.about('Saffron', 'A neighbourhood kitchen celebrating seasonal food, open fire and good company.'),
    commonPages.privacy(),
  ],

  async demo(prisma) {
    await prisma.testimonial.createMany({
      data: [
        { name: 'Nadia Rahman', position: 'Food blogger', company: '', avatar: 'https://i.pravatar.cc/200?img=45', content: 'The ribeye was cooked to perfection and the saffron sunset mocktail is unforgettable. Warm, attentive service from start to finish.', rating: 5, order: 0 },
        { name: 'Arif Hossain', position: 'Regular guest', company: '', avatar: 'https://i.pravatar.cc/200?img=53', content: 'Our go-to place for anniversaries. The ambience is magical in the evening and the menu changes just often enough.', rating: 5, order: 1 },
        { name: 'Emma Clarke', position: 'Visiting from London', company: '', avatar: 'https://i.pravatar.cc/200?img=25', content: 'Easily the best wood-fired pizza I’ve had outside Naples. Booking online took seconds.', rating: 5, order: 2 },
      ],
    });
    await seedFaqs(prisma, [
      ['Do I need a reservation?', 'Walk-ins are welcome, but we recommend booking for dinner and weekends.'],
      ['Do you cater for allergies?', 'Yes — tell us in your booking notes and our chefs will adapt your dishes.'],
      ['Is there parking?', 'Free valet parking is available from 6pm every evening.'],
      ['Can I book a private event?', 'Our private dining room seats up to 40 guests. Contact us for menus and availability.'],
    ]);
  },
};
