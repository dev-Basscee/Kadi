'use client';

import { useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import { MatchCard } from '@/components/MatchCard';
import { DeepDiveModal } from '@/components/DeepDiveModal';
import { AdBanner } from '@/components/AdBanner';
import { LiveScoreTicker } from '@/components/LiveScoreTicker';
import { Match } from '@/lib/mockData';
import { useMatches } from '@/lib/api';

export default function Home() {
  const [selectedSport, setSelectedSport] = useState('all');
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [watchlistMatches, setWatchlistMatches] = useState<Match[]>([]);

  // Fetch matches from Go backend (falls back to mockData automatically if API fails)
  const { data: matches, isLoading } = useMatches(selectedSport);
  const filteredMatches = matches || [];

  // Toggle watchlist
  const toggleWatchlist = (match: Match) => {
    const exists = watchlistMatches.find((m) => m.id === match.id);
    if (exists) {
      setWatchlistMatches(watchlistMatches.filter((m) => m.id !== match.id));
    } else {
      setWatchlistMatches([...watchlistMatches, match]);
      setSelectedMatch(null); // Close modal after adding
    }
  };

  const removeFromWatchlist = (matchId: string) => {
    setWatchlistMatches(watchlistMatches.filter((m) => m.id !== matchId));
  };

  const handleShare = () => {
    const matchesStr = watchlistMatches.map((m) => `${m.homeTeam} vs ${m.awayTeam}`).join(', ');
    alert(`Share your watchlist:\n${matchesStr}\n\nTotal Odds: ${watchlistMatches.reduce((a, m) => a * m.odds, 1).toFixed(2)}`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header selectedSport={selectedSport} onSportChange={setSelectedSport} />

      {/* Top Ad Banner */}
      <AdBanner position="top" />

      <main className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8">
        {/* Live Score Ticker */}
        {matches && matches.length > 0 && <LiveScoreTicker matches={matches} />}
        
        <div className="space-y-6 sm:space-y-8">
            {/* Section Title */}
            <div className="mb-6 sm:mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2">
                  Today&apos;s Predictions
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground">
                  {isLoading ? 'Loading matches...' : `${filteredMatches.length} matches with AI-powered predictions`}
                </p>
              </div>
              {isLoading && (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              )}
            </div>

          {/* Matches Grid - Responsive across all screen sizes */}
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 xs:gap-3 sm:gap-3 md:gap-4 lg:gap-6">
              {filteredMatches.map((match, index) => (
                <div key={match.id}>
                  {/* Inline Ad after every 5 matches */}
                  {index > 0 && index % 5 === 0 && <AdBanner position="inline" />}

                  <MatchCard
                    match={match}
                    onClick={() => setSelectedMatch(match)}
                    isPremium={watchlistMatches.length > 0}
                  />
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredMatches.length === 0 && (
              <div className="bg-card border border-primary/20 rounded-lg sm:rounded-xl p-8 sm:p-12 text-center">
                <p className="text-base sm:text-lg text-muted-foreground font-medium">
                  No matches found for the selected sport
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                  Try selecting a different sport from the header menu
                </p>
              </div>
          )}
        </div>
      </main>

      {/* Deep Dive Modal */}
      {selectedMatch && (
        <DeepDiveModal
          match={selectedMatch}
          onClose={() => setSelectedMatch(null)}
          onAddToWatchlist={() => toggleWatchlist(selectedMatch)}
        />
      )}

      {/* Floating Watchlist / My Picks Panel */}
      {watchlistMatches.length > 0 && (
        <div className="fixed bottom-4 right-4 z-40 w-80 bg-card border border-primary/30 rounded-xl shadow-2xl shadow-primary/20 overflow-hidden flex flex-col">
          <div className="bg-primary/10 border-b border-primary/20 p-3 flex justify-between items-center">
            <h3 className="font-bold text-foreground text-sm">My Analyzed Picks</h3>
            <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full">
              {watchlistMatches.length}
            </span>
          </div>
          
          <div className="max-h-60 overflow-y-auto p-2 space-y-2">
            {watchlistMatches.map(match => (
              <div key={match.id} className="flex items-center justify-between bg-background border border-primary/10 p-2 rounded-lg text-xs">
                <div className="flex-1 truncate pr-2">
                  <p className="font-semibold text-foreground truncate">{match.homeTeam} vs {match.awayTeam}</p>
                  <p className="text-muted-foreground mt-0.5">Odds: <span className="text-primary font-bold">{match.odds.toFixed(2)}</span></p>
                </div>
                <button 
                  onClick={() => removeFromWatchlist(match.id)}
                  className="text-muted-foreground hover:text-destructive transition-colors p-1"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="bg-background border-t border-primary/20 p-3 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground font-medium">Total Odds:</span>
              <span className="text-primary font-black text-lg">
                {watchlistMatches.reduce((a, m) => a * m.odds, 1).toFixed(2)}
              </span>
            </div>
            <button
              onClick={handleShare}
              className="w-full bg-primary text-primary-foreground font-bold py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Export Picks
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
