import { StatusBar } from './components/status-bar.tsx';
import { StartAudioDialog } from './components/start-audio-dialog.tsx';
import { LoadPresetOnInit } from './components/load-preset-on-init.tsx';
import { useRequestMidiAccess } from './hooks/use-request-midi-access.ts';
import { Synth } from './components/synth/synth.tsx';

export default function App() {
  const { isGranted } = useRequestMidiAccess();

  return (
    <main className="flex flex-col gap-4 pt-8 pb-16">
      <Synth />

      <StatusBar isMidiAccessGranted={isGranted} />

      <StartAudioDialog />
      <LoadPresetOnInit />
    </main>
  );
}
