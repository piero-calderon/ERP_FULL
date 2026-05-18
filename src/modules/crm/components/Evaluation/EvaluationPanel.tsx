import { useState } from "react";
import { ShieldCheck, ShieldAlert, Clock, ShieldX, Star, CheckCircle2, XCircle, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import { useCRMStore } from "../../store/crm.store";
import type { ClientEvaluation, EvaluationStatus } from "../../types/crm.types";
import { cn } from "@/utils/utils";
import { formatCurrency } from "@/utils/currency";

const STATUS_CONFIG: Record<EvaluationStatus, { label: string; Icon: typeof ShieldCheck; color: string; bg: string; darkBg: string; border: string; darkBorder: string }> = {
  aprobado:    { label: "Aprobado",    Icon: ShieldCheck, color: "text-emerald-700", bg: "bg-emerald-50", darkBg: "dark:bg-emerald-900/20", border: "border-emerald-200", darkBorder: "dark:border-emerald-800" },
  pendiente:   { label: "Pendiente",   Icon: Clock,       color: "text-amber-700",   bg: "bg-amber-50",   darkBg: "dark:bg-amber-900/20",   border: "border-amber-200",   darkBorder: "dark:border-amber-800" },
  condicionado:{ label: "Condicionado",Icon: ShieldAlert, color: "text-blue-700",    bg: "bg-blue-50",    darkBg: "dark:bg-blue-900/20",    border: "border-blue-200",    darkBorder: "dark:border-blue-800" },
  rechazado:   { label: "Rechazado",   Icon: ShieldX,     color: "text-rose-700",    bg: "bg-rose-50",    darkBg: "dark:bg-rose-900/20",    border: "border-rose-200",    darkBorder: "dark:border-rose-800" },
};

function ScoreBar({ score }: { score: number }) {
  const color = score >= 80 ? "bg-emerald-500" : score >= 60 ? "bg-amber-500" : score >= 40 ? "bg-orange-500" : "bg-rose-500";
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
        <div className={cn("h-full rounded-full transition-all duration-700", color)} style={{ width: `${score}%` }} />
      </div>
      <span className={cn("text-xs font-black w-8 text-right", score >= 80 ? "text-emerald-600" : score >= 60 ? "text-amber-600" : "text-rose-600")}>{score}</span>
    </div>
  );
}

function EvaluationCard({ evaluation }: { evaluation: ClientEvaluation }) {
  const { updateEvaluationStatus } = useCRMStore();
  const [expanded, setExpanded] = useState(false);
  const cfg = STATUS_CONFIG[evaluation.status];
  const { Icon } = cfg;

  return (
    <div className={cn("bg-white dark:bg-slate-800 rounded-2xl border p-5 transition-all", cfg.border, cfg.darkBorder)}>
      <div className="flex items-start gap-4">
        <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center shrink-0", cfg.bg, cfg.darkBg)}>
          <Icon className={cn("h-6 w-6", cfg.color)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">{evaluation.clientName}</h4>
            <span className={cn("text-[10px] font-black px-2 py-0.5 rounded-full", cfg.bg, cfg.darkBg, cfg.color)}>{cfg.label}</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{evaluation.activity}</p>
        </div>
        <button onClick={() => setExpanded(p => !p)} className="p-1.5 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-colors">
          {expanded ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
        </button>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase mb-1.5">Score</p>
          <ScoreBar score={evaluation.score} />
        </div>
        <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded-xl">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Limite Propuesto</p>
          <p className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">
            {evaluation.proposedCreditLimit > 0 ? formatCurrency(evaluation.proposedCreditLimit, "ARS", "es-AR") : "Sin credito"}
          </p>
        </div>
      </div>
      {expanded && (
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 space-y-3">
          <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300">
            <Star className="h-4 w-4 text-amber-400" />
            <span>{evaluation.yearsInBusiness} anos en actividad</span>
          </div>
          {evaluation.notes && (
            <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded-xl">
              <p className="text-xs text-slate-600 dark:text-slate-300 italic">"{evaluation.notes}"</p>
            </div>
          )}
          {evaluation.rejectionReason && (
            <div className="p-3 bg-rose-50 dark:bg-rose-900/20 rounded-xl border border-rose-100 dark:border-rose-800">
              <p className="text-[10px] font-bold text-rose-600 uppercase mb-1">Motivo de Rechazo</p>
              <p className="text-xs text-rose-700">{evaluation.rejectionReason}</p>
            </div>
          )}
          {evaluation.approvedBy && (
            <p className="text-[10px] text-slate-400">Aprobado por: <span className="font-bold text-slate-600 dark:text-slate-300">{evaluation.approvedBy}</span></p>
          )}
          {evaluation.status === "pendiente" && (
            <div className="flex gap-2 pt-2">
              <button onClick={() => updateEvaluationStatus(evaluation.id, "aprobado")}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors">
                <CheckCircle2 className="h-3.5 w-3.5" /> Aprobar
              </button>
              <button onClick={() => updateEvaluationStatus(evaluation.id, "condicionado")}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors">
                <AlertTriangle className="h-3.5 w-3.5" /> Condicionar
              </button>
              <button onClick={() => updateEvaluationStatus(evaluation.id, "rechazado")}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 transition-colors">
                <XCircle className="h-3.5 w-3.5" /> Rechazar
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function EvaluationPanel() {
  const { evaluations } = useCRMStore();
  const [statusFilter, setStatusFilter] = useState<EvaluationStatus | "">("");
  const filtered = statusFilter ? evaluations.filter(e => e.status === statusFilter) : evaluations;
  const pending = evaluations.filter(e => e.status === "pendiente").length;

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl">
        <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-sm text-amber-800 dark:text-amber-300 font-medium">
          <span className="font-black">Regla de negocio:</span> Un cliente no puede operar a credito sin una evaluacion <span className="font-bold">aprobada</span> o <span className="font-bold">condicionada</span>.
        </p>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {(["pendiente", "aprobado", "condicionado", "rechazado"] as EvaluationStatus[]).map(s => {
          const cfg = STATUS_CONFIG[s];
          const count = evaluations.filter(e => e.status === s).length;
          return (
            <button key={s} onClick={() => setStatusFilter(statusFilter === s ? "" : s)}
              className={cn("p-4 rounded-2xl border text-center transition-all",
                statusFilter === s ? cn(cfg.bg, cfg.darkBg, cfg.border, cfg.darkBorder) : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-slate-200")}>
              <p className={cn("text-2xl font-extrabold", statusFilter === s ? cfg.color : "text-slate-900 dark:text-white")}>{count}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">{cfg.label}</p>
            </button>
          );
        })}
      </div>
      {pending > 0 && (
        <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-800">
          <span className="h-2 w-2 bg-amber-500 rounded-full animate-pulse" />
          <p className="text-xs font-bold text-amber-700 dark:text-amber-400">{pending} evaluacion{pending > 1 ? "es" : ""} pendiente{pending > 1 ? "s" : ""} de revision</p>
        </div>
      )}
      <div className="space-y-4">
        {filtered.map(e => <EvaluationCard key={e.id} evaluation={e} />)}
      </div>
    </div>
  );
}
