import { create } from "zustand";
import type { Client, ClientStats } from "../types/client.types";
import { supabase } from "@/lib/supabase";
import { ClientStatus } from "@/types/enums.types";

interface ClientsState {
  clients: Client[];
  stats: ClientStats;
  isLoading: boolean;
  error: string | null;
  fetchClients: () => Promise<void>;
  createClient: (client: Omit<Client, "id" | "createdAt" | "updatedAt" | "companyId">) => Promise<void>;
  updateClient: (id: string, client: Partial<Client>) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
  getClientById: (id: string) => Client | undefined;
  searchClients: (query: string) => void;
}

function mapSupabaseToClient(row: Record<string, unknown>): Client {
  const estado = String(row.estado || "activo");
  let status = ClientStatus.ACTIVE;
  if (estado === "inactivo") status = ClientStatus.INACTIVE;
  else if (estado === "bloqueado") status = ClientStatus.BLOCKED;

  const limiteCredito = Number(row.limite_credito) || 0;
  let category: "PREMIUM" | "REGULAR" | "WHOLESALE" = "REGULAR";
  if (limiteCredito >= 30000) category = "PREMIUM";
  else if (limiteCredito >= 15000) category = "WHOLESALE";

  return {
    id: String(row.id),
    companyId: "gea-services",
    code: String(row.codigo || ""),
    name: String(row.nombre || ""),
    taxId: String(row.nif || ""),
    email: String(row.email || ""),
    phone: String(row.telefono || ""),
    address: String(row.direccion || ""),
    zone: String(row.zona || ""),
    contactName: String(row.nombre || ""),
    creditLimit: limiteCredito,
    balance: Number(row.saldo_pendiente) || 0,
    status,
    category,
    createdAt: String(row.created_at || new Date().toISOString()),
    updatedAt: String(row.updated_at || new Date().toISOString()),
  };
}

function calcStats(clients: Client[]): ClientStats {
  return {
    total: clients.length,
    active: clients.filter(c => c.status === ClientStatus.ACTIVE).length,
    pending: clients.filter(c => c.status === ClientStatus.PROSPECT).length,
    top: clients.filter(c => c.category === "PREMIUM").length,
  };
}

export const useClientsStore = create<ClientsState>((set, get) => ({
  clients: [],
  stats: { total: 0, active: 0, pending: 0, top: 0 },
  isLoading: false,
  error: null,

  fetchClients: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from("clientes")
        .select("*")
        .order("nombre");

      if (error) throw error;
      const clients = (data || []).map(mapSupabaseToClient);
      set({ clients, stats: calcStats(clients), isLoading: false });
    } catch (err) {
      console.error("Error fetching clients:", err);
      set({ isLoading: false, error: "Error al cargar clientes" });
    }
  },

  createClient: async (clientData) => {
    set({ isLoading: true });
    try {
      const { error } = await supabase.from("clientes").insert({
        codigo: clientData.code,
        nombre: clientData.name,
        email: clientData.email,
        telefono: clientData.phone,
        direccion: clientData.address,
        zona: clientData.zone,
        nif: clientData.taxId,
        limite_credito: clientData.creditLimit,
        estado: clientData.status === ClientStatus.INACTIVE ? "inactivo" : "activo",
      });
      if (error) throw error;
      await get().fetchClients();
    } catch (err) {
      console.error("Error creating client:", err);
      set({ isLoading: false });
    }
  },

  updateClient: async (id, clientData) => {
    set({ isLoading: true });
    try {
      const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };
      if (clientData.name)        updateData.nombre = clientData.name;
      if (clientData.email)       updateData.email = clientData.email;
      if (clientData.phone)       updateData.telefono = clientData.phone;
      if (clientData.creditLimit !== undefined) updateData.limite_credito = clientData.creditLimit;
      if (clientData.status)      updateData.estado = clientData.status === ClientStatus.INACTIVE ? "inactivo" : "activo";

      const { error } = await supabase.from("clientes").update(updateData).eq("id", id);
      if (error) throw error;
      await get().fetchClients();
    } catch (err) {
      console.error("Error updating client:", err);
      set({ isLoading: false });
    }
  },

  deleteClient: async (id) => {
    set({ isLoading: true });
    try {
      const { error } = await supabase.from("clientes").update({ estado: "inactivo" }).eq("id", id);
      if (error) throw error;
      await get().fetchClients();
    } catch (err) {
      console.error("Error deleting client:", err);
      set({ isLoading: false });
    }
  },

  getClientById: (id) => get().clients.find(c => c.id === id),

  searchClients: (query) => {
    if (!query) {
      get().fetchClients();
      return;
    }
    const q = query.toLowerCase();
    const filtered = get().clients.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q) ||
      c.taxId.includes(q)
    );
    set({ clients: filtered });
  },
}));
