import { Play, RefreshCcw, Smartphone } from 'lucide-react';
import { fakeNotificationEngine } from '../services/fakeNotificationEngine.service';
import { renderTemplatePreview } from '../utils/templatePreview.utils';
import type { DeliveryJob, MessagingTemplate } from '../types/notificaciones.types';
import { StatusChip } from './StatusChip';

interface MessagingPanelProps {
  templates: MessagingTemplate[];
  jobs: DeliveryJob[];
  enqueueDeliveryJob: (job: DeliveryJob) => void;
  processJob: (job: DeliveryJob) => Promise<void>;
  retryDeliveryJob: (id: string) => void;
}

export function MessagingPanel({ templates, jobs, enqueueDeliveryJob, processJob, retryDeliveryJob }: MessagingPanelProps) {
  const messageJobs = jobs.filter((job) => job.channel === 'sms' || job.channel === 'whatsapp');

  const enqueueTemplate = (template: MessagingTemplate) => {
    enqueueDeliveryJob(fakeNotificationEngine.buildDeliveryJob(template.channel, '+51999000111', template.name, renderTemplatePreview(template.body)));
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_420px] gap-5">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {templates.map((template) => (
          <article key={template.id} className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <span className="rounded-xl bg-cyan-50 p-2 text-cyan-600"><Smartphone className="h-5 w-5" /></span>
              <span className="rounded-full bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600">{template.channel.toUpperCase()}</span>
            </div>
            <h3 className="mt-4 text-base font-bold text-slate-900">{template.name}</h3>
            <p className="mt-2 min-h-12 text-sm leading-6 text-slate-500">{renderTemplatePreview(template.body)}</p>
            <p className="mt-3 text-xs font-semibold text-slate-400">{template.provider}</p>
            <button onClick={() => enqueueTemplate(template)} className="mt-4 w-full rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-700">
              Encolar mensaje
            </button>
          </article>
        ))}
      </section>

      <aside className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Timeline de mensajes</h2>
        <div className="mt-4 space-y-3">
          {messageJobs.map((job) => (
            <div key={job.id} className="rounded-xl border border-slate-100 p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">{job.subject}</p>
                  <p className="text-xs text-slate-500">{job.provider} / intento {job.attempts}</p>
                </div>
                <StatusChip status={job.status} />
              </div>
              <p className="mt-2 text-sm text-slate-500">{job.payloadPreview}</p>
              <div className="mt-3 flex gap-2">
                <button onClick={() => processJob(job)} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-blue-200 hover:text-blue-600">
                  <Play className="h-3.5 w-3.5" />
                  Procesar
                </button>
                <button onClick={() => retryDeliveryJob(job.id)} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-amber-200 hover:text-amber-600">
                  <RefreshCcw className="h-3.5 w-3.5" />
                  Retry
                </button>
              </div>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
