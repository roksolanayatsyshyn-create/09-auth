'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import { NoteList } from '@/components/NoteList/NoteList';
import { SearchBox } from '@/components/SearchBox/SearchBox';
import { Pagination } from '@/components/Pagination/Pagination';
import { useRouter } from 'next/navigation';
import { fetchNotes } from '@/lib/api/clientApi';
import css from './NotesPage.module.css';

const PER_PAGE = 12;

interface NotesClientProps {
  tag: string;
  page: number;
  search: string;
}

export default function NotesClient({ tag, page, search }: NotesClientProps) {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState(search);
  const [currentPage, setCurrentPage] = useState(page);
  const [debouncedSearch] = useDebounce(searchValue, 500);

  const { data } = useQuery({
    queryKey: ['notes', { tag, search: debouncedSearch, page: currentPage }],
    queryFn: () => fetchNotes(debouncedSearch, currentPage, PER_PAGE, tag),
    staleTime: 1000 * 60,
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    setCurrentPage(1);
    router.push(`/notes/filter/${tag}?search=${value}&page=1`);
  };

  const handlePageChange = (p: number) => {
    setCurrentPage(p);
    router.push(`/notes/filter/${tag}?search=${debouncedSearch}&page=${p}`);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={searchValue} onChange={handleSearchChange} />

        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        )}

        <Link href="/notes/action/create" className={css.button}>
          Create note +
        </Link>
      </header>

      {notes.length > 0 && <NoteList notes={notes} />}
    </div>
  );
}
