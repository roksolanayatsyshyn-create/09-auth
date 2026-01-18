import type { Note, NoteData, FetchNotesResponse } from '@/types/note.ts';
import type { User } from '@/types/user';
import nextServer from '@/lib/api/api';
import axios from 'axios';

export interface UserUpDate {
  username: string;
}

export interface RegisterData {
  email: string;
  password: string;
}
export async function fetchNotes(
  search = '',
  page = 1,
  perPage = 12,
  tag: string
): Promise<FetchNotesResponse> {
  const params: {
    search: string;
    page: number;
    perPage: number;
    tag?: string;
  } = {
    search,
    page,
    perPage,
  };
  if (tag && tag !== 'all') {
    params.tag = tag;
  } else if (tag === 'all') {
    params.tag = undefined;
  }
  const res = await nextServer.get<FetchNotesResponse>('/notes', { params });
  return res.data;
}

export async function createNote(newNote: NoteData) {
  const res = await nextServer.post<Note>('/notes', newNote);
  return res.data;
}

export async function deleteNote(id: string) {
  const res = await nextServer.delete<Note>(`/notes/${id}`);
  return res.data;
}

export async function fetchNoteById(id: string) {
  const res = await nextServer.get<Note>(`/notes/${id}`);
  return res.data;
}

export async function getMe() {
  const res = await nextServer.get<User>('/users/me');
  return res.data;
}

export async function updateMe(data: UserUpDate) {
  const res = await nextServer.patch<User>('/users/me', data);
  return res.data;
}

export async function register(data: RegisterData): Promise<User> {
  try {
    const res = await nextServer.post<User>('/auth/register', data, {
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      throw err;
    }
    throw new Error('Unexpected error');
  }
}

export async function login(data: RegisterData) {
  const res = await nextServer.post<User>('/auth/login', data);
  return res.data;
}

export async function logout(): Promise<void> {
  await nextServer.post('/auth/logout');
}

export async function checkSession(): Promise<User | null> {
  const res = await nextServer.get<User | null>('/auth/session');
  return res.data ?? null;
}
