# Architecture Overview

## High-Level System Flow

The RPS League Dashboard utilizes a standard 3-tier architecture with the Express backend acting as a pure Backend-For-Frontend (BFF) proxy to the legacy Reaktor API:

1. **Frontend (React)**: Executes lightweight `fetch` hooks (`useLatestMatches`, `useTodayLeaderboard`) connected to internal endpoints. Purely responsible for rendering presentational views and handling local loading/error states.
2. **Backend (Express)**: Provides internal REST endpoints mapped specifically to UI needs. Validates query parameters, handles unexpected upstream payload gaps, and formats `502` internal error responses to hide external failures from the frontend.
3. **Legacy API (Data Source)**: Provides raw historical Rock-Paper-Scissors outcomes via the authenticated `GET /history` endpoint. 

## Component Workspaces

### Why Client / Server / Shared?

The project spans client UI code and server infrastructural code. To maximize DX (Developer Experience) and prevent "Type Drift" (when frontend models misalign with API JSON payloads over time), we chose a Monorepo design mapping explicitly to three distinct NPM Workspaces (`client`, `server`, and `shared`).

By isolating `types/match.ts` inside `shared/`, both the Express JSON sender and the React component receiver explicitly share the same `LeaderboardEntry` and `Match` contract imports map. The TypeScript compiler enforces stability at build time, preventing runtime schema regressions.

## Backend Service Layer Pattern

### Why Normalize in the Service Layer?

The RPS legacy API provides an awkward, unergonomic data shape (e.g., using `t` instead of `timestamp`, omitting the actual winner, returning deeply nested player states). 

If we allowed these shapes directly into the client, our UI would become heavily coupled to Reaktor's API design structure, propagating `.playerA.played` destructuring logic inside React components. We implemented a strict **normalization boundary** via `match.service.ts`:

- Fetch legacy JSON in isolated HTTP Client handlers.
- Instantly convert `LegacyMatchResult` into shared domain `Match` abstractions (`normalizeMatch()`).
- Serve only the clean abstractions to the Express router.

### Why is Winner Calculation Handled Internally?

The legacy API specifically returns Player inputs (e.g. `ROCK`, `PAPER`), but deliberately omits the specific match result mapping (who won).
Rather than offloading computation to the client, the `match.service.ts` encapsulates the RPS rules (`calculateWinner()`) executing entirely in the backend. The backend computes the winner status and serves pre-computed `result: "PLAYER_A" | "PLAYER_B" | "DRAW"` flags out of the box so the UI remains intentionally ignorant of the complex Rock-Paper-Scissors business logic.

### Pagination Safety Handling

The historical matches API utilizes a `cursor` system providing relative paths to successive match pages. Resolving leaderboards or finding total matches mandates aggressively crawling all historical pages.

To prevent infinite runaway loop situations caused by unbounded data payload streams, the `fetchPages()` helper enforces a global `MAX_PAGINATION_PAGES` environment cap (defaulting to 10). The backend guarantees loop exit upon reaching the cap, successfully returning a deterministic chunk of data in predictable `O(1)` memory boundaries instead of causing Node heap crashes.

## Frontend Data-Fetching Architecture

Currently, data-fetching abstracts native `fetch()` calls inside decoupled React Hooks (`useTodayLeaderboard`). 
We explicitly chose to reject complex client caching layers natively out of the box to respect minimalist take-home constraints. By cleanly separating the Hook interface from the Presentational components (`TodayLeaderboard.tsx`), we retain the architecture's ability to seamlessly swap the internal manual `useState/useEffect` fetch definitions for robust libraries like React Query (`useQuery`) when query polling and client cache invalidation becomes requisite for performance tuning in the future.
