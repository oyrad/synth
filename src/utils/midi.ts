export type MidiMessageType = 'note_on' | 'note_off' | 'cc' | 'unknown';

export interface ParsedMidiMessage {
  type: MidiMessageType;
  channel: number;
  data1: number;
  data2: number;
}

export function parseMidiMessage(data: Uint8Array): ParsedMidiMessage {
  const [status, data1, data2] = data;
  const type = status & 0xf0;
  const channel = (status & 0x0f) + 1;

  if (type === 0x90 && data2 > 0) {
    return { type: 'note_on', channel, data1, data2 };
  }

  if (type === 0x80) {
    return { type: 'note_off', channel, data1, data2 };
  }

  if (type === 0x90 && data2 === 0) {
    return { type: 'note_off', channel, data1, data2 };
  }

  if (type === 0xb0) {
    return { type: 'cc', channel, data1, data2 };
  }

  return { type: 'unknown', channel, data1, data2 };
}

export function isOscillatorType(value: string): value is OscillatorType {
  return ['sine', 'square', 'triangle', 'sawtooth'].includes(value);
}

export function isFilterType(value: string): value is BiquadFilterType {
  return ['highpass', 'lowpass', 'bandpass'].includes(value);
}

export function isMidiInput(value: MIDIInput | null): value is MIDIInput {
  return value !== null;
}
