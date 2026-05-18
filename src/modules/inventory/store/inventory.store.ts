import { create } from 'zustand';
import type { InventoryMovement } from '../types/inventory.types';

interface InventoryState {
  movements: InventoryMovement[];
  isLoading: boolean;
  addMovement: (movement: InventoryMovement) => void;
}

export const useInventoryStore = create<InventoryState>((set) => ({
  movements: [],
  isLoading: false,
  addMovement: (movement) => set((state) => ({
    movements: [movement, ...state.movements]
  })),
}));
