import { env } from '../config/env.js';
import { fetchHistoryPage } from '../clients/rps-api.client.js';
import type { LegacyMatchResult } from '../types/legacy-api.js';
import type { Match, LeaderboardEntry } from '@shared/types/match.js';

/**
 * Service layer — fetches from the legacy API, normalizes data,
 * and applies business logic (filtering, aggregation).
 */

// ─── Normalization ───────────────────────────────────────────────

function normalizeMatch(raw: LegacyMatchResult): Match {
  const winner =
    raw.gameResult === 'PLAYER_A'
      ? raw.playerA.name
      : raw.gameResult === 'PLAYER_B'
        ? raw.playerB.name
        : null;

  return {
    id: raw.gameId,
    timestamp: new Date(raw.t).toISOString(),
    playerA: { name: raw.playerA.name, move: raw.playerA.played },
    playerB: { name: raw.playerB.name, move: raw.playerB.played },
    winner,
    result: raw.gameResult,
  };
}

// ─── Pagination helper ───────────────────────────────────────────

/**
 * Fetches pages from the legacy API up to a safety cap.
 * The cap prevents runaway fetching if the API returns
 * an unexpectedly large dataset.
 */
async function fetchPages(maxPages?: number): Promise<LegacyMatchResult[]> {
  const cap = maxPages ?? env.maxPaginationPages;
  const allResults: LegacyMatchResult[] = [];
  let cursor: string | undefined;
  let pagesLoaded = 0;

  while (pagesLoaded < cap) {
    const page = await fetchHistoryPage(cursor);
    allResults.push(...page.data);
    pagesLoaded++;

    if (!page.cursor) break;
    cursor = page.cursor;
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
export async function getTodayLeaderboard(): Promise<LeaderboardEntry[]> {
  const raw = await fetchPages();

  // Today = start of current UTC day
  const now = new Date();
  const todayStart = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );

  const todayMatches = raw.filter((m) => m.t >= todayStart.getTime());

  // Aggregate wins and losses per player
  const stats = new Map<string, { wins: number; losses: number }>();

  const getOrCreate = (name: string) => {
    const key = name.trim();
    if (!stats.has(key)) {
      stats.set(key, { wins: 0, losses: 0 });
    }
    return stats.get(key)!;
  };

  for (const match of todayMatches) {
    const a = getOrCreate(match.playerA.name);
    const b = getOrCreate(match.playerB.name);

    if (match.gameResult === 'PLAYER_A') {
      a.wins++;
      b.losses++;
    } else if (match.gameResult === 'PLAYER_B') {
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
