'use client';

import { useState } from 'react';
import { Match } from '@/lib/mockData';

type MarketType = '1x2' | 'gg' | 'over-under' | 'corners' | '1st-half' | 'correct-score';

interface MarketOdds {
  option: string;
  odds: number;
  probability?: number;
}

export function MarketTabs({ match }: { match: Match }) {
  const [activeMarket, setActiveMarket] = useState<MarketType>('1x2');

  const markets: Record<MarketType, { label: string; options: MarketOdds[] }> = {
    '1x2': {
      label: '1x2 (Win/Draw/Loss)',
      options: [
        { option: '1 (Home Win)', odds: match.odds, probability: match.probabilityHome },
        { option: 'X (Draw)', odds: 3.2, probability: match.probabilityDraw },
        { option: '2 (Away Win)', odds: 1.95, probability: match.probabilityAway },
      ],
    },
    'gg': {
      label: 'Goal/Goal (GG)',
      options: [
        { option: 'Yes (Both Teams Score)', odds: 1.72, probability: 65 },
        { option: 'No (Not Both)', odds: 2.1, probability: 35 },
      ],
    },
    'over-under': {
      label: 'Over/Under (2.5 Goals)',
      options: [
        { option: 'Over 2.5', odds: 1.85, probability: 58 },
        { option: 'Under 2.5', odds: 1.95, probability: 42 },
      ],
    },
    'corners': {
      label: 'Corners (Over 9.5)',
      options: [
        { option: 'Over 9.5 Corners', odds: 1.92, probability: 52 },
        { option: 'Under 9.5 Corners', odds: 1.88, probability: 48 },
      ],
    },
    '1st-half': {
      label: '1st Half Winner',
      options: [
        { option: '1st Half Home', odds: 2.15, probability: 48 },
        { option: '1st Half Draw', odds: 3.8, probability: 26 },
        { option: '1st Half Away', odds: 3.2, probability: 26 },
      ],
    },
    'correct-score': {
      label: 'Correct Score',
      options: [
        { option: '1-0', odds: 4.5, probability: 12 },
        { option: '2-0', odds: 6.0, probability: 10 },
        { option: '2-1', odds: 7.5, probability: 8 },
        { option: '1-1', odds: 5.5, probability: 11 },
        { option: 'Other', odds: 2.5, probability: 59 },
      ],
    },
  };

  const currentMarket = markets[activeMarket];

  return (
    <div className="space-y-6">
      {/* Market Selector Tabs */}
      <div className="flex flex-wrap gap-2">
        {(Object.keys(markets) as MarketType[]).map((marketType) => (
          <button
            key={marketType}
            onClick={() => setActiveMarket(marketType)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeMarket === marketType
                ? 'bg-primary text-primary-foreground'
                : 'bg-card border border-primary/20 text-foreground hover:border-primary/40'
            }`}
          >
            {markets[marketType].label.split(' ')[0]}
          </button>
        ))}
      </div>

      {/* Market Title */}
      <div>
        <h3 className="text-xl font-bold text-foreground mb-4">{currentMarket.label}</h3>
        <p className="text-sm text-muted-foreground mb-6">
          {match.homeTeam} vs {match.awayTeam}
        </p>
      </div>

      {/* Market Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentMarket.options.map((option, index) => (
          <button
            key={index}
            className="group p-4 rounded-lg border border-primary/20 hover:border-primary/40 bg-card hover:bg-primary/5 transition-all text-left"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {option.option}
                </p>
                {option.probability && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {option.probability}% probability
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">{option.odds.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">Odds</p>
              </div>
            </div>

            {/* Probability Bar */}
            {option.probability && (
              <div className="h-2 bg-card-foreground/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-secondary"
                  style={{ width: `${option.probability}%` }}
                />
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Info */}
      <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-4">
        <p className="text-sm text-foreground">
          <span className="font-semibold">Note:</span> These are analysis probabilities. For live betting odds,
          compare using our Odds Comparison tool within this match view.
        </p>
      </div>
    </div>
  );
}
