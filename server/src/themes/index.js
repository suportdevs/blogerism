// Theme registry. Each theme bundles a header/article/listing layout, appearance preset,
// homepage + pages, menus, the content formats it uses, and optional demo content.
const THEMES = Object.fromEntries([
  require('./nova'),
  require('./herald'),
  require('./vidora'),
  require('./marquee'),
  require('./waveform'),
  require('./folio'),
].map((t) => [t.id, t]));

const DEFAULT_THEME = 'nova';

// What the storefront and admin need at runtime.
const publicTheme = (id) => {
  const t = THEMES[id] || THEMES[DEFAULT_THEME];
  return { id: t.id, name: t.name, category: t.category, layout: t.layout, features: t.features };
};

module.exports = { THEMES, DEFAULT_THEME, publicTheme };
