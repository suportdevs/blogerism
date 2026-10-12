import '../globals.css';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { Toaster } from 'sonner';

const font = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-admin', display: 'swap' });

export const metadata = {
  title: { default: 'Nova CMS Admin', template: '%s · Nova CMS' },
  robots: { index: false, follow: false },
};

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
