import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, FileText, AlertCircle, Star, TrendingUp, Clock, CheckCircle2, ChevronRight, Package } from 'lucide-react';
import { usePortalAuthStore } from '../../auth/store/auth.store';
import { usePedidosStore } from '../../pedidos/store/pedidos.store';
import { useFacturasStore } from '../../facturas/store/facturas.store';
import { useReclamosStore } from '../../reclamos/store/reclamos.store';
import { useEvaluacionesStore } from '../../evaluaciones/store/evaluaciones.store';
import { ESTADO_PEDIDO_CONFIG } from '../../pedidos/constants/pedidos.constants';
import { PortalStatusBadge } from '../../components/PortalStatusBadge';

export default function PortalDashboardPage() {
  const navigate = useNavigate();
  const { cliente } = usePortalAuthStore();
  const { pedidos, cargar: cargarPedidos, getItemsCount } = usePedidosStore();
  const { documentos, cargar: cargarFacturas } = useFacturasStore();
  const { reclamos, cargar: cargarReclamos } = useReclamosStore();
  const { evaluaciones, cargar: cargarEvaluaciones } = useEvaluacionesStore();

  useEffect(() => {
    cargarPedidos();
    cargarFacturas();
    cargarReclamos();
    cargarEvaluaciones();
  }, [cargarPedidos, cargarFacturas, cargarReclamos, cargarEvaluaciones]);

  const pedidosActivos = pedidos.filter(p => !['entregado', 'cancelado'].includes(p.estado));
  const facturasPendientes = documentos.filter(d => d.tipo === 'factura' && d.estadoPago === 'pendiente');
  const facturasVencidas = documentos.filter(d => d.estadoPago === 'vencido');
  const reclamosAbiertos = reclamos.filter(r => ['abierto', 'en_revision'].includes(r.estado));
  const evalPendientes = evaluaciones.filter(e => e.estado === 'pendiente');
  const carritoItems = getItemsCount();

  const hora = new Date().getHours();
  const saludo = hora < 12 ? 'Buenos días' : hora < 19 ? 'Buenas tardes' : 'Buenas noches';

  const kpis = [
    { label: 'Pedidos activos', value: pedidosActivos.length, icon: ShoppingCart, color: 'text-blue-600', bg: 'bg-blue-50', action: () => navigate('/portal/pedidos') },
    { label: 'Facturas pendientes', value: facturasPendientes.length, icon: FileText, color: 'text-amber-600', bg: 'bg-amber-50', action: () => navigate('/portal/facturas'), alert: facturasVencidas.length > 0 },
    { label: 'Reclamos abiertos', value: reclamosAbiertos.length, icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50', action: () => navigate('/portal/reclamos') },
    { label: 'Evaluaciones pendientes', value: evalPendientes.length, icon: Star, color: 'text-violet-600', bg: 'bg-violet-50', action: () => navigate('/portal/evaluaciones') },
  ];

  const recentPedidos = pedidos.slice(0, 5);

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-blue-200 text-sm font-medium">{saludo},</p>
            <h2 className="text-2xl font-bold mt-1">{cliente?.nombre} {cliente?.apellidos}</h2>
            <p className="text-blue-200 text-sm mt-1">{cliente?.empresa}</p>
          </div>
          {carritoItems > 0 && (
            <button
              onClick={() => navigate('/portal/pedidos')}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
            >
              <ShoppingCart className="w-4 h-4" />
              {carritoItems} {carritoItems === 1 ? 'producto en carrito' : 'productos en carrito'}
            </button>
          )}
        </div>

        <div className="flex gap-4 mt-6">
          <button onClick={() => navigate('/portal/catalogo')} className="flex items-center gap-2 bg-white text-blue-700 text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-blue-50 transition-colors">
            <Package className="w-4 h-4" /> Ver catálogo
          </button>
          <button onClick={() => navigate('/portal/pedidos')} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
            <TrendingUp className="w-4 h-4" /> Mis pedidos
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(({ label, value, icon: Icon, color, bg, action, alert }) => (
          <button key={label} onClick={action} className="bg-white rounded-2xl border border-slate-100 p-5 text-left hover:shadow-md transition-shadow group">
            <div className={`w-11 h-11 ${bg} rounded-xl flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-slate-900">{value}</span>
              {alert && value > 0 && <span className="text-xs text-red-500 font-medium mb-1">¡Atención!</span>}
            </div>
            <p className="text-slate-500 text-sm mt-0.5">{label}</p>
            <div className="flex items-center gap-1 text-xs text-slate-400 mt-2 group-hover:text-blue-600 transition-colors">
              <span>Ver detalle</span>
              <ChevronRight className="w-3 h-3" />
            </div>
          </button>
        ))}
      </div>

      {/* Alerts */}
      {facturasVencidas.length > 0 && (
        <div className="flex items-center gap-4 p-4 bg-red-50 border border-red-200 rounded-2xl">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-red-800 text-sm font-medium">Tienes {facturasVencidas.length} {facturasVencidas.length === 1 ? 'factura vencida' : 'facturas vencidas'}</p>
            <p className="text-red-600 text-xs mt-0.5">Revisa tu estado de cuenta y regulariza el pago.</p>
          </div>
          <button onClick={() => navigate('/portal/facturas')} className="text-red-600 text-xs font-medium hover:underline flex-shrink-0">Ver facturas</button>
        </div>
      )}

      {/* Recent orders */}
      <div className="bg-white rounded-2xl border border-slate-100">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-50">
          <h3 className="font-semibold text-slate-900">Pedidos recientes</h3>
          <button onClick={() => navigate('/portal/pedidos')} className="text-sm text-blue-600 hover:underline">Ver todos</button>
        </div>
        {recentPedidos.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-sm">No tienes pedidos aún.</div>
        ) : (
          <div className="divide-y divide-slate-50">
            {recentPedidos.map(p => {
              const cfg = ESTADO_PEDIDO_CONFIG[p.estado];
              return (
                <div key={p.id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors group">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    {p.estado === 'entregado' ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <Clock className="w-5 h-5 text-slate-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800">{p.numero}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {p.lineas.length} {p.lineas.length === 1 ? 'producto' : 'productos'} · {new Date(p.creadoEn).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <PortalStatusBadge label={cfg.label} color={cfg.color} bg={cfg.bg} />
                    <span className="text-sm font-bold text-slate-900">{p.total.toFixed(2)}€</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick actions */}
      {evalPendientes.length > 0 && (
        <div className="bg-violet-50 border border-violet-100 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-1">
            <Star className="w-5 h-5 text-violet-600" />
            <h3 className="font-semibold text-violet-900">Evaluaciones pendientes</h3>
          </div>
          <p className="text-violet-700 text-sm mb-3">
            Tienes {evalPendientes.length} {evalPendientes.length === 1 ? 'entrega pendiente de valoración' : 'entregas pendientes de valoración'}.
            Tu opinión nos ayuda a mejorar.
          </p>
          <button onClick={() => navigate('/portal/evaluaciones')} className="text-sm font-medium text-violet-600 hover:underline flex items-center gap-1">
            Valorar ahora <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
