import axios, { AxiosError } from "axios";
import { ApiError } from "@/lib/http-errors";

interface ErrorPayload {
  error?: string;
  message?: string;
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

    throw new ApiError(message, status, code);
  }
);
