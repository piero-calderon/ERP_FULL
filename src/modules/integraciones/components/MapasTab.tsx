import { useState } from 'react';
import { MapPin, Navigation, Clock, Ruler } from 'lucide-react';
import { PROVEEDOR_MAPAS_CONFIG, ESTADO_INTEGRACION_CONFIG } from '../constants/integraciones.constants';
import type { ConectorMapas, RouteRequest, ProveedorMapas } from '../types/integraciones.types';

interface Props {
  conector: ConectorMapas | null;
  routes: RouteRequest[];
  onCalcular: (origen: string, destino: string, proveedor: ProveedorMapas) => Promise<void>;
}

export function MapasTab({ conector, routes, onCalcular }: Props) {
  const [origen, setOrigen] = useState('');
  const [destino, setDestino] = useState('');
  const [proveedor, setProveedor] = useState<ProveedorMapas>('googlemaps');
  const [loading, setLoading] = useState(false);
  const [lastRoute, setLastRoute] = useState<RouteRequest | null>(null);

  const handleCalcular = async () => {
    if (!origen.trim() || !destino.trim()) return;
    setLoading(true);
    await onCalcular(origen.trim(), destino.trim(), proveedor);
    setLastRoute(routes[0] ?? null);
    setLoading(false);
    setLastRoute(routes[0] ?? null);
  };

  const usagePct = conector ? Math.round((conector.requestCount / conector.requestLimit) * 100) : 0;

  return (
    <div className="space-y-5">
      {/* Connector status */}
      {conector && (
        <div className="bg-white rounded-2xl border border-slate-100 p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-teal-50 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">{PROVEEDOR_MAPAS_CONFIG[conector.proveedor]?.nombre ?? conector.proveedor}</p>
                <p className="text-xs text-slate-500">Clave: <span className="font-mono">{conector.apiKey}</span></p>
              </div>
            </div>
            {(() => {
              const cfg = ESTADO_INTEGRACION_CONFIG[conector.estado] ?? ESTADO_INTEGRACION_CONFIG.desconectado;
              return (
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${cfg.bg} ${cfg.color}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                  {cfg.label}
                </span>
              );
            })()}
          </div>
          <div className="flex items-center justify-between text-xs text-slate-600 mb-1.5">
            <span>Uso del cupo de peticiones</span>
            <span className="font-semibold">{conector.requestCount.toLocaleString()} / {conector.requestLimit.toLocaleString()}</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${usagePct > 80 ? 'bg-red-500' : usagePct > 60 ? 'bg-amber-500' : 'bg-teal-500'}`}
              style={{ width: `${usagePct}%` }}
            />
          </div>
          <p className="text-xs text-slate-400 mt-1">Último uso: {conector.ultimaUso ? new Date(conector.ultimaUso).toLocaleString('es-ES') : 'Nunca'}</p>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Route calculator */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-slate-400" />
            <p className="text-sm font-semibold text-slate-700">Simulador de rutas</p>
          </div>
          <div>
            <label className="text-xs text-slate-500 block mb-1">Proveedor</label>
            <select value={proveedor} onChange={e => setProveedor(e.target.value as ProveedorMapas)}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              {Object.entries(PROVEEDOR_MAPAS_CONFIG).map(([k, v]) => (
                <option key={k} value={k}>{v.nombre}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-500 block mb-1">Origen</label>
            <input value={origen} onChange={e => setOrigen(e.target.value)} placeholder="Calle Mayor 1, Madrid"
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="text-xs text-slate-500 block mb-1">Destino</label>
            <input value={destino} onChange={e => setDestino(e.target.value)} placeholder="Av. Diagonal 500, Barcelona"
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <button onClick={handleCalcular} disabled={loading || !origen.trim() || !destino.trim()}
            className="w-full py-2.5 bg-teal-600 text-white text-sm font-semibold rounded-xl hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2">
            <Navigation className="w-4 h-4" />
            {loading ? 'Calculando…' : 'Calcular Ruta'}
          </button>

          {routes[0] && (
            <div className="bg-teal-50 rounded-xl p-4 border border-teal-100">
              <p className="text-xs font-semibold text-teal-700 mb-2">Última ruta calculada</p>
              <p className="text-xs text-slate-600 mb-3">{routes[0].origen} → {routes[0].destino}</p>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center">
                  <Ruler className="w-4 h-4 text-teal-600 mx-auto mb-0.5" />
                  <p className="text-sm font-bold text-slate-800">{routes[0].distanciaKm} km</p>
                  <p className="text-xs text-slate-500">Distancia</p>
                </div>
                <div className="text-center">
                  <Clock className="w-4 h-4 text-teal-600 mx-auto mb-0.5" />
                  <p className="text-sm font-bold text-slate-800">{routes[0].duracionMin} min</p>
                  <p className="text-xs text-slate-500">Duración</p>
                </div>
                <div className="text-center">
                  <Navigation className="w-4 h-4 text-teal-600 mx-auto mb-0.5" />
                  <p className="text-sm font-bold text-slate-800">{new Date(routes[0].etaEstimada).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</p>
                  <p className="text-xs text-slate-500">ETA</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Route history */}
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-50">
            <p className="text-sm font-semibold text-slate-700">Historial de rutas ({routes.length})</p>
          </div>
          <div className="divide-y divide-slate-50 max-h-96 overflow-y-auto">
            {routes.map(r => (
              <div key={r.id} className="px-5 py-3 hover:bg-slate-50 text-xs">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="w-3.5 h-3.5 text-teal-500 flex-shrink-0" />
                  <p className="font-medium text-slate-700 truncate">{r.origen} → {r.destino}</p>
                  <span className={`ml-auto text-xs font-medium ${PROVEEDOR_MAPAS_CONFIG[r.proveedor]?.color ?? 'text-slate-500'}`}>{r.proveedor}</span>
                </div>
                <div className="flex gap-4 text-slate-500 pl-5">
                  <span>{r.distanciaKm} km</span>
                  <span>{r.duracionMin} min</span>
                  <span>ETA: {new Date(r.etaEstimada).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
                  <span className="ml-auto">{new Date(r.timestamp).toLocaleString('es-ES')}</span>
                </div>
              </div>
            ))}
            {routes.length === 0 && <p className="px-5 py-8 text-sm text-slate-400 text-center">Sin rutas calculadas</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
