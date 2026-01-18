'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { getMe } from '@/lib/api/clientApi';
import type { User } from '@/types/user';
import css from './ProfilePage.module.css';

export default function ProfilePage() {
  const setUser = useAuthStore((s) => s.setUser);
  const router = useRouter();
  const [user, setLocalUser] = useState<User | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const me = await getMe();
        setUser(me);
        setLocalUser(me);
      } catch {
        router.push('/sign-in');
      }
    }

    loadProfile();
  }, [router, setUser]);

  if (!user) return null;

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <button
            className={css.editProfileButton}
            onClick={() => router.push('/profile/edit')}
          >
            Edit Profile
          </button>
        </div>

        <div className={css.avatarWrapper}>
          <Image
            src={user.avatar ?? '/default-avatar.png'}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>

        <div className={css.profileInfo}>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
        </div>
      </div>
    </main>
  );
}
