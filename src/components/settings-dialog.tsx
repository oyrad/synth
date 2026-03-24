import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog.tsx';
import { Settings } from 'lucide-react';
import { useSettingsStore } from '../stores/use-settings-store.ts';
import { Checkbox } from './ui/checkbox.tsx';
import { Label } from './ui/label.tsx';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select.tsx';
import { useMidiStore } from '../stores/use-midi-store.tsx';
import { isMidiInput } from '../utils/midi.ts';

export function SettingsDialog() {
  const { showVisualizer, velocitySensitive, setShowVisualizer, setVelocitySensitive } =
    useSettingsStore();

  const { inputs, selectedInput, setSelectedInput } = useMidiStore();

  return (
    <Dialog>
      <DialogTrigger className="cursor-pointer">
        <Settings />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="mb-2">
          <DialogTitle className="font-semibold">Settings</DialogTitle>
        </DialogHeader>

        <div className="flex items-center justify-between">
          <Label htmlFor="velocity-sensitive" className="flex items-center gap-2">
            Show Visualizer
          </Label>
          <Checkbox
            checked={showVisualizer}
            onCheckedChange={(checked) => {
              setShowVisualizer(!!checked);
              toast(`Visualizer ${checked ? 'enabled' : 'disabled'}.`);
            }}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="velocity-sensitive" className="flex items-center gap-2">
            Velocity Sensitive
          </Label>
          <Checkbox
            checked={velocitySensitive}
            onCheckedChange={(checked) => {
              setVelocitySensitive(!!checked);
              toast(`Velocity sensitivity ${checked ? 'enabled' : 'disabled'}.`);
            }}
          />
        </div>

        {inputs.length > 0 && (
          <div className="flex justify-between items-center">
            <p>MIDI Input</p>
            <Select
              value={selectedInput?.id ?? ''}
              onValueChange={(value) => {
                const newInput = inputs.find((input) => {
                  if (isMidiInput(input) && input.id === value) {
                    return true;
                  }
                });

                if (newInput) {
                  setSelectedInput(newInput);
                }
              }}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select Input" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {inputs.map((input) => (
                    <SelectItem key={input.id} value={input.id}>
                      {input.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
