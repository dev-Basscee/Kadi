'use client';

import { Header } from '@/components/Header';
import { mockMatches } from '@/lib/mockData';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Trophy, TrendingUp, Users } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function TeamPage() {
  const params = useParams();
  const router = useRouter();
  const teamName = decodeURIComponent(params.name as string);

  // Filter matches for this team
  const teamMatches = mockMatches.filter(
    (m) => m.homeTeam === teamName || m.awayTeam === teamName
  );

  // Calculate team stats
  const stats = {
    matchesPlayed: teamMatches.length,
    wins: teamMatches.filter((m) => {
      const isHome = m.homeTeam === teamName;
      return isHome ? m.homeScore! > m.awayScore! : m.awayScore! > m.homeScore!;
    }).length,
    losses: teamMatches.filter((m) => {
      const isHome = m.homeTeam === teamName;
      return isHome ? m.homeScore! < m.awayScore! : m.awayScore! < m.homeScore!;
    }).length,
    draws: teamMatches.filter((m) => m.homeScore === m.awayScore).length,
  };

  // Form data for chart
  const formData = [
    { match: 'Last 5', form: 72 },
    { match: 'Last 4', form: 78 },
    { match: 'Last 3', form: 85 },
    { match: 'Last 2', form: 81 },
    { match: 'Latest', form: 88 },
  ];

  const h2hData = [
    { opponent: 'Opponent A', wins: 4, draws: 2, losses: 1 },
    { opponent: 'Opponent B', wins: 3, draws: 1, losses: 2 },
    { opponent: 'Opponent C', wins: 5, draws: 0, losses: 1 },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header selectedSport="all" onSportChange={() => {}} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* Header Section */}
        <div className="bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 rounded-xl p-8 mb-12">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 bg-primary/10 border-2 border-primary/50 rounded-lg flex items-center justify-center">
              <span className="text-4xl font-bold text-primary">
                {teamName.substring(0, 2).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-foreground mb-2">{teamName}</h1>
              <p className="text-muted-foreground mb-4">Complete team statistics and performance metrics</p>
              <div className="flex gap-4 flex-wrap">
                <div className="px-4 py-2 bg-primary/20 rounded-lg border border-primary/50">
                  <p className="text-xs text-muted-foreground">Matches Played</p>
                  <p className="text-2xl font-bold text-primary">{stats.matchesPlayed}</p>
                </div>
                <div className="px-4 py-2 bg-accent/20 rounded-lg border border-accent/50">
                  <p className="text-xs text-muted-foreground">Wins</p>
                  <p className="text-2xl font-bold text-accent">{stats.wins}</p>
                </div>
                <div className="px-4 py-2 bg-secondary/20 rounded-lg border border-secondary/50">
                  <p className="text-xs text-muted-foreground">Win Rate</p>
                  <p className="text-2xl font-bold text-secondary">
                    {stats.matchesPlayed > 0 ? ((stats.wins / stats.matchesPlayed) * 100).toFixed(0) : 0}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {/* Form Trend */}
          <div className="bg-card border border-primary/20 rounded-xl p-6 backdrop-blur-sm">
            <h3 className="text-lg font-bold text-foreground mb-6">Recent Form</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={formData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="match" stroke="#999" style={{ fontSize: '12px' }} />
                <YAxis stroke="#999" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(20, 20, 20, 0.9)',
                    border: '1px solid #00ff88',
                    borderRadius: '8px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="form"
                  stroke="#00ff88"
                  strokeWidth={3}
                  dot={{ fill: '#00ff88', r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Record Breakdown */}
          <div className="bg-card border border-secondary/20 rounded-xl p-6 backdrop-blur-sm">
            <h3 className="text-lg font-bold text-foreground mb-6">Record</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={[
                  { result: 'Wins', count: stats.wins, fill: '#00ff88' },
                  { result: 'Draws', count: stats.draws, fill: '#ffff00' },
                  { result: 'Losses', count: stats.losses, fill: '#ff3366' },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="result" stroke="#999" style={{ fontSize: '12px' }} />
                <YAxis stroke="#999" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(20, 20, 20, 0.9)',
                    border: '1px solid #00ccff',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="count" fill="#00ccff" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Head to Head Stats */}
        <div className="bg-card border border-accent/20 rounded-xl p-6 backdrop-blur-sm mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Trophy className="w-5 h-5 text-accent" />
            <h3 className="text-lg font-bold text-foreground">Head to Head Records</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {h2hData.map((record, idx) => (
              <div key={idx} className="bg-background border border-accent/20 rounded-lg p-4">
                <p className="font-bold text-foreground mb-3">{record.opponent}</p>
                <div className="flex gap-4 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Wins</p>
                    <p className="text-lg font-bold text-primary">{record.wins}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Draws</p>
                    <p className="text-lg font-bold text-accent">{record.draws}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Losses</p>
                    <p className="text-lg font-bold text-destructive">{record.losses}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Matches */}
        <div className="bg-card border border-secondary/20 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-5 h-5 text-secondary" />
            <h3 className="text-lg font-bold text-foreground">Upcoming Matches</h3>
          </div>
          {teamMatches.length > 0 ? (
            <div className="space-y-3">
              {teamMatches.map((match) => (
                <div key={match.id} className="flex items-center justify-between p-4 bg-background border border-secondary/20 rounded-lg hover:border-secondary/50 transition-colors">
                  <div className="flex-1">
                    <p className="font-bold text-foreground">
                      {match.homeTeam} vs {match.awayTeam}
                    </p>
                    <p className="text-sm text-muted-foreground">{match.league}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">{match.time}</p>
                    <p className="text-sm text-muted-foreground">{match.date.toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No upcoming matches found</p>
          )}
        </div>
      </main>
    </div>
  );
}
