import { Outlet, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { useUIStore } from "@/store/ui.store";
import { useERPAuth } from "@/store/erp.auth.store";
import { useT } from "@/i18n/useT";
import { cn } from "@/utils/utils";

export default function MainLayout() {
  const { sidebarOpen, theme } = useUIStore();
  const { isAuthenticated } = useERPAuth();
  const t = useT();

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [theme]);

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className={cn("min-h-screen flex", theme === "dark" ? "bg-slate-950" : "bg-slate-50")}>
      <Sidebar />
      <div className={cn("flex-1 flex flex-col transition-all duration-300", sidebarOpen ? "pl-64" : "pl-20")}>
        <Topbar />
        <main className={cn("flex-1 p-8 overflow-y-auto", theme === "dark" ? "text-slate-100" : "text-slate-900")}>
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
        <footer className={cn("h-16 border-t px-8 flex items-center justify-between text-xs font-semibold uppercase tracking-widest",
          theme === "dark" ? "bg-slate-900 border-slate-800 text-slate-500" : "bg-white border-slate-100 text-slate-400")}>
          <p>{t.footerCopyright}</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-blue-500 transition-all">{t.soporteTecnico}</a>
            <a href="#" className="hover:text-blue-500 transition-all">{t.documentacionAPI}</a>
          </div>
        </footer>
      </div>
    </div>
  );
}
