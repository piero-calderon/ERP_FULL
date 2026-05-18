// ============================================================
// MÓDULO 4 — COMPRAS Y PROVEEDORES
// components/ui.tsx  — Componentes UI reutilizables del módulo
// ============================================================

import React from 'react';

// ---- Badge de estado ----
const estadoConfig: Record<string, { label: string; className: string }> = {
  // Proveedor
  activo:              { label: 'Activo',              className: 'bg-emerald-100 text-emerald-700' },
  bloqueado:           { label: 'Bloqueado',           className: 'bg-red-100 text-red-700' },
  baja:                { label: 'Baja',                className: 'bg-gray-100 text-gray-500' },
  // Requisición
  pendiente:           { label: 'Pendiente',           className: 'bg-yellow-100 text-yellow-700' },
  aprobada:            { label: 'Aprobada',            className: 'bg-emerald-100 text-emerald-700' },
  convertida:          { label: 'Convertida',          className: 'bg-blue-100 text-blue-700' },
  rechazada:           { label: 'Rechazada',           className: 'bg-red-100 text-red-700' },
  // OC
  borrador:            { label: 'Borrador',            className: 'bg-gray-100 text-gray-600' },
  enviada:             { label: 'Enviada',             className: 'bg-blue-100 text-blue-700' },
  confirmada:          { label: 'Confirmada',          className: 'bg-indigo-100 text-indigo-700' },
  parcialmente_recibida:{ label: 'Parcial',            className: 'bg-orange-100 text-orange-700' },
  recibida:            { label: 'Recibida',            className: 'bg-emerald-100 text-emerald-700' },
  facturada:           { label: 'Facturada',           className: 'bg-purple-100 text-purple-700' },
  cerrada:             { label: 'Cerrada',             className: 'bg-gray-100 text-gray-500' },
  cancelada:           { label: 'Cancelada',           className: 'bg-red-100 text-red-700' },
  // Recepción
  en_proceso:          { label: 'En proceso',          className: 'bg-blue-100 text-blue-700' },
  completada:          { label: 'Completada',          className: 'bg-emerald-100 text-emerald-700' },
  con_diferencias:     { label: 'Con diferencias',     className: 'bg-orange-100 text-orange-700' },
  // Factura
  conciliada:          { label: 'Conciliada',          className: 'bg-blue-100 text-blue-700' },
  aprobada_pago:       { label: 'Aprob. pago',         className: 'bg-indigo-100 text-indigo-700' },
  pagada:              { label: 'Pagada',              className: 'bg-emerald-100 text-emerald-700' },
  en_disputa:          { label: 'En disputa',          className: 'bg-red-100 text-red-700' },
  // Devolución
  solicitada:          { label: 'Solicitada',          className: 'bg-yellow-100 text-yellow-700' },
  abonada:             { label: 'Abonada',             className: 'bg-emerald-100 text-emerald-700' },
};

export const Badge: React.FC<{ estado: string }> = ({ estado }) => {
  const cfg = estadoConfig[estado] ?? { label: estado, className: 'bg-gray-100 text-gray-600' };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cfg.className}`}>
      {cfg.label}
    </span>
  );
};

// ---- Urgencia badge ----
const urgenciaConfig: Record<string, { label: string; className: string }> = {
  normal:   { label: 'Normal',   className: 'bg-gray-100 text-gray-600' },
  urgente:  { label: 'Urgente',  className: 'bg-orange-100 text-orange-700' },
  critica:  { label: 'Crítica',  className: 'bg-red-100 text-red-700' },
};

export const UrgenciaBadge: React.FC<{ urgencia: string }> = ({ urgencia }) => {
  const cfg = urgenciaConfig[urgencia] ?? { label: urgencia, className: 'bg-gray-100 text-gray-600' };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cfg.className}`}>
      {cfg.label}
    </span>
  );
};

// ---- Formatters ----
export const formatMoneda = (centimos: number, divisa = 'EUR') =>
  new Intl.NumberFormat('es-ES', { style: 'currency', currency: divisa }).format(centimos / 100);

export const formatFecha = (iso: string) =>
  new Date(iso).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });

// ---- Tabla base ----
interface ColumnaTabla<T> {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
  className?: string;
}

interface TablaProps<T> {
  columnas: ColumnaTabla<T>[];
  datos: T[];
  onRowClick?: (row: T) => void;
  keyExtractor: (row: T) => string;
  emptyMsg?: string;
}

export function Tabla<T>({ columnas, datos, onRowClick, keyExtractor, emptyMsg }: TablaProps<T>) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <table className="min-w-full divide-y divide-gray-100 text-sm">
        <thead className="bg-gray-50">
          <tr>
            {columnas.map((col) => (
              <th
                key={col.key}
                className={`px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider ${col.className ?? ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {datos.length === 0 ? (
            <tr>
              <td colSpan={columnas.length} className="px-4 py-8 text-center text-gray-400">
                {emptyMsg ?? 'Sin registros'}
              </td>
            </tr>
          ) : (
            datos.map((row) => (
              <tr
                key={keyExtractor(row)}
                onClick={() => onRowClick?.(row)}
                className={`transition-colors ${onRowClick ? 'cursor-pointer hover:bg-blue-50' : ''}`}
              >
                {columnas.map((col) => (
                  <td key={col.key} className={`px-4 py-3 ${col.className ?? ''}`}>
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// ---- Panel de detalle lateral ----
interface PanelDetalleProps {
  titulo: string;
  onCerrar: () => void;
  children: React.ReactNode;
}

export const PanelDetalle: React.FC<PanelDetalleProps> = ({ titulo, onCerrar, children }) => (
  <div className="fixed inset-y-0 right-0 w-full max-w-xl bg-white shadow-2xl z-40 flex flex-col">
    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
      <h3 className="text-base font-semibold text-gray-800">{titulo}</h3>
      <button
        onClick={onCerrar}
        className="text-gray-400 hover:text-gray-600 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
    <div className="flex-1 overflow-y-auto p-6 space-y-5">{children}</div>
  </div>
);

// ---- Sección de detalle ----
export const SeccionDetalle: React.FC<{ titulo: string; children: React.ReactNode }> = ({ titulo, children }) => (
  <div>
    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">{titulo}</p>
    <div className="space-y-1">{children}</div>
  </div>
);

export const CampoDetalle: React.FC<{ label: string; valor: React.ReactNode }> = ({ label, valor }) => (
  <div className="flex justify-between py-1.5 border-b border-gray-50 last:border-0">
    <span className="text-xs text-gray-500">{label}</span>
    <span className="text-xs font-medium text-gray-800 text-right max-w-[60%]">{valor}</span>
  </div>
);

// ---- Barra de búsqueda ----
interface BusquedaProps {
  valor: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

export const BarraBusqueda: React.FC<BusquedaProps> = ({ valor, onChange, placeholder }) => (
  <div className="relative">
    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
    <input
      type="text"
      value={valor}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder ?? 'Buscar...'}
      className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />
  </div>
);

// ---- Botón primario ----
interface BtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: 'primary' | 'secondary' | 'danger' | 'ghost';
  icono?: React.ReactNode;
}

export const Btn: React.FC<BtnProps> = ({ variante = 'primary', icono, children, className = '', ...props }) => {
  const base = 'inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50';
  const variantes = {
    primary:   'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50',
    danger:    'bg-red-600 text-white hover:bg-red-700',
    ghost:     'text-gray-500 hover:bg-gray-100',
  };
  return (
    <button className={`${base} ${variantes[variante]} ${className}`} {...props}>
      {icono && <span className="w-4 h-4">{icono}</span>}
      {children}
    </button>
  );
};

// ---- Score visual ----
export const ScoreBar: React.FC<{ valor: number }> = ({ valor }) => {
  const color = valor >= 80 ? 'bg-emerald-500' : valor >= 60 ? 'bg-yellow-400' : 'bg-red-500';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${valor}%` }} />
      </div>
      <span className="text-xs font-semibold text-gray-700">{valor}</span>
    </div>
  );
};
