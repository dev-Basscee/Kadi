'use client';

import { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';

export interface FilterOptions {
  minOdds: number;
  maxOdds: number;
  minConfidence: number;
  leagues: string[];
  formRange: [number, number];
  resultType: 'all' | 'win' | 'draw' | 'loss';
}

interface AdvancedFiltersProps {
  onFiltersChange: (filters: FilterOptions) => void;
  isOpen: boolean;
  onToggle: (open: boolean) => void;
}

const leagues = ['Premier League', 'La Liga', 'Serie A', 'Bundesliga', 'Ligue 1', 'NBA', 'ATP', 'Cricket'];

export function AdvancedFilters({ onFiltersChange, isOpen, onToggle }: AdvancedFiltersProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    minOdds: 1.0,
    maxOdds: 5.0,
    minConfidence: 0,
    leagues: [],
    formRange: [0, 100],
    resultType: 'all',
  });

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const toggleLeague = (league: string) => {
    const updatedLeagues = filters.leagues.includes(league)
      ? filters.leagues.filter((l) => l !== league)
      : [...filters.leagues, league];
    handleFilterChange('leagues', updatedLeagues);
  };

  const resetFilters = () => {
    const defaultFilters: FilterOptions = {
      minOdds: 1.0,
      maxOdds: 5.0,
      minConfidence: 0,
      leagues: [],
      formRange: [0, 100],
      resultType: 'all',
    };
    setFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  return (
    <div className="relative">
      {/* Filter Button */}
      <button
        onClick={() => onToggle(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-card border border-primary/30 rounded-lg hover:bg-card/80 transition-colors text-foreground font-medium"
      >
        <span>Filters</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-96 bg-card border border-primary/30 rounded-xl p-6 backdrop-blur-sm shadow-2xl z-50">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-foreground">Advanced Filters</h3>
            <button
              onClick={resetFilters}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Reset
            </button>
          </div>

          {/* Odds Range */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-3">Odds Range</label>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="text-xs text-muted-foreground mb-1 block">Min</label>
                <input
                  type="number"
                  min="1"
                  step="0.1"
                  value={filters.minOdds}
                  onChange={(e) => handleFilterChange('minOdds', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 bg-background border border-primary/20 rounded-lg text-foreground text-sm"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-muted-foreground mb-1 block">Max</label>
                <input
                  type="number"
                  max="10"
                  step="0.1"
                  value={filters.maxOdds}
                  onChange={(e) => handleFilterChange('maxOdds', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 bg-background border border-primary/20 rounded-lg text-foreground text-sm"
                />
              </div>
            </div>
          </div>

          {/* Confidence Threshold */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-foreground">Min Confidence</label>
              <span className="text-sm text-primary font-bold">{filters.minConfidence}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={filters.minConfidence}
              onChange={(e) => handleFilterChange('minConfidence', parseInt(e.target.value))}
              className="w-full h-2 bg-primary/20 rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>

          {/* Form Range */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-foreground">Team Form Range</label>
              <span className="text-sm text-secondary font-bold">
                {filters.formRange[0]} - {filters.formRange[1]}
              </span>
            </div>
            <div className="flex gap-3">
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={filters.formRange[0]}
                onChange={(e) =>
                  handleFilterChange('formRange', [
                    parseInt(e.target.value),
                    Math.max(parseInt(e.target.value), filters.formRange[1]),
                  ])
                }
                className="flex-1 h-2 bg-secondary/20 rounded-lg appearance-none cursor-pointer accent-secondary"
              />
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={filters.formRange[1]}
                onChange={(e) =>
                  handleFilterChange('formRange', [
                    Math.min(filters.formRange[0], parseInt(e.target.value)),
                    parseInt(e.target.value),
                  ])
                }
                className="flex-1 h-2 bg-secondary/20 rounded-lg appearance-none cursor-pointer accent-secondary"
              />
            </div>
          </div>

          {/* Leagues */}
          <div className="mb-6">
            <label className="text-sm font-medium text-foreground mb-3 block">Leagues</label>
            <div className="grid grid-cols-2 gap-2">
              {leagues.map((league) => (
                <button
                  key={league}
                  onClick={() => toggleLeague(league)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    filters.leagues.includes(league)
                      ? 'bg-primary/20 text-primary border border-primary/50'
                      : 'bg-background border border-primary/20 text-muted-foreground hover:border-primary/50'
                  }`}
                >
                  {league}
                </button>
              ))}
            </div>
          </div>

          {/* Result Type */}
          <div className="mb-6">
            <label className="text-sm font-medium text-foreground mb-3 block">Prediction Type</label>
            <div className="flex gap-2">
              {['all', 'win', 'draw', 'loss'].map((type) => (
                <button
                  key={type}
                  onClick={() => handleFilterChange('resultType', type)}
                  className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold uppercase transition-colors ${
                    filters.resultType === type
                      ? 'bg-accent/20 text-accent border border-accent/50'
                      : 'bg-background border border-muted/20 text-muted-foreground hover:border-muted/50'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Active Filters Count */}
          {(filters.leagues.length > 0 ||
            filters.minConfidence > 0 ||
            filters.minOdds > 1 ||
            filters.maxOdds < 5 ||
            filters.resultType !== 'all') && (
            <div className="pt-4 border-t border-primary/20 text-xs text-muted-foreground">
              {[
                filters.minConfidence > 0 && `Confidence: ${filters.minConfidence}%`,
                filters.minOdds > 1 && `Min Odds: ${filters.minOdds}`,
                filters.maxOdds < 5 && `Max Odds: ${filters.maxOdds}`,
                filters.leagues.length > 0 && `${filters.leagues.length} league(s)`,
                filters.resultType !== 'all' && `Type: ${filters.resultType}`,
              ]
                .filter(Boolean)
                .join(' • ')}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
