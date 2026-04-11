import { useSynthStore } from '../../../stores/use-synth-store.ts';
import { Switch } from '../../ui/switch.tsx';
import { cn } from '../../../utils/cn.ts';
import { Title } from '../../atoms/title.tsx';
import { Card } from '../../atoms/card.tsx';
import { OscillatorWaveform } from './oscillator-waveform.tsx';
import { OscillatorVolume } from './oscillator-volume.tsx';
import { OscillatorDetune } from './oscillator-detune.tsx';
import { OscillatorTranspose } from './oscillator-transpose.tsx';

export interface OscillatorParameters {
  id: string;
  isActive: boolean;
  waveform: OscillatorType;
  volume: number;
  detune: number;
  transpose: number;
}

function Oscillator({ index }: { index: number }) {
  const id = useSynthStore((s) => s.parameters.oscillators[index].id);
  const isActive = useSynthStore((s) => s.parameters.oscillators[index].isActive);
  const updateOscillator = useSynthStore((s) => s.updateOscillator);

  return (
    <Card
      key={id}
      isActive={isActive}
      className={cn(
        index === 0 &&
          'bg-blue-600/20 border-blue-600/80 dark:bg-blue-600/30 dark:border-blue-600/60',
        index === 1 &&
          'bg-green-600/20 border-green-600/80 dark:bg-green-600/30 dark:border-green-600/60',
        index === 2 &&
          'bg-rose-600/20 border-rose-600/80 dark:bg-rose-600/30 dark:border-rose-600/60',
        index === 3 &&
          'bg-yellow-600/20 border-yellow-600/80 dark:bg-yellow-600/30 dark:border-yellow-600/60',
      )}
    >
      <div className="flex justify-between items-center">
        <Title>oscillator {index + 1}</Title>
        <Switch
          className="pointer-events-auto"
          checked={isActive}
          onCheckedChange={(checked) => updateOscillator(id, { isActive: checked })}
        />
      </div>

      <OscillatorWaveform
        oscIndex={index}
        onChange={(value) => updateOscillator(id, { waveform: value })}
      />

      <OscillatorVolume
        oscIndex={index}
        onChange={(value) => updateOscillator(id, { volume: value })}
      />

      <OscillatorDetune
        oscIndex={index}
        onChange={(value) => updateOscillator(id, { detune: value })}
      />

      <OscillatorTranspose
        oscIndex={index}
        onChange={(value) => updateOscillator(id, { transpose: value })}
      />
    </Card>
  );
}

export function Oscillators() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-4">
      {[0, 1, 2, 3].map((index) => (
        <Oscillator key={index} index={index} />
      ))}
    </div>
  );
}
