/* eslint-disable no-restricted-globals */
export type PatternName = 'Rai' | 'Chaabi' | 'Kabyle';

export type EngineState = {
  isPlaying: boolean;
  bpm: number;
  step: number; // 0..15
  pattern: PatternName;
};

export type BeatCallback = (params: { step: number; accent: boolean }) => void;

export class BeatEngine {
  private audioCtx: AudioContext | null = null;
  private isRunning = false;
  private nextNoteTime = 0;
  private currentStep = 0;
  private scheduleAheadTime = 0.12; // seconds
  private lookahead = 25; // ms
  private timerId: number | null = null;
  private bpm = 100;
  private pattern: PatternName = 'Rai';
  private beatCb: BeatCallback | null = null;

  // 16-step patterns for simple Algerian grooves (stylized)
  // 1 = hit, 2 = accent hit, 0 = rest
  private patterns: Record<PatternName, { kick: number[]; snare: number[]; hat: number[] }> = {
    Rai: {
      kick: [2,0,0,0, 0,0,1,0, 2,0,0,0, 0,0,1,0],
      snare:[0,0,1,0, 0,0,0,0, 0,0,1,0, 0,0,0,0],
      hat:  [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0],
    },
    Chaabi: {
      kick: [2,0,0,0, 1,0,0,0, 2,0,0,0, 1,0,0,0],
      snare:[0,0,1,0, 0,0,0,0, 0,0,1,0, 0,0,0,0],
      hat:  [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0],
    },
    Kabyle: {
      kick: [2,0,0,0, 0,0,1,0, 2,0,0,0, 0,0,1,0],
      snare:[0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
      hat:  [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0],
    }
  };

  setBeatCallback(cb: BeatCallback) {
    this.beatCb = cb;
  }

  setBpm(bpm: number) {
    this.bpm = Math.max(60, Math.min(180, Math.round(bpm)));
  }

  setPattern(name: PatternName) {
    this.pattern = name;
  }

  getState(): EngineState {
    return {
      isPlaying: this.isRunning,
      bpm: this.bpm,
      step: this.currentStep,
      pattern: this.pattern,
    };
  }

  start() {
    if (this.isRunning) return;
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    this.isRunning = true;
    this.currentStep = 0;
    this.nextNoteTime = this.audioCtx.currentTime + 0.05;
    this.scheduler();
  }

  stop() {
    this.isRunning = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  private nextStep() {
    const secondsPerBeat = 60.0 / this.bpm;
    const sixteenth = secondsPerBeat / 4;
    this.nextNoteTime += sixteenth;
    this.currentStep = (this.currentStep + 1) % 16;
  }

  private scheduler() {
    if (!this.audioCtx) return;
    while (this.isRunning && this.nextNoteTime < this.audioCtx.currentTime + this.scheduleAheadTime) {
      this.scheduleStep(this.currentStep, this.nextNoteTime);
      this.nextStep();
    }
    this.timerId = setTimeout(this.scheduler.bind(this), this.lookahead) as unknown as number;
  }

  private scheduleStep(step: number, time: number) {
    const pat = this.patterns[this.pattern];
    const kickVal = pat.kick[step];
    const snareVal = pat.snare[step];
    const hatVal = pat.hat[step];

    const accent = kickVal === 2;
    if (kickVal) this.playKick(time, accent);
    if (snareVal) this.playSnare(time, snareVal === 2);
    if (hatVal) this.playHat(time, hatVal === 2);

    if (this.beatCb) {
      // Fire slightly before to allow UI anim sync
      const now = performance.now();
      const deltaMs = Math.max(0, (time - (this.audioCtx as AudioContext).currentTime) * 1000 - 10);
      setTimeout(() => this.beatCb!({ step, accent }), deltaMs);
    }
  }

  private playKick(time: number, accent: boolean) {
    if (!this.audioCtx) return;
    const ctx = this.audioCtx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(accent ? 140 : 120, time);
    osc.frequency.exponentialRampToValueAtTime(55, time + 0.09);
    gain.gain.setValueAtTime(accent ? 1.0 : 0.7, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.12);
    osc.connect(gain).connect(ctx.destination);
    osc.start(time);
    osc.stop(time + 0.13);
  }

  private playSnare(time: number, accent: boolean) {
    if (!this.audioCtx) return;
    const ctx = this.audioCtx;
    const bufferSize = 2 * ctx.sampleRate * 0.12;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1800, time);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(accent ? 0.7 : 0.5, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.12);
    noise.connect(filter).connect(gain).connect(ctx.destination);
    noise.start(time);
    noise.stop(time + 0.12);
  }

  private playHat(time: number, accent: boolean) {
    if (!this.audioCtx) return;
    const ctx = this.audioCtx;
    const bufferSize = 2 * ctx.sampleRate * 0.05;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(6000, time);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(accent ? 0.35 : 0.25, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);
    noise.connect(filter).connect(gain).connect(ctx.destination);
    noise.start(time);
    noise.stop(time + 0.05);
  }
}

