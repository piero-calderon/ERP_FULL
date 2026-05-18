// GEA SERVICES ERP - Menu principal con traducciones
import { useNavigate } from "react-router-dom";
import { cn } from "@/utils/utils";
import { useERPAuth, type ERPRole } from "@/store/erp.auth.store";
import { useT } from "@/i18n/useT";
import {
  LayoutDashboard, Target, TrendingUp, Warehouse, Truck,
  ShoppingBag, Star, DollarSign, FileText, BarChart3,
  Bell, Puzzle, Shield, Settings, Globe
} from "lucide-react";

const colors: Record<string, { bar: string; icon: string; bg: string; darkBg: string; text: string; hover: string }> = {
  blue:    { bar: "bg-blue-600",    icon: "text-blue-500",    bg: "bg-blue-50",    darkBg: "dark:bg-blue-900/30",    text: "text-blue-600 dark:text-blue-400",    hover: "hover:border-blue-300 dark:hover:border-blue-700" },
  emerald: { bar: "bg-emerald-600", icon: "text-emerald-500", bg: "bg-emerald-50", darkBg: "dark:bg-emerald-900/30", text: "text-emerald-600 dark:text-emerald-400", hover: "hover:border-emerald-300 dark:hover:border-emerald-700" },
  violet:  { bar: "bg-violet-600",  icon: "text-violet-500",  bg: "bg-violet-50",  darkBg: "dark:bg-violet-900/30",  text: "text-violet-600 dark:text-violet-400",  hover: "hover:border-violet-300 dark:hover:border-violet-700" },
  slate:   { bar: "bg-slate-500",   icon: "text-slate-400",   bg: "bg-slate-50",   darkBg: "dark:bg-slate-700/30",   text: "text-slate-500 dark:text-slate-400",    hover: "hover:border-slate-300 dark:hover:border-slate-600" },
};

export default function HomePage() {
  const navigate = useNavigate();
  const { usuario } = useERPAuth();
  const t = useT();

  const fecha = new Date().toLocaleDateString(
    useLangFromStore(),
    { weekday: "long", day: "numeric", month: "long", year: "numeric" }
  );

  const TODAS_LAS_AREAS = [
    {
      nombre: t.areaComercial, color: "blue",
      roles: ["admin", "comercial"] as ERPRole[],
      modulos: [
        { icono: LayoutDashboard, label: t.dashboard, path: "/dashboard",    desc: t.descDashboard },
        { icono: Target,          label: t.crm,       path: "/crm",          desc: t.descCRM },
        { icono: TrendingUp,      label: t.ventas,    path: "/ventas",       desc: t.descVentas },
      ],
    },
    {
      nombre: t.areaOperativa, color: "emerald",
      roles: ["admin", "operativa"] as ERPRole[],
      modulos: [
        { icono: Warehouse,   label: t.inventario, path: "/inventario", desc: t.descInventario },
        { icono: ShoppingBag, label: t.compras,    path: "/compras",    desc: t.descCompras },
        { icono: Truck,       label: t.logistica,  path: "/logistica",  desc: t.descLogistica },
      ],
    },
    {
      nombre: t.areaEmpresarial, color: "violet",
      roles: ["admin", "empresarial"] as ERPRole[],
      modulos: [
        { icono: Star,      label: t.calidad,        path: "/calidad",        desc: t.descCalidad },
        { icono: DollarSign,label: t.finanzas,       path: "/finanzas",       desc: t.descFinanzas },
        { icono: FileText,  label: t.documentos,     path: "/documentos",     desc: t.descDocumentos },
        { icono: BarChart3, label: t.reportes,       path: "/reportes",       desc: t.descReportes },
        { icono: Bell,      label: t.notificaciones, path: "/notificaciones", desc: t.descNotificaciones },
      ],
    },
    {
      nombre: t.areaAdministracion, color: "slate",
      roles: ["admin", "administracion"] as ERPRole[],
      modulos: [
        { icono: Settings, label: t.configuracion,  path: "/configuracion",  desc: t.descConfiguracion },
        { icono: Shield,   label: t.auditoria,      path: "/auditoria",      desc: t.descAuditoria },
        { icono: Puzzle,   label: t.integraciones,  path: "/integraciones",  desc: t.descIntegraciones },
        { icono: Globe,    label: t.portalCliente,  path: "/portal/login",   desc: t.descPortalCliente },
      ],
    },
  ];

  const areasVisibles = usuario
    ? TODAS_LAS_AREAS.filter(area => area.roles.includes(usuario.rol))
    : TODAS_LAS_AREAS;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{t.panelPrincipal}</h1>
          <p className="text-slate-400 mt-1 text-sm capitalize">{fecha}</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700 rounded-xl">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">{t.sistemaOperativo}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: t.ventasMes,      valor: "84.320 EUR", sub: t.ventasMesSub },
          { label: t.productosStock, valor: "1.248",      sub: t.productosStockSub },
          { label: t.pedidosActivos, valor: "57",         sub: `3 ${t.pendientesDespachar}` },
          { label: t.stockCritico,   valor: "8",          sub: `3 ${t.productosStockSubText}` },
        ].map(k => (
          <div key={k.label} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm px-5 py-4">
            <p className="text-xs text-slate-400 mb-1">{k.label}</p>
            <p className="text-xl font-extrabold text-slate-900 dark:text-white">{k.valor}</p>
            <p className="text-xs text-slate-400 mt-1">{k.sub}</p>
          </div>
        ))}
      </div>

      {areasVisibles.map((area) => {
        const c = colors[area.color];
        return (
          <div key={area.nombre}>
            <div className="flex items-center gap-3 mb-4">
              <div className={cn("w-1 h-5 rounded-full", c.bar)} />
              <p className={cn("text-xs font-bold uppercase tracking-widest", c.text)}>{area.nombre}</p>
              <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {area.modulos.map((mod) => (
                <button key={mod.label} onClick={() => navigate(mod.path)}
                  className={cn(
                    "relative flex flex-col items-center gap-3 p-5 rounded-2xl border text-center transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer",
                    "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700", c.hover
                  )}>
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", c.bg, c.darkBg)}>
                    <mod.icono className={cn("w-6 h-6", c.icon)} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{mod.label}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{mod.desc}</p>
                  </div>
                  <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400">
                    {t.activo}
                  </span>
                </button>
              ))}
            </div>
          </div>
        );
      })}

      <div className="text-center py-4 border-t border-slate-100 dark:border-slate-800">
        <p className="text-xs text-slate-300 dark:text-slate-600">
          GEA SERVICES ERP v2.0 · Distribuzione Prodotti per la Pulizia
        </p>
      </div>
    </div>
  );
}

// Helper para obtener el locale correcto
function useLangFromStore() {
  try {
    const stored = localStorage.getItem("erp-lang");
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.state?.lang === "it" ? "it-IT" : "es-ES";
    }
  } catch { /* */ }
  return "es-ES";
}
