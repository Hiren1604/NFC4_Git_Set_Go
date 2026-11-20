import { requestJson } from "@/lib/api";
import { authResponseSchema, userSchema, type AuthResponse, type AuthUser } from "@/types/auth";

export async function authenticate(endpoint: "login" | "register", payload: Record<string, unknown>): Promise<AuthResponse> {
  const data = await requestJson(`/auth/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return authResponseSchema.parse(data) as AuthResponse;
}

export async function getCurrentUser(token: string, signal?: AbortSignal) {
  const data = await requestJson("/auth/me", { signal, headers: { Authorization: `Bearer ${token}` } });
  return userSchema.parse(data) as AuthUser;
}
