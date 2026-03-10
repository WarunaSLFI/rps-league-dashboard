import { Router } from 'express';
import type { HealthCheckResponse } from '@shared/types/api.js';

const router = Router();

router.get('/health', (_req, res) => {
  const response: HealthCheckResponse = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  };

  res.json(response);
});

export default router;
