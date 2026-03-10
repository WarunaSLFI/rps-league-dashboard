import 'dotenv/config';

export const env = {
  port: parseInt(process.env.PORT || '3001', 10),

  rpsApi: {
    baseUrl: process.env.RPS_API_BASE_URL || 'https://bad-api-assignment.reaktor.com',
    token: process.env.RPS_API_TOKEN || '',
  },

  /** Maximum number of pages to fetch from the legacy API per request. */
  maxPaginationPages: parseInt(process.env.MAX_PAGINATION_PAGES || '10', 10),
} as const;

/**
 * Validate that required environment variables are present.
 * Called once at startup — fails fast with a clear error.
 */
export function validateEnv(): void {
  const warnings: string[] = [];

  if (!env.rpsApi.token) {
    warnings.push('RPS_API_TOKEN is not set — legacy API requests may fail');
  }

  if (warnings.length > 0) {
    console.warn('⚠️  Environment warnings:');
    warnings.forEach((w) => console.warn(`   - ${w}`));
  }
}
