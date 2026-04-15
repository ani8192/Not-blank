import axios from "axios";
import store from "../app/store";
import { logout, setAccessToken } from "../features/auth/authSlice";

axios.defaults.withCredentials = true;

const api = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  withCredentials: true,
});

// REQUEST INTERCEPTOR
api.interceptors.request.use((config) => {
  const token = store.getState().auth.accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// RESPONSE INTERCEPTOR (AUTO REFRESH)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(
          "http://localhost:5000/api/v1/auth/refresh-token",
          {},
          { withCredentials: true }
        );

        const newAccessToken = res.data.accessToken;

        store.dispatch(setAccessToken(newAccessToken));

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        store.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
