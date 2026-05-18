import { User, Mail, Phone, Building2, Shield, Clock } from 'lucide-react';
import { usePortalAuthStore } from '../store/auth.store';
import { ROL_LABELS, ESTADO_USUARIO_CONFIG } from '../constants/auth.constants';
import { PortalStatusBadge } from '../../components/PortalStatusBadge';

export default function PortalPerfilPage() {
  const { cliente } = usePortalAuthStore();
  if (!cliente) return null;

  const estadoCfg = ESTADO_USUARIO_CONFIG[cliente.estado];

  return (
    <div className="max-w-2xl space-y-5">
      {/* Avatar card */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center flex-shrink-0">
            <span className="text-white text-2xl font-bold">{cliente.nombre[0]}{cliente.apellidos[0]}</span>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-slate-900">{cliente.nombre} {cliente.apellidos}</h2>
            <p className="text-slate-500 text-sm">{ROL_LABELS[cliente.rol]} · {cliente.empresa}</p>
            <div className="flex items-center gap-2 mt-2">
              <PortalStatusBadge label={estadoCfg.label} color={estadoCfg.color} bg={estadoCfg.bg} />
              {cliente.mfaHabilitado && (
                <span className="text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Shield className="w-3 h-3" /> MFA activo
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <h3 className="font-semibold text-slate-800 mb-4">Información de contacto</h3>
        <div className="space-y-4">
          {[
            { icon: Mail, label: 'Email', value: cliente.email },
            { icon: Phone, label: 'Teléfono', value: cliente.telefono ?? 'No especificado' },
            { icon: Building2, label: 'Empresa', value: cliente.empresa },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-4">
              <div className="w-9 h-9 bg-slate-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-slate-500" />
              </div>
              <div>
                <p className="text-xs text-slate-400">{label}</p>
                <p className="text-sm font-medium text-slate-800">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Account */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <h3 className="font-semibold text-slate-800 mb-4">Detalles de la cuenta</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 bg-slate-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <Shield className="w-4 h-4 text-slate-500" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Rol</p>
              <p className="text-sm font-medium text-slate-800">{ROL_LABELS[cliente.rol]}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 bg-slate-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <Clock className="w-4 h-4 text-slate-500" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Miembro desde</p>
              <p className="text-sm font-medium text-slate-800">{new Date(cliente.creadoEn).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 bg-slate-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-slate-500" />
            </div>
            <div>
              <p className="text-xs text-slate-400">ID de cuenta</p>
              <p className="text-sm font-mono text-slate-500">{cliente.id}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Security note */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
        <h3 className="font-semibold text-blue-900 mb-1 text-sm">Seguridad de la cuenta</h3>
        <p className="text-blue-700 text-xs">
          {cliente.mfaHabilitado
            ? 'Tu cuenta está protegida con autenticación de dos factores (MFA). Esto añade una capa extra de seguridad.'
            : 'Te recomendamos activar la autenticación de dos factores (MFA) para mayor seguridad.'}
        </p>
      </div>
    </div>
  );
}
