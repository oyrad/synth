import type { DelayParameters } from '../components/synth/delay.tsx';
import type { AudioContextValue } from '../audio-context.tsx';
import type { DistortionParameters } from '../components/synth/distortion.tsx';
import { createDistortionCurve, createReverbBuffer } from './audio.ts';
import type { ReverbParameters } from '../components/synth/reverb.tsx';
import type { FilterParameters } from '../components/synth/filter.tsx';
import type { Voice } from '../hooks/use-synth.ts';

interface UpdateFilterParams {
  filter: FilterParameters;
  getAudioContext: AudioContextValue['getAudioContext'];
  voices: Record<number, Voice>;
}

export function updateFilter({ filter, getAudioContext, voices }: UpdateFilterParams) {
  const audioContext = getAudioContext();
  const now = audioContext.currentTime;
  const ramp = 0.05;

  Object.values(voices).forEach((voice) => {
    voice.filterNode.type = filter.isActive ? filter.type : 'lowpass';
    voice.filterNode.frequency.exponentialRampToValueAtTime(
      filter.isActive ? Math.max(20, filter.frequency) : 20000,
      now + ramp,
    );
    voice.filterNode.Q.linearRampToValueAtTime(filter.isActive ? filter.resonance : 1, now + ramp);
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
