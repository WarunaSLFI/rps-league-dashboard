# RPS League Dashboard

A full-stack dashboard for visualizing Rock-Paper-Scissors league data — built as a take-home assignment.

## Tech Stack

| Layer    | Tech                                  |
| -------- | ------------------------------------- |
| Client   | React 19, TypeScript, Tailwind CSS v4 |
| Server   | Node.js, Express, TypeScript          |
| Bundler  | Vite 6                                |
| Tooling  | ESLint 9 (flat config), Prettier      |

## Project Structure

```
rps-league-dashboard/
├── client/          # React SPA (Vite + Tailwind v4)
├── server/          # Express API server
├── shared/          # Shared TypeScript types
├── docs/            # Architecture & decision docs
├── .env.example     # Environment variable reference
└── package.json     # npm workspace root
```

## Getting Started

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9

### Setup

```bash
# Install all dependencies (root + workspaces)
npm install

# Copy env template
cp .env.example .env

# Start both client and server in development mode
npm run dev
```

The client runs on [http://localhost:5173](http://localhost:5173) and proxies `/api` requests to the server on port 3001.

### Available Scripts

| Script              | Description                              |
| ------------------- | ---------------------------------------- |
| `npm run dev`       | Start client + server concurrently       |
| `npm run dev:client` | Start Vite dev server only              |
| `npm run dev:server` | Start Express dev server only (tsx watch)|
| `npm run build`     | Build all packages                       |
| `npm run lint`      | Lint all TypeScript files                |
| `npm run format`    | Format all files with Prettier           |

## API

| Endpoint      | Method | Description   |
| ------------- | ------ | ------------- |
| `/api/health` | GET    | Health check  |

## Documentation

- [Architecture Overview](docs/architecture.md)
- [Decision Log](docs/decisions.md)
- [Submission Notes](docs/submission-notes.md)
