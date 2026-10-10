export function normalizeApiError(error) {
  const status = error?.response?.status ?? null;
  const body = error?.response?.data;
  let message = body?.message || body?.error || error?.message || "Something went wrong. Please try again.";
  if (status === 401) message = "Your session is not authorized. Please sign in again.";
  if (status === 403) message = "You do not have permission to perform this action.";
  if (status === 404) message = "The requested service was not found.";
  if (status >= 500) message = "The server is temporarily unavailable. Please try again.";
  return { status, message, body, isNetworkError: !error?.response };
}