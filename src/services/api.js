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
    return Promise.reject(
      error instanceof Error ? error : new Error(error?.message || "Request failed")
    );
  }
);


// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          localStorage.removeItem("token");
          window.location.href = "/login";
          break;
        case 403:
          console.error("Access forbidden");
          break;
        case 404:
          console.error("Resource not found");
          break;
        case 500:
          console.error("Server error");
          break;
        default:
          console.error("API error:", error.response.data);
      }
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Request error:", error.message);
    }

    // Ensure rejection is always an Error
    return Promise.reject(
      error instanceof Error ? error : new Error(error?.message || "API request failed")
    );
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
  adminVerifyUserData: (id,body) =>
    api.put(API_CONFIG.ENDPOINTS.USER.ADMIN_VERIFY_USER(id),body),

  userprofile: () => api.get(API_CONFIG.ENDPOINTS.USER.USER_PROFILE),
  carTypeDetails: (body) => api.post(API_CONFIG.ENDPOINTS.USER.CAR_DETAILS_TYPES,body),
  uploadimages: (formData) =>
    api.post(API_CONFIG.ENDPOINTS.USER.UPLOAD_DOCUMENTS, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
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
