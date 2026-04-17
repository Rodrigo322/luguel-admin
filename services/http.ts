import axios, { AxiosError } from "axios";
import { ApiError } from "@/lib/http-errors";

interface ErrorPayload {
  error?: string;
  message?: string;
}

const AUTH_REDIRECT_EXCLUDED_PATHS = [
  "/auth/signin",
  "/auth/signup",
  "/auth/password/forgot",
  "/auth/password/reset",
  "/auth/social/google"
];

let authRedirectInProgress = false;

function shouldSkipAuthRedirect(requestUrl?: string): boolean {
  if (!requestUrl) {
    return false;
  }

  return AUTH_REDIRECT_EXCLUDED_PATHS.some((path) => requestUrl.includes(path));
}

function redirectToLogin(status: number): void {
  if (typeof window === "undefined") {
    return;
  }

  if (authRedirectInProgress) {
    return;
  }

  if (window.location.pathname.startsWith("/login")) {
    return;
  }

  authRedirectInProgress = true;

  const redirectTarget = `${window.location.pathname}${window.location.search}`;
  const encodedRedirect = encodeURIComponent(redirectTarget);
  const loginUrl =
    status === 403
      ? `/login?error=admin-only&redirect=${encodedRedirect}`
      : `/login?redirect=${encodedRedirect}`;

  window.location.assign(loginUrl);
}

export const api = axios.create({
  baseURL: "/api/v1",
  withCredentials: true
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ErrorPayload>) => {
    const message = error.response?.data?.message ?? "Falha na requisicao da API.";
    const code = error.response?.data?.error;
    const status = error.response?.status ?? 500;
    const requestUrl = error.config?.url;

    if ((status === 401 || status === 403) && !shouldSkipAuthRedirect(requestUrl)) {
      redirectToLogin(status);
    }

    throw new ApiError(message, status, code);
  }
);
