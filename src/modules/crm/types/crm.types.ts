// ─── Enumerations ────────────────────────────────────────────────────────────

export type OpportunityStage =
  | 'lead'
  | 'calificado'
  | 'propuesta'
  | 'negociacion'
  | 'ganado'
  | 'perdido';

export type ActivityType = 'llamada' | 'visita' | 'reunion' | 'email' | 'tarea';
export type ActivityStatus = 'pendiente' | 'completada' | 'cancelada';

export type EvaluationStatus = 'pendiente' | 'aprobado' | 'condicionado' | 'rechazado';

export type TariffType = 'base' | 'cliente' | 'canal' | 'zona';
export type ClientChannel = 'HORECA' | 'retail' | 'industrial' | 'hospital' | 'educacion';

export type HistoryEventType =
  | 'pedido'
  | 'factura'
  | 'cotizacion'
  | 'reclamo'
  | 'devolucion'
  | 'evaluacion'
  | 'llamada'
  | 'visita'
  | 'documento';

// ─── Opportunity (Pipeline) ───────────────────────────────────────────────────

export interface StageHistoryEntry {
  stage: OpportunityStage;
  date: string;
  note?: string;
}

export interface Opportunity {
  id: string;
  clientId: string;
  clientName: string;
  title: string;
  estimatedValue: number;
  probability: number;
  expectedCloseDate: string;
  owner: string;
  stage: OpportunityStage;
  products: string[];
  lossReason?: string;
  notes?: string;
  stageHistory: StageHistoryEntry[];
  createdAt: string;
  updatedAt: string;
}

// ─── Commercial Activity ──────────────────────────────────────────────────────

export interface Activity {
  id: string;
  type: ActivityType;
  clientId: string;
  clientName: string;
  opportunityId?: string;
  title: string;
  date: string;
  duration?: number;
  result?: string;
  nextSteps?: string;
  status: ActivityStatus;
  assignedTo: string;
  createdAt: string;
}

// ─── Client Evaluation & Onboarding ──────────────────────────────────────────

export interface ClientEvaluation {
  id: string;
  clientId: string;
  clientName: string;
  activity: string;
  yearsInBusiness: number;
  score: number;
  status: EvaluationStatus;
  approvedBy?: string;
  rejectionReason?: string;
  proposedCreditLimit: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Tariff / Price List ──────────────────────────────────────────────────────

export interface TariffRule {
  id: string;
  productName: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minQuantity?: number;
}

export interface TariffPromotion {
  id: string;
  description: string;
  type: '2x1' | 'percentage' | 'regalo';
  value: number;
  validFrom: string;
  validTo: string;
}

export interface Tariff {
  id: string;
  name: string;
  type: TariffType;
  targetName?: string;
  currency: string;
  rules: TariffRule[];
  promotions: TariffPromotion[];
  requiresApproval: boolean;
  isActive: boolean;
  priority: number;
  createdAt: string;
}

// ─── Segmentation ─────────────────────────────────────────────────────────────

export interface SegmentCondition {
  field: string;
  operator: string;
  value: string;
  label: string;
}

export interface Segment {
  id: string;
  name: string;
  description: string;
  conditions: SegmentCondition[];
  clientCount: number;
  lastUpdated: string;
  color: string;
}

// ─── 360° History ─────────────────────────────────────────────────────────────

export interface HistoryEvent {
  id: string;
  clientId: string;
  type: HistoryEventType;
  title: string;
  description: string;
  value?: number;
  date: string;
  by: string;
}

export interface ClientKPIs {
  clientId: string;
  clientName: string;
  zone: string;
  avgTicket: number;
  ordersPerMonth: number;
  lastOrderDate: string;
  daysSinceLastOrder: number;
  marginContribution: number;
  totalRevenue: number;
  totalOrders: number;
  claimRate: number;
}
