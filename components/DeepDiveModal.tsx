'use client';

import { useState } from 'react';
import { Match } from '@/lib/mockData';
import { X } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { AIAnalysisExplainer } from '@/components/AIAnalysisExplainer';
import { InjuryLineupUpdates } from '@/components/InjuryLineupUpdates';
import { MarketTabs } from '@/components/MarketTabs';
import { ContextualAnalyticsPanel } from '@/components/ContextualAnalyticsPanel';
import { format } from 'date-fns';

interface DeepDiveModalProps {
  match: Match | null;
  onClose: () => void;
}

export function DeepDiveModal({ match, onClose }: DeepDiveModalProps) {
  const [showWatchlist, setShowWatchlist] = useState(false);
  
  if (!match) return null;

  const probData = [
    { name: 'Home', value: match.probabilityHome, fill: '#00ff88' },
    { name: 'Draw', value: match.probabilityDraw, fill: '#ffff00' },
    { name: 'Away', value: match.probabilityAway, fill: '#ff3366' },
  ].filter((d) => d.value > 0);

  const formData = [
    { name: match.homeTeam.split(' ')[0], value: match.homeForm[4] },
    { name: match.awayTeam.split(' ')[0], value: match.awayForm[4] },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card border border-primary/30 rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-primary/20 bg-gradient-to-r from-background to-background/50 flex-shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-1">Match Analysis</h2>
            <p className="text-sm text-muted-foreground">
              {match.homeTeam} vs {match.awayTeam} • {format(match.date, 'MMM d')} at {match.time}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-primary/20 rounded-lg transition-colors flex-shrink-0"
          >
            <X size={24} className="text-foreground" />
          </button>
        </div>

        {/* 3-Panel Layout */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-3 gap-0 lg:gap-6 p-6">
          {/* LEFT PANEL - Match Overview & Form */}
          <div className="space-y-6 pb-6 lg:pb-0 lg:border-r border-primary/20 lg:pr-6">
            {/* Teams */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-card/50 border border-primary/20 rounded-lg p-3 text-center">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-2">
                  <span className="text-lg font-bold text-primary">
                    {match.homeTeam.charAt(0)}
                  </span>
                </div>
                <h3 className="font-semibold text-foreground text-sm mb-1">{match.homeTeam}</h3>
                <p className="text-xs text-muted-foreground">Home</p>
              </div>

              <div className="bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 rounded-lg p-3 flex flex-col items-center justify-center">
                <div className="text-2xl font-bold text-primary">VS</div>
              </div>

              <div className="bg-card/50 border border-secondary/20 rounded-lg p-3 text-center">
                <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-2">
                  <span className="text-lg font-bold text-secondary">
                    {match.awayTeam.charAt(0)}
                  </span>
                </div>
                <h3 className="font-semibold text-foreground text-sm mb-1">{match.awayTeam}</h3>
                <p className="text-xs text-muted-foreground">Away</p>
              </div>
            </div>

            {/* Probability Chart */}
            <div>
              <h3 className="text-lg font-bold text-foreground mb-4">Match Probability</h3>
              <div className="bg-card/50 border border-primary/20 rounded-lg p-4 flex justify-center">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={probData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {probData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Form Comparison */}
            <div>
              <h3 className="text-lg font-bold text-foreground mb-4">Recent Form</h3>
              <div className="bg-card/50 border border-primary/20 rounded-lg p-4">
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={formData}>
                    <XAxis dataKey="name" stroke="#666" />
                    <YAxis stroke="#666" domain={[0, 100]} />
                    <Bar dataKey="value" fill="#00ff88" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Head to Head */}
            <div>
              <h3 className="text-lg font-bold text-foreground mb-4">H2H Record</h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-card/50 border border-primary/20 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-primary mb-1">
                    {match.h2hStats.homeWins}
                  </div>
                  <p className="text-xs text-muted-foreground">Wins</p>
                </div>
                <div className="bg-card/50 border border-accent/20 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-accent mb-1">
                    {match.h2hStats.draws}
                  </div>
                  <p className="text-xs text-muted-foreground">Draws</p>
                </div>
                <div className="bg-card/50 border border-destructive/20 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-destructive mb-1">
                    {match.h2hStats.awayWins}
                  </div>
                  <p className="text-xs text-muted-foreground">Losses</p>
                </div>
              </div>
            </div>
          </div>

          {/* CENTER PANEL - Betting Markets */}
          <div className="space-y-6 pb-6 lg:pb-0 border-b lg:border-b-0 lg:border-r border-primary/20 lg:border-b-0 lg:pr-6">
            <MarketTabs match={match} />
            
            {/* Injury & Lineup Updates */}
            <div>
              <h3 className="text-lg font-bold text-foreground mb-4">Player Availability</h3>
              <div className="bg-card/50 border border-primary/20 rounded-lg p-4">
                <InjuryLineupUpdates matchId={match.id} />
              </div>
            </div>
          </div>

          {/* RIGHT PANEL - Analytics & Tools */}
          <div className="space-y-6">
            <ContextualAnalyticsPanel match={match} />

            {/* AI Analysis Explainer */}
            <AIAnalysisExplainer match={match} />

            {/* Actions */}
            <div className="flex gap-3 pt-4 sticky bottom-0 bg-card">
              <Button
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => {
                  setShowWatchlist(true);
                  onClose();
                }}
              >
                Add to Watchlist
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-primary/30 hover:bg-primary/5"
                onClick={onClose}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
