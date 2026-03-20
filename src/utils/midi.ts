export type MidiMessageType = 'noteOn' | 'noteOff' | 'cc' | 'unknown';

export interface ParsedMidiMessage {
  type: MidiMessageType;
  channel: number;
  data1: number;
  data2: number;
}

export function parseMidiMessage(data: Uint8Array): ParsedMidiMessage {
  const [status, data1, data2] = data;
  const type = status & 0xF0;
  const channel = (status & 0x0F) + 1;

  if (type === 0x90 && data2 > 0) {
    return { type: 'noteOn', channel, data1, data2 };
  }

  if (type === 0x80) {
    return { type: 'noteOff', channel, data1, data2 };
  }

  if (type === 0x90 && data2 === 0) {
    return { type: 'noteOff', channel, data1, data2 };
  }

  if (type === 0xB0) {
    return { type: 'cc', channel, data1, data2 };
  }

  return { type: 'unknown', channel, data1, data2 };
}

export function isOscillatorType(value: string): value is OscillatorType {
  return ['sine', 'square', 'triangle', 'sawtooth'].includes(value);
}