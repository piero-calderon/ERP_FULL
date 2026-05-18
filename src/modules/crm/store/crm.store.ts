import { create } from 'zustand';
import type {
  Opportunity,
  Activity,
  ClientEvaluation,
  Tariff,
  Segment,
  HistoryEvent,
  ClientKPIs,
  OpportunityStage,
  EvaluationStatus,
} from '../types/crm.types';
import {
  MOCK_OPPORTUNITIES,
  MOCK_ACTIVITIES,
  MOCK_EVALUATIONS,
  MOCK_TARIFFS,
  MOCK_SEGMENTS,
  MOCK_HISTORY_EVENTS,
  MOCK_CLIENT_KPIS,
} from '../mocks/crm.mock';

// ─── Pipeline Stats ───────────────────────────────────────────────────────────

export interface PipelineStats {
  totalOpportunities: number;
  winRate: number;
  pipelineValue: number;
  avgDealValue: number;
  activitiesThisWeek: number;
}

// ─── Store Interface ──────────────────────────────────────────────────────────

interface CRMState {
  opportunities: Opportunity[];
  activities: Activity[];
  evaluations: ClientEvaluation[];
  tariffs: Tariff[];
  segments: Segment[];
  historyEvents: HistoryEvent[];
  clientKPIs: ClientKPIs[];
  stats: PipelineStats;
  selectedClientId: string;
  isLoading: boolean;

  // Actions
  fetchCRM: () => Promise<void>;
  moveOpportunity: (id: string, stage: OpportunityStage) => void;
  completeActivity: (id: string, result: string, nextSteps?: string) => void;
  updateEvaluationStatus: (id: string, status: EvaluationStatus, note?: string) => void;
  toggleTariff: (id: string) => void;
  setSelectedClient: (clientId: string) => void;
}

// ─── Store ────────────────────────────────────────────────────────────────────

function computeStats(
  opportunities: Opportunity[],
  activities: Activity[],
): PipelineStats {
  const closed = opportunities.filter(o => o.stage === 'ganado' || o.stage === 'perdido');
  const won = opportunities.filter(o => o.stage === 'ganado');
  const active = opportunities.filter(o => o.stage !== 'ganado' && o.stage !== 'perdido');

  const winRate = closed.length > 0 ? Math.round((won.length / closed.length) * 100) : 0;
  const pipelineValue = active.reduce((s, o) => s + o.estimatedValue, 0);
  const avgDealValue = active.length > 0 ? Math.round(pipelineValue / active.length) : 0;

  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 7);
  const activitiesThisWeek = activities.filter(
    a => new Date(a.date) >= weekStart,
  ).length;

  return {
    totalOpportunities: opportunities.length,
    winRate,
    pipelineValue,
    avgDealValue,
    activitiesThisWeek,
  };
}

export const useCRMStore = create<CRMState>((set, get) => ({
  opportunities: [],
  activities: [],
  evaluations: [],
  tariffs: [],
  segments: [],
  historyEvents: [],
  clientKPIs: [],
  stats: { totalOpportunities: 0, winRate: 0, pipelineValue: 0, avgDealValue: 0, activitiesThisWeek: 0 },
  selectedClientId: '4',
  isLoading: false,

  fetchCRM: async () => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 600));
    const opportunities = MOCK_OPPORTUNITIES;
    const activities = MOCK_ACTIVITIES;
    set({
      opportunities,
      activities,
      evaluations: MOCK_EVALUATIONS,
      tariffs: MOCK_TARIFFS,
      segments: MOCK_SEGMENTS,
      historyEvents: MOCK_HISTORY_EVENTS,
      clientKPIs: MOCK_CLIENT_KPIS,
      stats: computeStats(opportunities, activities),
      isLoading: false,
    });
  },

  moveOpportunity: (id, stage) => {
    set(state => {
      const updated = state.opportunities.map(o => {
        if (o.id !== id) return o;
        return {
          ...o,
          stage,
          probability: stage === 'ganado' ? 100 : stage === 'perdido' ? 0 : o.probability,
          stageHistory: [...o.stageHistory, { stage, date: new Date().toISOString() }],
          updatedAt: new Date().toISOString(),
        };
      });
      return { opportunities: updated, stats: computeStats(updated, state.activities) };
    });
  },

  completeActivity: (id, result, nextSteps) => {
    set(state => ({
      activities: state.activities.map(a =>
        a.id === id ? { ...a, status: 'completada', result, nextSteps } : a,
      ),
    }));
  },

  updateEvaluationStatus: (id, status, note) => {
    set(state => ({
      evaluations: state.evaluations.map(e => {
        if (e.id !== id) return e;
        return {
          ...e,
          status,
          rejectionReason: status === 'rechazado' ? (note ?? e.rejectionReason) : e.rejectionReason,
          approvedBy: status === 'aprobado' ? 'Usuario Actual' : e.approvedBy,
          updatedAt: new Date().toISOString(),
        };
      }),
    }));
  },

  toggleTariff: (id) => {
    set(state => ({
      tariffs: state.tariffs.map(t => t.id === id ? { ...t, isActive: !t.isActive } : t),
    }));
  },

  setSelectedClient: (clientId) => {
    set({ selectedClientId: clientId });
  },
}));
