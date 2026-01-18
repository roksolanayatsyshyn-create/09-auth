import type { Metadata } from 'next';

import css from './Home.module.css';

export const metadata: Metadata = {
  title: '404 — Page Not Found | NoteHub',
  description:
    'The page you are looking for does not exist. It may have been removed or the URL is incorrect.',

  openGraph: {
    title: '404 — Page Not Found | NoteHub',
    description:
      'Sorry, the page you are looking for does not exist. Please check the URL or return to the main page.',
    url: '/not-found',

    images: [
      {
        url: 'https://hostiq.ua/wiki/wp-content/uploads/2021/05/08-error-404-not-found-1-2048x1040.png',
        width: 1200,
        height: 630,
        alt: '404 — Page Not Found',
      },
    ],
  },
};

const NotFound = () => {
  return (
    <>
      <h1 className={css.title}>404 - Page not found</h1>
      <p className={css.description}>
        Sorry, the page you are looking for does not exist.
      </p>
    </>
  );
};

export default NotFound;
