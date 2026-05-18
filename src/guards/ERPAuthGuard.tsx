// Guard de autenticacion para el ERP
import { Navigate, useLocation } from "react-router-dom";
import { useERPAuth } from "@/store/erp.auth.store";

export function ERPAuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, tieneAcceso } = useERPAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!tieneAcceso(location.pathname)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
