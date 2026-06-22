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
    return json.data || [];
  } catch (error) {
    console.error('API Error:', error, '- Falling back to mock data');
    return mockMatches;
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

// --- React Query Hooks ---

export const useMatches = (sportFilter: string) => {
  return useQuery({
    queryKey: ['matches'],
    queryFn: fetchMatches,
    select: (data) => {
      if (sportFilter === 'all') return data;
      return data.filter((m) => m.sport === sportFilter);
    },
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
      // Invalidate bankroll queries here if needed
      queryClient.invalidateQueries({ queryKey: ['bankroll'] });
    },
  });
};
