import { useEffect } from 'react';
import { BookOpen, RefreshCw, CheckCircle, XCircle, Minus } from 'lucide-react';
import { PROVEEDOR_CONTABLE_CONFIG, ESTADO_INTEGRACION_CONFIG } from '../constants/integraciones.constants';
import { ConnectionCard, MetaStat } from './ConnectionCard';
import type { ConectorContable, SyncLog } from '../types/integraciones.types';

interface Props {
  conectores: ConectorContable[];
  logs: SyncLog[];
  onSincronizar: (id: string) => Promise<void>;
  onDesconectar: (id: string) => Promise<void>;
  onRefrescar: () => Promise<void>;
}

const RESULTADO_ICON = { ok: CheckCircle, error: XCircle, parcial: Minus };
const RESULTADO_COLOR = { ok: 'text-emerald-600', error: 'text-red-600', parcial: 'text-amber-600' };

function SyncLogRow({ log }: { log: SyncLog }) {
  const Icon = RESULTADO_ICON[log.resultado];
  return (
    <div className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 text-xs">
      <Icon className={`w-4 h-4 flex-shrink-0 ${RESULTADO_COLOR[log.resultado]}`} />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-slate-700">{log.conectorNombre}</p>
        <p className="text-slate-400 truncate">{log.detalle}</p>
      </div>
      <span className="text-slate-500">{log.registros} reg.</span>
      {log.errores > 0 && <span className="text-red-600">{log.errores} err.</span>}
      <span className="text-slate-400">{log.duracionMs}ms</span>
      <span className="text-slate-400 w-28 text-right">{new Date(log.timestamp).toLocaleString('es-ES')}</span>
    </div>
  );
}

export function ContabilidadTab({ conectores, logs, onSincronizar, onDesconectar, onRefrescar }: Props) {
  useEffect(() => {
    const interval = setInterval(onRefrescar, 4000);
    return () => clearInterval(interval);
  }, [onRefrescar]);

  return (
    <div className="space-y-5">
      <p className="text-sm text-slate-500">{conectores.length} conectores contables configurados</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {conectores.map(c => {
          const prov = PROVEEDOR_CONTABLE_CONFIG[c.proveedor];
          const estadoCfg = ESTADO_INTEGRACION_CONFIG[c.estado] ?? ESTADO_INTEGRACION_CONFIG.desconectado;
          return (
            <ConnectionCard
              key={c.id}
              title={prov?.nombre ?? c.proveedor}
              subtitle={`${c.nombre} · ${c.empresa}`}
              estado={c.estado}
              icon={<BookOpen className={`w-5 h-5 ${prov?.color ?? 'text-slate-600'}`} />}
              syncing={c.estado === 'sincronizando'}
              onSync={() => onSincronizar(c.id)}
              onDisconnect={c.estado !== 'desconectado' ? () => onDesconectar(c.id) : undefined}
              meta={
                <>
                  <MetaStat label="Registros sync" value={c.registrosSincronizados.toLocaleString()} />
                  <MetaStat label="Errores último sync" value={c.erroresUltimaSync} highlight={c.erroresUltimaSync > 0} />
                  <MetaStat label="Frecuencia" value={c.frecuencia.charAt(0).toUpperCase() + c.frecuencia.slice(1)} />
                  <MetaStat label="Última sync" value={c.ultimaSync ? new Date(c.ultimaSync).toLocaleString('es-ES') : 'Nunca'} />
                </>
              }>
              <div className="text-xs text-slate-500">
                <span className="font-mono">{c.endpoint}</span> · Usuario: <strong>{c.usuario}</strong>
              </div>
              {c.estado === 'sincronizando' && (
                <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full animate-pulse w-3/5" />
                </div>
              )}
            </ConnectionCard>
          );
        })}
      </div>

      {/* Sync log */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-50 flex items-center gap-2">
          <RefreshCw className="w-4 h-4 text-slate-400" />
          <p className="text-sm font-semibold text-slate-700">Historial de sincronizaciones</p>
        </div>
        <div className="divide-y divide-slate-50 max-h-72 overflow-y-auto">
          {logs.map(l => <SyncLogRow key={l.id} log={l} />)}
          {logs.length === 0 && <p className="px-5 py-8 text-sm text-slate-400 text-center">Sin registros de sincronización</p>}
        </div>
      </div>
    </div>
  );
}
