import type { Note, FetchNotesResponse } from '@/types/note';
import type { User } from '@/types/user';
import nextServer from '@/lib/api/api';
import { cookies } from 'next/headers';
import type { AxiosResponse } from 'axios';

interface GetNotesProps {
  search: string;
  page: number;
  perPage: number;
  tag: string;
}

export async function fetchNotesServer({
  search,
  page,
  perPage,
  tag,
}: GetNotesProps): Promise<FetchNotesResponse> {
  const cookieStore = await cookies();
  const cookieHeader = [
    cookieStore.get('accessToken')?.value &&
      `accessToken=${cookieStore.get('accessToken')?.value}`,
    cookieStore.get('refreshToken')?.value &&
      `refreshToken=${cookieStore.get('refreshToken')?.value}`,
  ]
    .filter(Boolean)
    .join('; ');

  const params = {
    search,
    page,
    perPage,
    tag: tag !== 'all' ? tag : undefined,
  };

  const res = await nextServer.get<FetchNotesResponse>('/notes', {
    params,
    headers: cookieHeader ? { cookie: cookieHeader } : undefined,
  });

  return res.data;
}

export async function fetchNoteByIdServer(id: string): Promise<Note> {
  const cookieStore = await cookies();
  const cookieHeader = [
    cookieStore.get('accessToken')?.value &&
      `accessToken=${cookieStore.get('accessToken')?.value}`,
    cookieStore.get('refreshToken')?.value &&
      `refreshToken=${cookieStore.get('refreshToken')?.value}`,
  ]
    .filter(Boolean)
    .join('; ');

  const res = await nextServer.get<Note>(`/notes/${id}`, {
    headers: cookieHeader ? { cookie: cookieHeader } : undefined,
  });

  return res.data;
}

export async function checkServerSession(): Promise<
  AxiosResponse<User | null>
> {
  const cookieStore = await cookies();
  const cookieHeader = [
    cookieStore.get('accessToken')?.value &&
      `accessToken=${cookieStore.get('accessToken')?.value}`,
    cookieStore.get('refreshToken')?.value &&
      `refreshToken=${cookieStore.get('refreshToken')?.value}`,
  ]
    .filter(Boolean)
    .join('; ');

  const res = await nextServer.get<User | null>('/auth/session', {
    headers: cookieHeader ? { cookie: cookieHeader } : undefined,
  });

  return res;
}

export async function getMeServer(): Promise<User> {
  const cookieStore = await cookies();
  const cookieHeader = [
    cookieStore.get('accessToken')?.value &&
      `accessToken=${cookieStore.get('accessToken')?.value}`,
    cookieStore.get('refreshToken')?.value &&
      `refreshToken=${cookieStore.get('refreshToken')?.value}`,
  ]
    .filter(Boolean)
    .join('; ');

  const res = await nextServer.get<User>('/users/me', {
    headers: cookieHeader ? { cookie: cookieHeader } : undefined,
  });

  return res.data;
}
