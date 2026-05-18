// ─── Quote ────────────────────────────────────────────────────────────────────

export type QuoteStatus = 'borrador' | 'enviada' | 'aceptada' | 'rechazada' | 'expirada';

export interface QuoteLine {
  id: string;
  productId: string;
  sku: string;
  name: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  subtotal: number;
  tax: number;
  total: number;
}

export interface Quote {
  id: string;
  quoteNumber: string;
  clientId: string;
  clientName: string;
  clientZone: string;
  status: QuoteStatus;
  lines: QuoteLine[];
  subtotal: number;
  discount: number;
  taxes: number;
  total: number;
  validUntil: string;
  notes?: string;
  createdAt: string;
  createdBy: string;
  convertedToOrderId?: string;
}

// ─── Sales Order ──────────────────────────────────────────────────────────────

export type SalesOrderStatus =
  | 'borrador' | 'pendiente_aprobacion' | 'aprobado'
  | 'en_preparacion' | 'listo_despacho' | 'en_ruta'
  | 'entregado' | 'facturado' | 'cerrado' | 'cancelado' | 'devuelto';

export type OrderType = 'puntual' | 'recurrente' | 'urgente';

export interface SalesOrderLine {
  id: string;
  productId: string;
  sku: string;
  name: string;
  quantity: number;
  reservedQty: number;
  backorderQty: number;
  lot?: string;
  unitPrice: number;
  discount: number;
  subtotal: number;
  tax: number;
  total: number;
}

export interface SalesOrder {
  id: string;
  orderNumber: string;
  quoteId?: string;
  clientId: string;
  clientName: string;
  clientZone: string;
  deliveryAddress: string;
  deliveryDate: string;
  deliveryTimeFrom: string;
  deliveryTimeTo: string;
  orderType: OrderType;
  status: SalesOrderStatus;
  lines: SalesOrderLine[];
  subtotal: number;
  discount: number;
  taxes: number;
  total: number;
  creditValidated: boolean;
  requiresApproval: boolean;
  assignedTo: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Recurring Order ──────────────────────────────────────────────────────────

export type RecurringFrequency = 'semanal' | 'quincenal' | 'mensual';

export interface RecurringOrder {
  id: string;
  templateNumber: string;
  clientId: string;
  clientName: string;
  clientZone: string;
  frequency: RecurringFrequency;
  nextDate: string;
  active: boolean;
  lines: QuoteLine[];
  total: number;
  assignedTo: string;
  createdAt: string;
}

// ─── Invoice ──────────────────────────────────────────────────────────────────

export type InvoiceType = 'ordinaria' | 'simplificada' | 'rectificativa' | 'proforma';
export type InvoiceStatus = 'borrador' | 'emitida' | 'enviada' | 'cobrada' | 'vencida' | 'anulada';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  series: string;
  type: InvoiceType;
  status: InvoiceStatus;
  orderId: string;
  clientId: string;
  clientName: string;
  taxId: string;
  lines: QuoteLine[];
  subtotal: number;
  ivaBase: number;
  ivaRate: number;
  ivaAmount: number;
  total: number;
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  cae?: string;
  caeDueDate?: string;
}

// ─── Commission ───────────────────────────────────────────────────────────────

export type CommissionStatus = 'calculada' | 'pre_liquidada' | 'aprobada' | 'pagada';

export interface CommissionRule {
  vendedorId: string;
  vendedorName: string;
  baseRate: number;
  bonusThreshold: number;
  bonusRate: number;
}

export interface Commission {
  id: string;
  vendedorId: string;
  vendedorName: string;
  period: string;
  totalSales: number;
  baseAmount: number;
  bonusAmount: number;
  total: number;
  status: CommissionStatus;
  ordersCount: number;
}

// ─── Approval ─────────────────────────────────────────────────────────────────

export type ApprovalReason = 'exceso_credito' | 'descuento_limite' | 'cliente_bloqueado';
export type ApprovalStatus = 'pendiente' | 'aprobado' | 'rechazado';

export interface ApprovalRequest {
  id: string;
  orderId: string;
  orderNumber: string;
  clientId: string;
  clientName: string;
  reason: ApprovalReason;
  detail: string;
  requestedBy: string;
  requestedAt: string;
  status: ApprovalStatus;
  resolvedBy?: string;
  resolvedAt?: string;
  notes?: string;
}

// ─── Stats ────────────────────────────────────────────────────────────────────

export interface VentasStats {
  monthlyRevenue: number;
  pendingOrders: number;
  openQuotes: number;
  pendingCommissions: number;
  pendingApprovals: number;
  invoicedThisMonth: number;
  conversionRate: number;
}
