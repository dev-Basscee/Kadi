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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
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
          onClose={() => {
            // Show modal with option to add to watchlist
            toggleWatchlist(selectedMatch);
            setSelectedMatch(null);
          }}
        />
      )}
    </div>
  );
}
