import { API_BASE_URL, API_TIMEOUT_MS } from "@/constants";

export class ApiError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    this.name = "ApiError";
  }
}

export function apiUrl(path: string): string {
  return `${API_BASE_URL}/${path.replace(/^\//, "")}`;
}

export async function requestJson(path: string, options: RequestInit = {}): Promise<unknown> {
  const controller = new AbortController();
  const abort = () => controller.abort();
  if (options.signal?.aborted) controller.abort();
  options.signal?.addEventListener("abort", abort, { once: true });
  const timeout = window.setTimeout(abort, API_TIMEOUT_MS);
  try {
    const response = await fetch(apiUrl(path), { ...options, signal: controller.signal });
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      const validationMessage = Array.isArray(data?.errors)
        ? data.errors.map((error: { msg?: string }) => error.msg).filter(Boolean).join(". ")
        : undefined;
      throw new ApiError(data?.error || data?.message || validationMessage || "Request failed. Please try again.", response.status);
    }
    if (data === null) throw new ApiError("The server returned an invalid response.", response.status);
    return data;
  } finally {
    window.clearTimeout(timeout);
    options.signal?.removeEventListener("abort", abort);
  }
}

export function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof DOMException && error.name === "AbortError") return "The request timed out. Please try again.";
  return error instanceof Error ? error.message : fallback;
}
