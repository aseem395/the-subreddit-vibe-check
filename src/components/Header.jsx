import React from 'react';
import { Sparkles, Activity } from 'lucide-react';

export default function Header() {
  return (
    <header className="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50 py-4 px-6 shadow-sm shadow-slate-100/40">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/10">
            <Activity className="w-5 h-5 animate-pulse" />
            <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
            </div>
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 font-display">
              Subreddit <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Vibe Check</span>
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Real-time Sentiment Analysis Engine
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 rounded-full px-3.5 py-1.5 text-xs text-slate-600 font-medium shadow-sm shadow-slate-100/10">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Powered by AFINN-165 Lexicon</span>
        </div>
      </div>
    </header>
  );
}
