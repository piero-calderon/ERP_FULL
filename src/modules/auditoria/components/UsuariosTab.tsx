import { useState } from 'react';
import { Plus, Shield, Lock, Unlock, UserX, UserCheck, Key, MoreVertical } from 'lucide-react';
import { ESTADO_USUARIO_CONFIG } from '../constants/auditoria.constants';
import type { Usuario, Rol, EstadoUsuario } from '../types/auditoria.types';

interface Props {
  usuarios: Usuario[];
  roles: Rol[];
  onCambiarEstado: (id: string, estado: EstadoUsuario) => Promise<void>;
  onForzarPassword: (id: string) => Promise<void>;
  onCambiarRol: (id: string, rolId: string, rolNombre: string) => Promise<void>;
  onCrear: (data: Omit<Usuario, 'id' | 'creadoEn' | 'intentosFallidos' | 'ultimoLogin' | 'passwordExpiresAt' | 'tenantId'>) => Promise<void>;
}

function NuevoUsuarioModal({ roles, onClose, onCrear }: { roles: Rol[]; onClose: () => void; onCrear: Props['onCrear'] }) {
  const [form, setForm] = useState({ nombre: '', email: '', rolId: roles[1]?.id ?? '', department: '' });
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!form.nombre.trim() || !form.email.trim()) return;
    setLoading(true);
    const rol = roles.find(r => r.id === form.rolId);
    await onCrear({
      nombre: form.nombre, email: form.email, rolId: form.rolId,
      rolNombre: rol?.nombre ?? '', estado: 'activo', mfaActivo: false,
      department: form.department, forzarCambioPassword: true,
      alcancesABAC: { zonas: ['Centro'], almacenes: ['Principal'], canales: ['B2B'] },
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl" onClick={e => e.stopPropagation()}>
        <h3 className="text-base font-bold text-slate-900 mb-4">Nuevo Usuario</h3>
        <div className="space-y-3">
          {[
            { label: 'Nombre completo', key: 'nombre', placeholder: 'María García López' },
            { label: 'Email corporativo', key: 'email', placeholder: 'm.garcia@empresa.com' },
            { label: 'Departamento', key: 'department', placeholder: 'Ventas' },
          ].map(({ label, key, placeholder }) => (
            <div key={key}>
              <label className="text-xs font-medium text-slate-600 block mb-1">{label}</label>
              <input value={form[key as keyof typeof form]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                placeholder={placeholder}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          ))}
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1">Rol</label>
            <select value={form.rolId} onChange={e => setForm(f => ({ ...f, rolId: e.target.value }))}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              {roles.map(r => <option key={r.id} value={r.id}>{r.nombre}</option>)}
            </select>
          </div>
        </div>
        <p className="text-xs text-amber-700 bg-amber-50 rounded-xl p-3 mt-4">El usuario recibirá un email de bienvenida y deberá cambiar la contraseña en el primer acceso.</p>
        <div className="flex gap-3 mt-4">
          <button onClick={submit} disabled={loading || !form.nombre || !form.email}
            className="flex-1 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors">
            {loading ? 'Creando…' : 'Crear Usuario'}
          </button>
          <button onClick={onClose} className="px-4 py-2.5 bg-slate-100 text-slate-700 text-sm rounded-xl hover:bg-slate-200 transition-colors">Cancelar</button>
        </div>
      </div>
    </div>
  );
}

function UserRow({ user, roles, onCambiarEstado, onForzarPassword, onCambiarRol }: {
  user: Usuario; roles: Rol[];
  onCambiarEstado: (id: string, estado: EstadoUsuario) => void;
  onForzarPassword: (id: string) => void;
  onCambiarRol: (id: string, rolId: string, rolNombre: string) => void;
}) {
  const cfg = ESTADO_USUARIO_CONFIG[user.estado] ?? ESTADO_USUARIO_CONFIG.inactivo;
  const [menuOpen, setMenuOpen] = useState(false);
  const [editRol, setEditRol] = useState(false);

  return (
    <div className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors">
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center flex-shrink-0 text-sm font-bold text-slate-700">
        {user.nombre.charAt(0)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-slate-800">{user.nombre}</p>
          {user.mfaActivo && <span title="MFA activo"><Shield className="w-3.5 h-3.5 text-emerald-600" /></span>}
          {user.forzarCambioPassword && <span title="Debe cambiar contrasena"><Key className="w-3.5 h-3.5 text-amber-500" /></span>}
        </div>
        <p className="text-xs text-slate-400">{user.email} - {user.department}</p>
        {user.alcancesABAC && (
          <p className="mt-1 truncate text-[11px] text-slate-400">
            ABAC: {user.alcancesABAC.zonas.join(', ')} / {user.alcancesABAC.almacenes.join(', ')} / {user.alcancesABAC.canales.join(', ')}
          </p>
        )}
      </div>
      <div className="flex-shrink-0">
        {editRol ? (
          <select defaultValue={user.rolId} autoFocus
            onChange={e => { const rol = roles.find(r => r.id === e.target.value); if (rol) onCambiarRol(user.id, rol.id, rol.nombre); setEditRol(false); }}
            onBlur={() => setEditRol(false)}
            className="border border-blue-300 rounded-lg px-2 py-1 text-xs focus:outline-none ring-1 ring-blue-400">
            {roles.map(r => <option key={r.id} value={r.id}>{r.nombre}</option>)}
          </select>
        ) : (
          <span className={`text-xs px-2 py-1 rounded-full border font-medium cursor-pointer hover:opacity-80 ${roles.find(r => r.id === user.rolId)?.color ?? 'bg-slate-100 text-slate-600 border-slate-200'}`}
            onClick={() => setEditRol(true)} title="Clic para cambiar rol">
            {user.rolNombre}
          </span>
        )}
      </div>
      <div className="flex-shrink-0 text-right">
        <p className="text-xs text-slate-500">{user.ultimoLogin ? new Date(user.ultimoLogin).toLocaleString('es-ES') : 'Nunca'}</p>
        {user.intentosFallidos > 0 && <p className="text-xs text-red-500">{user.intentosFallidos} intentos fallidos</p>}
      </div>
      <span className={`flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${cfg.bg} ${cfg.color}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />{cfg.label}
      </span>
      <div className="relative flex-shrink-0">
        <button onClick={() => setMenuOpen(!menuOpen)} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
          <MoreVertical className="w-4 h-4" />
        </button>
        {menuOpen && (
          <div className="absolute right-0 top-9 bg-white rounded-xl border border-slate-100 shadow-lg z-10 w-48 py-1" onMouseLeave={() => setMenuOpen(false)}>
            {user.estado === 'activo' ? (
              <button onClick={() => { onCambiarEstado(user.id, 'bloqueado'); setMenuOpen(false); }}
                className="flex items-center gap-2 w-full px-3 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors">
                <Lock className="w-3.5 h-3.5" /> Bloquear cuenta
              </button>
            ) : (
              <button onClick={() => { onCambiarEstado(user.id, 'activo'); setMenuOpen(false); }}
                className="flex items-center gap-2 w-full px-3 py-2 text-xs text-emerald-600 hover:bg-emerald-50 transition-colors">
                <Unlock className="w-3.5 h-3.5" /> Activar cuenta
              </button>
            )}
            <button onClick={() => { onForzarPassword(user.id); setMenuOpen(false); }}
              className="flex items-center gap-2 w-full px-3 py-2 text-xs text-amber-600 hover:bg-amber-50 transition-colors">
              <Key className="w-3.5 h-3.5" /> Forzar cambio de contraseña
            </button>
            {user.estado === 'activo' && (
              <button onClick={() => { onCambiarEstado(user.id, 'suspendido'); setMenuOpen(false); }}
                className="flex items-center gap-2 w-full px-3 py-2 text-xs text-slate-600 hover:bg-slate-50 transition-colors">
                <UserX className="w-3.5 h-3.5" /> Suspender
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function UsuariosTab({ usuarios, roles, onCambiarEstado, onForzarPassword, onCambiarRol, onCrear }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = usuarios.filter(u =>
    !search || u.nombre.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  const activos   = usuarios.filter(u => u.estado === 'activo').length;
  const bloqueados = usuarios.filter(u => u.estado === 'bloqueado').length;
  const sinMFA    = usuarios.filter(u => !u.mfaActivo && u.estado === 'activo').length;

  return (
    <div className="space-y-5">
      {showModal && <NuevoUsuarioModal roles={roles} onClose={() => setShowModal(false)} onCrear={onCrear} />}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Usuarios activos', value: activos, color: 'text-emerald-600', bg: 'bg-emerald-50', icon: UserCheck },
          { label: 'Bloqueados', value: bloqueados, color: 'text-red-600', bg: 'bg-red-50', icon: Lock },
          { label: 'Sin MFA activo', value: sinMFA, color: 'text-amber-600', bg: 'bg-amber-50', icon: Shield },
        ].map(({ label, value, color, bg, icon: Icon }) => (
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

      {sinMFA > 0 && (
        <div className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-2xl text-sm">
          <Shield className="w-4 h-4 text-amber-500 flex-shrink-0" />
          <p className="text-amber-800"><strong>{sinMFA}</strong> usuario{sinMFA !== 1 ? 's' : ''} activo{sinMFA !== 1 ? 's' : ''} sin MFA configurado. Considera habilitarlo en la pestaña MFA.</p>
        </div>
      )}

      {/* List */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-50 flex items-center gap-3">
          <div className="relative flex-1">
            <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar usuario…"
              className="w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <button onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors flex-shrink-0">
            <Plus className="w-4 h-4" /> Nuevo Usuario
          </button>
        </div>
        <div className="divide-y divide-slate-50">
          {filtered.map(u => (
            <UserRow key={u.id} user={u} roles={roles}
              onCambiarEstado={onCambiarEstado} onForzarPassword={onForzarPassword} onCambiarRol={onCambiarRol} />
          ))}
          {filtered.length === 0 && <p className="px-5 py-8 text-sm text-slate-400 text-center">Sin usuarios</p>}
        </div>
      </div>
    </div>
  );
}
