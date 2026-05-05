import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export function Layout() {
  return (
    <div className="min-h-screen bg-surface">
      {/* Fixed sidebar */}
      <Sidebar />

      {/* Fixed topbar */}
      <Topbar />

      {/* Main content — offset by sidebar width (240px) and topbar height (56px) */}
      <main
        className="min-h-screen"
        style={{ marginLeft: 240, paddingTop: 56 }}
      >
        <div className="max-w-[1200px] mx-auto px-6 py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
