import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import NoteDetailsClient from './NoteDetails.client';
import { fetchNoteByIdServer, checkServerSession } from '@/lib/api/serverApi';

type Props = {
  params: { id: string };
};

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cookieStore = await cookies();
  const cookieHeader = [
    cookieStore.get('accessToken')?.value &&
      `accessToken=${cookieStore.get('accessToken')?.value}`,
    cookieStore.get('refreshToken')?.value &&
      `refreshToken=${cookieStore.get('refreshToken')?.value}`,
  ]
    .filter(Boolean)
    .join('; ');

  const note = await fetchNoteByIdServer(params.id, cookieHeader);

  return {
    title: note.title,
    description: note.content.slice(0, 70),
  };
}

export default async function NotePage({ params }: Props) {
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
    redirect('/notes/filter/all');
  }

  const note = await fetchNoteByIdServer(params.id, cookieHeader);

  return <NoteDetailsClient note={note} />;
}
