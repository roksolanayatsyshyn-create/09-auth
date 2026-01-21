'use client';

import { useAuthStore } from '@/lib/store/authStore';
import { checkSession, getMe } from '@/lib/api/clientApi';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

interface Props {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const setUser = useAuthStore((s) => s.setUser);
  const clearIsAuthenticated = useAuthStore((s) => s.clearIsAuthenticated);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuthenticated = await checkSession();

        if (isAuthenticated) {
          const user = await getMe();
          if (user) setUser(user);
        } else {
          clearIsAuthenticated();
        }
      } catch {
        clearIsAuthenticated();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [pathname, router, setUser, clearIsAuthenticated]);

  if (loading) {
    return <p>Checking session...</p>;
  }

  return <>{children}</>;
}
