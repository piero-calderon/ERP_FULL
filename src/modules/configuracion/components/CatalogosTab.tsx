import { useMemo, useState } from 'react';
import { ListTree, Plus, Save, Tag, Trash2 } from 'lucide-react';
import type { CatalogoItem, CatalogoTipo } from '../types/configuracion.types';
import { CATALOGO_LABELS } from '../constants/configuracion.constants';
import {
  Field, Input, PrimaryButton, SecondaryButton, DangerButton,
  SectionCard, Toggle, StatusPill, Modal, Textarea, EmptyHint,
} from './ui';

interface Props {
  catalogos: CatalogoItem[];
  saving: boolean;
  onGuardar: (data: Omit<CatalogoItem, 'id'> & { id?: string }) => Promise<void>;
  onEliminar: (id: string) => Promise<void>;
}

const TIPOS: CatalogoTipo[] = ['motivos_devolucion', 'motivos_merma', 'motivos_incidencia', 'canales', 'segmentos', 'etiquetas'];

export function CatalogosTab({ catalogos, saving, onGuardar, onEliminar }: Props) {
  const [tipoSel, setTipoSel] = useState<CatalogoTipo>('motivos_devolucion');
  const [modal, setModal] = useState<{ open: boolean; item: CatalogoItem | null }>({ open: false, item: null });

  const items = useMemo(() => catalogos.filter(c => c.tipo === tipoSel).sort((a, b) => a.orden - b.orden), [catalogos, tipoSel]);
  const meta = CATALOGO_LABELS[tipoSel];

  return (
    <div className="space-y-5">
      <SectionCard title="Catalogos auxiliares" description="Listas dinamicas reutilizables en todos los modulos del ERP.">
        <div className="flex flex-wrap gap-2">
          {TIPOS.map(t => {
            const sel = t === tipoSel;
            const m = CATALOGO_LABELS[t];
            const count = catalogos.filter(c => c.tipo === t).length;
            return (
              <button
                key={t}
                type="button"
                onClick={() => setTipoSel(t)}
                className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition ${
                  sel ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Tag className="h-4 w-4" />
                {m.label}
                <span className={`rounded-full px-1.5 py-0.5 text-xs ${sel ? 'bg-white/20' : 'bg-slate-100 text-slate-500'}`}>{count}</span>
              </button>
            );
          })}
        </div>
      </SectionCard>

      <SectionCard
        title={meta.label}
        description={meta.descripcion}
        action={
          <PrimaryButton onClick={() => setModal({ open: true, item: null })}>
            <Plus className="h-4 w-4" /> Nuevo item
          </PrimaryButton>
        }
      >
        {items.length === 0 ? (
          <EmptyHint icon={ListTree} title="Catalogo vacio" description="Crea items para tipificar operaciones." />
        ) : (
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {items.map(item => (
              <article key={item.id} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2">
                    <span className="h-4 w-4 mt-1 rounded-full" style={{ background: item.color }} />
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{item.nombre}</p>
                      <p className="text-xs text-slate-500">Codigo: {item.codigo}</p>
                    </div>
                  </div>
                  <StatusPill
                    tone={item.activo ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-500 border-slate-200'}
                    dot={item.activo ? 'bg-emerald-500' : 'bg-slate-400'}
                    label={item.activo ? 'Activo' : 'Inactivo'}
                  />
                </div>
                <p className="mt-2 text-xs text-slate-500">{item.descripcion || '—'}</p>
                <div className="mt-3 flex justify-end gap-1">
                  <SecondaryButton onClick={() => setModal({ open: true, item })}>Editar</SecondaryButton>
                  <DangerButton onClick={() => onEliminar(item.id)}><Trash2 className="h-4 w-4" /></DangerButton>
                </div>
              </article>
            ))}
          </div>
        )}
      </SectionCard>

      <CatalogoModal
        open={modal.open}
        item={modal.item}
        tipo={tipoSel}
        ordenInicial={items.length + 1}
        saving={saving}
        onClose={() => setModal({ open: false, item: null })}
        onGuardar={async d => { await onGuardar(d); setModal({ open: false, item: null }); }}
      />
    </div>
  );
}

function CatalogoModal({ open, item, tipo, ordenInicial, saving, onClose, onGuardar }: {
  open: boolean;
  item: CatalogoItem | null;
  tipo: CatalogoTipo;
  ordenInicial: number;
  saving: boolean;
  onClose: () => void;
  onGuardar: (d: Omit<CatalogoItem, 'id'> & { id?: string }) => Promise<void>;
}) {
  const initial: Omit<CatalogoItem, 'id'> & { id?: string } = item ?? {
    tipo, codigo: '', nombre: '', descripcion: '', color: '#3B82F6', activo: true, orden: ordenInicial,
  };
  const [form, setForm] = useState(initial);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={item ? `Editar item ${item.codigo}` : `Nuevo item de ${CATALOGO_LABELS[tipo].label}`}
      size="md"
      footer={
        <>
          <SecondaryButton onClick={onClose}>Cancelar</SecondaryButton>
          <PrimaryButton disabled={saving || !form.codigo || !form.nombre} onClick={() => onGuardar({ ...form, tipo })}>
            <Save className="h-4 w-4" /> Guardar
          </PrimaryButton>
        </>
      }
    >
      <div className="grid gap-3 md:grid-cols-2">
        <Field label="Codigo"><Input value={form.codigo} onChange={e => setForm(f => ({ ...f, codigo: e.target.value.toUpperCase() }))} /></Field>
        <Field label="Nombre"><Input value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} /></Field>
        <Field label="Orden"><Input type="number" value={form.orden} onChange={e => setForm(f => ({ ...f, orden: Number(e.target.value) || 0 }))} /></Field>
        <div>
          <p className="text-xs font-semibold text-slate-600">Color</p>
          <div className="mt-1 flex items-center gap-2">
            <input type="color" value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} className="h-10 w-12 cursor-pointer rounded-lg border border-slate-200 bg-white" />
            <Input value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} />
          </div>
        </div>
        <Field label="Descripcion" hint="Aparece como tooltip en operaciones."><Textarea value={form.descripcion} onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))} /></Field>
        <div className="md:col-span-2 flex items-center justify-between rounded-xl border border-slate-100 p-3">
          <span className="text-sm text-slate-600">Item activo</span>
          <Toggle checked={form.activo} onChange={v => setForm(f => ({ ...f, activo: v }))} />
        </div>
      </div>
    </Modal>
  );
}
