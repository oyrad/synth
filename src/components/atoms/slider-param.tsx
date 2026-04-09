import { Label } from '../ui/label.tsx';
import { Slider } from '../ui/slider.tsx';
import type { HTMLProps } from 'react';
import { cn } from '../../utils/cn.ts';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '../ui/context-menu.tsx';
import { useMidiCCStore } from '../../stores/use-midi-cc-store.tsx';
import { AudioWaveform } from 'lucide-react';
import { toast } from 'sonner';

interface SliderParamProps extends Omit<HTMLProps<HTMLDivElement>, 'onChange'> {
  id: string;
  labelLeft: string;
  labelRight?: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: Array<number>) => void;
}

export function SliderParam({
  id,
  labelLeft,
  labelRight = '',
  value,
  min,
  max,
  step,
  onChange,
  className,
  ...rest
}: SliderParamProps) {
  const setIsAssignKnobModeActive = useMidiCCStore((s) => s.setIsAssignModeActive);
  const setActiveParameterId = useMidiCCStore((s) => s.setActiveParameterId);
  const assignedKnobs = useMidiCCStore((s) => s.assignedKnobs);
  const unassignKnob = useMidiCCStore((s) => s.unassignByParameterId);

  const isKnobAssigned = Object.values(assignedKnobs).includes(id);

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div className={cn('flex flex-col gap-3.5', className)} {...rest}>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1">
              {isKnobAssigned && <AudioWaveform className="size-3.5" />}
              <Label>{labelLeft}</Label>
            </div>
            <p className="text-xs">{labelRight}</p>
          </div>
          <Slider value={[value]} min={min} max={max} step={step} onValueChange={onChange} />
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="min-w-fit flex flex-col gap-1 p-1">
        <ContextMenuItem
          className="px-2"
          onSelect={() => {
            setIsAssignKnobModeActive(true);
            setActiveParameterId(id);
          }}
        >
          Assign to knob
        </ContextMenuItem>
        {isKnobAssigned && (
          <ContextMenuItem
            className="px-2"
            onSelect={() => {
              unassignKnob(id);
              toast('Unassigned knob.');
            }}
          >
            Unassign knob
          </ContextMenuItem>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
}
