import { useMemo, useState } from 'react';
import { Boxes, Layers3, MapPinned, Plus, Route, Save, Trash2, Warehouse } from 'lucide-react';
import type { Almacen, Ruta, Zona, Ubicacion } from '../types/configuracion.types';
import {
  ESTADO_LOGISTICO_CONFIG, TIPOS_ALMACEN, TIPOS_ZONA,
} from '../constants/configuracion.constants';
import {
  Field, Input, PrimaryButton, SecondaryButton, DangerButton,
  SectionCard, Toggle, StatusPill, Modal, EmptyHint, Select, MiniKpi,
} from './ui';

interface Props {
  almacenes: Almacen[];
  zonas: Zona[];
  ubicaciones: Ubicacion[];
  rutas: Ruta[];
  saving: boolean;
  onGuardarAlmacen: (data: Omit<Almacen, 'id'> & { id?: string }) => Promise<void>;
  onEliminarAlmacen: (id: string) => Promise<void>;
  onGuardarZona: (data: Omit<Zona, 'id'> & { id?: string }) => Promise<void>;
  onEliminarZona: (id: string) => Promise<void>;
  onGuardarRuta: (data: Omit<Ruta, 'id'> & { id?: string }) => Promise<void>;
  onEliminarRuta: (id: string) => Promise<void>;
}

export function AlmacenesTab(props: Props) {
  const {
    almacenes, zonas, ubicaciones, rutas, saving,
    onGuardarAlmacen, onEliminarAlmacen, onGuardarZona, onEliminarZona, onGuardarRuta, onEliminarRuta,
  } = props;

  const [almacenSel, setAlmacenSel] = useState<string | null>(almacenes[0]?.id ?? null);
  const [modalAlmacen, setModalAlmacen] = useState<{ open: boolean; almacen: Almacen | null }>({ open: false, almacen: null });
  const [modalZona, setModalZona] = useState<{ open: boolean; zona: Zona | null }>({ open: false, zona: null });
  const [modalRuta, setModalRuta] = useState<{ open: boolean; ruta: Ruta | null }>({ open: false, ruta: null });

  const zonasFiltradas = useMemo(() => zonas.filter(z => z.almacenId === almacenSel), [zonas, almacenSel]);
  const ubicacionesFiltradas = useMemo(
    () => ubicaciones.filter(u => zonasFiltradas.some(z => z.id === u.zonaId)),
    [ubicaciones, zonasFiltradas]
  );

  const kpis = {
    almacenes: almacenes.filter(a => a.estado === 'activo').length,
    zonas: zonas.filter(z => z.estado === 'activo').length,
    ubicaciones: ubicaciones.length,
    rutas: rutas.filter(r => r.estado === 'activo').length,
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-3 md:grid-cols-4">
        <MiniKpi label="Almacenes activos" value={kpis.almacenes} helper={`${almacenes.length} totales`} tone="bg-emerald-50 text-emerald-700" />
        <MiniKpi label="Zonas activas"     value={kpis.zonas}     helper={`${zonas.length} totales`}      tone="bg-blue-50 text-blue-700" />
        <MiniKpi label="Ubicaciones"        value={kpis.ubicaciones} helper="Slots logisticos"            tone="bg-violet-50 text-violet-700" />
        <MiniKpi label="Rutas activas"      value={kpis.rutas}     helper={`${rutas.length} totales`}      tone="bg-amber-50 text-amber-700" />
      </div>

      {/* Almacenes */}
      <SectionCard
        title="Almacenes"
        description="Centros logisticos y de operacion. Selecciona uno para ver sus zonas."
        action={
          <PrimaryButton onClick={() => setModalAlmacen({ open: true, almacen: null })}>
            <Plus className="h-4 w-4" /> Nuevo almacen
          </PrimaryButton>
        }
      >
        {almacenes.length === 0 ? (
          <EmptyHint icon={Warehouse} title="Sin almacenes" description="Define centros logisticos para el tenant." />
        ) : (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {almacenes.map(a => {
              const sel = a.id === almacenSel;
              const cfg = ESTADO_LOGISTICO_CONFIG[a.estado];
              return (
                <button
                  type="button"
                  key={a.id}
                  onClick={() => setAlmacenSel(a.id)}
                  className={`flex flex-col rounded-2xl border p-4 text-left shadow-sm transition ${
                    sel ? 'border-slate-900 bg-slate-50' : 'border-slate-100 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <Warehouse className="h-5 w-5 text-slate-400" />
                    <StatusPill tone={cfg.color} dot={cfg.dot} label={cfg.label} />
                  </div>
                  <h3 className="mt-2 text-sm font-semibold text-slate-900">{a.nombre}</h3>
                  <p className="text-xs text-slate-500">{a.codigo} - {TIPOS_ALMACEN.find(t => t.value === a.tipo)?.label}</p>
                  <p className="mt-2 text-xs text-slate-500">{a.direccion}, {a.ciudad}</p>
                  <p className="mt-3 text-xs text-slate-400">Resp.: {a.responsable || 'Sin asignar'}</p>
                  <p className="text-xs text-slate-400">Capacidad: {a.capacidadM3.toLocaleString('es-ES')} m3</p>
                  <div className="mt-3 flex justify-end gap-1">
                    <span
                      onClick={(e) => { e.stopPropagation(); setModalAlmacen({ open: true, almacen: a }); }}
                      className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 cursor-pointer"
                    >
                      Editar
                    </span>
                    <span
                      onClick={(e) => { e.stopPropagation(); onEliminarAlmacen(a.id); }}
                      className="rounded-lg border border-red-200 bg-red-50 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-100 cursor-pointer"
                    >
                      <Trash2 className="inline h-3 w-3" />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </SectionCard>

      {/* Zonas y ubicaciones del almacen seleccionado */}
      <div className="grid gap-5 lg:grid-cols-2">
        <SectionCard
          title="Zonas"
          description={almacenSel ? `Zonas del almacen ${almacenes.find(a => a.id === almacenSel)?.nombre}` : 'Selecciona un almacen.'}
          action={
            <PrimaryButton disabled={!almacenSel} onClick={() => setModalZona({ open: true, zona: null })}>
              <Plus className="h-4 w-4" /> Nueva zona
            </PrimaryButton>
          }
        >
          {!almacenSel ? (
            <EmptyHint icon={Layers3} title="Selecciona un almacen" description="Las zonas se definen por almacen." />
          ) : zonasFiltradas.length === 0 ? (
            <EmptyHint icon={Layers3} title="Sin zonas configuradas" description="Define zonas de picking, reserva, cuarentena..." />
          ) : (
            <div className="space-y-2">
              {zonasFiltradas.map(z => {
                const cfg = ESTADO_LOGISTICO_CONFIG[z.estado];
                return (
                  <div key={z.id} className="flex items-center justify-between rounded-xl border border-slate-100 p-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-slate-900">{z.nombre}</p>
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">{TIPOS_ZONA.find(t => t.value === z.tipo)?.label}</span>
                        <StatusPill tone={cfg.color} dot={cfg.dot} label={cfg.label} />
                      </div>
                      <p className="text-xs text-slate-500">{z.codigo}</p>
                    </div>
                    <div className="flex gap-1">
                      <SecondaryButton onClick={() => setModalZona({ open: true, zona: z })}>Editar</SecondaryButton>
                      <DangerButton onClick={() => onEliminarZona(z.id)}><Trash2 className="h-4 w-4" /></DangerButton>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </SectionCard>

        <SectionCard
          title="Ubicaciones"
          description="Slots fisicos asociados a las zonas seleccionadas."
        >
          {ubicacionesFiltradas.length === 0 ? (
            <EmptyHint icon={Boxes} title="Sin ubicaciones" description="Las ubicaciones se asocian a una zona." />
          ) : (
            <div className="overflow-hidden rounded-xl border border-slate-100">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-3 py-2">Codigo</th>
                    <th className="px-3 py-2">Zona</th>
                    <th className="px-3 py-2">Ocupacion</th>
                    <th className="px-3 py-2">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {ubicacionesFiltradas.map(u => {
                    const zona = zonasFiltradas.find(z => z.id === u.zonaId);
                    const ratio = u.capacidad ? Math.round((u.ocupacion / u.capacidad) * 100) : 0;
                    const cfg = ESTADO_LOGISTICO_CONFIG[u.estado];
                    return (
                      <tr key={u.id} className="border-t border-slate-100">
                        <td className="px-3 py-2 font-medium text-slate-800">{u.codigo}</td>
                        <td className="px-3 py-2 text-slate-600">{zona?.nombre ?? '—'}</td>
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-24 rounded-full bg-slate-100">
                              <div
                                className={`h-2 rounded-full ${ratio > 80 ? 'bg-red-500' : ratio > 50 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                                style={{ width: `${ratio}%` }}
                              />
                            </div>
                            <span className="text-xs text-slate-500">{u.ocupacion} / {u.capacidad}</span>
                          </div>
                        </td>
                        <td className="px-3 py-2"><StatusPill tone={cfg.color} dot={cfg.dot} label={cfg.label} /></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </SectionCard>
      </div>

      {/* Rutas */}
      <SectionCard
        title="Rutas logisticas"
        description="Definicion de rutas entre origen y destino."
        action={
          <PrimaryButton onClick={() => setModalRuta({ open: true, ruta: null })}>
            <Plus className="h-4 w-4" /> Nueva ruta
          </PrimaryButton>
        }
      >
        {rutas.length === 0 ? (
          <EmptyHint icon={Route} title="Sin rutas configuradas" description="Crea rutas para automatizar la planificacion." />
        ) : (
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {rutas.map(r => {
              const cfg = ESTADO_LOGISTICO_CONFIG[r.estado];
              const origen = almacenes.find(a => a.id === r.origenAlmacenId);
              return (
                <article key={r.id} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{r.nombre}</p>
                      <p className="text-xs text-slate-500">{r.codigo}</p>
                    </div>
                    <StatusPill tone={cfg.color} dot={cfg.dot} label={cfg.label} />
                  </div>
                  <div className="mt-3 space-y-1 text-xs text-slate-500">
                    <p className="flex items-center gap-1"><MapPinned className="h-3 w-3" /> Origen: {origen?.nombre ?? '—'}</p>
                    <p>Destino: {r.destinoCiudad}</p>
                    <p>Tiempo estimado: {r.diasEntrega} dia(s)</p>
                  </div>
                  <div className="mt-3 flex justify-end gap-1">
                    <SecondaryButton onClick={() => setModalRuta({ open: true, ruta: r })}>Editar</SecondaryButton>
                    <DangerButton onClick={() => onEliminarRuta(r.id)}><Trash2 className="h-4 w-4" /></DangerButton>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </SectionCard>

      <AlmacenModal
        open={modalAlmacen.open}
        almacen={modalAlmacen.almacen}
        saving={saving}
        onClose={() => setModalAlmacen({ open: false, almacen: null })}
        onGuardar={async (data) => { await onGuardarAlmacen(data); setModalAlmacen({ open: false, almacen: null }); }}
      />
      <ZonaModal
        open={modalZona.open}
        zona={modalZona.zona}
        saving={saving}
        almacenId={almacenSel}
        onClose={() => setModalZona({ open: false, zona: null })}
        onGuardar={async (data) => { await onGuardarZona(data); setModalZona({ open: false, zona: null }); }}
      />
      <RutaModal
        open={modalRuta.open}
        ruta={modalRuta.ruta}
        saving={saving}
        almacenes={almacenes}
        onClose={() => setModalRuta({ open: false, ruta: null })}
        onGuardar={async (data) => { await onGuardarRuta(data); setModalRuta({ open: false, ruta: null }); }}
      />
    </div>
  );
}

function AlmacenModal({ open, almacen, saving, onClose, onGuardar }: {
  open: boolean;
  almacen: Almacen | null;
  saving: boolean;
  onClose: () => void;
  onGuardar: (data: Omit<Almacen, 'id'> & { id?: string }) => Promise<void>;
}) {
  const initial: Omit<Almacen, 'id'> & { id?: string } = almacen ?? {
    codigo: '', nombre: '', tipo: 'central', direccion: '', ciudad: '',
    responsable: '', capacidadM3: 0, estado: 'activo', esPrincipal: false,
  };
  const [form, setForm] = useState(initial);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={almacen ? `Editar almacen ${almacen.codigo}` : 'Nuevo almacen'}
      footer={
        <>
          <SecondaryButton onClick={onClose}>Cancelar</SecondaryButton>
          <PrimaryButton disabled={saving || !form.codigo || !form.nombre} onClick={() => onGuardar(form)}>
            <Save className="h-4 w-4" /> Guardar
          </PrimaryButton>
        </>
      }
    >
      <div className="grid gap-3 md:grid-cols-2">
        <Field label="Codigo"><Input value={form.codigo} onChange={e => setForm(f => ({ ...f, codigo: e.target.value }))} /></Field>
        <Field label="Nombre"><Input value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} /></Field>
        <Field label="Tipo">
          <Select value={form.tipo} onChange={e => setForm(f => ({ ...f, tipo: e.target.value as Almacen['tipo'] }))}>
            {TIPOS_ALMACEN.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </Select>
        </Field>
        <Field label="Estado">
          <Select value={form.estado} onChange={e => setForm(f => ({ ...f, estado: e.target.value as Almacen['estado'] }))}>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </Select>
        </Field>
        <Field label="Direccion"><Input value={form.direccion} onChange={e => setForm(f => ({ ...f, direccion: e.target.value }))} /></Field>
        <Field label="Ciudad"><Input value={form.ciudad} onChange={e => setForm(f => ({ ...f, ciudad: e.target.value }))} /></Field>
        <Field label="Responsable"><Input value={form.responsable} onChange={e => setForm(f => ({ ...f, responsable: e.target.value }))} /></Field>
        <Field label="Capacidad (m3)"><Input type="number" value={form.capacidadM3} onChange={e => setForm(f => ({ ...f, capacidadM3: Number(e.target.value) || 0 }))} /></Field>
        <div className="flex items-center justify-between rounded-xl border border-slate-100 p-3 md:col-span-2">
          <span className="text-sm text-slate-600">Almacen principal</span>
          <Toggle checked={form.esPrincipal} onChange={v => setForm(f => ({ ...f, esPrincipal: v }))} />
        </div>
      </div>
    </Modal>
  );
}

function ZonaModal({ open, zona, almacenId, saving, onClose, onGuardar }: {
  open: boolean;
  zona: Zona | null;
  almacenId: string | null;
  saving: boolean;
  onClose: () => void;
  onGuardar: (data: Omit<Zona, 'id'> & { id?: string }) => Promise<void>;
}) {
  const initial: Omit<Zona, 'id'> & { id?: string } = zona ?? {
    almacenId: almacenId ?? '',
    codigo: '', nombre: '', tipo: 'picking', estado: 'activo',
  };
  const [form, setForm] = useState(initial);
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={zona ? `Editar zona ${zona.codigo}` : 'Nueva zona'}
      size="sm"
      footer={
        <>
          <SecondaryButton onClick={onClose}>Cancelar</SecondaryButton>
          <PrimaryButton disabled={saving || !form.codigo} onClick={() => onGuardar({ ...form, almacenId: form.almacenId || almacenId || '' })}>
            <Save className="h-4 w-4" /> Guardar
          </PrimaryButton>
        </>
      }
    >
      <div className="space-y-3">
        <Field label="Codigo"><Input value={form.codigo} onChange={e => setForm(f => ({ ...f, codigo: e.target.value }))} /></Field>
        <Field label="Nombre"><Input value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} /></Field>
        <Field label="Tipo">
          <Select value={form.tipo} onChange={e => setForm(f => ({ ...f, tipo: e.target.value as Zona['tipo'] }))}>
            {TIPOS_ZONA.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </Select>
        </Field>
        <Field label="Estado">
          <Select value={form.estado} onChange={e => setForm(f => ({ ...f, estado: e.target.value as Zona['estado'] }))}>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </Select>
        </Field>
      </div>
    </Modal>
  );
}

function RutaModal({ open, ruta, almacenes, saving, onClose, onGuardar }: {
  open: boolean;
  ruta: Ruta | null;
  almacenes: Almacen[];
  saving: boolean;
  onClose: () => void;
  onGuardar: (data: Omit<Ruta, 'id'> & { id?: string }) => Promise<void>;
}) {
  const initial: Omit<Ruta, 'id'> & { id?: string } = ruta ?? {
    codigo: '', nombre: '', origenAlmacenId: almacenes[0]?.id ?? '',
    destinoCiudad: '', diasEntrega: 1, estado: 'activo',
  };
  const [form, setForm] = useState(initial);
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={ruta ? `Editar ruta ${ruta.codigo}` : 'Nueva ruta'}
      footer={
        <>
          <SecondaryButton onClick={onClose}>Cancelar</SecondaryButton>
          <PrimaryButton disabled={saving || !form.codigo || !form.nombre} onClick={() => onGuardar(form)}>
            <Save className="h-4 w-4" /> Guardar
          </PrimaryButton>
        </>
      }
    >
      <div className="grid gap-3 md:grid-cols-2">
        <Field label="Codigo"><Input value={form.codigo} onChange={e => setForm(f => ({ ...f, codigo: e.target.value }))} /></Field>
        <Field label="Nombre"><Input value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} /></Field>
        <Field label="Origen (almacen)">
          <Select value={form.origenAlmacenId} onChange={e => setForm(f => ({ ...f, origenAlmacenId: e.target.value }))}>
            {almacenes.map(a => <option key={a.id} value={a.id}>{a.nombre}</option>)}
          </Select>
        </Field>
        <Field label="Destino (ciudad)"><Input value={form.destinoCiudad} onChange={e => setForm(f => ({ ...f, destinoCiudad: e.target.value }))} /></Field>
        <Field label="Dias entrega"><Input type="number" value={form.diasEntrega} onChange={e => setForm(f => ({ ...f, diasEntrega: Number(e.target.value) || 0 }))} /></Field>
        <Field label="Estado">
          <Select value={form.estado} onChange={e => setForm(f => ({ ...f, estado: e.target.value as Ruta['estado'] }))}>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </Select>
        </Field>
      </div>
    </Modal>
  );
}
