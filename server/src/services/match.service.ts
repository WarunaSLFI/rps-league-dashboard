import { env } from '../config/env.js';
import { fetchHistoryPage } from '../clients/rps-api.client.js';
import type { LegacyMatchResult } from '../types/legacy-api.js';
import type { Match, LeaderboardEntry } from '@shared/types/match.js';

/**
 * Service layer — fetches from the legacy API, normalizes data,
 * and applies business logic (filtering, aggregation).
 */

// ─── Normalization ───────────────────────────────────────────────

export function calculateWinner(
  moveA: string,
  moveB: string,
): 'PLAYER_A' | 'PLAYER_B' | 'DRAW' {
  if (moveA === moveB) return 'DRAW';
  if (
    (moveA === 'ROCK' && moveB === 'SCISSORS') ||
    (moveA === 'PAPER' && moveB === 'ROCK') ||
    (moveA === 'SCISSORS' && moveB === 'PAPER')
  ) {
    return 'PLAYER_A';
  }
  return 'PLAYER_B';
}

export function normalizeMatch(raw: LegacyMatchResult): Match {
  const result = calculateWinner(raw.playerA.played, raw.playerB.played);
  const winner =
    result === 'PLAYER_A'
      ? raw.playerA.name
      : result === 'PLAYER_B'
        ? raw.playerB.name
        : null;

  return {
    id: raw.gameId,
    timestamp: new Date(raw.time).toISOString(),
    playerA: { name: raw.playerA.name, move: raw.playerA.played },
    playerB: { name: raw.playerB.name, move: raw.playerB.played },
    winner,
    result,
  };
}

// ─── Pagination helper ───────────────────────────────────────────

/**
 * Fetches pages from the legacy API up to a safety cap.
 * The cap prevents runaway fetching if the API returns
 * an unexpectedly large dataset.
 *
 * The legacy API returns a `cursor` field containing the path to the
 * next page (e.g. "/history?cursor=abc123"). We pass this directly
 * to fetchHistoryPage rather than constructing the URL ourselves.
 */
async function fetchPages(maxPages?: number): Promise<LegacyMatchResult[]> {
  const cap = maxPages ?? env.maxPaginationPages;
  const allResults: LegacyMatchResult[] = [];
  let nextPath: string | undefined;
  let pagesLoaded = 0;

  while (pagesLoaded < cap) {
    const page = await fetchHistoryPage(nextPath);
    allResults.push(...page.data);
    pagesLoaded++;

    if (!page.cursor) break;
    nextPath = page.cursor;
  }

  return allResults;
}

// ─── Public API ──────────────────────────────────────────────────

/**
 * Returns the most recent matches, normalized and sorted by timestamp desc.
 */
export async function getLatestMatches(limit = 20): Promise<Match[]> {
  const raw = await fetchPages();
  return raw
    .map(normalizeMatch)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit);
}

/**
 * Returns matches for a specific player (case-insensitive, trimmed).
 */
export async function getPlayerMatches(playerName: string): Promise<Match[]> {
  const needle = playerName.trim().toLowerCase();
  const raw = await fetchPages();

  return raw
    .filter(
      (m) =>
        m.playerA.name.trim().toLowerCase() === needle ||
        m.playerB.name.trim().toLowerCase() === needle,
    )
    .map(normalizeMatch)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

/**
 * Returns today's leaderboard — aggregated from matches played today.
 *
 * "Today" is calculated using the server's local date (UTC).
 * This is a deliberate simplification: for a production app you'd
 * want to consider the user's timezone, but UTC is predictable
 * and appropriate for a take-home assignment.
 */
export function calculateLeaderboard(matches: LegacyMatchResult[]): LeaderboardEntry[] {
  const stats = new Map<string, { wins: number; losses: number }>();

  const getOrCreate = (name: string) => {
    const key = name.trim();
    if (!stats.has(key)) {
      stats.set(key, { wins: 0, losses: 0 });
    }
    return stats.get(key)!;
  };

  for (const match of matches) {
    const a = getOrCreate(match.playerA.name);
    const b = getOrCreate(match.playerB.name);

    const result = calculateWinner(match.playerA.played, match.playerB.played);

    if (result === 'PLAYER_A') {
      a.wins++;
      b.losses++;
    } else if (result === 'PLAYER_B') {
      b.wins++;
      a.losses++;
    }
    // Draws don't affect win/loss counts
  }

  // Build ranked leaderboard sorted by win rate, then total wins
  const entries: LeaderboardEntry[] = Array.from(stats.entries())
    .map(([name, { wins, losses }]) => {
      const total = wins + losses;
      return {
        rank: 0,
        name,
        wins,
        losses,
        winRate: total > 0 ? Math.round((wins / total) * 100) / 100 : 0,
      };
    })
    .sort((a, b) => b.winRate - a.winRate || b.wins - a.wins);

  // Assign ranks
  entries.forEach((entry, i) => {
    entry.rank = i + 1;
  });

  return entries;
}

export async function getTodayLeaderboard(): Promise<LeaderboardEntry[]> {
  const raw = await fetchPages();

  // Today = start of current UTC day
  const now = new Date();
  const todayStart = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );

  const todayMatches = raw.filter((m) => m.time >= todayStart.getTime());

  return calculateLeaderboard(todayMatches);
}

/**
 * Returns a leaderboard computed from matches falling within a specific date range.
 * Both `from` and `to` are expected to be valid Date objects.
 */
export async function getLeaderboardForRange(from: Date, to: Date): Promise<LeaderboardEntry[]> {
  const raw = await fetchPages();

  const rangeMatches = raw.filter((m) => {
    return m.time >= from.getTime() && m.time <= to.getTime();
  });

  return calculateLeaderboard(rangeMatches);
}
