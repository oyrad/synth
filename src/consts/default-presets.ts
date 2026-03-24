import type { Preset } from '../stores/use-preset-store.ts';

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
          isMute: false,
        },
      ],
      adsr: { attack: 0.01, decay: 0.1, sustain: 0.8, release: 0.2 },
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
          isMute: false,
        },
        {
          id: 'fat-saw-osc-2',
          waveform: 'sawtooth',
          volume: 100,
          detune: 7,
          transpose: 0,
          isMute: false,
        },
        {
          id: 'fat-saw-osc-3',
          waveform: 'sawtooth',
          volume: 80,
          detune: 0,
          transpose: 0,
          isMute: false,
        },
      ],
      adsr: { attack: 0.02, decay: 0.2, sustain: 0.7, release: 0.3 },
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
          isMute: false,
        },
        {
          id: 'organ-osc-2',
          waveform: 'sine',
          volume: 70,
          detune: 0,
          transpose: 12,
          isMute: false,
        },
        {
          id: 'organ-osc-3',
          waveform: 'sine',
          volume: 50,
          detune: 0,
          transpose: 19,
          isMute: false,
        },
      ],
      adsr: { attack: 0.01, decay: 0.01, sustain: 1.0, release: 0.05 },
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
          isMute: false,
        },
        {
          id: 'octave-bass-osc-2',
          waveform: 'sawtooth',
          volume: 70,
          detune: 0,
          transpose: -12,
          isMute: false,
        },
      ],
      adsr: { attack: 0.01, decay: 0.3, sustain: 0.5, release: 0.15 },
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
          isMute: false,
        },
        {
          id: 'soft-pad-osc-2',
          waveform: 'triangle',
          volume: 80,
          detune: 3,
          transpose: 0,
          isMute: false,
        },
        {
          id: 'soft-pad-osc-3',
          waveform: 'sine',
          volume: 60,
          detune: -3,
          transpose: 12,
          isMute: false,
        },
      ],
      adsr: { attack: 0.8, decay: 0.4, sustain: 0.7, release: 1.0 },
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
          isMute: false,
        },
        {
          id: 'power-osc-2',
          waveform: 'sawtooth',
          volume: 90,
          detune: 0,
          transpose: 7,
          isMute: false,
        },
        {
          id: 'power-osc-3',
          waveform: 'sawtooth',
          volume: 70,
          detune: 0,
          transpose: 12,
          isMute: false,
        },
      ],
      adsr: { attack: 0.01, decay: 0.15, sustain: 0.9, release: 0.3 },
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
          isMute: false,
        },
        {
          id: 'hollow-osc-2',
          waveform: 'square',
          volume: 60,
          detune: -5,
          transpose: 12,
          isMute: false,
        },
      ],
      adsr: { attack: 0.05, decay: 0.2, sustain: 0.6, release: 0.25 },
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
          isMute: false,
        },
        {
          id: 'harsh-osc-2',
          waveform: 'sawtooth',
          volume: 80,
          detune: 50,
          transpose: 0,
          isMute: false,
        },
      ],
      adsr: { attack: 0.01, decay: 0.05, sustain: 1.0, release: 0.1 },
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
          isMute: false,
        },
        {
          id: 'bells-osc-2',
          waveform: 'sine',
          volume: 60,
          detune: 0,
          transpose: 12,
          isMute: false,
        },
        {
          id: 'bells-osc-3',
          waveform: 'triangle',
          volume: 40,
          detune: 0,
          transpose: 24,
          isMute: false,
        },
      ],
      adsr: { attack: 0.01, decay: 0.8, sustain: 0.0, release: 0.5 },
    },
  },
];
