'use client';

import { Header } from '@/components/Header';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { TrendingUp, Target, Shield, Zap } from 'lucide-react';

export default function StatsPage() {
  // Mock advanced stats data
  const matchStatsData = [
    { match: 'Man Utd vs Liverpool', xG: 2.3, xGA: 1.8, possession: 58, shots: 12, shotsOnTarget: 7 },
    { match: 'Man City vs Tottenham', xG: 3.1, xGA: 0.9, possession: 72, shots: 18, shotsOnTarget: 8 },
    { match: 'Arsenal vs Chelsea', xG: 1.9, xGA: 1.5, possession: 61, shots: 10, shotsOnTarget: 5 },
    { match: 'Liverpool vs Brighton', xG: 2.5, xGA: 1.2, possession: 65, shots: 14, shotsOnTarget: 6 },
  ];

  const teamComparisonData = [
    { stat: 'Attack', homeTeam: 82, awayTeam: 68 },
    { stat: 'Defense', homeTeam: 75, awayTeam: 72 },
    { stat: 'Midfield', homeTeam: 79, awayTeam: 76 },
    { stat: 'Possession', homeTeam: 58, awayTeam: 42 },
    { stat: 'Pressing', homeTeam: 71, awayTeam: 68 },
  ];

  const performanceMetrics = [
    { metric: 'Expected Goals (xG)', value: 2.3, trend: '+12%', icon: Target, color: 'text-primary' },
    { metric: 'Shot Accuracy', value: '58%', trend: '+5%', icon: TrendingUp, color: 'text-secondary' },
    { metric: 'Defensive Actions', value: 34, trend: '+8%', icon: Shield, color: 'text-accent' },
    { metric: 'Pass Completion', value: '87%', trend: '+2%', icon: Zap, color: 'text-primary' },
  ];

  const shotMap = [
    { x: 15, y: 25, type: 'goal', xG: 0.95 },
    { x: 20, y: 35, type: 'shot', xG: 0.42 },
    { x: 10, y: 40, type: 'shot', xG: 0.18 },
    { x: 25, y: 30, type: 'goal', xG: 0.87 },
    { x: 18, y: 45, type: 'blocked', xG: 0.12 },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header selectedSport="all" onSportChange={() => {}} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Advanced Match Statistics</h1>
          <p className="text-muted-foreground">Deep-dive analysis with Expected Goals (xG), possession, and detailed metrics</p>
        </div>

        {/* Performance Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {performanceMetrics.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="bg-card border border-primary/20 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <Icon size={24} className={item.color} />
                  <span className="text-xs font-bold text-primary bg-primary/20 px-2 py-1 rounded-md">{item.trend}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{item.metric}</p>
                <p className="text-3xl font-bold text-foreground">{item.value}</p>
              </div>
            );
          })}
        </div>

        {/* Stats Grids */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* xG vs xGA */}
          <div className="bg-card border border-primary/20 rounded-xl p-6">
            <h3 className="text-lg font-bold text-foreground mb-6">Expected Goals (xG) Comparison</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={matchStatsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="match" stroke="#666" angle={-45} textAnchor="end" height={100} />
                <YAxis stroke="#666" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #00ff88', borderRadius: '8px' }}
                  formatter={(value: any) => Number(value).toFixed(2)}
                />
                <Legend />
                <Bar dataKey="xG" fill="#00ff88" name="Expected Goals" />
                <Bar dataKey="xGA" fill="#ff3366" name="Expected Goals Against" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Possession & Shot Stats */}
          <div className="bg-card border border-primary/20 rounded-xl p-6">
            <h3 className="text-lg font-bold text-foreground mb-6">Possession & Shooting Stats</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={matchStatsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="match" stroke="#666" angle={-45} textAnchor="end" height={100} />
                <YAxis stroke="#666" />
                <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #00ff88', borderRadius: '8px' }} />
                <Legend />
                <Line type="monotone" dataKey="possession" stroke="#00ccff" strokeWidth={2} name="Possession %" />
                <Line type="monotone" dataKey="shots" stroke="#ffff00" strokeWidth={2} name="Total Shots" />
                <Line type="monotone" dataKey="shotsOnTarget" stroke="#00ff88" strokeWidth={2} name="Shots on Target" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Radar Chart - Team Comparison */}
          <div className="bg-card border border-primary/20 rounded-xl p-6">
            <h3 className="text-lg font-bold text-foreground mb-6">Manchester United vs Liverpool - Radar</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={teamComparisonData}>
                <PolarGrid stroke="#333" />
                <PolarAngleAxis dataKey="stat" stroke="#666" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#666" />
                <Radar name="Man United" dataKey="homeTeam" stroke="#00ff88" fill="#00ff88" fillOpacity={0.25} />
                <Radar name="Liverpool" dataKey="awayTeam" stroke="#00ccff" fill="#00ccff" fillOpacity={0.25} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Shot Map */}
          <div className="bg-card border border-primary/20 rounded-xl p-6">
            <h3 className="text-lg font-bold text-foreground mb-6">Shot Map - Expected Goals (xG)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis type="number" dataKey="x" name="X Position" stroke="#666" domain={[0, 100]} />
                <YAxis type="number" dataKey="y" name="Y Position" stroke="#666" domain={[0, 100]} />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #00ff88', borderRadius: '8px' }}
                  formatter={(value: any, name) => {
                    if (name === 'xG') return value.toFixed(2);
                    return value;
                  }}
                />
                <Scatter
                  name="Goals"
                  data={shotMap.filter(s => s.type === 'goal')}
                  fill="#00ff88"
                  r={8}
                />
                <Scatter
                  name="Shots"
                  data={shotMap.filter(s => s.type === 'shot')}
                  fill="#00ccff"
                  r={6}
                />
                <Scatter
                  name="Blocked"
                  data={shotMap.filter(s => s.type === 'blocked')}
                  fill="#ff6600"
                  r={5}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Stats Table */}
        <div className="bg-card border border-primary/20 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-bold text-foreground mb-6">Match Statistics Breakdown</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-primary/30">
                  <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Match</th>
                  <th className="text-center py-3 px-4 text-muted-foreground font-semibold">xG</th>
                  <th className="text-center py-3 px-4 text-muted-foreground font-semibold">xGA</th>
                  <th className="text-center py-3 px-4 text-muted-foreground font-semibold">Possession %</th>
                  <th className="text-center py-3 px-4 text-muted-foreground font-semibold">Shots</th>
                  <th className="text-center py-3 px-4 text-muted-foreground font-semibold">Shots on Target</th>
                  <th className="text-center py-3 px-4 text-muted-foreground font-semibold">Accuracy %</th>
                </tr>
              </thead>
              <tbody>
                {matchStatsData.map((row, idx) => (
                  <tr key={idx} className="border-b border-primary/10 hover:bg-primary/5 transition-colors">
                    <td className="py-3 px-4 text-foreground font-medium">{row.match}</td>
                    <td className="text-center py-3 px-4">
                      <span className="bg-primary/20 text-primary font-bold px-3 py-1 rounded-md">{row.xG}</span>
                    </td>
                    <td className="text-center py-3 px-4">
                      <span className="bg-destructive/20 text-destructive font-bold px-3 py-1 rounded-md">{row.xGA}</span>
                    </td>
                    <td className="text-center py-3 px-4 text-foreground">{row.possession}%</td>
                    <td className="text-center py-3 px-4 text-foreground">{row.shots}</td>
                    <td className="text-center py-3 px-4 text-foreground">{row.shotsOnTarget}</td>
                    <td className="text-center py-3 px-4">
                      <span className="text-secondary font-bold">{Math.round((row.shotsOnTarget / row.shots) * 100)}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Insights */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/30 rounded-xl p-6">
          <h3 className="text-lg font-bold text-foreground mb-4">Key Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="font-semibold text-foreground mb-1">High xG Difference</p>
                <p className="text-muted-foreground">Man City generated 3.1 xG against Tottenham's 0.9, indicating dominant attacking performance</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="font-semibold text-foreground mb-1">Possession Control</p>
                <p className="text-muted-foreground">Man City maintained 72% possession, translating to superior shot opportunities and control</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="font-semibold text-foreground mb-1">Shot Efficiency</p>
                <p className="text-muted-foreground">Arsenal's 50% shot accuracy is below average, suggesting poor finishing or defensive blocking</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="font-semibold text-foreground mb-1">Defensive Metrics</p>
                <p className="text-muted-foreground">Liverpool's 1.2 xGA demonstrates strong defensive structure with limited high-quality chances conceded</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
