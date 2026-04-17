import { api } from "@/services/http";
import type { AppSession } from "@/lib/server-session";

export interface SignInPayload {
  email: string;
  password: string;
}

export async function signIn(payload: SignInPayload): Promise<AppSession> {
  const response = await api.post<AppSession>("/auth/signin", payload);
  return response.data;
}

export async function signOut(): Promise<void> {
  await api.post("/auth/signout");
}

export async function getSession(): Promise<AppSession | null> {
  try {
    const response = await api.get<AppSession>("/auth/session");
    return response.data;
  } catch {
    return null;
  }
}

export async function refreshSession(): Promise<AppSession | null> {
  try {
    const response = await api.post<AppSession>("/auth/session/refresh");
    return response.data;
  } catch {
    return null;
  }
}

export async function getGoogleAuthUrl(): Promise<string> {
  const response = await api.get<{ url: string }>("/auth/social/google");
  return response.data.url;
}
