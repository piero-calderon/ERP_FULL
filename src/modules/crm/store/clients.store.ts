import { create } from 'zustand';
import type { Client, ClientStats } from '../types/client.types';
import { MOCK_CLIENTS } from '../mocks/clients.mock';
import { ClientStatus } from '@/types/enums.types';

interface ClientsState {
  clients: Client[];
  stats: ClientStats;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchClients: () => Promise<void>;
  createClient: (client: Omit<Client, 'id' | 'createdAt' | 'updatedAt' | 'companyId'>) => Promise<void>;
  updateClient: (id: string, client: Partial<Client>) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
  getClientById: (id: string) => Client | undefined;
  searchClients: (query: string) => void;
}

export const useClientsStore = create<ClientsState>((set, get) => ({
  clients: [],
  stats: { total: 0, active: 0, pending: 0, top: 0 },
  isLoading: false,
  error: null,

  fetchClients: async () => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 800));

    const clients = MOCK_CLIENTS;
    const stats: ClientStats = {
      total: clients.length,
      active: clients.filter(c => c.status === ClientStatus.ACTIVE).length,
      pending: clients.filter(c => c.status === ClientStatus.PROSPECT).length,
      top: clients.filter(c => c.category === 'PREMIUM').length
    };

    set({ clients, stats, isLoading: false });
  },

  createClient: async (clientData) => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newClient: Client = {
      ...clientData,
      id: Math.random().toString(36).substr(2, 9),
      companyId: 'comp-01',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      balance: 0
    };

    set((state) => ({
      clients: [newClient, ...state.clients],
      isLoading: false
    }));

    get().fetchClients();
  },

  updateClient: async (id, clientData) => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 800));

    set((state) => ({
      clients: state.clients.map(c => c.id === id ? { ...c, ...clientData, updatedAt: new Date().toISOString() } : c),
      isLoading: false
    }));
  },

  deleteClient: async (id) => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 500));

    set((state) => ({
      clients: state.clients.filter(c => c.id !== id),
      isLoading: false
    }));
  },

  getClientById: (id) => {
    return get().clients.find(c => c.id === id);
  },

  searchClients: (query) => {
    if (!query) {
      set({ clients: MOCK_CLIENTS });
      return;
    }

    const filtered = MOCK_CLIENTS.filter(c =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.code.toLowerCase().includes(query.toLowerCase()) ||
      c.taxId.includes(query)
    );

    set({ clients: filtered });
  }
}));
