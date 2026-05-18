import { Landmark, ArrowDown, ArrowUp, CheckCircle, Clock } from 'lucide-react';
import { ESTADO_INTEGRACION_CONFIG } from '../constants/integraciones.constants';
import { ConnectionCard, MetaStat } from './ConnectionCard';
import type { ConectorBancario, MovimientoBancario } from '../types/integraciones.types';

interface Props {
  conectores: ConectorBancario[];
  movimientos: MovimientoBancario[];
  onSincronizar: (id: string) => Promise<void>;
  onConciliar: (id: string) => Promise<void>;
}

const PROVEEDOR_LABELS: Record<string, string> = {
  openbanking: 'Open Banking (PSD2)',
  n43: 'Norma 43 (SEPA)',
  camt053: 'CAMT.053 (ISO 20022)',
};

function MovRow({ m, onConciliar }: { m: MovimientoBancario; onConciliar: (id: string) => void }) {
  return (
    <div className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 text-sm">
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${m.tipo === 'abono' ? 'bg-emerald-50' : 'bg-red-50'}`}>
        {m.tipo === 'abono'
          ? <ArrowDown className="w-4 h-4 text-emerald-600" />
          : <ArrowUp className="w-4 h-4 text-red-600" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-slate-700 truncate">{m.concepto}</p>
        <p className="text-xs text-slate-400">{m.referencia} · {new Date(m.fecha).toLocaleDateString('es-ES')}</p>
      </div>
      <span className={`font-bold text-sm ${m.tipo === 'abono' ? 'text-emerald-600' : 'text-red-600'}`}>
        {m.tipo === 'abono' ? '+' : '-'}{Math.abs(m.importe).toFixed(2)}€
      </span>
      <div className="flex-shrink-0 w-24 text-right">
        {m.conciliado ? (
          <span className="flex items-center justify-end gap-1 text-xs text-emerald-600">
            <CheckCircle className="w-3.5 h-3.5" /> Conciliado
          </span>
        ) : (
          <button onClick={() => onConciliar(m.id)}
            className="flex items-center justify-end gap-1 text-xs text-amber-600 hover:text-amber-700">
            <Clock className="w-3.5 h-3.5" /> Conciliar
          </button>
        )}
      </div>
    </div>
  );
}

export function BancaTab({ conectores, movimientos, onSincronizar, onConciliar }: Props) {
  const pendientesConciliar = movimientos.filter(m => !m.conciliado).length;

  return (
    <div className="space-y-5">
      {pendientesConciliar > 0 && (
        <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
          <Clock className="w-5 h-5 text-amber-500 flex-shrink-0" />
          <p className="text-amber-800 text-sm">
            <strong>{pendientesConciliar}</strong> movimiento{pendientesConciliar !== 1 ? 's' : ''} pendiente{pendientesConciliar !== 1 ? 's' : ''} de conciliación.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {conectores.map(c => (
          <ConnectionCard
            key={c.id}
            title={c.banco}
            subtitle={PROVEEDOR_LABELS[c.proveedor] ?? c.proveedor}
            estado={c.estado}
            icon={<Landmark className="w-5 h-5 text-blue-600" />}
            syncing={c.estado === 'sincronizando'}
            onSync={() => onSincronizar(c.id)}
            meta={
              <>
                <MetaStat label="IBAN" value={c.iban} />
                <MetaStat label="Saldo" value={`${c.saldo.toLocaleString('es-ES')}€`} />
                <MetaStat label="Pend. conciliar" value={c.pendienteConciliar} highlight={c.pendienteConciliar > 0} />
                <MetaStat label="Última sync" value={c.ultimaSync ? new Date(c.ultimaSync).toLocaleString('es-ES') : 'Nunca'} />
              </>
            }
          />
        ))}
      </div>

      {/* Movements */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Landmark className="w-4 h-4 text-slate-400" />
            <p className="text-sm font-semibold text-slate-700">Movimientos bancarios ({movimientos.length})</p>
          </div>
          <div className="text-xs text-slate-500">
            <span className="text-amber-600 font-medium">{pendientesConciliar} sin conciliar</span>
          </div>
        </div>
        <div className="divide-y divide-slate-50 max-h-96 overflow-y-auto">
          {movimientos.map(m => <MovRow key={m.id} m={m} onConciliar={onConciliar} />)}
          {movimientos.length === 0 && <p className="px-5 py-8 text-sm text-slate-400 text-center">Sin movimientos</p>}
        </div>
      </div>
    </div>
  );
}
