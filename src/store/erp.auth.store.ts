// Store de autenticacion ERP con Supabase
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "@/lib/supabase";

export type ERPRole = "admin" | "comercial" | "operativa" | "empresarial" | "administracion";

export interface ERPUser {
  id: string;
  nombre: string;
  email: string;
  rol: ERPRole;
  area: string;
  avatar: string;
}

// Usuarios demo hardcodeados como fallback
const USUARIOS_DEMO: (ERPUser & { password: string })[] = [
  { id: "1", nombre: "Admin General",  email: "admin@geaservices.com",       password: "admin123",       rol: "admin",          area: "Administracion General", avatar: "AG" },
  { id: "2", nombre: "Carlos Gomez",   email: "comercial@geaservices.com",   password: "comercial123",   rol: "comercial",      area: "Area Comercial",         avatar: "CG" },
  { id: "3", nombre: "Ana Torres",     email: "operativa@geaservices.com",   password: "operativa123",   rol: "operativa",      area: "Area Operativa",         avatar: "AT" },
  { id: "4", nombre: "Pedro Vega",     email: "empresarial@geaservices.com", password: "empresarial123", rol: "empresarial",    area: "Gestion Empresarial",    avatar: "PV" },
  { id: "5", nombre: "Maria Lopez",    email: "admin.sys@geaservices.com",   password: "admin123",       rol: "administracion", area: "Administracion",         avatar: "ML" },
];

interface ERPAuthState {
  usuario: ERPUser | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  tieneAcceso: (ruta: string) => boolean;
  initAuth: () => Promise<void>;
}

export const RUTAS_POR_ROL: Record<ERPRole, string[]> = {
  admin:          ["*"],
  comercial:      ["/", "/dashboard", "/crm", "/ventas"],
  operativa:      ["/", "/dashboard", "/inventario", "/logistica", "/compras"],
  empresarial:    ["/", "/dashboard", "/calidad", "/finanzas", "/documentos", "/reportes", "/notificaciones"],
  administracion: ["/", "/dashboard", "/configuracion", "/auditoria", "/integraciones", "/portal-clientes"],
};

export const useERPAuth = create<ERPAuthState>()(
  persist(
    (set, get) => ({
      usuario: null,
      loading: false,
      error: null,
      isAuthenticated: false,

      initAuth: async () => {
        // Verificar sesion activa en Supabase
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // Buscar perfil en tabla erp_usuarios
          const { data: perfil } = await supabase
            .from("erp_usuarios")
            .select("*")
            .eq("user_id", session.user.id)
            .single();

          if (perfil) {
            set({
              usuario: {
                id: perfil.user_id,
                nombre: perfil.nombre,
                email: session.user.email ?? "",
                rol: perfil.rol as ERPRole,
                area: perfil.area,
                avatar: perfil.avatar,
              },
              isAuthenticated: true,
            });
          }
        }
      },

      login: async (email, password) => {
        set({ loading: true, error: null });

        try {
          // Intentar login con Supabase primero
          const { data, error: sbError } = await supabase.auth.signInWithPassword({ email, password });

          if (!sbError && data.user) {
            // Buscar perfil en tabla erp_usuarios
            const { data: perfil } = await supabase
              .from("erp_usuarios")
              .select("*")
              .eq("user_id", data.user.id)
              .single();

            if (perfil) {
              set({
                usuario: {
                  id: perfil.user_id,
                  nombre: perfil.nombre,
                  email: data.user.email ?? "",
                  rol: perfil.rol as ERPRole,
                  area: perfil.area,
                  avatar: perfil.avatar,
                },
                isAuthenticated: true,
                loading: false,
                error: null,
              });
              return;
            }
          }

          // Fallback a usuarios demo
          await new Promise(r => setTimeout(r, 600));
          const found = USUARIOS_DEMO.find(u => u.email === email && u.password === password);
          if (!found) {
            set({ loading: false, error: "Email o contrasena incorrectos" });
            return;
          }
          const { password: _, ...usuario } = found;
          set({ usuario, isAuthenticated: true, loading: false, error: null });

        } catch {
          // Fallback total a demo
          await new Promise(r => setTimeout(r, 600));
          const found = USUARIOS_DEMO.find(u => u.email === email && u.password === password);
          if (!found) {
            set({ loading: false, error: "Email o contrasena incorrectos" });
            return;
          }
          const { password: _, ...usuario } = found;
          set({ usuario, isAuthenticated: true, loading: false, error: null });
        }
      },

      logout: async () => {
        await supabase.auth.signOut();
        set({ usuario: null, isAuthenticated: false, error: null });
      },

      clearError: () => set({ error: null }),

      tieneAcceso: (ruta) => {
        const { usuario } = get();
        if (!usuario) return false;
        const rutas = RUTAS_POR_ROL[usuario.rol];
        if (rutas.includes("*")) return true;
        return rutas.some(r => ruta === r || ruta.startsWith(r + "/"));
      },
    }),
    {
      name: "erp-auth",
      partialize: (state) => ({ usuario: state.usuario, isAuthenticated: state.isAuthenticated }),
    }
  )
);
