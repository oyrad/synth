import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog.tsx';
import { Kbd } from './ui/kbd.tsx';
import { useMidiCCStore } from '../stores/use-midi-cc-store.tsx';

export function AssignKnobDialog() {
  const isAssignKnobModeActive = useMidiCCStore((s) => s.isAssignModeActive);
  const setIsAssignKnobModeActive = useMidiCCStore((s) => s.setIsAssignModeActive);
  const setActiveParameterId = useMidiCCStore((s) => s.setActiveParameterId);

  console.log(isAssignKnobModeActive);

  return (
    <Dialog
      open={isAssignKnobModeActive}
      onOpenChange={(open) => {
        setIsAssignKnobModeActive(open);
        if (!open) {
          setActiveParameterId(null);
        }
      }}
    >
      <DialogContent showCloseButton={false} className="sm:max-w-md w-fit px-12">
        <DialogHeader className="text-center gap-4 py-2">
          <DialogTitle className="text-2xl">Listening for input</DialogTitle>
          <p>Move the knob or slider you want to assign to this parameter.</p>
          <p className="text-gray-400">
            Press <Kbd>Esc</Kbd> to cancel.
          </p>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
