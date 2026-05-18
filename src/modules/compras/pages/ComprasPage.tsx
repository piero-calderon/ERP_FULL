// ============================================================
// MÓDULO 4 — COMPRAS Y PROVEEDORES
// pages/ComprasPage.tsx — Página principal con navegación por tabs
// ============================================================

import React from 'react';
import { useComprasStore } from '../store/comprasStore';
import { ProveedoresPage } from './submodulos';
import { RequisicionesPage } from './submodulos';
import { SugerenciasPage } from './submodulos';
import { OrdenesCompraPage } from './submodulos';
import { RecepcionesPage } from './submodulos';
import { FacturasProveedorPage } from './submodulos';
import { DevolucionesPage } from './submodulos';

const tabs = [
  {
    id: 'proveedores' as const,
    label: 'Proveedores',
    icono: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    id: 'requisiciones' as const,
    label: 'Requisiciones',
    icono: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
  {
    id: 'sugerencias' as const,
    label: 'Reposición',
    icono: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
  },
  {
    id: 'ordenes' as const,
    label: 'Órdenes de compra',
    icono: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    id: 'recepciones' as const,
    label: 'Recepciones',
    icono: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
  {
    id: 'facturas' as const,
    label: 'Facturas',
    icono: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    id: 'devoluciones' as const,
    label: 'Devoluciones',
    icono: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
      </svg>
    ),
  },
];

const kpis = [
  { label: 'OC abiertas',     valor: '3',       sub: '2 confirmadas' },
  { label: 'Pendiente pagar', valor: '138.838€', sub: '2 facturas' },
  { label: 'Recepciones hoy', valor: '1',        sub: 'Completada' },
  { label: 'Reposición urgente', valor: '2',     sub: 'productos críticos' },
];

export const ComprasPage: React.FC = () => {
  const { tabActiva, setTabActiva } = useComprasStore();

  const renderTab = () => {
    switch (tabActiva) {
      case 'proveedores':    return <ProveedoresPage />;
      case 'requisiciones':  return <RequisicionesPage />;
      case 'sugerencias':    return <SugerenciasPage />;
      case 'ordenes':        return <OrdenesCompraPage />;
      case 'recepciones':    return <RecepcionesPage />;
      case 'facturas':       return <FacturasProveedorPage />;
      case 'devoluciones':   return <DevolucionesPage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header del módulo */}
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Compras y Proveedores</h1>
            <p className="text-sm text-gray-400 mt-0.5">Gestión del ciclo de aprovisionamiento</p>
          </div>
        </div>

        {/* KPIs rápidos */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {kpis.map((k) => (
            <div key={k.label} className="bg-gray-50 rounded-xl px-4 py-3">
              <p className="text-xs text-gray-400 mb-0.5">{k.label}</p>
              <p className="text-lg font-bold text-gray-800">{k.valor}</p>
              <p className="text-xs text-gray-400">{k.sub}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTabActiva(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                tabActiva === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
              }`}
            >
              {tab.icono}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Contenido del tab activo */}
      <div className="p-6">
        {renderTab()}
      </div>
    </div>
  );
};

export default ComprasPage;
