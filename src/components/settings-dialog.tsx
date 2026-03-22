import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog.tsx';
import { Settings } from 'lucide-react';
import { useSettingsStore } from '../hooks/use-settings-store.ts';
import { Checkbox } from './ui/checkbox.tsx';
import { Label } from './ui/label.tsx';

export function SettingsDialog() {
  const { showVisualizer, velocitySensitive, setShowVisualizer, setVelocitySensitive } =
    useSettingsStore();

  return (
    <Dialog>
      <DialogTrigger className="ml-auto cursor-pointer">
        <Settings size={20} />
      </DialogTrigger>
      <DialogContent showCloseButton={true}>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>

        <div className="flex items-center justify-between">
          <Label htmlFor="velocity-sensitive" className="flex items-center gap-2">
            Show Visualizer
          </Label>
          <Checkbox
            checked={showVisualizer}
            onCheckedChange={(checked) => setShowVisualizer(!!checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="velocity-sensitive" className="flex items-center gap-2">
            Velocity Sensitive
          </Label>
          <Checkbox
            checked={velocitySensitive}
            onCheckedChange={(checked) => setVelocitySensitive(!!checked)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
