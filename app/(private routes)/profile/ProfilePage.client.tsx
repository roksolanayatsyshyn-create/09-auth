'use client';

import Image from 'next/image';
import { useAuthStore } from '@/lib/store/authStore';
import { User } from '@/types/user';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import css from './ProfilePage.module.css';

interface ProfileClientProps {
  serverUser: User;
}

export default function ProfileClient({ serverUser }: ProfileClientProps) {
  const setUser = useAuthStore((s) => s.setUser);
  const router = useRouter();

  useEffect(() => {
    setUser(serverUser);
  }, [serverUser, setUser]);

  const handleClick = () => {
    router.push('/profile/edit');
  };

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <button className={css.editProfileButton} onClick={handleClick}>
            Edit Profile
          </button>
        </div>
        <div className={css.avatarWrapper}>
          <Image
            src={serverUser.avatar ?? '/default-avatar.png'}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>
        <div className={css.profileInfo}>
          <p>Username: {serverUser.username}</p>
          <p>Email: {serverUser.email}</p>
        </div>
      </div>
    </main>
  );
}
