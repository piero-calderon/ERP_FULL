import { useState } from "react";
import { Phone, MapPin, Users, Mail, CheckSquare, Clock, CheckCircle2, XCircle, Filter } from "lucide-react";
import { useCRMStore } from "../../store/crm.store";
import type { ActivityType, ActivityStatus } from "../../types/crm.types";
import { cn } from "@/utils/utils";

const TYPE_CONFIG: Record<ActivityType, { label: string; Icon: typeof Phone; color: string; bg: string; darkBg: string }> = {
  llamada: { label: "Llamada", Icon: Phone,      color: "text-blue-600",   bg: "bg-blue-100",   darkBg: "dark:bg-blue-900/40" },
  visita:  { label: "Visita",  Icon: MapPin,      color: "text-emerald-600",bg: "bg-emerald-100",darkBg: "dark:bg-emerald-900/40" },
  reunion: { label: "Reunion", Icon: Users,       color: "text-violet-600", bg: "bg-violet-100", darkBg: "dark:bg-violet-900/40" },
  email:   { label: "Email",   Icon: Mail,        color: "text-amber-600",  bg: "bg-amber-100",  darkBg: "dark:bg-amber-900/40" },
  tarea:   { label: "Tarea",   Icon: CheckSquare, color: "text-slate-600",  bg: "bg-slate-100",  darkBg: "dark:bg-slate-700" },
};

const STATUS_CONFIG: Record<ActivityStatus, { label: string; color: string; bg: string; darkBg: string }> = {
  pendiente:  { label: "Pendiente",  color: "text-amber-700",  bg: "bg-amber-50",   darkBg: "dark:bg-amber-900/30" },
  completada: { label: "Completada", color: "text-emerald-700",bg: "bg-emerald-50", darkBg: "dark:bg-emerald-900/30" },
  cancelada:  { label: "Cancelada",  color: "text-rose-700",   bg: "bg-rose-50",    darkBg: "dark:bg-rose-900/30" },
};

function ActivityRow({ activity }: { activity: ReturnType<typeof useCRMStore.getState>["activities"][0] }) {
  const cfg = TYPE_CONFIG[activity.type];
  const statusCfg = STATUS_CONFIG[activity.status];
  const { Icon } = cfg;

  return (
    <div className={cn("flex items-start gap-4 p-4 rounded-2xl border transition-all hover:shadow-sm",
      "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600",
      activity.status === "completada" ? "opacity-80" : activity.status === "cancelada" ? "opacity-60" : ""
    )}>
      <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center shrink-0", cfg.bg, cfg.darkBg)}>
        <Icon className={cn("h-5 w-5", cfg.color)} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-bold text-slate-900 dark:text-white">{activity.title}</p>
          <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", statusCfg.bg, statusCfg.darkBg, statusCfg.color)}>
            {statusCfg.label}
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{activity.clientName}</p>
        {activity.result && <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 italic">"{activity.result}"</p>}
        {activity.nextSteps && <p className="text-xs text-blue-600 font-semibold mt-1">→ {activity.nextSteps}</p>}
      </div>
      <div className="text-right shrink-0 space-y-1">
        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">{activity.assignedTo.split(" ")[0]}</p>
        <p className="text-[10px] text-slate-400">{new Date(activity.date).toLocaleDateString("es-AR", { day: "2-digit", month: "short" })}</p>
        {activity.duration && (
          <p className="text-[10px] text-slate-400 flex items-center gap-0.5 justify-end">
            <Clock className="h-3 w-3" />{activity.duration} min
          </p>
        )}
        {activity.status === "pendiente" && <span className="block text-[10px] text-amber-600 font-bold animate-pulse">● Pendiente</span>}
      </div>
    </div>
  );
}

export function ActivitiesPanel() {
  const { activities } = useCRMStore();
  const [typeFilter, setTypeFilter] = useState<ActivityType | "">("");
  const [statusFilter, setStatusFilter] = useState<ActivityStatus | "">("");

  const filtered = activities
    .filter(a => (!typeFilter || a.type === typeFilter) && (!statusFilter || a.status === statusFilter))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const pendingCount   = activities.filter(a => a.status === "pendiente").length;
  const completedCount = activities.filter(a => a.status === "completada").length;
  const weeklyCount    = activities.filter(a => Math.abs(new Date().getTime() - new Date(a.date).getTime()) < 7 * 86400000).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-100 dark:border-amber-800 text-center">
          <p className="text-2xl font-extrabold text-amber-700">{pendingCount}</p>
          <p className="text-[10px] font-bold text-amber-500 uppercase mt-0.5">Pendientes</p>
        </div>
        <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-800 text-center">
          <p className="text-2xl font-extrabold text-emerald-700">{completedCount}</p>
          <p className="text-[10px] font-bold text-emerald-500 uppercase mt-0.5">Completadas</p>
        </div>
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800 text-center">
          <p className="text-2xl font-extrabold text-blue-700">{weeklyCount}</p>
          <p className="text-[10px] font-bold text-blue-500 uppercase mt-0.5">Esta Semana</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
        <Filter className="h-4 w-4 text-slate-400" />
        <div className="flex gap-1 flex-wrap">
          {(["", ...Object.keys(TYPE_CONFIG)] as (ActivityType | "")[]).map(t => (
            <button key={t} onClick={() => setTypeFilter(t)}
              className={cn("px-3 py-1 text-[10px] font-bold rounded-lg transition-all",
                typeFilter === t ? "bg-slate-900 dark:bg-white dark:text-slate-900 text-white" : "bg-white dark:bg-slate-700 text-slate-500 dark:text-slate-300 hover:text-slate-700 border border-slate-200 dark:border-slate-600")}>
              {t ? TYPE_CONFIG[t as ActivityType].label : "Todos"}
            </button>
          ))}
        </div>
        <div className="h-4 w-px bg-slate-200 dark:bg-slate-600" />
        <div className="flex gap-1">
          {(["", "pendiente", "completada", "cancelada"] as (ActivityStatus | "")[]).map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={cn("px-3 py-1 text-[10px] font-bold rounded-lg transition-all",
                statusFilter === s ? "bg-slate-900 dark:bg-white dark:text-slate-900 text-white" : "bg-white dark:bg-slate-700 text-slate-500 dark:text-slate-300 hover:text-slate-700 border border-slate-200 dark:border-slate-600")}>
              {s ? STATUS_CONFIG[s as ActivityStatus].label : "Todos"}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2 text-[10px] text-slate-400">
          <CheckCircle2 className="h-3 w-3 text-emerald-500" /> {completedCount} completadas
          <XCircle className="h-3 w-3 text-rose-400" /> {activities.filter(a => a.status === "cancelada").length} canceladas
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <CheckSquare className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p className="font-semibold">No hay actividades que coincidan con los filtros</p>
          </div>
        ) : filtered.map(a => <ActivityRow key={a.id} activity={a} />)}
      </div>
    </div>
  );
}
