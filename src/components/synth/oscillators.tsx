import { isOscillatorType } from '../../utils/midi.ts';
import { useSynthStore } from '../../stores/use-synth-store.ts';
import { Switch } from '../ui/switch.tsx';
import { cn } from '../../utils/cn.ts';
import { SliderParam } from '../atoms/slider-param.tsx';
import { Title } from '../atoms/title.tsx';
import { Card } from '../atoms/card.tsx';
import { WaveformSelect } from './waveform-select.tsx';

export interface OscillatorParameters {
  id: string;
  isActive: boolean;
  waveform: OscillatorType;
  volume: number;
  detune: number;
  transpose: number;
}

export function Oscillators() {
  const oscillators = useSynthStore((s) => s.parameters.oscillators);
  const updateOscillator = useSynthStore((s) => s.updateOscillator);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-4">
      {oscillators.map(({ id, isActive, waveform, volume, detune, transpose }, index) => (
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

          <WaveformSelect
            value={waveform}
            onChange={(value) => {
              if (isOscillatorType(value)) {
                updateOscillator(id, { waveform: value });
              }
            }}
          />

          <SliderParam
            labelLeft="Volume"
            labelRight={`${volume}`}
            value={volume}
            min={0}
            max={100}
            step={1}
            onChange={(value) => updateOscillator(id, { volume: value[0] })}
          />

          <SliderParam
            labelLeft="Detune"
            labelRight={`${detune} cents`}
            value={detune}
            min={-64}
            max={64}
            step={1}
            onChange={(value) => updateOscillator(id, { detune: value[0] })}
          />

          <SliderParam
            labelLeft="Transpose"
            labelRight={`${transpose} st`}
            value={transpose}
            min={-24}
            max={24}
            step={1}
            onChange={(value) => updateOscillator(id, { transpose: value[0] })}
          />
        </Card>
      ))}
    </div>
  );
}
