import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

import NoteDetailsClient from './NoteDetails.client';
import {
  fetchNoteByIdServer,
  checkServerSession,
} from '@/lib/api/serverApi';

type Props = {
  params: { id: string };
};

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const note = await fetchNoteByIdServer(params.id);

  return {
    title: note.title,
    description: note.content.slice(0, 70),
  };
}

export default async function NotePage({ params }: Props) {
  const session = await checkServerSession();
  if (!session.data) {
    redirect('/notes/filter/all');
  }

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['note', params.id],
    queryFn: () => fetchNoteByIdServer(params.id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}
