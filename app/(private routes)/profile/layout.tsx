import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profile Page | NoteHub',
  description: 'View and manage your NoteHub profile information.',
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
