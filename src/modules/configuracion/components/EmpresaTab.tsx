import { useEffect, useRef, useState } from 'react';
import { Building2, ImagePlus, MapPin, Plus, Save, Star, Trash2, Upload, UserCircle2 } from 'lucide-react';
import type { Empresa, Sucursal } from '../types/configuracion.types';
import {
  Field, Input, PrimaryButton, SecondaryButton, DangerButton,
  SectionCard, Toggle, StatusPill, Modal, EmptyHint,
} from './ui';

interface Props {
  empresa: Empresa;
  saving: boolean;
  onGuardar: (next: Empresa) => Promise<void>;
  onGuardarSucursal: (sucursalId: string | null, datos: Partial<Sucursal>) => Promise<void>;
  onEliminarSucursal: (sucursalId: string) => Promise<void>;
}

const TIPOGRAFIAS = ['Inter', 'Roboto', 'Poppins', 'Source Sans Pro', 'Manrope'];

export function EmpresaTab({ empresa, saving, onGuardar, onGuardarSucursal, onEliminarSucursal }: Props) {
  const [form, setForm] = useState<Empresa>(empresa);
  const [modalSucursal, setModalSucursal] = useState<{ open: boolean; sucursal: Sucursal | null }>({ open: false, sucursal: null });
  const logoInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => { setForm(empresa); }, [empresa]);

  const updateFiscal = <K extends keyof Empresa['datosFiscales']>(k: K, v: Empresa['datosFiscales'][K]) =>
    setForm(f => ({ ...f, datosFiscales: { ...f.datosFiscales, [k]: v } }));

  const updateBranding = <K extends keyof Empresa['branding']>(k: K, v: Empresa['branding'][K]) =>
    setForm(f => ({ ...f, branding: { ...f.branding, [k]: v } }));

  function onLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updateBranding('logoBase64', String(reader.result));
    reader.readAsDataURL(file);
  }

  const dirty = JSON.stringify(form) !== JSON.stringify(empresa);

  return (
    <div className="space-y-5">
      {/* Datos fiscales */}
      <SectionCard
        title="Datos fiscales del tenant"
        description="Identificacion legal usada en documentos, facturas y notificaciones."
        action={
          <PrimaryButton disabled={!dirty || saving} onClick={() => onGuardar(form)}>
            <Save className="h-4 w-4" />
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </PrimaryButton>
        }
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Field label="Razon social">
            <Input value={form.datosFiscales.razonSocial} onChange={e => updateFiscal('razonSocial', e.target.value)} />
          </Field>
          <Field label="Nombre comercial">
            <Input value={form.datosFiscales.nombreComercial} onChange={e => updateFiscal('nombreComercial', e.target.value)} />
          </Field>
          <Field label="CIF / NIF">
            <Input value={form.datosFiscales.cif} onChange={e => updateFiscal('cif', e.target.value)} />
          </Field>
          <Field label="Direccion fiscal">
            <Input value={form.datosFiscales.direccion} onChange={e => updateFiscal('direccion', e.target.value)} />
          </Field>
          <Field label="Ciudad">
            <Input value={form.datosFiscales.ciudad} onChange={e => updateFiscal('ciudad', e.target.value)} />
          </Field>
          <Field label="Provincia">
            <Input value={form.datosFiscales.provincia} onChange={e => updateFiscal('provincia', e.target.value)} />
          </Field>
          <Field label="Codigo postal">
            <Input value={form.datosFiscales.cp} onChange={e => updateFiscal('cp', e.target.value)} />
          </Field>
          <Field label="Pais">
            <Input value={form.datosFiscales.pais} onChange={e => updateFiscal('pais', e.target.value)} />
          </Field>
          <Field label="Web corporativa">
            <Input value={form.datosFiscales.web} onChange={e => updateFiscal('web', e.target.value)} />
          </Field>
          <Field label="Email comercial">
            <Input type="email" value={form.datosFiscales.email} onChange={e => updateFiscal('email', e.target.value)} />
          </Field>
          <Field label="Telefono">
            <Input value={form.datosFiscales.telefono} onChange={e => updateFiscal('telefono', e.target.value)} />
          </Field>
          <Field label="Tenant ID" hint="Identificador inmutable del tenant (multi-tenant ready).">
            <Input value={form.tenantId} disabled className="bg-slate-50 text-slate-500" />
          </Field>
        </div>
      </SectionCard>

      {/* Branding */}
      <div className="grid gap-5 lg:grid-cols-3">
        <SectionCard
          title="Logo corporativo"
          description="Aparece en cabeceras, documentos y notificaciones."
        >
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-32 w-full items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50">
              {form.branding.logoBase64 ? (
                <img src={form.branding.logoBase64} alt="Logo" className="max-h-28 max-w-full object-contain" />
              ) : (
                <div className="flex flex-col items-center text-slate-400">
                  <ImagePlus className="h-8 w-8" />
                  <p className="mt-1 text-xs">Sin logo cargado</p>
                </div>
              )}
            </div>
            <div className="flex w-full gap-2">
              <SecondaryButton className="flex-1 justify-center" onClick={() => logoInputRef.current?.click()}>
                <Upload className="h-4 w-4" />
                {form.branding.logoBase64 ? 'Reemplazar logo' : 'Subir logo'}
              </SecondaryButton>
              {form.branding.logoBase64 && (
                <DangerButton onClick={() => updateBranding('logoBase64', null)}>
                  <Trash2 className="h-4 w-4" />
                </DangerButton>
              )}
            </div>
            <input ref={logoInputRef} type="file" accept="image/*" hidden onChange={onLogoChange} />
          </div>
        </SectionCard>

        <SectionCard title="Colores corporativos" description="Paleta usada en branding y exportaciones.">
          <div className="space-y-3">
            {([
              ['colorPrimario',   'Color primario'],
              ['colorSecundario', 'Color secundario'],
              ['colorAccento',    'Color acento'],
            ] as const).map(([key, label]) => (
              <div key={key} className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 p-3">
                <div>
                  <p className="text-xs font-semibold text-slate-600">{label}</p>
                  <p className="font-mono text-sm text-slate-500">{form.branding[key]}</p>
                </div>
                <input
                  type="color"
                  value={form.branding[key]}
                  onChange={e => updateBranding(key, e.target.value)}
                  className="h-10 w-12 cursor-pointer rounded-lg border border-slate-200 bg-white"
                />
              </div>
            ))}
            <Field label="Tipografia">
              <select
                value={form.branding.tipografia}
                onChange={e => updateBranding('tipografia', e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
              >
                {TIPOGRAFIAS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </Field>
          </div>
        </SectionCard>

        <SectionCard title="Preview en vivo" description="Asi se vera tu marca aplicada al ERP.">
          <div className="space-y-3">
            <div
              className="rounded-2xl border border-slate-100 p-4"
              style={{ background: `linear-gradient(135deg, ${form.branding.colorPrimario}15, ${form.branding.colorSecundario}10)` }}
            >
              {form.branding.logoBase64 ? (
                <img src={form.branding.logoBase64} alt="logo" className="mb-3 h-8 object-contain" />
              ) : (
                <div className="mb-3 text-lg font-bold" style={{ color: form.branding.colorPrimario, fontFamily: form.branding.tipografia }}>
                  {form.datosFiscales.nombreComercial}
                </div>
              )}
              <p className="text-xs text-slate-600">{form.datosFiscales.razonSocial}</p>
              <p className="mt-2 text-xs text-slate-500">{form.datosFiscales.direccion}, {form.datosFiscales.ciudad}</p>
              <div className="mt-3 flex gap-2">
                <span
                  className="rounded-full px-3 py-1 text-xs font-semibold text-white"
                  style={{ background: form.branding.colorPrimario }}
                >
                  Boton primario
                </span>
                <span
                  className="rounded-full px-3 py-1 text-xs font-semibold text-white"
                  style={{ background: form.branding.colorAccento }}
                >
                  Accion accento
                </span>
              </div>
            </div>
            <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-500">
              Ultima actualizacion: {new Date(empresa.actualizadoEn).toLocaleString('es-ES')}
            </div>
          </div>
        </SectionCard>
      </div>

      {/* Sucursales */}
      <SectionCard
        title="Sucursales"
        description="Direcciones y responsables operativos del tenant."
        action={
          <PrimaryButton onClick={() => setModalSucursal({ open: true, sucursal: null })}>
            <Plus className="h-4 w-4" /> Nueva sucursal
          </PrimaryButton>
        }
      >
        {empresa.sucursales.length === 0 ? (
          <EmptyHint
            icon={Building2}
            title="Sin sucursales registradas"
            description="Anade ubicaciones para tu operacion comercial."
            action={
              <PrimaryButton onClick={() => setModalSucursal({ open: true, sucursal: null })}>
                <Plus className="h-4 w-4" /> Crear sucursal
              </PrimaryButton>
            }
          />
        ) : (
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {empresa.sucursales.map(s => (
              <article key={s.id} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate text-sm font-semibold text-slate-900">{s.nombre}</h3>
                      {s.esPrincipal && <StatusPill tone="bg-amber-50 text-amber-700 border-amber-200" label="Principal" dot="bg-amber-500" />}
                    </div>
                    <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                      <MapPin className="h-3 w-3" /> {s.direccion}, {s.ciudad}, {s.pais}
                    </p>
                  </div>
                  <StatusPill
                    tone={s.activa ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-500 border-slate-200'}
                    label={s.activa ? 'Activa' : 'Inactiva'}
                    dot={s.activa ? 'bg-emerald-500' : 'bg-slate-400'}
                  />
                </div>
                <div className="mt-3 space-y-1 text-xs text-slate-500">
                  <p className="flex items-center gap-1"><UserCircle2 className="h-3 w-3" /> {s.responsable || 'Sin responsable'}</p>
                  <p>{s.email}</p>
                  <p>{s.telefono}</p>
                </div>
                <div className="mt-3 flex gap-2">
                  <SecondaryButton className="flex-1 justify-center" onClick={() => setModalSucursal({ open: true, sucursal: s })}>
                    Editar
                  </SecondaryButton>
                  <DangerButton onClick={() => onEliminarSucursal(s.id)}><Trash2 className="h-4 w-4" /></DangerButton>
                </div>
              </article>
            ))}
          </div>
        )}
      </SectionCard>

      <SucursalModal
        open={modalSucursal.open}
        sucursal={modalSucursal.sucursal}
        saving={saving}
        onClose={() => setModalSucursal({ open: false, sucursal: null })}
        onGuardar={async (id, data) => {
          await onGuardarSucursal(id, data);
          setModalSucursal({ open: false, sucursal: null });
        }}
      />
    </div>
  );
}

function SucursalModal({ open, sucursal, saving, onClose, onGuardar }: {
  open: boolean;
  sucursal: Sucursal | null;
  saving: boolean;
  onClose: () => void;
  onGuardar: (id: string | null, data: Partial<Sucursal>) => Promise<void>;
}) {
  const initial: Partial<Sucursal> = sucursal ?? {
    nombre: '', direccion: '', ciudad: '', pais: 'Espana',
    responsable: '', email: '', telefono: '', activa: true, esPrincipal: false,
  };
  const [form, setForm] = useState<Partial<Sucursal>>(initial);

  useEffect(() => { setForm(sucursal ?? initial); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [sucursal, open]);

  const upd = <K extends keyof Sucursal>(k: K, v: Sucursal[K]) => setForm(f => ({ ...f, [k]: v }));

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={sucursal ? `Editar sucursal: ${sucursal.nombre}` : 'Nueva sucursal'}
      size="md"
      footer={
        <>
          <SecondaryButton onClick={onClose}>Cancelar</SecondaryButton>
          <PrimaryButton disabled={saving || !form.nombre} onClick={() => onGuardar(sucursal?.id ?? null, form)}>
            <Save className="h-4 w-4" /> {sucursal ? 'Actualizar' : 'Crear'}
          </PrimaryButton>
        </>
      }
    >
      <div className="grid gap-3 md:grid-cols-2">
        <Field label="Nombre">
          <Input value={form.nombre ?? ''} onChange={e => upd('nombre', e.target.value)} />
        </Field>
        <Field label="Responsable">
          <Input value={form.responsable ?? ''} onChange={e => upd('responsable', e.target.value)} />
        </Field>
        <Field label="Direccion">
          <Input value={form.direccion ?? ''} onChange={e => upd('direccion', e.target.value)} />
        </Field>
        <Field label="Ciudad">
          <Input value={form.ciudad ?? ''} onChange={e => upd('ciudad', e.target.value)} />
        </Field>
        <Field label="Pais">
          <Input value={form.pais ?? ''} onChange={e => upd('pais', e.target.value)} />
        </Field>
        <Field label="Email">
          <Input type="email" value={form.email ?? ''} onChange={e => upd('email', e.target.value)} />
        </Field>
        <Field label="Telefono">
          <Input value={form.telefono ?? ''} onChange={e => upd('telefono', e.target.value)} />
        </Field>
        <div className="flex items-center justify-between rounded-xl border border-slate-100 p-3">
          <span className="text-sm text-slate-600 flex items-center gap-1"><Star className="h-4 w-4 text-amber-500" /> Sucursal principal</span>
          <Toggle checked={!!form.esPrincipal} onChange={v => upd('esPrincipal', v)} />
        </div>
        <div className="flex items-center justify-between rounded-xl border border-slate-100 p-3">
          <span className="text-sm text-slate-600">Activa</span>
          <Toggle checked={!!form.activa} onChange={v => upd('activa', v)} />
        </div>
      </div>
    </Modal>
  );
}
