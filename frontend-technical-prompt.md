# Job Tracker — Frontend Technical Implementation Prompt

Build the complete frontend for a Job Application Management System. This is
a production-quality React application. Every file, every hook, every
component described below must be implemented fully. No placeholders, no TODOs.

---

## Project Init

```bash
npm create vite@latest job-tracker-frontend -- --template react-ts
cd job-tracker-frontend
```

Install all dependencies:

```bash
npm install \
  react-router-dom \
  @tanstack/react-query \
  axios \
  zustand \
  react-hook-form \
  @hookform/resolvers \
  zod \
  @dnd-kit/core \
  @dnd-kit/sortable \
  @dnd-kit/utilities \
  sonner \
  clsx \
  tailwind-merge

npm install -D \
  tailwindcss \
  postcss \
  autoprefixer \
  @types/node \
  eslint \
  prettier \
  husky \
  lint-staged \
  @typescript-eslint/eslint-plugin \
  @typescript-eslint/parser

npx tailwindcss init -p
```

---

## tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

## vite.config.ts

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

## tailwind.config.js

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#6366F1',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
```

## src/index.css

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-slate-50 text-slate-900 antialiased;
  }
}
```

---

## Environment Variables

**.env:**
```
VITE_API_URL=http://localhost:3000
VITE_GOOGLE_REDIRECT_URI=http://localhost:5173/auth/google/callback
```

**.env.example:**
```
VITE_API_URL=
VITE_GOOGLE_REDIRECT_URI=
```

---

## Full File Structure

```
src/
├── main.tsx
├── App.tsx
├── index.css
├── types/
│   └── index.ts
├── lib/
│   ├── axios.ts
│   ├── queryClient.ts
│   └── utils.ts
├── store/
│   └── authStore.ts
├── hooks/
│   ├── useApplications.ts
│   ├── useApplication.ts
│   ├── useResumes.ts
│   └── useMe.ts
├── mutations/
│   ├── useCreateApplication.ts
│   ├── useUpdateApplication.ts
│   ├── useDeleteApplication.ts
│   ├── useUploadResume.ts
│   └── useDeleteResume.ts
├── pages/
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── GoogleCallback.tsx
│   ├── Dashboard.tsx
│   ├── Applications.tsx
│   ├── ApplicationDetail.tsx
│   ├── Resumes.tsx
│   └── Settings.tsx
└── components/
    ├── layout/
    │   ├── Layout.tsx
    │   ├── Sidebar.tsx
    │   └── Topbar.tsx
    ├── auth/
    │   └── ProtectedRoute.tsx
    ├── applications/
    │   ├── KanbanBoard.tsx
    │   ├── KanbanColumn.tsx
    │   ├── ApplicationCard.tsx
    │   ├── ApplicationDrawer.tsx
    │   └── ActivityTimeline.tsx
    ├── resumes/
    │   └── ResumeUploader.tsx
    └── ui/
        ├── StatusBadge.tsx
        ├── ErrorBoundary.tsx
        ├── ConfirmDialog.tsx
        ├── Skeleton.tsx
        └── Spinner.tsx
```

---

## src/types/index.ts

```ts
export type ApplicationStatus =
  | 'WISHLIST'
  | 'APPLIED'
  | 'PHONE_SCREEN'
  | 'INTERVIEW'
  | 'OFFER'
  | 'REJECTED'
  | 'WITHDRAWN';

export const APPLICATION_STATUSES: ApplicationStatus[] = [
  'WISHLIST',
  'APPLIED',
  'PHONE_SCREEN',
  'INTERVIEW',
  'OFFER',
  'REJECTED',
  'WITHDRAWN',
];

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  WISHLIST: 'Wishlist',
  APPLIED: 'Applied',
  PHONE_SCREEN: 'Phone Screen',
  INTERVIEW: 'Interview',
  OFFER: 'Offer',
  REJECTED: 'Rejected',
  WITHDRAWN: 'Withdrawn',
};

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Application {
  id: string;
  userId: string;
  company: string;
  role: string;
  jobUrl: string | null;
  location: string | null;
  salary: string | null;
  notes: string | null;
  status: ApplicationStatus;
  appliedAt: string | null;
  followUpDate: string | null;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  activityLogs?: ActivityLog[];
}

export interface ActivityLog {
  id: string;
  applicationId: string;
  userId: string;
  fromStatus: ApplicationStatus | null;
  toStatus: ApplicationStatus;
  changedAt: string;
}

export interface Resume {
  id: string;
  userId: string;
  label: string;
  filePath: string;
  fileType: 'PDF' | 'DOCX';
  version: number;
  createdAt: string;
}

export interface ApiResponse<T> {
  data: T;
  meta?: Record<string, unknown>;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: User;
}

// Form input types
export interface CreateApplicationInput {
  company: string;
  role: string;
  jobUrl?: string;
  location?: string;
  salary?: string;
  notes?: string;
  status: ApplicationStatus;
  appliedAt?: string;
  followUpDate?: string;
}

export interface UpdateApplicationInput extends Partial<CreateApplicationInput> {}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface UpdateProfileInput {
  name: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}
```

---

## src/lib/utils.ts

```ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return formatDate(dateString);
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
```

---

## src/lib/queryClient.ts

```ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
```

---

## src/store/authStore.ts

```ts
import { create } from 'zustand';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setTokens: (accessToken: string, refreshToken: string, user: User) => void;
  setAccessToken: (accessToken: string) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
}

const REFRESH_TOKEN_KEY = 'refreshToken';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: true,

  setTokens: (accessToken, refreshToken, user) => {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    set({ accessToken, user, isAuthenticated: true, isLoading: false });
  },

  setAccessToken: (accessToken) => {
    set({ accessToken });
  },

  clearAuth: () => {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    set({ user: null, accessToken: null, isAuthenticated: false, isLoading: false });
  },

  setLoading: (isLoading) => set({ isLoading }),
}));

export const getRefreshToken = (): string | null =>
  localStorage.getItem(REFRESH_TOKEN_KEY);
```

---

## src/lib/axios.ts

```ts
import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { useAuthStore, getRefreshToken } from '@/store/authStore';
import type { ApiResponse, AuthTokens } from '@/types';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null = null): void {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
}

// Request interceptor — attach access token
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().accessToken;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — handle 401 and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      useAuthStore.getState().clearAuth();
      window.location.href = '/login';
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${token}`;
        }
        return api(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const response = await axios.post<ApiResponse<AuthTokens>>(
        `${import.meta.env.VITE_API_URL}/v1/auth/refresh`,
        { refreshToken }
      );

      const { accessToken, refreshToken: newRefreshToken, user } =
        response.data.data;

      useAuthStore.getState().setTokens(accessToken, newRefreshToken, user);
      processQueue(null, accessToken);

      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      }

      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      useAuthStore.getState().clearAuth();
      window.location.href = '/login';
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);
```

---

## src/hooks/useApplications.ts

```ts
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import type { Application, PaginatedResponse, ApplicationStatus } from '@/types';

interface ApplicationFilters {
  status?: ApplicationStatus;
  search?: string;
  page?: number;
  limit?: number;
}

async function fetchApplications(
  filters: ApplicationFilters
): Promise<PaginatedResponse<Application>> {
  const params = new URLSearchParams();
  if (filters.status) params.set('status', filters.status);
  if (filters.search) params.set('search', filters.search);
  if (filters.page) params.set('page', String(filters.page));
  if (filters.limit) params.set('limit', String(filters.limit));

  const response = await api.get<PaginatedResponse<Application>>(
    `/v1/applications?${params.toString()}`
  );
  return response.data;
}

export function useApplications(filters: ApplicationFilters = {}) {
  return useQuery({
    queryKey: ['applications', filters],
    queryFn: () => fetchApplications(filters),
  });
}
```

---

## src/hooks/useApplication.ts

```ts
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import type { Application, ApiResponse } from '@/types';

async function fetchApplication(id: string): Promise<Application> {
  const response = await api.get<ApiResponse<Application>>(
    `/v1/applications/${id}`
  );
  return response.data.data;
}

export function useApplication(id: string) {
  return useQuery({
    queryKey: ['applications', id],
    queryFn: () => fetchApplication(id),
    enabled: !!id,
  });
}
```

---

## src/hooks/useResumes.ts

```ts
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import type { Resume, ApiResponse } from '@/types';

async function fetchResumes(): Promise<Resume[]> {
  const response = await api.get<ApiResponse<Resume[]>>('/v1/resumes');
  return response.data.data;
}

export function useResumes() {
  return useQuery({
    queryKey: ['resumes'],
    queryFn: fetchResumes,
  });
}
```

---

## src/hooks/useMe.ts

```ts
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import type { User, ApiResponse } from '@/types';

async function fetchMe(): Promise<User> {
  const response = await api.get<ApiResponse<User>>('/v1/users/me');
  return response.data.data;
}

export function useMe() {
  return useQuery({
    queryKey: ['me'],
    queryFn: fetchMe,
  });
}
```

---

## src/mutations/useCreateApplication.ts

```ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import type { Application, ApiResponse, CreateApplicationInput } from '@/types';

async function createApplication(
  input: CreateApplicationInput
): Promise<Application> {
  const response = await api.post<ApiResponse<Application>>(
    '/v1/applications',
    input
  );
  return response.data.data;
}

export function useCreateApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });
}
```

---

## src/mutations/useUpdateApplication.ts

```ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import type {
  Application,
  ApiResponse,
  UpdateApplicationInput,
  PaginatedResponse,
} from '@/types';

interface UpdateApplicationParams {
  id: string;
  input: UpdateApplicationInput;
}

async function updateApplication({
  id,
  input,
}: UpdateApplicationParams): Promise<Application> {
  const response = await api.patch<ApiResponse<Application>>(
    `/v1/applications/${id}`,
    input
  );
  return response.data.data;
}

export function useUpdateApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateApplication,

    // Optimistic update for kanban drag-and-drop
    onMutate: async ({ id, input }) => {
      await queryClient.cancelQueries({ queryKey: ['applications'] });

      const previousData = queryClient.getQueriesData<
        PaginatedResponse<Application>
      >({ queryKey: ['applications'] });

      if (input.status) {
        queryClient.setQueriesData<PaginatedResponse<Application>>(
          { queryKey: ['applications'] },
          (old) => {
            if (!old) return old;
            return {
              ...old,
              data: old.data.map((app) =>
                app.id === id ? { ...app, status: input.status! } : app
              ),
            };
          }
        );
      }

      return { previousData };
    },

    onError: (_err, _variables, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },

    onSettled: (_data, _err, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['applications', id] });
    },
  });
}
```

---

## src/mutations/useDeleteApplication.ts

```ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';

async function deleteApplication(id: string): Promise<void> {
  await api.delete(`/v1/applications/${id}`);
}

export function useDeleteApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });
}
```

---

## src/mutations/useUploadResume.ts

```ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import type { Resume, ApiResponse } from '@/types';

interface UploadResumeInput {
  file: File;
  label: string;
  onUploadProgress?: (percent: number) => void;
}

async function uploadResume({
  file,
  label,
  onUploadProgress,
}: UploadResumeInput): Promise<Resume> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('label', label);

  const response = await api.post<ApiResponse<Resume>>('/v1/resumes', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total && onUploadProgress) {
        const percent = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onUploadProgress(percent);
      }
    },
  });
  return response.data.data;
}

export function useUploadResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadResume,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
    },
  });
}
```

---

## src/mutations/useDeleteResume.ts

```ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';

async function deleteResume(id: string): Promise<void> {
  await api.delete(`/v1/resumes/${id}`);
}

export function useDeleteResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteResume,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
    },
  });
}
```

---

## src/components/ui/StatusBadge.tsx

```ts
import { cn } from '@/lib/utils';
import { STATUS_LABELS, type ApplicationStatus } from '@/types';

const STATUS_STYLES: Record<ApplicationStatus, string> = {
  WISHLIST: 'bg-slate-100 text-slate-600',
  APPLIED: 'bg-blue-100 text-blue-700',
  PHONE_SCREEN: 'bg-yellow-100 text-yellow-700',
  INTERVIEW: 'bg-purple-100 text-purple-700',
  OFFER: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
  WITHDRAWN: 'bg-gray-100 text-gray-500',
};

interface StatusBadgeProps {
  status: ApplicationStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        STATUS_STYLES[status],
        className
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
```

---

## src/components/ui/ErrorBoundary.tsx

```ts
import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex flex-col items-center justify-center h-64 gap-3">
            <p className="text-slate-500 text-sm">Something went wrong.</p>
            <button
              className="text-indigo-600 text-sm underline"
              onClick={() => this.setState({ hasError: false, error: null })}
            >
              Try again
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
```

---

## src/components/ui/Skeleton.tsx

```ts
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded bg-slate-200',
        className
      )}
    />
  );
}
```

---

## src/components/ui/Spinner.tsx

```ts
import { cn } from '@/lib/utils';

interface SpinnerProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const SIZE_CLASSES = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
};

export function Spinner({ className, size = 'md' }: SpinnerProps) {
  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600',
        SIZE_CLASSES[size],
        className
      )}
    />
  );
}
```

---

## src/components/ui/ConfirmDialog.tsx

```ts
import { cn } from '@/lib/utils';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel = 'Delete',
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onCancel}
      />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M12 3a9 9 0 100 18A9 9 0 0012 3z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-slate-900">{title}</h3>
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          </div>
        </div>
        <div className="mt-6 flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={cn(
              'px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2'
            )}
          >
            {isLoading && (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            )}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

## src/components/auth/ProtectedRoute.tsx

```ts
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Spinner } from '@/components/ui/Spinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
```

---

## src/components/layout/Sidebar.tsx

Navigation items with icons, active state, and user info at the bottom.

```ts
import { NavLink, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/lib/axios';
import { getRefreshToken } from '@/store/authStore';
import { toast } from 'sonner';

const navItems = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    to: '/applications',
    label: 'Applications',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  {
    to: '/resumes',
    label: 'Resumes',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    to: '/settings',
    label: 'Settings',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

export function Sidebar() {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        await api.post('/v1/auth/logout', { refreshToken });
      }
    } catch {
      // ignore
    } finally {
      clearAuth();
      navigate('/login');
      toast.success('Logged out');
    }
  }

  return (
    <aside className="fixed left-0 top-0 h-full w-60 bg-white border-r border-slate-200 flex flex-col z-30">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-slate-100">
        <span className="text-lg font-bold text-indigo-600">JobTracker</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              )
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User section */}
      <div className="px-4 py-4 border-t border-slate-100">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold text-sm flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">
              {user?.name}
            </p>
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full text-left text-xs text-slate-500 hover:text-red-600 transition-colors px-1"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
```

---

## src/components/layout/Layout.tsx

```ts
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export function Layout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <main className="ml-60 min-h-screen">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
```

---

## src/components/applications/ActivityTimeline.tsx

```ts
import { cn, timeAgo } from '@/lib/utils';
import { STATUS_LABELS, type ActivityLog, type ApplicationStatus } from '@/types';

const STATUS_DOT_COLORS: Record<ApplicationStatus, string> = {
  WISHLIST: 'bg-slate-400',
  APPLIED: 'bg-blue-500',
  PHONE_SCREEN: 'bg-yellow-500',
  INTERVIEW: 'bg-purple-500',
  OFFER: 'bg-green-500',
  REJECTED: 'bg-red-500',
  WITHDRAWN: 'bg-gray-400',
};

interface ActivityTimelineProps {
  logs: ActivityLog[];
}

export function ActivityTimeline({ logs }: ActivityTimelineProps) {
  if (logs.length === 0) {
    return (
      <p className="text-sm text-slate-400 py-4">No activity yet.</p>
    );
  }

  return (
    <div className="space-y-0">
      {logs.map((log, index) => (
        <div key={log.id} className="flex gap-3">
          {/* Timeline line + dot */}
          <div className="flex flex-col items-center">
            <div
              className={cn(
                'w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0',
                STATUS_DOT_COLORS[log.toStatus]
              )}
            />
            {index < logs.length - 1 && (
              <div className="w-px flex-1 bg-slate-200 my-1" />
            )}
          </div>

          {/* Content */}
          <div className="pb-4 flex-1">
            <p className="text-sm text-slate-700">
              {log.fromStatus ? (
                <>
                  <span className="font-medium">
                    {STATUS_LABELS[log.fromStatus]}
                  </span>{' '}
                  →{' '}
                  <span className="font-medium">
                    {STATUS_LABELS[log.toStatus]}
                  </span>
                </>
              ) : (
                <>
                  Added as{' '}
                  <span className="font-medium">
                    {STATUS_LABELS[log.toStatus]}
                  </span>
                </>
              )}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              {timeAgo(log.changedAt)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
```

---

## src/components/applications/ApplicationCard.tsx

```ts
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useNavigate } from 'react-router-dom';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { formatDate } from '@/lib/utils';
import type { Application } from '@/types';

interface ApplicationCardProps {
  application: Application;
}

export function ApplicationCard({ application }: ApplicationCardProps) {
  const navigate = useNavigate();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: application.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
      onClick={() => navigate(`/applications/${application.id}`)}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-900 truncate">
            {application.company}
          </p>
          <p className="text-xs text-slate-500 truncate mt-0.5">
            {application.role}
          </p>
          {application.followUpDate && (
            <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formatDate(application.followUpDate)}
            </p>
          )}
        </div>
        {/* Drag handle */}
        <div
          {...attributes}
          {...listeners}
          className="opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 transition-opacity flex-shrink-0 mt-0.5"
          onClick={(e) => e.stopPropagation()}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 6a2 2 0 100-4 2 2 0 000 4zM16 6a2 2 0 100-4 2 2 0 000 4zM8 14a2 2 0 100-4 2 2 0 000 4zM16 14a2 2 0 100-4 2 2 0 000 4zM8 22a2 2 0 100-4 2 2 0 000 4zM16 22a2 2 0 100-4 2 2 0 000 4z" />
          </svg>
        </div>
      </div>

      <div className="flex items-center justify-between mt-2">
        <span className="text-xs text-slate-400">
          {formatDate(application.appliedAt)}
        </span>
        <StatusBadge status={application.status} />
      </div>
    </div>
  );
}
```

---

## src/components/applications/KanbanColumn.tsx

```ts
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { cn } from '@/lib/utils';
import { ApplicationCard } from './ApplicationCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import type { Application, ApplicationStatus } from '@/types';

interface KanbanColumnProps {
  status: ApplicationStatus;
  applications: Application[];
}

export function KanbanColumn({ status, applications }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div className="flex-shrink-0 w-72">
      {/* Column header */}
      <div className="flex items-center gap-2 mb-3">
        <StatusBadge status={status} />
        <span className="text-xs font-medium text-slate-400 bg-slate-100 rounded-full px-2 py-0.5">
          {applications.length}
        </span>
      </div>

      {/* Cards area */}
      <div
        ref={setNodeRef}
        className={cn(
          'min-h-24 rounded-lg p-2 space-y-2 transition-colors',
          isOver ? 'bg-indigo-50 border-2 border-dashed border-indigo-300' : 'bg-slate-100 border-2 border-transparent'
        )}
      >
        <SortableContext
          items={applications.map((a) => a.id)}
          strategy={verticalListSortingStrategy}
        >
          {applications.map((application) => (
            <ApplicationCard key={application.id} application={application} />
          ))}
        </SortableContext>

        {applications.length === 0 && (
          <div className="flex items-center justify-center h-16">
            <p className="text-xs text-slate-400">No applications</p>
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## src/components/applications/KanbanBoard.tsx

```ts
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { useState } from 'react';
import { APPLICATION_STATUSES, type Application, type ApplicationStatus } from '@/types';
import { KanbanColumn } from './KanbanColumn';
import { ApplicationCard } from './ApplicationCard';
import { useUpdateApplication } from '@/mutations/useUpdateApplication';
import { toast } from 'sonner';

interface KanbanBoardProps {
  applications: Application[];
}

export function KanbanBoard({ applications }: KanbanBoardProps) {
  const [activeApplication, setActiveApplication] = useState<Application | null>(null);
  const updateApplication = useUpdateApplication();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  function handleDragStart(event: DragStartEvent) {
    const app = applications.find((a) => a.id === event.active.id);
    if (app) setActiveApplication(app);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveApplication(null);

    if (!over) return;

    const activeApp = applications.find((a) => a.id === active.id);
    const newStatus = over.id as ApplicationStatus;

    if (!activeApp || activeApp.status === newStatus) return;

    updateApplication.mutate(
      { id: activeApp.id, input: { status: newStatus } },
      {
        onError: () => {
          toast.error('Failed to update status. Please try again.');
        },
      }
    );
  }

  const grouped = APPLICATION_STATUSES.reduce<Record<ApplicationStatus, Application[]>>(
    (acc, status) => {
      acc[status] = applications.filter((a) => a.status === status);
      return acc;
    },
    {} as Record<ApplicationStatus, Application[]>
  );

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {APPLICATION_STATUSES.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            applications={grouped[status]}
          />
        ))}
      </div>

      <DragOverlay>
        {activeApplication && (
          <div className="rotate-1 opacity-90">
            <ApplicationCard application={activeApplication} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
```

---

## src/components/applications/ApplicationDrawer.tsx

Full slide-over drawer with React Hook Form + Zod for creating a new application.

```ts
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { APPLICATION_STATUSES, STATUS_LABELS } from '@/types';
import { useCreateApplication } from '@/mutations/useCreateApplication';
import { Spinner } from '@/components/ui/Spinner';

const schema = z.object({
  company: z.string().min(1, 'Company is required'),
  role: z.string().min(1, 'Role is required'),
  jobUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  location: z.string().optional(),
  salary: z.string().optional(),
  status: z.enum(['WISHLIST', 'APPLIED', 'PHONE_SCREEN', 'INTERVIEW', 'OFFER', 'REJECTED', 'WITHDRAWN']),
  appliedAt: z.string().optional(),
  followUpDate: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface ApplicationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ApplicationDrawer({ isOpen, onClose }: ApplicationDrawerProps) {
  const createApplication = useCreateApplication();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { status: 'WISHLIST' },
  });

  async function onSubmit(values: FormValues) {
    createApplication.mutate(
      {
        ...values,
        jobUrl: values.jobUrl || undefined,
        location: values.location || undefined,
        salary: values.salary || undefined,
        notes: values.notes || undefined,
        appliedAt: values.appliedAt || undefined,
        followUpDate: values.followUpDate || undefined,
      },
      {
        onSuccess: () => {
          toast.success('Application created');
          reset();
          onClose();
        },
        onError: () => {
          toast.error('Failed to create application');
        },
      }
    );
  }

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-[480px] bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-base font-semibold text-slate-900">
            New Application
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 overflow-y-auto px-6 py-5 space-y-4"
        >
          {/* Company */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Company <span className="text-red-500">*</span>
            </label>
            <input
              {...register('company')}
              className={cn(
                'w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
                errors.company ? 'border-red-400' : 'border-slate-300'
              )}
              placeholder="e.g. Google"
            />
            {errors.company && (
              <p className="text-xs text-red-500 mt-1">{errors.company.message}</p>
            )}
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Role <span className="text-red-500">*</span>
            </label>
            <input
              {...register('role')}
              className={cn(
                'w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
                errors.role ? 'border-red-400' : 'border-slate-300'
              )}
              placeholder="e.g. Frontend Engineer"
            />
            {errors.role && (
              <p className="text-xs text-red-500 mt-1">{errors.role.message}</p>
            )}
          </div>

          {/* Job URL */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Job URL
            </label>
            <input
              {...register('jobUrl')}
              type="url"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="https://..."
            />
          </div>

          {/* Location + Salary */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Location
              </label>
              <input
                {...register('location')}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Remote"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Salary
              </label>
              <input
                {...register('salary')}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="$80k–$100k"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Status
            </label>
            <select
              {...register('status')}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {APPLICATION_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </div>

          {/* Applied Date + Follow-up Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Applied Date
              </label>
              <input
                {...register('appliedAt')}
                type="date"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Follow-up Date
              </label>
              <input
                {...register('followUpDate')}
                type="date"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Notes
            </label>
            <textarea
              {...register('notes')}
              rows={4}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              placeholder="Any notes about this application..."
            />
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={createApplication.isPending}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
          >
            {createApplication.isPending && <Spinner size="sm" />}
            Save
          </button>
        </div>
      </div>
    </>
  );
}
```

---

## src/components/resumes/ResumeUploader.tsx

```ts
import { useRef, useState, type DragEvent } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useUploadResume } from '@/mutations/useUploadResume';
import { Spinner } from '@/components/ui/Spinner';

const ACCEPTED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const MAX_SIZE_MB = 5;

const schema = z.object({
  label: z.string().min(1, 'Label is required'),
});

type FormValues = z.infer<typeof schema>;

export function ResumeUploader() {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadResume = useUploadResume();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  function validateFile(file: File): boolean {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error('Only PDF and DOCX files are accepted');
      return false;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      toast.error(`File must be smaller than ${MAX_SIZE_MB}MB`);
      return false;
    }
    return true;
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && validateFile(file)) setSelectedFile(file);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) setSelectedFile(file);
  }

  async function onSubmit(values: FormValues) {
    if (!selectedFile) {
      toast.error('Please select a file');
      return;
    }

    setUploadProgress(0);
    uploadResume.mutate(
      {
        file: selectedFile,
        label: values.label,
        onUploadProgress: setUploadProgress,
      },
      {
        onSuccess: () => {
          toast.success('Resume uploaded');
          setSelectedFile(null);
          setUploadProgress(0);
          reset();
          if (fileInputRef.current) fileInputRef.current.value = '';
        },
        onError: () => {
          toast.error('Upload failed');
          setUploadProgress(0);
        },
      }
    );
  }

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          'border-2 border-dashed rounded-xl h-40 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors',
          dragOver
            ? 'border-indigo-400 bg-indigo-50'
            : 'border-slate-300 bg-white hover:border-indigo-300 hover:bg-slate-50'
        )}
      >
        <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <p className="text-sm text-slate-600 font-medium">
          {selectedFile ? selectedFile.name : 'Drag & drop your resume here'}
        </p>
        <p className="text-xs text-slate-400">
          {selectedFile ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB` : 'or click to browse · PDF or DOCX · Max 5MB'}
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Label + Upload */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex gap-3">
        <div className="flex-1">
          <input
            {...register('label')}
            className={cn(
              'w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
              errors.label ? 'border-red-400' : 'border-slate-300'
            )}
            placeholder="e.g. Software Engineer"
          />
          {errors.label && (
            <p className="text-xs text-red-500 mt-1">{errors.label.message}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={uploadResume.isPending || !selectedFile}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2 flex-shrink-0"
        >
          {uploadResume.isPending ? (
            <>
              <Spinner size="sm" />
              {uploadProgress > 0 ? `${uploadProgress}%` : 'Uploading...'}
            </>
          ) : (
            'Upload Resume'
          )}
        </button>
      </form>
    </div>
  );
}
```

---

## Pages — implement all of these fully

### src/pages/Login.tsx
- React Hook Form + Zod (email required + valid, password required)
- On submit: `POST /v1/auth/login` via axios directly (not TanStack Query)
- On success: call `setTokens()` then `navigate('/dashboard')`
- On error: show inline error message
- "Continue with Google" button: `window.location.href = VITE_API_URL + '/v1/auth/google'`
- Link to `/register`

### src/pages/Register.tsx
- Fields: name, email, password (with strength indicator), confirmPassword
- Zod: confirm passwords match (`z.superRefine`)
- On submit: `POST /v1/auth/register`
- On success: call `setTokens()` then `navigate('/dashboard')`
- Link to `/login`

### src/pages/GoogleCallback.tsx
- On mount: if `isAuthenticated` → navigate to `/dashboard`
- Read `accessToken` and `refreshToken` from URL search params
- If missing params: navigate to `/login`
- Call `setTokens()` with params + fetch user via `GET /v1/users/me`
- Show a centered spinner while processing

### src/pages/Dashboard.tsx
- Use `useApplications({ limit: 100 })` to get all applications
- Compute stats client-side:
  - Total
  - Active (APPLIED + PHONE_SCREEN + INTERVIEW)
  - Offers (OFFER)
  - This week (appliedAt within last 7 days)
- Render 4 stat cards
- Render status breakdown bar (proportional segments)
- Render recent applications table (last 5 by createdAt)
- Export CSV button: `window.open(VITE_API_URL + '/v1/applications/export?format=csv')`

### src/pages/Applications.tsx
- Use `useApplications({ limit: 100 })` (no pagination for Kanban)
- Show `<KanbanBoard applications={data.data} />` on desktop
- Show list view on mobile (< 768px): filtered by status tabs
- "New Application" button opens `<ApplicationDrawer />`
- Loading state: skeleton columns
- Error state: error message with retry button

### src/pages/ApplicationDetail.tsx
- `useApplication(id)` to fetch
- React Hook Form pre-filled with existing values
- On save: `useUpdateApplication` mutation
- Show `<ActivityTimeline logs={application.activityLogs} />`
- Delete button opens `<ConfirmDialog>` then calls `useDeleteApplication`
- On delete success: navigate to `/applications`

### src/pages/Resumes.tsx
- `useResumes()` to fetch list
- Show `<ResumeUploader />`
- Group resumes by `label` using `Array.reduce`
- Each resume row: file icon (red for PDF, blue for DOCX), version badge, date, download button, delete button
- Download: `window.open(VITE_API_URL + '/v1/resumes/' + id + '/download')`
- Delete: `<ConfirmDialog>` + `useDeleteResume`

### src/pages/Settings.tsx
- 3 separate form sections (each with its own RHF instance):
  1. Profile: name field → `PATCH /v1/users/me`
  2. Avatar: file input (images only, max 2MB) → `POST /v1/users/me/avatar`
     (multipart/form-data with 'avatar' field)
  3. Password: currentPassword, newPassword, confirmNewPassword
     → `PATCH /v1/users/me/password`
- Each section has its own save button + Sonner toast

---

## src/App.tsx

```ts
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { useEffect } from 'react';
import { queryClient } from '@/lib/queryClient';
import { useAuthStore, getRefreshToken } from '@/store/authStore';
import { api } from '@/lib/axios';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Layout } from '@/components/layout/Layout';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

import Login from '@/pages/Login';
import Register from '@/pages/Register';
import GoogleCallback from '@/pages/GoogleCallback';
import Dashboard from '@/pages/Dashboard';
import Applications from '@/pages/Applications';
import ApplicationDetail from '@/pages/ApplicationDetail';
import Resumes from '@/pages/Resumes';
import Settings from '@/pages/Settings';

function AppInit() {
  const { setTokens, clearAuth, setLoading } = useAuthStore();

  useEffect(() => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      setLoading(false);
      return;
    }

    api
      .post('/v1/auth/refresh', { refreshToken })
      .then((res) => {
        const { accessToken, refreshToken: newRefreshToken, user } =
          res.data.data;
        setTokens(accessToken, newRefreshToken, user);
      })
      .catch(() => {
        clearAuth();
      });
  }, []);

  return null;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppInit />
        <Toaster position="bottom-right" richColors />
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/auth/google/callback" element={<GoogleCallback />} />

          {/* Protected */}
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route
              path="/dashboard"
              element={
                <ErrorBoundary>
                  <Dashboard />
                </ErrorBoundary>
              }
            />
            <Route
              path="/applications"
              element={
                <ErrorBoundary>
                  <Applications />
                </ErrorBoundary>
              }
            />
            <Route
              path="/applications/:id"
              element={
                <ErrorBoundary>
                  <ApplicationDetail />
                </ErrorBoundary>
              }
            />
            <Route
              path="/resumes"
              element={
                <ErrorBoundary>
                  <Resumes />
                </ErrorBoundary>
              }
            />
            <Route
              path="/settings"
              element={
                <ErrorBoundary>
                  <Settings />
                </ErrorBoundary>
              }
            />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
```

---

## src/main.tsx

```ts
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

---

## Absolute Rules

- No `any` types anywhere — use `unknown` and narrow it, or define a proper type
- No inline API calls in components — always go through hooks/mutations
- No `alert()` — use Sonner toasts only
- No direct `process.env` — use `import.meta.env`
- All forms use React Hook Form + Zod — no uncontrolled inputs
- All protected pages wrapped in `<ErrorBoundary>`
- All list queries filter out `deletedAt !== null` on the backend — frontend
  does not need to filter
- Loading states use Skeleton components, not spinners (except button states)
- The `@` alias maps to `src/` — use it everywhere instead of relative paths
