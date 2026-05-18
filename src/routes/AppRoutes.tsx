// AppRoutes - GEA SERVICES ERP con autenticacion por rol
import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import AuthLayout from "@/layouts/AuthLayout";
import ERPLoginPage from "@/pages/ERPLoginPage";
import { LoadingScreen } from "@/shared/components/feedback/LoadingScreen";
import { PATHS } from "@/constants/paths";
import PortalLayout from "@/modules/portal-clientes/layouts/PortalLayout";
import PortalAuthLayout from "@/modules/portal-clientes/layouts/PortalAuthLayout";
import { PortalAuthGuard } from "@/modules/portal-clientes/guards/PortalAuthGuard";

const HomePage         = lazy(() => import("@/modules/dashboard/pages/HomePage"));
const DashboardPage    = lazy(() => import("@/modules/dashboard/pages/DashboardPage"));
const LogisticsPage    = lazy(() => import("@/modules/logistics/pages/LogisticsPage"));
const InventarioPage   = lazy(() => import("@/modules/inventory/pages/InventoryPage"));
const CRMPage          = lazy(() => import("@/modules/crm/pages/CRMPage"));
const VentasPage       = lazy(() => import("@/modules/ventas/pages/VentasPage"));
const ComprasPage      = lazy(() => import("@/modules/compras/pages/ComprasPage"));
const QualityPage      = lazy(() => import("@/modules/quality/pages/QualityPage"));
const FinancePage      = lazy(() => import("@/modules/finance/pages/FinancePage"));
const DocumentosPage   = lazy(() => import("@/modules/documentos/pages/DocumentosPage"));
const ReportesPage     = lazy(() => import("@/modules/reportes/pages/ReportesPage"));
const NotificacionesPage = lazy(() => import("@/modules/notificaciones/pages/NotificacionesPage"));
const AuditoriaPage    = lazy(() => import("@/modules/auditoria/pages/AuditoriaPage"));
const IntegracionesPage = lazy(() => import("@/modules/integraciones/pages/IntegracionesPage"));
const ConfiguracionPage = lazy(() => import("@/modules/configuracion/pages/ConfiguracionPage"));

const PortalLoginPage        = lazy(() => import("@/modules/portal-clientes/auth/pages/LoginPage"));
const PortalMFAPage          = lazy(() => import("@/modules/portal-clientes/auth/pages/MFAPage"));
const PortalForgotPage       = lazy(() => import("@/modules/portal-clientes/auth/pages/ForgotPasswordPage"));
const PortalAccessDeniedPage = lazy(() => import("@/modules/portal-clientes/auth/pages/AccessDeniedPage"));
const PortalDashboardPage    = lazy(() => import("@/modules/portal-clientes/dashboard/pages/PortalDashboardPage"));
const CatalogoPage           = lazy(() => import("@/modules/portal-clientes/catalogo/pages/CatalogoPage"));
const PortalPedidosPage      = lazy(() => import("@/modules/portal-clientes/pedidos/pages/PedidosPage"));
const FacturasPage           = lazy(() => import("@/modules/portal-clientes/facturas/pages/FacturasPage"));
const ReclamosPage           = lazy(() => import("@/modules/portal-clientes/reclamos/pages/ReclamosPage"));
const EvaluacionesPage       = lazy(() => import("@/modules/portal-clientes/evaluaciones/pages/EvaluacionesPage"));
const PortalPerfilPage       = lazy(() => import("@/modules/portal-clientes/auth/pages/PortalPerfilPage"));

const SuspenseWrapper = () => (
  <Suspense fallback={<LoadingScreen />}><Outlet /></Suspense>
);

const router = createBrowserRouter([
  // Login ERP
  { path: "/login", element: <ERPLoginPage /> },

  // App principal (protegida por MainLayout que verifica auth)
  {
    path: "/",
    element: <MainLayout />,
    children: [{
      element: <SuspenseWrapper />,
      children: [
        { index: true,              element: <HomePage /> },
        { path: "dashboard",        element: <DashboardPage /> },
        { path: "crm",              element: <CRMPage /> },
        { path: "ventas",           element: <VentasPage /> },
        { path: "inventario",       element: <InventarioPage /> },
        { path: "logistica",        element: <LogisticsPage /> },
        { path: "compras",          element: <ComprasPage /> },
        { path: "calidad",          element: <QualityPage /> },
        { path: "finanzas",         element: <FinancePage /> },
        { path: "documentos",       element: <DocumentosPage /> },
        { path: "reportes",         element: <ReportesPage /> },
        { path: "notificaciones",   element: <NotificacionesPage /> },
        { path: "integraciones",    element: <IntegracionesPage /> },
        { path: "auditoria",        element: <AuditoriaPage /> },
        { path: "configuracion",    element: <ConfiguracionPage /> },
      ]
    }],
  },

  { path: "/auth", element: <AuthLayout />, children: [{ path: "login", element: <div>Login</div> }] },

  {
    path: "/portal",
    children: [
      {
        element: <PortalAuthLayout />,
        children: [
          { index: true, element: <Navigate to="/portal/login" replace /> },
          { path: "login",           element: <Suspense fallback={<LoadingScreen />}><PortalLoginPage /></Suspense> },
          { path: "mfa",             element: <Suspense fallback={<LoadingScreen />}><PortalMFAPage /></Suspense> },
          { path: "forgot-password", element: <Suspense fallback={<LoadingScreen />}><PortalForgotPage /></Suspense> },
          { path: "access-denied",   element: <Suspense fallback={<LoadingScreen />}><PortalAccessDeniedPage /></Suspense> },
        ],
      },
      {
        element: <PortalAuthGuard />,
        children: [{
          element: <PortalLayout />,
          children: [
            { path: "dashboard",    element: <Suspense fallback={<LoadingScreen />}><PortalDashboardPage /></Suspense> },
            { path: "catalogo",     element: <Suspense fallback={<LoadingScreen />}><CatalogoPage /></Suspense> },
            { path: "pedidos",      element: <Suspense fallback={<LoadingScreen />}><PortalPedidosPage /></Suspense> },
            { path: "facturas",     element: <Suspense fallback={<LoadingScreen />}><FacturasPage /></Suspense> },
            { path: "reclamos",     element: <Suspense fallback={<LoadingScreen />}><ReclamosPage /></Suspense> },
            { path: "evaluaciones", element: <Suspense fallback={<LoadingScreen />}><EvaluacionesPage /></Suspense> },
            { path: "perfil",       element: <Suspense fallback={<LoadingScreen />}><PortalPerfilPage /></Suspense> },
          ],
        }],
      },
    ],
  },

  { path: "*", element: <Navigate to="/" replace /> },
]);

export function AppRoutes() {
  return <RouterProvider router={router} />;
}
