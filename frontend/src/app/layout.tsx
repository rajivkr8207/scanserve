import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';

import { ReduxProvider } from '@/providers/ReduxProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ScanServe | Smart QR Menu for Restaurants',
  description: 'Professional SaaS solution for restaurant QR menus and order management.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={cn(
          inter.className,
          'min-h-screen bg-slate-50 text-slate-900 antialiased'
        )}
        cz-shortcut-listen="true"
      >
        <ReduxProvider>
          <main className="relative flex min-h-screen flex-col">
            {children}
          </main>
        </ReduxProvider>
      </body>
    </html>
  );
}
