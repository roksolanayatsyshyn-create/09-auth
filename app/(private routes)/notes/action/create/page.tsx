import { Metadata } from 'next';
import { NoteForm } from '@/components/NoteForm/NoteForm';

import css from './CreateNote.module.css';

export const metadata: Metadata = {
  title: 'Create note | NoteHub',
  description: 'The page where you are creating notes.',

  openGraph: {
    title: 'Create note | NoteHub',
    description: 'The page where you are creating notes.',
    url: '/notes/action/create',

    images: [
      {
        url: 'https://cdn-icons-png.flaticon.com/512/11021/11021969.png',
        width: 1200,
        height: 630,
        alt: 'Create note',
      },
    ],
  },
};

export default function CreateNote() {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>
        <NoteForm />
      </div>
    </main>
  );
}
