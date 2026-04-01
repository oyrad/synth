import type { HTMLAttributes } from 'react';
import { cn } from '../../utils/cn.ts';

interface AdsrVisualizerProps extends HTMLAttributes<HTMLDivElement> {
  attack: number;
  decay: number;
  sustain: number;
  release: number;
}

export function AdsrVisualizer({
  attack,
  decay,
  sustain,
  release,
  className,
  ...rest
}: AdsrVisualizerProps) {
  const width = 300;
  const height = 100;
  const sustainWidth = 80;
  const totalTime = 4;

  const timeScale = (width - sustainWidth) / totalTime;

  const attackX = attack * timeScale;
  const decayX = attackX + decay * timeScale;
  const sustainX = decayX + sustainWidth;
  const releaseX = sustainX + release * timeScale;
  const sustainY = height - sustain * height;

  return (
    <div
      className={cn(
        'relative w-full min-h-48 h-auto border border-gray-200 dark:border-neutral-800 rounded-lg',
        className,
      )}
      {...rest}
    >
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
