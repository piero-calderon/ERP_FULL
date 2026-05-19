import { create } from "zustand";
import type { Product, InventoryStats } from "../types/product.types";
import { supabase } from "@/lib/supabase";
import { ProductStatus } from "@/types/enums.types";

interface ProductsState {
  products: Product[];
  stats: InventoryStats;
  isLoading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  createProduct: (product: Omit<Product, "id" | "createdAt" | "updatedAt" | "companyId">) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  getProductById: (id: string) => Product | undefined;
  registerMovement: (productId: string, type: "IN" | "OUT" | "ADJUST", quantity: number) => Promise<void>;
}

// Mapear datos de Supabase al tipo Product del ERP
function mapSupabaseToProduct(row: Record<string, unknown>): Product {
  const stock = Number(row.stock_actual) || 0;
  const minStock = Number(row.stock_minimo) || 0;
  let status = ProductStatus.ACTIVE;
  if (!row.activo) status = ProductStatus.INACTIVE;
  else if (stock <= 0) status = ProductStatus.OUT_OF_STOCK;
  else if (stock <= minStock) status = ProductStatus.LOW_STOCK;

  return {
    id: String(row.id),
    companyId: "gea-services",
    sku: String(row.sku || ""),
    name: String(row.nombre || ""),
    description: String(row.descripcion || ""),
    category: String(row.categoria_id || "general"),
    price: Number(row.precio_base) || 0,
    cost: Number(row.precio_compra) || 0,
    stock,
    minimumStock: minStock,
    maximumStock: Number(row.stock_maximo) || 0,
    unit: String(row.unidad_medida || "unidad"),
    warehouse: String(row.almacen || "principal"),
    status,
    imageUrl: String(row.imagen_url || ""),
    createdAt: String(row.created_at || new Date().toISOString()),
    updatedAt: String(row.updated_at || new Date().toISOString()),
    lastMovementDate: String(row.updated_at || new Date().toISOString()),
  } as Product;
}

function calcStats(products: Product[]): InventoryStats {
  return {
    total: products.length,
    active: products.filter(p => p.status === ProductStatus.ACTIVE).length,
    lowStock: products.filter(p => p.stock > 0 && p.stock <= p.minimumStock).length,
    critical: products.filter(p => p.stock <= 0).length,
    totalValue: products.reduce((acc, p) => acc + (p.price * p.stock), 0),
  };
}

export const useProductsStore = create<ProductsState>((set, get) => ({
  products: [],
  stats: { total: 0, active: 0, lowStock: 0, critical: 0, totalValue: 0 },
  isLoading: false,
  error: null,

  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from("productos")
        .select("*")
        .order("nombre");

      if (error) throw error;

      const products = (data || []).map(mapSupabaseToProduct);
      set({ products, stats: calcStats(products), isLoading: false });
    } catch (err) {
      console.error("Error fetching products:", err);
      set({ isLoading: false, error: "Error al cargar productos" });
    }
  },

  createProduct: async (productData) => {
    set({ isLoading: true });
    try {
      const { error } = await supabase.from("productos").insert({
        sku: productData.sku,
        nombre: productData.name,
        descripcion: productData.description,
        precio_base: productData.price,
        precio_compra: productData.cost,
        stock_actual: productData.stock,
        stock_minimo: productData.minimumStock,
        stock_maximo: productData.maximumStock,
        unidad_medida: productData.unit,
        almacen: productData.warehouse,
        activo: productData.status !== ProductStatus.INACTIVE,
      });
      if (error) throw error;
      await get().fetchProducts();
    } catch (err) {
      console.error("Error creating product:", err);
      set({ isLoading: false });
    }
  },

  updateProduct: async (id, productData) => {
    set({ isLoading: true });
    try {
      const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };
      if (productData.name)         updateData.nombre = productData.name;
      if (productData.price)        updateData.precio_base = productData.price;
      if (productData.stock !== undefined) updateData.stock_actual = productData.stock;
      if (productData.minimumStock !== undefined) updateData.stock_minimo = productData.minimumStock;

      const { error } = await supabase.from("productos").update(updateData).eq("id", id);
      if (error) throw error;
      await get().fetchProducts();
    } catch (err) {
      console.error("Error updating product:", err);
      set({ isLoading: false });
    }
  },

  deleteProduct: async (id) => {
    set({ isLoading: true });
    try {
      const { error } = await supabase.from("productos").update({ activo: false }).eq("id", id);
      if (error) throw error;
      await get().fetchProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
      set({ isLoading: false });
    }
  },

  getProductById: (id) => get().products.find(p => p.id === id),

  registerMovement: async (productId, type, quantity) => {
    set({ isLoading: true });
    try {
      const product = get().products.find(p => p.id === productId);
      if (!product) return;

      const stockAnterior = product.stock;
      let stockNuevo = stockAnterior;
      if (type === "IN")     stockNuevo += quantity;
      if (type === "OUT")    stockNuevo -= quantity;
      if (type === "ADJUST") stockNuevo = quantity;

      // Actualizar stock en productos
      await supabase.from("productos").update({
        stock_actual: stockNuevo,
        updated_at: new Date().toISOString()
      }).eq("id", productId);

      // Registrar movimiento
      await supabase.from("inventario_movimientos").insert({
        producto_id: productId,
        tipo: type === "IN" ? "entrada" : type === "OUT" ? "salida" : "ajuste",
        cantidad: quantity,
        stock_anterior: stockAnterior,
        stock_nuevo: stockNuevo,
        motivo: `Movimiento ${type}`,
      });

      await get().fetchProducts();
    } catch (err) {
      console.error("Error registering movement:", err);
      set({ isLoading: false });
    }
  },
}));
