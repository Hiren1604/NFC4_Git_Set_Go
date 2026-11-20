/** Application configuration. Feature-specific demo data lives beside its feature. */
export const USER_ROLES = ["resident", "admin", "technician"] as const;
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "/api").replace(/\/$/, "");
export const API_TIMEOUT_MS = 15_000;
export const SESSION_KEYS = { token: "token", user: "user" } as const;
