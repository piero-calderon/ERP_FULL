// Módulo 9 — Plantilla Preview — renderiza documento simulado
import React from 'react';
import type { Plantilla } from '../../types/documentos.types';
import { TIPO_PLANTILLA_LABELS } from '../../constants/documentos.constants';

interface Props {
  plantilla: Plantilla;
  onCerrar: () => void;
}

const LINEAS_EJEMPLO = [
  { desc: 'Servicio de limpieza mensual', cantidad: 1, precio: 85000, iva: 21 },
  { desc: 'Material consumible extra', cantidad: 3, precio: 1200, iva: 21 },
  { desc: 'Desplazamiento zona norte', cantidad: 5, precio: 800, iva: 21 },
];

const fmt = (centimos: number) =>
  new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(centimos / 100);

export const PlantillaPreview: React.FC<Props> = ({ plantilla, onCerrar }) => {
  const { configuracion: cfg } = plantilla;
  const base = LINEAS_EJEMPLO.reduce((s, l) => s + l.cantidad * l.precio, 0);
  const iva = Math.round(base * 0.21);
  const total = base + iva;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onCerrar} />
      <div className="relative w-full max-w-2xl h-full bg-white shadow-2xl flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-5 py-3 bg-slate-50 border-b border-slate-100 flex-shrink-0">
          <div>
            <h3 className="text-sm font-semibold text-slate-800">{plantilla.nombre}</h3>
            <p className="text-xs text-slate-400">Preview visual — datos de ejemplo</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 bg-white border border-slate-200 px-2 py-1 rounded-lg">
              {TIPO_PLANTILLA_LABELS[plantilla.tipo]}
            </span>
            <button onClick={onCerrar} className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-500">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Document render */}
        <div className="flex-1 overflow-y-auto bg-slate-100 p-6">
          <div className="bg-white shadow-lg rounded-sm max-w-xl mx-auto" style={{ fontFamily: cfg.fuente === 'inter' ? 'Inter, sans-serif' : cfg.fuente === 'roboto' ? 'Roboto, sans-serif' : 'Arial, sans-serif' }}>
            {/* Header bar */}
            <div style={{ backgroundColor: cfg.colorPrimario }} className="h-1.5 w-full rounded-t-sm" />

            <div className="p-8">
              {/* Header */}
              <div className="flex justify-between items-start mb-8">
                <div>
                  {cfg.logoUrl ? (
                    <img src={cfg.logoUrl} alt="Logo" className="h-10 mb-2" />
                  ) : (
                    <div style={{ color: cfg.colorPrimario }} className="text-xl font-bold tracking-tight mb-1">START ERP S.L.</div>
                  )}
                  <p className="text-xs text-slate-400">CIF B12345678</p>
                  <p className="text-xs text-slate-400">Calle Ejemplo 1, 28001 Madrid</p>
                  <p className="text-xs text-slate-400">info@start-erp.com</p>
                </div>
                <div className="text-right">
                  <div style={{ color: cfg.colorPrimario }} className="text-2xl font-bold uppercase tracking-wide">
                    {TIPO_PLANTILLA_LABELS[plantilla.tipo]}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Nº: F-2025-0092</p>
                  <p className="text-xs text-slate-400">Fecha: {new Date().toLocaleDateString('es-ES')}</p>
                  <p className="text-xs text-slate-400">Vencimiento: 30 días</p>
                </div>
              </div>

              {/* Cliente */}
              <div style={{ backgroundColor: cfg.colorSecundario, borderLeftColor: cfg.colorPrimario }} className="rounded p-4 mb-6 border-l-4">
                <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Facturar a</p>
                <p className="text-sm font-semibold text-slate-800">Limpieza Total S.A.</p>
                <p className="text-xs text-slate-500">CIF: B98765432</p>
                <p className="text-xs text-slate-500">Av. de la Industria 45, 28020 Madrid</p>
              </div>

              {/* Líneas */}
              <table className="w-full mb-6 text-xs">
                <thead>
                  <tr style={{ backgroundColor: cfg.colorPrimario }} className="text-white">
                    <th className="text-left py-2 px-3 rounded-tl font-medium">Descripción</th>
                    <th className="text-center py-2 px-2 font-medium w-16">Cant.</th>
                    <th className="text-right py-2 px-3 font-medium w-24">Precio</th>
                    <th className="text-right py-2 px-3 rounded-tr font-medium w-24">Importe</th>
                  </tr>
                </thead>
                <tbody>
                  {LINEAS_EJEMPLO.map((l, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                      <td className="py-2 px-3 text-slate-700">{l.desc}</td>
                      <td className="py-2 px-2 text-center text-slate-600">{l.cantidad}</td>
                      <td className="py-2 px-3 text-right text-slate-600">{fmt(l.precio)}</td>
                      <td className="py-2 px-3 text-right font-medium text-slate-800">{fmt(l.cantidad * l.precio)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totales */}
              <div className="flex justify-end mb-6">
                <div className="w-48 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Base imponible</span><span className="font-medium text-slate-700">{fmt(base)}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>IVA 21%</span><span className="font-medium text-slate-700">{fmt(iva)}</span>
                  </div>
                  <div style={{ borderTopColor: cfg.colorPrimario }} className="flex justify-between border-t-2 pt-1.5">
                    <span style={{ color: cfg.colorPrimario }} className="font-bold text-sm">TOTAL</span>
                    <span style={{ color: cfg.colorPrimario }} className="font-bold text-sm">{fmt(total)}</span>
                  </div>
                </div>
              </div>

              {/* Cláusulas */}
              {cfg.clausulas && (
                <div style={{ backgroundColor: cfg.colorSecundario }} className="rounded p-3 mb-4">
                  <p className="text-xs text-slate-500 font-semibold mb-1 uppercase">Condiciones</p>
                  <p className="text-xs text-slate-400 leading-relaxed">{cfg.clausulas}</p>
                </div>
              )}

              {/* Pie legal */}
              <div className="border-t border-slate-100 pt-3">
                <p className="text-xs text-slate-300 text-center leading-relaxed">{cfg.pieLegal}</p>
              </div>
            </div>
            {/* Footer bar */}
            <div style={{ backgroundColor: cfg.colorPrimario }} className="h-1 w-full rounded-b-sm opacity-30" />
          </div>
        </div>
      </div>
    </div>
  );
};
