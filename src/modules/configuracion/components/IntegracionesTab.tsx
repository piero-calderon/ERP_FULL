import { ArrowUpRight, BookOpen, FileCheck, Key, Landmark, Loader2, MapPin, Plug, RefreshCw, ShoppingBag, Webhook } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { ComponentType } from 'react';
import { ROUTES } from '@/constants/routes.constants';
import type { IntegracionResumen } from '../types/configuracion.types';
import {
  INTEGRACION_CATEGORIA_LABEL, INTEGRACION_ESTADO_CONFIG,
} from '../constants/configuracion.constants';
import {
  MiniKpi, PrimaryButton, SectionCard, SecondaryButton, StatusPill,
} from './ui';

interface Props {
  integraciones: IntegracionResumen[];
  onSincronizar: (id: string) => Promise<void>;
}

const ICONOS: Record<string, ComponentType<{ className?: string }>> = {
  Key, Webhook, BookOpen, FileCheck, Landmark, MapPin, ShoppingBag,
};

export function IntegracionesTab({ integraciones, onSincronizar }: Props) {
  const conectados = integraciones.filter(i => i.estado === 'conectado').length;
  const errores    = integraciones.filter(i => i.estado === 'error').length;
  const sync       = integraciones.filter(i => i.estado === 'sincronizando').length;
  const desc       = integraciones.filter(i => i.estado === 'desconectado').length;

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
        <div className="flex items-start gap-3">
          <Plug className="mt-0.5 h-5 w-5 text-blue-600" />
          <div className="flex-1">
            <p className="font-semibold">Resumen del modulo de Integraciones (13)</p>
            <p className="mt-1 text-xs">Vista visual de los conectores configurados. Para gestionarlos en profundidad accede al modulo dedicado.</p>
          </div>
          <Link to={ROUTES.INTEGRACIONES} className="hidden sm:block">
            <PrimaryButton><ArrowUpRight className="h-4 w-4" /> Ir a Integraciones</PrimaryButton>
          </Link>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <MiniKpi label="Conectados"     value={conectados} helper="Operativos"   tone="bg-emerald-50 text-emerald-700" />
        <MiniKpi label="Sincronizando"  value={sync}        helper="En proceso"   tone="bg-blue-50 text-blue-700" />
        <MiniKpi label="Con errores"    value={errores}     helper="Requieren atencion" tone="bg-red-50 text-red-700" />
        <MiniKpi label="Desconectados"  value={desc}        helper="Apagados"     tone="bg-slate-50 text-slate-600" />
      </div>

      <SectionCard title="Monitor visual de integraciones" description="Cada tarjeta refleja el ultimo estado conocido del conector.">
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {integraciones.map(i => {
            const cfg = INTEGRACION_ESTADO_CONFIG[i.estado];
            const Icon = ICONOS[i.icono] ?? Plug;
            const sincronizando = i.estado === 'sincronizando';
            return (
              <article key={i.id} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-3">
                    <div className="rounded-xl bg-slate-100 p-2 text-slate-600">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{i.nombre}</p>
                      <p className="text-xs text-slate-500">{INTEGRACION_CATEGORIA_LABEL[i.categoria]}</p>
                    </div>
                  </div>
                  <StatusPill tone={cfg.color} dot={cfg.dot} label={cfg.label} />
                </div>
                <p className="mt-3 text-xs text-slate-500">
                  Ultima actividad: {new Date(i.ultimaActividad).toLocaleString('es-ES')}
                </p>
                <div className="mt-3 flex justify-end gap-1">
                  <SecondaryButton onClick={() => onSincronizar(i.id)} disabled={sincronizando}>
                    {sincronizando ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                    {sincronizando ? 'Sincronizando' : 'Sincronizar'}
                  </SecondaryButton>
                </div>
              </article>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}
