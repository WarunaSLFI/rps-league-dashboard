import { useState, useCallback } from 'react';
import type { LeaderboardEntry } from '@shared/types/match';
import { fetchHistoricalLeaderboard } from '../api/rps-api';

interface UseHistoricalLeaderboardResult {
  data: LeaderboardEntry[] | null; // null means hasn't searched yet
  isLoading: boolean;
  error: string | null;
  search: (from: string, to: string) => Promise<void>;
}

export function useHistoricalLeaderboard(): UseHistoricalLeaderboardResult {
  const [data, setData] = useState<LeaderboardEntry[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (from: string, to: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchHistoricalLeaderboard(from, to);
      setData(result.data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to load historical leaderboard');
      }
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { data, isLoading, error, search };
}
