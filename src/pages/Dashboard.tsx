import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useApplicationStats } from '@/hooks/useApplicationStats';
import { useRecentActivity } from '@/hooks/useRecentActivity';
import { useApplications } from '@/hooks/useApplications';
import { STATUS_LABELS, STATUS_COLORS } from '@/types';
import { timeAgo, todayISO } from '@/lib/utils';
import { DonutChart } from '@/components/dashboard/DonutChart';
import { BarChart } from '@/components/dashboard/BarChart';
import {
  buildWeeklyBars,
  buildMonthlyBars,
  type ChartView,
} from '@/components/dashboard/buildBars';
import { DashboardSkeleton } from '@/components/dashboard/DashboardSkeleton';
import type { ApplicationStatus } from '@/types';

/* ─── Local helpers (only used here) ─────────────────────────────────── */
function tomorrowISO(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
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
