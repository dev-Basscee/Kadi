'use client';

import { useState } from 'react';
import { Match } from '@/lib/mockData';
import { TrendingUp, BarChart3, ChevronDown } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

export function ContextualAnalyticsPanel({ match }: { match: Match }) {
  const [expandedSection, setExpandedSection] = useState<'stats' | 'odds' | null>('stats');

  // Mock xG data for this match
  const xGData = [
    { team: match.homeTeam, xG: 1.8, xGA: 1.2, shots: 8, accuracy: 65 },
    { team: match.awayTeam, xG: 1.5, xGA: 1.3, shots: 7, accuracy: 62 },
  ];

  // Bookmakers odds comparison
  const bookmakersData = [
    { bookie: 'Pinnacle', home: 1.95, draw: 3.55, away: 1.98, margin: 2.1 },
    { bookie: 'Bet365', home: 1.90, draw: 3.60, away: 2.05, margin: 3.2 },
    { bookie: 'Betfair', home: 1.93, draw: 3.58, away: 2.02, margin: 2.8 },
    { bookie: 'William Hill', home: 1.88, draw: 3.65, away: 2.10, margin: 4.1 },
  ];

  return (
    <div className="space-y-4">
      {/* Advanced Stats Section */}
      <div className="bg-card border border-primary/20 rounded-lg overflow-hidden">
        <button
          onClick={() => setExpandedSection(expandedSection === 'stats' ? null : 'stats')}
          className="w-full flex items-center justify-between p-4 hover:bg-primary/5 transition-colors"
        >
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-foreground">Advanced Stats</h3>
          </div>
          <ChevronDown
            className={`w-5 h-5 text-muted-foreground transition-transform ${
              expandedSection === 'stats' ? 'rotate-180' : ''
            }`}
          />
        </button>

        {expandedSection === 'stats' && (
          <div className="p-4 border-t border-primary/10 space-y-4">
            {/* xG Comparison */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-3">EXPECTED GOALS (xG)</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={xGData} layout="vertical">
                  <XAxis type="number" />
                  <YAxis dataKey="team" type="category" width={100} />
                  <Bar dataKey="xG" fill="#00ff88" name="xG For" />
                  <Bar dataKey="xGA" fill="#ff3366" name="xG Against" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Shot Accuracy */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-2">SHOT ACCURACY</p>
              <div className="space-y-2">
                {xGData.map((data) => (
                  <div key={data.team}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-foreground">{data.team}</span>
                      <span className="text-sm font-bold text-primary">{data.accuracy}%</span>
                    </div>
                    <div className="h-2 bg-card-foreground/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-secondary"
                        style={{ width: `${data.accuracy}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-primary/10">
              <div className="bg-primary/10 rounded p-3">
                <p className="text-xs text-muted-foreground">Possession</p>
                <p className="text-lg font-bold text-primary">58%</p>
              </div>
              <div className="bg-secondary/10 rounded p-3">
                <p className="text-xs text-muted-foreground">Pass Accuracy</p>
                <p className="text-lg font-bold text-secondary">82%</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Odds Comparison Section */}
      <div className="bg-card border border-primary/20 rounded-lg overflow-hidden">
        <button
          onClick={() => setExpandedSection(expandedSection === 'odds' ? null : 'odds')}
          className="w-full flex items-center justify-between p-4 hover:bg-primary/5 transition-colors"
        >
          <div className="flex items-center gap-3">
            <BarChart3 className="w-5 h-5 text-secondary" />
            <h3 className="font-bold text-foreground">Odds Comparison</h3>
          </div>
          <ChevronDown
            className={`w-5 h-5 text-muted-foreground transition-transform ${
              expandedSection === 'odds' ? 'rotate-180' : ''
            }`}
          />
        </button>

        {expandedSection === 'odds' && (
          <div className="p-4 border-t border-primary/10 space-y-3">
            {/* Best Odds Highlights */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-primary/10 rounded p-3">
                <p className="text-xs text-muted-foreground">Best 1</p>
                <p className="text-lg font-bold text-primary">1.95</p>
                <p className="text-xs text-primary">Pinnacle</p>
              </div>
              <div className="bg-accent/10 rounded p-3">
                <p className="text-xs text-muted-foreground">Best X</p>
                <p className="text-lg font-bold text-accent">3.65</p>
                <p className="text-xs text-accent">William Hill</p>
              </div>
              <div className="bg-secondary/10 rounded p-3">
                <p className="text-xs text-muted-foreground">Best 2</p>
                <p className="text-lg font-bold text-secondary">2.10</p>
                <p className="text-xs text-secondary">William Hill</p>
              </div>
            </div>

            {/* Bookmakers Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-primary/10">
                  <tr>
                    <th className="text-left py-2 text-xs text-muted-foreground font-semibold">Bookie</th>
                    <th className="text-center py-2 text-xs text-muted-foreground font-semibold">1</th>
                    <th className="text-center py-2 text-xs text-muted-foreground font-semibold">X</th>
                    <th className="text-center py-2 text-xs text-muted-foreground font-semibold">2</th>
                    <th className="text-right py-2 text-xs text-muted-foreground font-semibold">Margin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary/10">
                  {bookmakersData.map((bookie) => (
                    <tr key={bookie.bookie} className="hover:bg-primary/5 transition-colors">
                      <td className="py-2 text-foreground font-medium">{bookie.bookie}</td>
                      <td className="text-center py-2 text-primary font-bold">{bookie.home.toFixed(2)}</td>
                      <td className="text-center py-2 text-accent font-bold">{bookie.draw.toFixed(2)}</td>
                      <td className="text-center py-2 text-secondary font-bold">{bookie.away.toFixed(2)}</td>
                      <td className="text-right py-2 text-muted-foreground text-xs">{bookie.margin.toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
