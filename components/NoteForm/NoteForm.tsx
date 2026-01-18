'use client';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createNote } from '@/lib/api/clientApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Tag } from '@/types/note';
import { useNoteStore } from '@/lib/store/noteStore';
import css from './NoteForm.module.css';

export function NoteForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const queryClient = useQueryClient();
  const { draft, setDraft, clearDraft } = useNoteStore();

  const mutation = useMutation({
    mutationFn: (newNote: { title: string; content: string; tag: Tag }) =>
      createNote(newNote),
    onSuccess: () => {
      clearDraft();
      queryClient.invalidateQueries({
        queryKey: ['notes'],
      });
      router.back();
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(() => {
      mutation.mutate(draft);
    });
  }

  function handleCancel() {
    router.back();
  }

  return (
    <form onSubmit={handleSubmit} className={css.form}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          name="title"
          className={css.input}
          value={draft.title}
          onChange={(event) => {
            setDraft({ title: event.target.value });
          }}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          className={css.textarea}
          value={draft.content}
          onChange={(event) => {
            setDraft({ content: event.target.value });
          }}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          value={draft.tag}
          onChange={(event) => {
            setDraft({ tag: event.target.value as Tag });
          }}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </div>

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={handleCancel}
        >
          Cancel
        </button>
        <button type="submit" className={css.submitButton} disabled={isPending}>
          Create note
        </button>
      </div>
    </form>
  );
}
