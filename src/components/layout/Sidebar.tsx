import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore, getRefreshToken } from '@/store/authStore';
import { api } from '@/lib/axios';
import { toast } from 'sonner';

/* ── Material Symbols subset (inline SVGs matching Stitch design) ── */
const DashboardIcon = () => (
  <svg className="nav-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="7" height="7" rx="1.5" />
    <rect x="11" y="2" width="7" height="7" rx="1.5" />
    <rect x="2" y="11" width="7" height="7" rx="1.5" />
    <rect x="11" y="11" width="7" height="7" rx="1.5" />
  </svg>
);

const ApplicationsIcon = () => (
  <svg className="nav-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/>
    <path d="M7 7h6M7 10h6M7 13h4"/>
  </svg>
);

const ResumesIcon = () => (
  <svg className="nav-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7l-5-5z"/>
    <path d="M11 2v5h5"/>
    <path d="M7 11h6M7 14h4"/>
  </svg>
);

const SettingsIcon = () => (
  <svg className="nav-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="10" cy="10" r="3"/>
    <path d="M10 2v1.5M10 16.5V18M2 10h1.5M16.5 10H18M4.22 4.22l1.06 1.06M14.72 14.72l1.06 1.06M4.22 15.78l1.06-1.06M14.72 5.28l1.06-1.06"/>
  </svg>
);

const LogoutIcon = () => (
  <svg className="nav-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 3h4a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-4"/>
    <polyline points="10 15 14 10 10 5"/>
    <line x1="14" y1="10" x2="3" y2="10"/>
  </svg>
);

const BriefcaseIcon = () => (
  <svg viewBox="0 0 20 20" fill="#FFFFFF" width="16" height="16">
    <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.95 22.95 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd"/>
    <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z"/>
  </svg>
);

const navItems = [
  { to: '/dashboard',    label: 'Dashboard',    icon: <DashboardIcon /> },
  { to: '/applications', label: 'Applications',  icon: <ApplicationsIcon /> },
  { to: '/resumes',      label: 'Resumes',       icon: <ResumesIcon /> },
];

const bottomNavItems = [
  { to: '/settings', label: 'Settings', icon: <SettingsIcon /> },
];

export function Sidebar() {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  async function handleLogout() {
    try {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        await api.post('/v1/auth/logout', { refreshToken });
      }
    } catch {
      // ignore API errors — still clear local auth
    } finally {
      clearAuth();
      navigate('/login');
      toast.success('Logged out successfully');
    }
  }

  return (
    <aside className="app-sidebar">
      {/* ── Brand ── */}
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">
          <BriefcaseIcon />
        </div>
        <span className="sidebar-brand-name">CareerCanvas</span>
      </div>

      {/* ── Main nav ── */}
      <nav className="flex-1 px-0 pt-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `sidebar-nav-item${isActive ? ' active' : ''}`
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* ── Bottom section ── */}
      <div className="border-t border-[#EEEEEE] pt-2 pb-2 space-y-0.5">
        {bottomNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `sidebar-nav-item${isActive ? ' active' : ''}`
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
        <button
          onClick={handleLogout}
          className="sidebar-nav-item w-full text-left text-[#777587] hover:text-red-600"
        >
          <LogoutIcon />
          <span>Logout</span>
        </button>
      </div>

      {/* ── User profile ── */}
      <div className="px-4 py-4 border-t border-[#EEEEEE]">
        <div className="flex items-center gap-3">
          <div
            className="avatar w-8 h-8 text-sm text-white flex-shrink-0"
            style={{ background: '#4F46E5' }}
          >
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[#1A1C1C] truncate leading-tight">
              {user?.name ?? 'User'}
            </p>
            <p className="text-xs text-[#777587] truncate leading-tight mt-0.5">
              {user?.email ?? ''}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
