import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ToastState {
  message: string;
  type: 'success' | 'error' | 'info';
  isVisible: boolean;
}

interface UIStore {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  toast: ToastState;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      theme: 'light',
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      toast: {
        message: '',
        type: 'info',
        isVisible: false,
      },
      showToast: (message, type = 'info') => set({ 
        toast: { message, type, isVisible: true } 
      }),
      hideToast: () => set((state) => ({ 
        toast: { ...state.toast, isVisible: false } 
      })),
    }),
    {
      name: 'ui-storage',
      partialize: (state) => ({ 
        sidebarOpen: state.sidebarOpen, 
        theme: state.theme 
      }), // Don't persist toast state
    }
  )
);
