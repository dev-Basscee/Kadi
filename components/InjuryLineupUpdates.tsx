'use client';

import { AlertTriangle, Clock, CheckCircle2, Zap, User, Users } from 'lucide-react';
import { useState } from 'react';

interface Player {
  name: string;
  number: number;
  position: string;
  status: 'available' | 'injured' | 'suspended' | 'doubtful';
  injuryType?: string;
  returnDate?: string;
  impact: 'high' | 'medium' | 'low';
}

interface TeamLineup {
  team: string;
  injuries: Player[];
  confirmedLineup: Player[];
  lastUpdate: string;
}

const mockLineups: Record<string, TeamLineup> = {
  home: {
    team: 'Manchester United',
    injuries: [
      { name: 'Lisandro Martínez', number: 6, position: 'Defender', status: 'injured', injuryType: 'Hamstring', returnDate: '2026-06-30', impact: 'high' },
      { name: 'Aaron Wan-Bissaka', number: 29, position: 'Defender', status: 'doubtful', injuryType: 'Muscle strain', returnDate: '2026-06-22', impact: 'medium' },
    ],
    confirmedLineup: [
      { name: 'André Onana', number: 24, position: 'Goalkeeper', status: 'available', impact: 'high' },
      { name: 'Harry Maguire', number: 5, position: 'Defender', status: 'available', impact: 'high' },
      { name: 'Nemanja Matic', number: 31, position: 'Midfielder', status: 'available', impact: 'medium' },
      { name: 'Bruno Fernandes', number: 8, position: 'Midfielder', status: 'available', impact: 'high' },
      { name: 'Jadon Sancho', number: 25, position: 'Forward', status: 'available', impact: 'high' },
    ],
    lastUpdate: '2 hours ago',
  },
  away: {
    team: 'Liverpool',
    injuries: [
      { name: 'Diogo Jota', number: 20, position: 'Forward', status: 'injured', injuryType: 'Knee injury', returnDate: '2026-07-05', impact: 'high' },
    ],
    confirmedLineup: [
      { name: 'Alisson Becker', number: 1, position: 'Goalkeeper', status: 'available', impact: 'high' },
      { name: 'Virgil van Dijk', number: 4, position: 'Defender', status: 'available', impact: 'high' },
      { name: 'Trent Alexander-Arnold', number: 66, position: 'Defender', status: 'available', impact: 'medium' },
      { name: 'Mohamed Salah', number: 11, position: 'Forward', status: 'available', impact: 'high' },
      { name: 'Luis Díaz', number: 7, position: 'Forward', status: 'available', impact: 'high' },
    ],
    lastUpdate: '30 minutes ago',
  },
};

interface InjuryLineupUpdatesProps {
  matchId?: string;
}

export function InjuryLineupUpdates({ matchId }: InjuryLineupUpdatesProps) {
  const [selectedTeam, setSelectedTeam] = useState<'home' | 'away'>('home');
  
  const currentTeam = selectedTeam === 'home' ? mockLineups.home : mockLineups.away;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-primary/20 text-primary border-primary/30';
      case 'injured':
        return 'bg-destructive/20 text-destructive border-destructive/30';
      case 'suspended':
        return 'bg-accent/20 text-accent border-accent/30';
      case 'doubtful':
        return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      default:
        return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'high':
        return <AlertTriangle size={16} className="text-destructive" />;
      case 'medium':
        return <Zap size={16} className="text-accent" />;
      case 'low':
        return <Clock size={16} className="text-secondary" />;
      default:
        return null;
    }
  };

  const totalInjuries = currentTeam.injuries.length;
  const availablePlayers = currentTeam.confirmedLineup.length;

  return (
    <div className="space-y-6">
      {/* Team Selector */}
      <div className="flex gap-2 bg-card/50 border border-primary/20 rounded-lg p-2 mb-6">
        <button
          onClick={() => setSelectedTeam('home')}
          className={`flex-1 py-2 px-4 rounded-md transition-all font-semibold ${
            selectedTeam === 'home'
              ? 'bg-primary/30 text-primary border border-primary/50'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {mockLineups.home.team}
        </button>
        <button
          onClick={() => setSelectedTeam('away')}
          className={`flex-1 py-2 px-4 rounded-md transition-all font-semibold ${
            selectedTeam === 'away'
              ? 'bg-secondary/30 text-secondary border border-secondary/50'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {mockLineups.away.team}
        </button>
      </div>

      {/* Team Status Overview */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card border border-primary/20 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users size={16} className="text-primary" />
            <p className="text-xs text-muted-foreground">Available Players</p>
          </div>
          <p className="text-2xl font-bold text-primary">{availablePlayers}</p>
        </div>
        <div className="bg-card border border-destructive/20 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={16} className="text-destructive" />
            <p className="text-xs text-muted-foreground">Injuries</p>
          </div>
          <p className="text-2xl font-bold text-destructive">{totalInjuries}</p>
        </div>
        <div className="bg-card border border-secondary/20 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={16} className="text-secondary" />
            <p className="text-xs text-muted-foreground">Last Update</p>
          </div>
          <p className="text-sm font-bold text-secondary">{currentTeam.lastUpdate}</p>
        </div>
      </div>

      {/* Injuries Section */}
      {currentTeam.injuries.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Injury Report</h3>
          <div className="space-y-3">
            {currentTeam.injuries.map((player, idx) => (
              <div key={idx} className={`border rounded-lg p-4 flex items-start justify-between ${getStatusColor(player.status)}`}>
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-10 h-10 rounded-full bg-background/30 flex items-center justify-center font-bold text-sm">
                    {player.number}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{player.name}</p>
                    <p className="text-xs text-muted-foreground">{player.position}</p>
                    <p className="text-xs font-medium mt-1">{player.injuryType}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2">
                    {getImpactIcon(player.impact)}
                    <span className="text-xs font-bold capitalize">{player.impact} Impact</span>
                  </div>
                  {player.returnDate && (
                    <span className="text-xs text-muted-foreground">
                      Returns: {new Date(player.returnDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Confirmed Lineup */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Confirmed Lineup</h3>
        <div className="grid grid-cols-1 gap-2">
          {currentTeam.confirmedLineup.map((player, idx) => (
            <div
              key={idx}
              className={`border rounded-lg p-3 flex items-center justify-between transition-all hover:bg-card/50 ${getStatusColor(player.status)}`}
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="w-8 h-8 rounded-full bg-background/30 flex items-center justify-center font-bold text-xs">
                  {player.number}
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">{player.name}</p>
                  <p className="text-xs text-muted-foreground">{player.position}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getImpactIcon(player.impact)}
                <CheckCircle2 size={16} className="text-primary" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Impact Assessment */}
      <div className="bg-gradient-to-r from-destructive/10 to-accent/10 border border-destructive/30 rounded-lg p-4 space-y-3">
        <h4 className="font-semibold text-foreground flex items-center gap-2">
          <AlertTriangle size={16} className="text-destructive" />
          Prediction Impact
        </h4>
        <p className="text-sm text-muted-foreground">
          {totalInjuries === 0
            ? 'No key injuries reported. Full squad available for selection.'
            : `${totalInjuries} player${totalInjuries > 1 ? 's' : ''} unavailable. This may affect ${currentTeam.team}'s attacking/defensive capabilities.`}
        </p>
        <p className="text-xs text-foreground font-semibold">
          Prediction Adjustment: {totalInjuries === 0 ? 'No change' : `-${totalInjuries * 2}% confidence for affected outcomes`}
        </p>
      </div>
    </div>
  );
}
