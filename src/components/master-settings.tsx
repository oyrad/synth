import { Slider } from './ui/slider.tsx';
import { useSettingsStore } from '../stores/use-settings-store.ts';
import { Label } from './ui/label.tsx';

export function MasterSettings() {
  const masterVolume = useSettingsStore((s) => s.masterVolume);
  const setMasterVolume = useSettingsStore((s) => s.setMasterVolume);

  const masterTune = useSettingsStore((s) => s.masterTune);
  const setMasterTune = useSettingsStore((s) => s.setMasterTune);

  return (
    <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 flex flex-col gap-3 w-xs">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <Label>Volume</Label>
          <p className="text-sm">{masterVolume}</p>
        </div>
        <Slider
          min={0}
          max={100}
          step={1}
          value={[masterVolume]}
          onValueChange={(value) => setMasterVolume(value[0])}
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <Label>Tune</Label>
          <p className="text-sm">{masterTune}</p>
        </div>
        <Slider
          min={-100}
          max={100}
          step={1}
          value={[masterTune]}
          onValueChange={(value) => setMasterTune(value[0])}
        />
      </div>
    </div>
  );
}
