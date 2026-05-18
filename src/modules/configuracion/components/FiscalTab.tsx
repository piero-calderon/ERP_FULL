import { useState } from 'react';
import { CalendarClock, FileText, Percent, Plus, ReceiptText, Save, ShieldCheck, Star, Trash2 } from 'lucide-react';
import type { ConfiguracionFiscal } from '../types/configuracion.types';
import { TIPOS_SERIE } from '../constants/configuracion.constants';
import {
  Field, Input, PrimaryButton, SecondaryButton, DangerButton,
  SectionCard, Toggle, StatusPill, Modal, Select, MiniKpi,
} from './ui';

type Tasa = ConfiguracionFiscal['tasas'][number];
type Regimen = ConfiguracionFiscal['regimenes'][number];
type Serie = ConfiguracionFiscal['series'][number];

interface Props {
  fiscal: ConfiguracionFiscal;
  saving: boolean;
  onGuardarTasa: (data: Omit<Tasa, 'id'> & { id?: string }) => Promise<void>;
  onEliminarTasa: (id: string) => Promise<void>;
  onGuardarRegimen: (data: Omit<Regimen, 'id'> & { id?: string }) => Promise<void>;
  onEliminarRegimen: (id: string) => Promise<void>;
  onGuardarSerie: (data: Omit<Serie, 'id'> & { id?: string }) => Promise<void>;
  onEliminarSerie: (id: string) => Promise<void>;
  onSetEjercicioActivo: (id: string) => Promise<void>;
}

export function FiscalTab({
  fiscal, saving,
  onGuardarTasa, onEliminarTasa, onGuardarRegimen, onEliminarRegimen,
  onGuardarSerie, onEliminarSerie, onSetEjercicioActivo,
}: Props) {
  const [modalTasa, setModalTasa] = useState<{ open: boolean; tasa: Tasa | null }>({ open: false, tasa: null });
  const [modalReg, setModalReg]   = useState<{ open: boolean; reg: Regimen | null }>({ open: false, reg: null });
  const [modalSer, setModalSer]   = useState<{ open: boolean; ser: Serie | null }>({ open: false, ser: null });

  const ejercicioActivo = fiscal.ejercicios.find(e => e.id === fiscal.ejercicioActivoId);
  const tasaPredeterminada = fiscal.tasas.find(t => t.predeterminada);

  return (
    <div className="space-y-5">
      <div className="grid gap-3 md:grid-cols-4">
        <MiniKpi label="Ejercicio activo"      value={ejercicioActivo?.anyo ?? '—'} helper={ejercicioActivo?.estado ?? 'No definido'} tone="bg-emerald-50 text-emerald-700" />
        <MiniKpi label="IVA predeterminado"    value={`${tasaPredeterminada?.porcentaje ?? 0}%`} helper={tasaPredeterminada?.nombre ?? '—'} tone="bg-blue-50 text-blue-700" />
        <MiniKpi label="Series documentales"   value={fiscal.series.filter(s => s.activa).length} helper={`${fiscal.series.length} totales`} tone="bg-violet-50 text-violet-700" />
        <MiniKpi label="Regimenes fiscales"    value={fiscal.regimenes.filter(r => r.activo).length} helper={`${fiscal.regimenes.length} totales`} tone="bg-amber-50 text-amber-700" />
      </div>

      {/* Tasas IVA */}
      <SectionCard
        title="Tasas de IVA"
        description="Tasas aplicables en operaciones fiscales y notas de credito."
        action={<PrimaryButton onClick={() => setModalTasa({ open: true, tasa: null })}><Plus className="h-4 w-4" /> Nueva tasa</PrimaryButton>}
      >
        <div className="overflow-hidden rounded-xl border border-slate-100">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-3 py-2">Nombre</th>
                <th className="px-3 py-2">%</th>
                <th className="px-3 py-2">Predeterminada</th>
                <th className="px-3 py-2">Estado</th>
                <th className="px-3 py-2 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {fiscal.tasas.map(t => (
                <tr key={t.id} className="border-t border-slate-100">
                  <td className="px-3 py-2 font-medium text-slate-800 flex items-center gap-2">
                    <Percent className="h-3 w-3 text-slate-400" />{t.nombre}
                  </td>
                  <td className="px-3 py-2 text-slate-700">{t.porcentaje}%</td>
                  <td className="px-3 py-2">
                    {t.predeterminada ? <StatusPill tone="bg-amber-50 text-amber-700 border-amber-200" dot="bg-amber-500" label="Predeterminada" /> : '—'}
                  </td>
                  <td className="px-3 py-2">
                    <StatusPill
                      tone={t.activa ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-500 border-slate-200'}
                      dot={t.activa ? 'bg-emerald-500' : 'bg-slate-400'}
                      label={t.activa ? 'Activa' : 'Inactiva'}
                    />
                  </td>
                  <td className="px-3 py-2 text-right">
                    <div className="flex justify-end gap-1">
                      <SecondaryButton onClick={() => setModalTasa({ open: true, tasa: t })}>Editar</SecondaryButton>
                      <DangerButton onClick={() => onEliminarTasa(t.id)}><Trash2 className="h-4 w-4" /></DangerButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Regimenes fiscales */}
      <SectionCard
        title="Regimenes fiscales"
        description="Marca clientes/proveedores con regimen especial (recargo, simplificado...)."
        action={<PrimaryButton onClick={() => setModalReg({ open: true, reg: null })}><Plus className="h-4 w-4" /> Nuevo regimen</PrimaryButton>}
      >
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {fiscal.regimenes.map(r => (
            <article key={r.id} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{r.nombre}</p>
                  <p className="text-xs text-slate-500">Codigo: {r.codigo}</p>
                </div>
                <StatusPill
                  tone={r.activo ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-500 border-slate-200'}
                  dot={r.activo ? 'bg-emerald-500' : 'bg-slate-400'}
                  label={r.activo ? 'Activo' : 'Inactivo'}
                />
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                <ShieldCheck className="h-3 w-3" />
                {r.recargoEquivalencia ? 'Aplica recargo de equivalencia' : 'Sin recargo de equivalencia'}
              </div>
              <div className="mt-3 flex justify-end gap-1">
                <SecondaryButton onClick={() => setModalReg({ open: true, reg: r })}>Editar</SecondaryButton>
                <DangerButton onClick={() => onEliminarRegimen(r.id)}><Trash2 className="h-4 w-4" /></DangerButton>
              </div>
            </article>
          ))}
        </div>
      </SectionCard>

      {/* Series documentales */}
      <SectionCard
        title="Series documentales y numeradores"
        description="Configura series y numeradores para facturas, albaranes, pedidos."
        action={<PrimaryButton onClick={() => setModalSer({ open: true, ser: null })}><Plus className="h-4 w-4" /> Nueva serie</PrimaryButton>}
      >
        <div className="overflow-hidden rounded-xl border border-slate-100">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-3 py-2">Tipo</th>
                <th className="px-3 py-2">Serie</th>
                <th className="px-3 py-2">Prefijo</th>
                <th className="px-3 py-2">Proximo numero</th>
                <th className="px-3 py-2">Ejercicio</th>
                <th className="px-3 py-2">Estado</th>
                <th className="px-3 py-2 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {fiscal.series.map(s => {
                const proximo = `${s.prefijo}-${s.serie}-${String(s.ultimoNumero + 1).padStart(s.longitudNumero, '0')}/${s.ejercicio}`;
                return (
                  <tr key={s.id} className="border-t border-slate-100">
                    <td className="px-3 py-2 capitalize text-slate-700">{s.tipo.replace('_', ' ')}</td>
                    <td className="px-3 py-2 font-semibold text-slate-800">{s.serie}</td>
                    <td className="px-3 py-2 text-slate-700">{s.prefijo}</td>
                    <td className="px-3 py-2 font-mono text-xs text-slate-700">{proximo}</td>
                    <td className="px-3 py-2">{s.ejercicio}</td>
                    <td className="px-3 py-2">
                      <StatusPill
                        tone={s.activa ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-500 border-slate-200'}
                        dot={s.activa ? 'bg-emerald-500' : 'bg-slate-400'}
                        label={s.activa ? 'Activa' : 'Inactiva'}
                      />
                    </td>
                    <td className="px-3 py-2 text-right">
                      <div className="flex justify-end gap-1">
                        <SecondaryButton onClick={() => setModalSer({ open: true, ser: s })}>Editar</SecondaryButton>
                        <DangerButton onClick={() => onEliminarSerie(s.id)}><Trash2 className="h-4 w-4" /></DangerButton>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Ejercicios fiscales */}
      <SectionCard
        title="Ejercicios fiscales"
        description="Solo un ejercicio puede estar abierto a la vez. Al activarlo, el anterior se cierra."
      >
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {fiscal.ejercicios.map(e => {
            const activo = e.id === fiscal.ejercicioActivoId;
            const colorEstado = e.estado === 'abierto' ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : e.estado === 'cerrado' ? 'bg-slate-50 text-slate-600 border-slate-200'
              : 'bg-amber-50 text-amber-700 border-amber-200';
            return (
              <article key={e.id} className={`rounded-2xl border p-4 shadow-sm transition ${activo ? 'border-amber-300 bg-amber-50/40' : 'border-slate-100 bg-white'}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <CalendarClock className="h-5 w-5 text-slate-400" />
                    <p className="text-lg font-bold text-slate-900">{e.anyo}</p>
                  </div>
                  {activo && <StatusPill tone="bg-amber-50 text-amber-700 border-amber-200" dot="bg-amber-500" label="Activo" />}
                </div>
                <StatusPill tone={colorEstado} label={e.estado} dot={e.estado === 'abierto' ? 'bg-emerald-500' : e.estado === 'cerrado' ? 'bg-slate-400' : 'bg-amber-500'} />
                <p className="mt-3 text-xs text-slate-500">Apertura: {e.fechaApertura}</p>
                <p className="text-xs text-slate-500">Cierre: {e.fechaCierre ?? '—'}</p>
                <PrimaryButton
                  disabled={activo || saving}
                  className="mt-3 w-full justify-center"
                  onClick={() => onSetEjercicioActivo(e.id)}
                >
                  <Star className="h-4 w-4" /> {activo ? 'En curso' : 'Marcar como activo'}
                </PrimaryButton>
              </article>
            );
          })}
        </div>
      </SectionCard>

      <TasaModal open={modalTasa.open} tasa={modalTasa.tasa} saving={saving}
        onClose={() => setModalTasa({ open: false, tasa: null })}
        onGuardar={async d => { await onGuardarTasa(d); setModalTasa({ open: false, tasa: null }); }} />

      <RegimenModal open={modalReg.open} reg={modalReg.reg} saving={saving}
        onClose={() => setModalReg({ open: false, reg: null })}
        onGuardar={async d => { await onGuardarRegimen(d); setModalReg({ open: false, reg: null }); }} />

      <SerieModal open={modalSer.open} ser={modalSer.ser} ejercicioActivo={ejercicioActivo?.anyo} saving={saving}
        onClose={() => setModalSer({ open: false, ser: null })}
        onGuardar={async d => { await onGuardarSerie(d); setModalSer({ open: false, ser: null }); }} />
    </div>
  );
}

function TasaModal({ open, tasa, saving, onClose, onGuardar }: {
  open: boolean;
  tasa: Tasa | null;
  saving: boolean;
  onClose: () => void;
  onGuardar: (d: Omit<Tasa, 'id'> & { id?: string }) => Promise<void>;
}) {
  const initial: Omit<Tasa, 'id'> & { id?: string } = tasa ?? { nombre: '', porcentaje: 21, predeterminada: false, activa: true };
  const [form, setForm] = useState(initial);
  return (
    <Modal open={open} onClose={onClose} title={tasa ? `Editar tasa ${tasa.nombre}` : 'Nueva tasa de IVA'} size="sm" footer={
      <>
        <SecondaryButton onClick={onClose}>Cancelar</SecondaryButton>
        <PrimaryButton disabled={saving || !form.nombre} onClick={() => onGuardar(form)}><Save className="h-4 w-4" /> Guardar</PrimaryButton>
      </>
    }>
      <div className="space-y-3">
        <Field label="Nombre"><Input value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} /></Field>
        <Field label="Porcentaje (%)"><Input type="number" step="0.01" value={form.porcentaje} onChange={e => setForm(f => ({ ...f, porcentaje: Number(e.target.value) || 0 }))} /></Field>
        <div className="flex items-center justify-between rounded-xl border border-slate-100 p-3">
          <span className="text-sm text-slate-600">Marcar como predeterminada</span>
          <Toggle checked={form.predeterminada} onChange={v => setForm(f => ({ ...f, predeterminada: v }))} />
        </div>
        <div className="flex items-center justify-between rounded-xl border border-slate-100 p-3">
          <span className="text-sm text-slate-600">Activa</span>
          <Toggle checked={form.activa} onChange={v => setForm(f => ({ ...f, activa: v }))} />
        </div>
      </div>
    </Modal>
  );
}

function RegimenModal({ open, reg, saving, onClose, onGuardar }: {
  open: boolean;
  reg: Regimen | null;
  saving: boolean;
  onClose: () => void;
  onGuardar: (d: Omit<Regimen, 'id'> & { id?: string }) => Promise<void>;
}) {
  const initial: Omit<Regimen, 'id'> & { id?: string } = reg ?? { codigo: '', nombre: '', recargoEquivalencia: false, activo: true };
  const [form, setForm] = useState(initial);
  return (
    <Modal open={open} onClose={onClose} title={reg ? `Editar regimen ${reg.codigo}` : 'Nuevo regimen'} size="sm" footer={
      <>
        <SecondaryButton onClick={onClose}>Cancelar</SecondaryButton>
        <PrimaryButton disabled={saving || !form.codigo || !form.nombre} onClick={() => onGuardar(form)}><Save className="h-4 w-4" /> Guardar</PrimaryButton>
      </>
    }>
      <div className="space-y-3">
        <Field label="Codigo"><Input value={form.codigo} onChange={e => setForm(f => ({ ...f, codigo: e.target.value }))} /></Field>
        <Field label="Nombre"><Input value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} /></Field>
        <div className="flex items-center justify-between rounded-xl border border-slate-100 p-3">
          <span className="text-sm text-slate-600">Aplica recargo de equivalencia</span>
          <Toggle checked={form.recargoEquivalencia} onChange={v => setForm(f => ({ ...f, recargoEquivalencia: v }))} />
        </div>
        <div className="flex items-center justify-between rounded-xl border border-slate-100 p-3">
          <span className="text-sm text-slate-600">Activo</span>
          <Toggle checked={form.activo} onChange={v => setForm(f => ({ ...f, activo: v }))} />
        </div>
      </div>
    </Modal>
  );
}

function SerieModal({ open, ser, ejercicioActivo, saving, onClose, onGuardar }: {
  open: boolean;
  ser: Serie | null;
  ejercicioActivo?: number;
  saving: boolean;
  onClose: () => void;
  onGuardar: (d: Omit<Serie, 'id'> & { id?: string }) => Promise<void>;
}) {
  const initial: Omit<Serie, 'id'> & { id?: string } = ser ?? {
    tipo: 'factura', serie: 'A', prefijo: 'FA', ultimoNumero: 0,
    longitudNumero: 6, ejercicio: ejercicioActivo ?? new Date().getFullYear(), activa: true,
  };
  const [form, setForm] = useState(initial);
  return (
    <Modal open={open} onClose={onClose} title={ser ? `Editar serie ${ser.serie}` : 'Nueva serie documental'} footer={
      <>
        <SecondaryButton onClick={onClose}>Cancelar</SecondaryButton>
        <PrimaryButton disabled={saving || !form.serie || !form.prefijo} onClick={() => onGuardar(form)}>
          <FileText className="h-4 w-4" /> Guardar
        </PrimaryButton>
      </>
    }>
      <div className="grid gap-3 md:grid-cols-2">
        <Field label="Tipo de documento">
          <Select value={form.tipo} onChange={e => setForm(f => ({ ...f, tipo: e.target.value as Serie['tipo'] }))}>
            {TIPOS_SERIE.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </Select>
        </Field>
        <Field label="Ejercicio">
          <Input type="number" value={form.ejercicio} onChange={e => setForm(f => ({ ...f, ejercicio: Number(e.target.value) || form.ejercicio }))} />
        </Field>
        <Field label="Serie (A, B, ...)"><Input value={form.serie} onChange={e => setForm(f => ({ ...f, serie: e.target.value.toUpperCase() }))} /></Field>
        <Field label="Prefijo"><Input value={form.prefijo} onChange={e => setForm(f => ({ ...f, prefijo: e.target.value.toUpperCase() }))} /></Field>
        <Field label="Ultimo numero emitido"><Input type="number" value={form.ultimoNumero} onChange={e => setForm(f => ({ ...f, ultimoNumero: Number(e.target.value) || 0 }))} /></Field>
        <Field label="Longitud (relleno con ceros)"><Input type="number" min={3} max={10} value={form.longitudNumero} onChange={e => setForm(f => ({ ...f, longitudNumero: Number(e.target.value) || 6 }))} /></Field>
        <div className="md:col-span-2 flex items-center justify-between rounded-xl border border-slate-100 p-3">
          <span className="text-sm text-slate-600 flex items-center gap-2"><ReceiptText className="h-4 w-4 text-slate-400" /> Serie activa</span>
          <Toggle checked={form.activa} onChange={v => setForm(f => ({ ...f, activa: v }))} />
        </div>
      </div>
    </Modal>
  );
}
