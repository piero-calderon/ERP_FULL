$file = "src\modules\ventas\store\ventas.store.ts"
$content = Get-Content $file -Raw -Encoding UTF8

$newContent = @'
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
  MOCK_RECURRING_ORDERS,
  MOCK_INVOICES,
  MOCK_COMMISSIONS,
  MOCK_COMMISSION_RULES,
  MOCK_APPROVALS,
} from '../mocks/ventas.mock';
import { supabase } from '@/lib/supabase';

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
  const month = new Date().toISOString().slice(0, 7);
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
  const pendingCommissions = commissions.filter(c => c.status === 'calculada' || c.status === 'pre_liquidada').length;
  const pendingApprovals = approvals.filter(a => a.status === 'pendiente').length;
  const accepted = quotes.filter(q => q.status === 'aceptada').length;
  const total = quotes.filter(q => q.status !== 'borrador').length;
  const conversionRate = total > 0 ? Math.round((accepted / total) * 100) : 0;

  return { monthlyRevenue, pendingOrders, openQuotes, pendingCommissions, pendingApprovals, invoicedThisMonth, conversionRate };
}

// Mapea fila de Supabase → SalesOrder
function mapSupabaseToSalesOrder(row: Record<string, unknown>): SalesOrder {
  const rawLines = (row.pedido_lineas as Record<string, unknown>[] | null) ?? [];
  const lines = rawLines.map((l, i) => ({
    id: String(l.id ?? `line-${i}`),
    productId: String(l.producto_id ?? ''),
    sku: String(l.sku ?? ''),
    name: String(l.nombre_producto ?? ''),
    quantity: Number(l.cantidad) || 0,
    reservedQty: Number(l.cantidad) || 0,
    backorderQty: 0,
    lot: String(l.lote ?? ''),
    unitPrice: Number(l.precio_unit) || 0,
    discount: Number(l.descuento_pct) || 0,
    subtotal: Number(l.subtotal) || 0,
    tax: 0,
    total: Number(l.subtotal) || 0,
  }));

  const cliente = row.clientes as Record<string, unknown> | null;

  return {
    id: String(row.id),
    orderNumber: String(row.numero ?? ''),
    quoteId: row.cotizacion_id ? String(row.cotizacion_id) : undefined,
    clientId: String(row.cliente_id ?? ''),
    clientName: String(cliente?.nombre ?? row.cliente_nombre ?? ''),
    clientZone: String(cliente?.zona ?? row.zona ?? ''),
    deliveryAddress: String(row.direccion_entrega ?? ''),
    deliveryDate: String(row.fecha_entrega ?? ''),
    deliveryTimeFrom: String(row.hora_desde ?? '09:00'),
    deliveryTimeTo: String(row.hora_hasta ?? '17:00'),
    orderType: (row.tipo_pedido as 'puntual' | 'recurrente' | 'urgente') ?? 'puntual',
    status: (row.estado as SalesOrderStatus) ?? 'borrador',
    lines,
    subtotal: Number(row.subtotal) || 0,
    discount: Number(row.descuento) || 0,
    taxes: Number(row.impuestos) || 0,
    total: Number(row.total) || 0,
    creditValidated: Boolean(row.credito_validado),
    requiresApproval: Boolean(row.requiere_aprobacion),
    assignedTo: String(row.asignado_a ?? ''),
    notes: row.notas ? String(row.notas) : undefined,
    createdAt: String(row.created_at ?? new Date().toISOString()),
    updatedAt: String(row.updated_at ?? new Date().toISOString()),
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

    // Cargar salesOrders desde Supabase
    let salesOrders: SalesOrder[] = [];
    try {
      const { data, error } = await supabase
        .from('pedidos')
        .select(`
          *,
          clientes(nombre, zona),
          pedido_lineas(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      salesOrders = (data ?? []).map(row => mapSupabaseToSalesOrder(row as Record<string, unknown>));
    } catch (err) {
      console.error('Error fetching salesOrders from Supabase:', err);
      // fallback vacio si falla
      salesOrders = [];
    }

    // El resto sigue en mock por ahora
    const quotes = MOCK_QUOTES as Quote[];
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
      orderNumber: `PV-${new Date().getFullYear()}-${String(salesOrders.length + 1).padStart(3, '0')}`,
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

  updateOrderStatus: async (id, status) => {
    // Actualizar en Supabase
    try {
      await supabase
        .from('pedidos')
        .update({ estado: status, updated_at: new Date().toISOString() })
        .eq('id', id);
    } catch (err) {
      console.error('Error updating order status:', err);
    }
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
'@

Set-Content $file -Value $newContent -Encoding UTF8
Write-Host "✅ ventas.store.ts migrado a Supabase correctamente"
