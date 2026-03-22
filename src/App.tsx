import { useSynth } from './hooks/use-synth.ts';
import { useMidi } from './hooks/use-midi.ts';
import {
  type OscillatorData,
  Oscillators,
} from './components/oscillators/oscillators.tsx';
import { useEffect, useState } from 'react';
import { StatusBar } from './components/status-bar.tsx';
import { StartAudioDialog } from './components/start-audio-dialog.tsx';
import { DEFAULT_OSCILLATOR } from './consts/default-oscillator.ts';
import { Adsr, type AdsrEnvelope } from './components/adsr/adsr.tsx';
import { DEFAULT_ADSR } from './consts/default-adsr.ts';
import { WaveformVisualizer } from './components/waveform-visualizer.tsx';
import { LoadPresetDialog } from './components/load-preset-dialog.tsx';
import { SavePresetDialog } from './components/save-preset-dialog.tsx';
import { useSettingsStore } from './hooks/use-settings-store.ts';

export default function App() {
  const [oscillators, setOscillators] = useState<Array<OscillatorData>>([
    {
      ...DEFAULT_OSCILLATOR,
      id: crypto.randomUUID(),
    },
  ]);
  const [adsr, setAdsr] = useState<AdsrEnvelope>(DEFAULT_ADSR);

  const { noteOn, noteOff, updateVoices } = useSynth({ adsr, oscillators });

  const { midiInput, isGranted } = useMidi({
    onNoteOn: noteOn,
    onNoteOff: noteOff,
  });

  const showVisualizer = useSettingsStore((s) => s.showVisualizer);

  useEffect(() => {
    updateVoices(oscillators);
  }, [oscillators, updateVoices]);

  return (
    <main className="flex flex-col items-center gap-4 pt-8 pb-16">
      {showVisualizer && <WaveformVisualizer />}

      <div className="px-8 md:px-44 xl:px-96 w-full flex flex-col gap-8">
        <div className="flex gap-1">
          <LoadPresetDialog
            onLoad={(preset) => {
              setOscillators(preset.data.oscillators);
              setAdsr(preset.data.adsr);
            }}
          />
          <SavePresetDialog data={{ oscillators, adsr }} />
        </div>

        <Oscillators oscillators={oscillators} setOscillators={setOscillators} />
        <Adsr adsr={adsr} setAdsr={setAdsr} />
      </div>

      <StatusBar midiInput={midiInput} isGranted={isGranted} />

      <StartAudioDialog />
    </main>
  );
}
