// Every permission module available in the CMS. Roles store a subset of these keys
// (or "*" for full access). The admin UI renders this list in the role editor.
const PERMISSIONS = [
  { key: 'posts', label: 'Blog posts', group: 'Content' },
  { key: 'categories', label: 'Categories & tags', group: 'Content' },
  { key: 'series', label: 'Series, playlists & podcasts', group: 'Content' },
  { key: 'pages', label: 'Pages & page builder', group: 'Content' },
  { key: 'media', label: 'Media library', group: 'Content' },
  { key: 'faqs', label: 'FAQs', group: 'Content' },
  { key: 'testimonials', label: 'Testimonials', group: 'Content' },
  { key: 'menus', label: 'Menus', group: 'Appearance' },
  { key: 'appearance', label: 'Theme customizer', group: 'Appearance' },
  { key: 'contacts', label: 'Contact messages', group: 'Engagement' },
  { key: 'comments', label: 'Comments & moderation', group: 'Engagement' },
  { key: 'newsletter', label: 'Newsletter subscribers', group: 'Engagement' },
  { key: 'users', label: 'Users', group: 'System' },
  { key: 'roles', label: 'Roles & permissions', group: 'System' },
  { key: 'settings', label: 'System settings', group: 'System' },
  { key: 'logs', label: 'Activity logs', group: 'System' },
  { key: 'redirects', label: 'Redirects & 404 monitor', group: 'System' },
  { key: 'translations', label: 'Translations', group: 'Content' },
  { key: 'backups', label: 'Backup & restore', group: 'System' },
];

const hasPermission = (user, key) => {
  const perms = user?.role?.permissions || [];
  return perms.includes('*') || perms.includes(key);
};

module.exports = { PERMISSIONS, hasPermission };
