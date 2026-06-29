import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Match, BetRecord } from './mockData';

const API_BASE = 'http://localhost:8080/api/v1';

// We fallback to mock data if the API fails or is empty, to ensure the UI still renders during testing
import { mockMatches } from './mockData';

// --- API Fetchers ---

const fetchMatches = async (): Promise<Match[]> => {
  try {
    const res = await fetch(`${API_BASE}/matches`);
    if (!res.ok) throw new Error('Failed to fetch matches');
    const json = await res.json();
    const data = json.data || [];
    if (!data.length) return mockMatches;
    // Map backend snake_case Fixture fields → frontend Match type
    return data.map(mapFixtureToMatch);
  } catch (error) {
    console.error('API Error:', error, '- Falling back to mock data');
    return mockMatches;
  }
};

const fetchLiveMatches = async (): Promise<Match[]> => {
  try {
    const res = await fetch(`${API_BASE}/matches/live`);
    if (!res.ok) throw new Error('Failed to fetch live matches');
    const json = await res.json();
    return (json.data || []).map(mapFixtureToMatch);
  } catch (error) {
    console.error('Live API Error:', error);
    return mockMatches.filter((m) => m.status === 'live');
  }
};

const fetchDeepDive = async (matchId: string) => {
  const res = await fetch(`${API_BASE}/analysis/deep-dive`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ match_id: matchId }),
  });
  if (!res.ok) throw new Error('Failed to fetch deep dive analysis');
  return res.json();
};

const fetchExplanation = async (matchId: string) => {
  const res = await fetch(`${API_BASE}/analysis/explain/${matchId}`);
  if (!res.ok) throw new Error('Failed to fetch explanation');
  return res.json();
};

const placeBet = async (payload: { stake_amount: number; legs: { fixture_id: string; selection: string; odds: number }[] }) => {
  const res = await fetch(`${API_BASE}/bankroll/bets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to place bet');
  return res.json();
};

// Maps a raw backend Fixture (snake_case) to the frontend Match type.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapFixtureToMatch(f: any): Match {
  const oddsHome = Number(f.odds_home ?? f.oddsHome ?? 0);
  const oddsDraw = Number(f.odds_draw ?? f.oddsDraw ?? 0);
  const oddsAway = Number(f.odds_away ?? f.oddsAway ?? 0);

  return {
    id: f.id,
    sport: f.sport,
    date: new Date(f.match_date ?? f.matchDate),
    time: f.match_time ?? f.matchTime ?? '',
    homeTeam: f.home_team_name ?? f.homeTeamName ?? '',
    awayTeam: f.away_team_name ?? f.awayTeamName ?? '',
    homeTeamLogo: f.home_team_logo ?? f.homeTeamLogo ?? '',
    awayTeamLogo: f.away_team_logo ?? f.awayTeamLogo ?? '',
    prediction: f.prediction ?? { result: 'win', confidence: 50, color: 'blue' },
    // three-way odds from backend
    oddsHome,
    oddsDraw,
    oddsAway,
    // single 'odds' kept for backward compat — use the home odds as the headline
    odds: oddsHome || oddsDraw || oddsAway,
    isPremium: f.is_premium ?? f.isPremium ?? false,
    probabilityHome: Number(f.probability_home ?? f.probabilityHome ?? 0),
    probabilityDraw: Number(f.probability_draw ?? f.probabilityDraw ?? 0),
    probabilityAway: Number(f.probability_away ?? f.probabilityAway ?? 0),
    homeForm: f.home_form ?? f.homeForm ?? [],
    awayForm: f.away_form ?? f.awayForm ?? [],
    h2hStats: {
      homeWins: f.h2h_home_wins ?? f.h2hHomeWins ?? 0,
      awayWins: f.h2h_away_wins ?? f.h2hAwayWins ?? 0,
      draws: f.h2h_draws ?? f.h2hDraws ?? 0,
    },
    status: f.status,
    homeScore: f.home_score ?? f.homeScore,
    awayScore: f.away_score ?? f.awayScore,
    minute: f.minute,
    league: f.league ?? '',
  };
}

// --- React Query Hooks ---

export const useMatches = (sportFilter: string) => {
  return useQuery({
    queryKey: ['matches'],
    queryFn: fetchMatches,
    select: (data) => {
      if (sportFilter === 'all') return data;
      return data.filter((m) => m.sport === sportFilter);
    },
    // Refresh every 30s so odds stay fresh without needing a full reload
    refetchInterval: 30_000,
  });
};

/** Polls /matches/live every 15 seconds — the fastest safe interval for live odds. */
export const useLiveMatches = () => {
  return useQuery({
    queryKey: ['matches', 'live'],
    queryFn: fetchLiveMatches,
    refetchInterval: 15_000,
    staleTime: 10_000,
  });
};

export const useDeepDive = (matchId: string | undefined) => {
  return useQuery({
    queryKey: ['deep-dive', matchId],
    queryFn: () => fetchDeepDive(matchId!),
    enabled: !!matchId,
    staleTime: 5 * 60 * 1000, // Cache on frontend for 5 mins
  });
};

export const useExplanation = (matchId: string | undefined) => {
  return useQuery({
    queryKey: ['explanation', matchId],
    queryFn: () => fetchExplanation(matchId!),
    enabled: !!matchId,
    staleTime: 5 * 60 * 1000,
  });
};

export const usePlaceBet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: placeBet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bankroll'] });
      // Also invalidate live matches so odds update after bet
      queryClient.invalidateQueries({ queryKey: ['matches', 'live'] });
    },
  });
};
