/** @type {import('tailwindcss').Config} */
const v = (name) => `rgb(var(${name}) / <alpha-value>)`;

module.exports = {
  darkMode: 'class',
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}', './lib/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Storefront tokens — driven by the Theme Customizer through CSS variables.
        primary: v('--c-primary'),
        accent: v('--c-accent'),
        bg: v('--c-bg'),
        surface: v('--c-surface'),
        fg: v('--c-fg'),
        // Admin brand scale (fixed).
        brand: {
          50: '#f2f0ff', 100: '#e6e2ff', 200: '#cfc8ff', 300: '#ada1ff', 400: '#8a77ff',
          500: '#6d5dfc', 600: '#5a43f0', 700: '#4b34d4', 800: '#3e2cab', 900: '#352a87', 950: '#1f1854',
        },
        ink: {
          50: '#f7f7fb', 100: '#eeeef5', 200: '#dcdce8', 300: '#bdbdd0', 400: '#8e8ea8', 500: '#6b6b85',
          600: '#52526a', 700: '#3d3d52', 800: '#26263a', 850: '#1c1c2d', 900: '#14141f', 950: '#0c0c14',
        },
      },
      borderRadius: { theme: 'var(--radius)', 'theme-lg': 'calc(var(--radius) * 1.5)' },
      fontFamily: {
        heading: ['var(--font-heading)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        admin: ['var(--font-admin)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      maxWidth: { container: 'var(--container)' },
      boxShadow: {
        soft: '0 1px 2px rgb(16 16 40 / 0.04), 0 4px 16px -4px rgb(16 16 40 / 0.08)',
        glow: '0 10px 40px -10px rgb(var(--c-primary) / 0.55)',
        'brand-glow': '0 8px 30px -8px rgb(109 93 252 / 0.6)',
      },
      keyframes: {
        'fade-up': { from: { opacity: 0, transform: 'translateY(12px)' }, to: { opacity: 1, transform: 'none' } },
        'fade-in': { from: { opacity: 0 }, to: { opacity: 1 } },
        'scale-in': { from: { opacity: 0, transform: 'scale(.96)' }, to: { opacity: 1, transform: 'none' } },
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        draw: { from: { strokeDashoffset: 1 }, to: { strokeDashoffset: 0 } },
        wiggle: { '0%,100%': { transform: 'rotate(-6deg)' }, '50%': { transform: 'rotate(6deg)' } },
      },
      animation: {
        'fade-up': 'fade-up .6s cubic-bezier(.2,.7,.2,1) both',
        'fade-in': 'fade-in .2s ease-out both',
        'scale-in': 'scale-in .18s ease-out both',
        marquee: 'marquee 30s linear infinite',
        float: 'float 6s ease-in-out infinite',
        draw: 'draw 1.1s cubic-bezier(.65,0,.35,1) .35s both',
        wiggle: 'wiggle 1.2s ease-in-out infinite',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
