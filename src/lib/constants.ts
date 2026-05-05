export const LOCATION_OPTIONS = [
  { value: 'ONSITE', label: 'On Site' },
  { value: 'REMOTE', label: 'Remote' },
  { value: 'HYBRID', label: 'Hybrid' },
] as const;

export const AVATAR_MAX_BYTES = 2 * 1024 * 1024; // 2 MB

export const RESUME_MAX_SIZE_MB = 5;

export const WEEKLY_CHART_WINDOW = 10;  // last N weeks shown on chart
export const MONTHLY_CHART_WINDOW = 8;  // last N months shown on chart

/**
 * Shared input/select/textarea base class. Combine with `cn(INPUT_BASE_CLASS, hasError ? 'border-red-400' : 'border-slate-300')`.
 */
export const INPUT_BASE_CLASS =
  'w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent';
