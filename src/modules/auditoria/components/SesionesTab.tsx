import { useState } from 'react';
import { Monitor, Smartphone, Globe, LogIn, LogOut, AlertTriangle, XCircle, ShieldOff } from 'lucide-react';
import { ESTADO_SESION_CONFIG } from '../constants/auditoria.constants';
import type { Sesion, LoginEvent } from '../types/auditoria.types';

interface Props {
  sesiones: Sesion[];
  loginEvents: LoginEvent[];
  onRevocar: (id: string) => Promise<void>;
}

function deviceIcon(dispositivo: string) {
  if (dispositivo.toLowerCase().includes('android') || dispositivo.toLowerCase().includes('iphone')) return Smartphone;
  if (dispositivo.toLowerCase().includes('linux') || dispositivo.toLowerCase().includes('tor')) return Globe;
  return Monitor;
}

const EVENT_ICON = {
  login:   { icon: LogIn,        color: 'text-emerald-600', bg: 'bg-emerald-50' },
  logout:  { icon: LogOut,       color: 'text-slate-500',   bg: 'bg-slate-50' },
  failed:  { icon: AlertTriangle,color: 'text-amber-600',   bg: 'bg-amber-50' },
  blocked: { icon: XCircle,      color: 'text-red-600',     bg: 'bg-red-50' },
};

function SessionCard({ sesion, onRevocar }: { sesion: Sesion; onRevocar: (id: string) => void }) {
  const cfg = ESTADO_SESION_CONFIG[sesion.estado] ?? ESTADO_SESION_CONFIG.activa;
  const [renderNow] = useState(() => Date.now());
  const deviceType = deviceIcon(sesion.dispositivo);
  const isExpiringSoon = sesion.estado === 'activa' && new Date(sesion.expiraEn).getTime() - renderNow < 2 * 3600000;
  const deviceIconClass = `w-5 h-5 ${sesion.estado === 'activa' ? 'text-emerald-600' : 'text-slate-400'}`;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${sesion.estado === 'activa' ? 'bg-emerald-50' : 'bg-slate-50'}`}>
            {deviceType === Smartphone && <Smartphone className={deviceIconClass} />}
            {deviceType === Globe && <Globe className={deviceIconClass} />}
            {deviceType === Monitor && <Monitor className={deviceIconClass} />}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">{sesion.usuarioNombre}</p>
            <p className="text-xs text-slate-500">{sesion.usuarioEmail}</p>
          </div>
        </div>
        <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${cfg.bg} ${cfg.color}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />{cfg.label}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs mb-3">
        <div className="bg-slate-50 rounded-xl p-2">
          <p className="text-slate-400 mb-0.5">Dispositivo</p>
          <p className="font-medium text-slate-700 truncate">{sesion.dispositivo}</p>
        </div>
        <div className="bg-slate-50 rounded-xl p-2">
          <p className="text-slate-400 mb-0.5">IP</p>
          <p className="font-mono font-medium text-slate-700">{sesion.ip}</p>
        </div>
        <div className="bg-slate-50 rounded-xl p-2">
          <p className="text-slate-400 mb-0.5">Último acceso</p>
          <p className="font-medium text-slate-700">{new Date(sesion.ultimoAcceso).toLocaleString('es-ES')}</p>
        </div>
        <div className={`rounded-xl p-2 ${isExpiringSoon ? 'bg-amber-50' : 'bg-slate-50'}`}>
          <p className="text-slate-400 mb-0.5">Expira</p>
          <p className={`font-medium ${isExpiringSoon ? 'text-amber-700' : 'text-slate-700'}`}>{new Date(sesion.expiraEn).toLocaleString('es-ES')}</p>
        </div>
      </div>
      {sesion.estado === 'activa' && (
        <button onClick={() => onRevocar(sesion.id)}
          className="w-full flex items-center justify-center gap-1.5 py-2 bg-red-50 text-red-600 text-xs font-semibold rounded-xl hover:bg-red-100 transition-colors border border-red-100">
          <ShieldOff className="w-3.5 h-3.5" /> Revocar sesión
        </button>
      )}
    </div>
  );
}

function EventRow({ e }: { e: LoginEvent }) {
  const { icon: Icon, color, bg } = EVENT_ICON[e.tipo] ?? EVENT_ICON.login;
  return (
    <div className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 text-xs">
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${bg}`}>
        <Icon className={`w-3.5 h-3.5 ${color}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-slate-700">{e.usuarioNombre}</p>
        <p className="text-slate-400">{e.dispositivo} · {e.ip}{e.motivo ? ` · ${e.motivo}` : ''}</p>
      </div>
      <span className={`font-medium capitalize ${color}`}>{e.tipo === 'failed' ? 'Fallido' : e.tipo === 'blocked' ? 'Bloqueado' : e.tipo === 'login' ? 'Acceso' : 'Cierre'}</span>
      <span className="text-slate-400 w-32 text-right">{new Date(e.timestamp).toLocaleString('es-ES')}</span>
    </div>
  );
}

export function SesionesTab({ sesiones, loginEvents, onRevocar }: Props) {
  const activas  = sesiones.filter(s => s.estado === 'activa');
  const otras    = sesiones.filter(s => s.estado !== 'activa');
  const ipsRaras = sesiones.filter(s => s.estado === 'activa' && !s.ip.startsWith('192.168') && !s.ip.startsWith('10.'));

  return (
    <div className="space-y-5">
      {ipsRaras.length > 0 && (
        <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
          <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
          <p className="text-amber-800 text-sm">
            <strong>{ipsRaras.length}</strong> sesión{ipsRaras.length !== 1 ? 'es' : ''} activa{ipsRaras.length !== 1 ? 's' : ''} desde IPs externas a la red corporativa.
          </p>
        </div>
      )}

      {/* Active sessions */}
      <div>
        <p className="text-sm font-semibold text-slate-700 mb-3">{activas.length} sesiones activas</p>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {activas.map(s => <SessionCard key={s.id} sesion={s} onRevocar={onRevocar} />)}
          {activas.length === 0 && <p className="text-sm text-slate-400">Sin sesiones activas</p>}
        </div>
      </div>

      {/* Closed/revoked sessions */}
      {otras.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-slate-700 mb-3">Sesiones anteriores</p>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {otras.map(s => <SessionCard key={s.id} sesion={s} onRevocar={onRevocar} />)}
          </div>
        </div>
      )}

      {/* Login history */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-50">
          <p className="text-sm font-semibold text-slate-700">Historial de accesos</p>
        </div>
        <div className="divide-y divide-slate-50 max-h-64 overflow-y-auto">
          {loginEvents.map(e => <EventRow key={e.id} e={e} />)}
          {loginEvents.length === 0 && <p className="px-5 py-8 text-sm text-slate-400 text-center">Sin eventos</p>}
        </div>
      </div>
    </div>
  );
}
