import { redirect } from 'next/navigation';

export default function FilterIndexPage() {
  redirect('/notes/filter/all');
}
