'use client';

import { Match } from '@/lib/mockData';
import { X, Trash2, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ExportShare } from '@/components/ExportShare';

interface SlipConstructorProps {
  selectedMatches: Match[];
  onRemove: (matchId: string) => void;
  onShare: () => void;
  className?: string;
}

export function SlipConstructor({
  selectedMatches,
  onRemove,
  onShare,
  className = '',
}: SlipConstructorProps) {
  if (selectedMatches.length === 0) {
    return (
      <div
        className={`bg-card border border-primary/20 rounded-xl p-6 text-center ${className}`}
      >
        <TrendingUp size={32} className="mx-auto text-muted-foreground mb-3 opacity-50" />
        <p className="text-sm text-muted-foreground font-medium">
          No matches selected. Click "Add to Watchlist" to get started.
        </p>
      </div>
    );
  }

  const totalOdds = selectedMatches.reduce((acc, match) => acc * match.odds, 1);

  return (
    <div className={`bg-card border border-primary/20 rounded-xl overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/20 to-secondary/20 border-b border-primary/30 px-6 py-4">
        <h3 className="text-lg font-bold text-foreground mb-2">Watchlist</h3>
        <p className="text-sm text-muted-foreground">
          {selectedMatches.length} match{selectedMatches.length !== 1 ? 'es' : ''} selected
        </p>
      </div>

      {/* Matches List */}
      <div className="max-h-[400px] overflow-y-auto">
        {selectedMatches.map((match, index) => (
          <div
            key={match.id}
            className="p-4 border-b border-primary/10 last:border-b-0 hover:bg-background/50 transition-colors"
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-mono text-secondary font-semibold">Match {index + 1}</p>
                <p className="text-sm font-semibold text-foreground truncate">
                  {match.homeTeam.split(' ').slice(0, 2).join(' ')} vs{' '}
                  {match.awayTeam.split(' ').slice(0, 2).join(' ')}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="inline-flex items-center gap-1 px-2 py-1 rounded bg-primary/20 border border-primary/30">
                    <span className="text-xs font-bold text-primary">
                      {match.prediction.confidence}%
                    </span>
                  </div>
                  <div className="inline-flex items-center gap-1 px-2 py-1 rounded bg-accent/20 border border-accent/30">
                    <span className="text-xs font-bold text-accent">{match.odds.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => onRemove(match.id)}
                className="p-1.5 rounded hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-primary/20 p-6 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-background/50 rounded-lg p-3 text-center">
            <p className="text-xs text-muted-foreground mb-1">Parlay Odds</p>
            <p className="text-lg font-bold text-primary">{totalOdds.toFixed(2)}</p>
          </div>
          <div className="bg-background/50 rounded-lg p-3 text-center">
            <p className="text-xs text-muted-foreground mb-1">Potential Return</p>
            <p className="text-lg font-bold text-secondary">
              {(totalOdds * 100).toFixed(0)}%
            </p>
          </div>
        </div>

        <ExportShare matches={selectedMatches} title="Share Watchlist" />

        <Button
          variant="outline"
          className="w-full border-destructive/30 text-destructive hover:bg-destructive/10 gap-2"
          onClick={() => {
            selectedMatches.forEach((m) => onRemove(m.id));
          }}
        >
          <Trash2 size={16} />
          Clear All
        </Button>
      </div>
    </div>
  );
}
