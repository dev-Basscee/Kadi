'use client';

import { Header } from '@/components/Header';
import { useState } from 'react';
import { Heart, MessageCircle, Share2, TrendingUp, Trophy, Flame, Users, BarChart3 } from 'lucide-react';

interface Prediction {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  tier: 'expert' | 'verified' | 'community';
  match: string;
  prediction: string;
  confidence: number;
  odds: number;
  likes: number;
  comments: number;
  accuracy: number; // Win rate %
  followers: number;
  timestamp: string;
  liked?: boolean;
  unitSize?: number;
}

const mockPredictions: Prediction[] = [
  {
    id: '1',
    userId: 'user1',
    username: 'PredictionPro',
    avatar: 'PP',
    tier: 'expert',
    match: 'Manchester United vs Liverpool',
    prediction: 'Manchester United to Win',
    confidence: 85,
    odds: 1.95,
    likes: 342,
    comments: 47,
    accuracy: 78,
    followers: 15420,
    timestamp: '2 hours ago',
    unitSize: 2,
  },
  {
    id: '2',
    userId: 'user2',
    username: 'StatsNinja',
    avatar: 'SN',
    tier: 'verified',
    match: 'Manchester City vs Tottenham',
    prediction: 'Manchester City Win + Over 2.5 Goals',
    confidence: 72,
    odds: 2.10,
    likes: 215,
    comments: 28,
    accuracy: 71,
    followers: 8930,
    timestamp: '4 hours ago',
    unitSize: 1.5,
  },
  {
    id: '3',
    userId: 'user3',
    username: 'ArsenalAnalytics',
    avatar: 'AA',
    tier: 'community',
    match: 'Arsenal vs Chelsea',
    prediction: 'Draw - Tight Defensive Match',
    confidence: 65,
    odds: 3.40,
    likes: 89,
    comments: 12,
    accuracy: 62,
    followers: 2340,
    timestamp: '6 hours ago',
    unitSize: 1,
  },
  {
    id: '4',
    userId: 'user4',
    username: 'OddsHunter',
    avatar: 'OH',
    tier: 'expert',
    match: 'Liverpool vs Brighton',
    prediction: 'Liverpool Win + Under 2.5 Goals',
    confidence: 79,
    odds: 1.88,
    likes: 578,
    comments: 63,
    accuracy: 75,
    followers: 22100,
    timestamp: '8 hours ago',
    unitSize: 3,
  },
];

export default function CommunityPage() {
  const [predictions, setPredictions] = useState<Prediction[]>(mockPredictions);
  const [sortBy, setSortBy] = useState<'trending' | 'accuracy' | 'recent'>('trending');
  const [filterTier, setFilterTier] = useState<'all' | 'expert' | 'verified' | 'community'>('all');

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'expert':
        return { bg: 'bg-primary/20', text: 'text-primary', label: 'Expert', icon: Trophy };
      case 'verified':
        return { bg: 'bg-secondary/20', text: 'text-secondary', label: 'Verified', icon: TrendingUp };
      case 'community':
        return { bg: 'bg-accent/20', text: 'text-accent', label: 'Community', icon: Users };
      default:
        return { bg: 'bg-muted/20', text: 'text-muted-foreground', label: 'User', icon: Users };
    }
  };

  const sortedPredictions = [...predictions].sort((a, b) => {
    switch (sortBy) {
      case 'trending':
        return b.likes - a.likes;
      case 'accuracy':
        return b.accuracy - a.accuracy;
      case 'recent':
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      default:
        return 0;
    }
  });

  const filteredPredictions =
    filterTier === 'all' ? sortedPredictions : sortedPredictions.filter((p) => p.tier === filterTier);

  const toggleLike = (id: string) => {
    setPredictions((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p
      )
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header selectedSport="all" onSportChange={() => {}} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Community Predictions</h1>
          <p className="text-muted-foreground">Follow expert predictors, upvote predictions, and learn from the community</p>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* Sort Options */}
          <div className="flex gap-2">
            {(['trending', 'accuracy', 'recent'] as const).map((option) => (
              <button
                key={option}
                onClick={() => setSortBy(option)}
                className={`px-4 py-2 rounded-lg border transition-all font-semibold capitalize ${
                  sortBy === option
                    ? 'bg-primary/20 border-primary/50 text-primary'
                    : 'border-primary/20 text-muted-foreground hover:text-foreground'
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          {/* Filter by Tier */}
          <div className="flex gap-2 flex-wrap">
            {(['all', 'expert', 'verified', 'community'] as const).map((tier) => (
              <button
                key={tier}
                onClick={() => setFilterTier(tier)}
                className={`px-3 py-2 rounded-lg border text-xs font-semibold capitalize transition-all ${
                  filterTier === tier
                    ? 'bg-secondary/20 border-secondary/50 text-secondary'
                    : 'border-primary/20 text-muted-foreground hover:text-foreground'
                }`}
              >
                {tier === 'all' ? 'All Tiers' : tier}
              </button>
            ))}
          </div>
        </div>

        {/* Predictions Feed */}
        <div className="space-y-6">
          {filteredPredictions.map((pred) => {
            const tierBadge = getTierBadge(pred.tier);
            const TierIcon = tierBadge.icon;

            return (
              <div key={pred.id} className="bg-card border border-primary/20 rounded-xl p-6 hover:border-primary/40 transition-all">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-bold text-foreground">
                      {pred.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold text-foreground">{pred.username}</p>
                        <div className={`${tierBadge.bg} ${tierBadge.text} px-2 py-1 rounded-md flex items-center gap-1`}>
                          <TierIcon size={12} />
                          <span className="text-xs font-semibold">{tierBadge.label}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{pred.followers.toLocaleString()} followers</span>
                        <span className="text-primary font-semibold">{pred.accuracy}% accuracy</span>
                        <span>{pred.timestamp}</span>
                      </div>
                    </div>
                  </div>
                  <button className="text-primary hover:text-primary/80 font-semibold">Follow</button>
                </div>

                {/* Match & Prediction */}
                <div className="bg-card/50 border border-primary/10 rounded-lg p-4 mb-4">
                  <p className="text-sm text-muted-foreground mb-2">{pred.match}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-bold text-foreground">{pred.prediction}</p>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Confidence</p>
                        <p className="text-2xl font-bold text-primary">{pred.confidence}%</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Odds</p>
                        <p className="text-2xl font-bold text-secondary">{pred.odds.toFixed(2)}</p>
                      </div>
                      {pred.unitSize && (
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Units</p>
                          <p className="text-2xl font-bold text-accent">{pred.unitSize}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Track Record</p>
                    <p className="text-lg font-bold text-primary">{pred.accuracy}%</p>
                  </div>
                  <div className="bg-secondary/5 border border-secondary/20 rounded-lg p-3 text-center">
                    <p className="text-xs text-muted-foreground mb-1">ROI</p>
                    <p className="text-lg font-bold text-secondary">+{(pred.accuracy * 1.2).toFixed(1)}%</p>
                  </div>
                  <div className="bg-accent/5 border border-accent/20 rounded-lg p-3 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Followers</p>
                    <p className="text-lg font-bold text-accent">{(pred.followers / 1000).toFixed(1)}k</p>
                  </div>
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Bets Placed</p>
                    <p className="text-lg font-bold text-primary">{Math.round(pred.followers / 50)}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-primary/10">
                  <div className="flex items-center gap-6 text-sm">
                    <button
                      onClick={() => toggleLike(pred.id)}
                      className={`flex items-center gap-2 transition-colors ${
                        pred.liked ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Heart size={18} fill={pred.liked ? 'currentColor' : 'none'} />
                      <span>{pred.likes}</span>
                    </button>
                    <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                      <MessageCircle size={18} />
                      <span>{pred.comments}</span>
                    </button>
                    <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                      <Share2 size={18} />
                      <span>Share</span>
                    </button>
                  </div>
                  <button className="px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg font-semibold transition-colors">
                    Copy Bet
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Leaderboard Sidebar */}
        <div className="mt-12">
          <div className="bg-card border border-primary/20 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <Trophy size={24} className="text-primary" />
              <h2 className="text-2xl font-bold text-foreground">Top Predictors This Month</h2>
            </div>
            <div className="space-y-3">
              {[
                { rank: 1, name: 'OddsHunter', accuracy: 78, followers: 22100, roi: '+93.6%' },
                { rank: 2, name: 'PredictionPro', accuracy: 78, followers: 15420, roi: '+93.6%' },
                { rank: 3, name: 'StatsNinja', accuracy: 71, followers: 8930, roi: '+85.2%' },
              ].map((predictor) => (
                <div
                  key={predictor.rank}
                  className="flex items-center justify-between p-4 bg-card/50 border border-primary/10 rounded-lg hover:bg-card/80 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-bold text-sm text-foreground">
                      {predictor.rank}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{predictor.name}</p>
                      <p className="text-xs text-muted-foreground">{predictor.followers.toLocaleString()} followers</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-primary">{predictor.accuracy}%</p>
                    <p className="text-xs text-secondary font-semibold">{predictor.roi}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
