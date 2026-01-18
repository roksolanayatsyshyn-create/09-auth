import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import Providers from '@/components/TanStackProvider/TanStackProviders';
import AuthProvider from '@/components/AuthProvider/AuthProvider';

import './globals.css';

const roboto = Roboto({
  weight: ['400', '500', '700'],
  variable: '--font-roboto-sans',
  display: 'swap',
  subsets: ['latin'],
});
export const metadataBase = new URL('http://localhost:3000');
export const metadata: Metadata = {
  title: {
    default: 'NoteHub App',
    template: ' NoteHub',
  },
  description: 'Create, organize and filter your notes easily with NoteHub.',
  openGraph: {
    title: 'NoteHub App',
    description: 'Create, organize and filter your notes easily with NoteHub.',
    url: '/',
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        width: 1200,
        height: 630,
        alt: 'NoteHub  App',
      },
    ],
  },
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} `}>
        <Providers>
          <AuthProvider>
            <Header />

            {children}
            {modal}
            <Footer />
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
