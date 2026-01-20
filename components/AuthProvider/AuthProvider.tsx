'use client';

import { useAuthStore } from '@/lib/store/authStore';
import { checkSession, getMe } from '@/lib/api/clientApi';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

interface Props {
  children: React.ReactNode;
}

const PRIVATE_ROUTES = ['/profile', '/notes'];

export default function AuthProvider({ children }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const setUser = useAuthStore.getState().setUser;
  const clearIsAuthenticated = useAuthStore.getState().clearIsAuthenticated;

  useEffect(() => {
    const checkAuth = async () => {
      const isPrivate = PRIVATE_ROUTES.some((r) => pathname.startsWith(r));

      if (!isPrivate) {
        setLoading(false);
        return;
      }

      try {
        const isAuthenticated = await checkSession();

        if (!isAuthenticated) {
          clearIsAuthenticated();
          router.replace('/');
          return;
        }

        const user = await getMe();
        if (user) {
          setUser(user);
        } else {
          clearIsAuthenticated();
          router.replace('/');
        }
      } catch {
        clearIsAuthenticated();
        router.replace('/');
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    checkAuth();
  }, [pathname, router]);

  if (loading) {
    return <p>Checking session...</p>;
  }

  return <>{children}</>;
}
