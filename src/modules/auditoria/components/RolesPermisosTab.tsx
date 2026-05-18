import { useState, useMemo } from 'react';
import { Plus, Trash2, Check, X, Shield } from 'lucide-react';
import type { Rol, Permiso } from '../types/auditoria.types';
import { MODULOS_AUDIT_LABELS } from '../constants/auditoria.constants';

interface Props {
  roles: Rol[];
  permisos: Permiso[];
  onCrearRol: (nombre: string, desc: string, permisoIds: string[]) => Promise<void>;
  onEditarPermisos: (rolId: string, permisoIds: string[]) => Promise<void>;
  onEliminarRol: (rolId: string) => Promise<void>;
}

const NIVEL_COLOR: Record<string, string> = {
  read:  'text-blue-600 bg-blue-50',
  write: 'text-violet-600 bg-violet-50',
  admin: 'text-red-600 bg-red-50',
};

function NuevoRolModal({ permisos, onClose, onCrear }: { permisos: Permiso[]; onClose: () => void; onCrear: (n: string, d: string, ps: string[]) => Promise<void> }) {
  const [nombre, setNombre] = useState('');
  const [desc, setDesc] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  const byModulo = useMemo(() => {
    const m: Record<string, Permiso[]> = {};
    permisos.forEach(p => { if (!m[p.modulo]) m[p.modulo] = []; m[p.modulo].push(p); });
    return m;
  }, [permisos]);

  const toggle = (id: string) => setSelected(prev => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    return next;
  });
  const toggleAll = (ids: string[]) => setSelected(prev => {
    const next = new Set(prev);
    const allSelected = ids.every(id => next.has(id));
    ids.forEach(id => allSelected ? next.delete(id) : next.add(id));
    return next;
  });

  const submit = async () => {
    if (!nombre.trim() || selected.size === 0) return;
    setLoading(true);
    await onCrear(nombre.trim(), desc.trim(), [...selected]);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-2xl p-6 shadow-xl max-h-[85vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <h3 className="text-base font-bold text-slate-900 mb-4">Nuevo Rol</h3>
        <div className="flex gap-3 mb-4">
          <div className="flex-1">
            <label className="text-xs font-medium text-slate-600 block mb-1">Nombre del rol</label>
            <input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Manager Logística"
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex-1">
            <label className="text-xs font-medium text-slate-600 block mb-1">Descripción</label>
            <input value={desc} onChange={e => setDesc(e.target.value)} placeholder="Acceso a logística y almacén"
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        <p className="text-xs font-semibold text-slate-600 mb-2">{selected.size} permisos seleccionados</p>
        <div className="overflow-y-auto flex-1 space-y-3 pr-1">
          {Object.entries(byModulo).map(([mod, ps]) => (
            <div key={mod} className="border border-slate-100 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 bg-slate-50">
                <p className="text-xs font-semibold text-slate-700">{MODULOS_AUDIT_LABELS[mod] ?? mod}</p>
                <button onClick={() => toggleAll(ps.map(p => p.id))} className="text-xs text-blue-600 hover:underline">
                  {ps.every(p => selected.has(p.id)) ? 'Desmarcar todo' : 'Seleccionar todo'}
                </button>
              </div>
              <div className="grid grid-cols-2 gap-1 p-2">
                {ps.map(p => (
                  <label key={p.id} className={`flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer hover:bg-slate-50 ${selected.has(p.id) ? 'bg-blue-50' : ''}`}>
                    <input type="checkbox" checked={selected.has(p.id)} onChange={() => toggle(p.id)} className="rounded" />
                    <span className="text-xs text-slate-700">{p.descripcion}</span>
                    {p.critico && <span className="text-xs text-red-500 ml-auto">⚠</span>}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-3 mt-4 pt-4 border-t border-slate-100">
          <button onClick={submit} disabled={loading || !nombre || selected.size === 0}
            className="flex-1 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors">
            {loading ? 'Creando…' : 'Crear Rol'}
          </button>
          <button onClick={onClose} className="px-5 py-2.5 bg-slate-100 text-slate-700 text-sm rounded-xl hover:bg-slate-200 transition-colors">Cancelar</button>
        </div>
      </div>
    </div>
  );
}

export function RolesPermisosTab({ roles, permisos, onCrearRol, onEditarPermisos, onEliminarRol }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [selectedRol, setSelectedRol] = useState<string | null>(roles[0]?.id ?? null);
  const [editMode, setEditMode] = useState(false);
  const [editedPerms, setEditedPerms] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);

  const rol = roles.find(r => r.id === selectedRol);

  const byModulo = useMemo(() => {
    const m: Record<string, Permiso[]> = {};
    permisos.forEach(p => { if (!m[p.modulo]) m[p.modulo] = []; m[p.modulo].push(p); });
    return m;
  }, [permisos]);

  const startEdit = () => {
    if (!rol) return;
    setEditedPerms(new Set(rol.permisoIds));
    setEditMode(true);
  };

  const saveEdit = async () => {
    if (!selectedRol) return;
    setSaving(true);
    await onEditarPermisos(selectedRol, [...editedPerms]);
    setEditMode(false);
    setSaving(false);
  };

  const togglePerm = (id: string) => setEditedPerms(prev => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    return next;
  });

  const activePerms = editMode ? editedPerms : new Set(rol?.permisoIds ?? []);

  return (
    <div className="space-y-5">
      {showModal && <NuevoRolModal permisos={permisos} onClose={() => setShowModal(false)} onCrear={onCrearRol} />}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Roles list */}
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-50 flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-700">{roles.length} roles</p>
            <button onClick={() => setShowModal(true)}
              className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700">
              <Plus className="w-3.5 h-3.5" /> Nuevo
            </button>
          </div>
          <div className="divide-y divide-slate-50">
            {roles.map(r => (
              <div key={r.id}
                className={`px-4 py-3 cursor-pointer hover:bg-slate-50 transition-colors flex items-center gap-3 ${selectedRol === r.id ? 'bg-blue-50 border-l-2 border-blue-500' : ''}`}
                onClick={() => { setSelectedRol(r.id); setEditMode(false); }}>
                <Shield className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-slate-800 truncate">{r.nombre}</p>
                    {r.isSystem && <span className="text-xs text-slate-400">sistema</span>}
                  </div>
                  <p className="text-xs text-slate-500">{r.permisoIds.length} permisos · {r.usersCount} usuarios</p>
                </div>
                {!r.isSystem && (
                  <button onClick={e => { e.stopPropagation(); onEliminarRol(r.id); }}
                    className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors flex-shrink-0">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Permission matrix */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 overflow-hidden">
          {rol ? (
            <>
              <div className="px-5 py-3 border-b border-slate-50 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-700">{rol.nombre}</p>
                  <p className="text-xs text-slate-400">{rol.descripcion}</p>
                </div>
                <div className="flex gap-2">
                  {editMode ? (
                    <>
                      <button onClick={saveEdit} disabled={saving}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors">
                        <Check className="w-3.5 h-3.5" /> {saving ? 'Guardando…' : 'Guardar'}
                      </button>
                      <button onClick={() => setEditMode(false)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-600 text-xs rounded-lg hover:bg-slate-200 transition-colors">
                        <X className="w-3.5 h-3.5" /> Cancelar
                      </button>
                    </>
                  ) : !rol.isSystem ? (
                    <button onClick={startEdit}
                      className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs font-medium rounded-lg hover:bg-slate-200 transition-colors">
                      Editar permisos
                    </button>
                  ) : null}
                </div>
              </div>
              <div className="overflow-y-auto max-h-[560px]">
                {Object.entries(byModulo).map(([mod, ps]) => (
                  <div key={mod} className="border-b border-slate-50 last:border-0">
                    <div className="px-5 py-2 bg-slate-50">
                      <p className="text-xs font-semibold text-slate-600">{MODULOS_AUDIT_LABELS[mod] ?? mod}</p>
                    </div>
                    {ps.map(p => {
                      const has = activePerms.has(p.id);
                      return (
                        <div key={p.id}
                          className={`flex items-center gap-3 px-5 py-2.5 hover:bg-slate-50 ${editMode ? 'cursor-pointer' : ''}`}
                          onClick={() => editMode && togglePerm(p.id)}>
                          <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${has ? 'bg-blue-600' : 'bg-slate-100 border border-slate-200'}`}>
                            {has && <Check className="w-3 h-3 text-white" />}
                          </div>
                          <span className="text-xs text-slate-700 flex-1">{p.descripcion}</span>
                          <span className="text-xs font-mono text-slate-400">{p.key}</span>
                          <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${NIVEL_COLOR[p.nivel]}`}>{p.nivel}</span>
                          {p.critico && <span className="text-xs text-red-500 font-medium">⚠ Crítico</span>}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-48 text-slate-400 text-sm">Selecciona un rol</div>
          )}
        </div>
      </div>
    </div>
  );
}
