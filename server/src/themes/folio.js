const { B, m, commonPages } = require('./helpers');

// Personal portfolio theme — demo content is Md. Mamunur Rashid's CV; edit everything in the page builder.
const PROFILE = {
  name: 'Md. Mamunur Rashid',
  email: 'suportdevs@gmail.com',
  phone: '+8801571204083',
  location: 'Dhaka, Bangladesh',
  github: 'https://github.com/suportdevs',
  linkedin: 'https://linkedin.com/in/suportdevs',
};

module.exports = {
  id: 'folio',
  name: 'Folio',
  category: 'Personal portfolio',
  description: 'A bold one-page portfolio for developers & creatives: animated hero, skills, experience timeline, projects and contact.',
  features: { formats: ['STANDARD'], series: [], blocks: ['Portfolio', 'Headers', 'Interactive', 'Content', 'Media', 'Conversion', 'Layout'] },
  layout: { header: 'portfolio', article: 'blog', listing: 'cards' },
  general: { siteName: PROFILE.name, tagline: 'Full Stack Web Developer' },
  contact: { email: PROFILE.email, phone: PROFILE.phone, address: PROFILE.location, workingHours: 'Sun – Thu, 10:00 – 19:00 (GMT+6)' },
  social: { github: PROFILE.github, linkedin: PROFILE.linkedin, facebook: '', twitter: '', instagram: '', youtube: '' },
  seo: { metaTitle: `${PROFILE.name} — Full Stack Web Developer`, metaDescription: 'Full Stack Web Developer specialising in Laravel, Node.js, Django, React and Next.js — enterprise ERPs, multi-tenant SaaS and high-performance APIs.' },
  appearance: {
    preset: 'folio', primaryColor: '#6366f1', accentColor: '#22d3ee', backgroundColor: '#fafafa', surfaceColor: '#f1f2f6', textColor: '#0b0d14',
    darkBackgroundColor: '#07080f', darkSurfaceColor: '#10131f', darkTextColor: '#e8eaf2', headingFont: 'Space Grotesk', bodyFont: 'Inter',
    radius: 18, colorMode: 'dark', footerStyle: 'simple', containerWidth: 1180, backToTop: true,
    footerText: 'Designed & built with Themewright — Express, Next.js & PostgreSQL.',
    headerCta: { enabled: true, label: 'Hire me', url: '/#contact' },
    announcement: { enabled: false, text: '', linkLabel: '', url: '' },
  },
  menus: {
    header: { name: 'Sections', items: [m('About', '/#about'), m('Skills', '/#skills'), m('Experience', '/#experience'), m('Projects', '/#projects'), m('Contact', '/#contact')] },
    footer: { name: 'Links', items: [m('About', '/#about'), m('Projects', '/#projects'), m('Contact', '/#contact')] },
  },
  pages: () => [
    {
      slug: 'folio-home', title: 'Home', home: true, template: 'landing', seoTitle: `${PROFILE.name} — Full Stack Web Developer`,
      blocks: [
        B('profileHero', {
          availability: 'Open to full-time & freelance roles',
          greeting: 'Hi there, I’m',
          name: PROFILE.name,
          roles: ['Full Stack Web Developer', 'Laravel & Node.js Engineer', 'ERP & SaaS Architect', 'React & Next.js Developer'],
          intro: 'I build, scale and maintain enterprise-grade web applications, ERPs and multi-tenant SaaS platforms — 18+ of them running in production today, handling 50,000+ daily transactions with 99.9% uptime.',
          location: PROFILE.location, image: '',
          stack: ['Laravel', 'Node.js', 'Django', 'Next.js'],
          badges: ['18+ apps in production', '99.9% uptime', '150+ REST APIs'],
          primaryLabel: 'View my work', primaryUrl: '#projects', secondaryLabel: 'Let’s talk', secondaryUrl: '#contact',
          github: PROFILE.github, linkedin: PROFILE.linkedin, email: PROFILE.email,
        }, { paddingY: 'xl', width: 'wide', anchor: 'home', animate: true }),

        B('stats', { items: [{ value: '3+', label: 'Years experience' }, { value: '18+', label: 'Production apps' }, { value: '50K+', label: 'Daily transactions' }, { value: '100K+', label: 'Monthly users' }] }, { background: 'surface', paddingY: 'md' }),

        B('aboutMe', {
          eyebrow: '01. About me',
          title: 'I turn complex business workflows into fast, reliable software.',
          text: 'I’m a result-driven Full Stack Web Developer with 3+ years of professional experience building enterprise web applications, ERPs and multi-tenant SaaS platforms with PHP (Laravel), Node.js (Express.js), Python (Django), React.js and Next.js.\n\nMy work spans the whole stack — from RESTful API design and role-based access control to database query optimization (cutting response times by up to 40%) and Linux server management. I care about clean architecture, measurable performance and software that real teams depend on every day.',
          facts: [
            { label: 'Based in', value: PROFILE.location },
            { label: 'Email', value: PROFILE.email },
            { label: 'Phone', value: PROFILE.phone },
            { label: 'Languages', value: 'Bengali (native), English (professional)' },
            { label: 'Currently', value: 'Application Developer @ Legend IT Solution' },
            { label: 'Studying', value: 'B.Sc. in CSE — University of South Asia' },
          ],
          buttonLabel: '', buttonUrl: '',
        }, { paddingY: 'xl', anchor: 'about' }),

        B('skills', {
          eyebrow: '02. Skills', title: 'My technical toolkit', subtitle: 'Technologies I use to design, build and run production systems.',
          groups: [
            { icon: 'Server', title: 'Backend', items: ['PHP (Laravel)', 'Node.js (Express.js)', 'Python (Django)', 'RESTful APIs', 'Microservices'] },
            { icon: 'Code2', title: 'Frontend', items: ['JavaScript (ES6+)', 'React.js', 'Next.js', 'Redux Toolkit', 'HTML5', 'CSS3'] },
            { icon: 'Palette', title: 'UI frameworks', items: ['Tailwind CSS', 'Material UI', 'Bootstrap'] },
            { icon: 'Database', title: 'Databases & ORM', items: ['PostgreSQL', 'MySQL', 'MongoDB', 'Prisma', 'Eloquent'] },
            { icon: 'Boxes', title: 'Architecture', items: ['Enterprise ERP', 'Multi-tenant SaaS', 'Modular architecture', 'RBAC'] },
            { icon: 'Gauge', title: 'Performance & scale', items: ['Query optimization', 'Indexing', 'Caching', 'Replication', 'Load balancing', 'Socket.io real-time'] },
            { icon: 'Terminal', title: 'Tools & DevOps', items: ['Git & GitHub', 'Linux (Ubuntu)', 'Nginx', 'PM2', 'Postman', 'CI/CD'] },
            { icon: 'Users', title: 'Soft skills', items: ['Clear communicator', 'Team player', 'Problem solver'] },
          ],
        }, { background: 'surface', paddingY: 'xl', anchor: 'skills' }),

        B('timeline', {
          eyebrow: '03. Experience', title: 'Where I’ve been building',
          items: [{
            title: 'Application Developer', org: 'Legend IT Solution', location: 'Rangpur, Bangladesh', period: 'Jan 2022 – Present', description: '',
            bullets: [
              'System architecture & scale: Architected and deployed scalable backend services with Laravel, Node.js and Django for 18+ enterprise production applications serving 100,000+ monthly users.',
              'Enterprise ERP development: Engineered end-to-end ERP and SaaS applications integrating POS, multi-location inventory, supply chain, HR and accounting — a 30% reduction in client operational workflows.',
              'Database & query optimization: Optimized MySQL and PostgreSQL queries, indexing and eager loading — 35% faster page loads and server response time cut from 1.2s to under 300ms.',
              'API development & integration: Built and documented 150+ RESTful APIs with JWT/Sanctum authentication and RBAC for cross-platform integrations.',
              'Real-time infrastructure: Integrated real-time messaging, live order updates and stock tracking with Socket.io for sub-second synchronization.',
              'Server management: Managed Ubuntu/Nginx deployments, environment configuration and continuous updates with 99.9% availability.',
            ],
            tags: ['Laravel', 'Node.js', 'Django', 'React', 'PostgreSQL', 'MySQL', 'Socket.io', 'Nginx'],
          }],
        }, { paddingY: 'xl', width: 'narrow', anchor: 'experience' }),

        B('projects', {
          eyebrow: '04. Projects', title: 'Things I’ve built', subtitle: 'A selection of live production systems and personal projects.',
          items: [
            { title: 'Akboria Limited', url: 'https://akborialimited.com', category: 'Enterprise ERP', featured: true, image: '', description: 'Multi-business ERP managing 6+ operational units — bakery, hotel, restaurant and sweet production — with centralized POS, inventory and HR workflows.', tags: ['ERP', 'POS', 'Inventory', 'HR'] },
            { title: 'Sha Sultan & VIP Poultry', url: 'https://shasultanpoultry.com', category: 'Industrial ERP', featured: false, image: '', description: 'End-to-end poultry ERP for feed-mill production tracking, batch inventory and distribution operations.', tags: ['Production', 'Batch inventory', 'Distribution'] },
            { title: 'Tarek Bakery & Equator', url: 'https://tarekbakery.com', category: 'Multi-tenant SaaS', featured: false, image: '', description: 'SaaS platforms for scalable multi-location food production, supply chain and centralized corporate operations.', tags: ['SaaS', 'Multi-tenant', 'Supply chain'] },
            { title: 'Matribhumi Dairy & Varosha Food', url: 'https://matribhumidairy.com', category: 'Manufacturing ERP', featured: false, image: '', description: 'Large-scale manufacturing ERPs with automated batch processing, stock audits, real-time distribution tracking and accounting.', tags: ['Manufacturing', 'Accounting', 'Real-time'] },
            { title: 'Real-Time Private Chat', url: '', category: 'Personal project', featured: false, image: '', description: 'Event-driven messaging app with low-latency communication, user presence, search filtering and message controls.', tags: ['Node.js', 'Express.js', 'MongoDB', 'Socket.io'] },
            { title: 'Dynamic CMS Platform', url: '', category: 'Personal project', featured: false, image: '', description: 'Lightweight, SEO-optimized CMS with customizable admin panels and page building for non-technical users.', tags: ['Laravel', 'Tailwind CSS', 'MySQL'] },
            { title: 'Themewright', url: '', category: 'Personal project', featured: true, image: '', description: 'This website! A themeable CMS with a visual page builder, news, video, streaming, podcast and portfolio themes, RBAC and a media library.', tags: ['Express.js', 'Next.js', 'PostgreSQL', 'Prisma', 'Tailwind'] },
          ],
        }, { paddingY: 'xl', width: 'wide', anchor: 'projects' }),

        B('timeline', {
          eyebrow: '05. Education', title: 'Learning & qualifications',
          items: [
            { title: 'B.Sc. in Computer Science & Engineering', org: 'University of South Asia', location: '', period: 'Expected Dec 2028', description: '', bullets: [], tags: [] },
            { title: 'Diploma in Computer Engineering', org: 'Rangpur Polytechnic Institute', location: '', period: 'Aug 2017 – Apr 2022', description: '', bullets: [], tags: [] },
            { title: 'SSC — Electronics Technology', org: 'Rangpur Technical School & College', location: '', period: 'Aug 2016 – Apr 2017', description: '', bullets: [], tags: [] },
          ],
        }, { background: 'surface', paddingY: 'xl', width: 'narrow', anchor: 'education' }),

        B('cta', { title: 'Have a project in mind?', text: 'I’m open to full-time roles and freelance work — ERPs, SaaS platforms, APIs and modern web apps.', primaryLabel: 'Get in touch', primaryUrl: '#contact', secondaryLabel: 'GitHub', secondaryUrl: PROFILE.github }, { paddingY: 'lg' }),

        B('contactForm', { title: 'Let’s work together', text: 'Send me a message and I’ll get back to you within 24 hours.', showInfo: true }, { paddingY: 'xl', anchor: 'contact' }),
      ],
    },
    commonPages.privacy(),
  ],

  async demo() {
    // A one-page portfolio: all content lives in the homepage blocks above.
  },
};
