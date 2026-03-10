import { describe, it, expect } from 'vitest';
import {
  calculateWinner,
  normalizeMatch,
  calculateLeaderboard,
} from '../src/services/match.service.js';
import type { LegacyMatchResult } from '../src/types/legacy-api.js';

describe('Match Service Business Logic', () => {
  describe('calculateWinner', () => {
    it('should correctly identify PLAYER_A as the winner', () => {
      expect(calculateWinner('ROCK', 'SCISSORS')).toBe('PLAYER_A');
      expect(calculateWinner('PAPER', 'ROCK')).toBe('PLAYER_A');
      expect(calculateWinner('SCISSORS', 'PAPER')).toBe('PLAYER_A');
    });

    it('should correctly identify PLAYER_B as the winner', () => {
      expect(calculateWinner('SCISSORS', 'ROCK')).toBe('PLAYER_B');
      expect(calculateWinner('ROCK', 'PAPER')).toBe('PLAYER_B');
      expect(calculateWinner('PAPER', 'SCISSORS')).toBe('PLAYER_B');
    });

    it('should correctly identify a DRAW', () => {
      expect(calculateWinner('ROCK', 'ROCK')).toBe('DRAW');
      expect(calculateWinner('PAPER', 'PAPER')).toBe('DRAW');
      expect(calculateWinner('SCISSORS', 'SCISSORS')).toBe('DRAW');
    });
  });

  describe('normalizeMatch', () => {
    it('should map LegacyMatchResult to the internal Match domain object correctly', () => {
      const rawMatch: LegacyMatchResult = {
        gameId: 'test-123',
        time: 1773163531000,
        type: 'GAME_RESULT',
        playerA: { name: 'Player One', played: 'PAPER' },
        playerB: { name: 'Player Two', played: 'ROCK' },
      };

      const expectedIso = new Date(1773163531000).toISOString();

      const result = normalizeMatch(rawMatch);

      expect(result).toEqual({
        id: 'test-123',
        timestamp: expectedIso,
        playerA: { name: 'Player One', move: 'PAPER' },
        playerB: { name: 'Player Two', move: 'ROCK' },
        winner: 'Player One', // PLAYER_A wins
        result: 'PLAYER_A',
      });
    });
  });

  describe('calculateLeaderboard', () => {
    it('should correctly aggregate wins, losses, win rates, and sort by rank', () => {
      // 10 matches total: 
      // A: 4 wins, 1 loss
      // B: 1 win, 5 losses
      // C: 2 wins, 0 losses
      const rawMatches: LegacyMatchResult[] = [
        createMockMatch('Player A', 'ROCK', 'Player B', 'SCISSORS'), // A wins (A:1-0, B:0-1)
        createMockMatch('Player A', 'ROCK', 'Player B', 'SCISSORS'), // A wins (A:2-0, B:0-2)
        createMockMatch('Player A', 'ROCK', 'Player B', 'SCISSORS'), // A wins (A:3-0, B:0-3)
        createMockMatch('Player A', 'ROCK', 'Player B', 'SCISSORS'), // A wins (A:4-0, B:0-4)
        createMockMatch('Player B', 'ROCK', 'Player A', 'SCISSORS'), // B wins (A:4-1, B:1-4)
        createMockMatch('Player C', 'ROCK', 'Player B', 'SCISSORS'), // C wins (C:1-0, B:1-5)
        createMockMatch('Player C', 'ROCK', 'Player B', 'SCISSORS'), // C wins (C:2-0, B:1-6)
        createMockMatch('Player A', 'ROCK', 'Player B', 'ROCK'),     // DRAW
      ];

      const leaderboard = calculateLeaderboard(rawMatches);

      // Expected standings based on sorting:
      // 1. Player C: 2 wins, 0 losses = 1.00 win rate
      // 2. Player A: 4 wins, 1 loss = 0.80 win rate
      // 3. Player B: 1 win, 5 losses = 0.17 win rate

      expect(leaderboard).toHaveLength(3);

      expect(leaderboard[0]).toEqual({
        rank: 1,
        name: 'Player C',
        wins: 2,
        losses: 0,
        winRate: 1.00,
      });

      expect(leaderboard[1]).toEqual({
        rank: 2,
        name: 'Player A',
        wins: 4,
        losses: 1,
        winRate: 0.80,
      });

      expect(leaderboard[2]).toEqual({
        rank: 3,
        name: 'Player B',
        wins: 1,
        losses: 6,
        winRate: 0.14, // 1 / 7 = 14.28% -> 0.14 rounded
      });
    });
  });
});

// Helper for brevity
function createMockMatch(
  nameA: string,
  moveA: 'ROCK' | 'PAPER' | 'SCISSORS',
  nameB: string,
  moveB: 'ROCK' | 'PAPER' | 'SCISSORS'
): LegacyMatchResult {
  return {
    gameId: Math.random().toString(),
    time: Date.now(),
    type: 'GAME_RESULT',
    playerA: { name: nameA, played: moveA },
    playerB: { name: nameB, played: moveB },
  };
}
