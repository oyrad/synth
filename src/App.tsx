import { useSynth } from './hooks/use-synth.ts';
import { useMidi } from './hooks/use-midi.ts';
import { Button } from './components/ui/button.tsx';
import { WaveformVisualizer } from './components/waveform-visualizer.tsx';
import { useAudioCtx } from './hooks/use-audio-context.ts';
import { ErrorMessages } from './components/error-messages.tsx';
import { Oscillators } from './components/oscillators.tsx';
import { useState } from 'react';
import { DEFAULT_OSCILLATOR_DATA, type OscillatorData } from './utils/default-oscillator-data.ts';

export default function App() {
  const [oscillators, setOscillators] = useState<Array<OscillatorData>>([{
    ...DEFAULT_OSCILLATOR_DATA,
    id: crypto.randomUUID()
  }]);

  const { isAudioReady, getAudioContext } = useAudioCtx();

  const { noteOn, noteOff } = useSynth({ oscillators });
  const { midiInput, isGranted } = useMidi({ onNoteOn: noteOn, onNoteOff: noteOff });

  return (
    <main className="flex flex-col items-center gap-4 py-8">
      <ErrorMessages isAudioReady={isAudioReady} midiInput={midiInput} isGranted={isGranted} />

      {!isAudioReady && (
        <Button
          onClick={() => {
            void getAudioContext().resume();
          }}
        >
          Start Audio
        </Button>
      )}

      <Oscillators oscillators={oscillators} setOscillators={setOscillators} />

      <WaveformVisualizer />
    </main>
  );
}