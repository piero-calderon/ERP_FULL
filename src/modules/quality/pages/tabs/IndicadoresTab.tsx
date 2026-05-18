// Modulo 7 - Calidad - Tab Indicadores NPS, CSAT, CES
import React from "react";
import { useQualityStore } from "../../store/quality.store";
import { Estrellas } from "../../components/Estrellas";
import { cn } from "@/utils/utils";

export const IndicadoresTab: React.FC = () => {
  const { encuestas, reclamos } = useQualityStore();

  const respondidas = encuestas.filter(e => e.estado === "respondida");
  const npsValores = respondidas.map(e => e.nps ?? 0);
  const npsPromedio = npsValores.length ? (npsValores.reduce((a,b) => a+b, 0) / npsValores.length).toFixed(1) : "0";
  const promotores = npsValores.filter(n => n >= 9).length;
  const neutros    = npsValores.filter(n => n >= 7 && n < 9).length;
  const detractores= npsValores.filter(n => n < 7).length;
  const npsScore   = npsValores.length ? Math.round((promotores - detractores) / npsValores.length * 100) : 0;

  const promedioEstrellas = (campo: string) => {
    const vals = respondidas.map(e => (e as any)[campo] as number).filter(Boolean);
    return vals.length ? (vals.reduce((a,b) => a+b, 0) / vals.length) : 0;
  };

  const csatPromedio = (["puntualidad","tratoConductor","estadoProducto","atencionComercial"]
    .reduce((sum, k) => sum + promedioEstrellas(k), 0) / 4).toFixed(1);

  const reclamosAbiertos = reclamos.filter(r => r.estado === "abierto" || r.estado === "en_gestion").length;
  const tasaReclamos = encuestas.length ? ((reclamosAbiertos / encuestas.length) * 100).toFixed(1) : "0";

  // Ranking conductores
  const conductores: Record<string, { nombre: string; vals: number[]; count: number }> = {};
  respondidas.forEach(e => {
    if (!conductores[e.conductorId]) conductores[e.conductorId] = { nombre: e.conductorNombre, vals: [], count: 0 };
    const avg = ((e.puntualidad ?? 0) + (e.tratoConductor ?? 0)) / 2;
    conductores[e.conductorId].vals.push(avg);
    conductores[e.conductorId].count++;
  });
  const rankingConductores = Object.values(conductores).map(c => ({
    nombre: c.nombre, promedio: (c.vals.reduce((a,b) => a+b,0) / c.vals.length), entregas: c.count
  })).sort((a,b) => b.promedio - a.promedio);

  return (
    <div className="space-y-6">
      {/* KPIs principales */}
      <div className="grid md:grid-cols-4 gap-4">
        {[
          { label: "NPS Score", valor: `${npsScore}`, sub: `${promotores}P / ${neutros}N / ${detractores}D`, color: npsScore >= 50 ? "emerald" : npsScore >= 0 ? "yellow" : "red" },
          { label: "NPS Promedio", valor: `${npsPromedio}/10`, sub: `${respondidas.length} respuestas`, color: "blue" },
          { label: "CSAT Promedio", valor: `${csatPromedio}/5`, sub: "Todas las dimensiones", color: "indigo" },
          { label: "Tasa reclamos", valor: `${tasaReclamos}%`, sub: `${reclamosAbiertos} abiertos`, color: "orange" },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <p className="text-xs text-slate-400 mb-1">{k.label}</p>
            <p className="text-2xl font-bold text-slate-800">{k.valor}</p>
            <p className="text-xs text-slate-400 mt-1">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Distribucion NPS */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <p className="text-sm font-bold text-slate-700 mb-4">Distribucion NPS</p>
        <div className="flex gap-2 mb-3">
          {[["Promotores (9-10)", promotores, "bg-emerald-500"],["Neutros (7-8)", neutros, "bg-yellow-400"],["Detractores (0-6)", detractores, "bg-red-500"]].map(([label, count, color]) => (
            <div key={label as string} className="flex-1 text-center">
              <div className={cn("h-16 rounded-xl mb-2 flex items-end justify-center pb-2", color as string)}
                style={{ opacity: 0.7 + ((count as number) / Math.max(respondidas.length, 1)) * 0.3 }}>
                <span className="text-white font-bold text-lg">{count}</span>
              </div>
              <p className="text-xs text-slate-500">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Promedios por dimension */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <p className="text-sm font-bold text-slate-700 mb-4">Calidad por dimension</p>
        <div className="space-y-3">
          {[["Puntualidad", "puntualidad"],["Trato del conductor", "tratoConductor"],
            ["Estado del producto", "estadoProducto"],["Atencion comercial", "atencionComercial"]
          ].map(([label, key]) => {
            const val = promedioEstrellas(key);
            return (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm text-slate-600 w-48">{label}</span>
                <div className="flex items-center gap-3 flex-1">
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={cn("h-full rounded-full", val >= 4 ? "bg-emerald-500" : val >= 3 ? "bg-yellow-400" : "bg-red-500")}
                      style={{ width: `${(val / 5) * 100}%` }} />
                  </div>
                  <Estrellas valor={Math.round(val)} readonly size="sm" />
                  <span className="text-xs font-bold text-slate-700 w-8">{val.toFixed(1)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Ranking conductores */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <p className="text-sm font-bold text-slate-700 mb-4">Ranking conductores por evaluacion</p>
        <div className="space-y-3">
          {rankingConductores.map((c, i) => (
            <div key={c.nombre} className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl">
              <div className={cn("w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white",
                i === 0 ? "bg-yellow-400" : i === 1 ? "bg-slate-400" : "bg-orange-400")}>
                {i + 1}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-800 text-sm">{c.nombre}</p>
                <p className="text-xs text-slate-400">{c.entregas} entregas evaluadas</p>
              </div>
              <div className="text-right">
                <Estrellas valor={Math.round(c.promedio)} readonly size="sm" />
                <p className="text-xs font-bold text-slate-700">{c.promedio.toFixed(1)}/5</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
