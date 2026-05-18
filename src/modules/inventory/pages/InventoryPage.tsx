// Modulo 5 - Almacen WMS - InventoryPage extendida con tabs
import { useEffect, useState } from "react";
import { Warehouse, Package, ArrowRightLeft, AlertTriangle, Filter, RefreshCw, BarChart2, Layers, ClipboardList, Truck, Sliders, Clock } from "lucide-react";
import { useProductsStore } from "@/modules/inventory/store/products.store";
import { useWmsStore } from "../store/wms.store";
import { DataTable } from "@/shared/components/data/DataTable";
import type { TableColumn } from "@/types/common.types";
import type { Product } from "@/modules/inventory/types/product.types";
import { KPICard } from "@/shared/components/visuals/kpi/KPICard";
import { StatusBadge } from "@/shared/components/visuals/status/StatusBadge";
import { SearchInput } from "@/shared/components/data/filters/SearchInput";
import { cn } from "@/utils/utils";
import { LotesTab } from "./tabs/LotesTab";
import { KardexTab } from "./tabs/KardexTab";
import { PickingTab } from "./tabs/PickingTab";
import { TrasladosTab } from "./tabs/TrasladosTab";
import { AjustesTab } from "./tabs/AjustesTab";
import { CaducidadesTab } from "./tabs/CaducidadesTab";

const tabs = [
  { id: "stock",       label: "Stock",       icon: Warehouse },
  { id: "lotes",       label: "Lotes",       icon: Layers },
  { id: "kardex",      label: "Kardex",      icon: ClipboardList },
  { id: "picking",     label: "Picking",     icon: Package },
  { id: "traslados",   label: "Traslados",   icon: Truck },
  { id: "ajustes",     label: "Ajustes",     icon: Sliders },
  { id: "caducidades", label: "Caducidades", icon: Clock },
];

export default function InventoryPage() {
  const { products, isLoading, fetchProducts, stats } = useProductsStore();
  const { tabActiva, setTabActiva } = useWmsStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroOpen, setFiltroOpen] = useState(false);
  const [filtroAlmacen, setFiltroAlmacen] = useState("Todos");

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const columns: TableColumn<Product>[] = [
    { key: "sku", header: "SKU", render: (p) => <span className="font-mono font-bold text-slate-900">{p.sku}</span> },
    { key: "name", header: "Producto", render: (p) => (
      <div className="flex flex-col">
        <span className="font-semibold text-slate-900">{p.name}</span>
        <span className="text-[10px] font-bold text-slate-400 uppercase">{p.category}</span>
      </div>
    )},
    { key: "stock", header: "Stock Actual", render: (p) => (
      <div className={cn("inline-flex px-2.5 py-1 rounded-lg text-xs font-bold",
        p.stock <= 0 ? "bg-rose-50 text-rose-600" :
        p.stock <= p.minimumStock ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600")}>
        {p.stock} {p.unitType}
      </div>
    )},
    { key: "value", header: "Valor Estimado", render: (p) => <span className="font-bold text-slate-900">${(p.stock * p.price).toLocaleString()}</span> },
    { key: "status", header: "Estado", render: (p) => (
      <StatusBadge
        label={p.stock <= 0 ? "SIN STOCK" : p.stock <= p.minimumStock ? "BAJO STOCK" : "SALUDABLE"}
        type={p.stock <= 0 ? "error" : p.stock <= p.minimumStock ? "warning" : "success"}
      />
    )},
    { key: "actions", header: "", render: () => (
      <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
        <ArrowRightLeft className="h-4 w-4" />
      </button>
    )},
  ];

  // Filtro combinado: busqueda por texto + filtro por almacen
  const productosFiltrados = products.filter(p => {
    const matchSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchAlmacen =
      filtroAlmacen === "Todos" ||
      (p as any).warehouse === filtroAlmacen ||
      (p as any).almacen === filtroAlmacen ||
      (p as any).warehouseName === filtroAlmacen;
    return matchSearch && matchAlmacen;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Control de Inventario</h1>
          <p className="text-slate-500 mt-1">Monitoreo de existencias, valoracion de almacen y reposicion.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setTabActiva("ajustes")} className="flex items-center gap-2 px-6 py-2.5 bg-slate-100 text-slate-900 rounded-xl text-sm font-bold hover:bg-slate-200 transition-all active:scale-95">Ajuste Manual</button>
          <button className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95">
            <RefreshCw className="h-4 w-4" />Sincronizar
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <KPICard title="Valor Total Almacen" value={`$${stats.totalValue.toLocaleString()}`} icon={Warehouse} color="blue" />
        <KPICard title="Productos Criticos" value={stats.critical} icon={AlertTriangle} color="rose" />
        <KPICard title="Stock Bajo" value={stats.lowStock} icon={Package} color="amber" />
        <KPICard title="Rotacion Mensual" value="68%" icon={BarChart2} color="emerald" />
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

      {tabActiva === "stock" && (
        <>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-[32px] border border-slate-100 shadow-sm">
            <SearchInput value={searchTerm} onChange={setSearchTerm} placeholder="Buscar producto por SKU o nombre..." className="md:max-w-md" />
            <div className="relative">
              <button
                onClick={() => setFiltroOpen(f => !f)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 border rounded-xl text-sm font-semibold transition-all",
                  filtroAlmacen !== "Todos"
                    ? "border-blue-300 bg-blue-50 text-blue-700"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                )}>
                <Filter className="h-4 w-4" />
                {filtroAlmacen === "Todos" ? "Filtrar Almacen" : filtroAlmacen}
              </button>
              {filtroOpen && (
                <div className="absolute right-0 top-12 bg-white border border-slate-200 rounded-xl shadow-xl z-10 w-52 p-2">
                  <p className="text-xs font-bold text-slate-400 px-2 py-1 mb-1">SELECCIONAR ALMACEN</p>
                  {["Todos", "Almacen Central", "Almacen Secundario", "Almacen Norte"].map(a => (
                    <button key={a}
                      onClick={() => { setFiltroAlmacen(a); setFiltroOpen(false); }}
                      className={cn(
                        "w-full text-left px-3 py-2 text-sm rounded-lg transition-colors",
                        filtroAlmacen === a
                          ? "bg-blue-50 text-blue-700 font-semibold"
                          : "hover:bg-slate-50 text-slate-700"
                      )}>
                      {a}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <DataTable
            columns={columns}
            data={productosFiltrados}
            isLoading={isLoading}
          />
        </>
      )}
      {tabActiva === "lotes"       && <LotesTab />}
      {tabActiva === "kardex"      && <KardexTab />}
      {tabActiva === "picking"     && <PickingTab />}
      {tabActiva === "traslados"   && <TrasladosTab />}
      {tabActiva === "ajustes"     && <AjustesTab />}
      {tabActiva === "caducidades" && <CaducidadesTab />}
    </div>
  );
}
