import { AlertTriangle, Truck, Users, Check, Eye, X, MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { useExecutiveDashboardStore } from "../store/dashboard.store";
import { useDashboardAlertsStore, type DashboardAlert } from "../store/dashboard-alerts.store";
import { cn } from "@/utils/utils";

export function CriticalAlerts() {
  const { stats } = useExecutiveDashboardStore();
  const { alerts, setAlerts, markAsRead, hideAlert } = useDashboardAlertsStore();
  const [selectedAlert, setSelectedAlert] = useState<DashboardAlert | null>(null);

  useEffect(() => {
    // Initializing alerts based on current stats
    const initialAlerts: DashboardAlert[] = [
      {
        id: 1,
        title: "Stock Crítico Detectado",
        description: `Hay ${stats.criticalStock} productos sin existencias en el depósito central.`,
        type: 'critical',
        isRead: false,
        isHidden: false,
        timestamp: new Date().toISOString(),
        details: "Los productos afectados incluyen: Detergente Industrial X, Desinfectante Plus. Se recomienda reabastecimiento inmediato."
      },
      {
        id: 2,
        title: "Retraso en Distribución",
        description: "2 entregas han superado el tiempo estimado en la zona CABA.",
        type: 'warning',
        isRead: false,
        isHidden: false,
        timestamp: new Date().toISOString(),
        details: "Causa: Congestión vehicular excesiva en la Av. General Paz. Unidades afectadas: R-102 y R-105."
      },
      {
        id: 3,
        title: "Saturación Logística",
        description: "Capacidad de flota al 95% para el turno tarde.",
        type: 'info',
        isRead: false,
        isHidden: false,
        timestamp: new Date().toISOString(),
        details: "Solo quedan 2 cupos disponibles para envíos express. Considere habilitar conductores de guardia."
      }
    ];
    setAlerts(initialAlerts);
  }, [stats.criticalStock, stats.activeDrivers, setAlerts]);

  const visibleAlerts = alerts.filter(a => !a.isHidden);

  return (
    <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-8 h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-bold text-slate-900">Alertas Inteligentes</h3>
        <div className="flex items-center gap-2">
           <span className="px-3 py-1 bg-rose-50 text-rose-600 text-[10px] font-bold rounded-full uppercase">Crítico</span>
           {visibleAlerts.length > 0 && (
             <span className="h-5 w-5 bg-slate-900 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
               {visibleAlerts.filter(a => !a.isRead).length}
             </span>
           )}
        </div>
      </div>

      <div className="space-y-4 flex-1">
        {visibleAlerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-slate-400">
             <Check className="h-12 w-12 mb-2 opacity-20" />
             <p className="text-sm font-medium">No hay alertas activas</p>
          </div>
        ) : (
          visibleAlerts.map((alert) => (
            <div 
              key={alert.id} 
              className={cn(
                "flex flex-col gap-3 p-4 rounded-2xl transition-all group relative border",
                alert.isRead ? "bg-white border-slate-100 opacity-60" : "bg-slate-50 border-transparent hover:bg-white hover:shadow-md"
              )}
            >
              <div className="flex gap-4">
                <div className={cn(
                  "h-12 w-12 rounded-xl flex items-center justify-center shrink-0",
                  alert.type === 'critical' ? "bg-rose-100 text-rose-600" : 
                  alert.type === 'warning' ? "bg-amber-100 text-amber-600" : 
                  "bg-indigo-100 text-indigo-600"
                )}>
                  {alert.id === 1 ? <AlertTriangle className="h-6 w-6" /> : 
                   alert.id === 2 ? <Truck className="h-6 w-6" /> : 
                   <Users className="h-6 w-6" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 text-sm">{alert.title}</h4>
                    {!alert.isRead && <div className="h-2 w-2 bg-blue-600 rounded-full animate-pulse" />}
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{alert.description}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-end gap-2 mt-2 pt-3 border-t border-slate-100/50 scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-300">
                 <button 
                  onClick={() => setSelectedAlert(alert)}
                  className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1 text-[10px] font-bold"
                  title="Ver detalle"
                 >
                   <Eye className="h-3 w-3" /> Detalle
                 </button>
                 {!alert.isRead && (
                   <button 
                    onClick={() => markAsRead(alert.id)}
                    className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors flex items-center gap-1 text-[10px] font-bold"
                    title="Marcar como leída"
                   >
                     <Check className="h-3 w-3" /> Leer
                   </button>
                 )}
                 <button 
                  onClick={() => hideAlert(alert.id)}
                  className="p-1.5 hover:bg-rose-50 rounded-lg text-rose-600 transition-colors flex items-center gap-1 text-[10px] font-bold"
                  title="Ocultar"
                 >
                   <X className="h-3 w-3" /> Ocultar
                 </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Alert Detail Modal Mock */}
      {selectedAlert && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-white rounded-[32px] w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-300">
              <div className="flex items-center justify-between mb-6">
                 <div className={cn(
                   "h-14 w-14 rounded-2xl flex items-center justify-center",
                   selectedAlert.type === 'critical' ? "bg-rose-100 text-rose-600" : 
                   selectedAlert.type === 'warning' ? "bg-amber-100 text-amber-600" : 
                   "bg-indigo-100 text-indigo-600"
                 )}>
                   <MessageSquare className="h-8 w-8" />
                 </div>
                 <button 
                  onClick={() => setSelectedAlert(null)}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                 >
                    <X className="h-6 w-6 text-slate-400" />
                 </button>
              </div>
              
              <h3 className="text-2xl font-extrabold text-slate-900 mb-2">{selectedAlert.title}</h3>
              <p className="text-slate-500 mb-6 leading-relaxed">{selectedAlert.description}</p>
              
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 mb-8">
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Información Adicional</p>
                 <p className="text-sm text-slate-700 leading-relaxed italic">"{selectedAlert.details}"</p>
              </div>
              
              <button 
                onClick={() => setSelectedAlert(null)}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all active:scale-[0.98]"
              >
                Entendido
              </button>
           </div>
        </div>
      )}
    </div>
  );
}
