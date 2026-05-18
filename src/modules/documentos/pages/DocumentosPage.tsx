// Módulo 9 — Documentos — Página principal
import React from 'react';
import { useDocumentosStore } from '../store/documentos.store';
import { PlantillasTab } from '../components/Plantillas/PlantillasTab';
import { RepositorioTab } from '../components/Repositorio/RepositorioTab';
import { NumeracionTab } from '../components/Numeracion/NumeracionTab';
import { FirmaTab } from '../components/FirmaElectronica/FirmaTab';
import { cn } from '@/utils/utils';
import type { TabDocumentos } from '../types/documentos.types';
import {
  FileText, FolderOpen, Hash, PenTool,
} from 'lucide-react';

const TABS: { id: TabDocumentos; label: string; sub: string; Icon: React.ElementType }[] = [
  { id: 'plantillas',  label: 'Plantillas',          sub: 'Diseño de documentos', Icon: FileText   },
  { id: 'repositorio', label: 'Repositorio',          sub: 'Archivos y versiones', Icon: FolderOpen },
  { id: 'numeracion',  label: 'Numeración',           sub: 'Series y contadores',  Icon: Hash       },
  { id: 'firma',       label: 'Firma electrónica',    sub: 'Solicitudes y estados',Icon: PenTool    },
];

const DocumentosPage: React.FC = () => {
  const { tabActiva, setTabActiva, plantillas, documentos, series, firmas } = useDocumentosStore();

  const kpis = [
    { label: 'Plantillas activas',  value: plantillas.filter(p => p.activa).length,  color: 'blue'   },
    { label: 'Documentos',          value: documentos.filter(d => d.estado !== 'archivado').length, color: 'violet' },
    { label: 'Series activas',      value: series.filter(s => s.activa).length,       color: 'emerald'},
    { label: 'Firmas pendientes',   value: firmas.filter(f => ['pendiente','enviado'].includes(f.estado)).length, color: 'amber'  },
  ];

  const renderTab = () => {
    switch (tabActiva) {
      case 'plantillas':  return <PlantillasTab />;
      case 'repositorio': return <RepositorioTab />;
      case 'numeracion':  return <NumeracionTab />;
      case 'firma':       return <FirmaTab />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Documentos</h1>
          <p className="text-slate-500 mt-1 text-sm">Plantillas, repositorio, numeración y firma electrónica.</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {kpis.map(k => (
          <div key={k.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm px-4 py-3">
            <p className="text-xs text-slate-400 mb-0.5">{k.label}</p>
            <p className="text-2xl font-bold text-slate-800">{k.value}</p>
          </div>
        ))}
      </div>

      {/* Tab navigation */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {TABS.map(tab => {
          const active = tabActiva === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setTabActiva(tab.id)}
              className={cn(
                'flex items-center gap-3 px-4 py-3.5 rounded-2xl border text-left transition-all duration-200',
                active
                  ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200'
                  : 'bg-white border-slate-100 text-slate-600 hover:border-blue-200 hover:bg-blue-50 shadow-sm'
              )}
            >
              <tab.Icon className={cn('w-5 h-5 flex-shrink-0', active ? 'text-white' : 'text-blue-500')} />
              <div className="min-w-0">
                <p className={cn('text-sm font-semibold truncate', active ? 'text-white' : 'text-slate-800')}>
                  {tab.label}
                </p>
                <p className={cn('text-xs truncate', active ? 'text-blue-100' : 'text-slate-400')}>
                  {tab.sub}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div key={tabActiva} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        {renderTab()}
      </div>
    </div>
  );
};

export default DocumentosPage;
