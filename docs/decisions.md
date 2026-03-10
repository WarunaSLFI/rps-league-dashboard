# Architectural Decision Records (ADRs)

This document tracks significant architectural decisions made during the development of the RPS League Dashboard.

## 1. Monorepo Structure

*   **Decision:** Use a single NPM monorepo containing `client`, `server`, and `shared` packages.
*   **Context:** The application requires a React frontend and an Express backend, communicating via REST. Maintaining separate repositories adds overhead to code reviews and limits type sharing.
*   **Consequence (Good):** We can declare shared types (e.g., `LeaderboardEntry`) in the `shared/` package, ensuring the API responses and UI props are strictly typed end-to-end without duplication.
*   **Consequence (Bad):** Slightly steeper initial tooling setup (concurrently, separate tsconfigs) compared to a monolithic codebase.

## 2. API Normalization Boundary

*   **Decision:** Legacy data is immediately converted to internal domain types inside `match.service.ts` before reaching the Express router.
*   **Context:** The legacy Reaktor API provides an awkward schema (`time` fields, nested play objects, missing result calculations).
*   **Consequence:** The frontend UI stays completely uncoupled from the legacy API shape. If the upstream provider deprecates V1 to V2 shapes, the internal UI schema remains unimpacted—only the backend normalization mapping function requires an update.

## 3. UTC "Today" Assumption

*   **Decision:** The "Today's Leaderboard" aggregation queries matches starting from 00:00 UTC on the Node server's current date.
*   **Context:** To compute daily leaderboards, a unified timezone is required. Parsing browser user timezones adds significant timeline divergence complexity (e.g., it is Tuesday for User A but Wednesday for User B).
*   **Consequence:** A practical, deterministic standard is set. Trade-off: Users far from the GMT line might see the "Daily" leaderboard reset at odd afternoon hours locally. 

## 4. In-Memory Leaderboard Aggregation

*   **Decision:** The Express backend fetches match chunks and computes the leaderboard via local `Array.reduce` maps in Node memory dynamically synchronously per request.
*   **Context:** Introducing a PostgreSQL/Redis database just to satisfy materialized view aggregations introduces massive deployment and infrastructure complexity to what is effectively a frontend demonstration MVP.
*   **Consequence:** Fast iteration. However, under high traffic or with 100,000+ unpaginated daily matches, a Node thread blocking array computation will severely throttle performance. A database caching solution is prioritized for future-scaling steps.

## 5. Lightweight Frontend Data Management

*   **Decision:** Built custom `useLatestMatches` React hooks using native `fetch` and `useState` instead of employing Redux or React Query.
*   **Context:** Take-home interview assignments often penalize overt abstraction overhead. The current app requires simple "fetch-and-render" pathways without optimistic UI updates, multi-tab caching syncs, or complex pagination polling features just yet.
*   **Consequence:** Zero dependency bloat, retaining maximum component clarity. The decoupled hook design makes standardizing into Swr/React-Query natively effortless when complexity ultimately peaks.
