import { create } from 'zustand';
import { AuthState, User } from '@/types/auth.types';

interface AppStore extends AuthState {
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  
  setAuth: (user, token) => set({ 
    user, 
    token, 
    isAuthenticated: true 
  }),
  
  logout: () => set({ 
    user: null, 
    token: null, 
    isAuthenticated: false 
  }),
  
  setLoading: (loading) => set({ isLoading: loading }),
}));
