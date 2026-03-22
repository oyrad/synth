import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog.tsx';
import { Button } from './ui/button.tsx';
import { useAudioCtx } from '../hooks/use-audio-context.ts';

export function StartAudioDialog() {
  const { isAudioReady, getAudioContext } = useAudioCtx();

  return (
    <Dialog open={!isAudioReady}>
      <DialogContent showCloseButton={false} className="w-fit px-12">
        <DialogHeader className="text-center gap-3 py-2">
          <DialogTitle className="text-2xl">Ready to play?</DialogTitle>
          <Button
            onClick={() => getAudioContext().resume()}
            className="bg-emerald-600 hover:bg-emerald-700 w-full"
            size="lg"
          >
            Start Audio
          </Button>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}