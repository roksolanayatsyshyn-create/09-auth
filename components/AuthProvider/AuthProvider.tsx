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

  const setUser = useAuthStore((s) => s.setUser);
  const clearIsAuthenticated = useAuthStore((s) => s.clearIsAuthenticated);

  useEffect(() => {
    const checkAuth = async () => {
      const isPrivate = PRIVATE_ROUTES.some((route) =>
        pathname.startsWith(route)
      );

      if (!isPrivate) {
        setLoading(false);
        return;
      }

      try {
        const isAuthenticated = await checkSession();

        if (isAuthenticated) {
          const user = await getMe();
          if (user) setUser(user);
          setLoading(false);
        } else {
          clearIsAuthenticated();
          router.replace('/sign-in');
        }
      } catch {
        clearIsAuthenticated();
        router.replace('/sign-in');
      }
    };

    checkAuth();
  }, [pathname, router, setUser, clearIsAuthenticated]);

  if (loading) {
    return <p>Checking session...</p>;
  }

  return <>{children}</>;
}