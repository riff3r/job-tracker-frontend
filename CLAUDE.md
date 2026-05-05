# Job Tracker Frontend

## Tech Stack

- **Framework**: React 18 + Vite + TypeScript (strict)
- **Styling**: Tailwind CSS v3, Inter font, design tokens in `DESIGN.md`
- **Server state**: TanStack Query v5
- **Client state**: Zustand
- **Forms**: React Hook Form + Zod
- **Drag & drop**: dnd-kit (`@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`)
- **Toasts**: Sonner
- **HTTP**: Axios with token-refresh interceptor
- **Routing**: React Router v6

## Path Alias

`@` maps to `src/` — always use `@/` instead of relative paths.

## API

- Base URL: `import.meta.env.VITE_API_URL` (default `http://localhost:5173` in dev — same-origin via Vite proxy)
- Vite dev server proxies `/v1/*` → `http://localhost:3000/v1/*` (see `vite.config.ts`). This makes auth cookies same-site without needing `SameSite=None;Secure`.
- All endpoints under `/v1` prefix
- Backend response envelope: `{ success, statusCode, message, data }`

## Auth Architecture

- **Access token**: stored in Zustand memory only (never persisted to disk).
- **Refresh token**: stored in an **httpOnly cookie** set by the backend. Not accessible to JS.
- **Auto-refresh**: Axios response interceptor catches 401s, silently calls `POST /v1/auth/refresh` (cookie sent automatically), retries the original request via a queue pattern.
- **App init**: `AppInit` in `App.tsx` calls `/v1/auth/refresh` on mount. Uses a `useRef` guard so React StrictMode's double-invoke doesn't fire two concurrent refreshes.
- **`useIsAuthenticated()`** selector (in `store/authStore.ts`) derives auth state from `accessToken !== null` — never store an `isAuthenticated` flag separately.

## Code Rules

- No `any` types — use `unknown` and narrow, or define a proper type
- No inline API calls in components — go through `src/hooks/` or `src/mutations/`
- No `alert()` — Sonner toasts only (`import { toast } from 'sonner'`)
- No `process.env` — use `import.meta.env`
- All forms: React Hook Form + Zod resolvers
- Loading states: `<Skeleton>` components (not spinners, except inside buttons)
- All protected pages wrapped in `<ErrorBoundary>`

## Project Structure

```
src/
├── types/index.ts          # Shared TypeScript types and enums
├── schemas/                # Zod schemas, split per domain (auth, application, user, resume)
├── lib/
│   ├── axios.ts            # Axios instance + 401 refresh interceptor (queue pattern)
│   ├── queryClient.ts      # TanStack QueryClient config
│   ├── constants.ts        # Shared constants (LOCATION_OPTIONS, INPUT_BASE_CLASS, chart windows)
│   └── utils.ts            # cn(), formatDate(), timeAgo(), formatFileSize(), todayISO(), getApiErrorMessage()
├── store/
│   └── authStore.ts        # Zustand auth store + useIsAuthenticated selector
├── hooks/                  # TanStack Query read hooks (one per query)
├── mutations/              # TanStack Query mutation hooks (one per mutation, never inline in pages)
├── components/
│   ├── ui/                 # StatusBadge, ErrorBoundary, Skeleton, Spinner, ConfirmDialog, FormFieldError
│   ├── layout/             # Layout, Sidebar, Topbar
│   ├── auth/               # ProtectedRoute
│   ├── applications/       # KanbanBoard, KanbanColumn, ApplicationCard, ApplicationDrawer, ActivityTimeline
│   ├── dashboard/          # DonutChart, BarChart, DashboardSkeleton, buildBars
│   └── resumes/            # ResumeUploader
├── pages/                  # Login, Register, GoogleCallback, NotFound, Dashboard, Applications, ApplicationDetail, Resumes, Settings
├── routes/                 # Route map + Suspense/lazy wiring
└── test/                   # Vitest setup
```

## Dev

```bash
npm run dev          # http://localhost:5173 (proxies /v1 to backend on :3000)
npm run build        # production build (tsc -b && vite build)
npm run lint         # ESLint (flat config, no warnings allowed)
npm run test         # Vitest in watch mode
npm run test:run     # Vitest one-shot (CI)
npm run test:ui      # Vitest UI in browser
npx tsc --noEmit     # standalone type check
```

## Dev Credentials

Email: `test@test.com` / Password: `password123`
(No seed script — register a new account if this doesn't work)
