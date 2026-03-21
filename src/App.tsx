import { useState } from 'react';
import { useSynth } from './hooks/use-synth.ts';
import { useMidi } from './hooks/use-midi.ts';
import { Button } from './components/ui/button.tsx';
import { WaveformVisualizer } from './components/waveform-visualizer.tsx';
import { useAudioCtx } from './hooks/use-audio-context.ts';
import { ErrorMessages } from './components/error-messages.tsx';
import { Oscillators } from './components/oscillators.tsx';

export default function App() {
  const [waveform] = useState<OscillatorType>('sine');
  const [isVelocitySensitive] = useState(true);

  const { isAudioReady, getAudioContext } = useAudioCtx();

  const { noteOn, noteOff } = useSynth({ waveform, isVelocitySensitive });
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

      <Oscillators />

      <WaveformVisualizer />
    </main>
  );
}