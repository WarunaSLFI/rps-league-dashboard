import express from 'express';
import cors from 'cors';
import { env, validateEnv } from './config/env.js';
import { errorHandler } from './middleware/error-handler.js';
import healthRouter from './routes/health.js';
import matchesRouter from './routes/matches.js';
import leaderboardRouter from './routes/leaderboard.js';

validateEnv();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', healthRouter);
app.use('/api', matchesRouter);
app.use('/api', leaderboardRouter);

// Error handling (must be registered after routes)
app.use(errorHandler);

// Start
app.listen(env.port, () => {
  console.log(`🚀 Server running on http://localhost:${env.port}`);
  console.log(`   Health:      http://localhost:${env.port}/api/health`);
  console.log(`   Matches:     http://localhost:${env.port}/api/matches/latest`);
  console.log(`   Leaderboard: http://localhost:${env.port}/api/leaderboard/today`);
});
