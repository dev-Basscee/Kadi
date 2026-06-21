'use client';

import { Header } from '@/components/Header';
import { useState } from 'react';
import { TrendingUp, Check, X, ArrowUpRight, Search } from 'lucide-react';

export default function OddsPage() {
  const [selectedMatch, setSelectedMatch] = useState('1');

  // Mock odds data from different bookmakers
  const oddsData = {
    '1': {
      match: 'Manchester United vs Liverpool',
      date: '2026-06-22 20:00',
      bookmakers: [
        { name: 'Bet365', home: 1.95, draw: 3.50, away: 1.80, margin: 4.2 },
        { name: 'DraftKings', home: 1.92, draw: 3.45, away: 1.85, margin: 4.5 },
        { name: 'FanDuel', home: 1.98, draw: 3.55, away: 1.78, margin: 3.8 },
        { name: 'BetVictor', home: 2.00, draw: 3.60, away: 1.75, margin: 3.5 },
        { name: 'Pinnacle', home: 1.99, draw: 3.58, away: 1.76, margin: 2.1 },
        { name: 'Betfair', home: 1.97, draw: 3.52, away: 1.79, margin: 3.9 },
      ]
    },
    '2': {
      match: 'Arsenal vs Chelsea',
      date: '2026-06-22 19:30',
      bookmakers: [
        { name: 'Bet365', home: 2.10, draw: 3.40, away: 1.65, margin: 4.8 },
        { name: 'DraftKings', home: 2.05, draw: 3.35, away: 1.70, margin: 5.2 },
        { name: 'FanDuel', home: 2.15, draw: 3.45, away: 1.62, margin: 4.5 },
        { name: 'BetVictor', home: 2.20, draw: 3.50, away: 1.60, margin: 4.0 },
        { name: 'Pinnacle', home: 2.12, draw: 3.42, away: 1.64, margin: 2.3 },
        { name: 'Betfair', home: 2.08, draw: 3.38, away: 1.66, margin: 4.2 },
      ]
    },
  };

  const currentOdds = oddsData[selectedMatch as keyof typeof oddsData];

  // Calculate best odds and implied probability
  const bestOdds = {
    home: Math.max(...currentOdds.bookmakers.map(b => b.home)),
    draw: Math.max(...currentOdds.bookmakers.map(b => b.draw)),
    away: Math.max(...currentOdds.bookmakers.map(b => b.away)),
  };

  const impliedProb = {
    home: (1 / bestOdds.home * 100).toFixed(1),
    draw: (1 / bestOdds.draw * 100).toFixed(1),
    away: (1 / bestOdds.away * 100).toFixed(1),
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header selectedSport="all" onSportChange={() => {}} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Odds Comparison Tool</h1>
          <p className="text-muted-foreground">Compare betting odds across bookmakers to find the best value and highest returns</p>
        </div>

        {/* Match Selector */}
        <div className="bg-card border border-primary/20 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-bold text-foreground mb-4">Select a Match</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(oddsData).map(([key, match]) => (
              <button
                key={key}
                onClick={() => setSelectedMatch(key)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  selectedMatch === key
                    ? 'border-primary bg-primary/10'
                    : 'border-primary/20 hover:border-primary/40'
                }`}
              >
                <p className="font-semibold text-foreground">{match.match}</p>
                <p className="text-sm text-muted-foreground">{match.date}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Odds Comparison Table */}
        <div className="bg-card border border-primary/20 rounded-xl p-6 mb-8 overflow-x-auto">
          <h2 className="text-lg font-bold text-foreground mb-6">Odds Across Bookmakers</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-primary/30">
                <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Bookmaker</th>
                <th className="text-center py-3 px-4 text-muted-foreground font-semibold">Home Win</th>
                <th className="text-center py-3 px-4 text-muted-foreground font-semibold">Draw</th>
                <th className="text-center py-3 px-4 text-muted-foreground font-semibold">Away Win</th>
                <th className="text-center py-3 px-4 text-muted-foreground font-semibold">Margin %</th>
                <th className="text-center py-3 px-4 text-muted-foreground font-semibold">Rating</th>
              </tr>
            </thead>
            <tbody>
              {currentOdds.bookmakers.map((bookie, idx) => {
                const isLowestMargin = bookie.margin === Math.min(...currentOdds.bookmakers.map(b => b.margin));
                const isBestHome = bookie.home === Math.max(...currentOdds.bookmakers.map(b => b.home));
                const isBestDraw = bookie.draw === Math.max(...currentOdds.bookmakers.map(b => b.draw));
                const isBestAway = bookie.away === Math.max(...currentOdds.bookmakers.map(b => b.away));

                return (
                  <tr key={idx} className={`border-b border-primary/10 hover:bg-primary/5 transition-colors ${isLowestMargin ? 'bg-primary/5 border-l-4 border-l-primary' : ''}`}>
                    <td className="py-3 px-4 font-semibold text-foreground">{bookie.name}</td>
                    <td className="text-center py-3 px-4">
                      <span className={`font-bold ${isBestHome ? 'bg-primary/20 text-primary px-2 py-1 rounded-md' : 'text-foreground'}`}>
                        {bookie.home.toFixed(2)}
                      </span>
                    </td>
                    <td className="text-center py-3 px-4">
                      <span className={`font-bold ${isBestDraw ? 'bg-accent/20 text-accent px-2 py-1 rounded-md' : 'text-foreground'}`}>
                        {bookie.draw.toFixed(2)}
                      </span>
                    </td>
                    <td className="text-center py-3 px-4">
                      <span className={`font-bold ${isBestAway ? 'bg-secondary/20 text-secondary px-2 py-1 rounded-md' : 'text-foreground'}`}>
                        {bookie.away.toFixed(2)}
                      </span>
                    </td>
                    <td className="text-center py-3 px-4">
                      <span className={`font-bold ${isLowestMargin ? 'text-primary' : 'text-foreground'}`}>
                        {bookie.margin.toFixed(1)}%
                      </span>
                    </td>
                    <td className="text-center py-3 px-4">
                      <div className="flex items-center justify-center gap-1">
                        {isLowestMargin && <Check size={16} className="text-primary" />}
                        {isBestHome || isBestDraw || isBestAway ? (
                          <TrendingUp size={16} className="text-accent" />
                        ) : null}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Best Odds Summary & Returns Calculator */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Best Odds */}
          <div className="bg-card border border-primary/20 rounded-xl p-6">
            <h3 className="text-lg font-bold text-foreground mb-6">Best Odds Available</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-primary/10 border border-primary/30 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Home Win (Best)</p>
                  <p className="text-2xl font-bold text-primary">{bestOdds.home.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground mt-1">Implied Probability: {impliedProb.home}%</p>
                </div>
                <ArrowUpRight size={24} className="text-primary" />
              </div>
              <div className="flex items-center justify-between p-4 bg-accent/10 border border-accent/30 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Draw (Best)</p>
                  <p className="text-2xl font-bold text-accent">{bestOdds.draw.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground mt-1">Implied Probability: {impliedProb.draw}%</p>
                </div>
                <ArrowUpRight size={24} className="text-accent" />
              </div>
              <div className="flex items-center justify-between p-4 bg-secondary/10 border border-secondary/30 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Away Win (Best)</p>
                  <p className="text-2xl font-bold text-secondary">{bestOdds.away.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground mt-1">Implied Probability: {impliedProb.away}%</p>
                </div>
                <ArrowUpRight size={24} className="text-secondary" />
              </div>
            </div>
          </div>

          {/* Returns Calculator */}
          <div className="bg-card border border-primary/20 rounded-xl p-6">
            <h3 className="text-lg font-bold text-foreground mb-6">Potential Returns Calculator</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Stake Amount</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Enter stake amount"
                    defaultValue="100"
                    className="flex-1 bg-primary/10 border border-primary/30 rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <span className="px-4 py-2 bg-primary/20 text-primary rounded-lg font-semibold">$</span>
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <div className="p-3 bg-primary/10 border border-primary/30 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Home Win @ {bestOdds.home.toFixed(2)}</p>
                  <p className="text-lg font-bold text-primary">${(100 * bestOdds.home).toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground mt-1">Profit: ${((100 * bestOdds.home) - 100).toFixed(2)}</p>
                </div>

                <div className="p-3 bg-accent/10 border border-accent/30 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Draw @ {bestOdds.draw.toFixed(2)}</p>
                  <p className="text-lg font-bold text-accent">${(100 * bestOdds.draw).toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground mt-1">Profit: ${((100 * bestOdds.draw) - 100).toFixed(2)}</p>
                </div>

                <div className="p-3 bg-secondary/10 border border-secondary/30 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Away Win @ {bestOdds.away.toFixed(2)}</p>
                  <p className="text-lg font-bold text-secondary">${(100 * bestOdds.away).toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground mt-1">Profit: ${((100 * bestOdds.away) - 100).toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Value Analysis */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/30 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-bold text-foreground mb-4">Value Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex gap-3">
              <Check size={20} className="text-primary flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-foreground mb-1">Best Margin</p>
                <p className="text-muted-foreground">Pinnacle offers 2.1% margin - the lowest among major bookmakers for tighter odds</p>
              </div>
            </div>
            <div className="flex gap-3">
              <TrendingUp size={20} className="text-accent flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-foreground mb-1">Value Opportunity</p>
                <p className="text-muted-foreground">BetVictor offers best away odds at 1.75 vs others at 1.78-1.85</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Search size={20} className="text-secondary flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-foreground mb-1">Arbitrage Alert</p>
                <p className="text-muted-foreground">No guaranteed arbitrage opportunities detected for this match</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bookmaker Comparison */}
        <div className="bg-card border border-primary/20 rounded-xl p-6">
          <h3 className="text-lg font-bold text-foreground mb-6">Why Margin Matters</h3>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>The margin (also called "vigorish" or "vig") is the bookmaker's built-in profit. Lower margins mean better odds for you.</p>
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mt-4">
              <p className="font-semibold text-foreground mb-2">Example: $100 Bet with Different Margins</p>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span>Bet365 (4.2% margin): Odds 1.95 → Returns $195 → Profit $95</span>
                  <span className="text-muted-foreground">-$5 vs Pinnacle</span>
                </div>
                <div className="flex justify-between text-primary">
                  <span className="font-semibold">Pinnacle (2.1% margin): Odds 1.99 → Returns $199 → Profit $99</span>
                  <span className="font-semibold">✓ Best Return</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
