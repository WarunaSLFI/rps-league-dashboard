/**
 * Generic API response wrapper.
 * Used consistently across all endpoints for predictable response shapes.
 */
export interface ApiResponse<T> {
  data: T;
  meta?: {
    timestamp: string;
    [key: string]: unknown;
  };
}

/**
 * Health check endpoint response.
 */
export interface HealthCheckResponse {
  status: 'ok' | 'error';
  timestamp: string;
  uptime: number;
}
