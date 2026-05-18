import { Clock, Languages, SlidersHorizontal, ToggleLeft, ToggleRight } from 'lucide-react';
import { CHANNEL_LABELS, CATEGORY_LABELS } from '../constants/notificaciones.constants';
import type { NotificationRule, UserPreference } from '../types/notificaciones.types';

interface RulesPanelProps {
  rules: NotificationRule[];
  preferences: UserPreference[];
  toggleRule: (id: string) => void;
  updatePreference: (preference: UserPreference) => void;
}

export function RulesPanel({ rules, preferences, toggleRule, updatePreference }: RulesPanelProps) {
  const preference = preferences[0];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_420px] gap-5">
      <section className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Reglas automaticas</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {rules.map((rule) => (
            <article key={rule.id} className="rounded-xl border border-slate-100 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-slate-900">{rule.eventName}</p>
                  <p className="text-xs text-slate-500">{rule.automation} / prioridad {rule.priority}</p>
                </div>
                <button onClick={() => toggleRule(rule.id)} className={rule.active ? 'text-emerald-600' : 'text-slate-400'}>
                  {rule.active ? <ToggleRight className="h-7 w-7" /> : <ToggleLeft className="h-7 w-7" />}
                </button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {rule.channels.map((channel) => (
                  <span key={channel} className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">{CHANNEL_LABELS[channel]}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <aside className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-blue-500" />
          <h2 className="text-lg font-bold text-slate-900">Preferencias</h2>
        </div>
        {preference && (
          <div className="mt-4 space-y-4">
            <label className="space-y-1 text-xs font-semibold text-slate-500">Canal favorito
              <select value={preference.favoriteChannel} onChange={(event) => updatePreference({ ...preference, favoriteChannel: event.target.value as UserPreference['favoriteChannel'] })} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-normal text-slate-800 outline-none focus:border-blue-400">
                {Object.entries(CHANNEL_LABELS).map(([channel, label]) => <option key={channel} value={channel}>{label}</option>)}
              </select>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="space-y-1 text-xs font-semibold text-slate-500">Desde
                <input value={preference.allowedHours.from} onChange={(event) => updatePreference({ ...preference, allowedHours: { ...preference.allowedHours, from: event.target.value } })} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-normal text-slate-800 outline-none focus:border-blue-400" />
              </label>
              <label className="space-y-1 text-xs font-semibold text-slate-500">Hasta
                <input value={preference.allowedHours.to} onChange={(event) => updatePreference({ ...preference, allowedHours: { ...preference.allowedHours, to: event.target.value } })} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-normal text-slate-800 outline-none focus:border-blue-400" />
              </label>
            </div>
            <div className="space-y-2">
              {Object.entries(preference.granular).map(([category, enabled]) => (
                <label key={category} className="flex items-center justify-between rounded-xl border border-slate-100 px-3 py-2">
                  <span className="text-sm font-semibold text-slate-700">{CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS]}</span>
                  <input type="checkbox" checked={enabled} onChange={(event) => updatePreference({ ...preference, granular: { ...preference.granular, [category]: event.target.checked } })} />
                </label>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs text-slate-500">
              <div className="rounded-xl bg-slate-50 p-3"><Clock className="mb-2 h-4 w-4 text-slate-400" />Ventanas horarias locales</div>
              <div className="rounded-xl bg-slate-50 p-3"><Languages className="mb-2 h-4 w-4 text-slate-400" />Idioma {preference.language.toUpperCase()}</div>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
