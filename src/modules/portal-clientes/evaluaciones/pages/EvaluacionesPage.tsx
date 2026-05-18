import { useEffect, useState } from 'react';
import { Star, TrendingUp, Users, ThumbsUp } from 'lucide-react';
import { useEvaluacionesStore } from '../store/evaluaciones.store';
import { ESTADO_EVAL_CONFIG, NPS_LABELS, NPS_COLOR } from '../constants/evaluaciones.constants';
import { PortalStatusBadge } from '../../components/PortalStatusBadge';
import { PortalEmptyState } from '../../components/PortalEmptyState';
import { PortalSkeletonCard } from '../../components/PortalSkeletonCard';
import type { EvaluacionPortal } from '../types/evaluaciones.types';

const TABS = [
  { key: 'pendientes',  label: 'Pendientes' },
  { key: 'respondidas', label: 'Respondidas' },
  { key: 'metricas',   label: 'Mis métricas' },
] as const;

function StarRating({ value, onChange, label }: { value: number | null; onChange?: (v: number) => void; label: string }) {
  const [hover, setHover] = useState(0);
  const stars = [1, 2, 3, 4, 5];
  const isReadonly = !onChange;

  return (
    <div>
      <p className="text-xs font-medium text-slate-500 mb-2">{label}</p>
      <div className="flex gap-1">
        {stars.map(s => (
          <button
            key={s}
            type="button"
            disabled={isReadonly}
            onClick={() => onChange?.(s)}
            onMouseEnter={() => !isReadonly && setHover(s)}
            onMouseLeave={() => !isReadonly && setHover(0)}
            className={`transition-transform ${!isReadonly ? 'hover:scale-110 cursor-pointer' : 'cursor-default'}`}
          >
            <Star className={`w-7 h-7 ${s <= (hover || value || 0) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
          </button>
        ))}
      </div>
    </div>
  );
}

function NPSSlider({ value, onChange }: { value: number | null; onChange?: (v: number) => void }) {
  const isReadonly = !onChange;
  const scores = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <div>
      <p className="text-xs font-medium text-slate-500 mb-2">NPS — ¿Recomendarías nuestro servicio? (0=Nunca, 10=Definitivamente)</p>
      <div className="flex gap-1 flex-wrap">
        {scores.map(s => (
          <button
            key={s}
            type="button"
            disabled={isReadonly}
            onClick={() => onChange?.(s)}
            className={`w-9 h-9 rounded-xl text-sm font-bold border-2 transition-all ${
              value === s
                ? 'border-blue-600 bg-blue-600 text-white scale-110'
                : isReadonly
                ? 'border-slate-100 bg-slate-50 text-slate-400 cursor-default'
                : 'border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-slate-600 cursor-pointer'
            }`}
          >
            {s}
          </button>
        ))}
      </div>
      {value !== null && (
        <p className={`text-xs font-medium mt-2 ${NPS_COLOR(value)}`}>{NPS_LABELS[value]}</p>
      )}
    </div>
  );
}

function EvaluacionForm({ evaluacion, onSubmit, loading }: {
  evaluacion: EvaluacionPortal;
  onSubmit: (nps: number, servicio: number, conductor: number | null, comentario: string) => void;
  loading: boolean;
}) {
  const [nps, setNps] = useState<number | null>(null);
  const [servicio, setServicio] = useState<number | null>(null);
  const [conductor, setConductor] = useState<number | null>(null);
  const [comentario, setComentario] = useState('');

  const puedeEnviar = nps !== null && servicio !== null;

  return (
    <div className="space-y-6">
      <NPSSlider value={nps} onChange={setNps} />
      <StarRating value={servicio} onChange={setServicio} label="Valoración del servicio" />
      {evaluacion.conductorNombre && (
        <StarRating value={conductor} onChange={setConductor} label={`Valoración del conductor — ${evaluacion.conductorNombre}`} />
      )}
      <div>
        <label className="block text-xs font-medium text-slate-500 mb-1.5">Comentario (opcional)</label>
        <textarea
          value={comentario}
          onChange={e => setComentario(e.target.value)}
          placeholder="Cuéntanos tu experiencia..."
          rows={3}
          className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>
      <button
        disabled={!puedeEnviar || loading}
        onClick={() => puedeEnviar && onSubmit(nps!, servicio!, conductor, comentario)}
        className="w-full py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
      >
        {loading ? 'Enviando...' : <><ThumbsUp className="w-4 h-4" /> Enviar evaluación</>}
      </button>
    </div>
  );
}

function PendientesTab() {
  const { evaluaciones, evaluacionSeleccionada, seleccionar, responder, loading } = useEvaluacionesStore();
  const pendientes = evaluaciones.filter(e => e.estado === 'pendiente');

  if (pendientes.length === 0) {
    return <PortalEmptyState icon={Star} title="Sin pendientes" description="No tienes evaluaciones pendientes. ¡Gracias por tu tiempo!" />;
  }

  if (evaluacionSeleccionada) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 p-6 max-w-lg">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-bold text-slate-900">Evaluar entrega</h3>
            <p className="text-sm text-slate-500">Pedido {evaluacionSeleccionada.pedidoNumero} · {new Date(evaluacionSeleccionada.fechaEntrega).toLocaleDateString('es-ES')}</p>
          </div>
          <button onClick={() => seleccionar(null)} className="text-xs text-slate-500 hover:text-slate-700">Cancelar</button>
        </div>
        <EvaluacionForm
          evaluacion={evaluacionSeleccionada}
          loading={loading}
          onSubmit={(nps, servicio, conductor, comentario) =>
            responder(evaluacionSeleccionada.id, nps, servicio, conductor, comentario)
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {pendientes.map(ev => (
        <div key={ev.id} className="bg-white rounded-2xl border border-amber-100 p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-800">Pedido {ev.pedidoNumero}</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Entregado el {new Date(ev.fechaEntrega).toLocaleDateString('es-ES')}
                {ev.conductorNombre && ` · Conductor: ${ev.conductorNombre}`}
              </p>
              <p className="text-xs text-amber-600 mt-1 font-medium">
                Expira el {new Date(ev.expiradaEn).toLocaleDateString('es-ES')}
              </p>
            </div>
            <button
              onClick={() => seleccionar(ev)}
              className="px-4 py-2 bg-amber-500 text-white text-sm font-semibold rounded-xl hover:bg-amber-600 transition-colors flex items-center gap-2"
            >
              <Star className="w-4 h-4" /> Evaluar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function RespondidasTab() {
  const { evaluaciones } = useEvaluacionesStore();
  const respondidas = evaluaciones.filter(e => e.estado === 'respondida');

  if (respondidas.length === 0) {
    return <PortalEmptyState icon={Star} title="Sin evaluaciones" description="Aún no has respondido ninguna evaluación." />;
  }

  return (
    <div className="space-y-3">
      {respondidas.map(ev => {
        const cfg = ESTADO_EVAL_CONFIG[ev.estado];
        return (
          <div key={ev.id} className="bg-white rounded-2xl border border-slate-100 p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-semibold text-slate-800">Pedido {ev.pedidoNumero}</p>
                <p className="text-xs text-slate-400">{new Date(ev.fechaEntrega).toLocaleDateString('es-ES')} · Respondida el {ev.respondidaEn ? new Date(ev.respondidaEn).toLocaleDateString('es-ES') : '-'}</p>
              </div>
              <PortalStatusBadge label={cfg.label} color={cfg.color} bg={cfg.bg} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              {ev.nps !== null && (
                <div className="bg-slate-50 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-slate-900">{ev.nps}</p>
                  <p className="text-xs text-slate-500">NPS</p>
                  <p className={`text-xs font-medium mt-0.5 ${NPS_COLOR(ev.nps)}`}>{NPS_LABELS[ev.nps]}</p>
                </div>
              )}
              {ev.servicioRating !== null && (
                <div className="bg-slate-50 rounded-xl p-3 text-center">
                  <div className="flex justify-center gap-0.5 mb-1">
                    {[1,2,3,4,5].map(s => <Star key={s} className={`w-3.5 h-3.5 ${s <= ev.servicioRating! ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />)}
                  </div>
                  <p className="text-xs text-slate-500">Servicio</p>
                </div>
              )}
              {ev.conductorRating !== null && (
                <div className="bg-slate-50 rounded-xl p-3 text-center">
                  <div className="flex justify-center gap-0.5 mb-1">
                    {[1,2,3,4,5].map(s => <Star key={s} className={`w-3.5 h-3.5 ${s <= ev.conductorRating! ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />)}
                  </div>
                  <p className="text-xs text-slate-500">Conductor</p>
                </div>
              )}
            </div>
            {ev.comentario && (
              <p className="text-xs text-slate-600 bg-slate-50 rounded-xl p-3 mt-3 italic">"{ev.comentario}"</p>
            )}
          </div>
        );
      })}
    </div>
  );
}

function MetricasTab() {
  const { metricas, evaluaciones, loading } = useEvaluacionesStore();

  if (loading) return <div className="grid grid-cols-2 gap-4">{Array.from({ length: 4 }).map((_, i) => <PortalSkeletonCard key={i} />)}</div>;
  if (!metricas || metricas.totalRespondidas === 0) {
    return <PortalEmptyState icon={TrendingUp} title="Sin datos" description="Responde evaluaciones para ver tus métricas personales." />;
  }

  const npsClass = metricas.npsScore >= 50 ? 'text-emerald-600' : metricas.npsScore >= 0 ? 'text-amber-600' : 'text-red-600';

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-100 p-5 text-center">
          <p className={`text-4xl font-bold ${npsClass}`}>{metricas.npsScore}</p>
          <p className="text-slate-500 text-sm mt-1">NPS Score</p>
          <p className="text-xs text-slate-400 mt-0.5">Satisfacción global</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-5 text-center">
          <div className="flex justify-center gap-0.5 mb-1">
            {[1,2,3,4,5].map(s => <Star key={s} className={`w-5 h-5 ${s <= Math.round(metricas.servicioPromedio) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />)}
          </div>
          <p className="text-2xl font-bold text-slate-900">{metricas.servicioPromedio}</p>
          <p className="text-slate-500 text-sm mt-0.5">Servicio</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-5 text-center">
          <div className="flex justify-center gap-0.5 mb-1">
            {[1,2,3,4,5].map(s => <Star key={s} className={`w-5 h-5 ${s <= Math.round(metricas.conductorPromedio) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />)}
          </div>
          <p className="text-2xl font-bold text-slate-900">{metricas.conductorPromedio}</p>
          <p className="text-slate-500 text-sm mt-0.5">Conductor</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-5 text-center">
          <p className="text-4xl font-bold text-slate-900">{metricas.totalRespondidas}</p>
          <p className="text-slate-500 text-sm mt-1">Respondidas</p>
          <p className="text-xs text-slate-400 mt-0.5">de {evaluaciones.length} totales</p>
        </div>
      </div>

      {/* NPS breakdown */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5">
        <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2"><Users className="w-4 h-4" /> Distribución NPS</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-emerald-50 rounded-xl p-4 text-center border border-emerald-100">
            <p className="text-2xl font-bold text-emerald-700">{metricas.npsPromoters}</p>
            <p className="text-sm font-medium text-emerald-600">Promotores</p>
            <p className="text-xs text-emerald-500 mt-0.5">Puntuación 9-10</p>
          </div>
          <div className="bg-amber-50 rounded-xl p-4 text-center border border-amber-100">
            <p className="text-2xl font-bold text-amber-700">{metricas.npsPassives}</p>
            <p className="text-sm font-medium text-amber-600">Pasivos</p>
            <p className="text-xs text-amber-500 mt-0.5">Puntuación 7-8</p>
          </div>
          <div className="bg-red-50 rounded-xl p-4 text-center border border-red-100">
            <p className="text-2xl font-bold text-red-700">{metricas.npsDetractors}</p>
            <p className="text-sm font-medium text-red-600">Detractores</p>
            <p className="text-xs text-red-500 mt-0.5">Puntuación 0-6</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EvaluacionesPage() {
  const { tabActiva, setTab, cargar } = useEvaluacionesStore();

  useEffect(() => { cargar(); }, [cargar]);

  const renderTab = () => {
    switch (tabActiva) {
      case 'pendientes':  return <PendientesTab />;
      case 'respondidas': return <RespondidasTab />;
      case 'metricas':    return <MetricasTab />;
    }
  };

  return (
    <div className="space-y-5 max-w-4xl">
      <div className="flex gap-1 bg-white border border-slate-200 rounded-xl p-1 w-fit">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${tabActiva === t.key ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>
            {t.label}
          </button>
        ))}
      </div>
      {renderTab()}
    </div>
  );
}
