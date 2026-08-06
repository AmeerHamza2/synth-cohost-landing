export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api.synthcohost.com";

export const DASHBOARD_URL =
  process.env.NEXT_PUBLIC_DASHBOARD_URL || "https://app.synthcohost.com";

export type AuthResponse = {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    tenant_id: string;
    email: string;
    is_active: boolean;
    mfa_enabled: boolean;
    created_at: string;
  };
};

export type LoginResult =
  | { mfa_required: true; mfa_token: string }
  | AuthResponse;

async function request<T>(
  path: string,
  body: Record<string, unknown>
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const text = await res.text();

  if (!res.ok) {
    const message = text || `Request failed with status ${res.status}`;
    throw new Error(message);
  }

  return JSON.parse(text) as T;
}

export async function apiRegister(
  email: string,
  password: string,
  terms_accepted: boolean
): Promise<AuthResponse> {
  return request<AuthResponse>("/auth/register", {
    email,
    password,
    terms_accepted,
  });
}

export async function apiLogin(
  email: string,
  password: string
): Promise<LoginResult> {
  return request<LoginResult>("/auth/login", { email, password });
}

export async function persistSession(
  access_token: string,
  refresh_token: string
): Promise<void> {
  const res = await fetch("/api/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ access_token, refresh_token }),
  });
  if (!res.ok) {
    throw new Error("Failed to save session");
  }
}

export async function clearSession(): Promise<void> {
  await fetch("/api/auth/session", { method: "DELETE" });
}

export function redirectToDashboard(): void {
  window.location.href = DASHBOARD_URL;
}
