import { useEffect } from 'react';
import { ShoppingBag, RefreshCw, Package, BarChart2, ShoppingCart, CheckCircle, XCircle, Minus } from 'lucide-react';
import { PLATAFORMA_ECOMMERCE_CONFIG, ESTADO_INTEGRACION_CONFIG } from '../constants/integraciones.constants';
import type { ConectorEcommerce, EcommerceSyncLog } from '../types/integraciones.types';

interface Props {
  conectores: ConectorEcommerce[];
  logs: EcommerceSyncLog[];
  onSincronizar: (id: string, tipo: 'catalogo' | 'stock' | 'pedidos') => Promise<void>;
  onDesconectar: (id: string) => Promise<void>;
  onRefrescar: () => Promise<void>;
}

const TIPO_ICON = { catalogo: Package, stock: BarChart2, pedidos: ShoppingCart };
const RESULTADO_ICON = { ok: CheckCircle, error: XCircle, parcial: Minus };
const RESULTADO_COLOR = { ok: 'text-emerald-600', error: 'text-red-600', parcial: 'text-amber-600' };
const ESTADO_COLOR = { ok: 'text-emerald-600 bg-emerald-50', error: 'text-red-600 bg-red-50', parcial: 'text-amber-600 bg-amber-50' };

function EcommerceCard({ c, onSincronizar, onDesconectar }: {
  c: ConectorEcommerce;
  onSincronizar: (tipo: 'catalogo'|'stock'|'pedidos') => void;
  onDesconectar: () => void;
}) {
  const prov = PLATAFORMA_ECOMMERCE_CONFIG[c.plataforma];
  const estadoCfg = ESTADO_INTEGRACION_CONFIG[c.estado] ?? ESTADO_INTEGRACION_CONFIG.desconectado;
  const sincing = c.sincronizandoCatalogo || c.sincronizandoStock || c.sincronizandoPedidos;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${prov?.bg ?? 'bg-slate-50'}`}>
            <ShoppingBag className={`w-5 h-5 ${prov?.color ?? 'text-slate-600'}`} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">{prov?.nombre ?? c.plataforma}</p>
            <p className="text-xs text-slate-500">{c.shop}</p>
          </div>
        </div>
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${estadoCfg.bg} ${estadoCfg.color}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${estadoCfg.dot}`} />
          {estadoCfg.label}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        {[
          { icon: Package, label: 'Productos', value: c.productosSync, sync: 'catalogo' as const, loading: c.sincronizandoCatalogo },
          { icon: BarChart2, label: 'Stock', value: c.stockSync, sync: 'stock' as const, loading: c.sincronizandoStock },
          { icon: ShoppingCart, label: 'Pedidos', value: c.pedidosSync, sync: 'pedidos' as const, loading: c.sincronizandoPedidos },
        ].map(({ icon: Icon, label, value, sync, loading }) => (
          <button key={sync} onClick={() => onSincronizar(sync)} disabled={loading || c.estado !== 'conectado'}
            className="bg-slate-50 rounded-xl p-3 hover:bg-slate-100 disabled:opacity-60 disabled:cursor-not-allowed transition-colors group">
            <Icon className={`w-4 h-4 mx-auto mb-1 ${loading ? 'animate-spin text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
            <p className="text-sm font-bold text-slate-800">{value.toLocaleString()}</p>
            <p className="text-xs text-slate-500">{label}</p>
            {loading && <p className="text-xs text-blue-600 mt-0.5">Sync…</p>}
          </button>
        ))}
      </div>

      <div className="flex gap-2 pt-1 border-t border-slate-50">
        <button onClick={() => onSincronizar('catalogo')} disabled={sincing || c.estado !== 'conectado'}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors">
          <RefreshCw className={`w-3.5 h-3.5 ${sincing ? 'animate-spin' : ''}`} />
          Sincronizar todo
        </button>
        {c.estado !== 'desconectado' && (
          <button onClick={onDesconectar}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-600 text-xs font-medium rounded-lg hover:bg-slate-200 transition-colors">
            Desconectar
          </button>
        )}
        {c.ultimaSync && (
          <span className="ml-auto text-xs text-slate-400 self-center">
            Sync: {new Date(c.ultimaSync).toLocaleString('es-ES')}
          </span>
        )}
      </div>
    </div>
  );
}

function LogRow({ log }: { log: EcommerceSyncLog }) {
  const Icon = RESULTADO_ICON[log.estado];
  const TipoIcon = TIPO_ICON[log.tipo];
  return (
    <div className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 text-xs">
      <Icon className={`w-4 h-4 flex-shrink-0 ${RESULTADO_COLOR[log.estado]}`} />
      <TipoIcon className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
      <span className="flex-1 text-slate-600 capitalize">{log.tipo}</span>
      <span className={`px-2 py-0.5 rounded text-xs font-medium ${ESTADO_COLOR[log.estado]}`}>{log.estado}</span>
      <span className="text-slate-500">{log.registros} reg.</span>
      <span className="text-slate-400 w-36 text-right">{new Date(log.timestamp).toLocaleString('es-ES')}</span>
    </div>
  );
}

export function EcommerceTab({ conectores, logs, onSincronizar, onDesconectar, onRefrescar }: Props) {
  useEffect(() => {
    const interval = setInterval(onRefrescar, 4000);
    return () => clearInterval(interval);
  }, [onRefrescar]);

  return (
    <div className="space-y-5">
      <p className="text-sm text-slate-500">{conectores.length} conectores e-commerce</p>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {conectores.map(c => (
          <EcommerceCard
            key={c.id} c={c}
            onSincronizar={tipo => onSincronizar(c.id, tipo)}
            onDesconectar={() => onDesconectar(c.id)}
          />
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-50 flex items-center gap-2">
          <RefreshCw className="w-4 h-4 text-slate-400" />
          <p className="text-sm font-semibold text-slate-700">Log de sincronizaciones</p>
        </div>
        <div className="divide-y divide-slate-50 max-h-72 overflow-y-auto">
          {logs.map(l => <LogRow key={l.id} log={l} />)}
          {logs.length === 0 && <p className="px-5 py-8 text-sm text-slate-400 text-center">Sin logs de sincronización</p>}
        </div>
      </div>
    </div>
  );
}
