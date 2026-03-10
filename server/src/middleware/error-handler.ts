import type { Request, Response, NextFunction } from 'express';

/**
 * Lightweight error handler — returns consistent JSON error responses.
 * Intentionally avoids leaking stack traces or internal details.
 */
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  console.error(`[Error] ${err.message}`);

  // Determine if this is an upstream API failure
  const isUpstreamError =
    err.message.includes('Legacy API') ||
    err.message.includes('fetch failed') ||
    err.name === 'AbortError';

  const statusCode = isUpstreamError ? 502 : 500;
  const message = isUpstreamError
    ? 'Unable to reach the upstream data source'
    : 'An unexpected error occurred';

  res.status(statusCode).json({
    error: { message, statusCode },
  });
}
