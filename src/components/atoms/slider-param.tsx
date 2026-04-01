import { Label } from '../ui/label.tsx';
import { Slider } from '../ui/slider.tsx';
import type { HTMLProps } from 'react';
import { cn } from '../../utils/cn.ts';

interface SliderParamProps extends Omit<HTMLProps<HTMLDivElement>, 'onChange'> {
  labelLeft: string;
  labelRight?: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: Array<number>) => void;
}

export function SliderParam({
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
  return (
    <div className={cn('flex flex-col gap-3.5', className)} {...rest}>
      <div className="flex justify-between items-center">
        <Label>{labelLeft}</Label>
        <Label>{labelRight}</Label>
      </div>
      <Slider value={[value]} min={min} max={max} step={step} onValueChange={onChange} />
    </div>
  );
}
