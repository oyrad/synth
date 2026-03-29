import { type CanvasHTMLAttributes, useEffect, useRef } from 'react';
import { useAudioCtx } from '../../hooks/use-audio-context.ts';
import { cn } from '../../utils/cn.ts';

export function WaveformVisualizer({
  className,
  ...rest
}: CanvasHTMLAttributes<HTMLCanvasElement>) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { getAnalyser } = useAudioCtx();

  useEffect(() => {
    const analyser = getAnalyser();
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx2d = canvas.getContext('2d');
    if (!ctx2d) {
      return;
    }

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const buffer = new Uint8Array(analyser.fftSize);
    let frameId: number;

    const draw = () => {
      frameId = requestAnimationFrame(draw);
      analyser.getByteTimeDomainData(buffer);

      const { width, height } = canvas;
      ctx2d.clearRect(0, 0, width, height);

      ctx2d.strokeStyle = getComputedStyle(canvas).color;

      let startIndex = 0;
      for (let i = 1; i < buffer.length - 1; i++) {
        if (buffer[i - 1] < 128 && buffer[i] >= 128) {
          startIndex = i;
          break;
        }
      }

      const drawLength = 512;
      const slice = buffer.slice(startIndex, startIndex + drawLength);

      ctx2d.beginPath();
      slice.forEach((sample, index) => {
        const x = (index / drawLength) * width;
        const y = (sample / 255) * height;

        if (index === 0) {
          ctx2d.moveTo(x, y);
        } else {
          const prevX = ((index - 1) / drawLength) * width;
          const prevY = (slice[index - 1] / 255) * height;
          const midX = (prevX + x) / 2;
          const midY = (prevY + y) / 2;
          ctx2d.quadraticCurveTo(prevX, prevY, midX, midY);
        }
      });
      ctx2d.stroke();
    };

    draw();

    return () => cancelAnimationFrame(frameId);
  }, [getAnalyser]);

  return (
    <div className={cn('relative min-h-28', className)}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full border border-gray-200 dark:border-gray-600 rounded-lg"
        {...rest}
      />
    </div>
  );
}
