'use client';

import { register } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { AxiosError } from 'axios';
import css from './SignUpPage.module.css';

export default function SignUp() {
  const setUser = useAuthStore((s) => s.setUser);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setError(null);

    const userData = Object.fromEntries(formData) as {
      email: string;
      password: string;
    };

    try {
      const user = await register(userData);

      if (user) {
        setUser(user);
        router.push('/profile');
      }
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      if (axiosError.response?.status === 409) {
        setError('A user with this email already exists.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    }
  };

  return (
    <main className={css.mainContent}>
      <h1 className={css.formTitle}>Sign up</h1>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          await handleSubmit(formData);
        }}
        className={css.form}
      >
        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            className={css.input}
            required
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            className={css.input}
            required
          />
        </div>

        <div className={css.actions}>
          <button type="submit" className={css.submitButton}>
            Register
          </button>
        </div>

        <p className={css.error}>{error}</p>
      </form>
    </main>
  );
}
