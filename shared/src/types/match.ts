/**
 * Internal domain types for match and leaderboard data.
 * Used by both client and server — this is the "clean" shape
 * after normalizing the legacy API's awkward structure.
 */

export type Move = 'ROCK' | 'PAPER' | 'SCISSORS';

export interface MatchPlayer {
  name: string;
  move: Move;
}

export interface Match {
  id: string;
  timestamp: string;
  playerA: MatchPlayer;
  playerB: MatchPlayer;
  /** Name of the winning player, or null for a draw */
  winner: string | null;
  result: 'PLAYER_A' | 'PLAYER_B' | 'DRAW';
}

/**
 * Flattened leaderboard entry — no nested PlayerStats object.
 * Designed for direct use by frontend tables/lists.
 */
export interface LeaderboardEntry {
  rank: number;
  name: string;
  wins: number;
  losses: number;
  winRate: number;
}
