'use client';

import { useEffect, useState } from 'react';
import { Match } from '@/lib/mockData';
import { ChevronLeft, ChevronRight, Zap } from 'lucide-react';

interface LiveScoreTickerProps {
  matches: Match[];
}

export function LiveScoreTicker({ matches }: LiveScoreTickerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Filter live and recently finished matches
  const liveMatches = matches.filter((m) => m.status === 'live' || m.status === 'finished').slice(0, 5);

  if (liveMatches.length === 0) {
    return null;
  }

  // Auto-rotate every 5 seconds if not paused
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % liveMatches.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [liveMatches.length, isPaused]);

  const currentMatch = liveMatches[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + liveMatches.length) % liveMatches.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % liveMatches.length);
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'live':
        return 'bg-red-500/20 border-red-500/50 text-red-400';
      case 'finished':
        return 'bg-secondary/20 border-secondary/50 text-secondary';
      default:
        return 'bg-primary/20 border-primary/50 text-primary';
    }
  };

  const getStatusLabel = (status?: string) => {
    if (status === 'live') {
      return `LIVE - ${currentMatch.minute}'`;
    }
    return 'FINISHED';
  };

  return (
    <div className="bg-gradient-to-r from-secondary/10 to-primary/10 border border-primary/30 rounded-xl p-4 mb-6 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-4">
        {/* Live Indicator */}
        <div className="flex items-center gap-2 min-w-fit">
          <div className={`flex items-center gap-2 px-3 py-1 rounded-lg border ${getStatusColor(currentMatch.status)}`}>
            {currentMatch.status === 'live' && (
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            )}
            <span className="text-xs font-bold uppercase tracking-wider">{getStatusLabel(currentMatch.status)}</span>
          </div>
        </div>

        {/* Match Info */}
        <div className="flex-1 min-w-0">
          {/* Mobile: Stacked layout */}
          <div className="flex md:hidden flex-col items-center justify-center gap-2">
            {/* Home Team */}
            <div className="text-center w-full">
              <p className="text-xs font-bold text-foreground line-clamp-1">{currentMatch.homeTeam}</p>
            </div>

            {/* Score */}
            <div className="px-3 py-1 bg-card border border-primary/30 rounded">
              <p className="text-base font-black text-primary text-center">
                {currentMatch.homeScore} - {currentMatch.awayScore}
              </p>
            </div>

            {/* Away Team */}
            <div className="text-center w-full">
              <p className="text-xs font-bold text-foreground line-clamp-1">{currentMatch.awayTeam}</p>
            </div>
          </div>

          {/* Desktop: Horizontal layout */}
          <div className="hidden md:flex items-center gap-2 justify-center">
            {/* Home Team */}
            <div className="text-right min-w-0 flex-1">
              <p className="text-sm font-bold text-foreground truncate">{currentMatch.homeTeam}</p>
              <p className="text-xs text-muted-foreground truncate">{currentMatch.league}</p>
            </div>

            {/* Score */}
            <div className="px-4 py-2 bg-card border border-primary/30 rounded-lg flex-shrink-0">
              <p className="text-lg font-black text-primary text-center">
                {currentMatch.homeScore} - {currentMatch.awayScore}
              </p>
            </div>

            {/* Away Team */}
            <div className="text-left min-w-0 flex-1">
              <p className="text-sm font-bold text-foreground truncate">{currentMatch.awayTeam}</p>
              <p className="text-xs text-muted-foreground">vs</p>
            </div>
          </div>
        </div>

        {/* Controls - Hidden on mobile to save space */}
        <div className="hidden sm:flex items-center gap-2 min-w-fit">
          <button
            onClick={handlePrev}
            className="p-2 hover:bg-primary/20 rounded-lg transition-colors"
            aria-label="Previous match"
          >
            <ChevronLeft className="w-4 h-4 text-primary" />
          </button>

          {/* Dot Indicators - Hide on very small screens */}
          <div className="hidden md:flex gap-1">
            {liveMatches.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentIndex ? 'bg-primary w-4' : 'bg-muted hover:bg-muted-foreground'
                }`}
                aria-label={`Go to match ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="p-2 hover:bg-primary/20 rounded-lg transition-colors"
            aria-label="Next match"
          >
            <ChevronRight className="w-4 h-4 text-primary" />
          </button>

          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`p-2 rounded-lg transition-colors ${
              isPaused ? 'bg-secondary/20 text-secondary' : 'hover:bg-primary/20 text-primary'
            }`}
            aria-label={isPaused ? 'Resume ticker' : 'Pause ticker'}
          >
            {isPaused ? <Zap className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-3 flex justify-between text-xs text-muted-foreground">
        <span>
          {currentIndex + 1} of {liveMatches.length} live matches
        </span>
        {currentMatch.prediction && (
          <span className="text-primary font-semibold">
            Prediction: {currentMatch.prediction.result.toUpperCase()} ({currentMatch.prediction.confidence}%)
          </span>
        )}
      </div>
    </div>
  );
}
