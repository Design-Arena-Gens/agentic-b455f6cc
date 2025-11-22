export const metadata = {
  title: 'Algerian Dance Trainer',
  description: 'Rhythm coach and beat visualizer for kids',
};

import './globals.css';
import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-neutral-950 text-white antialiased">
        <div className="min-h-dvh flex flex-col">
          <header className="border-b border-white/10">
            <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
              <h1 className="text-lg font-semibold tracking-tight">
                Algerian Dance Trainer
              </h1>
              <div className="text-xs text-white/60">
                Made for movement and fun
              </div>
            </div>
          </header>
          <main className="flex-1">
            {children}
          </main>
          <footer className="border-t border-white/10">
            <div className="max-w-5xl mx-auto px-4 py-4 text-center text-white/50 text-xs">
              Keep volume at a safe level. Move with space around you.
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}

