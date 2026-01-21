'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import { useAuthStore } from '@/lib/store/authStore';
import { updateMe, getMe } from '@/lib/api/clientApi';
import css from './EditProfile.module.css';

export default function EditProfilePage() {
  const router = useRouter();

  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  const [username, setUsername] = useState('');

  useEffect(() => {
    const loadUser = async () => {
      if (!user) {
        const me = await getMe();
        if (!me) {
          router.replace('/profile');
          return;
        }
        setUser(me);
        setUsername(me.username);
      } else {
        setUsername(user.username);
      }
    };

    loadUser();
  }, [user, setUser, router]);

  if (!user) {
    return <p>Loading...</p>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatedUser = await updateMe({ username });

    if (updatedUser) {
      setUser(updatedUser);
      router.push('/profile');
    }
  };

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <Image
          src={user.avatar || '/default-avatar.png'}
          alt="User Avatar"
          width={120}
          height={120}
          className={css.avatar}
        />

        <form className={css.profileInfo} onSubmit={handleSubmit}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              className={css.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <p>Email: {user.email}</p>

          <div className={css.actions}>
            <button type="submit" className={css.saveButton}>
              Save
            </button>
            <button
              type="button"
              className={css.cancelButton}
              onClick={() => router.push('/profile')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
