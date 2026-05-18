import { useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Bell, Search } from 'lucide-react';
import { usePedidosStore } from '../pedidos/store/pedidos.store';

const ROUTE_TITLES: Record<string, string> = {
  '/portal/dashboard':    'Dashboard',
  '/portal/catalogo':     'Catálogo de Productos',
  '/portal/pedidos':      'Mis Pedidos',
  '/portal/facturas':     'Facturas y Albaranes',
  '/portal/reclamos':     'Reclamos y Devoluciones',
  '/portal/evaluaciones': 'Mis Evaluaciones',
  '/portal/perfil':       'Mi Perfil',
};

export function PortalTopbar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const itemsCount = usePedidosStore(s => s.getItemsCount());
  const title = ROUTE_TITLES[pathname] ?? 'Portal Cliente';

  return (
    <header className="h-16 bg-white border-b border-slate-100 flex items-center px-6 gap-4 sticky top-0 z-30">
      <h1 className="text-slate-900 font-semibold text-lg flex-1">{title}</h1>

      {/* Search hint */}
      <button className="hidden md:flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl text-slate-400 text-sm hover:bg-slate-100 transition-colors">
        <Search className="w-4 h-4" />
        <span>Buscar...</span>
      </button>

      {/* Notifications */}
      <button className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-50 transition-colors">
        <Bell className="w-5 h-5 text-slate-500" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
      </button>

      {/* Cart */}
      <button
        onClick={() => navigate('/portal/pedidos')}
        className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-50 transition-colors"
      >
        <ShoppingCart className="w-5 h-5 text-slate-500" />
        {itemsCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {itemsCount > 9 ? '9+' : itemsCount}
          </span>
        )}
      </button>
    </header>
  );
}
