import Sentiment from 'sentiment';

const sentiment = new Sentiment();

/**
 * Analyzes a list of Reddit posts and returns the posts with sentiment metadata
 * along with computed aggregate metrics.
 * 
 * @param {Array} posts - Raw posts array from Reddit API
 * @returns {Object} { analyzedPosts, stats }
 */
export function analyzeRedditPosts(posts) {
  if (!posts || posts.length === 0) {
    return {
      analyzedPosts: [],
      stats: {
        overallVibe: 'No Data',
        averageScore: 0,
        positiveCount: 0,
        neutralCount: 0,
        negativeCount: 0,
        positivePercentage: 0,
        neutralPercentage: 0,
        negativePercentage: 0,
        totalCount: 0
      }
    };
  }

  let totalScore = 0;
  let positiveCount = 0;
  let neutralCount = 0;
  let negativeCount = 0;

  const analyzedPosts = posts.map(post => {
    const title = post.data.title || '';
    const result = sentiment.analyze(title);
    const score = result.score;

    let type = 'neutral';
    if (score > 0) {
      type = 'positive';
      positiveCount++;
    } else if (score < 0) {
      type = 'negative';
      negativeCount++;
    } else {
      neutralCount++;
    }

    totalScore += score;

    return {
      id: post.data.id,
      title: title,
      url: `https://www.reddit.com${post.data.permalink}`,
      author: post.data.author,
      score: post.data.score, // Upvotes
      numComments: post.data.num_comments,
      sentimentScore: score,
      sentimentType: type,
      sentimentResult: result, // Save full details like matched words
      createdUtc: post.data.created_utc
    };
  });

  const totalPosts = posts.length;
  const averageScore = Number((totalScore / totalPosts).toFixed(2));
  
  const positivePercentage = Number(((positiveCount / totalPosts) * 100).toFixed(1));
  const neutralPercentage = Number(((neutralCount / totalPosts) * 100).toFixed(1));
  const negativePercentage = Number(((negativeCount / totalPosts) * 100).toFixed(1));

  // Determine overall vibe classification
  let overallVibe = 'Balanced / Neutral';
  let vibeColor = 'text-slate-400';
  let vibeBg = 'bg-slate-500/10 border-slate-500/20';
  let vibeIcon = 'neutral';

  if (averageScore > 0.8) {
    overallVibe = 'Extremely Positive & Joyful';
    vibeColor = 'text-emerald-400';
    vibeBg = 'bg-emerald-500/10 border-emerald-500/20';
    vibeIcon = 'laughing';
  } else if (averageScore > 0.15) {
    overallVibe = 'Optimistic / Positive';
    vibeColor = 'text-green-400';
    vibeBg = 'bg-green-500/10 border-green-500/20';
    vibeIcon = 'smile';
  } else if (averageScore < -0.8) {
    overallVibe = 'Highly Hostile & Negative';
    vibeColor = 'text-red-400';
    vibeBg = 'bg-red-500/10 border-red-500/20';
    vibeIcon = 'angry';
  } else if (averageScore < -0.15) {
    overallVibe = 'Critical / Skeptical';
    vibeColor = 'text-rose-400';
    vibeBg = 'bg-rose-500/10 border-rose-500/20';
    vibeIcon = 'frown';
  }

  return {
    analyzedPosts,
    stats: {
      overallVibe,
      vibeColor,
      vibeBg,
      vibeIcon,
      averageScore,
      positiveCount,
      neutralCount,
      negativeCount,
      positivePercentage,
      neutralPercentage,
      negativePercentage,
      totalCount: totalPosts
    }
  };
}

/**
 * Generates custom mock posts for a subreddit when the Reddit API is blocked.
 * 
 * @param {string} subName - Subreddit name
 * @returns {Array} List of mock posts matching Reddit's payload shape
 */
export function getMockPostsForSubreddit(subName) {
  const normalized = subName.toLowerCase();
  
  const templates = {
    technology: [
      { title: "Incredible breakthrough in quantum computing promises massive processing speedups", score: 12500, author: "quantum_coder", num_comments: 412 },
      { title: "Is artificial intelligence a massive bubble? Experts are highly skeptical", score: 8400, author: "tech_observer", num_comments: 892 },
      { title: "New solid-state battery technology could double electric vehicle range", score: 15300, author: "battery_guy", num_comments: 341 },
      { title: "Major tech company faces a devastating antitrust lawsuit over monopolistic behavior", score: 9200, author: "legal_eagle", num_comments: 650 },
      { title: "I built a new open-source web framework and it is absolutely amazing!", score: 4100, author: "dev_creator", num_comments: 154 },
      { title: "Is anyone else feeling completely burned out by the current tech job market?", score: 7300, author: "jobseeker_99", num_comments: 1105 },
      { title: "The rise of decentralized social media: A hopeful future or a chaotic failure?", score: 3200, author: "web3_believer", num_comments: 290 },
      { title: "Microsoft launches new security tool to combat sophisticated cyberattacks", score: 5400, author: "sysadmin_steve", num_comments: 120 },
      { title: "Why simple, low-tech devices are making a surprising comeback among teens", score: 11200, author: "digital_detox", num_comments: 732 },
      { title: "Warning: Critical vulnerability discovered in popular open-source library", score: 14800, author: "security_sheriff", num_comments: 489 }
    ],
    wallstreetbets: [
      { title: "To the moon! 🚀 Just put my entire life savings into GME calls", score: 45000, author: "diamond_hands_99", num_comments: 5420 },
      { title: "Absolute loss porn: Down 98% on weekly options. I am completely ruined.", score: 32100, author: "margin_call_victim", num_comments: 3105 },
      { title: "My wife's boyfriend let me buy more shares. bullish trend is solid!", score: 18200, author: "ape_believer", num_comments: 980 },
      { title: "Inflation numbers are terrible. Market is going to crash horribly tomorrow.", score: 15400, author: "doom_bear", num_comments: 2314 },
      { title: "Huge gains! Turned $500 into $80,000 this week. Absolutely insane luck!", score: 52000, author: "options_king", num_comments: 4120 },
      { title: "Is this the bottom or are we heading into a devastating recession?", score: 9800, author: "clueless_trader", num_comments: 1450 },
      { title: "I am officially bankrupt. It was an honor losing money with you apes.", score: 28400, author: "guaranteed_loss", num_comments: 2201 },
      { title: "Why the tech rebound is going to be incredibly fast and profitable", score: 11500, author: "bull_runner", num_comments: 1040 }
    ],
    gaming: [
      { title: "This new open-world RPG is an absolute masterpiece. I am in love!", score: 28500, author: "gamer_guru", num_comments: 3120 },
      { title: "The microtransactions in this game are incredibly greedy and ruining the fun", score: 42000, author: "anti_pay_to_win", num_comments: 6540 },
      { title: "Check out this beautiful fan art I drew of the main character!", score: 19800, author: "pixel_artist", num_comments: 410 },
      { title: "Is anyone else extremely disappointed by the latest expansion pack?", score: 15400, author: "disappointed_gamer", num_comments: 2190 },
      { title: "I finally beat the hardest boss in the game after 40 hours of trying!", score: 11200, author: "dark_souls_fan", num_comments: 890 },
      { title: "The developers just released a massive patch that fixed all critical bugs", score: 8700, author: "patch_notes_reader", num_comments: 450 },
      { title: "We need to talk about how toxic this community has become lately. It is awful.", score: 22500, author: "friendly_player", num_comments: 3980 },
      { title: "Remember when games were sold complete without constant internet connection?", score: 35600, author: "retro_nostalgia", num_comments: 1870 }
    ],
    science: [
      { title: "Researchers discover a promising new compound that selectively kills cancer cells", score: 34000, author: "biology_nerd", num_comments: 1450 },
      { title: "NASA's space telescope captures an incredibly detailed image of a distant galaxy", score: 48000, author: "astro_nut", num_comments: 980 },
      { title: "Study shows that rising global temperatures are causing severe habitat destruction", score: 27500, author: "climate_watch", num_comments: 1890 },
      { title: "Scientists successfully teleport quantum information across a metropolitan network", score: 19500, author: "physics_phd", num_comments: 540 },
      { title: "A new study casts doubt on previous claims of life on Venus: Results are inconclusive", score: 12400, author: "skeptic_scientist", num_comments: 380 },
      { title: "New archaeological discovery reveals a highly advanced ancient civilization in the Amazon", score: 31200, author: "history_buff", num_comments: 1120 },
      { title: "Is the peer-review process broken? A critical analysis of modern publishing bias", score: 8900, author: "academia_insider", num_comments: 670 }
    ],
    news: [
      { title: "Government announces a major initiative to combat rising economic inequality", score: 22400, author: "news_junkie", num_comments: 4890 },
      { title: "Breaking: Heavy floods trigger a devastating emergency response in the southern region", score: 38500, author: "disaster_alert", num_comments: 3120 },
      { title: "Diplomatic peace talks end with a hopeful agreement to reduce border tensions", score: 19800, author: "global_relations", num_comments: 950 },
      { title: "Investigation exposes a shocking corruption scandal involving high-ranking officials", score: 45000, author: "truth_seeker", num_comments: 5410 },
      { title: "Healthcare costs continue to rise rapidly, causing severe stress for middle-class families", score: 29400, author: "health_reporter", num_comments: 3670 },
      { title: "City council approves a beautiful new green park project for local residents", score: 8500, author: "local_voice", num_comments: 240 }
    ]
  };

  const defaultTemplates = [
    { title: "Welcome to the r/{sub} community! Please read the guidelines.", score: 1200, author: "moderator_bot", num_comments: 150 },
    { title: "This community r/{sub} is absolutely amazing and helpful!", score: 4500, author: "happy_member", num_comments: 230 },
    { title: "I am feeling extremely frustrated with the recent drama in r/{sub}.", score: 3100, author: "concerned_citizen", num_comments: 540 },
    { title: "What is your honest opinion about the future of r/{sub}?", score: 980, author: "curious_mind", num_comments: 420 },
    { title: "A list of helpful resources for anyone new to r/{sub}", score: 2200, author: "resource_curator", num_comments: 89 },
    { title: "Avoid this terrible scam circulating in r/{sub} right now!", score: 6200, author: "security_alert", num_comments: 310 },
    { title: "This is hands down the best post on r/{sub} I have ever seen.", score: 8900, author: "top_contributor", num_comments: 620 },
    { title: "Can we stop posting such negative and hostile rants on r/{sub}?", score: 5400, author: "peace_maker", num_comments: 890 },
    { title: "An update regarding upcoming community events in r/{sub}", score: 1500, author: "mod_team", num_comments: 95 },
    { title: "This is a neutral announcement regarding server maintenance schedule.", score: 800, author: "bot_updates", num_comments: 45 }
  ];

  const subTemplates = templates[normalized] || defaultTemplates.map(t => ({
    ...t,
    title: t.title.replace(/{sub}/g, subName)
  }));

  return subTemplates.map((item, index) => ({
    data: {
      id: `mock-${normalized}-${index}`,
      title: item.title,
      permalink: `/r/${subName}/comments/mock-${index}/`,
      author: item.author,
      score: item.score,
      num_comments: item.num_comments,
      created_utc: Date.now() / 1000 - index * 3600
    }
  }));
}
