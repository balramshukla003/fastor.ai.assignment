import { env } from "../../config/env";

const normalize = (path) => path.startsWith("/") ? path.slice(1) : path;
export const API_ENDPOINTS = {
  auth: {
    signup: normalize(env.signupEndpoint),
    login: normalize(env.loginEndpoint)
  },
  restaurants: {
    list: normalize(env.restaurantsEndpoint)
  }
};