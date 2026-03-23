import { cn } from '../utils/cn.ts';
import { useAudioCtx } from '../hooks/use-audio-context.ts';
import { memo } from 'react';
import { SettingsDialog } from './settings-dialog.tsx';
import { PresetsDialog } from './presets-dialog.tsx';

function StatusBarIndicator({ text, isActive }: { text: string; isActive: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(`rounded-full bg-red-500 w-3 h-3 ${isActive && 'bg-emerald-500'}`)}
      />
      <p className="text-sm">{text}</p>
    </div>
  );
}

interface StatusBarProps {
  isGranted: boolean;
  midiInput: MIDIInput | null | undefined;
}

export function StatusBarComponent({ isGranted, midiInput }: StatusBarProps) {
  const { isAudioReady } = useAudioCtx();

  return (
    <div className="fixed bottom-0 left-0 w-full bg-black text-white py-3 px-6 flex gap-6">
      <StatusBarIndicator text="Audio ready" isActive={isAudioReady} />
      <StatusBarIndicator text="MIDI Access granted" isActive={isGranted} />
      <StatusBarIndicator
        text={midiInput ? `Connected device: ${midiInput?.name}` : 'No MIDI input'}
        isActive={!!midiInput}
      />

      <div className="ml-auto flex items-center gap-6">
        <PresetsDialog />
        <SettingsDialog />
      </div>
    </div>
  );
}

export const StatusBar = memo(StatusBarComponent);
