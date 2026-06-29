'use client';

import { Match } from '@/lib/mockData';
import { Lock, TrendingUp, Activity } from 'lucide-react';
import { format } from 'date-fns';

interface MatchCardProps {
  match: Match;
  onClick: () => void;
  isPremium?: boolean;
  onSelectOdds?: (selection: 'home' | 'draw' | 'away', odds: number) => void;
}

const predictionBadgeConfig: Record<string, { bg: string; text: string; label: string }> = {
  green: { bg: 'bg-green-500/20', text: 'text-green-400', label: 'STRONG WIN' },
  blue: { bg: 'bg-blue-500/20', text: 'text-blue-400', label: 'WIN' },
  yellow: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: 'DRAW' },
  orange: { bg: 'bg-orange-500/20', text: 'text-orange-400', label: 'UNCERTAIN' },
  red: { bg: 'bg-red-500/20', text: 'text-red-400', label: 'LOSS' },
};

function OddsButton({
  label,
  value,
  highlight,
  onClick,
}: {
  label: string;
  value: number;
  highlight?: boolean;
  onClick?: () => void;
}) {
  if (!value) return null;
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      className={`flex-1 flex flex-col items-center gap-0.5 py-1.5 px-1 rounded-lg border transition-all
        ${
          highlight
            ? 'bg-primary/20 border-primary/60 hover:bg-primary/30'
            : 'bg-card/60 border-primary/20 hover:bg-primary/10 hover:border-primary/40'
        }`}
    >
      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{label}</span>
      <span className={`text-xs font-bold ${highlight ? 'text-primary' : 'text-accent'}`}>
        {value.toFixed(2)}
      </span>
    </button>
  );
}

export function MatchCard({ match, onClick, isPremium, onSelectOdds }: MatchCardProps) {
  const badge = predictionBadgeConfig[match.prediction.color];
  const isBlurred = isPremium && match.isPremium;
  const isLive = match.status === 'live';

  // Determine which odds button to highlight based on AI prediction
  const predHighlight: Record<string, 'home' | 'draw' | 'away'> = {
    win: 'home',
    draw: 'draw',
    loss: 'away',
  };
  const highlighted = predHighlight[match.prediction.result];

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

      {/* Top Row - Date/Time & Live badge */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
          <span className="font-mono text-muted-foreground">
            {format(match.date, 'MMM dd')}
          </span>
          <span className="font-mono text-secondary font-semibold">{match.time}</span>
          {match.league && (
            <span className="hidden sm:inline text-[10px] text-muted-foreground/70 truncate max-w-[80px]">
              · {match.league}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {isLive && (
            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-red-500/20 border border-red-500/40 animate-pulse">
              <Activity size={10} className="text-red-400" />
              <span className="text-[10px] font-bold text-red-400">LIVE</span>
            </span>
          )}
          {match.status === 'finished' && (
            <div className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 rounded bg-secondary/20 border border-secondary/30">
              <span className="text-[10px] font-bold text-secondary">Verified on Solana</span>
            </div>
          )}
          <TrendingUp size={12} className="text-accent sm:w-4 sm:h-4" />
          <span className="text-xs sm:text-sm font-bold text-accent">
            {match.oddsHome?.toFixed(2) ?? match.odds.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Teams */}
      <div className="space-y-2 mb-3">
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
          {/* Live Score or 'H' label */}
          {isLive && match.homeScore != null ? (
            <span className="text-sm font-bold text-foreground flex-shrink-0">{match.homeScore}</span>
          ) : (
            <span className="text-xs text-muted-foreground flex-shrink-0">H</span>
          )}
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
          {isLive && match.awayScore != null ? (
            <span className="text-sm font-bold text-foreground flex-shrink-0">{match.awayScore}</span>
          ) : (
            <span className="text-xs text-muted-foreground flex-shrink-0">A</span>
          )}
        </div>
      </div>

      {/* Live Minute */}
      {isLive && match.minute != null && (
        <div className="flex items-center gap-1 mb-2">
          <span className="text-[10px] text-red-400 font-bold">{match.minute}&apos;</span>
          <div className="flex-1 h-px bg-red-500/20" />
        </div>
      )}

      {/* H / D / A Odds Row */}
      {(match.oddsHome || match.oddsDraw || match.oddsAway) ? (
        <div className="flex gap-1.5 mb-3" onClick={(e) => e.stopPropagation()}>
          <OddsButton
            label="1"
            value={match.oddsHome}
            highlight={highlighted === 'home'}
            onClick={() => onSelectOdds?.('home', match.oddsHome)}
          />
          {match.oddsDraw > 0 && (
            <OddsButton
              label="X"
              value={match.oddsDraw}
              highlight={highlighted === 'draw'}
              onClick={() => onSelectOdds?.('draw', match.oddsDraw)}
            />
          )}
          <OddsButton
            label="2"
            value={match.oddsAway}
            highlight={highlighted === 'away'}
            onClick={() => onSelectOdds?.('away', match.oddsAway)}
          />
        </div>
      ) : null}

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
