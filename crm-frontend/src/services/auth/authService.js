import { apiClient, unwrapResponse } from "../api/apiClient";
import { API_ENDPOINTS } from "../api/apiEndpoints";

export const authService = {
  async signup({ phone, dialCode = "91" }) {
    const form = new URLSearchParams();
    form.append("phone", phone);
    form.append("dial_code", ` ${dialCode.trim()}`);
    const response = await apiClient.post(API_ENDPOINTS.auth.signup, form, {
      headers: { "X-Skip-Auth": "true" }
    });
    return { envelope: response.data, data: unwrapResponse(response) };
  },

  async login({ phone, otp, dialCode = "91" }) {
    const form = new URLSearchParams();
    form.append("phone", phone);
    form.append("otp", otp);
    form.append("dial_code", ` ${dialCode.trim()}`);
    const response = await apiClient.post(API_ENDPOINTS.auth.login, form, {
      headers: { "X-Skip-Auth": "true" }
    });
    const data = unwrapResponse(response);
    if (!data?.token) throw new Error("Login response did not include an access token.");
    return data;
  }
};