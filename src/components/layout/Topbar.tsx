import { useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  '/dashboard':    { title: 'Dashboard',    subtitle: "Your job search at a glance" },
  '/applications': { title: 'Applications', subtitle: 'Track and manage your job applications' },
  '/resumes':      { title: 'Resumes',      subtitle: 'Manage your resume versions' },
  '/settings':     { title: 'Settings',     subtitle: 'Manage your account and preferences' },
};

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="9" r="6"/>
    <path d="M15 15l3 3"/>
  </svg>
);

const BellIcon = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 2a6 6 0 0 0-6 6v3l-1.5 2.5h15L16 11V8a6 6 0 0 0-6-6z"/>
    <path d="M10 18a2 2 0 0 0 2-2H8a2 2 0 0 0 2 2z"/>
  </svg>
);

export function Topbar() {
  const { pathname } = useLocation();
  const { user } = useAuthStore();

  // Match exact or parent path
  const pageKey = Object.keys(PAGE_TITLES).find((k) =>
    pathname === k || pathname.startsWith(k + '/')
  );
  const { title, subtitle } = PAGE_TITLES[pageKey ?? '/dashboard'];

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <header className="app-topbar">
      {/* Page title */}
      <div className="flex-1 min-w-0">
        <h1 className="text-[15px] font-semibold text-[#1A1C1C] leading-tight">{title}</h1>
        <p className="text-xs text-[#777587] mt-0.5 hidden sm:block">{subtitle}</p>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <button
          id="topbar-search-btn"
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-[#777587] bg-[#F3F3F3] hover:bg-[#EEEEEE] transition-colors border border-[#E8E8E8]"
          style={{ minWidth: 180 }}
        >
          <SearchIcon />
          <span className="text-xs">Search…</span>
          <span className="ml-auto text-[10px] text-[#C7C4D8] font-mono bg-white border border-[#E8E8E8] rounded px-1">⌘K</span>
        </button>

        {/* Notification bell */}
        <button
          id="topbar-notification-btn"
          className="relative w-8 h-8 flex items-center justify-center rounded-lg text-[#464555] hover:bg-[#EEEEEE] transition-colors"
        >
          <BellIcon />
          {/* Indicator dot */}
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary-500" />
        </button>

        {/* Divider */}
        <div className="w-px h-5 bg-[#E8E8E8] mx-1" />

        {/* Avatar */}
        <button
          id="topbar-profile-btn"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <div
            className="avatar w-7 h-7 text-xs text-white"
            style={{ background: '#4F46E5' }}
          >
            {initials}
          </div>
          <span className="text-xs font-medium text-[#1A1C1C] hidden lg:block">
            {user?.name?.split(' ')[0] ?? 'User'}
          </span>
        </button>
      </div>
    </header>
  );
}
