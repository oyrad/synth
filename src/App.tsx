import { useSynth } from './hooks/use-synth.ts';
import { useMidi } from './hooks/use-midi.ts';
import { WaveformVisualizer } from './components/waveform-visualizer.tsx';
import { Oscillators } from './components/oscillators.tsx';
import { useEffect, useState } from 'react';
import {
  DEFAULT_OSCILLATOR_DATA,
  type OscillatorData,
} from './utils/default-oscillator-data.ts';
import { StatusBar } from './components/status-bar.tsx';
import { StartAudioDialog } from './components/start-audio-dialog.tsx';

export default function App() {
  const [oscillators, setOscillators] = useState<Array<OscillatorData>>([
    {
      ...DEFAULT_OSCILLATOR_DATA,
      id: crypto.randomUUID(),
    },
  ]);

  const { noteOn, noteOff, updateVoices } = useSynth({ oscillators });
  const { midiInput, isGranted } = useMidi({
    onNoteOn: noteOn,
    onNoteOff: noteOff,
  });

  useEffect(() => {
    updateVoices(oscillators);
  }, [oscillators, updateVoices]);

  return (
    <main className="flex flex-col items-center gap-4 pt-8 pb-16">
      <WaveformVisualizer />

      <Oscillators oscillators={oscillators} setOscillators={setOscillators} />

      <StatusBar midiInput={midiInput} isGranted={isGranted} />

      <StartAudioDialog />
    </main>
  );
}
