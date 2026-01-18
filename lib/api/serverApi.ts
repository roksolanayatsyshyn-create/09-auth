import type { Note, FetchNotesResponse } from '@/types/note.ts';
import type { User } from '@/types/user';
import nextServer from '@/lib/api/api';

interface GetNotesProps {
  search: string;
  page: number;
  perPage: number;
  tag: string;
}

export async function fetchNotesServer(
  { search, page, perPage, tag }: GetNotesProps,
  cookie?: string
): Promise<FetchNotesResponse> {
  const params = {
    search,
    page,
    perPage,
    tag: tag !== 'all' ? tag : undefined,
  };

  const res = await nextServer.get<FetchNotesResponse>('/notes', {
    params,
    headers: cookie ? { cookie } : undefined,
  });
  return res.data;
}

export async function fetchNoteByIdServer(
  id: string,
  cookie?: string
): Promise<Note> {
  const res = await nextServer.get<Note>(`/notes/${id}`, {
    headers: cookie ? { cookie } : undefined,
  });
  return res.data;
}

export async function checkServerSession(
  cookie?: string
): Promise<User | null> {
  const res = await nextServer.get<User | null>('/auth/session', {
    headers: cookie ? { cookie } : undefined,
  });
  return res.data ?? null;
}

export async function getMeServer(cookie?: string): Promise<User> {
  const res = await nextServer.get<User>('/users/me', {
    headers: cookie ? { cookie } : undefined,
  });
  return res.data;
}
