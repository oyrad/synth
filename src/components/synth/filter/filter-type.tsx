import { Tabs, TabsList, TabsTrigger } from '../../ui/tabs.tsx';
import { useSynthStore } from '../../../stores/use-synth-store.ts';

interface FilterTypeProps {
  onChange: (value: string) => void;
}

export function FilterType({ onChange }: FilterTypeProps) {
  const type = useSynthStore((s) => s.parameters.filter.type);

  return (
    <Tabs value={type} onValueChange={onChange}>
      <TabsList className="grid w-full grid-cols-3 border border-black/20 dark:border-white/20 bg-transparent">
        <TabsTrigger value="lowpass" title="Lowpass">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2 8h10c4 0 8 2 10 12" />
          </svg>
        </TabsTrigger>
        <TabsTrigger value="highpass" title="Highpass">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2 20c2-10 6-12 10-12h10" />
          </svg>
        </TabsTrigger>
        <TabsTrigger value="bandpass" title="Bandpass">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2 20c4 0 7-16 10-16s6 16 10 16" />
          </svg>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
