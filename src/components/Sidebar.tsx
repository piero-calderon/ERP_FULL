// Sidebar GEA SERVICES ERP - con traducciones
import { NavLink } from "react-router-dom";
import { ChevronLeft, Menu, LayoutDashboard, Target, TrendingUp, Warehouse, Truck, ShoppingBag, Star, DollarSign, FolderOpen, BarChart3, Bell, Settings, Store, Plug, ShieldCheck, LogOut } from "lucide-react";
import { cn } from "@/utils/utils";
import { useUIStore } from "@/store/ui.store";
import { useERPAuth, type ERPRole } from "@/store/erp.auth.store";
import { useT } from "@/i18n/useT";

export function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const { usuario, logout } = useERPAuth();
  const t = useT();

  const TODAS_LAS_AREAS = [
    {
      label: t.areaComercial, color: "text-blue-500", bar: "bg-blue-500",
      roles: ["admin", "comercial"] as ERPRole[],
      items: [
        { icon: LayoutDashboard, label: t.dashboard, path: "/",         exact: true },
        { icon: Target,          label: t.crm,       path: "/crm" },
        { icon: TrendingUp,      label: t.ventas,    path: "/ventas" },
      ],
    },
    {
      label: t.areaOperativa, color: "text-emerald-500", bar: "bg-emerald-500",
      roles: ["admin", "operativa"] as ERPRole[],
      items: [
        { icon: Warehouse,   label: t.inventario, path: "/inventario" },
        { icon: Truck,       label: t.logistica,  path: "/logistica" },
        { icon: ShoppingBag, label: t.compras,    path: "/compras" },
      ],
    },
    {
      label: t.areaEmpresarial, color: "text-violet-500", bar: "bg-violet-500",
      roles: ["admin", "empresarial"] as ERPRole[],
      items: [
        { icon: Star,       label: t.calidad,        path: "/calidad" },
        { icon: DollarSign, label: t.finanzas,       path: "/finanzas" },
        { icon: FolderOpen, label: t.documentos,     path: "/documentos" },
        { icon: BarChart3,  label: t.reportes,       path: "/reportes" },
        { icon: Bell,       label: t.notificaciones, path: "/notificaciones" },
      ],
    },
    {
      label: t.areaAdministracion, color: "text-slate-500", bar: "bg-slate-500",
      roles: ["admin", "administracion"] as ERPRole[],
      items: [
        { icon: Plug,        label: t.integraciones,  path: "/integraciones" },
        { icon: ShieldCheck, label: t.auditoria,      path: "/auditoria" },
        { icon: Store,       label: t.portalCliente,  path: "/portal/login" },
        { icon: Settings,    label: t.configuracion,  path: "/configuracion" },
      ],
    },
  ];

  const areasVisibles = usuario
    ? TODAS_LAS_AREAS.filter(area => area.roles.includes(usuario.rol))
    : TODAS_LAS_AREAS;

  const areasConDashboard = usuario?.rol === "admin"
    ? areasVisibles
    : areasVisibles.map((area, i) => ({
        ...area,
        items: i === 0
          ? [{ icon: LayoutDashboard, label: t.dashboard, path: "/", exact: true }, ...area.items.filter(it => it.path !== "/")]
          : area.items.filter(it => it.path !== "/"),
      }));

  return (
    <aside className={cn(
      "fixed inset-y-0 left-0 z-50 flex flex-col bg-[#0f172a] text-slate-400 transition-all duration-300 border-r border-slate-800 shadow-2xl",
      sidebarOpen ? "w-64" : "w-20"
    )}>
      <div className="flex h-20 items-center px-6 border-b border-slate-800/50 shrink-0">
        <div className={cn("flex items-center gap-3 overflow-hidden transition-all duration-300", !sidebarOpen && "justify-center w-full")}>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-white font-bold shadow-lg shadow-blue-500/20 text-xs tracking-tight">GEA</div>
          {sidebarOpen && (
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white tracking-tight leading-none">GEA <span className="text-blue-500">SERVICES</span></span>
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mt-1">ERP Enterprise</span>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
        {areasConDashboard.map((area) => (
          <div key={area.label}>
            {sidebarOpen ? (
              <div className="flex items-center gap-2 px-2 py-2 mt-2 first:mt-0">
                <div className={cn("w-1 h-3 rounded-full shrink-0", area.bar)} />
                <span className={cn("text-[9px] font-bold uppercase tracking-widest", area.color)}>{area.label}</span>
                <div className="flex-1 h-px bg-slate-800" />
              </div>
            ) : (
              <div className="flex justify-center mt-3 mb-1">
                <div className={cn("w-4 h-0.5 rounded-full", area.bar)} />
              </div>
            )}
            {area.items.map((item) => (
              <NavLink key={item.path} to={item.path} end={!!(item as any).exact}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
                  isActive ? "bg-blue-600 text-white font-medium shadow-lg shadow-blue-600/20" : "hover:bg-slate-800 hover:text-slate-200"
                )}>
                <item.icon className="h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-110" />
                {sidebarOpen && <span className="text-sm tracking-wide">{item.label}</span>}
                {!sidebarOpen && (
                  <div className="absolute left-full ml-4 px-3 py-2 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all translate-x-[-10px] group-hover:translate-x-0 whitespace-nowrap z-50 shadow-xl border border-slate-700">
                    {item.label}
                  </div>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800/50 shrink-0 space-y-2">
        {usuario && (
          <button onClick={logout}
            className="flex w-full items-center justify-center gap-2 rounded-xl h-10 bg-red-900/20 hover:bg-red-900/40 text-red-400 hover:text-red-300 transition-all border border-red-900/30 text-xs font-semibold">
            <LogOut className="h-4 w-4" />
            {sidebarOpen && t.cerrarSesion}
          </button>
        )}
        <button onClick={toggleSidebar}
          className="flex w-full items-center justify-center rounded-xl h-12 bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white transition-all border border-slate-700/50">
          {sidebarOpen ? <ChevronLeft className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
    </aside>
  );
}
