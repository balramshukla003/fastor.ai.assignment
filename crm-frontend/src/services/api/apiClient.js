import axios from "axios";
import { env } from "../../config/env";
import { normalizeApiError } from "./apiErrors";

export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 15000,
  headers: { Accept: "application/json" }
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("fastor_access_token");
  const isFormData = typeof FormData !== "undefined" && config.data instanceof FormData;
  if (!isFormData && config.data && !(config.data instanceof URLSearchParams)) {
    config.headers["Content-Type"] = "application/json";
  }
  if (config.data instanceof URLSearchParams) {
    config.headers["Content-Type"] = "application/x-www-form-urlencoded";
  }
  if (token && config.headers["X-Skip-Auth"] !== "true") {
    config.headers.Authorization = `Bearer ${token}`;
  }
  delete config.headers["X-Skip-Auth"];
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(normalizeApiError(error))
);

export function unwrapResponse(response) {
  const body = response?.data;
  if (body && typeof body === "object" && body.status && body.status !== "Success") {
    const error = new Error(body.message || "The API returned an unsuccessful response.");
    error.status = body.status_code || response.status;
    error.body = body;
    throw error;
  }
  return body?.data ?? body;
}