import axios from "axios";
import API_CONFIG from "../config/api.config";

//Validate base URL
if (!API_CONFIG.BASE_URL) {
  throw new Error(
    "API base URL is not configured. Please set REACT_APP_API_URL in your .env file"
  );
}

// Create axios instance with default config
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    "Content-Type": "application/json",
    //"Content-Type": "multipart/form-data",
  },
  timeout: 30000, // 30 seconds timeout
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      switch (error.response.status) {
        case 401:
          // Handle unauthorized access
          localStorage.removeItem("token");
          //alert("401");
          window.location.href = "/login";
          break;
        case 403:
          // Handle forbidden access
          console.error("Access forbidden");
          break;
        case 404:
          // Handle not found
          console.error("Resource not found");
          break;
        case 500:
          // Handle server error
          console.error("Server error");
          break;
        default:
          console.error("API error:", error.response.data);
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received:", error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Request error:", error.message);
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (credentials) =>
    api.post("API_CONFIG.ENDPOINTS.AUTH.LOGIN", credentials),
};

// Customer APIs
export const userAPI = {
  adminGetUserSummary: (id) =>
    api.get(API_CONFIG.ENDPOINTS.USER.ADMIN_GET_USER_SUMMARY(id)),
  adminCustomers: () => api.get(API_CONFIG.ENDPOINTS.USER.ADMIN_CUSTOMERS),
  adminCustomersReported: () =>
    api.get(API_CONFIG.ENDPOINTS.USER.ADMIN_CUSTOMERS_REPORTED),
  adminCustomersBanned: () =>
    api.get(API_CONFIG.ENDPOINTS.USER.ADMIN_CUSTOMERS_BANNED),
  adminCustomersReportedFlag: (id) =>
    api.put(API_CONFIG.ENDPOINTS.USER.ADMIN_CUSTOMERS_REPORTED_FLAG(id)),
  adminCustomersWatchlist: () =>
    api.get(API_CONFIG.ENDPOINTS.USER.ADMIN_CUSTOMERS_WATCHLIST),
  adminWatchListBanFlag: (id,body) =>
    api.put(API_CONFIG.ENDPOINTS.USER.ADMIN_WATCHLIST_BANNED_FLAG(id),body),

  userprofile: () => api.get(API_CONFIG.ENDPOINTS.USER.USER_PROFILE),
};

export const loginApi = {
  login: (credentials) =>
    api.post(API_CONFIG.ENDPOINTS.LOGIN.ADMIN_LOGIN, credentials),
  logout: () => api.post(API_CONFIG.ENDPOINTS.LOGIN.ADMIN_LOGOUT),
  createsubadmin: (body) =>
    api.post(API_CONFIG.ENDPOINTS.LOGIN.CREATE_SUBADMIN, body),
};
export const bestcarAPI = {};

export default api;
