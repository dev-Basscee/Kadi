'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, X, Clock, TrendingUp } from 'lucide-react';
import { mockMatches } from '@/lib/mockData';

export function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>(['Manchester United', 'Liverpool', 'Real Madrid']);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredMatches = searchQuery.trim()
    ? mockMatches.filter(
        (match) =>
          match.homeTeam.toLowerCase().includes(searchQuery.toLowerCase()) ||
          match.awayTeam.toLowerCase().includes(searchQuery.toLowerCase()) ||
          match.league?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleSelectMatch = (homeTeam: string, awayTeam: string) => {
    setSearchQuery('');
    setIsOpen(false);
    // Search would navigate to the match
  };

  const handleRecentSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          placeholder="Search matches, teams, leagues..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="w-full pl-10 pr-10 py-2 rounded-lg bg-card border border-primary/20 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery('');
              setIsOpen(false);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Dropdown Results */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-primary/20 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
          {/* Search Results */}
          {searchQuery && filteredMatches.length > 0 && (
            <div>
              <div className="px-4 py-2 text-xs font-bold text-muted-foreground border-b border-primary/10">
                MATCHES ({filteredMatches.length})
              </div>
              {filteredMatches.map((match) => (
                <button
                  key={match.id}
                  onClick={() => handleSelectMatch(match.homeTeam, match.awayTeam)}
                  className="w-full text-left px-4 py-3 hover:bg-primary/10 transition-colors border-b border-primary/10 last:border-b-0"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {match.homeTeam} vs {match.awayTeam}
                      </p>
                      <p className="text-xs text-muted-foreground">{match.league} • {match.time}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-primary">{match.prediction.confidence}%</p>
                      <p className="text-xs text-muted-foreground">{match.odds.toFixed(2)}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* No Results */}
          {searchQuery && filteredMatches.length === 0 && (
            <div className="px-4 py-8 text-center text-muted-foreground">
              <Search className="w-6 h-6 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No matches found for "{searchQuery}"</p>
            </div>
          )}

          {/* Recent Searches */}
          {!searchQuery && recentSearches.length > 0 && (
            <div>
              <div className="px-4 py-2 text-xs font-bold text-muted-foreground border-b border-primary/10 flex items-center gap-2">
                <Clock size={12} />
                RECENT SEARCHES
              </div>
              {recentSearches.map((search) => (
                <button
                  key={search}
                  onClick={() => handleRecentSearch(search)}
                  className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-primary/10 transition-colors"
                >
                  {search}
                </button>
              ))}
            </div>
          )}

          {/* Trending */}
          {!searchQuery && (
            <div>
              <div className="px-4 py-2 text-xs font-bold text-muted-foreground border-t border-primary/10 flex items-center gap-2">
                <TrendingUp size={12} />
                TRENDING NOW
              </div>
              <button className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-primary/10 transition-colors">
                Manchester City vs Liverpool
              </button>
              <button className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-primary/10 transition-colors">
                Real Madrid vs Barcelona
              </button>
              <button className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-primary/10 transition-colors">
                Arsenal vs Chelsea
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
