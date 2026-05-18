import { Key, Webhook, Upload, BookOpen, FileCheck, Landmark, MapPin, ShoppingBag, CheckCircle2, XCircle, AlertCircle, Clock } from 'lucide-react';
import { ESTADO_INTEGRACION_CONFIG } from '../constants/integraciones.constants';
import type { IntegracionesState } from '../types/integraciones.types';

interface Props {
  state: IntegracionesState;
  onNavigate: (tab: string) => void;
}

function StatusDot({ estado }: { estado: string }) {
  const cfg = ESTADO_INTEGRACION_CONFIG[estado] ?? ESTADO_INTEGRACION_CONFIG.desconectado;
  return <span className={`w-2 h-2 rounded-full flex-shrink-0 ${cfg.dot}`} />;
}

function SummaryCard({ icon: Icon, title, color, bg, items, tab, onNavigate }: {
  icon: React.ElementType; title: string; color: string; bg: string;
  items: { name: string; estado: string }[]; tab: string; onNavigate: (t: string) => void;
}) {
  const connected = items.filter(i => i.estado === 'conectado' || i.estado === 'activo' || i.estado === 'activa').length;
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 flex flex-col gap-3 cursor-pointer hover:shadow-sm transition-shadow" onClick={() => onNavigate(tab)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center`}>
            <Icon className={`w-4.5 h-4.5 ${color}`} />
          </div>
          <p className="text-sm font-semibold text-slate-800">{title}</p>
        </div>
        <span className="text-xs text-slate-500">{connected}/{items.length}</span>
      </div>
      <div className="space-y-1.5">
        {items.slice(0, 3).map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <StatusDot estado={item.estado} />
            <span className="text-xs text-slate-600 truncate">{item.name}</span>
          </div>
        ))}
        {items.length === 0 && <p className="text-xs text-slate-400">Sin configurar</p>}
      </div>
    </div>
  );
}

export function DashboardTab({ state, onNavigate }: Props) {
  const totalConectores = [
    ...state.conectoresContables.map(c => c.estado),
    ...state.conectoresFactElec.map(c => c.estado),
    ...state.conectoresBancarios.map(c => c.estado),
    state.conectorMapas ? state.conectorMapas.estado : 'desconectado',
    ...state.conectoresEcommerce.map(c => c.estado),
  ];
  const conectados = totalConectores.filter(e => e === 'conectado').length;
  const errores    = totalConectores.filter(e => e === 'error').length;
  const pausados   = totalConectores.filter(e => e === 'pausado' || e === 'desconectado').length;

  const apiKeyActivas = state.apiKeys.filter(k => k.estado === 'activa').length;
  const webhooksActivos = state.webhooks.filter(w => w.estado === 'activo').length;
  const importsPendientes = state.importJobs.filter(j => j.estado === 'procesando').length;

  return (
    <div className="space-y-6">
      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Conectados',  value: conectados, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Con error',   value: errores,    icon: XCircle,      color: 'text-red-600',     bg: 'bg-red-50' },
          { label: 'Pausados',    value: pausados,   icon: Clock,        color: 'text-amber-600',   bg: 'bg-amber-50' },
          { label: 'API Keys',    value: apiKeyActivas, icon: Key,       color: 'text-blue-600',    bg: 'bg-blue-50' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{value}</p>
              <p className="text-xs text-slate-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Webhooks activos', value: webhooksActivos, icon: Webhook },
          { label: 'Imports en curso', value: importsPendientes, icon: Upload },
          { label: 'Alertas',          value: errores, icon: AlertCircle },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-white rounded-2xl border border-slate-100 p-3 flex items-center gap-2">
            <Icon className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <div>
              <p className="text-base font-bold text-slate-800">{value}</p>
              <p className="text-xs text-slate-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Connector overview grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <SummaryCard icon={Key} title="API REST" color="text-violet-600" bg="bg-violet-50" tab="api"
          items={state.apiKeys.map(k => ({ name: k.nombre, estado: k.estado }))} onNavigate={onNavigate} />
        <SummaryCard icon={Webhook} title="Webhooks" color="text-blue-600" bg="bg-blue-50" tab="webhooks"
          items={state.webhooks.map(w => ({ name: w.nombre, estado: w.estado }))} onNavigate={onNavigate} />
        <SummaryCard icon={BookOpen} title="Contabilidad" color="text-orange-600" bg="bg-orange-50" tab="contabilidad"
          items={state.conectoresContables.map(c => ({ name: c.nombre, estado: c.estado }))} onNavigate={onNavigate} />
        <SummaryCard icon={FileCheck} title="Fact. Electrónica" color="text-emerald-600" bg="bg-emerald-50" tab="facturacion_elec"
          items={state.conectoresFactElec.map(c => ({ name: c.proveedor.toUpperCase(), estado: c.estado }))} onNavigate={onNavigate} />
        <SummaryCard icon={Landmark} title="Banca" color="text-blue-700" bg="bg-blue-50" tab="banca"
          items={state.conectoresBancarios.map(c => ({ name: c.banco, estado: c.estado }))} onNavigate={onNavigate} />
        <SummaryCard icon={ShoppingBag} title="E-commerce" color="text-pink-600" bg="bg-pink-50" tab="ecommerce"
          items={state.conectoresEcommerce.map(c => ({ name: c.shop, estado: c.estado }))} onNavigate={onNavigate} />
        <SummaryCard icon={MapPin} title="Mapas y Rutas" color="text-teal-600" bg="bg-teal-50" tab="mapas"
          items={state.conectorMapas ? [{ name: state.conectorMapas.proveedor, estado: state.conectorMapas.estado }] : []} onNavigate={onNavigate} />
        <SummaryCard icon={Upload} title="Import / Export" color="text-slate-600" bg="bg-slate-50" tab="importador"
          items={state.importJobs.slice(0, 3).map(j => ({ name: j.archivo, estado: j.estado }))} onNavigate={onNavigate} />
      </div>
    </div>
  );
}
