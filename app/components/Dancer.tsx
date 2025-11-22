'use client';
import { useEffect, useState } from 'react';

export default function Dancer(props: { step: number; accent?: boolean }) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
    const t = setTimeout(() => setAnimate(false), 300);
    return () => clearTimeout(t);
  }, [props.step]);

  return (
    <div className="relative w-40 h-40">
      <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-28 h-28 rounded-full bg-gradient-to-b from-primary-400/80 to-primary-600/70 blur-2xl`} />
      <div className={`relative mx-auto w-24`}>
        <div className={`transition-transform ${animate ? 'animate-bounce-beat' : ''}`}>
          {/* Head */}
          <div className="mx-auto w-10 h-10 rounded-full bg-white/90 shadow" />
          {/* Body */}
          <div className="mx-auto mt-1 w-4 h-14 rounded-full bg-white/80" />
          {/* Arms */}
          <div className="flex justify-between -mt-10">
            <div className={`w-16 h-2 rounded-full bg-white/70 origin-right ${props.accent ? 'rotate-6' : '-rotate-6'}`} />
            <div className={`w-16 h-2 rounded-full bg-white/70 origin-left ${props.accent ? '-rotate-6' : 'rotate-6'}`} />
          </div>
          {/* Legs */}
          <div className="flex justify-between mt-8">
            <div className={`w-2 h-10 rounded-full bg-white/70 ${props.accent ? '-rotate-6' : 'rotate-6'}`} />
            <div className={`w-2 h-10 rounded-full bg-white/70 ${props.accent ? 'rotate-6' : '-rotate-6'}`} />
          </div>
        </div>
      </div>
    </div>
  );
}

