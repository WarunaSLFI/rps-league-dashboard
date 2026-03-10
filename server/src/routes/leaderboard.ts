import { Router } from 'express';
import type { ApiResponse } from '@shared/types/api.js';
import type { LeaderboardEntry } from '@shared/types/match.js';
import { getTodayLeaderboard, getLeaderboardForRange } from '../services/match.service.js';

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

/**
 * GET /api/leaderboard/range
 *
 * Query parameters:
 * - from (ISO date)
 * - to (ISO date)
 *
 * Returns a leaderboard aggregated from matches within the specified date range.
 */
router.get('/leaderboard/range', async (req, res, next) => {
  try {
    const fromStr = req.query.from as string;
    const toStr = req.query.to as string;

    if (!fromStr || !toStr) {
      res.status(400).json({ error: 'Missing from or to parameters' });
      return;
    }

    const fromDate = new Date(fromStr);
    const toDate = new Date(toStr);

    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      res.status(400).json({ error: 'Invalid date parameters' });
      return;
    }

    // If a short YYYY-MM-DD string is provided, expand end date to 23:59:59.999
    if (toStr.length === 10) {
      toDate.setUTCHours(23, 59, 59, 999);
    }

    const leaderboard = await getLeaderboardForRange(fromDate, toDate);

    // Extending type locally since we add custom meta fields specifically requested for this endpoint
    const response = {
      data: leaderboard,
      meta: {
        from: fromDate.toISOString(),
        to: toDate.toISOString(),
        playerCount: leaderboard.length,
      },
    };

    res.json(response);
  } catch (err) {
    next(err);
  }
});

export default router;
