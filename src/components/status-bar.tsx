import { cn } from '../utils/cn.ts';
import { useAudioCtx } from '../hooks/use-audio-context.ts';
import { type HTMLProps, memo } from 'react';
import { SettingsDialog } from './settings-dialog.tsx';
import { PresetsDialog } from './presets-dialog.tsx';
import { ThemeToggle } from './theme-toggle.tsx';
import { useMidiStore } from '../stores/use-midi-store.tsx';

interface StatusBarIndicatorProps extends HTMLProps<HTMLDivElement> {
  text: string;
  isActive: boolean;
}

function StatusBarIndicator({ text, isActive, className, ...rest }: StatusBarIndicatorProps) {
  return (
    <div className={cn('flex items-center gap-2', className)} {...rest}>
      <div className={cn('rounded-full bg-red-500 w-3 h-3', isActive && 'bg-emerald-500')} />
      <p className="text-sm">{text}</p>
    </div>
  );
}

interface StatusBarProps {
  isMidiAccessGranted: boolean;
}

export function StatusBarComponent({ isMidiAccessGranted }: StatusBarProps) {
  const { isAudioReady } = useAudioCtx();
  const { selectedInput: midiInput } = useMidiStore();

  return (
    <div className="fixed bottom-0 left-0 w-full bg-neutral-200 dark:bg-neutral-900 py-3 px-6 flex gap-6">
      <StatusBarIndicator text="Audio ready" isActive={isAudioReady} className="hidden sm:flex" />
      <StatusBarIndicator
        text="MIDI Access granted"
        isActive={isMidiAccessGranted}
        className="hidden sm:flex"
      />
      <StatusBarIndicator
        text={midiInput ? (midiInput?.name ?? '') : 'No MIDI input'}
        isActive={!!midiInput}
      />

      <div className="ml-auto flex items-center gap-6">
        <ThemeToggle />
        <PresetsDialog />
        <SettingsDialog />
      </div>
    </div>
  );
}

export const StatusBar = memo(StatusBarComponent);
