import { SESSION_KEYS } from "@/constants";
import type { AuthResponse } from "@/types/auth";

// Temporary compatibility with the existing bearer-token API.
// Migrate storage together with the selected auth provider, not independently.
export const getSessionToken = () => localStorage.getItem(SESSION_KEYS.token);
export function saveSession({ token, user }: AuthResponse) {
  localStorage.setItem(SESSION_KEYS.token, token);
  localStorage.setItem(SESSION_KEYS.user, JSON.stringify(user));
}
export function clearSession() {
  localStorage.removeItem(SESSION_KEYS.token);
  localStorage.removeItem(SESSION_KEYS.user);
}
