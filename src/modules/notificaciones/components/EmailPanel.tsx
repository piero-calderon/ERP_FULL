import { Eye, Palette, Play, Save, Send } from 'lucide-react';
import { fakeNotificationEngine } from '../services/fakeNotificationEngine.service';
import { renderTemplatePreview } from '../utils/templatePreview.utils';
import type { DeliveryJob, EmailTemplate } from '../types/notificaciones.types';
import { StatusChip } from './StatusChip';

interface EmailPanelProps {
  templates: EmailTemplate[];
  selectedTemplateId: string;
  jobs: DeliveryJob[];
  setSelectedTemplateId: (id: string) => void;
  upsertEmailTemplate: (template: EmailTemplate) => void;
  enqueueDeliveryJob: (job: DeliveryJob) => void;
  processJob: (job: DeliveryJob) => Promise<void>;
}

export function EmailPanel({ templates, selectedTemplateId, jobs, setSelectedTemplateId, upsertEmailTemplate, enqueueDeliveryJob, processJob }: EmailPanelProps) {
  const selected = templates.find((template) => template.id === selectedTemplateId) ?? templates[0];
  const emailJobs = jobs.filter((job) => job.channel === 'email');
  const previewSubject = selected ? renderTemplatePreview(selected.subject) : '';
  const previewPreheader = selected ? renderTemplatePreview(selected.preheader) : '';
  const previewHtml = selected ? renderTemplatePreview(selected.html) : '';

  const sendPreview = () => {
    if (!selected) return;
    enqueueDeliveryJob(fakeNotificationEngine.buildDeliveryJob('email', 'cliente.demo@empresa.test', previewSubject, previewPreheader));
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[360px_minmax(0,1fr)_360px] gap-5">
      <section className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Templates transaccionales</h2>
          <p className="text-xs text-slate-400">Previews con datos demo listos para negocio.</p>
        </div>
        <div className="mt-4 space-y-2">
          {templates.map((template) => (
            <button key={template.id} type="button" onClick={() => setSelectedTemplateId(template.id)} className={`w-full rounded-xl border px-3 py-3 text-left ${selected?.id === template.id ? 'border-blue-300 bg-blue-50' : 'border-slate-100 hover:border-blue-200'}`}>
              <p className="text-sm font-semibold text-slate-900">{template.name}</p>
              <p className="truncate text-xs text-slate-500">{renderTemplatePreview(template.subject)}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
        {selected && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Editor visual</h2>
                <p className="text-sm text-slate-500">{selected.name}</p>
              </div>
              <button onClick={sendPreview} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                <Send className="h-4 w-4" />
                Encolar prueba
              </button>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="space-y-1 text-xs font-semibold text-slate-500">Asunto preview
                <input value={previewSubject} onChange={(event) => upsertEmailTemplate({ ...selected, subject: event.target.value })} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-normal text-slate-800 outline-none focus:border-blue-400" />
              </label>
              <label className="space-y-1 text-xs font-semibold text-slate-500">Preheader
                <input value={previewPreheader} onChange={(event) => upsertEmailTemplate({ ...selected, preheader: event.target.value })} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-normal text-slate-800 outline-none focus:border-blue-400" />
              </label>
              <label className="space-y-1 text-xs font-semibold text-slate-500">Color primario
                <input type="color" value={selected.brandColor} onChange={(event) => upsertEmailTemplate({ ...selected, brandColor: event.target.value })} className="h-10 w-full rounded-xl border border-slate-200 bg-white px-2" />
              </label>
              <label className="space-y-1 text-xs font-semibold text-slate-500">Color acento
                <input type="color" value={selected.accentColor} onChange={(event) => upsertEmailTemplate({ ...selected, accentColor: event.target.value })} className="h-10 w-full rounded-xl border border-slate-200 bg-white px-2" />
              </label>
            </div>
            <label className="space-y-1 text-xs font-semibold text-slate-500">Contenido visual
              <textarea value={previewHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()} onChange={(event) => upsertEmailTemplate({ ...selected, html: `<p>${event.target.value}</p>` })} className="min-h-24 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-normal text-slate-800 outline-none focus:border-blue-400" />
            </label>
            <div className="rounded-2xl border border-slate-200 bg-slate-50/40 p-4" style={{ borderTopColor: selected.brandColor, borderTopWidth: 5 }}>
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-bold" style={{ color: selected.brandColor }}>START ERP</span>
                <Eye className="h-4 w-4 text-slate-400" />
              </div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">{previewSubject}</p>
              <div className="prose prose-sm max-w-none text-slate-700" dangerouslySetInnerHTML={{ __html: previewHtml }} />
              <div className="mt-4 rounded-xl px-3 py-2 text-xs text-white" style={{ backgroundColor: selected.accentColor }}>Preview con branding tenant</div>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Palette className="h-4 w-4" />
              <span>Persistencia automatica por localStorage, listo para provider real.</span>
              <Save className="h-4 w-4" />
            </div>
          </div>
        )}
      </section>

      <section className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Cola e historial</h2>
        <div className="mt-4 space-y-3">
          {emailJobs.map((job) => (
            <div key={job.id} className="rounded-xl border border-slate-100 p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">{job.subject}</p>
                  <p className="text-xs text-slate-500">{job.recipient}</p>
                </div>
                <StatusChip status={job.status} />
              </div>
              <button onClick={() => processJob(job)} className="mt-3 inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-blue-200 hover:text-blue-600">
                <Play className="h-3.5 w-3.5" />
                Procesar
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
