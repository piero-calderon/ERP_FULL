import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BookOpen, ShoppingCart, FileText, AlertCircle, Star, User, LogOut, Building2, ChevronRight } from 'lucide-react';
import { usePortalAuthStore } from '../auth/store/auth.store';
import { usePedidosStore } from '../pedidos/store/pedidos.store';

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard',     path: '/portal/dashboard' },
  { icon: BookOpen,        label: 'Catálogo',       path: '/portal/catalogo' },
  { icon: ShoppingCart,    label: 'Pedidos',         path: '/portal/pedidos' },
  { icon: FileText,        label: 'Facturas',        path: '/portal/facturas' },
  { icon: AlertCircle,     label: 'Reclamos',        path: '/portal/reclamos' },
  { icon: Star,            label: 'Evaluaciones',    path: '/portal/evaluaciones' },
];

export function PortalSidebar() {
  const navigate = useNavigate();
  const { cliente, logout } = usePortalAuthStore();
  const itemsCount = usePedidosStore(s => s.getItemsCount());

  const handleLogout = () => {
    logout();
    navigate('/portal/login');
  };

  return (
    <aside className="w-64 bg-slate-900 min-h-screen flex flex-col select-none">
      {/* Brand */}
      <div className="px-6 py-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-semibold truncate">Portal Cliente</p>
            <p className="text-slate-400 text-xs truncate">{cliente?.empresa ?? ''}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {NAV_ITEMS.map(({ icon: Icon, label, path }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors group relative ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            <span className="flex-1">{label}</span>
            {label === 'Pedidos' && itemsCount > 0 && (
              <span className="ml-auto bg-blue-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {itemsCount > 9 ? '9+' : itemsCount}
              </span>
            )}
            <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-50 transition-opacity" />
          </NavLink>
        ))}
      </nav>

      {/* Footer user */}
      <div className="border-t border-slate-800 p-3 space-y-1">
        <NavLink
          to="/portal/perfil"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              isActive ? 'bg-slate-700 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`
          }
        >
          <div className="w-7 h-7 bg-slate-700 rounded-full flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-slate-300" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-white text-xs font-medium truncate">{cliente?.nombre} {cliente?.apellidos}</p>
            <p className="text-slate-500 text-xs truncate">{cliente?.email}</p>
          </div>
        </NavLink>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}
