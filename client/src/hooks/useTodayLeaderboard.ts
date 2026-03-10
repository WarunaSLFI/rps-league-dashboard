import { useState, useEffect, useCallback } from 'react';
import type { LeaderboardEntry } from '@shared/types/match';
import { fetchTodayLeaderboard } from '../api/rps-api';

interface UseTodayLeaderboardResult {
  data: LeaderboardEntry[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useTodayLeaderboard(): UseTodayLeaderboardResult {
  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetchTodayLeaderboard();
      setData(response.data);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, isLoading, error, refetch: fetch };
}
