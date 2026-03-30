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
    if (!canvas) return;

    const ctx2d = canvas.getContext('2d');
    if (!ctx2d) return;

    // 1. Change to Float32Array
    const buffer = new Float32Array(analyser.fftSize);
    let frameId: number;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      // Set the internal drawing resolution
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      // Scale the context so your drawing units match CSS pixels
      ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    const draw = () => {
      frameId = requestAnimationFrame(draw);

      // 2. Use the Float version of the data
      analyser.getFloatTimeDomainData(buffer);

      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;

      ctx2d.clearRect(0, 0, width, height);
      ctx2d.strokeStyle = getComputedStyle(canvas).color || '#000';
      ctx2d.lineWidth = 1;
      ctx2d.lineJoin = 'round';

      // 3. Simple Trigger (Finds where the wave crosses 0 going up)
      let startIndex = 0;
      for (let i = 1; i < buffer.length / 2; i++) {
        if (buffer[i - 1] <= 0 && buffer[i] > 0) {
          startIndex = i;
          break;
        }
      }

      const drawLength = 512;
      ctx2d.beginPath();

      for (let i = 0; i < drawLength; i++) {
        const sample = buffer[startIndex + i] || 0;

        const x = (i / (drawLength - 1)) * width;
        const y = (0.5 - sample * 2) * height;

        if (i === 0) {
          ctx2d.moveTo(x, y);
        } else {
          ctx2d.lineTo(x, y);
        }
      }
      ctx2d.stroke();
    };

    draw();

    return () => {
      cancelAnimationFrame(frameId);
      observer.disconnect();
    };
  }, [getAnalyser]);

  return (
    <div className={cn('relative min-h-28', className)}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full border border-gray-200 dark:border-neutral-800 rounded-lg"
        {...rest}
      />
    </div>
  );
}
