import { useEffect, useRef, useState } from 'react';
import { Globe, ImagePlus, Monitor, Save, Smartphone, Trash2, Upload } from 'lucide-react';
import type { BrandingPortal } from '../types/configuracion.types';
import {
  Field, Input, PrimaryButton, SecondaryButton, DangerButton,
  SectionCard, Toggle, Textarea,
} from './ui';

interface Props {
  branding: BrandingPortal;
  saving: boolean;
  onGuardar: (data: BrandingPortal) => Promise<void>;
}

type DevicePreview = 'desktop' | 'mobile';

export function BrandingPortalTab({ branding, saving, onGuardar }: Props) {
  const [form, setForm] = useState<BrandingPortal>(branding);
  const [device, setDevice] = useState<DevicePreview>('desktop');
  const logoInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => { setForm(branding); }, [branding]);

  const upd = <K extends keyof BrandingPortal>(k: K, v: BrandingPortal[K]) => setForm(f => ({ ...f, [k]: v }));

  function onLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => upd('logoBase64', String(reader.result));
    reader.readAsDataURL(file);
  }

  const dirty = JSON.stringify(form) !== JSON.stringify(branding);

  return (
    <div className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-5">
          <SectionCard
            title="Identidad visual del portal"
            description="Aparece en login, dashboard y emails del portal cliente."
            action={
              <PrimaryButton disabled={!dirty || saving} onClick={() => onGuardar(form)}>
                <Save className="h-4 w-4" /> {saving ? 'Guardando...' : 'Guardar cambios'}
              </PrimaryButton>
            }
          >
            <div className="space-y-3">
              <div className="flex h-28 w-full items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50">
                {form.logoBase64 ? (
                  <img src={form.logoBase64} alt="Logo portal" className="max-h-24 object-contain" />
                ) : (
                  <div className="flex flex-col items-center text-slate-400">
                    <ImagePlus className="h-7 w-7" />
                    <p className="mt-1 text-xs">Sin logo cargado</p>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <SecondaryButton className="flex-1 justify-center" onClick={() => logoInputRef.current?.click()}>
                  <Upload className="h-4 w-4" /> {form.logoBase64 ? 'Reemplazar' : 'Subir logo'}
                </SecondaryButton>
                {form.logoBase64 && <DangerButton onClick={() => upd('logoBase64', null)}><Trash2 className="h-4 w-4" /></DangerButton>}
              </div>
              <input ref={logoInputRef} type="file" accept="image/*" hidden onChange={onLogoChange} />

              <div className="grid grid-cols-2 gap-2">
                {([
                  ['colorPrimario',   'Color primario'],
                  ['colorSecundario', 'Color secundario'],
                  ['colorFondo',      'Color de fondo'],
                  ['colorTexto',      'Color del texto'],
                ] as const).map(([key, label]) => (
                  <div key={key} className="rounded-xl border border-slate-100 p-2">
                    <p className="text-xs font-semibold text-slate-600">{label}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <input type="color" value={form[key]} onChange={e => upd(key, e.target.value)} className="h-8 w-10 cursor-pointer rounded-lg border border-slate-200" />
                      <p className="font-mono text-xs text-slate-500">{form[key]}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Dominio y emails" description="Personaliza el dominio del portal y los correos remitentes.">
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="Dominio personalizado" hint="Ej: portal.tucliente.com (simulado).">
                <Input value={form.dominioPersonalizado} onChange={e => upd('dominioPersonalizado', e.target.value)} />
              </Field>
              <Field label="Email remitente">
                <Input type="email" value={form.emailRemitente} onChange={e => upd('emailRemitente', e.target.value)} />
              </Field>
              <Field label="Titulo del portal">
                <Input value={form.tituloPortal} onChange={e => upd('tituloPortal', e.target.value)} />
              </Field>
              <Field label="Mensaje de bienvenida">
                <Input value={form.bienvenida} onChange={e => upd('bienvenida', e.target.value)} />
              </Field>
            </div>
          </SectionCard>

          <SectionCard title="Textos legales" description="Avisos visibles en el portal cliente.">
            <div className="grid gap-3">
              <Field label="Aviso legal"><Textarea value={form.textoLegal} onChange={e => upd('textoLegal', e.target.value)} /></Field>
              <Field label="URL politica de privacidad"><Input value={form.politicaPrivacidad} onChange={e => upd('politicaPrivacidad', e.target.value)} /></Field>
              <Field label="Aviso de cookies"><Textarea value={form.avisoCookies} onChange={e => upd('avisoCookies', e.target.value)} /></Field>
            </div>
          </SectionCard>

          <SectionCard title="Funcionalidades del portal" description="Habilita o restringe modulos del portal cliente.">
            <div className="space-y-2">
              <div className="flex items-center justify-between rounded-xl border border-slate-100 p-3">
                <div>
                  <p className="text-sm font-semibold text-slate-800">Chat de soporte</p>
                  <p className="text-xs text-slate-500">Habilita el widget de chat en todas las paginas.</p>
                </div>
                <Toggle checked={form.habilitarChatSoporte} onChange={v => upd('habilitarChatSoporte', v)} />
              </div>
              <div className="flex items-center justify-between rounded-xl border border-slate-100 p-3">
                <div>
                  <p className="text-sm font-semibold text-slate-800">Registro publico</p>
                  <p className="text-xs text-slate-500">Permite que nuevos clientes creen una cuenta sin invitacion.</p>
                </div>
                <Toggle checked={form.habilitarRegistroPublico} onChange={v => upd('habilitarRegistroPublico', v)} />
              </div>
            </div>
          </SectionCard>
        </div>

        <SectionCard
          title="Preview responsive"
          description="Comprueba como se vera el portal en tiempo real."
          action={
            <div className="flex rounded-xl border border-slate-200 bg-white p-1">
              <button
                type="button"
                onClick={() => setDevice('desktop')}
                className={`flex items-center gap-1 rounded-lg px-3 py-1 text-xs font-semibold transition ${device === 'desktop' ? 'bg-slate-900 text-white' : 'text-slate-600'}`}
              >
                <Monitor className="h-3 w-3" /> Desktop
              </button>
              <button
                type="button"
                onClick={() => setDevice('mobile')}
                className={`flex items-center gap-1 rounded-lg px-3 py-1 text-xs font-semibold transition ${device === 'mobile' ? 'bg-slate-900 text-white' : 'text-slate-600'}`}
              >
                <Smartphone className="h-3 w-3" /> Mobile
              </button>
            </div>
          }
        >
          <PortalPreview branding={form} device={device} />
          <div className="mt-3 rounded-xl bg-slate-50 p-3 text-xs text-slate-500">
            Ultima actualizacion: {new Date(branding.actualizadoEn).toLocaleString('es-ES')}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

function PortalPreview({ branding, device }: { branding: BrandingPortal; device: DevicePreview }) {
  const containerClass = device === 'desktop'
    ? 'w-full aspect-[16/9]'
    : 'mx-auto w-[280px] aspect-[9/16]';

  return (
    <div className={`rounded-2xl border border-slate-200 shadow-sm overflow-hidden ${containerClass}`} style={{ backgroundColor: branding.colorFondo, color: branding.colorTexto }}>
      <div className="flex items-center justify-between px-4 py-3 text-xs font-medium" style={{ background: branding.colorPrimario, color: '#fff' }}>
        <div className="flex items-center gap-2">
          {branding.logoBase64
            ? <img src={branding.logoBase64} alt="logo" className="h-5 object-contain" />
            : <Globe className="h-4 w-4" />
          }
          <span>{branding.tituloPortal || 'Portal'}</span>
        </div>
        <span className="opacity-80">{branding.dominioPersonalizado}</span>
      </div>
      <div className="flex h-full flex-col gap-3 px-4 py-4">
        <p className="text-sm font-bold">{branding.bienvenida || 'Bienvenido'}</p>
        <div className="grid gap-2" style={{ gridTemplateColumns: device === 'desktop' ? 'repeat(3, 1fr)' : '1fr' }}>
          {(['Pedidos', 'Facturas', 'Reclamos']).map(label => (
            <div key={label} className="rounded-xl p-3 text-xs font-semibold" style={{ background: `${branding.colorSecundario}1A`, color: branding.colorSecundario }}>
              {label}
            </div>
          ))}
        </div>
        <button
          type="button"
          className="mt-auto self-start rounded-full px-4 py-2 text-xs font-bold text-white shadow-sm"
          style={{ background: branding.colorPrimario }}
        >
          Acceder
        </button>
        <p className="text-[10px] opacity-70">{branding.avisoCookies}</p>
      </div>
    </div>
  );
}
