import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog.tsx';
import { WaveformVisualizer } from './waveform-visualizer.tsx';
import type { ReactNode } from 'react';

interface WaveformVisualizerDialogProps {
  trigger: ReactNode;
}

export function WaveformVisualizerDialog({ trigger }: WaveformVisualizerDialogProps) {
  return (
    <Dialog>
      <DialogTrigger className="lg:flex-1 cursor-pointer hover:opacity-85" tabIndex={-1}>
        {trigger}
      </DialogTrigger>

      <DialogContent showCloseButton={false} className="sm:max-w-[90%] p-0 h-[90%] w-[90%]">
        <WaveformVisualizer className="w-full" />
      </DialogContent>
    </Dialog>
  );
}
