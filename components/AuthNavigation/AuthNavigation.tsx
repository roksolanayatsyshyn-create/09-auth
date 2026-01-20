'use client';

import Link from 'next/link';
import { useAuthStore } from '@/lib/store/authStore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { logout } from '@/lib/api/clientApi';
import css from './AuthNavigation.module.css';

export default function AuthNavigation() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const clearIsAuthenticated = useAuthStore((s) => s.clearIsAuthenticated);
  const setUser = useAuthStore((s) => s.setUser);
  const user = useAuthStore((s) => s.user);
  const [redirecting, setRedirecting] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      clearIsAuthenticated();
      setUser(null);
      setRedirecting(true);
      router.push('/sign-in');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (redirecting) return null;
  if (isAuthenticated) {
    return (
      <>
        <li className={css.navigationItem}>
          <Link href="/profile" prefetch={false} className={css.navigationLink}>
            Profile
          </Link>
        </li>

        <li className={css.navigationItem}>
          <p className={css.userEmail}>{user?.email}</p>
          <button className={css.logoutButton} onClick={handleLogout}>
            Logout
          </button>
        </li>
      </>
    );
  }

  return (
    <>
      <li className={css.navigationItem}>
        <Link href="/sign-in" prefetch={false} className={css.navigationLink}>
          Login
        </Link>
      </li>

      <li className={css.navigationItem}>
        <Link href="/sign-up" prefetch={false} className={css.navigationLink}>
          Register
        </Link>
      </li>
    </>
  );
}
