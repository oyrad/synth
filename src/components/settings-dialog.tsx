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
import { Kbd } from './ui/kbd.tsx';
import { useMidiCCStore } from '../stores/use-midi-cc-store.tsx';
import { Button } from './ui/button.tsx';

export function SettingsDialog() {
  const { velocitySensitive, keyboardPlaying, setVelocitySensitive, setKeyboardPlaying } =
    useSettingsStore();

  const { inputs, selectedInput, setSelectedInput } = useMidiStore();

  const clearAllMappings = useMidiCCStore((s) => s.clearAll);

  return (
    <Dialog>
      <DialogTrigger className="cursor-pointer">
        <Settings />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-semibold text-lg">Settings</DialogTitle>
        </DialogHeader>

        <div className="flex justify-between items-center">
          <p>MIDI input</p>
          {inputs.length > 0 ? (
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
                  toast(`Selected MIDI input: ${newInput.name}`);
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
          ) : (
            <p className="text-red-500 font-medium">No MIDI inputs</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="velocity-sensitive" className="flex items-center gap-2">
            Velocity sensitive
          </Label>
          <Checkbox
            checked={velocitySensitive}
            onCheckedChange={(checked) => {
              setVelocitySensitive(!!checked);
              toast(`Velocity sensitivity ${checked ? 'enabled' : 'disabled'}.`);
            }}
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="velocity-sensitive" className="flex items-center gap-2">
              Keyboard playing
            </Label>
            <Checkbox
              checked={keyboardPlaying}
              onCheckedChange={(checked) => {
                setKeyboardPlaying(!!checked);
                toast(`Keyboard playing ${checked ? 'enabled' : 'disabled'}.`);
              }}
            />
          </div>

          <div className="text-gray-400">
            <p>
              One full playable octave from <Kbd>A</Kbd> to
              <Kbd>K</Kbd>.
            </p>
            <p>
              Press <Kbd>1</Kbd> or <Kbd>2</Kbd> to shift the octave down or up.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="velocity-sensitive" className="flex items-center gap-2">
            Mapped controls
          </Label>
          <Button
            variant="secondary"
            size="xs"
            onClick={() => {
              clearAllMappings();
              toast('Cleared all controls');
            }}
          >
            Clear all
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
