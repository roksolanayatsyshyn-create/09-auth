import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

import NoteDetailsClient from './NoteDetails.client';
import { fetchNoteByIdServer, checkServerSession } from '@/lib/api/serverApi';

type Props = {
  params: Promise<{ id: string }>;
};

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const note = await fetchNoteByIdServer(id);

  return {
    title: note.title,
    description: note.content.slice(0, 70),
  };
}

export default async function NotePage({ params }: Props) {
  const { id } = await params;
  const session = await checkServerSession();
  if (!session.data) {
    redirect('/notes/filter/all');
  }

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteByIdServer(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}
