import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { UserRole } from "@/types/auth";

export type AppView = "landing" | "login" | "signup" | "dashboard";

interface NavigationState {
  currentView: AppView;
  activeItem: string;
  selectedRoleTab: UserRole;
  commandMenuOpen: boolean;
  mobileMenuOpen: boolean;
}

const initialState: NavigationState = {
  currentView: "landing",
  activeItem: "dashboard",
  selectedRoleTab: "resident",
  commandMenuOpen: false,
  mobileMenuOpen: false,
};

export const navigationSlice = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    setCurrentView: (state, action: PayloadAction<AppView>) => {
      state.currentView = action.payload;
    },
    setActiveItem: (state, action: PayloadAction<string>) => {
      state.activeItem = action.payload;
      state.mobileMenuOpen = false;
    },
    setSelectedRoleTab: (state, action: PayloadAction<UserRole>) => {
      state.selectedRoleTab = action.payload;
    },
    setCommandMenuOpen: (state, action: PayloadAction<boolean>) => {
      state.commandMenuOpen = action.payload;
    },
    toggleCommandMenu: (state) => {
      state.commandMenuOpen = !state.commandMenuOpen;
    },
    setMobileMenuOpen: (state, action: PayloadAction<boolean>) => {
      state.mobileMenuOpen = action.payload;
    },
  },
});

export const {
  setCurrentView,
  setActiveItem,
  setSelectedRoleTab,
  setCommandMenuOpen,
  toggleCommandMenu,
  setMobileMenuOpen,
} = navigationSlice.actions;

export default navigationSlice.reducer;
