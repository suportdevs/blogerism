import '../globals.css';
import { Toaster } from 'sonner';
import { headers } from 'next/headers';
import { getBootstrap } from '@/lib/server';
import { googleFontsUrl, themeCss } from '@/lib/theme';
import SiteChrome from '@/components/site/Chrome';
import { PreviewListener } from '@/components/site/Extras';
import InjectHtml from '@/components/site/InjectHtml';
import { AudioProvider } from '@/components/site/AudioPlayer';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export async function generateMetadata() {
  const { settings } = await getBootstrap();
  const { seo, general } = settings;
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: seo.metaTitle || general.siteName, template: `%s ${seo.titleSeparator} ${general.siteName}` },
    description: seo.metaDescription,
    keywords: seo.metaKeywords,
    icons: general.favicon ? { icon: general.favicon } : undefined,
    robots: seo.allowIndexing ? { index: true, follow: true } : { index: false, follow: false },
    openGraph: { siteName: general.siteName, type: 'website', images: seo.ogImage ? [seo.ogImage] : undefined },
    twitter: { card: 'summary_large_image', site: seo.twitterHandle || undefined },
  };
}

export default async function SiteLayout({ children }) {
  // Render per request (data is still cached via fetch revalidation). This also lets the site build
  // without a running API — required for Docker / CI builds of exported projects.
  headers();
  const { settings, menus, theme } = await getBootstrap();
  const { appearance: a, general, advanced, seo } = settings;
  const modeScript = `(function(){try{var m=localStorage.getItem('site-theme')||'${a.colorMode}';if(m==='system')m=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';if(m==='dark')document.documentElement.classList.add('dark')}catch(e){}})()`;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href={googleFontsUrl([a.headingFont, a.bodyFont])} />
        <style dangerouslySetInnerHTML={{ __html: themeCss(a) }} />
        {advanced.customCss && <style id="nova-custom-css" dangerouslySetInnerHTML={{ __html: advanced.customCss }} />}
        <script dangerouslySetInnerHTML={{ __html: modeScript }} />
        {seo.googleAnalyticsId && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${seo.googleAnalyticsId}`} />
            <script dangerouslySetInnerHTML={{ __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${seo.googleAnalyticsId}');` }} />
          </>
        )}
      </head>
      <body data-theme={theme?.id} className="flex min-h-screen flex-col bg-bg font-body text-fg transition-colors duration-300">
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
            <SiteChrome settings={settings} menus={menus} theme={theme}>{children}</SiteChrome>
          </AudioProvider>
        )}
        <PreviewListener />
        <Toaster position="bottom-center" richColors />
        {advanced.headerScripts && <InjectHtml html={advanced.headerScripts} target="head" />}
        {advanced.footerScripts && <InjectHtml html={advanced.footerScripts} target="body" />}
      </body>
    </html>
  );
}
