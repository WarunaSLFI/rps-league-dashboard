import { useState, useCallback } from 'react';
import type { Match } from '@shared/types/match';
import { fetchPlayerMatches } from '../api/rps-api';

interface UsePlayerMatchesResult {
  data: Match[] | null; // null means hasn't searched yet
  isLoading: boolean;
  error: string | null;
  search: (playerName: string) => Promise<void>;
  clear: () => void;
}

export function usePlayerMatches(): UsePlayerMatchesResult {
  const [data, setData] = useState<Match[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (playerName: string) => {
    if (!playerName.trim()) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetchPlayerMatches(playerName.trim());
      setData(response.data);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred');
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return { data, isLoading, error, search, clear };
}
