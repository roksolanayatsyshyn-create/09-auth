import { QueryClient, dehydrate } from '@tanstack/react-query';
import { fetchNotesServer } from '@/lib/api/serverApi';
import SidebarNotesClient from './SidebarNotes.client';

export const dynamic = 'force-dynamic';

export default async function Sidebar() {
  
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes'],
    queryFn: () =>
      fetchNotesServer(
        { search: '', page: 1, perPage: 12, tag: 'all' }
      ),
  });

  const dehydratedState = dehydrate(queryClient);

  return <SidebarNotesClient dehydratedState={dehydratedState} />;
}
