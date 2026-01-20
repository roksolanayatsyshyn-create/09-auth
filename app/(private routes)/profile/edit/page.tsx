import EditProfile from './EditProfile.client';
import { getMeServer, checkServerSession } from '@/lib/api/serverApi';
import { redirect } from 'next/navigation';

export default async function EditProfilePage() {
  const session = await checkServerSession();

  if (!session) {
    redirect('/auth/signin');
  }

  const user = await getMeServer();

  return <EditProfile serverUser={user} />;
}
