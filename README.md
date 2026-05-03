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
| `npm run dev` | Start dev server on port 5173 |
| `npm run build` | Type-check + production build |
| `npm run lint` | ESLint |
| `npm run preview` | Preview production build |
| `npx tsc --noEmit` | Type-check only |

## Tech Stack

React 18 · Vite · TypeScript (strict) · Tailwind CSS · TanStack Query v5 · Zustand · React Hook Form + Zod · dnd-kit · Sonner · Axios

## Project Structure

```
src/
├── components/       # UI primitives, layout, feature components
├── hooks/            # TanStack Query read hooks
├── mutations/        # TanStack Query write hooks
├── pages/            # Route-level page components
├── store/            # Zustand stores (auth)
├── lib/              # axios instance, queryClient, utils
└── types/            # Shared TypeScript types
```

See `CLAUDE.md` for architecture decisions and coding conventions.
