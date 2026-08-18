import React, { useState, useMemo } from 'react';
import { 
  ArrowUp, 
  MessageSquare, 
  ExternalLink, 
  Search, 
  SlidersHorizontal,
  Sparkles
} from 'lucide-react';

export default function PostsFeed({ posts }) {
  const [filterText, setFilterText] = useState('');
  const [sortBy, setSortBy] = useState('default'); // 'default', 'upvotes', 'sentiment-desc', 'sentiment-asc'

  // Filter and sort posts
  const filteredAndSortedPosts = useMemo(() => {
    let result = [...posts];

    // Filter
    if (filterText.trim()) {
      const query = filterText.toLowerCase();
      result = result.filter(post => 
        post.title.toLowerCase().includes(query) || 
        post.author.toLowerCase().includes(query)
      );
    }

    // Sort
    if (sortBy === 'upvotes') {
      result.sort((a, b) => b.score - a.score);
    } else if (sortBy === 'sentiment-desc') {
      result.sort((a, b) => b.sentimentScore - a.sentimentScore);
    } else if (sortBy === 'sentiment-asc') {
      result.sort((a, b) => a.sentimentScore - b.sentimentScore);
    }

    return result;
  }, [posts, filterText, sortBy]);

  const getSentimentPillClass = (type) => {
    switch (type) {
      case 'positive':
        return 'bg-emerald-50 border-emerald-250/50 text-emerald-700';
      case 'negative':
        return 'bg-red-50 border-red-250/50 text-red-700';
      default:
        return 'bg-slate-50 border-slate-200 text-slate-550';
    }
  };

  const formatKarma = (num) => {
    if (num >= 100000) {
      return (num / 1000).toFixed(0) + 'k';
    }
    if (num >= 10000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num;
  };

  return (
    <div className="glass-panel rounded-3xl p-6 w-full flex flex-col max-w-7xl mx-auto h-[680px]">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-5">
        <div>
          <h3 className="text-base font-bold text-slate-800 font-display flex items-center gap-2">
            Analyzed Posts Feed 
            <span className="text-xs bg-slate-50 px-2.5 py-1 rounded-full text-indigo-650 font-semibold border border-slate-200/50">
              {filteredAndSortedPosts.length} matches
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Browse thread sentiment scores, upvotes, and Lexicon keyword matches.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Live Search */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Filter by title/author..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 text-xs rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-indigo-500 w-full sm:w-56 transition-colors"
            />
          </div>

          {/* Sort Menu */}
          <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-450 mr-2" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-slate-700 text-xs focus:outline-none cursor-pointer pr-1"
            >
              <option value="default" className="bg-white text-slate-700">Default (Hot)</option>
              <option value="upvotes" className="bg-white text-slate-700">Most Upvotes</option>
              <option value="sentiment-desc" className="bg-white text-slate-700">Highest Vibe</option>
              <option value="sentiment-asc" className="bg-white text-slate-700">Lowest Vibe</option>
            </select>
          </div>
        </div>
      </div>

      {/* Feed List Container */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-3.5 custom-scrollbar">
        {filteredAndSortedPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-2">
            <p className="text-sm font-medium">No threads match your query.</p>
            <button 
              onClick={() => setFilterText('')}
              className="text-xs text-indigo-650 hover:text-indigo-550 underline cursor-pointer"
            >
              Clear filter
            </button>
          </div>
        ) : (
          filteredAndSortedPosts.map((post) => {
            const scoreLabel = post.sentimentScore > 0 ? `+${post.sentimentScore}` : post.sentimentScore;
            const positiveWords = post.sentimentResult.positive || [];
            const negativeWords = post.sentimentResult.negative || [];
            const hasMatches = positiveWords.length > 0 || negativeWords.length > 0;

            return (
              <div 
                key={post.id}
                className="bg-slate-50/30 border border-slate-150/65 hover:border-indigo-150 hover:bg-slate-50/70 p-4 rounded-2xl flex gap-4 transition-all relative group shadow-sm shadow-slate-100/10"
              >
                {/* Sentiment Score Left Badging Indicator Bar */}
                <div 
                  className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl transition-colors ${
                    post.sentimentType === 'positive' ? 'bg-emerald-500' :
                    post.sentimentType === 'negative' ? 'bg-red-500' : 'bg-slate-300'
                  }`} 
                />

                {/* Main Content Area */}
                <div className="flex-1 min-w-0 pl-1 space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <a 
                      href={post.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="font-semibold text-sm md:text-base text-slate-800 hover:text-indigo-600 transition-colors line-clamp-2 leading-relaxed flex items-center gap-1.5 cursor-pointer font-sans"
                    >
                      {post.title}
                      <ExternalLink className="w-3.5 h-3.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400" />
                    </a>

                    {/* Sentiment Score Pill */}
                    <div className={`px-2.5 py-1 text-xs font-bold rounded-lg border flex-shrink-0 font-mono tracking-wider ${getSentimentPillClass(post.sentimentType)}`}>
                      {scoreLabel}
                    </div>
                  </div>

                  {/* Metadata & Stats Row */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500 font-medium">
                    <span>
                      by <span className="text-slate-600 font-semibold">u/{post.author}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <ArrowUp className="w-3.5 h-3.5 text-orange-550" />
                      <span className="text-slate-650">{formatKarma(post.score)}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5 text-indigo-500" />
                      <span className="text-slate-655">{post.numComments} comments</span>
                    </span>
                  </div>

                  {/* Lexicon Keyword Matches */}
                  {hasMatches && (
                    <div className="flex flex-wrap items-center gap-2 pt-2 text-[11px] border-t border-slate-150/60">
                      <span className="text-[10px] text-slate-450 font-semibold uppercase flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-indigo-650" />
                        Matches:
                      </span>
                      {positiveWords.map((word, wIdx) => (
                        <span 
                          key={`pos-${wIdx}`} 
                          className="bg-emerald-50 text-emerald-700 border border-emerald-150 px-2 py-0.5 rounded-md font-semibold"
                        >
                          {word} (+val)
                        </span>
                      ))}
                      {negativeWords.map((word, wIdx) => (
                        <span 
                          key={`neg-${wIdx}`} 
                          className="bg-red-50 text-red-700 border border-red-150 px-2 py-0.5 rounded-md font-semibold"
                        >
                          {word} (-val)
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
