'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { api, tokenStore } from '@/lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const refresh = useCallback(async () => {
    if (!tokenStore.get()) { setUser(null); setLoading(false); return; }
    try {
      const { user: u } = await api.get('/auth/me');
      setUser(u);
    } catch {
      tokenStore.clear();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  useEffect(() => {
    if (!loading && !user && pathname !== '/admin/login') router.replace(`/admin/login?next=${encodeURIComponent(pathname)}`);
  }, [loading, user, pathname, router]);

  const login = async (email, password) => {
    const { token, user: u } = await api.post('/auth/login', { email, password });
    tokenStore.set(token);
    setUser(u);
    return u;
  };

  const logout = () => {
    tokenStore.clear();
    setUser(null);
    router.replace('/admin/login');
  };

  const can = useCallback((perm) => {
    const perms = user?.role?.permissions || [];
    return perms.includes('*') || perms.includes(perm);
  }, [user]);

  return <AuthContext.Provider value={{ user, setUser, loading, login, logout, can, refresh }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
