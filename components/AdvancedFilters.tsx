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

const AVAILABLE_LEAGUES = ['Premier League', 'La Liga', 'Serie A', 'Bundesliga', 'Ligue 1', 'NBA', 'ATP', 'Cricket'];

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
      <FilterButton isOpen={isOpen} onToggle={onToggle} />

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-96 bg-card border border-primary/30 rounded-xl p-6 backdrop-blur-sm shadow-2xl z-50">
          <FilterHeader onReset={resetFilters} />
          <OddsRangeFilter minOdds={filters.minOdds} maxOdds={filters.maxOdds} onChange={handleFilterChange} />
          <ConfidenceFilter minConfidence={filters.minConfidence} onChange={handleFilterChange} />
          <FormRangeFilter formRange={filters.formRange} onChange={handleFilterChange} />
          <LeaguesFilter selectedLeagues={filters.leagues} onChange={handleFilterChange} />
          <ResultTypeFilter resultType={filters.resultType} onChange={handleFilterChange} />
          <ActiveFiltersBadge filters={filters} />
        </div>
      )}
    </div>
  );
}

function FilterButton({ isOpen, onToggle }: { isOpen: boolean; onToggle: (open: boolean) => void }) {
  return (
    <button
      onClick={() => onToggle(!isOpen)}
      className="flex items-center gap-2 px-4 py-2 bg-card border border-primary/30 rounded-lg hover:bg-card/80 transition-colors text-foreground font-medium"
    >
      <span>Filters</span>
      <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
    </button>
  );
}

function FilterHeader({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-lg font-bold text-foreground">Advanced Filters</h3>
      <button
        onClick={onReset}
        className="text-sm text-muted-foreground hover:text-primary transition-colors"
      >
        Reset
      </button>
    </div>
  );
}

function OddsRangeFilter({ minOdds, maxOdds, onChange }: { minOdds: number; maxOdds: number; onChange: (k: keyof FilterOptions, v: any) => void }) {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-foreground mb-3">Odds Range</label>
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <label className="text-xs text-muted-foreground mb-1 block">Min</label>
          <input
            type="number"
            min="1"
            step="0.1"
            value={minOdds}
            onChange={(e) => onChange('minOdds', parseFloat(e.target.value))}
            className="w-full px-3 py-2 bg-background border border-primary/20 rounded-lg text-foreground text-sm"
          />
        </div>
        <div className="flex-1">
          <label className="text-xs text-muted-foreground mb-1 block">Max</label>
          <input
            type="number"
            max="10"
            step="0.1"
            value={maxOdds}
            onChange={(e) => onChange('maxOdds', parseFloat(e.target.value))}
            className="w-full px-3 py-2 bg-background border border-primary/20 rounded-lg text-foreground text-sm"
          />
        </div>
      </div>
    </div>
  );
}

function ConfidenceFilter({ minConfidence, onChange }: { minConfidence: number; onChange: (k: keyof FilterOptions, v: any) => void }) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <label className="text-sm font-medium text-foreground">Min Confidence</label>
        <span className="text-sm text-primary font-bold">{minConfidence}%</span>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        step="5"
        value={minConfidence}
        onChange={(e) => onChange('minConfidence', parseInt(e.target.value))}
        className="w-full h-2 bg-primary/20 rounded-lg appearance-none cursor-pointer accent-primary"
      />
    </div>
  );
}

function FormRangeFilter({ formRange, onChange }: { formRange: [number, number]; onChange: (k: keyof FilterOptions, v: any) => void }) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <label className="text-sm font-medium text-foreground">Team Form Range</label>
        <span className="text-sm text-secondary font-bold">
          {formRange[0]} - {formRange[1]}
        </span>
      </div>
      <div className="flex gap-3">
        <input
          type="range"
          min="0"
          max="100"
          step="5"
          value={formRange[0]}
          onChange={(e) =>
            onChange('formRange', [
              parseInt(e.target.value),
              Math.max(parseInt(e.target.value), formRange[1]),
            ])
          }
          className="flex-1 h-2 bg-secondary/20 rounded-lg appearance-none cursor-pointer accent-secondary"
        />
        <input
          type="range"
          min="0"
          max="100"
          step="5"
          value={formRange[1]}
          onChange={(e) =>
            onChange('formRange', [
              Math.min(formRange[0], parseInt(e.target.value)),
              parseInt(e.target.value),
            ])
          }
          className="flex-1 h-2 bg-secondary/20 rounded-lg appearance-none cursor-pointer accent-secondary"
        />
      </div>
    </div>
  );
}

function LeaguesFilter({ selectedLeagues, onChange }: { selectedLeagues: string[]; onChange: (k: keyof FilterOptions, v: any) => void }) {
  const toggleLeague = (league: string) => {
    const updatedLeagues = selectedLeagues.includes(league)
      ? selectedLeagues.filter((l) => l !== league)
      : [...selectedLeagues, league];
    onChange('leagues', updatedLeagues);
  };

  return (
    <div className="mb-6">
      <label className="text-sm font-medium text-foreground mb-3 block">Leagues</label>
      <div className="grid grid-cols-2 gap-2">
        {AVAILABLE_LEAGUES.map((league) => (
          <button
            key={league}
            onClick={() => toggleLeague(league)}
            className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
              selectedLeagues.includes(league)
                ? 'bg-primary/20 text-primary border border-primary/50'
                : 'bg-background border border-primary/20 text-muted-foreground hover:border-primary/50'
            }`}
          >
            {league}
          </button>
        ))}
      </div>
    </div>
  );
}

function ResultTypeFilter({ resultType, onChange }: { resultType: string; onChange: (k: keyof FilterOptions, v: any) => void }) {
  return (
    <div className="mb-6">
      <label className="text-sm font-medium text-foreground mb-3 block">Prediction Type</label>
      <div className="flex gap-2">
        {['all', 'win', 'draw', 'loss'].map((type) => (
          <button
            key={type}
            onClick={() => onChange('resultType', type)}
            className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold uppercase transition-colors ${
              resultType === type
                ? 'bg-accent/20 text-accent border border-accent/50'
                : 'bg-background border border-muted/20 text-muted-foreground hover:border-muted/50'
            }`}
          >
            {type}
          </button>
        ))}
      </div>
    </div>
  );
}

function ActiveFiltersBadge({ filters }: { filters: FilterOptions }) {
  if (
    filters.leagues.length === 0 &&
    filters.minConfidence === 0 &&
    filters.minOdds <= 1 &&
    filters.maxOdds >= 5 &&
    filters.resultType === 'all'
  ) {
    return null;
  }

  return (
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
  );
}
