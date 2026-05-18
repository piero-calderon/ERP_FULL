import { useLocation, Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { PATHS } from "@/constants/paths";

export function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  // Map path segments to readable names
  const routeMap: Record<string, string> = {
    clientes: "Clientes",
    crm: "CRM",
    pedidos: "Pedidos",
    productos: "Productos",
    inventario: "Inventario",
    logistica: "Logística",
    conductores: "Conductores",
    reportes: "Reportes",
    configuracion: "Configuración",
  };

  return (
    <nav className="flex items-center space-x-2 text-sm text-slate-500">
      <Link 
        to={PATHS.HOME} 
        className="hover:text-blue-600 transition-colors flex items-center gap-1"
      >
        <Home className="h-4 w-4" />
        <span className="sr-only">Inicio</span>
      </Link>
      
      {pathnames.length > 0 && <ChevronRight className="h-4 w-4 text-slate-300" />}
      
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;
        const displayName = routeMap[name] || name;

        return (
          <div key={name} className="flex items-center space-x-2">
            {isLast ? (
              <span className="font-semibold text-slate-900">{displayName}</span>
            ) : (
              <>
                <Link to={routeTo} className="hover:text-blue-600 transition-colors">
                  {displayName}
                </Link>
                <ChevronRight className="h-4 w-4 text-slate-300" />
              </>
            )}
          </div>
        );
      })}
    </nav>
  );
}
