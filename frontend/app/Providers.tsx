'use client';

import { useRef } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/lib/store';
import { ThemeProvider } from 'next-themes';

export default function Providers({ children }: { children: React.ReactNode }) {
  const storeRef = useRef(store);

  return (
    <Provider store={storeRef.current}>
      <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light">
        {children}
      </ThemeProvider>
    </Provider>
  );
}