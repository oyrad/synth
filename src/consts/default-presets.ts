import type { Preset } from '../hooks/use-preset-store.ts';

export const DEFAULT_PRESETS: Array<Preset> = [
  {
    id: 'default-saw-lead',
    name: 'Saw lead',
    data: {
      oscillators: [
        {
          id: 'saw-lead-osc-1',
          waveform: 'sawtooth',
          volume: 100,
          detune: 0,
          transpose: 0,
          velocitySensitive: true,
        },
      ],
    },
  },
  {
    id: 'default-fat-saw',
    name: 'Fat saw',
    data: {
      oscillators: [
        {
          id: 'fat-saw-osc-1',
          waveform: 'sawtooth',
          volume: 100,
          detune: -7,
          transpose: 0,
          velocitySensitive: true,
        },
        {
          id: 'fat-saw-osc-2',
          waveform: 'sawtooth',
          volume: 100,
          detune: 7,
          transpose: 0,
          velocitySensitive: true,
        },
        {
          id: 'fat-saw-osc-3',
          waveform: 'sawtooth',
          volume: 80,
          detune: 0,
          transpose: 0,
          velocitySensitive: true,
        },
      ],
    },
  },
  {
    id: 'default-organ',
    name: 'Organ',
    data: {
      oscillators: [
        {
          id: 'organ-osc-1',
          waveform: 'sine',
          volume: 100,
          detune: 0,
          transpose: 0,
          velocitySensitive: false,
        },
        {
          id: 'organ-osc-2',
          waveform: 'sine',
          volume: 70,
          detune: 0,
          transpose: 12,
          velocitySensitive: false,
        },
        {
          id: 'organ-osc-3',
          waveform: 'sine',
          volume: 50,
          detune: 0,
          transpose: 19,
          velocitySensitive: false,
        },
      ],
    },
  },
  {
    id: 'default-octave-bass',
    name: 'Octave bass',
    data: {
      oscillators: [
        {
          id: 'octave-bass-osc-1',
          waveform: 'sawtooth',
          volume: 100,
          detune: 0,
          transpose: 0,
          velocitySensitive: true,
        },
        {
          id: 'octave-bass-osc-2',
          waveform: 'sawtooth',
          volume: 70,
          detune: 0,
          transpose: -12,
          velocitySensitive: true,
        },
      ],
    },
  },
  {
    id: 'default-soft-pad',
    name: 'Soft pad',
    data: {
      oscillators: [
        {
          id: 'soft-pad-osc-1',
          waveform: 'sine',
          volume: 100,
          detune: 0,
          transpose: 0,
          velocitySensitive: true,
        },
        {
          id: 'soft-pad-osc-2',
          waveform: 'triangle',
          volume: 80,
          detune: 3,
          transpose: 0,
          velocitySensitive: true,
        },
        {
          id: 'soft-pad-osc-3',
          waveform: 'sine',
          volume: 60,
          detune: -3,
          transpose: 12,
          velocitySensitive: false,
        },
      ],
    },
  },
  {
    id: 'default-power',
    name: 'Power chord',
    data: {
      oscillators: [
        {
          id: 'power-osc-1',
          waveform: 'sawtooth',
          volume: 100,
          detune: 0,
          transpose: 0,
          velocitySensitive: true,
        },
        {
          id: 'power-osc-2',
          waveform: 'sawtooth',
          volume: 90,
          detune: 0,
          transpose: 7,
          velocitySensitive: true,
        },
        {
          id: 'power-osc-3',
          waveform: 'sawtooth',
          volume: 70,
          detune: 0,
          transpose: 12,
          velocitySensitive: true,
        },
      ],
    },
  },
  {
    id: 'default-hollow',
    name: 'Hollow',
    data: {
      oscillators: [
        {
          id: 'hollow-osc-1',
          waveform: 'square',
          volume: 100,
          detune: 0,
          transpose: 0,
          velocitySensitive: true,
        },
        {
          id: 'hollow-osc-2',
          waveform: 'square',
          volume: 60,
          detune: -5,
          transpose: 12,
          velocitySensitive: false,
        },
      ],
    },
  },
  {
    id: 'default-harsh',
    name: 'Harsh',
    data: {
      oscillators: [
        {
          id: 'harsh-osc-1',
          waveform: 'square',
          volume: 100,
          detune: 0,
          transpose: 0,
          velocitySensitive: true,
        },
        {
          id: 'harsh-osc-2',
          waveform: 'sawtooth',
          volume: 80,
          detune: 50,
          transpose: 0,
          velocitySensitive: true,
        },
      ],
    },
  },
  {
    id: 'default-bells',
    name: 'Bells',
    data: {
      oscillators: [
        {
          id: 'bells-osc-1',
          waveform: 'sine',
          volume: 100,
          detune: 0,
          transpose: 0,
          velocitySensitive: true,
        },
        {
          id: 'bells-osc-2',
          waveform: 'sine',
          volume: 60,
          detune: 0,
          transpose: 12,
          velocitySensitive: true,
        },
        {
          id: 'bells-osc-3',
          waveform: 'triangle',
          volume: 40,
          detune: 0,
          transpose: 24,
          velocitySensitive: true,
        },
      ],
    },
  },
];
