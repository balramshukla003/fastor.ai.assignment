const trimSlash = (value = "") => value.replace(/\/+$/, "");
export const env = {
  apiBaseUrl: `${trimSlash(import.meta.env.VITE_API_BASE_URL || "https://staging.fastor.ai/v1")}/`,
  signupEndpoint: import.meta.env.VITE_API_SIGNUP_ENDPOINT || "/pwa/user/register",
  loginEndpoint: import.meta.env.VITE_API_LOGIN_ENDPOINT || "/pwa/user/login",
  restaurantsEndpoint: import.meta.env.VITE_API_RESTAURANTS_ENDPOINT || "/pwa/restaurant/list",
  demoMode: import.meta.env.VITE_DEMO_MODE === "true"
};