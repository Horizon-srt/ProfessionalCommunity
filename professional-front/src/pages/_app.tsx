import React from 'react';
import type { AppProps } from 'next/app';
import { ThemeProvider } from '@/components/ThemeProvider/themeProvider';
import '@/styles/global.css';

const App = ({ Component, pageProps }: AppProps) => (
  <ThemeProvider>
    <Component {...pageProps} />
  </ThemeProvider>
);

export default App;
