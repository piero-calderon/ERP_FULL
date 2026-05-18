import { create } from 'zustand';
import type {
  Quote, QuoteStatus,
  SalesOrder, SalesOrderStatus,
  RecurringOrder,
  Invoice,
  Commission, CommissionRule, CommissionStatus,
  ApprovalRequest, ApprovalStatus,
  VentasStats,
} from '../types/ventas.types';
import {
  MOCK_QUOTES,
  MOCK_SALES_ORDERS,
  MOCK_RECURRING_ORDERS,
  MOCK_INVOICES,
  MOCK_COMMISSIONS,
  MOCK_COMMISSION_RULES,
  MOCK_APPROVALS,
} from '../mocks/ventas.mock';

interface VentasState {
  quotes: Quote[];
  salesOrders: SalesOrder[];
  recurringOrders: RecurringOrder[];
  invoices: Invoice[];
  commissions: Commission[];
  commissionRules: CommissionRule[];
  approvals: ApprovalRequest[];
  stats: VentasStats;
  isLoading: boolean;

  fetchVentas: () => Promise<void>;
  updateQuoteStatus: (id: string, status: QuoteStatus) => void;
  convertQuoteToOrder: (quoteId: string) => void;
  updateOrderStatus: (id: string, status: SalesOrderStatus) => void;
  toggleRecurring: (id: string) => void;
  updateCommissionStatus: (id: string, status: CommissionStatus) => void;
  resolveApproval: (id: string, status: ApprovalStatus, notes?: string) => void;
}

function computeStats(
  quotes: Quote[],
  orders: SalesOrder[],
  commissions: Commission[],
  approvals: ApprovalRequest[],
  invoices: Invoice[],
): VentasStats {
  const month = '2026-05';
  const monthlyRevenue = orders
    .filter(o => o.status === 'entregado' || o.status === 'facturado' || o.status === 'cerrado')
    .filter(o => o.createdAt.startsWith(month))
    .reduce((s, o) => s + o.total, 0);

  const invoicedThisMonth = invoices
    .filter(i => i.issueDate.startsWith(month) && i.status !== 'borrador' && i.status !== 'anulada')
    .reduce((s, i) => s + i.total, 0);

  const pendingOrders = orders.filter(o =>
    ['pendiente_aprobacion', 'aprobado', 'en_preparacion', 'listo_despacho', 'en_ruta'].includes(o.status)
  ).length;

  const openQuotes = quotes.filter(q => q.status === 'borrador' || q.status === 'enviada').length;

  const pendingCommissions = commissions.filter(c =>
    c.status === 'calculada' || c.status === 'pre_liquidada'
  ).length;

  const pendingApprovals = approvals.filter(a => a.status === 'pendiente').length;

  const accepted = quotes.filter(q => q.status === 'aceptada').length;
  const total = quotes.filter(q => q.status !== 'borrador').length;
  const conversionRate = total > 0 ? Math.round((accepted / total) * 100) : 0;

  return {
    monthlyRevenue,
    pendingOrders,
    openQuotes,
    pendingCommissions,
    pendingApprovals,
    invoicedThisMonth,
    conversionRate,
  };
}

export const useVentasStore = create<VentasState>((set, get) => ({
  quotes: [],
  salesOrders: [],
  recurringOrders: [],
  invoices: [],
  commissions: [],
  commissionRules: [],
  approvals: [],
  stats: {
    monthlyRevenue: 0, pendingOrders: 0, openQuotes: 0,
    pendingCommissions: 0, pendingApprovals: 0, invoicedThisMonth: 0, conversionRate: 0,
  },
  isLoading: false,

  fetchVentas: async () => {
    set({ isLoading: true });
    await new Promise(r => setTimeout(r, 600));
    const quotes = MOCK_QUOTES as Quote[];
    const salesOrders = MOCK_SALES_ORDERS as SalesOrder[];
    const recurringOrders = MOCK_RECURRING_ORDERS as RecurringOrder[];
    const invoices = MOCK_INVOICES as Invoice[];
    const commissions = MOCK_COMMISSIONS as Commission[];
    const commissionRules = MOCK_COMMISSION_RULES as CommissionRule[];
    const approvals = MOCK_APPROVALS as ApprovalRequest[];
    const stats = computeStats(quotes, salesOrders, commissions, approvals, invoices);
    set({ quotes, salesOrders, recurringOrders, invoices, commissions, commissionRules, approvals, stats, isLoading: false });
  },

  updateQuoteStatus: (id, status) => {
    set(s => {
      const quotes = s.quotes.map(q => q.id === id ? { ...q, status } : q);
      return { quotes, stats: computeStats(quotes, s.salesOrders, s.commissions, s.approvals, s.invoices) };
    });
  },

  convertQuoteToOrder: (quoteId) => {
    const { quotes, salesOrders } = get();
    const quote = quotes.find(q => q.id === quoteId);
    if (!quote) return;
    const newOrder: SalesOrder = {
      id: `so_${Date.now()}`,
      orderNumber: `PV-2026-${String(salesOrders.length + 1).padStart(3, '0')}`,
      quoteId,
      clientId: quote.clientId,
      clientName: quote.clientName,
      clientZone: quote.clientZone,
      deliveryAddress: '',
      deliveryDate: '',
      deliveryTimeFrom: '09:00',
      deliveryTimeTo: '17:00',
      orderType: 'puntual',
      status: 'borrador',
      lines: quote.lines.map(l => ({
        id: l.id,
        productId: l.productId,
        sku: l.sku,
        name: l.name,
        quantity: l.quantity,
        reservedQty: 0,
        backorderQty: 0,
        unitPrice: l.unitPrice,
        discount: l.discount,
        subtotal: l.subtotal,
        tax: l.tax,
        total: l.total,
      })),
      subtotal: quote.subtotal,
      discount: quote.discount,
      taxes: quote.taxes,
      total: quote.total,
      creditValidated: false,
      requiresApproval: false,
      assignedTo: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set(s => {
      const newQuotes = s.quotes.map(q => q.id === quoteId ? { ...q, status: 'aceptada' as QuoteStatus, convertedToOrderId: newOrder.id } : q);
      const newOrders = [newOrder, ...s.salesOrders];
      return { quotes: newQuotes, salesOrders: newOrders, stats: computeStats(newQuotes, newOrders, s.commissions, s.approvals, s.invoices) };
    });
  },

  updateOrderStatus: (id, status) => {
    set(s => {
      const salesOrders = s.salesOrders.map(o =>
        o.id === id ? { ...o, status, updatedAt: new Date().toISOString() } : o
      );
      return { salesOrders, stats: computeStats(s.quotes, salesOrders, s.commissions, s.approvals, s.invoices) };
    });
  },

  toggleRecurring: (id) => {
    set(s => ({
      recurringOrders: s.recurringOrders.map(r => r.id === id ? { ...r, active: !r.active } : r),
    }));
  },

  updateCommissionStatus: (id, status) => {
    set(s => {
      const commissions = s.commissions.map(c => c.id === id ? { ...c, status } : c);
      return { commissions, stats: computeStats(s.quotes, s.salesOrders, commissions, s.approvals, s.invoices) };
    });
  },

  resolveApproval: (id, status, notes) => {
    set(s => {
      const approvals = s.approvals.map(a =>
        a.id === id
          ? { ...a, status, resolvedBy: 'Gerencia Comercial', resolvedAt: new Date().toISOString(), notes }
          : a
      );
      return { approvals, stats: computeStats(s.quotes, s.salesOrders, s.commissions, approvals, s.invoices) };
    });
  },
}));
