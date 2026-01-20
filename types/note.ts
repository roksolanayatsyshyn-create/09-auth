export type Tag =
  | 'Todo'
  | 'Work'
  | 'Personal'
  | 'Meeting'
  | 'Shopping'
  | 'Ideas'
  | 'Travel'
  | 'Finance'
  | 'Health'
  | 'Important';

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tag: Tag;
}

export interface NoteData {
  title: string;
  content: string;
  tag: Tag;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}
