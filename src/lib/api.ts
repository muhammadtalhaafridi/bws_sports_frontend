import axios, { AxiosError } from "axios";

export const API_URL = (
  import.meta.env.VITE_API_URL ?? "http://localhost:5050"
).replace(/\/$/, "");
export const DASHBOARD_URL =
  import.meta.env.VITE_DASHBOARD_URL ?? "http://localhost:5174";

export const TOKEN_KEY = "bws_token";

export const api = axios.create({ baseURL: `${API_URL}/api` });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // An expired or invalid token logs the customer out everywhere.
    if (error.response?.status === 401 && localStorage.getItem(TOKEN_KEY)) {
      localStorage.removeItem(TOKEN_KEY);
      window.dispatchEvent(new Event("auth:logout"));
    }
    return Promise.reject(error);
  },
);

export function getErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again.",
): string {
  if (error instanceof AxiosError) {
    if (!error.response)
      return "Cannot reach the server. Please check your connection.";
    const data = error.response.data as { message?: string } | undefined;
    return data?.message ?? fallback;
  }
  return error instanceof Error ? error.message : fallback;
}
