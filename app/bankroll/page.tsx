'use client';

import { Header } from '@/components/Header';
import { useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AlertCircle, TrendingUp, Target, Zap, Calculator } from 'lucide-react';

export default function BankrollPage() {
  const [bankroll, setBankroll] = useState(1000);
  const [confidence, setConfidence] = useState(75);
  const [odds, setOdds] = useState(1.95);

  // Kelly Criterion calculation
  const kellyFraction = 0.25; // Conservative 25% Kelly
  const winProbability = confidence / 100;
  const lossProbability = 1 - winProbability;
  const kellyPercentage = ((winProbability * odds - lossProbability) / (odds - 1)) * 100;
  const recommendedBet = Math.round((bankroll * (Math.min(kellyPercentage, 5) / 100) * kellyFraction));

  // Aggressive/Moderate/Conservative stakes
  const conservativeStake = Math.round(bankroll * 0.02);
  const moderateStake = Math.round(bankroll * 0.05);
  const aggressiveStake = Math.round(bankroll * 0.10);

  // Bankroll progression data
  const progressionData = [
    { day: 'Day 1', bankroll: 1000, cumProfit: 0 },
    { day: 'Day 2', bankroll: 1045, cumProfit: 45 },
    { day: 'Day 3', bankroll: 1095, cumProfit: 95 },
    { day: 'Day 4', bankroll: 1055, cumProfit: 55 },
    { day: 'Day 5', bankroll: 1120, cumProfit: 120 },
    { day: 'Day 6', bankroll: 1085, cumProfit: 85 },
    { day: 'Day 7', bankroll: 1165, cumProfit: 165 },
  ];

  // Allocation breakdown
  const allocationData = [
    { name: 'High Confidence (75%+)', value: 40, fill: '#00ff88' },
    { name: 'Medium Confidence (50-75%)', value: 35, fill: '#00ccff' },
    { name: 'Low Confidence (<50%)', value: 15, fill: '#ffff00' },
    { name: 'Reserve (Emergency)', value: 10, fill: '#ff3366' },
  ];

  // Risk/Reward scenarios
  const scenarios = [
    { name: 'Ultra Conservative', unitSize: 20, expectedROI: '5-8%', maxLossStreak: 25, winRate: '55%' },
    { name: 'Conservative', unitSize: 50, expectedROI: '8-12%', maxLossStreak: 20, winRate: '52%' },
    { name: 'Moderate', unitSize: 100, expectedROI: '12-18%', maxLossStreak: 15, winRate: '55%' },
    { name: 'Aggressive', unitSize: 150, expectedROI: '18-25%', maxLossStreak: 10, winRate: '56%' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header selectedSport="all" onSportChange={() => {}} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Bankroll Management</h1>
          <p className="text-muted-foreground">AI-powered stake recommendations using Kelly Criterion and portfolio allocation</p>
        </div>

        {/* Kelly Criterion Calculator */}
        <div className="bg-card border border-primary/20 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Calculator size={24} className="text-primary" />
            <h2 className="text-lg font-bold text-foreground">Kelly Criterion Stake Calculator</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Bankroll Input */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Total Bankroll ($)</label>
              <input
                type="number"
                value={bankroll}
                onChange={(e) => setBankroll(Number(e.target.value))}
                className="w-full bg-primary/10 border border-primary/30 rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs text-muted-foreground mt-2">Your total betting funds</p>
            </div>

            {/* Confidence Input */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Prediction Confidence (%)</label>
              <input
                type="range"
                min="0"
                max="100"
                value={confidence}
                onChange={(e) => setConfidence(Number(e.target.value))}
                className="w-full"
              />
              <p className="text-lg font-bold text-primary mt-2">{confidence}%</p>
              <p className="text-xs text-muted-foreground">AI confidence level in prediction</p>
            </div>

            {/* Odds Input */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Betting Odds</label>
              <input
                type="number"
                value={odds}
                onChange={(e) => setOdds(Number(e.target.value))}
                step="0.01"
                className="w-full bg-primary/10 border border-primary/30 rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs text-muted-foreground mt-2">Available odds</p>
            </div>
          </div>

          {/* Recommended Stakes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-lg p-4">
              <p className="text-xs text-muted-foreground mb-2">RECOMMENDED STAKE (Kelly)</p>
              <p className="text-3xl font-bold text-primary">${recommendedBet}</p>
              <p className="text-xs text-muted-foreground mt-2">{((recommendedBet / bankroll) * 100).toFixed(2)}% of bankroll</p>
            </div>

            <div className="bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/30 rounded-lg p-4">
              <p className="text-xs text-muted-foreground mb-2">CONSERVATIVE</p>
              <p className="text-3xl font-bold text-accent">${conservativeStake}</p>
              <p className="text-xs text-muted-foreground mt-2">{((conservativeStake / bankroll) * 100).toFixed(2)}% of bankroll</p>
            </div>

            <div className="bg-gradient-to-br from-secondary/20 to-secondary/5 border border-secondary/30 rounded-lg p-4">
              <p className="text-xs text-muted-foreground mb-2">AGGRESSIVE</p>
              <p className="text-3xl font-bold text-secondary">${aggressiveStake}</p>
              <p className="text-xs text-muted-foreground mt-2">{((aggressiveStake / bankroll) * 100).toFixed(2)}% of bankroll</p>
            </div>
          </div>
        </div>

        {/* Bankroll Progression */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Growth Chart */}
          <div className="bg-card border border-primary/20 rounded-xl p-6">
            <h3 className="text-lg font-bold text-foreground mb-6">Bankroll Growth Projection</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={progressionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="day" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #00ff88', borderRadius: '8px' }} />
                <Legend />
                <Line type="monotone" dataKey="bankroll" stroke="#00ff88" strokeWidth={2} name="Bankroll ($)" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Portfolio Allocation */}
          <div className="bg-card border border-primary/20 rounded-xl p-6">
            <h3 className="text-lg font-bold text-foreground mb-6">Recommended Portfolio Allocation</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={allocationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {allocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2 text-sm">
              {allocationData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }}></div>
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="font-bold text-foreground">${Math.round(bankroll * (item.value / 100))}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Betting Strategies Comparison */}
        <div className="bg-card border border-primary/20 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-bold text-foreground mb-6">Betting Strategies Comparison</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-primary/30">
                  <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Strategy</th>
                  <th className="text-center py-3 px-4 text-muted-foreground font-semibold">Unit Size</th>
                  <th className="text-center py-3 px-4 text-muted-foreground font-semibold">Expected ROI</th>
                  <th className="text-center py-3 px-4 text-muted-foreground font-semibold">Win Rate</th>
                  <th className="text-center py-3 px-4 text-muted-foreground font-semibold">Max Loss Streak</th>
                </tr>
              </thead>
              <tbody>
                {scenarios.map((scenario, idx) => (
                  <tr key={idx} className="border-b border-primary/10 hover:bg-primary/5 transition-colors">
                    <td className="py-3 px-4 font-semibold text-foreground">{scenario.name}</td>
                    <td className="text-center py-3 px-4">
                      <span className="bg-primary/20 text-primary px-3 py-1 rounded-md font-bold">${scenario.unitSize}</span>
                    </td>
                    <td className="text-center py-3 px-4 text-foreground font-semibold">{scenario.expectedROI}</td>
                    <td className="text-center py-3 px-4 text-accent font-bold">{scenario.winRate}</td>
                    <td className="text-center py-3 px-4">
                      <span className={`px-3 py-1 rounded-md font-bold ${scenario.maxLossStreak <= 12 ? 'bg-destructive/20 text-destructive' : 'bg-accent/20 text-accent'}`}>
                        {scenario.maxLossStreak} bets
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Risk Management Rules */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/30 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <AlertCircle size={24} className="text-primary" />
            <h3 className="text-lg font-bold text-foreground">Risk Management Rules</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
                <div>
                  <p className="font-semibold text-foreground">Max Bet per Match</p>
                  <p className="text-muted-foreground">Never bet more than 5% of bankroll on a single match</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
                <div>
                  <p className="font-semibold text-foreground">Daily Loss Limit</p>
                  <p className="text-muted-foreground">Stop betting if you lose 10% in a single day</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
                <div>
                  <p className="font-semibold text-foreground">Win Goal</p>
                  <p className="text-muted-foreground">Stop for the day after hitting 20% profit target</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-2 h-2 bg-secondary rounded-full mt-1.5 flex-shrink-0"></div>
                <div>
                  <p className="font-semibold text-foreground">Avoid Parlays</p>
                  <p className="text-muted-foreground">Stick to single bets for better risk management</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-2 h-2 bg-secondary rounded-full mt-1.5 flex-shrink-0"></div>
                <div>
                  <p className="font-semibold text-foreground">Confidence Threshold</p>
                  <p className="text-muted-foreground">Only bet on predictions with 60%+ confidence</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-2 h-2 bg-secondary rounded-full mt-1.5 flex-shrink-0"></div>
                <div>
                  <p className="font-semibold text-foreground">Emergency Reserve</p>
                  <p className="text-muted-foreground">Keep 10% of bankroll untouched for emergencies</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
