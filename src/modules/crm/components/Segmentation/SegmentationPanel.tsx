import { Users, Mail, UserCheck, ListChecks, Tag, RefreshCw, Zap } from "lucide-react";
import { useCRMStore } from "../../store/crm.store";
import type { Segment } from "../../types/crm.types";
import { cn } from "@/utils/utils";

const COLOR_MAP: Record<string, { bg: string; darkBg: string; border: string; darkBorder: string; text: string; badge: string }> = {
  amber:   { bg: "bg-amber-50",   darkBg: "dark:bg-amber-900/20",   border: "border-amber-200",   darkBorder: "dark:border-amber-800",   text: "text-amber-800",   badge: "bg-amber-500" },
  blue:    { bg: "bg-blue-50",    darkBg: "dark:bg-blue-900/20",    border: "border-blue-200",    darkBorder: "dark:border-blue-800",    text: "text-blue-800",    badge: "bg-blue-500" },
  rose:    { bg: "bg-rose-50",    darkBg: "dark:bg-rose-900/20",    border: "border-rose-200",    darkBorder: "dark:border-rose-800",    text: "text-rose-800",    badge: "bg-rose-500" },
  emerald: { bg: "bg-emerald-50", darkBg: "dark:bg-emerald-900/20", border: "border-emerald-200", darkBorder: "dark:border-emerald-800", text: "text-emerald-800", badge: "bg-emerald-500" },
};

function SegmentCard({ segment }: { segment: Segment }) {
  const colors = COLOR_MAP[segment.color] ?? COLOR_MAP["blue"];
  const ACTIONS = [
    { label: "Email masivo",      Icon: Mail,       handler: () => alert(`Enviando email a ${segment.clientCount} clientes`) },
    { label: "Asignar comercial", Icon: UserCheck,  handler: () => alert(`Asignando comercial al segmento`) },
    { label: "Lista de visitas",  Icon: ListChecks, handler: () => alert(`Generando lista de visitas`) },
    { label: "Aplicar promo",     Icon: Tag,        handler: () => alert(`Aplicando promocion`) },
  ];

  return (
    <div className={cn("bg-white dark:bg-slate-800 rounded-2xl border transition-all hover:shadow-md", colors.border, colors.darkBorder)}>
      <div className={cn("p-5 rounded-t-2xl", colors.bg, colors.darkBg)}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <div className={cn("h-2.5 w-2.5 rounded-full shrink-0", colors.badge)} />
              <h4 className={cn("font-bold text-base", colors.text)}>{segment.name}</h4>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1.5">{segment.description}</p>
          </div>
          <div className="text-right shrink-0">
            <p className={cn("text-3xl font-extrabold", colors.text)}>{segment.clientCount}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase">clientes</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          {segment.conditions.map((c, i) => (
            <span key={i} className="text-[10px] font-semibold px-2.5 py-1 bg-white/60 dark:bg-slate-700/60 rounded-lg border border-white/80 dark:border-slate-600 text-slate-700 dark:text-slate-200">
              {c.label}
            </span>
          ))}
        </div>
      </div>
      <div className="p-4 grid grid-cols-2 gap-2">
        {ACTIONS.map(({ label, Icon, handler }) => (
          <button key={label} onClick={handler}
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 transition-all text-xs font-semibold text-slate-700 dark:text-slate-200">
            <Icon className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400 shrink-0" />
            {label}
          </button>
        ))}
      </div>
      <div className="px-5 pb-4">
        <p className="text-[10px] text-slate-400 flex items-center gap-1">
          <RefreshCw className="h-3 w-3" />
          Actualizado: {new Date(segment.lastUpdated).toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric" })}
        </p>
      </div>
    </div>
  );
}

export function SegmentationPanel() {
  const { segments } = useCRMStore();
  const totalSegmentedClients = segments.reduce((s, seg) => s + seg.clientCount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3 p-5 bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-900/20 dark:to-violet-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800">
        <Zap className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-indigo-900 dark:text-indigo-300">Segmentacion Dinamica</p>
          <p className="text-xs text-indigo-700 dark:text-indigo-400 mt-0.5">
            Los segmentos se recalculan automaticamente. Actualmente cubriendo{" "}
            <span className="font-black">{totalSegmentedClients}</span> registros de clientes en{" "}
            <span className="font-black">{segments.length}</span> segmentos activos.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {segments.map(s => {
          const colors = COLOR_MAP[s.color] ?? COLOR_MAP["blue"];
          return (
            <div key={s.id} className={cn("p-4 rounded-2xl border text-center", colors.bg, colors.darkBg, colors.border, colors.darkBorder)}>
              <p className={cn("text-2xl font-extrabold", colors.text)}>{s.clientCount}</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase mt-0.5 leading-tight">{s.name}</p>
            </div>
          );
        })}
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {segments.map(seg => <SegmentCard key={seg.id} segment={seg} />)}
      </div>

      <div className="p-5 bg-slate-900 rounded-2xl text-white">
        <div className="flex items-center gap-2 mb-3">
          <Users className="h-5 w-5 text-slate-400" />
          <h4 className="font-bold">Acciones Masivas Globales</h4>
        </div>
        <p className="text-sm text-slate-400 mb-4">Ejecutar una accion sobre todos los clientes activos ({totalSegmentedClients} registros).</p>
        <div className="flex flex-wrap gap-2">
          {["Newsletter mensual", "Encuesta de satisfaccion", "Campana reactivacion", "Actualizar tarifas 2026"].map(action => (
            <button key={action} onClick={() => alert(`Accion "${action}" programada`)}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition-colors border border-white/10">
              {action}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
