// Converts appearance settings into CSS custom properties for the storefront.

export const FONT_OPTIONS = [
  'Inter', 'Plus Jakarta Sans', 'Manrope', 'DM Sans', 'Outfit', 'Sora', 'Space Grotesk', 'Poppins',
  'Lexend', 'Urbanist', 'Figtree', 'Nunito', 'Rubik', 'Work Sans', 'Bricolage Grotesque',
  'Playfair Display', 'Cormorant Garamond', 'Bodoni Moda', 'Cinzel', 'Marcellus', 'Italiana', 'Jost', 'Fraunces', 'Noto Serif', 'Source Serif 4', 'Roboto', 'Open Sans', 'Oswald', 'Hind Siliguri', 'Noto Sans Bengali', 'Noto Serif Bengali', 'Baloo Da 2', 'Tiro Bangla', 'DM Serif Display', 'Lora', 'Merriweather', 'Instrument Serif', 'JetBrains Mono', 'Fugaz One',
  'Montserrat', 'Syne', 'Unbounded', 'Archivo', 'EB Garamond', 'Barlow Condensed', 'Red Hat Display',
];

export const THEME_PRESETS = {
  aurora: { label: 'Aurora', primaryColor: '#6d5dfc', accentColor: '#16c79a', backgroundColor: '#ffffff', surfaceColor: '#f6f7fb', textColor: '#0f172a', darkBackgroundColor: '#0b0d17', darkSurfaceColor: '#141729', darkTextColor: '#e7e9f3', headingFont: 'Plus Jakarta Sans', bodyFont: 'Inter', radius: 16 },
  sunset: { label: 'Sunset', primaryColor: '#f9572f', accentColor: '#ffb020', backgroundColor: '#fffaf6', surfaceColor: '#fff1e8', textColor: '#1f130d', darkBackgroundColor: '#140c08', darkSurfaceColor: '#21140e', darkTextColor: '#fbeee6', headingFont: 'Bricolage Grotesque', bodyFont: 'DM Sans', radius: 20 },
  ocean: { label: 'Ocean', primaryColor: '#0ea5e9', accentColor: '#22d3ee', backgroundColor: '#ffffff', surfaceColor: '#f0f7fb', textColor: '#0c1a2a', darkBackgroundColor: '#06111c', darkSurfaceColor: '#0c1c2c', darkTextColor: '#e2eef8', headingFont: 'Sora', bodyFont: 'Inter', radius: 12 },
  forest: { label: 'Forest', primaryColor: '#16a34a', accentColor: '#84cc16', backgroundColor: '#fbfdf8', surfaceColor: '#f1f6ec', textColor: '#132013', darkBackgroundColor: '#0a120a', darkSurfaceColor: '#121d12', darkTextColor: '#e5efe2', headingFont: 'Outfit', bodyFont: 'Figtree', radius: 14 },
  editorial: { label: 'Editorial', primaryColor: '#111111', accentColor: '#c2410c', backgroundColor: '#fbfaf7', surfaceColor: '#f2efe8', textColor: '#161513', darkBackgroundColor: '#0f0f0e', darkSurfaceColor: '#1a1917', darkTextColor: '#efede7', headingFont: 'Fraunces', bodyFont: 'Lora', radius: 4 },
  newsroom: { label: 'Newsroom', primaryColor: '#c4161c', accentColor: '#0f4c81', backgroundColor: '#ffffff', surfaceColor: '#f4f4f2', textColor: '#121212', darkBackgroundColor: '#0f0f10', darkSurfaceColor: '#1a1a1c', darkTextColor: '#ededed', headingFont: 'Noto Serif', bodyFont: 'Roboto', radius: 2 },
  cinema: { label: 'Cinema', primaryColor: '#e50914', accentColor: '#f5c518', backgroundColor: '#ffffff', surfaceColor: '#f3f3f3', textColor: '#141414', darkBackgroundColor: '#0b0b0b', darkSurfaceColor: '#181818', darkTextColor: '#f5f5f1', headingFont: 'Outfit', bodyFont: 'Inter', radius: 6 },
  bangla: { label: 'Bangla News', primaryColor: '#0b6e4f', accentColor: '#d62828', backgroundColor: '#ffffff', surfaceColor: '#f5f7f4', textColor: '#111827', darkBackgroundColor: '#0c120f', darkSurfaceColor: '#15201a', darkTextColor: '#e8efe9', headingFont: 'Noto Serif Bengali', bodyFont: 'Hind Siliguri', radius: 4 },
  neon: { label: 'Neon', primaryColor: '#d946ef', accentColor: '#22d3ee', backgroundColor: '#ffffff', surfaceColor: '#faf5ff', textColor: '#18111f', darkBackgroundColor: '#09060f', darkSurfaceColor: '#140d1e', darkTextColor: '#f3e8ff', headingFont: 'Space Grotesk', bodyFont: 'Manrope', radius: 22 },
};

export function hexToRgb(hex = '#000000') {
  let h = hex.replace('#', '').trim();
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const n = parseInt(h, 16);
  if (Number.isNaN(n)) return '0 0 0';
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
}

export function themeVars(a, mode = 'light') {
  const dark = mode === 'dark';
  return {
    '--c-primary': hexToRgb(a.primaryColor),
    '--c-accent': hexToRgb(a.accentColor),
    '--c-bg': hexToRgb(dark ? a.darkBackgroundColor : a.backgroundColor),
    '--c-surface': hexToRgb(dark ? a.darkSurfaceColor : a.surfaceColor),
    '--c-fg': hexToRgb(dark ? a.darkTextColor : a.textColor),
    '--radius': `${a.radius ?? 16}px`,
    '--container': `${a.containerWidth ?? 1200}px`,
    '--font-heading': `'${a.headingFont}'`,
    '--font-body': `'${a.bodyFont}'`,
  };
}

// Letter-spacing splits Bengali conjuncts apart, so sites using a Bengali font drop tracked text spacing.
const BENGALI_FONTS = ['Hind Siliguri', 'Noto Sans Bengali', 'Noto Serif Bengali', 'Baloo Da 2', 'Tiro Bangla'];
// Single-weight display fonts would otherwise be smeared into a fake bold by the extrabold heading classes.
const SINGLE_WEIGHT_FONTS = ['Fugaz One'];
export const scriptCss = (a) => [
  [a.headingFont, a.bodyFont].some((f) => BENGALI_FONTS.includes(f)) ? '[class*="tracking-"]{letter-spacing:0!important}' : '',
  SINGLE_WEIGHT_FONTS.includes(a.headingFont) ? '.font-heading{font-synthesis:none}' : '',
].join('');

const toCss = (vars) => Object.entries(vars).map(([k, v]) => `${k}:${v};`).join('');

// Full stylesheet: light vars on :root, dark vars on .dark (class toggled by the mode script).
export function themeCss(a) {
  return `:root{${toCss(themeVars(a, 'light'))}}html.dark{${toCss(themeVars(a, 'dark'))}}html{font-size:${a.baseFontSize || 16}px}${scriptCss(a)}`;
}

export function googleFontsUrl(fonts) {
  const families = [...new Set(fonts.filter(Boolean))]
    .map((f) => `family=${encodeURIComponent(f).replace(/%20/g, '+')}:wght@400;500;600;700;800`)
    .join('&');
  return `https://fonts.googleapis.com/css2?${families}&display=swap`;
}
