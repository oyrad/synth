import { AudioContextProvider } from './audio-context-provider.tsx';
import type { ReactNode } from 'react';
import { Toaster } from './ui/sonner.tsx';
import { ThemeProvider } from 'next-themes';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class">
      <AudioContextProvider>
        {children}
        <Toaster />
      </AudioContextProvider>
    </ThemeProvider>
  );
}
