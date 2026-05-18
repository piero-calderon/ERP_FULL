// Modulo 8 - Finanzas y Tesoreria - Pagina principal
import React from "react";
import { useFinanceStore } from "../store/finance.store";
import { DollarSign, CreditCard, Building2, FileText, TrendingUp } from "lucide-react";
import { cn } from "@/utils/utils";
import { CobrosTab } from "./tabs/CobrosTab";
import { PagosTab } from "./tabs/PagosTab";
import { TesoreriaTab } from "./tabs/TesoreriaTab";
import { SEPATab } from "./tabs/SEPATab";
import { CashflowTab } from "./tabs/CashflowTab";

const tabs = [
  { id: "cobros",    label: "Cobros",     icon: DollarSign },
  { id: "pagos",     label: "Pagos",      icon: CreditCard },
  { id: "tesoreria", label: "Tesoreria",  icon: Building2 },
  { id: "sepa",      label: "SEPA",       icon: FileText },
  { id: "cashflow",  label: "Cashflow",   icon: TrendingUp },
];

const fmt = (centimos: number) =>
  new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(centimos / 100);

export const FinancePage: React.FC = () => {
  const { tabActiva, setTabActiva, cobros, pagos, cuentas } = useFinanceStore();

  const totalPendienteCobro = cobros.filter(c => c.estado !== "cobrado").reduce((s, c) => s + c.importePendiente, 0);
  const totalVencido = cobros.filter(c => c.estado === "vencido").reduce((s, c) => s + c.importePendiente, 0);
  const totalPendientePago = pagos.filter(p => p.estado !== "pagado").reduce((s, p) => s + p.importe, 0);
  const saldoTotal = cuentas.reduce((s, c) => s + c.saldo, 0);

  const renderTab = () => {
    switch (tabActiva) {
      case "cobros":    return <CobrosTab />;
      case "pagos":     return <PagosTab />;
      case "tesoreria": return <TesoreriaTab />;
      case "sepa":      return <SEPATab />;
      case "cashflow":  return <CashflowTab />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Finanzas y Tesoreria</h1>
        <p className="text-slate-500 mt-1">Cobros, pagos, conciliacion bancaria y cashflow.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Pendiente cobro", valor: fmt(totalPendienteCobro), sub: `${cobros.filter(c=>c.estado!=="cobrado").length} facturas`, color: "blue" },
          { label: "Vencido", valor: fmt(totalVencido), sub: `${cobros.filter(c=>c.estado==="vencido").length} clientes`, color: "red" },
          { label: "Pendiente pago", valor: fmt(totalPendientePago), sub: `${pagos.filter(p=>p.estado!=="pagado").length} proveedores`, color: "orange" },
          { label: "Saldo bancario", valor: fmt(saldoTotal), sub: `${cuentas.length} cuentas`, color: "emerald" },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm px-4 py-3">
            <p className="text-xs text-slate-400 mb-0.5">{k.label}</p>
            <p className="text-lg font-bold text-slate-800">{k.valor}</p>
            <p className="text-xs text-slate-400">{k.sub}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-1 overflow-x-auto bg-white border border-slate-100 rounded-2xl p-2 shadow-sm">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setTabActiva(tab.id as any)}
            className={cn("flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all",
              tabActiva === tab.id ? "bg-blue-600 text-white shadow-md" : "text-slate-500 hover:bg-slate-100 hover:text-slate-700")}>
            <tab.icon className="h-4 w-4" />{tab.label}
          </button>
        ))}
      </div>

      <div>{renderTab()}</div>
    </div>
  );
};

export default FinancePage;
