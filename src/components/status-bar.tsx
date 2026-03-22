import { cn } from '../utils/cn.ts';
import { useAudioCtx } from '../hooks/use-audio-context.ts';
import { memo } from 'react';

interface StatusBarProps {
  isGranted: boolean;
  midiInput: MIDIInput | null | undefined;
}

export function StatusBarComponent({ isGranted, midiInput }: StatusBarProps) {
  const { isAudioReady } = useAudioCtx();

  return (
    <div className="fixed bottom-0 left-0 w-full bg-black text-white py-3 px-6 flex gap-6">
      <div className="flex items-center gap-2">
        <div
          className={cn(
            `rounded-full bg-red-500 w-3 h-3 ${isAudioReady && 'bg-emerald-500'}`,
          )}
        />
        <p className="text-sm">Audio started</p>
      </div>

      <div className="flex items-center gap-2">
        <div
          className={cn(
            `rounded-full bg-red-500 w-3 h-3 ${isGranted && 'bg-emerald-500'}`,
          )}
        />
        <p className="text-sm">MIDI Access granted</p>
      </div>

      <div className="flex items-center gap-2">
        <div
          className={cn(
            `rounded-full bg-red-500 w-3 h-3 ${!!midiInput && 'bg-emerald-500'}`,
          )}
        />
        <p className="text-sm">
          {midiInput ? `Connected device: ${midiInput?.name}` : 'No MIDI input'}
        </p>
      </div>
    </div>
  );
}

export const StatusBar = memo(StatusBarComponent);
