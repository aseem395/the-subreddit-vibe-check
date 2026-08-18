import React from 'react';
import { Sparkles, Activity } from 'lucide-react';

export default function Header() {
  return (
    <header className="border-b border-slate-900 bg-slate-950/60 backdrop-blur-md sticky top-0 z-50 py-4 px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/20">
            <Activity className="w-5 h-5 animate-pulse" />
            <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
            </div>
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 bg-clip-text text-transparent font-display">
              Subreddit <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Vibe Check</span>
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              Real-time Sentiment Analysis Engine
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-900/50 border border-slate-800/80 rounded-full px-3.5 py-1.5 text-xs text-slate-300 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Powered by AFINN-165 Lexicon</span>
        </div>
      </div>
    </header>
  );
}
