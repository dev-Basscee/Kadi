'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Grid3x3, List, X, Share2, Download, Trash2, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockMatches, Match } from '@/lib/mockData';

export default function WatchlistPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [watchlistMatches, setWatchlistMatches] = useState<Match[]>(mockMatches.slice(0, 4));
  const [sortBy, setSortBy] = useState<'confidence' | 'odds' | 'time'>('confidence');

  const sortedMatches = [...watchlistMatches].sort((a, b) => {
    if (sortBy === 'confidence') return b.prediction.confidence - a.prediction.confidence;
    if (sortBy === 'odds') return b.odds - a.odds;
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  const totalOdds = watchlistMatches.reduce((acc, m) => acc * m.odds, 1);
  const totalPotentialReturn = totalOdds.toFixed(2);

  const removeMatch = (matchId: string) => {
    setWatchlistMatches(watchlistMatches.filter((m) => m.id !== matchId));
  };

  const clearAll = () => {
    setWatchlistMatches([]);
  };

  const handleShare = () => {
    const matchesStr = watchlistMatches.map((m) => `${m.homeTeam} vs ${m.awayTeam}`).join(', ');
    alert(`Share: ${matchesStr}\nTotal Odds: ${totalPotentialReturn}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-primary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-6">
            <Link
              href="/"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft size={16} />
              <span className="text-sm">Back to Dashboard</span>
            </Link>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground">My Watchlist</h1>
              <p className="text-muted-foreground mt-2">
                {watchlistMatches.length} matches • Total odds: <span className="text-primary font-bold">{totalPotentialReturn}</span>
              </p>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-card border border-primary/20 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-primary/20 text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Grid3x3 size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'list'
                      ? 'bg-primary/20 text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {watchlistMatches.length === 0 ? (
          <div className="bg-card border border-primary/20 rounded-xl p-12 text-center">
            <TrendingUp className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
            <h2 className="text-xl font-bold text-foreground mb-2">Your watchlist is empty</h2>
            <p className="text-muted-foreground mb-6">Add matches to get started with your predictions</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              <ArrowLeft size={16} />
              Browse Matches
            </Link>
          </div>
        ) : (
          <>
            {/* Sorting & Actions */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'confidence' | 'odds' | 'time')}
                  className="px-4 py-2 bg-card border border-primary/20 text-foreground rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="confidence">Sort by Confidence</option>
                  <option value="odds">Sort by Odds</option>
                  <option value="time">Sort by Time</option>
                </select>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  onClick={handleShare}
                  className="bg-secondary/20 hover:bg-secondary/30 text-secondary border border-secondary/30 gap-2"
                  size="sm"
                >
                  <Share2 size={16} />
                  <span className="hidden sm:inline">Share</span>
                </Button>
                <Button
                  onClick={clearAll}
                  className="bg-destructive/20 hover:bg-destructive/30 text-destructive border border-destructive/30 gap-2"
                  size="sm"
                >
                  <Trash2 size={16} />
                  <span className="hidden sm:inline">Clear All</span>
                </Button>
              </div>
            </div>

            {/* Grid/List View */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedMatches.map((match) => (
                  <div key={match.id} className="bg-card border border-primary/20 rounded-lg p-6 hover:border-primary/40 transition-colors group">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase">{match.league}</p>
                        <p className="text-xs text-muted-foreground">{match.time}</p>
                      </div>
                      <button
                        onClick={() => removeMatch(match.id)}
                        className="p-2 rounded-lg bg-destructive/10 hover:bg-destructive/20 text-destructive opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-foreground mb-2">
                        {match.homeTeam} vs {match.awayTeam}
                      </h3>
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                          match.prediction.color === 'green' ? 'bg-primary/20 text-primary' :
                          match.prediction.color === 'yellow' ? 'bg-accent/20 text-accent' :
                          'bg-destructive/20 text-destructive'
                        }`}>
                          {match.prediction.result.toUpperCase()}
                        </span>
                        <span className="text-xs font-bold text-secondary">{match.prediction.confidence}%</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-t border-primary/10 pt-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Odds</p>
                        <p className="text-lg font-bold text-primary">{match.odds.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Expected</p>
                        <p className="text-lg font-bold text-secondary">${(100 * match.odds).toFixed(0)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {sortedMatches.map((match) => (
                  <div key={match.id} className="bg-card border border-primary/20 rounded-lg p-6 flex items-center justify-between hover:border-primary/40 transition-colors group">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <p className="text-sm font-semibold text-muted-foreground uppercase">{match.league}</p>
                        <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                          match.prediction.color === 'green' ? 'bg-primary/20 text-primary' :
                          match.prediction.color === 'yellow' ? 'bg-accent/20 text-accent' :
                          'bg-destructive/20 text-destructive'
                        }`}>
                          {match.prediction.result.toUpperCase()}
                        </span>
                        <span className="text-xs font-bold text-secondary">{match.prediction.confidence}%</span>
                      </div>
                      <h3 className="text-lg font-bold text-foreground">
                        {match.homeTeam} vs {match.awayTeam}
                      </h3>
                    </div>

                    <div className="flex items-center gap-8">
                      <div>
                        <p className="text-xs text-muted-foreground text-right">Odds</p>
                        <p className="text-xl font-bold text-primary">{match.odds.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground text-right">Expected</p>
                        <p className="text-xl font-bold text-secondary">${(100 * match.odds).toFixed(0)}</p>
                      </div>
                      <button
                        onClick={() => removeMatch(match.id)}
                        className="p-2 rounded-lg bg-destructive/10 hover:bg-destructive/20 text-destructive opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Summary Card */}
            <div className="mt-12 bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 rounded-xl p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-2">Total Matches</p>
                  <p className="text-4xl font-bold text-foreground">{watchlistMatches.length}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-2">Combined Odds</p>
                  <p className="text-4xl font-bold text-primary">{totalPotentialReturn}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-2">$100 Bet Returns</p>
                  <p className="text-4xl font-bold text-secondary">${(100 * parseFloat(totalPotentialReturn)).toFixed(0)}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-2">Avg Confidence</p>
                  <p className="text-4xl font-bold text-accent">
                    {Math.round(watchlistMatches.reduce((a, m) => a + m.prediction.confidence, 0) / watchlistMatches.length)}%
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
