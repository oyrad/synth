import { useContext } from 'react';
import { AudioCtx } from '../audio-context.tsx';

export function useAudioCtx() {
  const ctx = useContext(AudioCtx);

  if (!ctx) {
    throw new Error('useAudioCtx must be used inside AudioContextProvider');
  }

  return ctx;
}
