import { env } from '../config/env.js';
import type { LegacyHistoryPage } from '../types/legacy-api.js';

/**
 * Thin HTTP client for the legacy RPS API.
 * Responsible only for external communication — no data transformation.
 */

const TIMEOUT_MS = 10_000;

/**
 * Fetches a single page of match history.
 *
 * @param nextPath - The path for the next page (e.g. "/history?cursor=abc123").
 *                   On the first call, omit this to fetch "/history".
 *                   The legacy API returns the next-page path in its `cursor` field.
 */
export async function fetchHistoryPage(
  nextPath?: string,
): Promise<LegacyHistoryPage> {
  const url = new URL(nextPath || '/history', env.rpsApi.baseUrl);

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
