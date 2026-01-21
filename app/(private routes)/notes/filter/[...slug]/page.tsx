import type { Metadata } from 'next';

import { dehydrate, QueryClient } from '@tanstack/react-query';
import { HydrationBoundary } from '@tanstack/react-query';
import NotesClient from '@/app/(private routes)/notes/filter/[...slug]/Notes.client';
import { fetchNotesServer } from '@/lib/api/serverApi';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = slug?.[0] ?? 'all';

  const filterTag = tag === 'all' ? 'All Notes' : `Notes tagged "${tag}"`;
  const title = `Notes tag: ${filterTag} | NoteSpace`;
  const description =
    tag === 'all'
      ? 'Browse all notes in the application.'
      : `Browse all notes filtered by the tag "${tag}".`;

  const url = tag === 'all' ? '/notes/filter/all' : `/notes/filter/${tag}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      images: [
        {
          url: 'https://cdn-icons-png.flaticon.com/512/9239/9239205.png',
          width: 1200,
          height: 630,
          alt: `Notes tag: ${filterTag}`,
        },
      ],
    },
  };
}

export default async function FilteredNotesPage({ params }: PageProps) {
  const { slug } = await params;
  const tag = slug?.[0] ?? 'all';

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes', tag],
    queryFn: () => fetchNotesServer({ search: '', page: 1, perPage: 12, tag }),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}
