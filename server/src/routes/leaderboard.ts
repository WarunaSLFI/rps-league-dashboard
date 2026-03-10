import { Router } from 'express';
import type { ApiResponse } from '@shared/types/api.js';
import type { LeaderboardEntry } from '@shared/types/match.js';
import { getTodayLeaderboard } from '../services/match.service.js';

const router = Router();

/**
 * GET /api/leaderboard/today
 *
 * Returns today's leaderboard based on matches played since
 * the start of the current UTC day. See match.service.ts for
 * the "today" calculation rationale.
 */
router.get('/leaderboard/today', async (_req, res, next) => {
  try {
    const leaderboard = await getTodayLeaderboard();

    const response: ApiResponse<LeaderboardEntry[]> = {
      data: leaderboard,
      meta: {
        timestamp: new Date().toISOString(),
        date: new Date().toISOString().split('T')[0],
        playerCount: leaderboard.length,
      },
    };

    res.json(response);
  } catch (err) {
    next(err);
  }
});

export default router;
