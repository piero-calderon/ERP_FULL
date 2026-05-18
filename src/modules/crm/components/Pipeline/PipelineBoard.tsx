import { useState } from "react";
import { ChevronLeft, ChevronRight, Trophy, TrendingDown, Eye, X, DollarSign, User, Calendar } from "lucide-react";
import { useCRMStore } from "../../store/crm.store";
import type { Opportunity, OpportunityStage } from "../../types/crm.types";
import { cn } from "@/utils/utils";
import { formatCurrency } from "@/utils/currency";

const STAGES: { id: OpportunityStage; label: string; color: string; bg: string; darkBg: string; border: string; darkBorder: string; dot: string }[] = [
  { id: "lead",        label: "Lead",        color: "text-slate-600",   bg: "bg-slate-50",   darkBg: "dark:bg-slate-800",    border: "border-slate-200",  darkBorder: "dark:border-slate-700", dot: "bg-slate-400" },
  { id: "calificado",  label: "Calificado",  color: "text-blue-600",    bg: "bg-blue-50",    darkBg: "dark:bg-blue-900/20",  border: "border-blue-200",   darkBorder: "dark:border-blue-800",  dot: "bg-blue-500" },
  { id: "propuesta",   label: "Propuesta",   color: "text-violet-600",  bg: "bg-violet-50",  darkBg: "dark:bg-violet-900/20",border: "border-violet-200", darkBorder: "dark:border-violet-800",dot: "bg-violet-500" },
  { id: "negociacion", label: "Negociacion", color: "text-amber-600",   bg: "bg-amber-50",   darkBg: "dark:bg-amber-900/20", border: "border-amber-200",  darkBorder: "dark:border-amber-800", dot: "bg-amber-500" },
  { id: "ganado",      label: "Ganado",      color: "text-emerald-600", bg: "bg-emerald-50", darkBg: "dark:bg-emerald-900/20",border: "border-emerald-200",darkBorder: "dark:border-emerald-800",dot: "bg-emerald-500" },
  { id: "perdido",     label: "Perdido",     color: "text-rose-600",    bg: "bg-rose-50",    darkBg: "dark:bg-rose-900/20",  border: "border-rose-200",   darkBorder: "dark:border-rose-800",  dot: "bg-rose-500" },
];

const STAGE_ORDER: OpportunityStage[] = ["lead", "calificado", "propuesta", "negociacion", "ganado", "perdido"];

const LOSS_REASON_LABELS: Record<string, string> = {
  precio: "Precio", competencia: "Competencia", timing: "Timing", presupuesto: "Sin presupuesto",
};

function OpportunityCard({ opp, onMove, onSelect }: { opp: Opportunity; onMove: (id: string, stage: OpportunityStage) => void; onSelect: (opp: Opportunity) => void; }) {
  const stageIdx = STAGE_ORDER.indexOf(opp.stage);
  const canAdvance = stageIdx < STAGE_ORDER.length - 1 && opp.stage !== "ganado";
  const canRetreat = stageIdx > 0 && opp.stage !== "perdido";
  const daysToClose = Math.ceil((new Date(opp.expectedCloseDate).getTime() - Date.now()) / 86400000);

  return (
    <div className="bg-white dark:bg-slate-700 border border-slate-100 dark:border-slate-600 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all group cursor-pointer space-y-3"
      onClick={() => onSelect(opp)}>
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-bold text-slate-500 dark:text-slate-300 leading-tight">{opp.clientName}</p>
        <span className={cn("text-[10px] font-black px-2 py-0.5 rounded-full shrink-0",
          opp.probability >= 75 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400" :
          opp.probability >= 40 ? "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400" :
                                  "bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-400")}>
          {opp.probability}%
        </span>
      </div>
      <p className="text-sm font-bold text-slate-900 dark:text-white leading-snug">{opp.title}</p>
      <div className="flex items-center gap-1 text-base font-extrabold text-slate-900 dark:text-white">
        <DollarSign className="h-4 w-4 text-emerald-500" />
        {formatCurrency(opp.estimatedValue, "ARS", "es-AR")}
      </div>
      <div className="flex items-center gap-3 text-[10px] text-slate-400 font-medium">
        <span className="flex items-center gap-1"><User className="h-3 w-3" />{opp.owner.split(" ")[0]}</span>
        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{daysToClose > 0 ? `${daysToClose}d` : "Vencido"}</span>
      </div>
      {opp.lossReason && <p className="text-[10px] text-rose-500 font-bold">Motivo: {LOSS_REASON_LABELS[opp.lossReason] ?? opp.lossReason}</p>}
      <div className="flex items-center gap-1 pt-1 border-t border-slate-50 dark:border-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
        <button onClick={() => canRetreat && onMove(opp.id, STAGE_ORDER[stageIdx - 1])} disabled={!canRetreat}
          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed text-slate-500 dark:text-slate-300 transition-colors">
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>
        <button onClick={() => onSelect(opp)}
          className="flex-1 flex items-center justify-center gap-1 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-500 dark:text-slate-300 transition-colors text-[10px] font-bold">
          <Eye className="h-3 w-3" /> Ver
        </button>
        <button onClick={() => canAdvance && onMove(opp.id, STAGE_ORDER[stageIdx + 1])} disabled={!canAdvance}
          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed text-slate-500 dark:text-slate-300 transition-colors">
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

function OpportunityDetail({ opp, onClose, onMove }: { opp: Opportunity; onClose: () => void; onMove: (id: string, stage: OpportunityStage) => void; }) {
  const stage = STAGES.find(s => s.id === opp.stage)!;
  const stageIdx = STAGE_ORDER.indexOf(opp.stage);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 rounded-[32px] w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
        <div className={cn("p-6", stage.bg, stage.darkBg)}>
          <div className="flex items-start justify-between">
            <div>
              <span className={cn("text-[10px] font-black uppercase tracking-widest", stage.color)}>{stage.label}</span>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">{opp.title}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{opp.clientName}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/60 dark:hover:bg-slate-700 rounded-xl transition-colors">
              <X className="h-5 w-5 text-slate-500 dark:text-slate-400" />
            </button>
          </div>
        </div>
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-3 gap-4">
            {[["Valor", formatCurrency(opp.estimatedValue, "ARS", "es-AR")], ["Probabilidad", `${opp.probability}%`], ["Cierre", new Date(opp.expectedCloseDate).toLocaleDateString("es-AR")]].map(([label, val]) => (
              <div key={label} className="p-3 bg-slate-50 dark:bg-slate-700 rounded-xl">
                <p className="text-[10px] font-bold text-slate-400 uppercase">{label}</p>
                <p className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">{val}</p>
              </div>
            ))}
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Productos de Interes</p>
            <div className="flex flex-wrap gap-2">
              {opp.products.map(p => (
                <span key={p} className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg">{p}</span>
              ))}
            </div>
          </div>
          {opp.notes && (
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-800">
              <p className="text-xs text-slate-700 dark:text-slate-300 italic">"{opp.notes}"</p>
            </div>
          )}
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Historial de Etapas</p>
            <div className="flex items-center gap-1 flex-wrap">
              {opp.stageHistory.map((h, i) => {
                const s = STAGES.find(st => st.id === h.stage)!;
                return (
                  <div key={i} className="flex items-center gap-1">
                    <span className={cn("text-[10px] font-bold px-2 py-1 rounded-lg", s.bg, s.darkBg, s.color)}>{s.label}</span>
                    {i < opp.stageHistory.length - 1 && <ChevronRight className="h-3 w-3 text-slate-300 dark:text-slate-600" />}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            {stageIdx > 0 && opp.stage !== "perdido" && (
              <button onClick={() => { onMove(opp.id, STAGE_ORDER[stageIdx - 1]); onClose(); }}
                className="flex-1 py-3 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 rounded-2xl font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                ← {STAGES.find(s => s.id === STAGE_ORDER[stageIdx - 1])?.label}
              </button>
            )}
            {stageIdx < STAGE_ORDER.length - 1 && opp.stage !== "ganado" && (
              <button onClick={() => { onMove(opp.id, STAGE_ORDER[stageIdx + 1]); onClose(); }}
                className="flex-1 py-3 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors">
                {STAGES.find(s => s.id === STAGE_ORDER[stageIdx + 1])?.label} →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function PipelineBoard() {
  const { opportunities, moveOpportunity } = useCRMStore();
  const [selectedOwner, setSelectedOwner] = useState<string>("");
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);

  const owners = Array.from(new Set(opportunities.map(o => o.owner)));
  const filtered = selectedOwner ? opportunities.filter(o => o.owner === selectedOwner) : opportunities;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Comercial:</span>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setSelectedOwner("")}
            className={cn("px-3 py-1.5 text-xs font-bold rounded-xl transition-all",
              !selectedOwner ? "bg-slate-900 dark:bg-white dark:text-slate-900 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600")}>
            Todos
          </button>
          {owners.map(o => (
            <button key={o} onClick={() => setSelectedOwner(o)}
              className={cn("px-3 py-1.5 text-xs font-bold rounded-xl transition-all",
                selectedOwner === o ? "bg-slate-900 dark:bg-white dark:text-slate-900 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600")}>
              {o.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {STAGES.map(stage => {
          const stageOpps = filtered.filter(o => o.stage === stage.id);
          const stageValue = stageOpps.reduce((s, o) => s + o.estimatedValue, 0);
          return (
            <div key={stage.id} className={cn("flex-none w-60 rounded-2xl border", stage.border, stage.darkBorder, stage.bg, stage.darkBg)}>
              <div className="p-4 space-y-1">
                <div className="flex items-center gap-2">
                  <div className={cn("h-2 w-2 rounded-full", stage.dot)} />
                  <span className={cn("text-xs font-black uppercase tracking-wide", stage.color)}>{stage.label}</span>
                  <span className={cn("ml-auto text-[10px] font-black px-2 py-0.5 rounded-full", stage.bg, stage.darkBg, stage.color)}>
                    {stageOpps.length}
                  </span>
                </div>
                {stageValue > 0 && <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold pl-4">{formatCurrency(stageValue, "ARS", "es-AR")}</p>}
              </div>
              <div className="px-3 pb-3 space-y-2">
                {stageOpps.length === 0 ? (
                  <div className="py-8 text-center text-slate-300 dark:text-slate-600 text-xs font-medium">Sin oportunidades</div>
                ) : (
                  stageOpps.map(opp => (
                    <OpportunityCard key={opp.id} opp={opp} onMove={moveOpportunity} onSelect={setSelectedOpp} />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-6 text-[10px] text-slate-400 font-medium">
        <Trophy className="h-3 w-3 text-emerald-500" />
        <span>Oportunidades ganadas contribuyen al calculo de tasa de exito.</span>
        <TrendingDown className="h-3 w-3 text-rose-400" />
        <span>Las perdidas registran el motivo de perdida para analisis.</span>
      </div>

      {selectedOpp && (
        <OpportunityDetail opp={selectedOpp} onClose={() => setSelectedOpp(null)} onMove={moveOpportunity} />
      )}
    </div>
  );
}
