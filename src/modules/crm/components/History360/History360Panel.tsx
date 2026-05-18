import { ShoppingCart, FileText, MessageSquare, AlertTriangle, RotateCcw, ShieldCheck, Phone, MapPin, FileCheck, TrendingUp } from "lucide-react";
import { useCRMStore } from "../../store/crm.store";
import type { HistoryEventType } from "../../types/crm.types";
import { cn } from "@/utils/utils";
import { formatCurrency } from "@/utils/currency";

const EVENT_CONFIG: Record<HistoryEventType, { Icon: typeof ShoppingCart; color: string; bg: string; darkBg: string; border: string }> = {
  pedido:     { Icon: ShoppingCart,  color: "text-blue-600",    bg: "bg-blue-100",    darkBg: "dark:bg-blue-900/40",    border: "border-l-blue-500" },
  factura:    { Icon: FileText,      color: "text-slate-600",   bg: "bg-slate-100",   darkBg: "dark:bg-slate-700",      border: "border-l-slate-400" },
  cotizacion: { Icon: MessageSquare, color: "text-violet-600",  bg: "bg-violet-100",  darkBg: "dark:bg-violet-900/40",  border: "border-l-violet-500" },
  reclamo:    { Icon: AlertTriangle, color: "text-amber-600",   bg: "bg-amber-100",   darkBg: "dark:bg-amber-900/40",   border: "border-l-amber-500" },
  devolucion: { Icon: RotateCcw,     color: "text-rose-600",    bg: "bg-rose-100",    darkBg: "dark:bg-rose-900/40",    border: "border-l-rose-500" },
  evaluacion: { Icon: ShieldCheck,   color: "text-emerald-600", bg: "bg-emerald-100", darkBg: "dark:bg-emerald-900/40", border: "border-l-emerald-500" },
  llamada:    { Icon: Phone,         color: "text-indigo-600",  bg: "bg-indigo-100",  darkBg: "dark:bg-indigo-900/40",  border: "border-l-indigo-500" },
  visita:     { Icon: MapPin,        color: "text-purple-600",  bg: "bg-purple-100",  darkBg: "dark:bg-purple-900/40",  border: "border-l-purple-500" },
  documento:  { Icon: FileCheck,     color: "text-teal-600",    bg: "bg-teal-100",    darkBg: "dark:bg-teal-900/40",    border: "border-l-teal-500" },
};

const CLIENTS = [
  { id: "4", name: "Hotel del Prado" },
  { id: "1", name: "Limpieza Total S.A." },
  { id: "2", name: "Distribuidora del Valle" },
  { id: "6", name: "Hospital Central" },
];

function TimelineEvent({ event }: { event: ReturnType<typeof useCRMStore.getState>["historyEvents"][0] }) {
  const cfg = EVENT_CONFIG[event.type];
  const { Icon } = cfg;
  return (
    <div className={cn("flex gap-4 p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 border-l-4 transition-all hover:shadow-sm", cfg.border)}>
      <div className={cn("h-9 w-9 rounded-xl flex items-center justify-center shrink-0", cfg.bg, cfg.darkBg)}>
        <Icon className={cn("h-5 w-5", cfg.color)} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-bold text-slate-900 dark:text-white">{event.title}</p>
          {event.value && <span className="text-xs font-extrabold text-emerald-700 shrink-0">{formatCurrency(event.value, "ARS", "es-AR")}</span>}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{event.description}</p>
        <div className="flex items-center gap-3 mt-1.5 text-[10px] text-slate-400">
          <span>{new Date(event.date).toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric" })}</span>
          <span>·</span>
          <span>{event.by}</span>
        </div>
      </div>
    </div>
  );
}

function KPICards({ clientId }: { clientId: string }) {
  const { clientKPIs } = useCRMStore();
  const kpi = clientKPIs.find(k => k.clientId === clientId);
  if (!kpi) return null;
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800">
        <p className="text-[10px] font-bold text-blue-500 uppercase">Ticket Medio</p>
        <p className="text-lg font-extrabold text-blue-900 dark:text-blue-300 mt-1">{formatCurrency(kpi.avgTicket, "ARS", "es-AR")}</p>
      </div>
      <div className="p-4 bg-violet-50 dark:bg-violet-900/20 rounded-2xl border border-violet-100 dark:border-violet-800">
        <p className="text-[10px] font-bold text-violet-500 uppercase">Freq. Compra</p>
        <p className="text-lg font-extrabold text-violet-900 dark:text-violet-300 mt-1">{kpi.ordersPerMonth.toFixed(1)} / mes</p>
      </div>
      <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-800">
        <p className="text-[10px] font-bold text-emerald-500 uppercase">Ultimo Pedido</p>
        <p className="text-lg font-extrabold text-emerald-900 dark:text-emerald-300 mt-1">{new Date(kpi.lastOrderDate).toLocaleDateString("es-AR", { day: "2-digit", month: "short" })}</p>
        <p className="text-[10px] text-emerald-600 font-semibold">{kpi.daysSinceLastOrder}d atras</p>
      </div>
      <div className={cn("p-4 rounded-2xl border", kpi.daysSinceLastOrder > 60 ? "bg-rose-50 dark:bg-rose-900/20 border-rose-100 dark:border-rose-800" : "bg-slate-50 dark:bg-slate-700 border-slate-100 dark:border-slate-600")}>
        <p className={cn("text-[10px] font-bold uppercase", kpi.daysSinceLastOrder > 60 ? "text-rose-500" : "text-slate-500")}>Sin Compras</p>
        <p className={cn("text-lg font-extrabold mt-1", kpi.daysSinceLastOrder > 60 ? "text-rose-900 dark:text-rose-300" : "text-slate-900 dark:text-white")}>{kpi.daysSinceLastOrder} dias</p>
        {kpi.daysSinceLastOrder > 60 && <p className="text-[10px] text-rose-600 font-bold">Riesgo de fuga</p>}
      </div>
      <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-100 dark:border-amber-800 col-span-2">
        <p className="text-[10px] font-bold text-amber-500 uppercase">Facturacion Total</p>
        <p className="text-2xl font-extrabold text-amber-900 dark:text-amber-300 mt-1">{formatCurrency(kpi.totalRevenue, "ARS", "es-AR")}</p>
        <p className="text-[10px] text-amber-600 font-semibold mt-0.5">{kpi.totalOrders} pedidos totales · Zona {kpi.zone}</p>
      </div>
      <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800">
        <p className="text-[10px] font-bold text-indigo-500 uppercase">Margen Aportado</p>
        <p className="text-lg font-extrabold text-indigo-900 dark:text-indigo-300 mt-1">{kpi.marginContribution}%</p>
      </div>
      <div className={cn("p-4 rounded-2xl border", kpi.claimRate > 3 ? "bg-rose-50 dark:bg-rose-900/20 border-rose-100 dark:border-rose-800" : "bg-slate-50 dark:bg-slate-700 border-slate-100 dark:border-slate-600")}>
        <p className="text-[10px] font-bold text-slate-500 uppercase">Tasa Reclamos</p>
        <p className={cn("text-lg font-extrabold mt-1", kpi.claimRate > 3 ? "text-rose-900 dark:text-rose-300" : "text-slate-900 dark:text-white")}>{kpi.claimRate}%</p>
      </div>
    </div>
  );
}

export function History360Panel() {
  const { historyEvents, selectedClientId, setSelectedClient } = useCRMStore();
  const clientEvents = historyEvents.filter(e => e.clientId === selectedClientId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const selectedClient = CLIENTS.find(c => c.id === selectedClientId);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Seleccionar Cliente</p>
        <div className="flex flex-wrap gap-2">
          {CLIENTS.map(c => (
            <button key={c.id} onClick={() => setSelectedClient(c.id)}
              className={cn("px-4 py-2 rounded-xl text-sm font-bold transition-all border",
                selectedClientId === c.id ? "bg-slate-900 dark:bg-white dark:text-slate-900 text-white border-slate-900" : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300")}>
              {c.name}
            </button>
          ))}
        </div>
      </div>
      {selectedClient && (
        <div className="flex items-center gap-3 p-5 bg-slate-900 rounded-2xl text-white">
          <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center">
            <TrendingUp className="h-6 w-6 text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold">{selectedClient.name}</h3>
            <p className="text-slate-400 text-xs">{clientEvents.length} eventos registrados</p>
          </div>
        </div>
      )}
      <KPICards clientId={selectedClientId} />
      <div className="flex flex-wrap gap-3">
        {(Object.entries(EVENT_CONFIG) as [HistoryEventType, typeof EVENT_CONFIG[HistoryEventType]][]).map(([type, cfg]) => {
          const { Icon } = cfg;
          return (
            <div key={type} className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
              <Icon className={cn("h-3 w-3", cfg.color)} /><span className="capitalize">{type}</span>
            </div>
          );
        })}
      </div>
      <div className="space-y-3">
        {clientEvents.length === 0 ? (
          <div className="py-16 text-center text-slate-400"><p className="font-semibold">Sin eventos registrados para este cliente</p></div>
        ) : clientEvents.map(e => <TimelineEvent key={e.id} event={e} />)}
      </div>
    </div>
  );
}
