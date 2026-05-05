import { WEEKLY_CHART_WINDOW, MONTHLY_CHART_WINDOW } from '@/lib/constants';

export interface BarPoint {
  label: string;
  count: number;
}

export type ChartView = 'weekly' | 'monthly';

function formatWeekLabel(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function buildWeeklyBars(perWeek: Array<{ week: string; count: number }>): BarPoint[] {
  return perWeek
    .slice(-WEEKLY_CHART_WINDOW)
    .map((w) => ({ label: formatWeekLabel(w.week), count: w.count }));
}

export function buildMonthlyBars(perWeek: Array<{ week: string; count: number }>): BarPoint[] {
  const byMonth: Map<string, { count: number; order: number }> = new Map();
  perWeek.forEach((w) => {
    const d = new Date(w.week);
    const key = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    const order = d.getFullYear() * 100 + d.getMonth();
    const existing = byMonth.get(key);
    byMonth.set(key, { count: (existing?.count ?? 0) + w.count, order });
  });
  return [...byMonth.entries()]
    .sort((a, b) => a[1].order - b[1].order)
    .slice(-MONTHLY_CHART_WINDOW)
    .map(([label, v]) => ({ label, count: v.count }));
}
