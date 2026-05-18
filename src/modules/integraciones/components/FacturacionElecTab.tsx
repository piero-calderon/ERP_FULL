import { FileCheck, Send, AlertCircle, CheckCircle, XCircle, Clock } from 'lucide-react';
import { PROVEEDOR_FACT_LABELS, ESTADO_FACT_ELEC_CONFIG, ESTADO_INTEGRACION_CONFIG } from '../constants/integraciones.constants';
import { ConnectionCard, MetaStat } from './ConnectionCard';
import type { ConectorFactElec, FacturaElectronica } from '../types/integraciones.types';

interface Props {
  conectores: ConectorFactElec[];
  facturas: FacturaElectronica[];
  onEnviar: (conectorId: string) => Promise<void>;
}

const ESTADO_ICON = { pendiente: Clock, enviado: Send, aceptado: CheckCircle, rechazado: XCircle, error: AlertCircle };
const ESTADO_COLOR_MAP = { pendiente: 'text-amber-500', enviado: 'text-blue-500', aceptado: 'text-emerald-600', rechazado: 'text-red-600', error: 'text-red-600' };

function FacturaRow({ f }: { f: FacturaElectronica }) {
  const cfg = ESTADO_FACT_ELEC_CONFIG[f.estado] ?? ESTADO_FACT_ELEC_CONFIG.pendiente;
  const Icon = ESTADO_ICON[f.estado] ?? Clock;
  return (
    <div className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 text-xs">
      <Icon className={`w-4 h-4 flex-shrink-0 ${ESTADO_COLOR_MAP[f.estado]}`} />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-slate-700">{f.numeroFactura}</p>
        <p className="text-slate-400">{f.cliente}</p>
        {f.mensajeError && <p className="text-red-500 mt-0.5">{f.codigoError}: {f.mensajeError}</p>}
      </div>
      <span className="text-slate-600 font-medium">{f.importe.toFixed(2)}€</span>
      <span className={`px-2.5 py-1 rounded-full border font-medium ${cfg.bg} ${cfg.color}`}>{cfg.label}</span>
      <div className="flex items-center gap-1 text-slate-400">
        {f.xmlGenerado && <span className="text-emerald-500 font-semibold">XML</span>}
      </div>
      <span className="text-slate-400 w-28 text-right">{new Date(f.timestamp).toLocaleString('es-ES')}</span>
    </div>
  );
}

export function FacturacionElecTab({ conectores, facturas, onEnviar }: Props) {
  return (
    <div className="space-y-5">
      <p className="text-sm text-slate-500">{conectores.length} conectores de facturación electrónica</p>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {conectores.map(c => {
          const estadoCfg = ESTADO_INTEGRACION_CONFIG[c.estado] ?? ESTADO_INTEGRACION_CONFIG.desconectado;
          return (
            <ConnectionCard
              key={c.id}
              title={PROVEEDOR_FACT_LABELS[c.proveedor] ?? c.proveedor}
              subtitle={`NIF: ${c.nif} · v${c.version}`}
              estado={c.estado}
              icon={<FileCheck className="w-5 h-5 text-emerald-600" />}
              meta={
                <>
                  <MetaStat label="Pendientes" value={c.documentosPendientes} highlight={c.documentosPendientes > 0} />
                  <MetaStat label="Enviados" value={c.documentosEnviados} />
                  <MetaStat label="Cert. exp." value={c.certificado} />
                  <MetaStat label="Última sync" value={c.ultimaSync ? new Date(c.ultimaSync).toLocaleDateString('es-ES') : 'Nunca'} />
                </>
              }>
              {c.documentosPendientes > 0 && c.estado === 'conectado' && (
                <button onClick={() => onEnviar(c.id)}
                  className="w-full flex items-center justify-center gap-2 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-xl hover:bg-emerald-700 transition-colors">
                  <Send className="w-3.5 h-3.5" />
                  Enviar {c.documentosPendientes} pendiente{c.documentosPendientes !== 1 ? 's' : ''}
                </button>
              )}
            </ConnectionCard>
          );
        })}
      </div>

      {/* Facturas list */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-50 flex items-center gap-2">
          <FileCheck className="w-4 h-4 text-slate-400" />
          <p className="text-sm font-semibold text-slate-700">Facturas electrónicas ({facturas.length})</p>
        </div>
        <div className="divide-y divide-slate-50 max-h-96 overflow-y-auto">
          {facturas.map(f => <FacturaRow key={f.id} f={f} />)}
          {facturas.length === 0 && <p className="px-5 py-8 text-sm text-slate-400 text-center">Sin facturas electrónicas</p>}
        </div>
      </div>
    </div>
  );
}
