import { Outlet } from 'react-router-dom';
import { PortalSidebar } from '../components/PortalSidebar';
import { PortalTopbar } from '../components/PortalTopbar';

export default function PortalLayout() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <PortalSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <PortalTopbar />
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
