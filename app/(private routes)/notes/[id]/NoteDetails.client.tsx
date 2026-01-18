'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api/clientApi';
import css from './NoteDetails.module.css';

export default function NoteDetailsClient() {
  const params = useParams<{ id: string }>();
  const noteId = params.id;

  const {
    data: note,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['note', noteId],
    queryFn: () => fetchNoteById(noteId),
    enabled: Boolean(noteId),
  });

  if (isLoading) {
    return <p>Loading note...</p>;
  }

  if (isError || !note) {
    return <p>Could not fetch note details.</p>;
  }

  return (
    <div className={css.container}>
      <div className={css.item}>
        <div className={css.header}>
          <h2>{note.title}</h2>
        </div>
        <p className={css.content}>{note.content}</p>
        <p className={css.date}>{note.createdAt}</p>
      </div>
    </div>
  );
}
