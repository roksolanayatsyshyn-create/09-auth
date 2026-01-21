'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { NoteList } from '@/components/NoteList/NoteList';
import { fetchNotes } from '@/lib/api/clientApi';
import css from './NotesPage.module.css';

interface NotesClientProps {
  tag: string;
}

export default function NotesClient({ tag }: NotesClientProps) {
  const { data } = useQuery({
    queryKey: ['notes', tag],
    queryFn: () => fetchNotes('', 1, 12, tag),
    staleTime: 1000 * 60,
  });

  const notes = data?.notes ?? [];

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <Link href="/notes/action/create" className={css.button}>
          Create note +
        </Link>
      </header>

      {notes.length > 0 && <NoteList notes={notes} />}
    </div>
  );
}
