import { Router } from 'express';
import type { ApiResponse } from '@shared/types/api.js';
import type { Match } from '@shared/types/match.js';
import { getLatestMatches, getPlayerMatches } from '../services/match.service.js';

const router = Router();

/** GET /api/matches/latest — returns recent matches */
router.get('/matches/latest', async (req, res, next) => {
  try {
    const limit = Math.min(
      Math.max(parseInt(req.query.limit as string, 10) || 20, 1),
      100,
    );

    const matches = await getLatestMatches(limit);

    const response: ApiResponse<Match[]> = {
      data: matches,
      meta: { timestamp: new Date().toISOString(), count: matches.length },
    };

    res.json(response);
  } catch (err) {
    next(err);
  }
});

/** GET /api/players/:playerName/matches — returns matches for a player */
router.get('/players/:playerName/matches', async (req, res, next) => {
  try {
    const { playerName } = req.params;

    if (!playerName || playerName.trim().length === 0) {
      res.status(400).json({
        error: { message: 'Player name is required', statusCode: 400 },
      });
      return;
    }

    const matches = await getPlayerMatches(playerName);

    const response: ApiResponse<Match[]> = {
      data: matches,
      meta: {
        timestamp: new Date().toISOString(),
        player: playerName.trim(),
        count: matches.length,
      },
    };

    res.json(response);
  } catch (err) {
    next(err);
  }
});

export default router;
