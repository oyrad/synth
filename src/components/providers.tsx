import { AudioContextProvider } from './audio-context-provider.tsx';
import type { ReactNode } from 'react';
import { Toaster } from './ui/sonner.tsx';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AudioContextProvider>
      {children}
      <Toaster />
    </AudioContextProvider>
  );
}
