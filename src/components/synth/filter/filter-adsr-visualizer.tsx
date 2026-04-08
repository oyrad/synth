import { useSynthStore } from '../../../stores/use-synth-store.ts';
import { cn } from '../../../utils/cn.ts';
import { AdsrVisualizer } from '../adsr-visualizer.tsx';

export function FilterAdsrVisualizer() {
  const isActive = useSynthStore((s) => s.parameters.filter.isActive);
  const attack = useSynthStore((s) => s.parameters.filter.attack);
  const decay = useSynthStore((s) => s.parameters.filter.decay);
  const sustain = useSynthStore((s) => s.parameters.filter.sustain);
  const release = useSynthStore((s) => s.parameters.filter.release);

  return (
    <AdsrVisualizer
      className={cn(
        'bg-white/60  dark:bg-black/60 border border-violet-500/20',
        !isActive && 'bg-transparent',
      )}
      attack={attack}
      decay={decay}
      sustain={sustain}
      release={release}
    />
  );
}
