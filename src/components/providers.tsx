import { AudioContextProvider } from './audio-context-provider.tsx';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AudioContextProvider>
      {children}
    </AudioContextProvider>
  );
}