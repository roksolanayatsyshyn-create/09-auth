'use client';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { fetchNoteById } from '@/lib/api/clientApi';
import { Modal } from '@/components/Modal/Modal';
import css from './NotePreview.module.css';

interface NotePreviewProps {
  id: string;
}

export default function NotePreview({ id }: NotePreviewProps) {
  const router = useRouter();

  const {
    data: note,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  const closeModal = () => {
    router.back();
  };
  if (isLoading) {
    return (
      <Modal onClose={closeModal}>
        <p>Loading...</p>
      </Modal>
    );
  }
  if (isError || !note) {
    return (
      <Modal onClose={closeModal}>
        <p>Failed to load note</p>
      </Modal>
    );
  }
  return (
    <Modal onClose={closeModal}>
      <div className={css.container}>
        <div className={css.item}>
          <button onClick={closeModal} className={css.backBtn}>
            Close
          </button>
          <div className={css.header}>
            <h2>{note.title}</h2>
          </div>
          <p className={css.content}>{note.content}</p>
          <p className={css.date}>{note.createdAt}</p>
        </div>
      </div>
    </Modal>
  );
}
