import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useApplicationStats } from '@/hooks/useApplicationStats';
import { useRecentActivity } from '@/hooks/useRecentActivity';
import { useApplications } from '@/hooks/useApplications';
import { Skeleton } from '@/components/ui/Skeleton';
import { STATUS_LABELS, STATUS_COLORS } from '@/types';
import type { ApplicationStatus } from '@/types';

const WEEKLY_WINDOW = 10;  // last N weeks shown on chart
const MONTHLY_WINDOW = 8;  // last N months shown on chart

/* ─── Helpers ────────────────────────────────────────────────────────── */
function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function tomorrowISO() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatWeekLabel(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatFollowUpBadge(iso: string): { label: string; cls: string } {
  const date = iso.slice(0, 10);
  const today = todayISO();
  const tomorrow = tomorrowISO();
  if (date === today) return { label: 'Today', cls: 'bg-red-100 text-red-700' };
  if (date === tomorrow) return { label: 'Tomorrow', cls: 'bg-amber-100 text-amber-700' };
  return {
    label: new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    cls: 'bg-slate-100 text-slate-600',
  };
}

/* ─── Donut chart ────────────────────────────────────────────────────── */
interface DonutSegment { color: string; value: number; label: string }

function DonutChart({ segments, total }: { segments: DonutSegment[]; total: number }) {
  const r = 38;
  const cx = 50;
  const cy = 50;
  const circumference = 2 * Math.PI * r;
  let cumulativeAngle = -90;

  return (
    <svg viewBox="0 0 100 100" width="120" height="120">
      {total === 0 ? (
        <circle r={r} cx={cx} cy={cy} fill="none" stroke="#E2E8F0" strokeWidth="16" />
      ) : (
        segments.map((seg, i) => {
          const angle = (seg.value / total) * 360;
          const dash = (seg.value / total) * circumference;
          const gap = circumference - dash;
          const rotation = cumulativeAngle;
          cumulativeAngle += angle;
          return (
            <circle
              key={i}
              r={r}
              cx={cx}
              cy={cy}
              fill="none"
              stroke={seg.color}
              strokeWidth="16"
              strokeDasharray={`${dash} ${gap}`}
              strokeDashoffset={0}
              transform={`rotate(${rotation} ${cx} ${cy})`}
            />
          );
        })
      )}
      <text x={cx} y={cy - 5} textAnchor="middle" fontSize="14" fontWeight="700" fill="#1E293B">
        {total}
      </text>
      <text x={cx} y={cy + 9} textAnchor="middle" fontSize="7" fill="#94A3B8" letterSpacing="0.5">
        TOTAL
      </text>
    </svg>
  );
}

/* ─── Bar chart ──────────────────────────────────────────────────────── */
type ChartView = 'weekly' | 'monthly';

interface BarPoint { label: string; count: number }

function buildWeeklyBars(perWeek: Array<{ week: string; count: number }>): BarPoint[] {
  return perWeek.slice(-WEEKLY_WINDOW).map((w) => ({ label: formatWeekLabel(w.week), count: w.count }));
}

function buildMonthlyBars(perWeek: Array<{ week: string; count: number }>): BarPoint[] {
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
    .slice(-MONTHLY_WINDOW)
    .map(([label, v]) => ({ label, count: v.count }));
}

function BarChart({ bars, view }: { bars: BarPoint[]; view: ChartView }) {
  const max = Math.max(...bars.map((b) => b.count), 1);
  const yTicks = [0, Math.round(max / 2), max];

  return (
    <div className="relative">
      {/* Y-axis ticks */}
      <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between pr-2 pointer-events-none">
        {[...yTicks].reverse().map((t) => (
          <span key={t} className="text-[10px] text-slate-400 leading-none">{t}</span>
        ))}
      </div>

      {/* Bars */}
      <div className="ml-6 flex items-end gap-1.5 h-32">
        {bars.map((b, i) => {
          const isLast = i === bars.length - 1;
          const heightPct = max > 0 ? (b.count / max) * 100 : 0;
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-0.5 group">
              {b.count > 0 && (
                <span className="text-[9px] text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  {b.count}
                </span>
              )}
              <div className="relative w-full flex-1 flex items-end">
                <div
                  className="w-full rounded-t transition-all duration-500"
                  style={{
                    height: `${Math.max(heightPct, b.count > 0 ? 6 : 1)}%`,
                    background: isLast ? '#6366F1' : '#C7D2FE',
                    minHeight: 2,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* X-axis labels */}
      <div className="ml-6 flex gap-1.5 mt-1.5">
        {bars.map((b, i) => (
          <div key={i} className="flex-1 text-center">
            <span className={`text-[9px] ${i === bars.length - 1 ? 'text-indigo-600 font-medium' : 'text-slate-400'}`}>
              {view === 'weekly' ? b.label.split(' ')[1] ?? b.label : b.label.split(' ')[0]}
            </span>
          </div>
        ))}
      </div>
      {/* Month row for weekly view */}
      {view === 'weekly' && (
        <div className="ml-6 flex gap-1.5">
          {bars.map((b, i) => (
            <div key={i} className="flex-1 text-center">
              <span className="text-[9px] text-slate-300">{b.label.split(' ')[0]}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Skeleton ───────────────────────────────────────────────────────── */
function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <Skeleton className="h-56 rounded-xl lg:col-span-3" />
        <Skeleton className="h-56 rounded-xl lg:col-span-2" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <Skeleton className="h-64 rounded-xl lg:col-span-3" />
        <Skeleton className="h-64 rounded-xl lg:col-span-2" />
      </div>
    </div>
  );
}

/* ─── Main ───────────────────────────────────────────────────────────── */
export default function Dashboard() {
  const { user } = useAuthStore();
  const [chartView, setChartView] = useState<ChartView>('weekly');

  const { data: stats, isLoading: statsLoading } = useApplicationStats();
  const { data: activity, isLoading: activityLoading } = useRecentActivity(6);
  const { data: followUpData } = useApplications({
    followUpDateAfter: todayISO(),
    limit: 5,
  });

  if (statsLoading || activityLoading) return <DashboardSkeleton />;

  const total = stats?.total ?? 0;
  const thisWeek = stats?.thisWeek ?? 0;
  const byStatus = stats?.byStatus ?? ({} as Record<ApplicationStatus, number>);
  const perWeek = stats?.perWeek ?? [];

  const interviewCount = (byStatus.PHONE_SCREEN ?? 0) + (byStatus.INTERVIEW ?? 0);
  const offerCount = byStatus.OFFER ?? 0;

  const bars = chartView === 'weekly' ? buildWeeklyBars(perWeek) : buildMonthlyBars(perWeek);

  const donutStatuses: ApplicationStatus[] = ['APPLIED', 'PHONE_SCREEN', 'INTERVIEW', 'OFFER', 'REJECTED', 'WITHDRAWN', 'WISHLIST'];
  const donutSegments = donutStatuses
    .filter((s) => (byStatus[s] ?? 0) > 0)
    .map((s) => ({ color: STATUS_COLORS[s], value: byStatus[s] ?? 0, label: STATUS_LABELS[s] }));

  const followUps = followUpData?.items ?? [];
  const firstName = user?.name?.split(' ')[0] ?? 'there';

  const statCards = [
    {
      label: 'Total Applications',
      value: total,
      icon: (
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="#6366F1" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/>
          <path d="M7 7h6M7 10h6M7 13h4"/>
        </svg>
      ),
      iconBg: 'bg-indigo-50',
      valueClass: 'text-indigo-600',
    },
    {
      label: 'This Week',
      value: thisWeek,
      icon: (
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="#0284C7" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="4" width="16" height="14" rx="2"/>
          <path d="M2 8h16M6 2v4M14 2v4"/>
        </svg>
      ),
      iconBg: 'bg-sky-50',
      valueClass: 'text-sky-600',
    },
    {
      label: 'In Interview',
      value: interviewCount,
      icon: (
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="#7C3AED" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 14a2 2 0 0 1-2 2H5l-3 3V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v9z"/>
        </svg>
      ),
      iconBg: 'bg-violet-50',
      valueClass: 'text-violet-600',
    },
    {
      label: 'Offers Received',
      value: offerCount,
      icon: (
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="#16A34A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 10l4 4 8-8"/>
          <path d="M20 12v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h9"/>
        </svg>
      ),
      iconBg: 'bg-green-50',
      valueClass: 'text-green-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Welcome back, {firstName}.</h2>
          <p className="text-sm text-slate-500 mt-0.5">Here's what's happening with your job search today.</p>
        </div>
        <Link
          to="/applications"
          className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M10 4v12M4 10h12"/>
          </svg>
          New Application
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((c) => (
          <div key={c.label} className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-start justify-between">
              <p className="text-xs font-medium text-slate-500">{c.label}</p>
              <div className={`${c.iconBg} p-1.5 rounded-lg`}>{c.icon}</div>
            </div>
            <p className={`text-3xl font-bold mt-3 tracking-tight ${c.valueClass}`}>{c.value}</p>
          </div>
        ))}
      </div>

      {/* Chart + Status donut */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

        {/* Applications over time chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-900">Applications over time</h3>
            <div className="flex gap-1 bg-slate-100 rounded-lg p-0.5">
              <button
                onClick={() => setChartView('weekly')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  chartView === 'weekly' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Weekly
              </button>
              <button
                onClick={() => setChartView('monthly')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  chartView === 'monthly' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Monthly
              </button>
            </div>
          </div>

          {bars.length === 0 || bars.every((b) => b.count === 0) ? (
            <div className="h-36 flex items-center justify-center text-sm text-slate-400">
              No application data yet
            </div>
          ) : (
            <BarChart bars={bars} view={chartView} />
          )}
        </div>

        {/* By Status donut */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">By Status</h3>
          {total === 0 ? (
            <div className="h-24 flex items-center justify-center text-sm text-slate-400">
              No applications yet
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <DonutChart segments={donutSegments} total={total} />
              </div>
              <div className="space-y-2 min-w-0 flex-1">
                {donutSegments.slice(0, 6).map((seg) => (
                  <div key={seg.label} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: seg.color }} />
                      <span className="text-xs text-slate-600 truncate">{seg.label}</span>
                    </div>
                    <span className="text-xs font-semibold text-slate-800 flex-shrink-0">{seg.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity + Follow-ups */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-slate-200 lg:col-span-3">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-900">Recent Activity</h3>
            <Link
              to="/applications"
              className="text-xs font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              View all
              <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 10h12M12 4l6 6-6 6"/>
              </svg>
            </Link>
          </div>

          {!activity || activity.length === 0 ? (
            <div className="py-12 flex flex-col items-center gap-3 text-center px-5">
              <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="#6366F1" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/>
                  <path d="M7 7h6M7 10h6M7 13h4"/>
                </svg>
              </div>
              <p className="text-sm text-slate-500">No activity yet. Start tracking your applications!</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {activity.map((log) => {
                const initial = log.application.company.charAt(0).toUpperCase();
                const actionText = log.fromStatus
                  ? `Status changed to ${STATUS_LABELS[log.toStatus]}`
                  : `Added as ${STATUS_LABELS[log.toStatus]}`;
                return (
                  <Link
                    key={log.id}
                    to={`/applications/${log.applicationId}`}
                    className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors"
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0"
                      style={{ background: STATUS_COLORS[log.toStatus] }}
                    >
                      {initial}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">
                        {log.application.company}
                        <span className="font-normal text-slate-500"> · {log.application.role}</span>
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">{actionText}</p>
                    </div>
                    <span className="text-xs text-slate-400 flex-shrink-0">{timeAgo(log.changedAt)}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Upcoming Follow-ups */}
        <div className="bg-white rounded-xl border border-slate-200 lg:col-span-2">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-900">Upcoming Follow-ups</h3>
          </div>

          {followUps.length === 0 ? (
            <div className="py-12 flex flex-col items-center gap-3 text-center px-5">
              <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="#D97706" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="16" height="14" rx="2"/>
                  <path d="M2 8h16M6 2v4M14 2v4"/>
                </svg>
              </div>
              <p className="text-sm text-slate-500">No upcoming follow-ups.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {followUps.map((app) => {
                const badge = app.followUpDate ? formatFollowUpBadge(app.followUpDate) : null;
                return (
                  <Link
                    key={app.id}
                    to={`/applications/${app.id}`}
                    className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors"
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0 bg-indigo-500"
                    >
                      {app.company.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{app.company}</p>
                      <p className="text-xs text-slate-500 truncate mt-0.5">{app.role}</p>
                    </div>
                    {badge && (
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${badge.cls}`}>
                        {badge.label}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
