import { useState } from 'react';
import { useSynth } from './hooks/use-synth.ts';
import { useMidi } from './hooks/use-midi.ts';
import { isOscillatorType } from './utils/midi.ts';

export default function App() {
  const [lastNote, setLastNote] = useState<number | null>(null);
  const [lastVelocity, setLastVelocity] = useState<number | null>(null);
  const [audioReady, setAudioReady] = useState(false);
  const [waveForm, setWaveForm] = useState<OscillatorType>('sine');

  const { resume, noteOn, noteOff } = useSynth({ waveForm });

  const startAudio = () => {
    resume().then(() => setAudioReady(true));
  };

  const { midiInput } = useMidi({
    onNoteOn: (note: number, velocity: number) => {
      setLastNote(note);
      setLastVelocity(velocity);
      noteOn(note, velocity);
    },
    onNoteOff: noteOff
  });

  return (
    <div style={{
      fontSize: '4rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      gap: '1rem'
    }}>
      <p className="text-red-500 font-bold">{midiInput ? midiInput?.name : 'No MIDI input found'}</p>
      <select
        value={waveForm}
        onChange={(e) => {
          if (isOscillatorType(e.target.value)) {
            setWaveForm(e.target.value);
          }
        }}
      >
        <option value="sine">sine</option>
        <option value="square">square</option>
        <option value="triangle">triangle</option>
        <option value="sawtooth">sawtooth</option>
      </select>

      {!audioReady && (
        <button onClick={startAudio} style={{ fontSize: '1rem', padding: '1rem' }}>
          Start Audio
        </button>
      )}

      <p>{audioReady && <>{lastNote} / {lastVelocity}</>}</p>
    </div>
  );
}