import { Link } from 'react-router-dom';
import { ShieldX, ArrowLeft } from 'lucide-react';

export default function AccessDeniedPage() {
  return (
    <div className="text-center py-4">
      <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <ShieldX className="w-7 h-7 text-red-600" />
      </div>
      <h2 className="text-xl font-bold text-slate-900 mb-2">Acceso denegado</h2>
      <p className="text-slate-500 text-sm mb-6">
        No tienes permisos para acceder a esta sección. Contacta con tu administrador.
      </p>
      <Link to="/portal/dashboard" className="inline-flex items-center gap-2 text-blue-600 text-sm font-medium hover:underline">
        <ArrowLeft className="w-4 h-4" /> Volver al dashboard
      </Link>
    </div>
  );
}
