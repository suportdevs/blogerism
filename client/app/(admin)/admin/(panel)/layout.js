'use client';

import { AuthProvider, useAuth } from '@/components/admin/AuthProvider';
import Shell from '@/components/admin/Shell';
import { SiteThemeProvider } from '@/components/admin/SiteTheme';
import { ConfirmProvider, PageLoader } from '@/components/admin/ui';

function Guard({ children }) {
  const { user, loading } = useAuth();
  if (loading || !user) return <div className="grid min-h-screen place-items-center bg-ink-50 dark:bg-ink-950"><PageLoader /></div>;
  return <SiteThemeProvider><Shell>{children}</Shell></SiteThemeProvider>;
}

export default function PanelLayout({ children }) {
  return (
    <AuthProvider>
      <ConfirmProvider>
        <Guard>{children}</Guard>
      </ConfirmProvider>
    </AuthProvider>
  );
}
