'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { BeatEngine, type PatternName } from './BeatEngine';
import Controls from './Controls';
import BeatVisualizer from './BeatVisualizer';
import Dancer from './Dancer';

export default function RhythmTrainer() {
  const engineRef = useRef<BeatEngine>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [step, setStep] = useState(0);
  const [accent, setAccent] = useState(false);
  const [bpm, setBpm] = useState(100);
  const [pattern, setPattern] = useState<PatternName>('Rai');

  useEffect(() => {
    engineRef.current = new BeatEngine();
    engineRef.current.setBeatCallback(({ step, accent }) => {
      setStep(step);
      setAccent(accent);
    });
    return () => {
      engineRef.current?.stop();
    };
  }, []);

  useEffect(() => {
    engineRef.current?.setBpm(bpm);
  }, [bpm]);

  useEffect(() => {
    engineRef.current?.setPattern(pattern);
  }, [pattern]);

  const tips = useMemo(() => {
    return [
      'Clap on the bright circles!',
      'Step right on 1 & 3, left on 2 & 4.',
      'Keep your shoulders relaxed.',
      'Small hops on the accented beats.',
      'Smile and enjoy the groove!',
    ];
  }, []);

  const currentTip = tips[Math.floor(step / 4) % tips.length];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-semibold">Move with the Algerian groove</h2>
        <p className="text-white/70">
          Follow the pulse. Switch grooves. Keep steady steps and clap the beat.
        </p>
      </div>

      <Controls
        isPlaying={isPlaying}
        bpm={bpm}
        pattern={pattern}
        onStart={() => {
          engineRef.current?.start();
          setIsPlaying(true);
        }}
        onStop={() => {
          engineRef.current?.stop();
          setIsPlaying(false);
        }}
        onBpm={setBpm}
        onPattern={setPattern}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="glass rounded-xl p-6">
          <BeatVisualizer currentStep={step} accent={accent} />
        </div>
        <div className="glass rounded-xl p-6 flex flex-col items-center">
          <Dancer step={step} accent={accent} />
          <div className="mt-4 text-white/80">{currentTip}</div>
        </div>
      </div>

      <div className="glass rounded-xl p-6">
        <h3 className="font-semibold mb-2">Quick tips</h3>
        <ul className="grid sm:grid-cols-2 gap-2 text-white/80 text-sm">
          <li>? Start slower (90?100 BPM), then increase.</li>
          <li>? Think: Right, Left, Right, Left ? steady steps.</li>
          <li>? Clap softly on the small beats, louder on accents.</li>
          <li>? Keep knees soft; bounce lightly with the music.</li>
        </ul>
      </div>
    </div>
  );
}

