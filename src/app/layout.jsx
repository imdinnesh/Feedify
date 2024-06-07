import { Inter } from 'next/font/google';
import './globals.css';
import AuthProvider from '../context/AuthProvider';
import QueryProviders from '@/context/QueryProvider';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'True Feedback',
  description: 'Real feedback from real people.',
};


export default async function RootLayout({ children }) {
  return (
    <html lang="en" >
      <QueryProviders>
        <AuthProvider>
          <body className={inter.className}>
            {children}
            <Toaster />
          </body>
        </AuthProvider>
      </QueryProviders>
    </html>
  );
}