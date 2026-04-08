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
import { useAssignKnobStore } from '../../stores/use-assign-knob-store.tsx';
import { AudioWaveform } from 'lucide-react';

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
  const setIsAssignKnobModeActive = useAssignKnobStore((s) => s.setIsModeActive);
  const setActiveParameterId = useAssignKnobStore((s) => s.setActiveParameterId);
  const assignedKnobs = useAssignKnobStore((s) => s.assignedKnobs);
  const unassignKnob = useAssignKnobStore((s) => s.unassignKnob);

  const isKnobAssigned = Boolean(assignedKnobs[id]);

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
      <ContextMenuContent>
        <ContextMenuItem
          onSelect={() => {
            setIsAssignKnobModeActive(true);
            setActiveParameterId(id);
          }}
        >
          Assign to knob
        </ContextMenuItem>
        {isKnobAssigned && (
          <ContextMenuItem
            onSelect={() => {
              unassignKnob(id);
            }}
          >
            Unassign knob
          </ContextMenuItem>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
}
