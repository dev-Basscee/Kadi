'use client';

import { useMemo } from 'react';
import { Header } from '@/components/Header';
import { mockBettingHistory } from '@/lib/mockData';
import { TrendingUp, TrendingDown, Target, Award } from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export default function HistoryPage() {
  // Calculate statistics
  const stats = useMemo(() => {
    const totalBets = mockBettingHistory.length;
    const wins = mockBettingHistory.filter((b) => b.result === 'win').length;
    const losses = mockBettingHistory.filter((b) => b.result === 'loss').length;
    const totalStaked = mockBettingHistory.reduce((sum, b) => sum + b.stakeAmount, 0);
    const totalReturned = mockBettingHistory.reduce((sum, b) => sum + (b.returnAmount || 0), 0);
    const totalProfit = mockBettingHistory.reduce((sum, b) => sum + (b.profit || 0), 0);
    const winRate = totalBets > 0 ? Number(((wins / totalBets) * 100).toFixed(1)) : 0;
    const roi = totalStaked > 0 ? Number(((totalProfit / totalStaked) * 100).toFixed(1)) : 0;

    return {
      totalBets,
      wins,
      losses,
      totalStaked,
      totalReturned,
      totalProfit,
      winRate,
      roi,
    };
  }, []);

  // Chart data
  const performanceData = mockBettingHistory.map((bet, idx) => ({
    name: `Bet ${idx + 1}`,
    profit: bet.profit || 0,
    stake: bet.stakeAmount,
  }));

  const resultData = [
    { name: 'Wins', value: stats.wins, fill: '#00ff88' },
    { name: 'Losses', value: stats.losses, fill: '#ff3366' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header selectedSport="all" onSportChange={() => {}} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Betting History</h1>
          <p className="text-muted-foreground">Track your predictions, performance, and ROI</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {/* Total Bets */}
          <div className="bg-card border border-primary/20 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-muted-foreground">Total Bets</span>
              <Target className="w-5 h-5 text-primary" />
            </div>
            <p className="text-3xl font-bold text-primary">{stats.totalBets}</p>
            <p className="text-xs text-muted-foreground mt-2">bets placed</p>
          </div>

          {/* Win Rate */}
          <div className="bg-card border border-secondary/20 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-muted-foreground">Win Rate</span>
              <Award className="w-5 h-5 text-secondary" />
            </div>
            <p className="text-3xl font-bold text-secondary">{stats.winRate}%</p>
            <p className="text-xs text-muted-foreground mt-2">
              {stats.wins} wins, {stats.losses} losses
            </p>
          </div>

          {/* Total Profit */}
          <div
            className={`bg-card border rounded-xl p-6 backdrop-blur-sm ${
              stats.totalProfit >= 0 ? 'border-primary/20' : 'border-destructive/20'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-muted-foreground">Total Profit</span>
              {stats.totalProfit >= 0 ? (
                <TrendingUp className="w-5 h-5 text-primary" />
              ) : (
                <TrendingDown className="w-5 h-5 text-destructive" />
              )}
            </div>
            <p className={`text-3xl font-bold ${stats.totalProfit >= 0 ? 'text-primary' : 'text-destructive'}`}>
              {stats.totalProfit >= 0 ? '+' : ''}${stats.totalProfit.toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground mt-2">from ${stats.totalStaked.toFixed(2)} staked</p>
          </div>

          {/* ROI */}
          <div
            className={`bg-card border rounded-xl p-6 backdrop-blur-sm ${
              stats.roi >= 0 ? 'border-accent/20' : 'border-destructive/20'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-muted-foreground">ROI</span>
              {stats.roi >= 0 ? (
                <TrendingUp className="w-5 h-5 text-accent" />
              ) : (
                <TrendingDown className="w-5 h-5 text-destructive" />
              )}
            </div>
            <p className={`text-3xl font-bold ${stats.roi >= 0 ? 'text-accent' : 'text-destructive'}`}>
              {stats.roi >= 0 ? '+' : ''}
              {stats.roi}%
            </p>
            <p className="text-xs text-muted-foreground mt-2">return on investment</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {/* Performance Chart */}
          <div className="bg-card border border-primary/20 rounded-xl p-6 backdrop-blur-sm">
            <h3 className="text-lg font-bold text-foreground mb-6">Profit per Bet</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="#999" style={{ fontSize: '12px' }} />
                <YAxis stroke="#999" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(20, 20, 20, 0.9)',
                    border: '1px solid #00ff88',
                    borderRadius: '8px',
                  }}
                  cursor={{ fill: 'rgba(0, 255, 136, 0.1)' }}
                />
                <Bar dataKey="profit" fill="#00ff88" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Win/Loss Distribution */}
          <div className="bg-card border border-secondary/20 rounded-xl p-6 backdrop-blur-sm">
            <h3 className="text-lg font-bold text-foreground mb-6">Win/Loss Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={resultData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {resultData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(20, 20, 20, 0.9)',
                    border: '1px solid #00ccff',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Betting History Table */}
        <div className="bg-card border border-primary/20 rounded-xl p-6 backdrop-blur-sm overflow-hidden">
          <h3 className="text-lg font-bold text-foreground mb-6">Detailed History</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-primary/20">
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Match</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Prediction</th>
                  <th className="text-right py-3 px-4 text-muted-foreground font-medium">Odds</th>
                  <th className="text-right py-3 px-4 text-muted-foreground font-medium">Stake</th>
                  <th className="text-right py-3 px-4 text-muted-foreground font-medium">Result</th>
                  <th className="text-right py-3 px-4 text-muted-foreground font-medium">Profit</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {mockBettingHistory.map((bet) => (
                  <tr key={bet.id} className="border-b border-primary/10 hover:bg-primary/5 transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-medium text-foreground">
                        {bet.homeTeam} vs {bet.awayTeam}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-foreground">{bet.prediction}</td>
                    <td className="py-4 px-4 text-right text-foreground">{bet.odds.toFixed(2)}</td>
                    <td className="py-4 px-4 text-right text-foreground">${bet.stakeAmount.toFixed(2)}</td>
                    <td className="py-4 px-4 text-right">
                      <span
                        className={`px-3 py-1 rounded-lg text-xs font-bold ${
                          bet.result === 'win'
                            ? 'bg-primary/20 text-primary'
                            : 'bg-destructive/20 text-destructive'
                        }`}
                      >
                        {bet.result.toUpperCase()}
                      </span>
                    </td>
                    <td
                      className={`py-4 px-4 text-right font-bold ${
                        (bet.profit || 0) >= 0 ? 'text-primary' : 'text-destructive'
                      }`}
                    >
                      {(bet.profit || 0) >= 0 ? '+' : ''}${(bet.profit || 0).toFixed(2)}
                    </td>
                    <td className="py-4 px-4 text-muted-foreground text-sm">
                      {bet.matchDate.toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
