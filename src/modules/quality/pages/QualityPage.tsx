// Modulo 7 - Calidad - Pagina principal
import React from "react";
import { useQualityStore } from "../store/quality.store";
import { Star, MessageSquare, RotateCcw, BarChart2, CheckCircle } from "lucide-react";
import { cn } from "@/utils/utils";
import { EncuestasTab } from "./tabs/EncuestasTab";
import { ReclamosTab } from "./tabs/ReclamosTab";
import { RMATab } from "./tabs/RMATab";
import { IndicadoresTab } from "./tabs/IndicadoresTab";
import { AccionesTab } from "./tabs/AccionesTab";

const tabs = [
  { id: "encuestas",   label: "Encuestas",   icon: Star },
  { id: "reclamos",    label: "Reclamos",    icon: MessageSquare },
  { id: "rma",         label: "Devoluciones",icon: RotateCcw },
  { id: "indicadores", label: "Indicadores", icon: BarChart2 },
  { id: "acciones",    label: "Acciones correctivas", icon: CheckCircle },
];

export const QualityPage: React.FC = () => {
  const { tabActiva, setTabActiva } = useQualityStore();

  const renderTab = () => {
    switch (tabActiva) {
      case "encuestas":   return <EncuestasTab />;
      case "reclamos":    return <ReclamosTab />;
      case "rma":         return <RMATab />;
      case "indicadores": return <IndicadoresTab />;
      case "acciones":    return <AccionesTab />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Calidad y Satisfaccion</h1>
          <p className="text-slate-500 mt-1">Encuestas post-entrega, reclamos, devoluciones e indicadores NPS.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "NPS promedio", valor: "8.3", sub: "Promotores 60%", color: "emerald" },
          { label: "Reclamos abiertos", valor: "2", sub: "1 critico", color: "red" },
          { label: "CSAT promedio", valor: "4.2/5", sub: "Ultimos 30 dias", color: "blue" },
          { label: "Devoluciones", valor: "1", sub: "Pendiente resolucion", color: "orange" },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm px-4 py-3">
            <p className="text-xs text-slate-400 mb-0.5">{k.label}</p>
            <p className="text-xl font-bold text-slate-800">{k.valor}</p>
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

export default QualityPage;
