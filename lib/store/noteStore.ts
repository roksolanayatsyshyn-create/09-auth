import type { Tag } from '@/types/note';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const initialDraft = {
  title: '',
  content: '',
  tag: 'Todo' as Tag,
};
type Draft = typeof initialDraft;

type NoteStore = {
  draft: Draft;
  setDraft: (note: Partial<Draft>) => void;
  clearDraft: () => void;
};

export const useNoteStore = create<NoteStore>()(
  persist(
    (set) => ({
      draft: initialDraft,
      setDraft: (note) =>
        set((state) => ({
          draft: {
            ...state.draft,
            ...note,
          },
        })),
      clearDraft: () => set({ draft: initialDraft }),
    }),
    {
      name: 'note-draft',

      partialize: (state) => ({
        draft: state.draft,
      }),
    }
  )
);
