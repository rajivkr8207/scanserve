import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ReduxProvider } from '@/providers/ReduxProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { ReactQueryProvider } from '@/providers/ReactQueryProvider';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'ScanServe - Premium QR Restaurant Ordering',
  description: 'A GOD-LEVEL modern SaaS QR restaurant ordering platform.',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-[var(--bg)] text-[var(--text-primary)] min-h-screen`}>
        <ReduxProvider>
          <ReactQueryProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
              {children}
              <Toaster position="top-right" richColors theme="system" closeButton />
            </ThemeProvider>
          </ReactQueryProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
