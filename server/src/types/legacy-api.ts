/**
 * Types matching the raw legacy Reaktor RPS API response shapes.
 *
 * These are intentionally separate from our clean internal types.
 * The legacy API uses awkward structures (nested players, single-letter
 * field names) that we normalize in the service layer.
 */

export type LegacyMove = 'ROCK' | 'PAPER' | 'SCISSORS';

export type LegacyGameResult = 'PLAYER_A' | 'PLAYER_B' | 'DRAW';

export interface LegacyPlayer {
  name: string;
  played: LegacyMove;
}

/** A single match record from GET /rps/history */
export interface LegacyMatchResult {
  gameId: string;
  /** ISO timestamp — the legacy API uses "t" as the field name */
  t: number;
  type: string;
  playerA: LegacyPlayer;
  playerB: LegacyPlayer;
  gameResult: LegacyGameResult;
}

/** Paginated response from GET /rps/history */
export interface LegacyHistoryPage {
  cursor: string | null;
  data: LegacyMatchResult[];
}
