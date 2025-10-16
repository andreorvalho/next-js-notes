import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import '@/styles/globals.css';
import { ThemeProvider } from '@/providers/ThemeProvider';
import ThemeToggle from '@/components/ThemeToggle';

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider>
        <ThemeToggle />
        <Component {...pageProps} />
      </ThemeProvider>
    </SessionProvider>
  );
}

export default MyApp;
