import '../globals.css';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { Toaster } from 'sonner';
import { fetchPublic } from '@/lib/server';
import { EDITION } from '@/lib/edition';

const font = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-admin', display: 'swap' });

// Tab title and favicon follow Settings → Admin panel; the admin still loads if the API is down.
export async function generateMetadata() {
  let brand = {};
  try { brand = (await fetchPublic('/admin-brand', { revalidate: 10, allow404: true })) || {}; } catch { /* API unreachable */ }
  const name = brand.name || EDITION.brand;
  return {
    title: { default: `${name} Admin`, template: `%s · ${name}` },
    robots: { index: false, follow: false },
    ...(brand.favicon ? { icons: { icon: brand.favicon } } : {}),
  };
}

const themeScript = `(function(){try{var m=localStorage.getItem('admin-theme');if(m==='dark'||(!m&&matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.classList.add('dark')}catch(e){}})()`;

export default function AdminRootLayout({ children }) {
  return (
    <html lang="en" className={font.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="bg-ink-50 font-admin antialiased dark:bg-ink-950">
        {children}
        <Toaster position="bottom-right" richColors closeButton toastOptions={{ className: 'font-admin' }} />
      </body>
    </html>
  );
}
