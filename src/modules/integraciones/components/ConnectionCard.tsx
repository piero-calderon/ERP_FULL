import { type ReactNode } from 'react';
import { RefreshCw, Unplug } from 'lucide-react';
import { ESTADO_INTEGRACION_CONFIG } from '../constants/integraciones.constants';
import type { EstadoIntegracion } from '../types/integraciones.types';

interface Props {
  title: string;
  subtitle: string;
  estado: EstadoIntegracion;
  icon: ReactNode;
  meta?: ReactNode;
  onSync?: () => void;
  onDisconnect?: () => void;
  syncing?: boolean;
  children?: ReactNode;
}

export function ConnectionCard({ title, subtitle, estado, icon, meta, onSync, onDisconnect, syncing, children }: Props) {
  const cfg = ESTADO_INTEGRACION_CONFIG[estado] ?? ESTADO_INTEGRACION_CONFIG.desconectado;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0">
            {icon}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">{title}</p>
            <p className="text-xs text-slate-500">{subtitle}</p>
          </div>
        </div>
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${cfg.bg} ${cfg.color}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
          {cfg.label}
        </span>
      </div>

      {meta && <div className="grid grid-cols-2 gap-2">{meta}</div>}
      {children}

      {(onSync || onDisconnect) && (
        <div className="flex gap-2 pt-1 border-t border-slate-50">
          {onSync && (
            <button onClick={onSync} disabled={syncing || estado === 'sincronizando'}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              <RefreshCw className={`w-3.5 h-3.5 ${syncing || estado === 'sincronizando' ? 'animate-spin' : ''}`} />
              {syncing || estado === 'sincronizando' ? 'Sincronizando…' : 'Sincronizar'}
            </button>
          )}
          {onDisconnect && (
            <button onClick={onDisconnect}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-600 text-xs font-medium rounded-lg hover:bg-slate-200 transition-colors">
              <Unplug className="w-3.5 h-3.5" />
              Desconectar
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export function MetaStat({ label, value, highlight }: { label: string; value: string | number; highlight?: boolean }) {
  return (
    <div className="bg-slate-50 rounded-xl p-2.5">
      <p className="text-xs text-slate-500 mb-0.5">{label}</p>
      <p className={`text-sm font-semibold ${highlight ? 'text-red-600' : 'text-slate-800'}`}>{value}</p>
    </div>
  );
}
