import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ISharedUser } from '@shared/types/user.type';

interface AuthState {
  user: Partial<ISharedUser> | null;
  isAuthenticated: boolean;
  token: string | null;
  pendingEmail: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  token: null,
  pendingEmail: null,
};

// Load initial state from localStorage if available
const loadInitialState = (): AuthState => {
  if (typeof window === 'undefined') return initialState;
  try {
    const raw = localStorage.getItem('auth-storage');
    if (raw) {
      const parsed = JSON.parse(raw);
      // Try to adapt from old zustand format if it exists, otherwise just return initial
      if (parsed.state) {
        return {
          user: parsed.state.user || null,
          isAuthenticated: parsed.state.isAuthenticated || false,
          token: parsed.state.token || null,
          pendingEmail: parsed.state.pendingEmail || null,
        };
      }
    }
  } catch (e) {
    console.error('Failed to load auth state', e);
  }
  return initialState;
};

const authSlice = createSlice({
  name: 'auth',
  initialState: loadInitialState(),
  reducers: {
    setAuth: (state, action: PayloadAction<{ user: Partial<ISharedUser>; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.pendingEmail = null;
      // Persist to localStorage
      localStorage.setItem('auth-storage', JSON.stringify({ state: { ...state } }));
    },
    setPendingEmail: (state, action: PayloadAction<string | null>) => {
      state.pendingEmail = action.payload;
      localStorage.setItem('auth-storage', JSON.stringify({ state: { ...state } }));
    },
    updateUser: (state, action: PayloadAction<Partial<ISharedUser>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      } else {
        state.user = action.payload;
      }
      localStorage.setItem('auth-storage', JSON.stringify({ state: { ...state } }));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.pendingEmail = null;
      localStorage.removeItem('auth-storage');
    },
  },
});

export const { setAuth, setPendingEmail, updateUser, logout } = authSlice.actions;
export default authSlice.reducer;
