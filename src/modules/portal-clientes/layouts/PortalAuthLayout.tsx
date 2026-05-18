import { Outlet } from 'react-router-dom';
import { Building2 } from 'lucide-react';

export default function PortalAuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 bg-blue-600 rounded-2xl items-center justify-center mb-4">
            <Building2 className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Portal del Cliente</h1>
          <p className="text-slate-400 text-sm mt-1">Acceso exclusivo para clientes registrados</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <Outlet />
        </div>

        <p className="text-center text-slate-500 text-xs mt-6">
          © {new Date().getFullYear()} START ERP · Todos los derechos reservados
        </p>
      </div>
    </div>
  );
}
