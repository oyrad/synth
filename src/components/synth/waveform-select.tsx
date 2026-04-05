import { Tabs, TabsList, TabsTrigger } from '../ui/tabs.tsx';

interface WaveformSelectProps {
  value: OscillatorType;
  onChange: (value: string) => void;
}

export function WaveformSelect({ value, onChange }: WaveformSelectProps) {
  return (
    <Tabs value={value} onValueChange={onChange} className="w-full">
      <TabsList className="grid w-full grid-cols-4 border border-black/20 dark:border-white/20 bg-transparent">
        <TabsTrigger value="sine" title="Sine">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2 12c3-9 7-9 10 0s7 9 10 0" />
          </svg>
        </TabsTrigger>
        <TabsTrigger value="triangle" title="Triangle">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2 12l5-8 10 16 5-8" />
          </svg>
        </TabsTrigger>
        <TabsTrigger value="square" title="Square">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2 12h0v-8h10v16h10v-8h0" />
          </svg>
        </TabsTrigger>
        <TabsTrigger value="sawtooth" title="Sawtooth">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2 15l15-8v8.7l-8" />
          </svg>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
