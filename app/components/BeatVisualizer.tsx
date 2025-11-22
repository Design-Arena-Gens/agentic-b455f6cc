'use client';
import { useEffect, useRef, useState } from 'react';

export default function BeatVisualizer(props: { currentStep: number; totalSteps?: number; accent?: boolean }) {
  const total = props.totalSteps ?? 16;
  const [pulse, setPulse] = useState(false);
  const lastStepRef = useRef<number>(-1);

  useEffect(() => {
    if (props.currentStep !== lastStepRef.current) {
      lastStepRef.current = props.currentStep;
      setPulse(true);
      const t = setTimeout(() => setPulse(false), 220);
      return () => clearTimeout(t);
    }
  }, [props.currentStep]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className={`size-28 rounded-full grid place-items-center transition-transform ${pulse ? 'animate-pulse-beat' : ''}`}
        style={{ background: 'radial-gradient(50% 50% at 50% 50%, rgba(31,181,122,0.5) 0%, rgba(31,181,122,0.15) 60%, rgba(31,181,122,0.05) 100%)', boxShadow: '0 0 80px rgba(31,181,122,0.25) inset' }}
      >
        <div className={`size-14 rounded-full ${props.accent ? 'bg-primary-500' : 'bg-primary-400'} shadow-lg`} />
      </div>
      <div className="grid [grid-template-columns:repeat(16,minmax(0,1fr))] gap-1 w-full max-w-md">
        {Array.from({ length: total }).map((_, i) => {
          const isActive = i === props.currentStep;
          const isDownbeat = i % 4 === 0;
          return (
            <div
              key={i}
              className={`h-2 rounded ${isActive ? 'bg-primary-500' : isDownbeat ? 'bg-white/30' : 'bg-white/15'}`}
            />
          );
        })}
      </div>
    </div>
  );
}

