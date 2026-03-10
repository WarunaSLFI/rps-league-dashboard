# RPS League Dashboard

A full-stack, monorepo-based web application built to consume and visualize the Reaktor Rock-Paper-Scissors legacy API. It provides a polished dashboard displaying the latest matches and a dynamically computed daily leaderboard.

## Key Features Currently Implemented

- **Latest Matches Feed:** Displays the most recent matches with clear visualizations of player moves and the calculated winner.
- **Daily Leaderboard:** Aggregates live match data from the legacy API, computing win rates, total wins, and losses, and highlighting top-ranked players.
- **Historical Leaderboard:** Filter matches by date range to generate a dynamically calculated leaderboard for any past time period.
- **Player Search:** Review historical performance and individual match history for any given player.
- **Robust Backend Integration:** Features automatic pagination safety limits, seamless normalization of legacy data structures, and defensive error handling (returning clean `502 Bad Gateway` JSON without leaking internal state on upstream failures).
- **Premium UI:** A responsive, modern dark-themed dashboard built with Tailwind CSS v4.
- **Type Safety:** Shared domain models between the backend and frontend for strict end-to-end type safety.

## Tech Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS v4
- **Backend:** Node.js, Express, TypeScript
- **Testing:** Vitest (Backend service layer unit tests)
- **Tooling:** ESLint, Prettier, Concurrently (Monorepo dev scripts)

## Project Structure Overview

The project uses a standard monorepo workspace approach:

- `client/` - React frontend application
- `server/` - Express backend API
- `shared/` - Shared TypeScript interfaces (e.g., `Match`, `LeaderboardEntry`)
- `docs/` - Architecture and decision records

## Local Setup

### Prerequisites

- Node.js 18+ or 20+

### Installation

1. Clone the repository
2. Install dependencies matching the monorepo configuration:
   ```bash
   npm install
   ```

### Environment Variables

Create a `.env` file in the root of the project (copy from `.env.example` if available) and add:

```env
# Server target port
PORT=3001

# The URL for the Legacy Reaktor APIs
RPS_API_BASE_URL=https://assignments.reaktor.com

# Your assigned Bearer token
RPS_API_TOKEN=your_token_here

# Maximum legacy API pages to fetch to prevent infinite loops
MAX_PAGINATION_PAGES=10

# Point the Vite client proxy to the local backend port
VITE_API_URL=http://localhost:3001
```

### Running the Application

You can start both the client and server concurrently from the root directory:

```bash
npm run dev
```

- Target frontend: `http://localhost:5173`
- Target backend endpoints: `http://localhost:3001`

### Available Scripts

- `npm run dev` - Start both workspaces in watch mode
- `npm run dev:client` - Start frontend only
- `npm run dev:server` - Start backend only
- `npm run build` - Build all packages for production
- `npm run lint` - Run ESLint across all packages
- `npm test:server` - Run backend unit tests via Vitest

## API Endpoints Overview

The backend exposes the following normalized endpoints:

- `GET /api/health` - Basic health check.
- `GET /api/matches/latest?limit=20` - Returns the most recent matches formatted into standardized domain objects.
- `GET /api/leaderboard/today` - Returns an aggregated and ranked list of players for the current UTC day.
- `GET /api/leaderboard/range?from={ISO}&to={ISO}` - Returns a dynamically calculated leaderboard for a specified date range.
- `GET /api/players/:playerName/matches` - Returns historical matches for a specific player (case-insensitive).

## Testing

The backend business logic (normalization, RPS winner calculation, and leaderboard computation) is thoroughly tested using `Vitest`. To run the unit test suite:

```bash
npm run test:server
```

## Future Improvements

1. **Caching Layer:** Integrate an in-memory or Redis cache layer to handle high traffic and reduce latency, avoiding heavy Reaktor API polling.
2. **Automated E2E Testing:** Add Cypress or Playwright tests to ensure core workflows function end-to-end.
