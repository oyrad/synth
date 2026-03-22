import { AudioContextProvider } from './audio-context-provider.tsx';
import type { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return <AudioContextProvider>{children}</AudioContextProvider>;
}
