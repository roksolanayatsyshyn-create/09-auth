import { QueryClient, dehydrate } from '@tanstack/react-query';
import { HydrationBoundary } from '@tanstack/react-query';
import { fetchNoteByIdServer } from '@/lib/api/serverApi';
import NotePreview from '@/app/@modal/(.)notes/[id]/NotePreview.client';

type Props = {
  params: Promise<{ id: string }>;
};
export default async function NoteModalPage({ params }: Props) {
  const { id } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteByIdServer(id),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <NotePreview id={id} />
    </HydrationBoundary>
  );
}
