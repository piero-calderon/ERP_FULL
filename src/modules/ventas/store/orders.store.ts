import { create } from "zustand";
import type { Order, OrderItem, SalesStats } from "../types/order.types";
import { supabase } from "@/lib/supabase";
import { OrderStatus } from "@/types/enums.types";
import { useProductsStore } from "@/modules/inventory/store/products.store";

interface OrdersState {
  orders: Order[];
  stats: SalesStats;
  isLoading: boolean;
  error: string | null;
  fetchOrders: () => Promise<void>;
  createOrder: (order: Omit<Order, "id" | "createdAt" | "updatedAt" | "companyId" | "orderNumber">) => Promise<void>;
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
  getOrderById: (id: string) => Order | undefined;
}

function mapEstadoToOrderStatus(estado: string): OrderStatus {
  const map: Record<string, OrderStatus> = {
    borrador: OrderStatus.DRAFT,
    confirmado: OrderStatus.CONFIRMED,
    en_proceso: OrderStatus.PROCESSING,
    enviado: OrderStatus.SHIPPED,
    entregado: OrderStatus.DELIVERED,
    cancelado: OrderStatus.CANCELLED,
  };
  return map[estado] ?? OrderStatus.PENDING;
}

function mapOrderStatusToEstado(status: OrderStatus): string {
  const map: Record<string, string> = {
    [OrderStatus.DRAFT]: "borrador",
    [OrderStatus.CONFIRMED]: "confirmado",
    [OrderStatus.PROCESSING]: "en_proceso",
    [OrderStatus.SHIPPED]: "enviado",
    [OrderStatus.DELIVERED]: "entregado",
    [OrderStatus.CANCELLED]: "cancelado",
    [OrderStatus.PENDING]: "borrador",
  };
  return map[status] ?? "borrador";
}

function mapSupabaseToOrder(row: Record<string, unknown>, lineas: Record<string, unknown>[]): Order {
  const items: OrderItem[] = lineas.map(l => ({
    productId: String(l.producto_id || ""),
    sku: String(l.sku || ""),
    name: String(l.nombre_producto || ""),
    quantity: Number(l.cantidad) || 0,
    unitType: "unidad",
    unitPrice: Number(l.precio_unit) || 0,
    discount: Number(l.descuento_pct) || 0,
    tax: 0,
    subtotal: Number(l.subtotal) || 0,
    total: Number(l.subtotal) || 0,
  }));

  return {
    id: String(row.id),
    companyId: "gea-services",
    orderNumber: String(row.numero || ""),
    clientId: String(row.cliente_id || ""),
    clientName: String(row.cliente_nombre || ""),
    clientZone: String(row.zona || ""),
    items,
    subtotal: Number(row.subtotal) || 0,
    taxes: Number(row.impuestos) || 0,
    discounts: Number(row.descuento) || 0,
    total: Number(row.total) || 0,
    currency: String(row.moneda || "EUR"),
    status: mapEstadoToOrderStatus(String(row.estado || "borrador")),
    paymentStatus: "PENDING",
    deliveryStatus: row.estado === "entregado" ? "DELIVERED" : row.estado === "enviado" ? "IN_ROUTE" : "PENDING",
    deliveryDate: String(row.fecha_entrega || ""),
    notes: String(row.notas || ""),
    createdAt: String(row.created_at || new Date().toISOString()),
    updatedAt: String(row.updated_at || new Date().toISOString()),
  };
}

function calcStats(orders: Order[]): SalesStats {
  const totalSales = orders.filter(o => o.status !== OrderStatus.CANCELLED)
    .reduce((acc, o) => acc + o.total, 0);
  const clientTotals: Record<string, number> = {};
  orders.forEach(o => {
    clientTotals[o.clientName] = (clientTotals[o.clientName] || 0) + o.total;
  });
  const topClients = Object.entries(clientTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, total]) => ({ name, total }));

  return {
    totalSales,
    pendingOrders: orders.filter(o => o.status === OrderStatus.PENDING || o.status === OrderStatus.CONFIRMED).length,
    deliveredOrders: orders.filter(o => o.status === OrderStatus.DELIVERED).length,
    averageTicket: orders.length > 0 ? totalSales / orders.length : 0,
    topClients,
  };
}

export const useOrdersStore = create<OrdersState>((set, get) => ({
  orders: [],
  stats: { totalSales: 0, pendingOrders: 0, deliveredOrders: 0, averageTicket: 0, topClients: [] },
  isLoading: false,
  error: null,

  fetchOrders: async () => {
    set({ isLoading: true, error: null });
    try {
      // Obtener pedidos con JOIN a clientes
      const { data: pedidos, error } = await supabase
        .from("pedidos")
        .select("*, clientes(nombre, zona)")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Obtener lineas de todos los pedidos
      const pedidoIds = (pedidos || []).map(p => p.id);
      const { data: lineas } = await supabase
        .from("pedido_lineas")
        .select("*")
        .in("pedido_id", pedidoIds.length > 0 ? pedidoIds : ["none"]);

      const orders = (pedidos || []).map(p => {
        const lineasPedido = (lineas || []).filter(l => l.pedido_id === p.id);
        const rowConNombre = {
          ...p,
          cliente_nombre: (p.clientes as Record<string, unknown>)?.nombre ?? "",
          zona: (p.clientes as Record<string, unknown>)?.zona ?? "",
        };
        return mapSupabaseToOrder(rowConNombre, lineasPedido);
      });

      set({ orders, stats: calcStats(orders), isLoading: false });
    } catch (err) {
      console.error("Error fetching orders:", err);
      set({ isLoading: false, error: "Error al cargar pedidos" });
    }
  },

  createOrder: async (orderData) => {
    set({ isLoading: true, error: null });
    try {
      const productsStore = useProductsStore.getState();

      // Verificar stock
      const insufficientStock = orderData.items.some(item => {
        const product = productsStore.getProductById(item.productId);
        return !product || product.stock < item.quantity;
      });

      if (insufficientStock) {
        set({ error: "Stock insuficiente para uno o mas productos", isLoading: false });
        return;
      }

      const numero = `ORD-${new Date().getFullYear()}-${(get().orders.length + 1).toString().padStart(4, "0")}`;

      // Insertar pedido
      const { data: pedido, error: pedidoError } = await supabase
        .from("pedidos")
        .insert({
          numero,
          cliente_id: orderData.clientId,
          subtotal: orderData.subtotal,
          descuento: orderData.discounts,
          impuestos: orderData.taxes,
          total: orderData.total,
          moneda: orderData.currency || "EUR",
          estado: mapOrderStatusToEstado(orderData.status),
          notas: orderData.notes,
          fecha_entrega: orderData.deliveryDate || null,
        })
        .select()
        .single();

      if (pedidoError) throw pedidoError;

      // Insertar lineas
      const lineas = orderData.items.map(item => ({
        pedido_id: pedido.id,
        producto_id: item.productId,
        cantidad: item.quantity,
        precio_unit: item.unitPrice,
        descuento_pct: item.discount,
        subtotal: item.subtotal,
      }));

      await supabase.from("pedido_lineas").insert(lineas);

      // Descontar stock
      for (const item of orderData.items) {
        await productsStore.registerMovement(item.productId, "OUT", item.quantity);
      }

      await get().fetchOrders();
    } catch (err) {
      console.error("Error creating order:", err);
      set({ isLoading: false, error: "Error al crear pedido" });
    }
  },

  updateOrderStatus: async (id, status) => {
    set({ isLoading: true });
    try {
      const { error } = await supabase
        .from("pedidos")
        .update({ estado: mapOrderStatusToEstado(status), updated_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;
      await get().fetchOrders();
    } catch (err) {
      console.error("Error updating order status:", err);
      set({ isLoading: false });
    }
  },

  getOrderById: (id) => get().orders.find(o => o.id === id),
}));
