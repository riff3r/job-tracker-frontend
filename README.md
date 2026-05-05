# Job Tracker — Frontend

React + Vite + TypeScript frontend for the Job Tracker application.

## Requirements

- Node 18+
- Backend running at `http://localhost:3000` (see `../job-tracker-backend`)

## Setup

```bash
npm install
cp .env.example .env   # edit if backend is on a different port
npm run dev            # http://localhost:5173
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server on port 5173 (proxies `/v1` → backend on :3000) |
| `npm run build` | Type-check + production build |
| `npm run lint` | ESLint (flat config) |
| `npm run preview` | Preview production build |
| `npm test` | Vitest in watch mode |
| `npm run test:run` | Vitest one-shot (use in CI) |
| `npm run test:ui` | Vitest UI in browser |
| `npx tsc --noEmit` | Type-check only |

## Tech Stack

React 18 · Vite · TypeScript (strict) · Tailwind CSS · TanStack Query v5 · Zustand · React Hook Form + Zod · dnd-kit · Sonner · Axios · Vitest + React Testing Library

## Project Structure

```
src/
├── components/       # UI primitives, layout, feature components, dashboard
├── hooks/            # TanStack Query read hooks
├── mutations/        # TanStack Query write hooks (no inline API calls in pages)
├── pages/            # Route-level page components
├── routes/           # Route map + Suspense/lazy wiring
├── schemas/          # Zod schemas, split per domain
├── store/            # Zustand auth store + useIsAuthenticated selector
├── lib/              # axios instance (with refresh queue), queryClient, utils, constants
├── test/             # Vitest setup
└── types/            # Shared TypeScript types
```

See `CLAUDE.md` for architecture decisions and coding conventions.
