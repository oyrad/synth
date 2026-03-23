import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog.tsx';
import { Button } from './ui/button.tsx';
import { Input } from './ui/input.tsx';
import { type ReactNode, useState } from 'react';

interface SavePresetDialogProps {
  trigger: ReactNode;
  onSave: (name: string) => void;
}

export function SavePresetDialog({ trigger, onSave }: SavePresetDialogProps) {
  const [presetName, setPresetName] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
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
              onClick={() => {
                if (!presetName.trim()) {
                  return;
                }

                onSave(presetName);

                setPresetName('');
                setIsOpen(false);
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
