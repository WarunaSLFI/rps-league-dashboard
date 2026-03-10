import { env } from '../config/env.js';
import type { LegacyHistoryPage } from '../types/legacy-api.js';

/**
 * Thin HTTP client for the legacy Reaktor RPS API.
 * Responsible only for external communication — no data transformation.
 */

const TIMEOUT_MS = 10_000;

export async function fetchHistoryPage(
  cursor?: string,
): Promise<LegacyHistoryPage> {
  const url = new URL('/rps/history', env.rpsApi.baseUrl);
  if (cursor) {
    url.searchParams.set('cursor', cursor);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };

    if (env.rpsApi.token) {
      headers['Authorization'] = `Bearer ${env.rpsApi.token}`;
    }

    const response = await fetch(url.toString(), {
      headers,
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(
        `Legacy API responded with ${response.status}: ${response.statusText}`,
      );
    }

    return (await response.json()) as LegacyHistoryPage;
  } finally {
    clearTimeout(timeout);
  }
}
