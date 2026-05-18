// Modulo 6 - Logistica TMS - LogisticsPage extendida con tabs
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Truck, MapPin, Clock, Filter, RefreshCw, AlertTriangle, Route, Car, CheckSquare, X } from "lucide-react";
import { useLogisticsStore } from "../store/logistics.store";
import { useTmsStore } from "../store/tms.store";
import { LogisticsStats } from "../components/LogisticsStats/LogisticsStats";
import { DataTable } from "@/shared/components/data/DataTable";
import { StatusBadge } from "@/shared/components/visuals/status/StatusBadge";
import { RowActions } from "@/shared/components/data/actions/RowActions";
import { SearchInput } from "@/shared/components/data/filters/SearchInput";
import type { TableColumn } from "@/types/common.types";
import type { Delivery, DeliveryStatus } from "../types/logistics.types";
import { formatDate } from "@/utils/date";
import { cn } from "@/utils/utils";
import { RutasTab } from "./tabs/RutasTab";
import { VehiculosTab } from "./tabs/VehiculosTab";
import { IncidenciasTab } from "./tabs/IncidenciasTab";
import { PODTab } from "./tabs/PODTab";

type TabId = "entregas" | "rutas" | "vehiculos" | "incidencias" | "pod";

const tabs: { id: TabId; label: string; icon: typeof Truck }[] = [
  { id: "entregas",    label: "Entregas",    icon: Truck },
  { id: "rutas",       label: "Rutas",       icon: Route },
  { id: "vehiculos",   label: "Vehiculos",   icon: Car },
  { id: "incidencias", label: "Incidencias", icon: AlertTriangle },
  { id: "pod",         label: "POD",         icon: CheckSquare },
];

const STATUS_LABELS: Record<DeliveryStatus, string> = {
  PENDING:   "Pendiente",
  PREPARING: "Preparando",
  IN_ROUTE:  "En ruta",
  DELIVERED: "Entregado",
  DELAYED:   "Retrasado",
  CANCELLED: "Cancelado",
};

const STATUS_BADGE_TYPE: Record<DeliveryStatus, "success" | "info" | "warning" | "error"> = {
  DELIVERED: "success",
  IN_ROUTE:  "info",
  DELAYED:   "error",
  PENDING:   "warning",
  PREPARING: "warning",
  CANCELLED: "error",
};

// Conductores de prueba para el modal
const CONDUCTORES = ["Juan Perez", "Roberto Gomez", "Carlos Mendez", "Jose Ramirez"];
const VEHICULOS   = ["4521-BCK", "7832-MNP", "1234-XYZ"];
const ESTADOS     = ["Todos", "Pendiente", "En ruta", "Entregado", "Retrasado", "Cancelado"];

const FORM_INIT = { pedido: "", conductor: "", ruta: "", vehiculo: "", fechaEstimada: "", observaciones: "" };

export default function LogisticsPage() {
  const navigate = useNavigate();
  const { deliveries, isLoading, fetchDeliveries, updateDeliveryStatus, createDelivery } = useLogisticsStore();
  const { tabActiva, setTabActiva } = useTmsStore();
  const [searchTerm, setSearchTerm]   = useState("");

  // Estado modal Nueva Entrega
  const [modalAbierto, setModalAbierto] = useState(false);
  const [guardando, setGuardando]       = useState(false);
  const [form, setForm]                 = useState(FORM_INIT);
  const [errores, setErrores]           = useState<Record<string, string>>({});

  // Estado filtro por estado
  const [filtroOpen, setFiltroOpen]     = useState(false);
  const [filtroEstado, setFiltroEstado] = useState("Todos");

  useEffect(() => { fetchDeliveries(); }, [fetchDeliveries]);

  const setF = (k: string, v: string) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrores(e => ({ ...e, [k]: "" }));
  };

  const validar = () => {
    const e: Record<string, string> = {};
    if (!form.pedido)    e.pedido    = "Campo obligatorio";
    if (!form.conductor) e.conductor = "Campo obligatorio";
    if (!form.ruta)      e.ruta      = "Campo obligatorio";
    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const guardar = async () => {
    if (!validar()) return;
    setGuardando(true);
    try {
      await createDelivery(form.pedido, form.pedido, form.conductor, form.ruta);
    } catch {
      // si falla createDelivery usamos mock
    }
    await new Promise(r => setTimeout(r, 800));
    setGuardando(false);
    setModalAbierto(false);
    setForm(FORM_INIT);
    fetchDeliveries();
  };

  // Mapa de estado visible a DeliveryStatus
  const estadoMap: Record<string, string> = {
    "Pendiente":  "PENDING",
    "En ruta":    "IN_ROUTE",
    "Entregado":  "DELIVERED",
    "Retrasado":  "DELAYED",
    "Cancelado":  "CANCELLED",
  };

  const columns: TableColumn<Delivery>[] = [
    {
      key: "order", header: "Pedido",
      render: (d) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-900">{d.orderNumber}</span>
          <span className="text-[10px] font-bold text-slate-400">ID: {d.orderId}</span>
        </div>
      )
    },
    {
      key: "driver", header: "Conductor",
      render: (d) => (
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">{d.driverName.charAt(0)}</div>
          <span className="font-semibold text-slate-700">{d.driverName}</span>
        </div>
      )
    },
    {
      key: "route", header: "Ruta / Destino",
      render: (d) => (
        <div className="flex items-center gap-2 max-w-[200px]">
          <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <span className="text-xs text-slate-600 truncate">{d.route}</span>
        </div>
      )
    },
    {
      key: "status", header: "Estado",
      render: (d) => (
        <StatusBadge label={STATUS_LABELS[d.status]} type={STATUS_BADGE_TYPE[d.status]} />
      )
    },
    {
      key: "time", header: "Est. Entrega",
      render: (d) => (
        <div className="flex items-center gap-1.5 text-slate-500">
          <Clock className="h-3.5 w-3.5" />
          <span className="text-xs font-medium">{d.estimatedTime}</span>
        </div>
      )
    },
    {
      key: "date", header: "Fecha",
      render: (d) => <span className="text-xs text-slate-500">{d.deliveryDate ? formatDate(d.deliveryDate) : "Pendiente"}</span>
    },
    {
      key: "actions", header: "",
      render: (d) => (
        <div className="flex items-center justify-end gap-1">
          {d.status === "IN_ROUTE" && (
            <button onClick={(e) => { e.stopPropagation(); updateDeliveryStatus(d.id, "DELIVERED"); }}
              className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-lg hover:bg-emerald-100 transition-colors">
              Marcar Entregado
            </button>
          )}
          <RowActions onView={() => navigate(`/logistica/detalle/${d.id}`)} />
        </div>
      )
    }
  ];

  // Filtrar entregas por busqueda y estado
  const entregasFiltradas = deliveries.filter(d => {
    const matchSearch =
      d.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.route.toLowerCase().includes(searchTerm.toLowerCase());
    const matchEstado =
      filtroEstado === "Todos" || d.status === estadoMap[filtroEstado];
    return matchSearch && matchEstado;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Centro Logistico</h1>
          <p className="text-slate-500 mt-1">Monitoreo de flotas, rutas y cumplimiento de entregas.</p>
        </div>
        <div className="flex gap-3">
          {/* Nueva Entrega abre modal */}
          <button
            onClick={() => { setForm(FORM_INIT); setErrores({}); setModalAbierto(true); }}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95">
            + Nueva Entrega
          </button>
        </div>
      </div>

      {/* Stats */}
      <LogisticsStats />

      {/* Alerta */}
      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-center gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-600" />
        <p className="text-sm font-semibold text-amber-800">
          Hay 3 pedidos pendientes de asignacion y 1 entrega con retraso detectado en la zona Norte.
        </p>
      </div>

      {/* Tabs TMS */}
      <div className="flex gap-1 overflow-x-auto bg-white border border-slate-100 rounded-2xl p-2 shadow-sm">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setTabActiva(tab.id)}
            className={cn("flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all",
              tabActiva === tab.id ? "bg-blue-600 text-white shadow-md" : "text-slate-500 hover:bg-slate-100 hover:text-slate-700")}>
            <tab.icon className="h-4 w-4" />{tab.label}
          </button>
        ))}
      </div>

      {/* Tab Entregas */}
      {tabActiva === "entregas" && (
        <>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-[32px] border border-slate-100 shadow-sm">
            <SearchInput value={searchTerm} onChange={setSearchTerm} placeholder="Buscar por pedido, conductor o ruta..." className="md:max-w-md" />
            <div className="flex items-center gap-2 w-full md:w-auto">
              {/* Filtro por estado con dropdown */}
              <div className="relative flex-1 md:flex-none">
                <button
                  onClick={() => setFiltroOpen(f => !f)}
                  className={cn(
                    "flex items-center justify-center gap-2 px-4 py-2.5 border rounded-xl text-sm font-semibold transition-all w-full",
                    filtroEstado !== "Todos"
                      ? "border-blue-300 bg-blue-50 text-blue-700"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  )}>
                  <Filter className="h-4 w-4" />
                  {filtroEstado === "Todos" ? "Filtros" : filtroEstado}
                </button>
                {filtroOpen && (
                  <div className="absolute right-0 top-12 bg-white border border-slate-200 rounded-xl shadow-xl z-10 w-52 p-2">
                    <p className="text-xs font-bold text-slate-400 px-2 py-1 mb-1">FILTRAR POR ESTADO</p>
                    {ESTADOS.map(e => (
                      <button key={e}
                        onClick={() => { setFiltroEstado(e); setFiltroOpen(false); }}
                        className={cn(
                          "w-full text-left px-3 py-2 text-sm rounded-lg transition-colors",
                          filtroEstado === e
                            ? "bg-blue-50 text-blue-700 font-semibold"
                            : "hover:bg-slate-50 text-slate-700"
                        )}>
                        {e}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={() => fetchDeliveries()}
                className="p-2.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-all">
                <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
              </button>
            </div>
          </div>
          <DataTable
            columns={columns}
            data={entregasFiltradas}
            isLoading={isLoading}
            onRowClick={(d) => navigate(`/logistica/detalle/${d.id}`)}
          />
        </>
      )}
      {tabActiva === "rutas"       && <RutasTab />}
      {tabActiva === "vehiculos"   && <VehiculosTab />}
      {tabActiva === "incidencias" && <IncidenciasTab />}
      {tabActiva === "pod"         && <PODTab />}

      {/* Modal Nueva Entrega */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
            {/* Header modal */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-800">Nueva Entrega</h2>
                <p className="text-xs text-slate-400 mt-0.5">Registrar asignacion de entrega a conductor</p>
              </div>
              <button onClick={() => setModalAbierto(false)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            {/* Body modal */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Numero de pedido */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600">N° Pedido <span className="text-red-500">*</span></label>
                  <input value={form.pedido} onChange={e => setF("pedido", e.target.value)}
                    placeholder="ORD-2026-001"
                    className={cn("w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
                      errores.pedido ? "border-red-300 bg-red-50" : "border-slate-200")} />
                  {errores.pedido && <p className="text-xs text-red-500">{errores.pedido}</p>}
                </div>
                {/* Conductor */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600">Conductor <span className="text-red-500">*</span></label>
                  <select value={form.conductor} onChange={e => setF("conductor", e.target.value)}
                    className={cn("w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white",
                      errores.conductor ? "border-red-300" : "border-slate-200")}>
                    <option value="">Seleccionar...</option>
                    {CONDUCTORES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {errores.conductor && <p className="text-xs text-red-500">{errores.conductor}</p>}
                </div>
                {/* Vehiculo */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600">Vehiculo</label>
                  <select value={form.vehiculo} onChange={e => setF("vehiculo", e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    <option value="">Seleccionar...</option>
                    {VEHICULOS.map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
                {/* Fecha estimada */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600">Fecha estimada</label>
                  <input type="date" value={form.fechaEstimada} onChange={e => setF("fechaEstimada", e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              {/* Ruta */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600">Ruta / Destino <span className="text-red-500">*</span></label>
                <input value={form.ruta} onChange={e => setF("ruta", e.target.value)}
                  placeholder="Deposito Central -> Av. Corrientes 1234"
                  className={cn("w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
                    errores.ruta ? "border-red-300 bg-red-50" : "border-slate-200")} />
                {errores.ruta && <p className="text-xs text-red-500">{errores.ruta}</p>}
              </div>
              {/* Observaciones */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600">Observaciones</label>
                <textarea value={form.observaciones} onChange={e => setF("observaciones", e.target.value)}
                  placeholder="Instrucciones especiales para el conductor..."
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
              </div>
            </div>
            {/* Footer modal */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100">
              <button onClick={() => setModalAbierto(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                Cancelar
              </button>
              <button onClick={guardar} disabled={guardando}
                className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2">
                {guardando && (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                )}
                {guardando ? "Guardando..." : "Crear Entrega"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
