import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog.tsx';
import { Settings } from 'lucide-react';
import { useSettingsStore } from '../stores/use-settings-store.ts';
import { Checkbox } from './ui/checkbox.tsx';
import { Label } from './ui/label.tsx';
import { toast } from 'sonner';

export function SettingsDialog() {
  const { showVisualizer, velocitySensitive, setShowVisualizer, setVelocitySensitive } =
    useSettingsStore();

  return (
    <Dialog>
      <DialogTrigger className="cursor-pointer">
        <Settings />
      </DialogTrigger>
      <DialogContent showCloseButton={true}>
        <DialogHeader>
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
      </DialogContent>
    </Dialog>
  );
}
