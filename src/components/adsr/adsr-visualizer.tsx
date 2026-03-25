import type { AdsrEnvelope } from './adsr.tsx';

interface AdsrVisualizerProps {
  adsr: AdsrEnvelope;
}

export function AdsrVisualizer({ adsr }: AdsrVisualizerProps) {
  const width = 300;
  const height = 100;
  const sustainWidth = 80;
  const totalTime = 4;

  const timeScale = (width - sustainWidth) / totalTime;

  const attackX = adsr.attack * timeScale;
  const decayX = attackX + adsr.decay * timeScale;
  const sustainX = decayX + sustainWidth;
  const releaseX = sustainX + adsr.release * timeScale;
  const sustainY = height - adsr.sustain * height;

  return (
    <div className="relative w-full h-auto border border-gray-200 dark:border-gray-600 rounded-lg">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 300 100"
        preserveAspectRatio="none"
        className="absolute inset-0"
      >
        <line
          x1={attackX}
          y1={0}
          x2={attackX}
          y2={height}
          stroke="currentColor"
          strokeWidth="0.5"
          strokeDasharray="3 3"
          opacity={0.4}
        />
        <line
          x1={decayX}
          y1={0}
          x2={decayX}
          y2={height}
          stroke="currentColor"
          strokeWidth="0.5"
          strokeDasharray="3 3"
          opacity={0.4}
        />
        <line
          x1={sustainX}
          y1={0}
          x2={sustainX}
          y2={height}
          stroke="currentColor"
          strokeWidth="0.5"
          strokeDasharray="3 3"
          opacity={0.4}
        />
        <polyline
          points={`0,${height} ${attackX},0 ${decayX},${sustainY} ${sustainX},${sustainY} ${releaseX},${height}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="0.75"
        />
      </svg>
    </div>
  );
}
