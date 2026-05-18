// Módulo 9 — 9.4 Firma Electrónica
import React, { useState } from 'react';
import { useDocumentosStore } from '../../store/documentos.store';
import { useFirmas } from '../../hooks/useDocumentos';
import { FirmaTimeline } from './FirmaTimeline';
import { cn } from '@/utils/utils';
import type { SolicitudFirma, EstadoFirma } from '../../types/documentos.types';
import { ESTADO_FIRMA_CONFIG, TENANT_ID, MOCK_USER } from '../../constants/documentos.constants';

const ESTADOS: { value: string; label: string }[] = [
  { value: 'todos', label: 'Todos' },
  ...(['pendiente', 'enviado', 'firmado', 'rechazado', 'expirado'] as EstadoFirma[])
    .map(e => ({ value: e, label: ESTADO_FIRMA_CONFIG[e].label })),
];

const fmtFecha = (iso: string) => new Date(iso).toLocaleDateString('es-ES');

export const FirmaTab: React.FC = () => {
  const {
    firmaSeleccionada, setFirmaSeleccionada,
    filtroFirmaEstado, setFiltroFirmaEstado,
  } = useDocumentosStore();
  const { firmas, enviar, simularFirma, rechazar, save, procesando } = useFirmas();
  const [showNueva, setShowNueva] = useState(false);

  const stats = {
    pendiente:  firmas.filter(f => f.estado === 'pendiente').length,
    enviado:    firmas.filter(f => f.estado === 'enviado').length,
    firmado:    firmas.filter(f => f.estado === 'firmado').length,
    rechazado:  firmas.filter(f => f.estado === 'rechazado').length,
  };

  return (
    <div className="space-y-4">
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {([
          { label: 'Pendientes', value: stats.pendiente, color: 'yellow' },
          { label: 'Enviadas', value: stats.enviado, color: 'blue' },
          { label: 'Firmadas', value: stats.firmado, color: 'emerald' },
          { label: 'Rechazadas', value: stats.rechazado, color: 'red' },
        ] as const).map(k => (
          <div key={k.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm px-4 py-3">
            <p className="text-xs text-slate-400 mb-0.5">{k.label}</p>
            <p className="text-lg font-bold text-slate-800">{k.value}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex gap-1 bg-white border border-slate-100 rounded-2xl p-1.5 shadow-sm flex-wrap">
          {ESTADOS.map(e => (
            <button key={e.value} onClick={() => setFiltroFirmaEstado(e.value)}
              className={cn('px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all',
                filtroFirmaEstado === e.value ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100')}>
              {e.label}
            </button>
          ))}
        </div>
        <div className="flex-1" />
        <button onClick={() => setShowNueva(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nueva solicitud
        </button>
      </div>

      {/* Lista */}
      {firmas.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <svg className="w-10 h-10 mx-auto mb-3 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <p className="text-sm">No hay solicitudes de firma.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {firmas.map(f => {
            const cfg = ESTADO_FIRMA_CONFIG[f.estado];
            const isProcesando = procesando === f.id;
            return (
              <div key={f.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full', cfg.cls)}>
                          {cfg.label}
                        </span>
                        <span className="text-xs text-slate-400">{f.proveedorExterno}</span>
                      </div>
                      <h3 className="font-semibold text-slate-800 text-sm truncate">{f.asunto}</h3>
                      <p className="text-xs text-slate-400 mt-0.5 truncate">{f.documentoNombre}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs text-slate-400">Expira</p>
                      <p className="text-xs font-medium text-slate-700">{fmtFecha(f.fechaExpiracion)}</p>
                    </div>
                  </div>

                  {/* Firmantes */}
                  <div className="flex items-center gap-2 mb-4 flex-wrap">
                    {f.firmantes.map((firm, i) => (
                      <div key={i} className={cn(
                        'flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs',
                        firm.estado === 'firmado'   ? 'bg-emerald-50 text-emerald-700' :
                        firm.estado === 'rechazado' ? 'bg-red-50 text-red-700' :
                        'bg-slate-50 text-slate-600'
                      )}>
                        <span className="font-mono font-bold">{firm.orden}</span>
                        <span className="font-medium">{firm.nombre}</span>
                        {firm.estado === 'firmado'   && <span>✓</span>}
                        {firm.estado === 'rechazado' && <span>✗</span>}
                        {firm.estado === 'pendiente' && <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />}
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <button onClick={() => setFirmaSeleccionada(f)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      Timeline
                    </button>
                    {f.estado === 'pendiente' && (
                      <button onClick={() => enviar(f.id)} disabled={isProcesando}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors">
                        {isProcesando ? <><div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />Enviando...</> : 'Enviar'}
                      </button>
                    )}
                    {f.estado === 'enviado' && (
                      <>
                        <button onClick={() => simularFirma(f.id)} disabled={isProcesando}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50 transition-colors">
                          {isProcesando ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> : '✍'} Simular firma
                        </button>
                        <button onClick={() => rechazar(f.id)} disabled={isProcesando}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-xl disabled:opacity-50 transition-colors">
                          Rechazar
                        </button>
                      </>
                    )}
                    {f.referenciaExterna && (
                      <span className="text-xs text-slate-400 font-mono ml-auto">{f.referenciaExterna}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Timeline drawer */}
      {firmaSeleccionada && (
        <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-40 flex flex-col">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 flex-shrink-0">
            <div>
              <h3 className="font-semibold text-slate-800 text-sm">Timeline de firma</h3>
              <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[280px]">{firmaSeleccionada.asunto}</p>
            </div>
            <button onClick={() => setFirmaSeleccionada(null)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {/* Estado actual */}
            <div className={cn('flex items-center gap-3 px-4 py-3 rounded-xl', ESTADO_FIRMA_CONFIG[firmaSeleccionada.estado].cls)}>
              <span className="text-sm font-semibold">{ESTADO_FIRMA_CONFIG[firmaSeleccionada.estado].label}</span>
              <span className="text-xs opacity-70">{fmtFecha(firmaSeleccionada.actualizadoEn)}</span>
            </div>

            {/* Firmantes detalle */}
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Firmantes</p>
              <div className="space-y-2">
                {firmaSeleccionada.firmantes.map((firm, i) => (
                  <div key={i} className="flex items-center gap-3 bg-slate-50 rounded-xl px-3 py-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 text-xs font-bold flex items-center justify-center flex-shrink-0">{firm.orden}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-slate-800">{firm.nombre}</p>
                      <p className="text-xs text-slate-400 truncate">{firm.email}</p>
                    </div>
                    <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full',
                      firm.estado === 'firmado'   ? 'bg-emerald-100 text-emerald-700' :
                      firm.estado === 'rechazado' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700')}>
                      {firm.estado === 'firmado' ? 'Firmado' : firm.estado === 'rechazado' ? 'Rechazado' : 'Pendiente'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase mb-3">Historial</p>
              <FirmaTimeline timeline={firmaSeleccionada.timeline} />
            </div>

            {/* Meta */}
            {firmaSeleccionada.mensaje && (
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-xs font-semibold text-slate-500 mb-1">Mensaje enviado</p>
                <p className="text-xs text-slate-600 italic">{firmaSeleccionada.mensaje}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Nueva solicitud modal */}
      {showNueva && (
        <NuevaFirmaModal
          onGuardar={async (f) => { await save(f); setShowNueva(false); }}
          onCerrar={() => setShowNueva(false)}
        />
      )}
    </div>
  );
};

// ─── Modal nueva solicitud ───────────────────────────────────────────────────

interface NuevaFirmaProps {
  onGuardar: (f: SolicitudFirma) => Promise<void>;
  onCerrar: () => void;
}

const NuevaFirmaModal: React.FC<NuevaFirmaProps> = ({ onGuardar, onCerrar }) => {
  const [form, setForm] = useState({
    asunto: '',
    documentoNombre: '',
    mensaje: '',
    firmante1Nombre: '',
    firmante1Email: '',
    proveedor: 'simulado' as SolicitudFirma['proveedorExterno'],
    diasExpiracion: 30,
  });
  const [saving, setSaving] = useState(false);

  const handleGuardar = async () => {
    if (!form.asunto || !form.firmante1Nombre) return;
    setSaving(true);
    const solicitud: SolicitudFirma = {
      id: `frm-${Date.now()}`,
      tenantId: TENANT_ID,
      documentoId: `doc-${Date.now()}`,
      documentoNombre: form.documentoNombre || 'Documento sin nombre',
      asunto: form.asunto,
      mensaje: form.mensaje || undefined,
      firmantes: [{ nombre: form.firmante1Nombre, email: form.firmante1Email, orden: 1, estado: 'pendiente' }],
      estado: 'pendiente',
      timeline: [{
        id: `ev-${Date.now()}`,
        fecha: new Date().toISOString(),
        evento: 'creacion',
        actor: MOCK_USER,
        detalle: 'Solicitud creada',
      }],
      proveedorExterno: form.proveedor,
      fechaExpiracion: new Date(Date.now() + form.diasExpiracion * 86400000).toISOString(),
      creadoPor: MOCK_USER,
      creadoEn: new Date().toISOString(),
      actualizadoEn: new Date().toISOString(),
    };
    await onGuardar(solicitud);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onCerrar} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800">Nueva solicitud de firma</h3>
          <button onClick={onCerrar} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Asunto *</label>
            <input value={form.asunto} onChange={e => setForm(f => ({ ...f, asunto: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: Firma contrato de servicio" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Documento</label>
            <input value={form.documentoNombre} onChange={e => setForm(f => ({ ...f, documentoNombre: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nombre del documento a firmar" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Firmante principal *</label>
              <input value={form.firmante1Nombre} onChange={e => setForm(f => ({ ...f, firmante1Nombre: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nombre" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email firmante</label>
              <input type="email" value={form.firmante1Email} onChange={e => setForm(f => ({ ...f, firmante1Email: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="email@empresa.com" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Proveedor de firma</label>
              <select value={form.proveedor} onChange={e => setForm(f => ({ ...f, proveedor: e.target.value as any }))}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option value="simulado">Simulado</option>
                <option value="signaturit">Signaturit</option>
                <option value="docusign">DocuSign</option>
                <option value="adobe-sign">Adobe Sign</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Días de validez</label>
              <input type="number" min={1} max={365} value={form.diasExpiracion}
                onChange={e => setForm(f => ({ ...f, diasExpiracion: +e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Mensaje (opcional)</label>
            <textarea value={form.mensaje} onChange={e => setForm(f => ({ ...f, mensaje: e.target.value }))}
              rows={2} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Mensaje personalizado para los firmantes..." />
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100">
          <button onClick={onCerrar} className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50">Cancelar</button>
          <button onClick={handleGuardar} disabled={saving || !form.asunto || !form.firmante1Nombre}
            className="px-5 py-2 text-sm font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50">
            {saving ? 'Creando...' : 'Crear solicitud'}
          </button>
        </div>
      </div>
    </div>
  );
};
