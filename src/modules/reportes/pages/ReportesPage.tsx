// Módulo 10 — Reportes — página principal
import { useReportesStore } from '../store/reportes.store';
import { ComercialTab }    from '../components/Comercial/ComercialTab';
import { InventarioTab }   from '../components/Inventario/InventarioTab';
import { LogisticaTab }    from '../components/Logistica/LogisticaTab';
import { FinancieroTab }   from '../components/Financiero/FinancieroTab';
import { CalidadTab }      from '../components/Calidad/CalidadTab';
import { OperativoTab }    from '../components/Operativo/OperativoTab';
import { ProgramacionTab } from '../components/Programacion/ProgramacionTab';
import { TAB_LABELS }      from '../constants/reportes.constants';
import { cn }              from '@/utils/utils';
import type { TabReportes } from '../types/reportes.types';

const TABS: TabReportes[] = [
  'comercial', 'inventario', 'logistica',
  'financiero', 'calidad', 'operativo', 'programacion',
];

export default function ReportesPage() {
  const { tabActiva, setTabActiva } = useReportesStore();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Reportes</h1>
        <p className="text-sm text-slate-500 mt-1">Analítica avanzada, exportación de datos y programación de reportes</p>
      </div>

      {/* Tab bar */}
      <div className="border-b border-slate-200 overflow-x-auto">
        <nav className="flex gap-0.5 min-w-max">
          {TABS.map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => setTabActiva(tab)}
              className={cn(
                'px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all duration-200',
                tabActiva === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300',
              )}
            >
              {TAB_LABELS[tab]}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab content */}
      <div>
        {tabActiva === 'comercial'    && <ComercialTab />}
        {tabActiva === 'inventario'   && <InventarioTab />}
        {tabActiva === 'logistica'    && <LogisticaTab />}
        {tabActiva === 'financiero'   && <FinancieroTab />}
        {tabActiva === 'calidad'      && <CalidadTab />}
        {tabActiva === 'operativo'    && <OperativoTab />}
        {tabActiva === 'programacion' && <ProgramacionTab />}
      </div>
    </div>
  );
}
