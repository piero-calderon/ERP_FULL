import { Navigate, Outlet } from 'react-router-dom';
import { usePortalAuthStore } from '../auth/store/auth.store';

export function PortalAuthGuard() {
  const isAuthenticated = usePortalAuthStore(s => s.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/portal/login" replace />;
  }

  return <Outlet />;
}
