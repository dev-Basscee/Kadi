'use client';

import { useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import { MatchCard } from '@/components/MatchCard';
import { DeepDiveModal } from '@/components/DeepDiveModal';
import { SlipConstructor } from '@/components/SlipConstructor';
import { AdBanner } from '@/components/AdBanner';
import { LiveScoreTicker } from '@/components/LiveScoreTicker';
import { mockMatches, Match } from '@/lib/mockData';

export default function Home() {
  const [selectedSport, setSelectedSport] = useState('all');
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [watchlistMatches, setWatchlistMatches] = useState<Match[]>([]);

  // Filter matches by sport
  const filteredMatches = useMemo(() => {
    if (selectedSport === 'all') {
      return mockMatches;
    }
    return mockMatches.filter((m) => m.sport === selectedSport);
  }, [selectedSport]);

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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Live Score Ticker */}
        <LiveScoreTicker matches={mockMatches} />
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Section Title */}
            <div className="mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
                Today&apos;s Predictions
              </h1>
              <p className="text-muted-foreground">
                {filteredMatches.length} matches with AI-powered predictions
              </p>
            </div>

            {/* Matches Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <div className="bg-card border border-primary/20 rounded-xl p-12 text-center">
                <p className="text-lg text-muted-foreground font-medium">
                  No matches found for the selected sport
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Try selecting a different sport from the header menu
                </p>
              </div>
            )}
          </div>

          {/* Right Sidebar - Slip Constructor */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <SlipConstructor
                selectedMatches={watchlistMatches}
                onRemove={removeFromWatchlist}
                onShare={handleShare}
              />

              {/* Additional Info Box */}
              <div className="mt-6 bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 rounded-xl p-4">
                <h4 className="text-sm font-bold text-foreground mb-3">How It Works</h4>
                <ul className="text-xs text-muted-foreground space-y-2">
                  <li className="flex gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>Click any match for deep analysis</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>Add predictions to watchlist</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>Calculate parlay odds instantly</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>Share your watchlist with friends</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
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
