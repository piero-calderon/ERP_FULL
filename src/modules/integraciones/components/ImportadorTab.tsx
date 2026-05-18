import { useState, useRef, useEffect } from 'react';
import { Upload, Download, FileText, AlertCircle, CheckCircle, Clock, XCircle, RefreshCw, X } from 'lucide-react';
import { ESTADO_JOB_CONFIG, TIPO_IMPORT_LABELS } from '../constants/integraciones.constants';
import type { ImportJob, ExportJob, TipoImport, FormatoImport } from '../types/integraciones.types';

interface Props {
  importJobs: ImportJob[];
  exportJobs: ExportJob[];
  onImport: (tipo: TipoImport, formato: FormatoImport, archivo: string) => Promise<void>;
  onExport: (tipo: TipoImport, formato: 'csv' | 'excel') => Promise<void>;
  onCancelar: (id: string) => Promise<void>;
  onRefrescar: () => Promise<void>;
}

const JOB_ICON = { pendiente: Clock, procesando: RefreshCw, completado: CheckCircle, error: XCircle, cancelado: X };

function ProgressBar({ pct, estado }: { pct: number; estado: string }) {
  const color = estado === 'completado' ? 'bg-emerald-500' : estado === 'error' ? 'bg-red-500' : 'bg-blue-500';
  return (
    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
      <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

function JobRow({ job, onCancelar }: { job: ImportJob; onCancelar: (id: string) => void }) {
  const cfg = ESTADO_JOB_CONFIG[job.estado] ?? ESTADO_JOB_CONFIG.pendiente;
  const Icon = JOB_ICON[job.estado] ?? Clock;
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="px-5 py-4 hover:bg-slate-50 transition-colors">
      <div className="flex items-start gap-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.bg}`}>
          <Icon className={`w-4 h-4 ${cfg.color} ${job.estado === 'procesando' ? 'animate-spin' : ''}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="text-sm font-semibold text-slate-800">{job.archivo}</p>
            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${cfg.bg} ${cfg.color}`}>{cfg.label}</span>
          </div>
          <p className="text-xs text-slate-500 mb-2">
            {TIPO_IMPORT_LABELS[job.tipo] ?? job.tipo} · {job.formato.toUpperCase()} · {new Date(job.creadoEn).toLocaleString('es-ES')}
          </p>
          {job.estado === 'procesando' && <ProgressBar pct={job.progress} estado={job.estado} />}
          {(job.estado === 'completado' || job.estado === 'error') && (
            <div className="flex gap-4 text-xs mt-1">
              <span className="text-emerald-600"><strong>{job.successRows}</strong> correctas</span>
              {job.errorRows > 0 && (
                <button onClick={() => setExpanded(!expanded)} className="text-red-600 hover:underline">
                  <strong>{job.errorRows}</strong> errores
                </button>
              )}
              <span className="text-slate-400">{job.totalRows} total</span>
            </div>
          )}
        </div>
        {job.estado === 'procesando' && (
          <button onClick={() => onCancelar(job.id)} className="text-xs text-slate-400 hover:text-red-500 flex items-center gap-1">
            <X className="w-3 h-3" /> Cancelar
          </button>
        )}
      </div>
      {expanded && job.errors.length > 0 && (
        <div className="mt-3 ml-12 bg-red-50 rounded-xl p-3 space-y-1.5">
          {job.errors.slice(0, 5).map((err, i) => (
            <div key={i} className="text-xs text-red-700">
              <span className="font-mono font-bold">Fila {err.fila}</span> · {err.campo}: {err.mensaje} <span className="text-red-400">(valor: "{err.valor}")</span>
            </div>
          ))}
          {job.errors.length > 5 && <p className="text-xs text-red-500">+{job.errors.length - 5} errores más</p>}
        </div>
      )}
    </div>
  );
}

function ExportRow({ job }: { job: ExportJob }) {
  const cfg = ESTADO_JOB_CONFIG[job.estado] ?? ESTADO_JOB_CONFIG.pendiente;
  const Icon = JOB_ICON[job.estado] ?? Clock;
  return (
    <div className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 text-sm">
      <Icon className={`w-4 h-4 flex-shrink-0 ${cfg.color} ${job.estado === 'procesando' ? 'animate-spin' : ''}`} />
      <div className="flex-1">
        <p className="font-medium text-slate-700">{TIPO_IMPORT_LABELS[job.tipo] ?? job.tipo}</p>
        <p className="text-xs text-slate-400">{job.formato.toUpperCase()} · {job.totalRows} registros · {new Date(job.creadoEn).toLocaleString('es-ES')}</p>
      </div>
      <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${cfg.bg} ${cfg.color}`}>{cfg.label}</span>
      {job.archivo && (
        <button className="flex items-center gap-1 text-xs text-blue-600 hover:underline">
          <Download className="w-3.5 h-3.5" /> Descargar
        </button>
      )}
    </div>
  );
}

const TIPOS: TipoImport[] = ['clientes','proveedores','productos','tarifarios','stock','pedidos','pagos'];
const FORMATOS: FormatoImport[] = ['csv','excel','json'];

export function ImportadorTab({ importJobs, exportJobs, onImport, onExport, onCancelar, onRefrescar }: Props) {
  const [activeTab, setActiveTab] = useState<'import' | 'export'>('import');
  const [tipo, setTipo] = useState<TipoImport>('clientes');
  const [formato, setFormato] = useState<FormatoImport>('csv');
  const [exportTipo, setExportTipo] = useState<TipoImport>('clientes');
  const [exportFormato, setExportFormato] = useState<'csv'|'excel'>('csv');
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const interval = setInterval(onRefrescar, 3000);
    return () => clearInterval(interval);
  }, [onRefrescar]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) setFileName(file.name);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFileName(file.name);
  };

  const handleImport = async () => {
    if (!fileName) return;
    setLoading(true);
    await onImport(tipo, formato, fileName);
    setFileName(null);
    setLoading(false);
  };

  const handleExport = async () => {
    setLoading(true);
    await onExport(exportTipo, exportFormato);
    setLoading(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex gap-1 bg-white border border-slate-200 rounded-xl p-1 w-fit">
        {(['import','export'] as const).map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`px-5 py-1.5 text-sm font-medium rounded-lg transition-colors capitalize ${activeTab === t ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>
            {t === 'import' ? 'Importar' : 'Exportar'}
          </button>
        ))}
      </div>

      {activeTab === 'import' && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {/* Upload zone */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-4">
            <p className="text-sm font-semibold text-slate-700">Nuevo Import</p>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-xs text-slate-500 block mb-1">Tipo de datos</label>
                <select value={tipo} onChange={e => setTipo(e.target.value as TipoImport)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {TIPOS.map(t => <option key={t} value={t}>{TIPO_IMPORT_LABELS[t]}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-500 block mb-1">Formato</label>
                <select value={formato} onChange={e => setFormato(e.target.value as FormatoImport)}
                  className="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {FORMATOS.map(f => <option key={f}>{f.toUpperCase()}</option>)}
                </select>
              </div>
            </div>

            <div
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors ${dragging ? 'border-blue-400 bg-blue-50' : 'border-slate-200 hover:border-slate-300'}`}
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}>
              <input ref={fileRef} type="file" className="hidden" accept=".csv,.xlsx,.json" onChange={handleFileChange} />
              {fileName ? (
                <div>
                  <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-slate-700">{fileName}</p>
                  <p className="text-xs text-slate-400 mt-1">Haz clic para cambiar archivo</p>
                </div>
              ) : (
                <div>
                  <Upload className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm text-slate-500">Arrastra aquí o haz clic para seleccionar</p>
                  <p className="text-xs text-slate-400 mt-1">CSV, Excel o JSON · Máx. 10 MB</p>
                </div>
              )}
            </div>

            <button onClick={handleImport} disabled={!fileName || loading}
              className="w-full py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              {loading ? 'Iniciando…' : 'Iniciar Importación'}
            </button>

            <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-100 rounded-xl">
              <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700">Los registros con errores se omitirán. Revisa el log de errores tras la importación.</p>
            </div>
          </div>

          {/* Job history */}
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-50 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-700">Historial de imports</p>
              <button onClick={onRefrescar} className="text-slate-400 hover:text-slate-600">
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
            <div className="divide-y divide-slate-50 max-h-96 overflow-y-auto">
              {importJobs.map(j => <JobRow key={j.id} job={j} onCancelar={onCancelar} />)}
              {importJobs.length === 0 && <p className="px-5 py-8 text-sm text-slate-400 text-center">Sin imports recientes</p>}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'export' && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-4">
            <p className="text-sm font-semibold text-slate-700">Nuevo Export</p>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-xs text-slate-500 block mb-1">Tipo de datos</label>
                <select value={exportTipo} onChange={e => setExportTipo(e.target.value as TipoImport)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {TIPOS.map(t => <option key={t} value={t}>{TIPO_IMPORT_LABELS[t]}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-500 block mb-1">Formato</label>
                <select value={exportFormato} onChange={e => setExportFormato(e.target.value as 'csv'|'excel')}
                  className="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="csv">CSV</option>
                  <option value="excel">Excel</option>
                </select>
              </div>
            </div>
            <button onClick={handleExport} disabled={loading}
              className="w-full py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
              <Download className="w-4 h-4" />
              {loading ? 'Generando…' : 'Generar Export'}
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-50">
              <p className="text-sm font-semibold text-slate-700">Historial de exports</p>
            </div>
            <div className="divide-y divide-slate-50">
              {exportJobs.map(j => <ExportRow key={j.id} job={j} />)}
              {exportJobs.length === 0 && <p className="px-5 py-8 text-sm text-slate-400 text-center">Sin exports recientes</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
