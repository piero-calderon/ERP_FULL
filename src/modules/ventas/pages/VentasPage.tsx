import { useEffect, useState } from 'react';
import { FileText, ShoppingCart, RefreshCw as Recurring, Receipt, Award, ShieldAlert, RefreshCw } from 'lucide-react';
import { useVentasStore } from '../store/ventas.store';
import { CotizacionesPanel } from '../components/Cotizaciones/CotizacionesPanel';
import { PedidosPanel } from '../components/Pedidos/PedidosPanel';
import { RecurrentesPanel } from '../components/Recurrentes/RecurrentesPanel';
import { FacturacionPanel } from '../components/Facturacion/FacturacionPanel';
import { ComisionesPanel } from '../components/Comisiones/ComisionesPanel';
import { AprobacionesPanel } from '../components/Aprobaciones/AprobacionesPanel';
import { formatCurrency } from '@/utils/currency';
import { cn } from '@/utils/utils';

// ─── Tab Config ───────────────────────────────────────────────────────────────

type VentasTab = 'cotizaciones' | 'pedidos' | 'recurrentes' | 'facturacion' | 'comisiones' | 'aprobaciones';

const TABS: { id: VentasTab; label: string; Icon: typeof FileText }[] = [
  { id: 'cotizaciones', label: 'Cotizaciones',  Icon: FileText     },
  { id: 'pedidos',      label: 'Pedidos',        Icon: ShoppingCart },
  { id: 'recurrentes',  label: 'Recurrentes',    Icon: Recurring    },
  { id: 'facturacion',  label: 'Facturación',    Icon: Receipt      },
  { id: 'comisiones',   label: 'Comisiones',     Icon: Award        },
  { id: 'aprobaciones', label: 'Aprobaciones',   Icon: ShieldAlert  },
];

// ─── Ventas Page ──────────────────────────────────────────────────────────────

export default function VentasPage() {
  const { stats, isLoading, fetchVentas } = useVentasStore();
  const [activeTab, setActiveTab] = useState<VentasTab>('cotizaciones');

  useEffect(() => { fetchVentas(); }, [fetchVentas]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">

      {/* ── Header ──────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Ventas</h1>
          <p className="text-slate-500 mt-1">Cotizaciones, pedidos, facturación, comisiones y aprobaciones.</p>
        </div>
        <button
          onClick={() => fetchVentas()}
          disabled={isLoading}
          className="flex items-center gap-2 p-2.5 bg-white border border-slate-100 rounded-xl text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-all shadow-sm self-start"
        >
          <RefreshCw className={cn('h-5 w-5', isLoading && 'animate-spin')} />
        </button>
      </div>

      {/* ── Global KPIs ──────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <div
          className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group"
          onClick={() => setActiveTab('facturacion')}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Facturado / Mes</p>
              <p className="text-xl font-extrabold text-slate-900 mt-1">{formatCurrency(stats.invoicedThisMonth, 'ARS', 'es-AR')}</p>
            </div>
            <div className="h-10 w-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform shrink-0">
              <Receipt className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div
          className={cn(
            'bg-white border rounded-3xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group',
            stats.pendingOrders > 0 ? 'border-blue-200' : 'border-slate-100'
          )}
          onClick={() => setActiveTab('pedidos')}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Pedidos Activos</p>
              <p className="text-xl font-extrabold text-blue-600 mt-1">{stats.pendingOrders}</p>
            </div>
            <div className="h-10 w-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-sm shadow-blue-200 group-hover:scale-110 transition-transform shrink-0">
              <ShoppingCart className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div
          className={cn(
            'bg-white border rounded-3xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group',
            stats.openQuotes > 0 ? 'border-violet-200' : 'border-slate-100'
          )}
          onClick={() => setActiveTab('cotizaciones')}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Cotizaciones</p>
              <p className="text-xl font-extrabold text-violet-600 mt-1">{stats.openQuotes}</p>
              <p className="text-xs text-slate-400 mt-0.5">{stats.conversionRate}% conversión</p>
            </div>
            <div className="h-10 w-10 rounded-2xl bg-violet-600 text-white flex items-center justify-center shadow-sm shadow-violet-200 group-hover:scale-110 transition-transform shrink-0">
              <FileText className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div
          className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group"
          onClick={() => setActiveTab('recurrentes')}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Recurrentes</p>
              <p className="text-xl font-extrabold text-cyan-600 mt-1">{formatCurrency(stats.monthlyRevenue, 'ARS', 'es-AR')}</p>
              <p className="text-xs text-slate-400 mt-0.5">vol. mensual</p>
            </div>
            <div className="h-10 w-10 rounded-2xl bg-cyan-600 text-white flex items-center justify-center shadow-sm shadow-cyan-200 group-hover:scale-110 transition-transform shrink-0">
              <Recurring className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div
          className={cn(
            'bg-white border rounded-3xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group',
            stats.pendingCommissions > 0 ? 'border-amber-200' : 'border-slate-100'
          )}
          onClick={() => setActiveTab('comisiones')}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Comisiones</p>
              <p className={cn('text-xl font-extrabold mt-1', stats.pendingCommissions > 0 ? 'text-amber-600' : 'text-slate-900')}>
                {stats.pendingCommissions > 0 ? stats.pendingCommissions : '✓'}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                {stats.pendingCommissions > 0 ? 'pendientes' : 'Al día'}
              </p>
            </div>
            <div className={cn('h-10 w-10 rounded-2xl text-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform shrink-0',
              stats.pendingCommissions > 0 ? 'bg-amber-500 shadow-amber-200' : 'bg-slate-600 shadow-slate-200'
            )}>
              <Award className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div
          className={cn(
            'bg-white border rounded-3xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group',
            stats.pendingApprovals > 0 ? 'border-rose-200' : 'border-slate-100'
          )}
          onClick={() => setActiveTab('aprobaciones')}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Aprobaciones</p>
              <p className={cn('text-xl font-extrabold mt-1', stats.pendingApprovals > 0 ? 'text-rose-600' : 'text-slate-900')}>
                {stats.pendingApprovals > 0 ? stats.pendingApprovals : '✓'}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                {stats.pendingApprovals > 0 ? 'requieren acción' : 'Sin pendientes'}
              </p>
            </div>
            <div className={cn('h-10 w-10 rounded-2xl text-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform shrink-0',
              stats.pendingApprovals > 0 ? 'bg-rose-600 shadow-rose-200' : 'bg-slate-600 shadow-slate-200'
            )}>
              <ShieldAlert className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Tab Navigation ───────────────────────────────────── */}
      <div className="bg-white border border-slate-100 rounded-2xl p-1.5 shadow-sm">
        <div className="flex overflow-x-auto gap-1 pb-0.5">
          {TABS.map(tab => {
            const { Icon } = tab;
            const hasBadge =
              (tab.id === 'aprobaciones' && stats.pendingApprovals > 0) ||
              (tab.id === 'comisiones'   && stats.pendingCommissions > 0);
            const badgeCount =
              tab.id === 'aprobaciones' ? stats.pendingApprovals :
              tab.id === 'comisiones'   ? stats.pendingCommissions : 0;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all relative',
                  activeTab === tab.id
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                )}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
                {hasBadge && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                    {badgeCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Tab Content ──────────────────────────────────────── */}
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300" key={activeTab}>
        {activeTab === 'cotizaciones' && <CotizacionesPanel />}
        {activeTab === 'pedidos'      && <PedidosPanel />}
        {activeTab === 'recurrentes'  && <RecurrentesPanel />}
        {activeTab === 'facturacion'  && <FacturacionPanel />}
        {activeTab === 'comisiones'   && <ComisionesPanel />}
        {activeTab === 'aprobaciones' && <AprobacionesPanel />}
      </div>
    </div>
  );
}
