# Architecture Overview

## High-Level Design

```
┌──────────────┐     /api/*      ┌──────────────┐
│              │ ──────────────► │              │
│    Client    │                 │    Server    │
│  (React SPA) │ ◄────────────── │  (Express)   │
│              │     JSON        │              │
└──────────────┘                 └──────────────┘
        │                                │
        └──── shared types ──────────────┘
```

## Package Responsibilities

### `client/`
React single-page application. Renders league data, handles user interactions, and communicates with the server via REST API calls. Built with Vite and styled with Tailwind CSS v4.

### `server/`
Express API server. Serves league data endpoints and handles any server-side logic. Uses `tsx` for zero-config TypeScript execution during development.

### `shared/`
Shared TypeScript type definitions consumed by both client and server via path aliases. No build step — types are resolved directly by TypeScript.

## Key Design Decisions

- **Monorepo with npm workspaces** — simple, native, no extra tooling (no Turborepo, Nx, or Lerna needed at this scale)
- **Shared types via path aliases** — avoids a build step for the shared package while keeping type safety across packages
- **Vite dev proxy** — `/api` requests in development are proxied to the Express server, avoiding CORS issues without additional configuration
- **Tailwind CSS v4** — CSS-first configuration, no `tailwind.config.js`, leverages the `@tailwindcss/vite` plugin

> _This document will be expanded as features are added._
