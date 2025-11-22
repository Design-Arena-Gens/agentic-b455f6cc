'use client';
import { useMemo } from 'react';
import type { PatternName } from './BeatEngine';

type Props = {
  isPlaying: boolean;
  bpm: number;
  pattern: PatternName;
  onStart: () => void;
  onStop: () => void;
  onBpm: (bpm: number) => void;
  onPattern: (p: PatternName) => void;
};

export default function Controls(props: Props) {
  const patterns = useMemo<PatternName[]>(() => ['Rai', 'Chaabi', 'Kabyle'], []);
  return (
    <div className="glass rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
      <div className="flex items-center gap-3">
        {!props.isPlaying ? (
          <button
            onClick={props.onStart}
            className="px-4 py-2 rounded-lg bg-primary-500 hover:bg-primary-400 text-black font-semibold transition"
          >
            Start
          </button>
        ) : (
          <button
            onClick={props.onStop}
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold transition"
          >
            Stop
          </button>
        )}
        <div className="flex items-center gap-2">
          <label className="text-sm text-white/70">Tempo</label>
          <input
            type="range"
            min={70}
            max={140}
            step={1}
            value={props.bpm}
            onChange={(e) => props.onBpm(parseInt(e.target.value))}
          />
          <div className="w-14 text-right tabular-nums">{props.bpm} BPM</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <label className="text-sm text-white/70">Groove</label>
        <select
          value={props.pattern}
          onChange={(e) => props.onPattern(e.target.value as PatternName)}
          className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg"
        >
          {patterns.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

