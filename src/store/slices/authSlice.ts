import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AuthUser } from "@/types/auth";
import { getSessionToken, clearSession } from "@/lib/session";
import { SESSION_KEYS } from "@/constants";

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialToken = getSessionToken();

const initialState: AuthState = {
  user: null,
  token: initialToken && initialToken !== "demo-token" ? initialToken : null,
  isAuthenticated: Boolean(initialToken && initialToken !== "demo-token"),
  isLoading: false,
  error: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<AuthUser | null>) => {
      state.user = action.payload;
      state.isAuthenticated = Boolean(action.payload);
      state.isLoading = false;
      state.error = null;
    },
    setToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
      if (action.payload) {
        localStorage.setItem(SESSION_KEYS.token, action.payload);
      } else {
        clearSession();
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    updateUser: (state, action: PayloadAction<Partial<AuthUser>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload } as AuthUser;
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      clearSession();
    },
  },
});

export const { setUser, setToken, setLoading, setError, updateUser, logout } = authSlice.actions;
export default authSlice.reducer;
