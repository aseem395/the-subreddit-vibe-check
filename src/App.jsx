import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SubredditSelector from './components/SubredditSelector';
import MetricsCards from './components/MetricsCards';
import SentimentCharts from './components/SentimentCharts';
import PostsFeed from './components/PostsFeed';
import { analyzeRedditPosts, getMockPostsForSubreddit } from './utils/sentimentEngine';
import { 
  AlertCircle, 
  RotateCw, 
  TrendingUp, 
  Compass,
  Info
} from 'lucide-react';

export default function App() {
  const [subreddit, setSubreddit] = useState('technology');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [usingMockData, setUsingMockData] = useState(false);
  const [analyzedData, setAnalyzedData] = useState({
    analyzedPosts: [],
    stats: {
      overallVibe: 'Neutral',
      averageScore: 0,
      positiveCount: 0,
      neutralCount: 0,
      negativeCount: 0,
      positivePercentage: 0,
      neutralPercentage: 0,
      negativePercentage: 0,
      totalCount: 0
    }
  });

  const fetchAndAnalyze = async (subName) => {
    setLoading(true);
    setError(null);
    setUsingMockData(false);
    try {
      // Fetch from Reddit endpoint
      const response = await fetch(`https://www.reddit.com/r/${subName}/hot.json?limit=50`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Subreddit r/${subName} was not found. Please check spelling.`);
        } else if (response.status === 403) {
          throw new Error(`Subreddit r/${subName} is private. We cannot analyze private subreddits.`);
        } else if (response.status === 429) {
          throw new Error('Reddit is currently rate-limiting public requests. Please try again shortly.');
        } else {
          throw new Error(`Reddit API returned error status code: ${response.status}`);
        }
      }

      const json = await response.json();

      // Check if redirect or error in payload
      if (json.error) {
        if (json.reason === 'private') {
          throw new Error(`r/${subName} is a private subreddit.`);
        }
        throw new Error(json.message || `Failed to fetch r/${subName}.`);
      }

      const posts = json.data?.children || [];
      if (posts.length === 0) {
        throw new Error(`r/${subName} has no active posts to analyze.`);
      }

      // Analyze
      const result = analyzeRedditPosts(posts);
      setAnalyzedData(result);
      setUsingMockData(false);
    } catch (err) {
      console.warn('Reddit API failed or CORS blocked. Falling back to mock data.', err);
      
      // Fallback to simulated data
      const mockPosts = getMockPostsForSubreddit(subName);
      const result = analyzeRedditPosts(mockPosts);
      setAnalyzedData(result);
      setUsingMockData(true);
    } finally {
      setLoading(false);
    }
  };

  // Trigger analysis on load and when subreddit changes
  useEffect(() => {
    fetchAndAnalyze(subreddit);
  }, [subreddit]);

  const handleSelectSubreddit = (newSub) => {
    setSubreddit(newSub);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-600/30 selection:text-indigo-200 antialiased">
      {/* Header */}
      <Header />

      {/* Main Body */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-16 space-y-12">
        
        {/* Hero Section */}
        <section className="text-center space-y-5 py-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 text-xs font-semibold tracking-wide uppercase select-none">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Reddit Mood Analytics</span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] font-display">
            Check the Vibe of Any{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Subreddit
            </span>
          </h2>

          <p className="text-sm md:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Enter a public subreddit name to fetch the top hot posts. 
            We'll calculate sentiment scores using the AFINN lexicon, show overall vibes, and map keywords.
          </p>

          <div className="pt-4">
            <SubredditSelector 
              currentSubreddit={subreddit} 
              onSelectSubreddit={handleSelectSubreddit} 
              isLoading={loading}
            />
          </div>
        </section>

        {/* CORS/Mock Data Banner */}
        {usingMockData && !loading && (
          <div className="max-w-7xl mx-auto px-6 py-3.5 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center gap-3 text-xs md:text-sm text-amber-400/90 font-medium">
            <Info className="w-5 h-5 flex-shrink-0 text-amber-400 animate-pulse" />
            <p className="leading-relaxed">
              <strong>Simulated Data Active:</strong> Direct requests to Reddit's API were blocked by browser security (CORS) or network filters. We've loaded a simulated live feed for <code className="bg-amber-500/15 text-amber-350 border border-amber-500/20 px-1.5 py-0.5 rounded font-mono font-bold">r/{subreddit}</code> to keep the interactive charts and aggregates functional.
            </p>
          </div>
        )}

        {/* Dashboard Panels */}
        {loading ? (
          /* Loading State skeleton */
          <section className="space-y-8 py-12 max-w-7xl mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="relative flex items-center justify-center">
                <RotateCw className="w-10 h-10 text-indigo-500 animate-spin" />
                <div className="absolute inset-0 bg-indigo-500/10 blur-xl rounded-full scale-150" />
              </div>
              <p className="text-sm text-slate-400 font-medium animate-pulse">
                Fetching latest posts from r/{subreddit} and analyzing titles...
              </p>
            </div>
            {/* Skeletal Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-44 rounded-3xl bg-slate-900/40 border border-slate-900/80 animate-pulse" />
              ))}
            </div>
          </section>
        ) : error ? (
          /* Error State Card */
          <section className="max-w-2xl mx-auto py-8">
            <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-3xl flex flex-col items-center text-center space-y-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-red-500/10 to-transparent blur-2xl rounded-full" />
              
              <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400">
                <AlertCircle className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-200 font-display">
                  Vibe Analysis Interrupted
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {error}
                </p>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button 
                  onClick={() => fetchAndAnalyze(subreddit)} 
                  className="px-4.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-250 font-semibold text-xs rounded-xl border border-slate-800/85 transition-colors cursor-pointer"
                >
                  Retry Request
                </button>
                <button 
                  onClick={() => handleSelectSubreddit('technology')} 
                  className="px-4.5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Try r/technology
                </button>
              </div>
            </div>
          </section>
        ) : (
          /* Dashboard Layout */
          <section className="space-y-8 animate-fadeIn duration-500">
            {/* Top Cards Row */}
            <MetricsCards stats={analyzedData.stats} />

            {/* Split Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 max-w-7xl mx-auto items-start">
              {/* Left Column: Visual Distribution (Recharts) */}
              <div className="lg:col-span-2">
                <SentimentCharts stats={analyzedData.stats} />
                
                {/* Additional Insights Card */}
                <div className="glass-panel rounded-3xl p-6 mt-6 relative overflow-hidden">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-indigo-500/15 text-indigo-400 rounded-xl">
                      <Compass className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Vibe Check Insights
                      </h4>
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                        Currently tracking <strong>r/{subreddit}</strong>. Sentiment ratings represent title-based scores matching key emotive terms in the standard AFINN list. 
                      </p>
                      <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                        Highly descriptive titles with intense vocabulary (e.g. "incredible", "awful", "scam", "breakthrough") score higher magnitude values.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Detailed Analyzed Threads Feed */}
              <div className="lg:col-span-3">
                <PostsFeed posts={analyzedData.analyzedPosts} />
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-950/80 bg-slate-950/90 py-8 px-6 mt-16 text-center text-xs text-slate-600 font-medium">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Subreddit Vibe Check. All data sourced live from Reddit RSS/JSON feeds.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 transition-colors">Client-Side Scrape</span>
            <span className="text-slate-800">|</span>
            <span className="hover:text-slate-400 transition-colors">Lexicon Matching</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
