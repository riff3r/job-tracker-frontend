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

- Base URL: `import.meta.env.VITE_API_URL` (default `http://localhost:3000`)
- All endpoints under `/v1` prefix
- Backend response envelope: `{ success, statusCode, message, data }`

## Auth Architecture

- **Access token**: stored in Zustand memory only (never persisted)
- **Refresh token**: stored in `localStorage` under key `refreshToken`
- **Auto-refresh**: Axios response interceptor catches 401s, silently calls `POST /v1/auth/refresh`, retries the original request using a queue pattern
- **App init**: `AppInit` component in `App.tsx` reads the stored refresh token on mount and exchanges it for a new pair

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
├── types/index.ts          # All shared TypeScript types
├── lib/
│   ├── axios.ts            # Axios instance + interceptors
│   ├── queryClient.ts      # TanStack QueryClient config
│   └── utils.ts            # cn(), formatDate(), timeAgo(), formatFileSize()
├── store/
│   └── authStore.ts        # Zustand auth store
├── hooks/                  # TanStack Query read hooks
├── mutations/              # TanStack Query mutation hooks
├── components/
│   ├── ui/                 # StatusBadge, ErrorBoundary, Skeleton, Spinner, ConfirmDialog
│   ├── layout/             # Layout, Sidebar
│   ├── auth/               # ProtectedRoute
│   ├── applications/       # KanbanBoard, KanbanColumn, ApplicationCard, ApplicationDrawer, ActivityTimeline
│   └── resumes/            # ResumeUploader
└── pages/                  # Login, Register, GoogleCallback, Dashboard, Applications, ApplicationDetail, Resumes, Settings
```

## Dev

```bash
npm run dev      # http://localhost:5173
npm run build    # production build
npm run lint     # ESLint
npx tsc --noEmit # type check
```

## Dev Credentials

Email: `test@test.com` / Password: `password123`
(No seed script — register a new account if this doesn't work)
