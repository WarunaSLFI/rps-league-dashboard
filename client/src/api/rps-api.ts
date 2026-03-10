import type { Match, LeaderboardEntry } from '@shared/types/match';
import type { ApiResponse } from '@shared/types/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export async function fetchLatestMatches(): Promise<ApiResponse<Match[]>> {
  const res = await fetch(`${API_BASE_URL}/api/matches/latest`);
  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    throw new Error(errorBody?.error?.message || 'Failed to fetch latest matches');
  }
  return res.json();
}

export async function fetchTodayLeaderboard(): Promise<ApiResponse<LeaderboardEntry[]>> {
  const res = await fetch(`${API_BASE_URL}/api/leaderboard/today`);
  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    throw new Error(errorBody?.error?.message || 'Failed to fetch today leaderboard');
  }
  return res.json();
}

export async function fetchPlayerMatches(playerName: string): Promise<ApiResponse<Match[]>> {
  const res = await fetch(`${API_BASE_URL}/api/players/${encodeURIComponent(playerName)}/matches`);
  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    throw new Error(errorBody?.error?.message || 'Failed to fetch player matches');
  }
  return res.json();
}
