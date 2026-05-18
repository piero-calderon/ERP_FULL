import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="h-12 w-12 rounded-xl bg-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-blue-200 mb-4">
            S
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">START ERP</h1>
          <p className="text-slate-500">Gestión Inteligente de Distribución</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8">
          <Outlet />
        </div>
        
        <p className="mt-8 text-center text-sm text-slate-400">
          &copy; 2026 START ERP. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}
