import { AdsrVisualizer } from '../adsr-visualizer.tsx';
import { useSynthStore } from '../../../stores/use-synth-store.ts';

export function AmplitudeAdsrVisualizer() {
  const amplitude = useSynthStore((s) => s.parameters.amplitude);

  return <AdsrVisualizer {...amplitude} />;
}
