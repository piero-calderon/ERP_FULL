import { useState } from 'react';
import { Shield, ShieldCheck, ShieldOff, Key, Save, AlertCircle } from 'lucide-react';
import type { MFAConfig, PasswordPolicy, Usuario } from '../types/auditoria.types';

interface Props {
  mfaConfigs: MFAConfig[];
  passwordPolicy: PasswordPolicy | null;
  usuarios: Usuario[];
  onActivarMFA: (usuarioId: string) => Promise<void>;
  onDesactivarMFA: (usuarioId: string) => Promise<void>;
  onGuardarPolicy: (policy: PasswordPolicy) => Promise<void>;
}

function MFARow({ cfg, usuario, onActivar, onDesactivar }: {
  cfg: MFAConfig; usuario: Usuario | undefined;
  onActivar: () => void; onDesactivar: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const handle = async (fn: () => void) => { setLoading(true); await fn(); setLoading(false); };

  if (!usuario) return null;
  return (
    <div className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.activo ? 'bg-emerald-50' : 'bg-slate-50'}`}>
        {cfg.activo ? <ShieldCheck className="w-4.5 h-4.5 text-emerald-600" /> : <ShieldOff className="w-4.5 h-4.5 text-slate-400" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-800">{usuario.nombre}</p>
        <p className="text-xs text-slate-400">{usuario.email} · {usuario.rolNombre}</p>
      </div>
      {cfg.activo && (
        <div className="flex-shrink-0 text-right text-xs text-slate-500">
          <p>Configurado: {cfg.configuradoEn ? new Date(cfg.configuradoEn).toLocaleDateString('es-ES') : '—'}</p>
          <p>Último uso: {cfg.ultimoUso ? new Date(cfg.ultimoUso).toLocaleString('es-ES') : '—'}</p>
        </div>
      )}
      <div className="flex-shrink-0">
        {cfg.activo ? (
          <button onClick={() => handle(onDesactivar)} disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 text-xs font-medium rounded-lg hover:bg-red-100 disabled:opacity-50 transition-colors border border-red-100">
            <ShieldOff className="w-3.5 h-3.5" /> {loading ? '…' : 'Desactivar'}
          </button>
        ) : (
          <button onClick={() => handle(onActivar)} disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors">
            <Shield className="w-3.5 h-3.5" /> {loading ? '…' : 'Activar MFA'}
          </button>
        )}
      </div>
    </div>
  );
}

function PolicyEditor({ policy, onSave }: { policy: PasswordPolicy; onSave: (p: PasswordPolicy) => Promise<void> }) {
  const [form, setForm] = useState(policy);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const update = <K extends keyof PasswordPolicy>(key: K, value: PasswordPolicy[K]) => setForm(f => ({ ...f, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    await onSave(form);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { label: 'Longitud mínima', key: 'minLength' as const, type: 'number', min: 8, max: 32 },
          { label: 'Expiración (días)', key: 'expirationDays' as const, type: 'number', min: 0, max: 365 },
          { label: 'Historial', key: 'historyCount' as const, type: 'number', min: 0, max: 24 },
          { label: 'Máx. intentos', key: 'maxAttempts' as const, type: 'number', min: 1, max: 20 },
          { label: 'Bloqueo (minutos)', key: 'lockoutMinutes' as const, type: 'number', min: 1, max: 1440 },
        ].map(({ label, key, type, min, max }) => (
          <div key={key} className="bg-slate-50 rounded-xl p-3">
            <label className="text-xs text-slate-500 block mb-1">{label}</label>
            <input type={type} min={min} max={max} value={form[key] as number}
              onChange={e => update(key, Number(e.target.value))}
              className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Mayúsculas', key: 'requireUpper' as const },
          { label: 'Minúsculas', key: 'requireLower' as const },
          { label: 'Números', key: 'requireNumber' as const },
          { label: 'Especiales (!@#)', key: 'requireSpecial' as const },
        ].map(({ label, key }) => (
          <label key={key} className="flex items-center gap-2 bg-slate-50 rounded-xl p-3 cursor-pointer hover:bg-slate-100">
            <input type="checkbox" checked={form[key] as boolean} onChange={e => update(key, e.target.checked)} className="rounded" />
            <span className="text-sm text-slate-700">{label}</span>
          </label>
        ))}
      </div>

      <div className="flex items-center gap-4 p-4 bg-blue-50 border border-blue-100 rounded-xl">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.mfaRequerido} onChange={e => update('mfaRequerido', e.target.checked)} className="rounded" />
          <span className="text-sm font-medium text-blue-800">MFA obligatorio para roles admin</span>
        </label>
      </div>

      <button onClick={handleSave} disabled={saving}
        className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-700 disabled:opacity-50 transition-colors">
        <Save className="w-4 h-4" />
        {saving ? 'Guardando…' : saved ? '¡Guardado!' : 'Guardar política'}
      </button>
    </div>
  );
}

export function MFAPoliticasTab({ mfaConfigs, passwordPolicy, usuarios, onActivarMFA, onDesactivarMFA, onGuardarPolicy }: Props) {
  const [tab, setTab] = useState<'mfa' | 'policy'>('mfa');
  const activeCount = mfaConfigs.filter(c => c.activo).length;
  const sinMFA = mfaConfigs.filter(c => !c.activo).length;

  return (
    <div className="space-y-5">
      <div className="flex gap-1 bg-white border border-slate-200 rounded-xl p-1 w-fit">
        {(['mfa', 'policy'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-1.5 text-sm font-medium rounded-lg transition-colors ${tab === t ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>
            {t === 'mfa' ? 'Autenticación MFA' : 'Políticas de contraseña'}
          </button>
        ))}
      </div>

      {tab === 'mfa' && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Con MFA activo', value: activeCount, color: 'text-emerald-600', bg: 'bg-emerald-50', icon: ShieldCheck },
              { label: 'Sin MFA', value: sinMFA, color: 'text-amber-600', bg: 'bg-amber-50', icon: AlertCircle },
            ].map(({ label, value, color, bg, icon: Icon }) => (
              <div key={label} className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{value}</p>
                  <p className="text-xs text-slate-500">{label}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-50">
              <p className="text-sm font-semibold text-slate-700">Gestión MFA por usuario</p>
            </div>
            <div className="divide-y divide-slate-50">
              {mfaConfigs.map(cfg => {
                const user = usuarios.find(u => u.id === cfg.usuarioId);
                return (
                  <MFARow key={cfg.usuarioId} cfg={cfg} usuario={user}
                    onActivar={() => onActivarMFA(cfg.usuarioId)}
                    onDesactivar={() => onDesactivarMFA(cfg.usuarioId)} />
                );
              })}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <Key className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-blue-800 mb-1">Simulación TOTP</p>
                <p className="text-xs text-blue-700">En producción, cada usuario escanearía un código QR con Google Authenticator / Authy. Los códigos de recuperación se muestran una única vez al configurar MFA.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'policy' && (
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <div className="flex items-center gap-2 mb-5">
            <Key className="w-4 h-4 text-slate-400" />
            <p className="text-sm font-semibold text-slate-700">Política de contraseñas — Tenant global</p>
          </div>
          {passwordPolicy ? (
            <PolicyEditor policy={passwordPolicy} onSave={onGuardarPolicy} />
          ) : (
            <p className="text-sm text-slate-400">Cargando política…</p>
          )}
        </div>
      )}
    </div>
  );
}
