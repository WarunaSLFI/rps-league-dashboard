/**
 * Types matching the raw legacy RPS API response shapes.
 *
 * These are intentionally separate from our clean internal types.
 * The legacy API uses awkward structures (nested players, single-letter
 * field names) that we normalize in the service layer.
 *
 * ⚠️  ASSUMPTION: The exact field names and nesting below are based on
 * the Reaktor RPS assignment's known patterns. These have not been
 * verified against a live response yet. If the real payload differs,
 * the fix is localized to this file + the normalizeMatch() function
 * in match.service.ts.
 */

export type LegacyMove = 'ROCK' | 'PAPER' | 'SCISSORS';

export interface LegacyPlayer {
  name: string;
  played: LegacyMove;
}

/** A single match record from GET /history */
export interface LegacyMatchResult {
  gameId: string;
  /** Unix epoch timestamp */
  time: number;
  type: string;
  playerA: LegacyPlayer;
  playerB: LegacyPlayer;
}

/**
 * Paginated response from GET /history.
 *
 * The API returns a `cursor` field containing the **path** to the next
 * page (e.g. "/history?cursor=abc123"), not just a cursor token.
 * When `cursor` is null, there are no more pages.
 */
export interface LegacyHistoryPage {
  cursor: string | null;
  data: LegacyMatchResult[];
}
