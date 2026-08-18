import React, { useState } from 'react';
import { Search, Hash } from 'lucide-react';

const PRESETS = [
  { label: 'r/technology', value: 'technology' },
  { label: 'r/wallstreetbets', value: 'wallstreetbets' },
  { label: 'r/gaming', value: 'gaming' },
  { label: 'r/science', value: 'science' },
  { label: 'r/news', value: 'news' }
];

export default function SubredditSelector({ currentSubreddit, onSelectSubreddit, isLoading }) {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = inputValue.trim().replace(/^r\//i, '');
    if (trimmed) {
      onSelectSubreddit(trimmed);
      setInputValue('');
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Search Input Form */}
      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Hash className="h-5 w-5 text-slate-450 group-focus-within:text-indigo-650 transition-colors" />
        </div>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter subreddit name (e.g. wallstreetbets, technology)..."
          className="w-full bg-slate-50/60 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm md:text-base rounded-2xl pl-11 pr-32 py-3.5 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 focus:bg-white transition-all font-sans glass-panel"
          disabled={isLoading}
        />
        <div className="absolute inset-y-1.5 right-1.5 flex items-center gap-2">
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="h-full px-5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:from-slate-200 disabled:to-slate-200 disabled:text-slate-400 text-white font-medium text-xs md:text-sm rounded-xl transition-all shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/25 flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? (
              <span className="w-4 h-4 border-2 border-slate-300 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            <span>Analyze</span>
          </button>
        </div>
      </form>

      {/* Preset Selectors */}
      <div className="flex flex-wrap items-center justify-center gap-2.5">
        <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider mr-1.5">
          Quick Select:
        </span>
        {PRESETS.map((preset) => {
          const isActive = currentSubreddit.toLowerCase() === preset.value.toLowerCase();
          return (
            <button
              key={preset.value}
              type="button"
              onClick={() => onSelectSubreddit(preset.value)}
              disabled={isLoading}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer select-none ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700 border-indigo-200 shadow-sm shadow-indigo-500/5'
                  : 'bg-slate-50/80 text-slate-650 border-slate-200/80 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              r/{preset.value}
            </button>
          );
        })}
      </div>
    </div>
  );
}
