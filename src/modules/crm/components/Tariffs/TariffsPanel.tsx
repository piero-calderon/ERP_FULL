import { useState } from "react";
import { Tag, ToggleLeft, ToggleRight, Gift, Percent, Calculator, ChevronDown, ChevronUp, AlertTriangle } from "lucide-react";
import { useCRMStore } from "../../store/crm.store";
import type { Tariff, TariffType } from "../../types/crm.types";
import { cn } from "@/utils/utils";

const TYPE_CONFIG: Record<TariffType, { label: string; color: string; bg: string; darkBg: string }> = {
  base:    { label: "Base",    color: "text-slate-700",   bg: "bg-slate-100",   darkBg: "dark:bg-slate-700" },
  cliente: { label: "Cliente", color: "text-violet-700",  bg: "bg-violet-100",  darkBg: "dark:bg-violet-900/40" },
  canal:   { label: "Canal",   color: "text-blue-700",    bg: "bg-blue-100",    darkBg: "dark:bg-blue-900/40" },
  zona:    { label: "Zona",    color: "text-emerald-700", bg: "bg-emerald-100", darkBg: "dark:bg-emerald-900/40" },
};

function TariffCard({ tariff }: { tariff: Tariff }) {
  const { toggleTariff } = useCRMStore();
  const [expanded, setExpanded] = useState(false);
  const typeCfg = TYPE_CONFIG[tariff.type];
  const today = new Date().toISOString().split("T")[0];
  const activePromos = tariff.promotions.filter(p => p.validFrom <= today && p.validTo >= today);

  return (
    <div className={cn("bg-white dark:bg-slate-800 rounded-2xl border transition-all",
      tariff.isActive ? "border-slate-200 dark:border-slate-700" : "border-slate-100 dark:border-slate-800 opacity-60")}>
      <div className="flex items-center gap-4 p-5">
        <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center shrink-0">
          <Tag className="h-5 w-5 text-slate-600 dark:text-slate-300" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">{tariff.name}</h4>
            <span className={cn("text-[10px] font-black px-2 py-0.5 rounded-full", typeCfg.bg, typeCfg.darkBg, typeCfg.color)}>{typeCfg.label}</span>
            {tariff.targetName && <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-700 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-600">{tariff.targetName}</span>}
            {tariff.requiresApproval && <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-900/30 px-2 py-0.5 rounded-full"><AlertTriangle className="h-3 w-3" /> Requiere aprobacion</span>}
            {activePromos.length > 0 && <span className="flex items-center gap-1 text-[10px] font-bold text-rose-600 bg-rose-50 dark:bg-rose-900/30 px-2 py-0.5 rounded-full"><Gift className="h-3 w-3" /> {activePromos.length} promo activa</span>}
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">Prioridad: {tariff.priority} · {tariff.currency} · {tariff.rules.length} regla{tariff.rules.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={() => toggleTariff(tariff.id)} className={cn("shrink-0 transition-colors", tariff.isActive ? "text-emerald-600" : "text-slate-300")}>
          {tariff.isActive ? <ToggleRight className="h-7 w-7" /> : <ToggleLeft className="h-7 w-7" />}
        </button>
        <button onClick={() => setExpanded(p => !p)} className="p-1.5 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-colors shrink-0">
          {expanded ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
        </button>
      </div>
      {expanded && (
        <div className="px-5 pb-5 space-y-4 border-t border-slate-100 dark:border-slate-700 pt-4">
          {tariff.rules.length > 0 && (
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Reglas de Descuento</p>
              <div className="rounded-xl overflow-hidden border border-slate-100 dark:border-slate-700">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-700">
                      <th className="text-left px-3 py-2 font-bold text-slate-500 dark:text-slate-300">Producto / Familia</th>
                      <th className="text-center px-3 py-2 font-bold text-slate-500 dark:text-slate-300">Dto.</th>
                      <th className="text-center px-3 py-2 font-bold text-slate-500 dark:text-slate-300">Min. Cant.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tariff.rules.map(r => (
                      <tr key={r.id} className="border-t border-slate-50 dark:border-slate-700">
                        <td className="px-3 py-2 font-medium text-slate-700 dark:text-slate-200">{r.productName}</td>
                        <td className="px-3 py-2 text-center">
                          <span className="flex items-center justify-center gap-1 font-bold text-emerald-700">
                            <Percent className="h-3 w-3" />{r.discountType === "percentage" ? `${r.discountValue}%` : `$${r.discountValue}`}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-center text-slate-400">{r.minQuantity ?? "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {tariff.promotions.length > 0 && (
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Promociones</p>
              <div className="space-y-2">
                {tariff.promotions.map(p => {
                  const isActive = p.validFrom <= today && p.validTo >= today;
                  return (
                    <div key={p.id} className={cn("flex items-center gap-3 p-3 rounded-xl border text-xs",
                      isActive ? "bg-rose-50 dark:bg-rose-900/20 border-rose-100 dark:border-rose-800 text-rose-800 dark:text-rose-300" : "bg-slate-50 dark:bg-slate-700 border-slate-100 dark:border-slate-600 text-slate-500 dark:text-slate-400")}>
                      <Gift className="h-4 w-4 shrink-0" />
                      <div className="flex-1"><span className="font-bold">{p.description}</span>{p.type === "percentage" && <span className="ml-2 opacity-70">— {p.value}% dto.</span>}</div>
                      <span className="font-semibold opacity-70">{new Date(p.validFrom).toLocaleDateString("es-AR", { day: "2-digit", month: "short" })} → {new Date(p.validTo).toLocaleDateString("es-AR", { day: "2-digit", month: "short" })}</span>
                      {isActive && <span className="font-black text-rose-600 text-[10px] bg-rose-100 dark:bg-rose-900/50 px-1.5 py-0.5 rounded">ACTIVA</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function PriceSimulator() {
  const { tariffs } = useCRMStore();
  const [client, setClient] = useState("Hotel del Prado");
  const [product, setProduct] = useState("Amenities Premium");
  const [qty, setQty] = useState(10);
  const [basePrice] = useState(1500);
  const clients  = ["Hotel del Prado", "Limpieza Total S.A.", "Distribuidora del Valle"];
  const products = ["Amenities Premium", "Detergente Industrial X", "Desinfectante Plus"];
  const activeTariffs = tariffs.filter(t => t.isActive);
  const appliedTariff = activeTariffs.find(t => t.type === "cliente" && t.targetName === client) ?? activeTariffs.find(t => t.type === "canal") ?? activeTariffs.find(t => t.type === "base");
  const rule = appliedTariff?.rules.find(r => r.productName === product || r.productName === "Todos los productos");
  const discount = rule?.discountType === "percentage" ? rule.discountValue : 0;
  const finalPrice = Math.round(basePrice * (1 - discount / 100));

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white">
      <div className="flex items-center gap-2 mb-5"><Calculator className="h-5 w-5 text-slate-400" /><h4 className="font-bold">Simulador de Precios</h4></div>
      <div className="grid md:grid-cols-3 gap-4 mb-5">
        <div><label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Cliente</label>
          <select value={client} onChange={e => setClient(e.target.value)} className="w-full bg-slate-800 text-white text-xs rounded-xl p-2.5 border border-slate-700 focus:outline-none">
            {clients.map(c => <option key={c}>{c}</option>)}
          </select></div>
        <div><label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Producto</label>
          <select value={product} onChange={e => setProduct(e.target.value)} className="w-full bg-slate-800 text-white text-xs rounded-xl p-2.5 border border-slate-700 focus:outline-none">
            {products.map(p => <option key={p}>{p}</option>)}
          </select></div>
        <div><label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Cantidad</label>
          <input type="number" value={qty} onChange={e => setQty(Number(e.target.value))} min={1} className="w-full bg-slate-800 text-white text-xs rounded-xl p-2.5 border border-slate-700 focus:outline-none" /></div>
      </div>
      <div className="flex items-center justify-between p-4 bg-white/10 rounded-xl">
        <div><p className="text-[10px] text-slate-400 uppercase">Tarifa aplicada</p><p className="text-sm font-bold mt-0.5">{appliedTariff?.name ?? "Sin tarifa"}</p>{discount > 0 && <p className="text-[10px] text-emerald-400 font-bold mt-0.5">— {discount}% descuento</p>}</div>
        <div className="text-right"><p className="text-[10px] text-slate-400 uppercase">Precio final x {qty}</p><p className="text-2xl font-extrabold text-emerald-400 mt-0.5">${(finalPrice * qty).toLocaleString("es-AR")}</p>{discount > 0 && <p className="text-[10px] text-slate-400 line-through">${(basePrice * qty).toLocaleString("es-AR")}</p>}</div>
      </div>
    </div>
  );
}

export function TariffsPanel() {
  const { tariffs } = useCRMStore();
  const [typeFilter, setTypeFilter] = useState<TariffType | "">("");
  const filtered = typeFilter ? tariffs.filter(t => t.type === typeFilter) : tariffs;
  const sorted = [...filtered].sort((a, b) => a.priority - b.priority);

  return (
    <div className="space-y-6">
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-2xl text-sm text-blue-800 dark:text-blue-300">
        <span className="font-black">Prioridad de aplicacion:</span> Cliente → Canal → Zona → Base (menor numero = mayor prioridad)
      </div>
      <div className="flex gap-2 flex-wrap">
        {(["", "base", "cliente", "canal", "zona"] as (TariffType | "")[]).map(t => (
          <button key={t} onClick={() => setTypeFilter(t)}
            className={cn("px-4 py-1.5 text-xs font-bold rounded-xl transition-all",
              typeFilter === t ? "bg-slate-900 dark:bg-white dark:text-slate-900 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600")}>
            {t ? TYPE_CONFIG[t as TariffType].label : "Todos"}
          </button>
        ))}
      </div>
      <div className="space-y-3">{sorted.map(t => <TariffCard key={t.id} tariff={t} />)}</div>
      <PriceSimulator />
    </div>
  );
}
