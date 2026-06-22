'use client';

import { Match } from '@/lib/mockData';
import { Lock, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

interface MatchCardProps {
  match: Match;
  onClick: () => void;
  isPremium?: boolean;
}

const predictionBadgeConfig: Record<string, { bg: string; text: string; label: string }> = {
  green: { bg: 'bg-green-500/20', text: 'text-green-400', label: 'STRONG WIN' },
  blue: { bg: 'bg-blue-500/20', text: 'text-blue-400', label: 'WIN' },
  yellow: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: 'DRAW' },
  orange: { bg: 'bg-orange-500/20', text: 'text-orange-400', label: 'UNCERTAIN' },
  red: { bg: 'bg-red-500/20', text: 'text-red-400', label: 'LOSS' },
};

export function MatchCard({ match, onClick, isPremium }: MatchCardProps) {
  const badge = predictionBadgeConfig[match.prediction.color];
  const isBlurred = isPremium && match.isPremium;

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => e.key === 'Enter' && onClick()}
      className={`relative group cursor-pointer bg-gradient-to-br from-card to-card/50 border border-primary/20 rounded-lg sm:rounded-xl p-3 sm:p-4 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/20 active:scale-95 sm:active:scale-100 ${
        isBlurred ? 'blur-sm' : ''
      }`}
    >
      {/* Premium Overlay */}
      {isBlurred && (
        <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-background/40 backdrop-blur">
          <div className="text-center">
            <Lock className="mx-auto mb-2 text-primary" size={24} />
            <p className="text-sm font-semibold text-primary">Share to Unlock</p>
            <p className="text-xs text-muted-foreground mt-1">Premium Prediction</p>
          </div>
        </div>
      )}

      {/* Top Row - Date/Time & Odds */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
          <span className="font-mono text-muted-foreground">
            {format(match.date, 'MMM dd')}
          </span>
          <span className="font-mono text-secondary font-semibold">{match.time}</span>
        </div>
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <TrendingUp size={12} className="text-accent sm:w-4 sm:h-4" />
          <span className="text-xs sm:text-sm font-bold text-accent">{match.odds.toFixed(2)}</span>
        </div>
      </div>

      {/* Teams */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-primary">
                {match.homeTeam.charAt(0)}
              </span>
            </div>
            <span className="text-xs sm:text-sm font-semibold text-foreground truncate">
              {match.homeTeam}
            </span>
          </div>
          <span className="text-xs text-muted-foreground flex-shrink-0">H</span>
        </div>
        <div className="border-b border-primary/10" />
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-secondary">
                {match.awayTeam.charAt(0)}
              </span>
            </div>
            <span className="text-xs sm:text-sm font-semibold text-foreground truncate">
              {match.awayTeam}
            </span>
          </div>
          <span className="text-xs text-muted-foreground flex-shrink-0">A</span>
        </div>
      </div>

      {/* Prediction Badge */}
      <div
        className={`inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg ${badge.bg} border border-primary/30`}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-current" />
        <span className={`text-xs font-bold tracking-wider ${badge.text}`}>
          {badge.label}
        </span>
        <span className={`text-xs font-semibold ${badge.text}`}>
          {match.prediction.confidence}%
        </span>
      </div>
    </div>
  );
}
