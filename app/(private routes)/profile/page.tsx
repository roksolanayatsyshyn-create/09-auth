import type { Metadata } from 'next';
import ProfileClient from './ProfilePage.client';
import { checkServerSession, getMeServer } from '@/lib/api/serverApi';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Profile Page | NoteHub',
  description: 'View and manage your NoteHub profile information.',
};

export default async function ProfilePage() {
  const cookieStore = await cookies();

  const cookieHeader = [
    cookieStore.get('accessToken')?.value &&
      `accessToken=${cookieStore.get('accessToken')?.value}`,
    cookieStore.get('refreshToken')?.value &&
      `refreshToken=${cookieStore.get('refreshToken')?.value}`,
  ]
    .filter(Boolean)
    .join('; ');

  const session = await checkServerSession(cookieHeader);

  if (!session) {
    redirect('/auth/signin');
  }

  const user = await getMeServer(cookieHeader);

  return <ProfileClient serverUser={user} />;
}
