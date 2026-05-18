import { useEffect, useState } from "react";
import { TrendingUp, Activity, ShieldCheck, Tag, Clock, Users, RefreshCw } from "lucide-react";
import { useCRMStore } from "../store/crm.store";
import { PipelineBoard } from "../components/Pipeline/PipelineBoard";
import { ActivitiesPanel } from "../components/Activities/ActivitiesPanel";
import { EvaluationPanel } from "../components/Evaluation/EvaluationPanel";
import { TariffsPanel } from "../components/Tariffs/TariffsPanel";
import { History360Panel } from "../components/History360/History360Panel";
import { SegmentationPanel } from "../components/Segmentation/SegmentationPanel";
import { formatCurrency } from "@/utils/currency";
import { cn } from "@/utils/utils";

type CRMTab = "pipeline" | "actividades" | "evaluacion" | "tarifarios" | "historial" | "segmentacion";

const TABS: { id: CRMTab; label: string; Icon: typeof TrendingUp }[] = [
  { id: "pipeline",     label: "Pipeline",      Icon: TrendingUp  },
  { id: "actividades",  label: "Actividades",   Icon: Activity    },
  { id: "evaluacion",   label: "Evaluacion",    Icon: ShieldCheck },
  { id: "tarifarios",   label: "Tarifarios",    Icon: Tag         },
  { id: "historial",    label: "Historial 360", Icon: Clock       },
  { id: "segmentacion", label: "Segmentacion",  Icon: Users       },
];

export default function CRMPage() {
  const { stats, isLoading, fetchCRM, evaluations, activities } = useCRMStore();
  const [activeTab, setActiveTab] = useState<CRMTab>("pipeline");

  useEffect(() => { fetchCRM(); }, [fetchCRM]);

  const pendingEvals      = evaluations.filter(e => e.status === "pendiente").length;
  const pendingActivities = activities.filter(a => a.status === "pendiente").length;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">CRM Comercial</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Ciclo completo: captacion, pipeline, evaluacion, tarifarios y fidelizacion.</p>
        </div>
        <button onClick={() => fetchCRM()} disabled={isLoading}
          className="flex items-center gap-2 p-2.5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 transition-all shadow-sm self-start">
          <RefreshCw className={cn("h-5 w-5", isLoading && "animate-spin")} />
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all group cursor-pointer"
          onClick={() => setActiveTab("pipeline")}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Pipeline Total</p>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{formatCurrency(stats.pipelineValue, "ARS", "es-AR")}</p>
              <p className="text-xs text-slate-400 mt-0.5">{stats.totalOpportunities} oportunidades</p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all group cursor-pointer"
          onClick={() => setActiveTab("pipeline")}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Tasa de Exito</p>
              <p className="text-2xl font-extrabold text-emerald-600 mt-1">{stats.winRate}%</p>
              <p className="text-xs text-slate-400 mt-0.5">Oportunidades ganadas</p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-200 group-hover:scale-110 transition-transform">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className={cn("bg-white dark:bg-slate-800 border rounded-3xl p-5 shadow-sm hover:shadow-md transition-all group cursor-pointer",
          pendingActivities > 0 ? "border-amber-200 dark:border-amber-700" : "border-slate-100 dark:border-slate-700")}
          onClick={() => setActiveTab("actividades")}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Actividades</p>
              <p className="text-2xl font-extrabold text-amber-600 mt-1">{stats.activitiesThisWeek}</p>
              <p className="text-xs text-slate-400 mt-0.5">
                {pendingActivities > 0
                  ? <span className="text-amber-600 font-bold">{pendingActivities} pendientes</span>
                  : "Esta semana"}
              </p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-200 group-hover:scale-110 transition-transform">
              <Activity className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className={cn("bg-white dark:bg-slate-800 border rounded-3xl p-5 shadow-sm hover:shadow-md transition-all group cursor-pointer",
          pendingEvals > 0 ? "border-rose-200 dark:border-rose-700" : "border-slate-100 dark:border-slate-700")}
          onClick={() => setActiveTab("evaluacion")}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Evaluaciones</p>
              <p className={cn("text-2xl font-extrabold mt-1", pendingEvals > 0 ? "text-rose-600" : "text-slate-900 dark:text-white")}>
                {pendingEvals > 0 ? pendingEvals : "✓"}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                {pendingEvals > 0
                  ? <span className="text-rose-600 font-bold">Pendientes de aprobacion</span>
                  : "Al dia"}
              </p>
            </div>
            <div className={cn("h-12 w-12 rounded-2xl text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform",
              pendingEvals > 0 ? "bg-rose-600 shadow-rose-200" : "bg-slate-600 shadow-slate-200")}>
              <ShieldCheck className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-1.5 shadow-sm">
        <div className="flex overflow-x-auto gap-1 pb-0.5">
          {TABS.map(tab => {
            const { Icon } = tab;
            const hasBadge =
              (tab.id === "actividades" && pendingActivities > 0) ||
              (tab.id === "evaluacion" && pendingEvals > 0);
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all relative",
                  activeTab === tab.id
                    ? "bg-slate-900 dark:bg-white dark:text-slate-900 text-white shadow-sm"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
                )}>
                <Icon className="h-4 w-4" />
                {tab.label}
                {hasBadge && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                    {tab.id === "actividades" ? pendingActivities : pendingEvals}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300" key={activeTab}>
        {activeTab === "pipeline"     && <PipelineBoard />}
        {activeTab === "actividades"  && <ActivitiesPanel />}
        {activeTab === "evaluacion"   && <EvaluationPanel />}
        {activeTab === "tarifarios"   && <TariffsPanel />}
        {activeTab === "historial"    && <History360Panel />}
        {activeTab === "segmentacion" && <SegmentationPanel />}
      </div>
    </div>
  );
}
