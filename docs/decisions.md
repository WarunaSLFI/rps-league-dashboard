# Decision Log

Lightweight ADR (Architecture Decision Record) log. Entries are added as meaningful decisions are made.

---

## ADR-001: Monorepo Structure

**Date:** 2026-03-10
**Status:** Accepted

### Context
The project requires a client (React SPA) and server (Express API) that share TypeScript types. Need a structure that is clean, easy to review, and appropriate for a take-home assignment.

### Decision
Use a single-repo structure with npm workspaces and three packages: `client/`, `server/`, and `shared/`.

### Rationale
- npm workspaces are built-in — no extra tooling needed
- Shared types work via TS path aliases with no build step
- Simple to clone, install, and run for reviewers
- Scales naturally if more packages are needed later

### Alternatives Considered
- **Separate repos:** Adds friction for shared types and reviewer setup
- **Turborepo/Nx:** Overkill for two packages with one shared type module

---

## ADR-002: Tailwind CSS v4

**Date:** 2026-03-10
**Status:** Accepted

### Context
Need a CSS approach that is fast to develop with and produces professional-looking results.

### Decision
Use Tailwind CSS v4 with the `@tailwindcss/vite` plugin and CSS-first configuration.

### Rationale
- No `tailwind.config.js` needed — configuration lives in CSS via `@theme`
- Dedicated Vite plugin eliminates PostCSS config
- Faster builds via Rust-powered engine
- Cleaner developer experience overall

---

> _Add new entries above this line._
