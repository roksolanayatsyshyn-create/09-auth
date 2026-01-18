import EditProfile from './EditProfile.client';
import { getMeServer, checkServerSession } from '@/lib/api/serverApi';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function EditProfilePage() {
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

  return <EditProfile serverUser={user} />;
}
