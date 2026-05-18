import { Bell, Search, HelpCircle, Menu, Sun, Moon } from "lucide-react";
import { Breadcrumbs } from "@/shared/components/layout/Breadcrumbs";
import { useUIStore } from "@/store/ui.store";
import { useERPAuth } from "@/store/erp.auth.store";
import { cn } from "@/utils/utils";

const ROL_LABELS: Record<string, string> = {
  admin: "Super Admin",
  comercial: "Area Comercial",
  operativa: "Area Operativa",
  empresarial: "Gestion Empresarial",
  administracion: "Administracion",
};

export function Topbar() {
  const { toggleSidebar, theme, toggleTheme } = useUIStore();
  const { usuario } = useERPAuth();

  return (
    <header className="h-20 border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-40 px-8 flex items-center justify-between shadow-sm border-slate-100 dark:border-slate-800">
      <div className="flex items-center gap-6 flex-1">
        <button onClick={toggleSidebar} className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <Menu className="h-6 w-6 text-slate-600 dark:text-slate-300" />
        </button>
        <div className="hidden md:block"><Breadcrumbs /></div>
      </div>

      <div className="flex items-center gap-2 lg:gap-6">
        <div className="relative max-w-[240px] hidden xl:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input type="text" placeholder="Buscar..."
            className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-transparent rounded-xl text-sm focus:bg-white dark:focus:bg-slate-700 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none border border-transparent focus:border-blue-500/20 dark:text-slate-200 dark:placeholder-slate-400" />
        </div>

        <div className="flex items-center gap-1 lg:gap-3">
          <button onClick={toggleTheme}
            className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-all active:scale-95"
            title={theme === "light" ? "Modo oscuro" : "Modo claro"}>
            {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5 text-yellow-400" />}
          </button>
          <button className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 relative text-slate-500 dark:text-slate-400 transition-all active:scale-95">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
          </button>
          <button className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-all active:scale-95">
            <HelpCircle className="h-5 w-5" />
          </button>
        </div>

        <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-700 mx-2 hidden sm:block"></div>

        <div className="flex items-center gap-3 p-1.5 rounded-xl">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-900 dark:text-white leading-none">{usuario?.nombre ?? "Admin Usuario"}</p>
            <p className="text-[10px] text-blue-600 mt-1 font-bold uppercase tracking-wider">{ROL_LABELS[usuario?.rol ?? "admin"] ?? "Super Admin"}</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 to-blue-700 flex items-center justify-center text-white text-xs font-bold shadow-md">
            {usuario?.avatar ?? "AD"}
          </div>
        </div>
      </div>
    </header>
  );
}
