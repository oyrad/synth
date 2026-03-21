import { Alert, AlertDescription, AlertTitle } from './ui/alert.tsx';
import { TriangleAlert } from 'lucide-react';

interface ErrorMessagesProps {
  isGranted: boolean;
  midiInput: MIDIInput | null | undefined;
  isAudioReady: boolean;
}

export function ErrorMessages({ isGranted, midiInput, isAudioReady }: ErrorMessagesProps) {
  return (
    <div className="flex flex-col gap-2">
      <Alert hidden={isGranted} variant="destructive" className="w-96 bg-red-50 border-red-300">
        <TriangleAlert />
        <AlertTitle>MIDI Access not granted</AlertTitle>
        <AlertDescription>
          Grant access to your MIDI devices in your browser settings.
        </AlertDescription>
      </Alert>

      <Alert hidden={!!midiInput} variant="destructive" className="w-96 bg-red-50 border-red-300">
        <TriangleAlert />
        <AlertTitle>
          No MIDI inputs found
        </AlertTitle>
        <AlertDescription>
          Connect a MIDI device and refresh the page.
        </AlertDescription>
      </Alert>

      <Alert hidden={isAudioReady} variant="destructive" className="w-96 bg-red-50 border-red-300">
        <TriangleAlert />
        <AlertTitle>
          Audio not started
        </AlertTitle>
        <AlertDescription>
          Click the "Start Audio" button to enable audio output.
        </AlertDescription>
      </Alert>
    </div>
  );
}