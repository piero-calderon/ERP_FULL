import { create } from 'zustand';
import type { Product, InventoryStats } from '../types/product.types';
import { MOCK_PRODUCTS } from '../mocks/products.mock';
import { ProductStatus } from '@/types/enums.types';

interface ProductsState {
  products: Product[];
  stats: InventoryStats;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchProducts: () => Promise<void>;
  createProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'companyId'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  getProductById: (id: string) => Product | undefined;

  // Inventory simulation
  registerMovement: (productId: string, type: 'IN' | 'OUT' | 'ADJUST', quantity: number) => Promise<void>;
}

export const useProductsStore = create<ProductsState>((set, get) => ({
  products: [],
  stats: { total: 0, active: 0, lowStock: 0, critical: 0, totalValue: 0 },
  isLoading: false,
  error: null,

  fetchProducts: async () => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 800));

    const products = MOCK_PRODUCTS;
    const stats: InventoryStats = {
      total: products.length,
      active: products.filter(p => p.status === ProductStatus.ACTIVE).length,
      lowStock: products.filter(p => p.stock > 0 && p.stock <= p.minimumStock).length,
      critical: products.filter(p => p.stock <= 0).length,
      totalValue: products.reduce((acc, p) => acc + (p.price * p.stock), 0)
    };

    set({ products, stats, isLoading: false });
  },

  createProduct: async (productData) => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newProduct: Product = {
      ...productData,
      id: `p${Math.random().toString(36).substr(2, 9)}`,
      companyId: 'comp-01',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    set((state) => ({
      products: [newProduct, ...state.products],
      isLoading: false
    }));
    get().fetchProducts();
  },

  updateProduct: async (id, productData) => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 800));

    set((state) => ({
      products: state.products.map(p => p.id === id ? { ...p, ...productData, updatedAt: new Date().toISOString() } : p),
      isLoading: false
    }));
    get().fetchProducts();
  },

  deleteProduct: async (id) => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    set((state) => ({
      products: state.products.filter(p => p.id !== id),
      isLoading: false
    }));
    get().fetchProducts();
  },

  getProductById: (id) => {
    return get().products.find(p => p.id === id);
  },

  registerMovement: async (productId, type, quantity) => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 500));

    set((state) => ({
      products: state.products.map(p => {
        if (p.id === productId) {
          let newStock = p.stock;
          if (type === 'IN') newStock += quantity;
          if (type === 'OUT') newStock -= quantity;
          if (type === 'ADJUST') newStock = quantity;

          return {
            ...p,
            stock: newStock,
            lastMovementDate: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
        }
        return p;
      }),
      isLoading: false
    }));
    get().fetchProducts();
  }
}));
