import React from 'react';
import { 
  Smile, 
  Frown, 
  Meh, 
  Laugh, 
  Angry, 
  HelpCircle, 
  Activity, 
  MessageSquare
} from 'lucide-react';

const iconMap = {
  laughing: Laugh,
  smile: Smile,
  neutral: Meh,
  frown: Frown,
  angry: Angry,
};

export default function MetricsCards({ stats }) {
  const VibeIcon = iconMap[stats.vibeIcon] || HelpCircle;

  // Calculate sliding scale percentage: maps -2.0 to +2.0 onto 0% to 100%
  // Clamp average score between -2.0 and +2.0 for visualization safety
  const clampedScore = Math.max(-2, Math.min(2, stats.averageScore));
  const pointerPercent = ((clampedScore + 2) / 4) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
      {/* CARD 1: Overall Vibe */}
      <div className="glass-panel glass-panel-hover rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden">
        {/* Glow Background */}
        <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-indigo-500/5 to-transparent blur-2xl rounded-full" />
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
            Overall Community Vibe
          </span>
          <div className={`p-2.5 rounded-2xl ${stats.vibeBg} border ${stats.vibeColor}`}>
            <VibeIcon className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-8 space-y-2">
          <div className={`text-2xl font-bold tracking-tight font-display ${stats.vibeColor}`}>
            {stats.overallVibe}
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            The collective sentiment extracted from titles of top hot threads.
          </p>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
          <span>Analysis Count</span>
          <span className="text-slate-700">{stats.totalCount} posts</span>
        </div>
      </div>

      {/* CARD 2: Average Score */}
      <div className="glass-panel glass-panel-hover rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden">
        {/* Glow Background */}
        <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-purple-500/5 to-transparent blur-2xl rounded-full" />

        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
            Average Score
          </span>
          <div className="p-2.5 rounded-2xl bg-purple-50 border border-purple-100 text-purple-650">
            <Activity className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <div className="text-3xl font-extrabold text-slate-900 font-display">
              {stats.averageScore > 0 ? `+${stats.averageScore}` : stats.averageScore}
            </div>
            <p className="text-xs text-slate-500 mt-1">AFINN Lexicon Metric (-5 to +5 scale)</p>
          </div>

          {/* Slider visualizer */}
          <div className="space-y-1.5">
            <div className="relative h-2 w-full bg-slate-100 rounded-full overflow-visible border border-slate-200/60">
              {/* Neutral Center Mark */}
              <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-slate-350" />
              {/* Score Indicator Pointer */}
              <div 
                className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-indigo-600 border border-white shadow-md shadow-indigo-600/30 transition-all duration-500"
                style={{ left: `calc(${pointerPercent}% - 7px)` }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-450 font-semibold uppercase px-0.5">
              <span>Negative</span>
              <span>Neutral</span>
              <span>Positive</span>
            </div>
          </div>
        </div>
      </div>

      {/* CARD 3: Vibe Segment Distribution */}
      <div className="glass-panel glass-panel-hover rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden">
        {/* Glow Background */}
        <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-emerald-500/5 to-transparent blur-2xl rounded-full" />

        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
            Post Sentiment Split
          </span>
          <div className="p-2.5 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600">
            <MessageSquare className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {/* Segment Bar */}
          <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex border border-slate-200/50">
            <div 
              style={{ width: `${stats.positivePercentage}%` }} 
              className="h-full bg-emerald-500 transition-all duration-500" 
              title={`Positive: ${stats.positivePercentage}%`}
            />
            <div 
              style={{ width: `${stats.neutralPercentage}%` }} 
              className="h-full bg-slate-400 transition-all duration-500" 
              title={`Neutral: ${stats.neutralPercentage}%`}
            />
            <div 
              style={{ width: `${stats.negativePercentage}%` }} 
              className="h-full bg-red-500 transition-all duration-500" 
              title={`Negative: ${stats.negativePercentage}%`}
            />
          </div>

          {/* Counts */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-slate-50/50 p-2 rounded-xl border border-slate-150">
              <div className="text-xs font-semibold text-slate-500">Pos</div>
              <div className="text-sm font-bold text-emerald-600">{stats.positiveCount}</div>
              <div className="text-[10px] text-slate-500">{stats.positivePercentage}%</div>
            </div>
            <div className="bg-slate-50/50 p-2 rounded-xl border border-slate-150">
              <div className="text-xs font-semibold text-slate-500">Neu</div>
              <div className="text-sm font-bold text-slate-600">{stats.neutralCount}</div>
              <div className="text-[10px] text-slate-500">{stats.neutralPercentage}%</div>
            </div>
            <div className="bg-slate-50/50 p-2 rounded-xl border border-slate-150">
              <div className="text-xs font-semibold text-slate-500">Neg</div>
              <div className="text-sm font-bold text-red-500">{stats.negativeCount}</div>
              <div className="text-[10px] text-slate-500">{stats.negativePercentage}%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
