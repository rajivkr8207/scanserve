import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ISharedUser } from '@shared/types/user.type';

interface AuthState {
  user: Partial<ISharedUser> | null;
  isAuthenticated: boolean;
  token: string | null;
  pendingEmail: string | null;
  setAuth: (user: Partial<ISharedUser>, token: string) => void;
  setPendingEmail: (email: string | null) => void;
  updateUser: (data: Partial<ISharedUser>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      token: null,
      pendingEmail: null,
      setAuth: (user, token) =>
        set({ user, token, isAuthenticated: true, pendingEmail: null }),
      setPendingEmail: (email) => set({ pendingEmail: email }),
      updateUser: (data) =>
        set((state) => ({ user: state.user ? { ...state.user, ...data } : data })),
      logout: () =>
        set({ user: null, token: null, isAuthenticated: false, pendingEmail: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
