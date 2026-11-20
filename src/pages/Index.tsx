import { useEffect } from "react";
import DashboardPage from "./DashboardPage";
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";
import { CompactLanding } from "@/components/landing/CompactLanding";

import type { AuthUser as User, UserRole } from "@/types/auth";
import { getCurrentUser } from "@/services/auth";
import { clearSession, getSessionToken } from "@/lib/session";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setUser, logout } from "@/store/slices/authSlice";
import { setCurrentView, setSelectedRoleTab } from "@/store/slices/navigationSlice";

export default function Index() {
  const dispatch = useAppDispatch();
  const { currentView, selectedRoleTab } = useAppSelector((state) => state.navigation);
  const user = useAppSelector((state) => state.auth.user);

  // Cached profile data is never an authority for identity or role.
  useEffect(() => {
    const token = getSessionToken();
    if (!token || token === "demo-token") {
      clearSession();
      dispatch(logout());
      return;
    }
    const controller = new AbortController();
    getCurrentUser(token, controller.signal)
      .then((profile) => {
        if (controller.signal.aborted) return;
        dispatch(setUser(profile));
        dispatch(setCurrentView("dashboard"));
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          clearSession();
          dispatch(logout());
        }
      });
    return () => controller.abort();
  }, [dispatch]);

  const handleLoginSuccess = (userData: User) => {
    dispatch(setUser(userData));
    dispatch(setCurrentView("dashboard"));
  };

  const handleSignupSuccess = (userData: User) => {
    dispatch(setUser(userData));
    dispatch(setCurrentView("dashboard"));
  };

  const handleLogout = () => {
    clearSession();
    dispatch(logout());
    dispatch(setCurrentView("landing"));
  };

  if (currentView === "login") {
    return (
      <LoginPage
        initialRole={selectedRoleTab}
        onLoginSuccess={handleLoginSuccess}
        onSwitchToSignup={() => dispatch(setCurrentView("signup"))}
      />
    );
  }

  if (currentView === "signup") {
    return (
      <SignupPage
        initialRole={selectedRoleTab}
        onSignupSuccess={handleSignupSuccess}
        onSwitchToLogin={() => dispatch(setCurrentView("login"))}
      />
    );
  }

  if (currentView === "dashboard" && user) {
    return <DashboardPage user={user} onLogout={handleLogout} />;
  }

  return (
    <CompactLanding
      onAuthenticate={(view, role) => {
        dispatch(setSelectedRoleTab(role));
        dispatch(setCurrentView(view));
      }}
    />
  );
}
