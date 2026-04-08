import type { DelayParameters } from '../../components/synth/delay/delay.tsx';
import type { AudioContextValue } from '../../audio-context.tsx';
import type { DistortionParameters } from '../../components/synth/distortion/distortion.tsx';
import { createDistortionCurve, createReverbBuffer } from '../audio.ts';
import type { ReverbParameters } from '../../components/synth/reverb/reverb.tsx';
import type { FilterParameters } from '../../components/synth/filter/filter.tsx';
import type { Voice } from '../../hooks/use-synth.ts';
import type { LFOParameters } from '../../components/synth/lfo/lfo.tsx';

interface UpdateFilterParams {
  filter: FilterParameters;
  getAudioContext: AudioContextValue['getAudioContext'];
  voices: Record<number, Voice>;
  lfo: LFOParameters;
}

export function updateFilter({ filter, getAudioContext, voices, lfo }: UpdateFilterParams) {
  const audioContext = getAudioContext();
  const now = audioContext.currentTime;
  const ramp = 0.05;

  Object.values(voices).forEach((voice) => {
    const node = voice.filterNode;
    node.type = filter.isActive ? filter.type : 'lowpass';

    let targetFreq = filter.isActive ? filter.frequency : 20000;

    if (lfo.isActive && lfo.target === 'filter') {
      targetFreq = Math.max(targetFreq, lfo.depth + 20);
    }

    node.frequency.cancelScheduledValues(now);
    node.frequency.setValueAtTime(node.frequency.value, now);
    node.frequency.exponentialRampToValueAtTime(Math.max(20, targetFreq), now + ramp);

    node.Q.cancelScheduledValues(now);
    node.Q.setValueAtTime(node.Q.value, now);
    node.Q.linearRampToValueAtTime(filter.isActive ? filter.resonance : 1, now + ramp);
  });
}

interface UpdateDelayParams {
  delay: DelayParameters;
  getAudioContext: AudioContextValue['getAudioContext'];
  getDelay: AudioContextValue['getDelay'];
}

export function updateDelay({ delay, getAudioContext, getDelay }: UpdateDelayParams) {
  const { delayNode, feedbackGain, dryGain, wetGain } = getDelay();

  const now = getAudioContext().currentTime;
  const ramp = 0.05;

  if (delay.isActive) {
    delayNode.delayTime.linearRampToValueAtTime(delay.time, now + ramp);
    feedbackGain.gain.linearRampToValueAtTime(delay.feedback, now + ramp);

    dryGain.gain.linearRampToValueAtTime(1 - delay.mix, now + ramp);
    wetGain.gain.linearRampToValueAtTime(delay.mix, now + ramp);
  } else {
    feedbackGain.gain.linearRampToValueAtTime(0, now + ramp);
    dryGain.gain.linearRampToValueAtTime(1, now + ramp);
    wetGain.gain.linearRampToValueAtTime(0, now + ramp);
  }
}

interface UpdateDistortionParams {
  distortion: DistortionParameters;
  getDistortion: AudioContextValue['getDistortion'];
}

export function updateDistortion({ distortion, getDistortion }: UpdateDistortionParams) {
  const distortionNode = getDistortion();

  if (distortion.isActive) {
    distortionNode.curve = createDistortionCurve(distortion.amount);
  } else {
    distortionNode.curve = null;
  }
}

interface UpdateReverbParams {
  reverb: ReverbParameters;
  getAudioContext: AudioContextValue['getAudioContext'];
  getReverb: AudioContextValue['getReverb'];
}

export function updateReverb({ reverb, getAudioContext, getReverb }: UpdateReverbParams) {
  const { reverbNode, reverbWetGain } = getReverb();
  const ctx = getAudioContext();

  if (reverb.isActive) {
    const wetValue = reverb.mix;
    reverbWetGain.gain.setTargetAtTime(wetValue, ctx.currentTime, 0.05);
    reverbNode.buffer = createReverbBuffer(ctx, Math.max(0.1, reverb.time), 3);
  } else {
    reverbWetGain.gain.setTargetAtTime(0, ctx.currentTime, 0.05);
    reverbNode.buffer = null;
  }
}

interface UpdateLFOParams {
  getAudioContext: AudioContextValue['getAudioContext'];
  getLFO: AudioContextValue['getLFO'];
  lfo: LFOParameters;
  voices: Record<number, Voice>;
}

export function updateLFO({ getAudioContext, getLFO, lfo, voices }: UpdateLFOParams) {
  const { gain: lfoGainNode } = getLFO();
  const audioContext = getAudioContext();

  lfoGainNode.disconnect();

  if (!lfo.isActive) {
    return;
  }

  Object.values(voices).forEach((voice) => {
    if (lfo.target === 'filter') {
      lfoGainNode.connect(voice.filterNode.frequency);
    } else if (lfo.target === 'volume') {
      const volumeLfoGain = audioContext.createGain();
      volumeLfoGain.gain.value = 0.001;
      lfoGainNode.connect(volumeLfoGain);
      volumeLfoGain.connect(voice.masterGain.gain);
    } else if (lfo.target === 'pitch') {
      voice.oscillators.forEach((vOsc) => {
        if (vOsc.oscillator) {
          lfoGainNode.connect(vOsc.oscillator.detune);
        }
      });
    }
  });
}
