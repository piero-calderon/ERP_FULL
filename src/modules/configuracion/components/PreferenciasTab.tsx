import { useEffect, useState } from 'react';
import { BellRing, Globe2, MailCheck, Save } from 'lucide-react';
import type { Preferencias } from '../types/configuracion.types';
import {
  IDIOMAS, MONEDAS, ZONAS_HORARIAS, FORMATOS_FECHA, POLITICAS_REDONDEO,
} from '../constants/configuracion.constants';
import {
  Field, Input, PrimaryButton, SectionCard, Select, Toggle,
} from './ui';

interface Props {
  preferencias: Preferencias;
  saving: boolean;
  onGuardar: (data: Preferencias) => Promise<void>;
}

export function PreferenciasTab({ preferencias, saving, onGuardar }: Props) {
  const [form, setForm] = useState<Preferencias>(preferencias);

  useEffect(() => { setForm(preferencias); }, [preferencias]);

  const upd = <K extends keyof Preferencias>(k: K, v: Preferencias[K]) => setForm(f => ({ ...f, [k]: v }));

  const dirty = JSON.stringify(form) !== JSON.stringify(preferencias);

  const moneda = MONEDAS.find(m => m.value === form.monedaPrimaria);
  const previewNumero = formatPreview(1234567.89, form.formatoNumero, form.decimalesPrecio);
  const previewPrecio = form.monedaSimboloPosicion === 'prefijo'
    ? `${moneda?.simbolo ?? ''} ${previewNumero}`
    : `${previewNumero} ${moneda?.simbolo ?? ''}`;

  return (
    <div className="space-y-5">
      <SectionCard
        title="Localizacion"
        description="Idioma, zona horaria y formatos aplicados a todo el ERP."
        action={
          <PrimaryButton disabled={!dirty || saving} onClick={() => onGuardar(form)}>
            <Save className="h-4 w-4" /> {saving ? 'Guardando...' : 'Guardar cambios'}
          </PrimaryButton>
        }
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Field label="Idioma">
            <Select value={form.idioma} onChange={e => upd('idioma', e.target.value as Preferencias['idioma'])}>
              {IDIOMAS.map(i => <option key={i.value} value={i.value}>{i.label}</option>)}
            </Select>
          </Field>
          <Field label="Zona horaria">
            <Select value={form.zonaHoraria} onChange={e => upd('zonaHoraria', e.target.value)}>
              {ZONAS_HORARIAS.map(z => <option key={z} value={z}>{z}</option>)}
            </Select>
          </Field>
          <Field label="Formato de fecha">
            <Select value={form.formatoFecha} onChange={e => upd('formatoFecha', e.target.value)}>
              {FORMATOS_FECHA.map(f => <option key={f} value={f}>{f}</option>)}
            </Select>
          </Field>
          <Field label="Primer dia de semana">
            <Select value={form.primerDiaSemana} onChange={e => upd('primerDiaSemana', e.target.value as Preferencias['primerDiaSemana'])}>
              <option value="lunes">Lunes</option>
              <option value="domingo">Domingo</option>
            </Select>
          </Field>
          <Field label="Tema visual">
            <Select value={form.tema} onChange={e => upd('tema', e.target.value as Preferencias['tema'])}>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto (segun sistema)</option>
            </Select>
          </Field>
        </div>
      </SectionCard>

      <div className="grid gap-5 lg:grid-cols-2">
        <SectionCard title="Moneda y numeros" description="Configura cifras, redondeo y formato monetario.">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Moneda primaria">
              <Select value={form.monedaPrimaria} onChange={e => upd('monedaPrimaria', e.target.value)}>
                {MONEDAS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
              </Select>
            </Field>
            <Field label="Posicion del simbolo">
              <Select value={form.monedaSimboloPosicion} onChange={e => upd('monedaSimboloPosicion', e.target.value as Preferencias['monedaSimboloPosicion'])}>
                <option value="prefijo">Prefijo (€ 12,50)</option>
                <option value="sufijo">Sufijo (12,50 €)</option>
              </Select>
            </Field>
            <Field label="Formato de numero">
              <Select value={form.formatoNumero} onChange={e => upd('formatoNumero', e.target.value as Preferencias['formatoNumero'])}>
                <option value="1.234,56">1.234,56 (ES)</option>
                <option value="1,234.56">1,234.56 (EN)</option>
                <option value="1 234,56">1 234,56 (FR)</option>
              </Select>
            </Field>
            <Field label="Politica de redondeo">
              <Select value={form.politicaRedondeo} onChange={e => upd('politicaRedondeo', e.target.value as Preferencias['politicaRedondeo'])}>
                {POLITICAS_REDONDEO.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
              </Select>
            </Field>
            <Field label="Decimales en precios"><Input type="number" min={0} max={6} value={form.decimalesPrecio} onChange={e => upd('decimalesPrecio', Number(e.target.value) || 0)} /></Field>
            <Field label="Decimales en cantidades"><Input type="number" min={0} max={6} value={form.decimalesCantidad} onChange={e => upd('decimalesCantidad', Number(e.target.value) || 0)} /></Field>
          </div>
          <div className="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Preview</p>
            <p className="mt-1 font-mono">Precio: {previewPrecio}</p>
            <p className="font-mono">Cantidad: {formatPreview(125.5, form.formatoNumero, form.decimalesCantidad)}</p>
            <p className="font-mono">Redondeo: {POLITICAS_REDONDEO.find(p => p.value === form.politicaRedondeo)?.descripcion}</p>
          </div>
        </SectionCard>

        <SectionCard title="Notificaciones" description="Canales habilitados para el usuario.">
          <div className="space-y-3">
            {([
              ['notificacionesEmail', 'Email transaccional', MailCheck, 'Avisos por correo electronico.'],
              ['notificacionesPush',  'Notificaciones push',  BellRing,  'Alertas dentro del ERP en tiempo real.'],
              ['notificacionesSlack', 'Slack',                 Globe2,    'Mensajes a un canal de Slack del tenant.'],
            ] as const).map(([key, label, Icon, hint]) => (
              <div key={key} className="flex items-start justify-between gap-3 rounded-xl border border-slate-100 p-3">
                <div className="flex items-start gap-3">
                  <Icon className="mt-1 h-4 w-4 text-slate-500" />
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{label}</p>
                    <p className="text-xs text-slate-500">{hint}</p>
                  </div>
                </div>
                <Toggle checked={form[key] as boolean} onChange={v => upd(key, v as never)} />
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

function formatPreview(num: number, formato: Preferencias['formatoNumero'], decimales: number): string {
  const fixed = num.toFixed(decimales);
  const [int, dec] = fixed.split('.');
  const sep = (() => {
    switch (formato) {
      case '1.234,56': return { thousands: '.', decimal: ',' };
      case '1 234,56': return { thousands: ' ', decimal: ',' };
      default:         return { thousands: ',', decimal: '.' };
    }
  })();
  const intFmt = int.replace(/\B(?=(\d{3})+(?!\d))/g, sep.thousands);
  return dec ? `${intFmt}${sep.decimal}${dec}` : intFmt;
}
