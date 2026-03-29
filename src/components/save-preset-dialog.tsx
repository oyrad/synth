import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog.tsx';
import { Button } from './ui/button.tsx';
import { Input } from './ui/input.tsx';
import { type ReactNode, useState } from 'react';
import { useHotkeyStore } from '../stores/use-hotkey-store.ts';

interface SavePresetDialogProps {
  trigger: ReactNode;
  onSave: (name: string) => void;
}

export function SavePresetDialog({ trigger, onSave }: SavePresetDialogProps) {
  const [presetName, setPresetName] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const { setEnabled: setHotkeysEnabled } = useHotkeyStore();

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setHotkeysEnabled(!open);
        setIsOpen(open);
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader className="gap-3">
          <DialogTitle>New preset</DialogTitle>

          <div className="flex gap-2">
            <Input
              id="preset-name"
              type="text"
              placeholder="Name"
              value={presetName}
              onChange={(e) => {
                setPresetName(e.target.value);
              }}
            />

            <Button
              disabled={!presetName.trim()}
              onClick={() => {
                if (!presetName.trim()) {
                  return;
                }

                onSave(presetName);

                setPresetName('');
                setIsOpen(false);
                setHotkeysEnabled(true);
              }}
            >
              Save
            </Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
