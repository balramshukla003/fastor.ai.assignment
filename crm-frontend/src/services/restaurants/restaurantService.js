import { apiClient, unwrapResponse } from "../api/apiClient";
import { API_ENDPOINTS } from "../api/apiEndpoints";
import { env } from "../../config/env";
import { mockRestaurants } from "../../mocks/mockRestaurants";

export const restaurantService = {
  async getRestaurants({ page = 1 } = {}) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.restaurants.list, { params: { page } });
      const data = unwrapResponse(response);
      const results = data?.results || data?.data?.results;
      if (!Array.isArray(results)) throw new Error("Restaurant API response did not contain a results array.");
      return { items: results.map(normalizeRestaurant), meta: data.meta || {}, source: "api" };
    } catch (error) {
      if (error.status === 404 || env.demoMode) {
        return { items: mockRestaurants, meta: { total_pages: 1, total_count: mockRestaurants.length }, source: "mock" };
      }
      throw error;
    }
  }
};

function normalizeRestaurant(item, index) {
  const address = item.address_complete && item.address_complete !== "null" ? item.address_complete : "Address unavailable";
  return {
    id: String(item.restaurant_id ?? item.id ?? `restaurant-${index}`),
    name: item.restaurant_name || item.name || "Restaurant",
    address,
    image: item.logo || "/assets/restaurant-fallback.svg"
  };
}