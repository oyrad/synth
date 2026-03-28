import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog.tsx';
import { Button } from './ui/button.tsx';
import { useAudioCtx } from '../hooks/use-audio-context.ts';
import { useMidiStore } from '../stores/use-midi-store.tsx';
import { Kbd } from './ui/kbd.tsx';

export function StartAudioDialog() {
  const { isAudioReady, getAudioContext } = useAudioCtx();
  const { inputs: midiInputs } = useMidiStore();

  return (
    <Dialog open={!isAudioReady}>
      <DialogContent showCloseButton={false} className="sm:max-w-md w-fit px-12">
        <DialogHeader className="text-center gap-4 py-2">
          <DialogTitle className="text-2xl">Ready to play?</DialogTitle>

          {midiInputs.length === 0 && (
            <div className="flex flex-col gap-2">
              <p>No Midi inputs detected. Keyboard playing enabled.</p>
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
          )}

          <Button
            onClick={() => getAudioContext().resume()}
            className="bg-emerald-600 hover:bg-emerald-700 w-fit self-center px-8"
            size="lg"
          >
            Start Audio
          </Button>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
