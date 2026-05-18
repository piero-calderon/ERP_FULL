import { CheckCircle2, Circle } from 'lucide-react';

interface Props {
  fecha: string;
  descripcion: string;
  isFirst?: boolean;
  isLast?: boolean;
  activo?: boolean;
  completado?: boolean;
}

export function PortalTimelineItem({ fecha, descripcion, isLast, activo, completado }: Props) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${completado ? 'bg-emerald-100' : activo ? 'bg-blue-100' : 'bg-slate-100'}`}>
          {completado
            ? <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            : <Circle className={`w-5 h-5 ${activo ? 'text-blue-600' : 'text-slate-400'}`} />
          }
        </div>
        {!isLast && <div className="w-0.5 flex-1 bg-slate-200 my-1" />}
      </div>
      <div className="pb-6">
        <p className={`text-sm font-medium ${completado || activo ? 'text-slate-800' : 'text-slate-500'}`}>{descripcion}</p>
        <p className="text-xs text-slate-400 mt-0.5">
          {new Date(fecha).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
}
