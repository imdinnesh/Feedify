import { Inter } from 'next/font/google';
import './globals.css';
import AuthProvider from '../context/AuthProvider';
import QueryProviders from '@/context/QueryProvider';
import { Toaster } from '@/components/ui/toaster';
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Feedify Feedback',
  description: 'Real feedback from real people.',
};


export default async function RootLayout({ children }) {
  return (
    <html lang="en" >
      <QueryProviders>
        <AuthProvider>
          <body className={inter.className}>
            {children}
            <Analytics/>
            <Toaster />
          </body>
        </AuthProvider>
      </QueryProviders>
    </html>
  );
}