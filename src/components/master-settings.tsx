import { useSettingsStore } from '../stores/use-settings-store.ts';
import type { HTMLAttributes } from 'react';
import { cn } from '../utils/cn.ts';
import { Card } from './atoms/card.tsx';
import { SliderParam } from './atoms/slider-param.tsx';

export function MasterSettings({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  const masterVolume = useSettingsStore((s) => s.masterVolume);
  const setMasterVolume = useSettingsStore((s) => s.setMasterVolume);

  const masterTune = useSettingsStore((s) => s.masterTune);
  const setMasterTune = useSettingsStore((s) => s.setMasterTune);

  return (
    <Card className={cn('', className)} {...rest}>
      <SliderParam
        labelLeft="Volume"
        labelRight={`${masterVolume}%`}
        value={masterVolume}
        min={0}
        max={100}
        step={1}
        onChange={(value) => setMasterVolume(value[0])}
      />

      <SliderParam
        labelLeft="Tune"
        labelRight={`${masterTune} cents`}
        value={masterTune}
        min={-64}
        max={64}
        step={1}
        onChange={(value) => setMasterTune(value[0])}
      />
    </Card>
  );
}
