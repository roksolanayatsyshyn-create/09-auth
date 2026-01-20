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
    const initAuth = async () => {
      try {
       
        const isAuthenticated = await checkSession();

        if (isAuthenticated) {
          
          const user = await getMe();
          if (user) setUser(user);
        } else {
          
          const isPrivate = PRIVATE_ROUTES.some((r) =>
            pathname.startsWith(r)
          );
          if (isPrivate) {
            clearIsAuthenticated();
            router.replace('/sign-in');
            return;
          }
        }
      } catch  {
        const isPrivate = PRIVATE_ROUTES.some((r) =>
          pathname.startsWith(r)
        );
        if (isPrivate) {
          clearIsAuthenticated();
          router.replace('/sign-in');
          return;
        }
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    initAuth();
  }, [pathname, router, setUser, clearIsAuthenticated]);

  if (loading) {
    return <p>Checking session...</p>;
  }

  return <>{children}</>;
}
