import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import '@/styles/globals.css';
// Import CSS files that react-quill-ver2 tries to import internally
import 'highlight.js/styles/github.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
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
