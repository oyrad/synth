import { SliderParam } from '../../atoms/slider-param.tsx';
import { useSynthStore } from '../../../stores/use-synth-store.ts';
import {
  DELAY_FEEDBACK_MAX,
  DELAY_FEEDBACK_MIN,
  DELAY_FEEDBACK_STEP,
} from '../../../consts/parameter-values.ts';

interface DelayFeedbackProps {
  onChange: (value: number) => void;
}

export function DelayFeedback({ onChange }: DelayFeedbackProps) {
  const feedback = useSynthStore((s) => s.parameters.delay.feedback);

  return (
    <SliderParam
      id="delay-feedback"
      labelLeft="Feedback"
      labelRight={`${feedback * 100}%`}
      value={feedback}
      min={DELAY_FEEDBACK_MIN}
      max={DELAY_FEEDBACK_MAX}
      step={DELAY_FEEDBACK_STEP}
      onChange={(value) => onChange(value[0])}
    />
  );
}
