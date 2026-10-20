import '../globals.css';
import { Toaster } from 'sonner';
import { headers } from 'next/headers';
import { getBootstrap } from '@/lib/server';
import { googleFontsUrl, localeCss, scriptFont, themeCss } from '@/lib/theme';
import SiteChrome from '@/components/site/Chrome';
import { PreviewListener } from '@/components/site/Extras';
import InjectHtml from '@/components/site/InjectHtml';
import { AudioProvider } from '@/components/site/AudioPlayer';
import { RevealObserver } from '@/components/site/ShowcaseClient';
import SiteWidgets from '@/components/site/SiteWidgets';
import { JsonLd, siteJsonLd } from '@/components/site/StructuredData';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

// hreflang links: the same page in every language (/about, /bn/about…).
function languageAlternates(locale) {
  if (!locale?.enabled) return undefined;
  let path = '/';
  try { path = headers().get('x-locale-path') || '/'; } catch { /* outside a request */ }
  const at = (code) => (code === locale.defaultLanguage ? path : `/${code}${path === '/' ? '' : path}`);
  return { ...Object.fromEntries(locale.languages.map((l) => [l.code, at(l.code)])), 'x-default': path };
}

export async function generateMetadata() {
  const { settings, locale } = await getBootstrap();
  const { seo, general } = settings;
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: seo.metaTitle || general.siteName, template: `%s ${seo.titleSeparator} ${general.siteName}` },
    description: seo.metaDescription,
    keywords: seo.metaKeywords,
    icons: general.favicon ? { icon: general.favicon } : undefined,
    robots: seo.allowIndexing ? { index: true, follow: true } : { index: false, follow: false },
    twitter: { card: 'summary_large_image', site: seo.twitterHandle || undefined },
    alternates: { languages: languageAlternates(locale), types: { 'application/rss+xml': [{ url: '/feed.xml', title: general.siteName }] } },
    openGraph: { siteName: general.siteName, type: 'website', images: seo.ogImage ? [seo.ogImage] : undefined, locale: locale?.lang },
    verification: { google: seo.googleVerification || undefined, other: seo.bingVerification ? { 'msvalidate.01': seo.bingVerification } : undefined },
  };
}

export default async function SiteLayout({ children }) {
  // Render per request (data is still cached via fetch revalidation). This also lets the site build
  // without a running API — required for Docker / CI builds of exported projects.
  headers();
  const { settings, menus, theme, locale } = await getBootstrap();
  const { appearance: a, general, advanced, seo } = settings;
  const lang = locale?.lang || 'en';
  const modeScript = `(function(){try{var m=localStorage.getItem('site-theme')||'${a.colorMode}';if(m==='system')m=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';if(m==='dark')document.documentElement.classList.add('dark')}catch(e){}})()`;

  return (
    <html lang={lang} dir={locale?.dir || 'ltr'} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href={googleFontsUrl([a.headingFont, a.bodyFont, scriptFont(lang)])} />
        <style dangerouslySetInnerHTML={{ __html: themeCss(a) + localeCss(a, lang) }} />
        {advanced.customCss && <style id="nova-custom-css" dangerouslySetInnerHTML={{ __html: advanced.customCss }} />}
        <script dangerouslySetInnerHTML={{ __html: modeScript }} />
        <JsonLd data={siteJsonLd(settings, theme)} />
      </head>
      <body data-theme={theme?.id} data-style={theme?.layout?.style || 'modern'} className="flex min-h-screen flex-col bg-bg font-body text-fg transition-colors duration-300">
        {general.maintenanceMode ? (
          <main className="grid min-h-screen place-items-center p-8 text-center">
            <div>
              <div className="mx-auto mb-6 h-16 w-16 animate-float rounded-theme bg-gradient-to-br from-primary to-accent shadow-glow" />
              <h1 className="font-heading text-4xl font-extrabold">Under maintenance</h1>
              <p className="mx-auto mt-3 max-w-md text-fg/60">{general.maintenanceMessage}</p>
            </div>
          </main>
        ) : (
          <AudioProvider>
            <SiteChrome settings={settings} menus={menus} theme={theme} locale={locale}>{children}</SiteChrome>
          </AudioProvider>
        )}
        <PreviewListener />
        <RevealObserver />
        <noscript><style>{'.reveal{opacity:1!important;transform:none!important}'}</style></noscript>
        <Toaster position="bottom-center" richColors />
        {!general.maintenanceMode && <SiteWidgets seo={seo} contact={settings.contact} consent={advanced.cookieConsent} />}
        {advanced.headerScripts && <InjectHtml html={advanced.headerScripts} target="head" />}
        {advanced.footerScripts && <InjectHtml html={advanced.footerScripts} target="body" />}
      </body>
    </html>
  );
}
