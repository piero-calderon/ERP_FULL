import { useEffect } from 'react';
import {
  Activity, Bell, CheckCircle2, ClipboardCheck, Database, FileText, Fingerprint,
  GitCompare, KeyRound, LayoutDashboard, LockKeyhole, Network, ShieldCheck,
  ShieldAlert, Users,
} from 'lucide-react';
import type { ComponentType } from 'react';
import { useAuditoriaStore } from '../store/auditoria.store';
import { AuditLogTab } from '../components/AuditLogTab';
import { UsuariosTab } from '../components/UsuariosTab';
import { RolesPermisosTab } from '../components/RolesPermisosTab';
import { SesionesTab } from '../components/SesionesTab';
import { MFAPoliticasTab } from '../components/MFAPoliticasTab';
import { IPWhitelistTab } from '../components/IPWhitelistTab';
import { RGPDCenterTab } from '../components/RGPDCenterTab';
import { AprobacionesTab } from '../components/AprobacionesTab';
import { MODULOS_AUDIT_LABELS, TENANT_ID } from '../constants/auditoria.constants';
import type { AuditoriaState, TabAuditoria } from '../types/auditoria.types';

const TABS: { key: TabAuditoria; label: string; icon: ComponentType<{ className?: string }> }[] = [
  { key: 'dashboard', label: 'Security Center', icon: LayoutDashboard },
  { key: 'audit_log', label: 'Audit log', icon: FileText },
  { key: 'usuarios', label: 'Usuarios', icon: Users },
  { key: 'roles_permisos', label: 'Roles y permisos', icon: KeyRound },
  { key: 'sesiones', label: 'Sesiones', icon: Activity },
  { key: 'mfa_politicas', label: 'MFA y politicas', icon: LockKeyhole },
  { key: 'ip_whitelist', label: 'IP whitelist', icon: Network },
  { key: 'rgpd', label: 'RGPD', icon: Database },
  { key: 'aprobaciones', label: 'Aprobaciones', icon: ClipboardCheck },
];

function MetricCard({ label, value, helper, icon: Icon, tone }: {
  label: string;
  value: string | number;
  helper: string;
  icon: ComponentType<{ className?: string }>;
  tone: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{value}</p>
          <p className="mt-1 text-xs text-slate-500">{helper}</p>
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${tone}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function SecurityDashboard({ state, onNavigate }: { state: AuditoriaState; onNavigate: (tab: TabAuditoria) => void }) {
  const criticalEvents = state.auditLog.filter(e => e.severidad === 'critical').length;
  const activeSessions = state.sesiones.filter(s => s.estado === 'activa').length;
  const pendingApprovals = state.aprobaciones.filter(a => a.estado === 'pendiente').length;
  const usersWithoutMfa = state.usuarios.filter(u => u.estado === 'activo' && !u.mfaActivo).length;
  const blockedIps = state.ipRules.filter(r => r.estado === 'bloqueada').length;
  const pendingRgpd = state.solicitudesRGPD.filter(r => r.estado === 'pendiente' || r.estado === 'en_proceso').length;
  const moduleCounts = state.auditLog.reduce<Record<string, number>>((acc, entry) => {
    acc[entry.modulo] = (acc[entry.modulo] ?? 0) + 1;
    return acc;
  }, {});
  const topModules = Object.entries(moduleCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const latest = state.auditLog.slice(0, 6);

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Eventos criticos" value={criticalEvents} helper="Periodo simulado local" icon={ShieldAlert} tone="bg-red-50 text-red-600" />
        <MetricCard label="Sesiones activas" value={activeSessions} helper="Multi-device y expiracion" icon={Activity} tone="bg-emerald-50 text-emerald-600" />
        <MetricCard label="Aprobaciones" value={pendingApprovals} helper="Acciones sensibles pendientes" icon={ClipboardCheck} tone="bg-amber-50 text-amber-600" />
        <MetricCard label="Usuarios sin MFA" value={usersWithoutMfa} helper="Cuentas activas en riesgo" icon={Fingerprint} tone="bg-blue-50 text-blue-600" />
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm xl:col-span-2">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Activity monitor</h2>
              <p className="text-sm text-slate-500">Timeline operativo con eventos auditables e IP simulada</p>
            </div>
            <button onClick={() => onNavigate('audit_log')} className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-700">
              Abrir explorer
            </button>
          </div>
          <div className="space-y-3">
            {latest.map(entry => (
              <div key={entry.id} className="flex gap-3 rounded-xl border border-slate-100 p-3">
                <span className={`mt-1 h-2.5 w-2.5 rounded-full ${entry.severidad === 'critical' ? 'bg-red-500' : entry.severidad === 'warning' ? 'bg-amber-500' : 'bg-blue-500'}`} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-slate-800">{entry.accion}</p>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">{entry.entidad}</span>
                    <span className="text-xs text-slate-400">{new Date(entry.timestamp).toLocaleString('es-ES')}</span>
                  </div>
                  <p className="truncate text-sm text-slate-500">{entry.descripcion}</p>
                  <p className="mt-1 text-xs text-slate-400">{entry.usuarioNombre} - {entry.ip}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">Risk center</h2>
          <div className="mt-4 space-y-3">
            {[
              { label: 'IPs bloqueadas', value: blockedIps, tab: 'ip_whitelist' as const, icon: Network },
              { label: 'Solicitudes RGPD abiertas', value: pendingRgpd, tab: 'rgpd' as const, icon: Database },
              { label: 'Roles editables', value: state.roles.filter(r => !r.isSystem).length, tab: 'roles_permisos' as const, icon: KeyRound },
            ].map(({ label, value, tab, icon: Icon }) => (
              <button key={label} onClick={() => onNavigate(tab)} className="flex w-full items-center gap-3 rounded-xl border border-slate-100 p-3 text-left hover:bg-slate-50">
                <Icon className="h-4 w-4 text-slate-400" />
                <span className="flex-1 text-sm font-medium text-slate-700">{label}</span>
                <span className="text-lg font-bold text-slate-900">{value}</span>
              </button>
            ))}
          </div>
          <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 p-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <p className="text-sm font-semibold text-emerald-800">Tenant controlado</p>
            </div>
            <p className="mt-1 text-xs text-emerald-700">{TENANT_ID} preparado para IAM, SIEM y microservicios.</p>
          </div>
        </section>
      </div>

      <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <GitCompare className="h-4 w-4 text-slate-400" />
          <h2 className="text-lg font-bold text-slate-900">Cobertura por modulo</h2>
        </div>
        <div className="grid gap-3 md:grid-cols-5">
          {topModules.map(([mod, count]) => (
            <div key={mod} className="rounded-xl bg-slate-50 p-3">
              <p className="truncate text-xs font-semibold text-slate-500">{MODULOS_AUDIT_LABELS[mod] ?? mod}</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">{count}</p>
              <p className="text-xs text-slate-400">eventos</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="grid gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => <div key={index} className="h-28 rounded-2xl bg-slate-100" />)}
      </div>
      <div className="h-96 rounded-2xl bg-slate-100" />
    </div>
  );
}

export default function AuditoriaPage() {
  const store = useAuditoriaStore();
  const cargar = store.cargar;

  useEffect(() => { cargar(); }, [cargar]);

  const renderContent = () => {
    if (store.loading) return <Skeleton />;
    switch (store.tabActiva) {
      case 'dashboard':
        return <SecurityDashboard state={store} onNavigate={store.setTab} />;
      case 'audit_log':
        return <AuditLogTab entries={store.auditLog} onExportar={store.exportarLog} />;
      case 'usuarios':
        return <UsuariosTab usuarios={store.usuarios} roles={store.roles} onCambiarEstado={store.cambiarEstadoUsuario} onForzarPassword={store.forzarCambioPassword} onCambiarRol={store.cambiarRolUsuario} onCrear={store.crearUsuario} />;
      case 'roles_permisos':
        return <RolesPermisosTab roles={store.roles} permisos={store.permisos} onCrearRol={store.crearRol} onEditarPermisos={store.editarPermisos} onEliminarRol={store.eliminarRol} />;
      case 'sesiones':
        return <SesionesTab sesiones={store.sesiones} loginEvents={store.loginEvents} onRevocar={store.revocarSesion} />;
      case 'mfa_politicas':
        return <MFAPoliticasTab mfaConfigs={store.mfaConfigs} passwordPolicy={store.passwordPolicy} usuarios={store.usuarios} onActivarMFA={store.activarMFA} onDesactivarMFA={store.desactivarMFA} onGuardarPolicy={store.guardarPolicy} />;
      case 'ip_whitelist':
        return <IPWhitelistTab rules={store.ipRules} usuarios={store.usuarios} onCrear={store.crearIPRule} onCambiarEstado={store.cambiarEstadoIP} onEliminar={store.eliminarIPRule} />;
      case 'rgpd':
        return <RGPDCenterTab solicitudes={store.solicitudesRGPD} tratamientos={store.tratamientos} onCrear={store.crearSolicitudRGPD} onActualizarEstado={store.actualizarEstadoRGPD} />;
      case 'aprobaciones':
        return <AprobacionesTab aprobaciones={store.aprobaciones} onResolver={store.resolverAprobacion} onCrear={store.crearAprobacion} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Auditoria y seguridad</h1>
          <p className="mt-1 text-sm text-slate-500">Trazabilidad, IAM simulado, compliance y control de acciones criticas con persistencia local.</p>
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs text-slate-500">
          <div className="rounded-xl border border-slate-100 bg-white px-3 py-2 shadow-sm"><Bell className="mb-1 h-4 w-4 text-amber-500" />realtime fake</div>
          <div className="rounded-xl border border-slate-100 bg-white px-3 py-2 shadow-sm"><CheckCircle2 className="mb-1 h-4 w-4 text-emerald-500" />local cache</div>
          <div className="rounded-xl border border-slate-100 bg-white px-3 py-2 shadow-sm"><ShieldCheck className="mb-1 h-4 w-4 text-blue-500" />multi-tenant</div>
        </div>
      </div>

      <div className="flex gap-1 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-1.5">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => store.setTab(key)}
            className={`flex flex-shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
              store.tabActiva === key ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {store.error && <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{store.error}</div>}
      {renderContent()}
    </div>
  );
}
