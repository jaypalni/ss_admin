import axios from "axios";
import API_CONFIG from "../config/api.config";
import store from '../redux/store';
import { Navigate } from "react-router-dom";
import { message } from "antd";

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

const api1 = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 seconds timeout
});

let reduxStore = null;

/**
 * Call this from your entrypoint after creating the Redux store:
 *   import { attachStore } from './services/api';
 *   attachStore(store);
 */
export const attachStore = (store) => {
  reduxStore = store;
};

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
     if (config?.skipAuth) return config;
    const token = reduxStore?.getState?.().auth?.token ?? null;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(
      error instanceof Error ? error : new Error(error?.message || "Request failed")
    );
  }
);

api1.interceptors.request.use(
  (config) => {
    const token = reduxStore?.getState?.().auth?.reset_token ?? null;
    console.log("234567890987654",token)
    if (token) config.headers.Authorization = `Bearer ${token}`;
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
          message.warning("Session expired. Redirecting to login...");
          setTimeout(() => {
            window.location.href = "/";
          }, 1000);
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
    carDetails: (activeTab,page,limit) => api.get(API_CONFIG.ENDPOINTS.USER.CAR_DETAILS_ALL(activeTab,page,limit)),
    carBestPick: (id,pick) => api.put(API_CONFIG.ENDPOINTS.USER.CAR_BEST_PICK(id,pick)),
    carApprove: (id) => api.put(API_CONFIG.ENDPOINTS.USER.CAR_APPROVE(id)),
    carRejected: (id,body) => api.put(API_CONFIG.ENDPOINTS.USER.CAR_REJECTED(id),body),

    // New API's
    regionslist: () =>
      api.get(API_CONFIG.ENDPOINTS.USER.REGIONS_LIST),
    reasonRejection: () =>
    api.get(API_CONFIG.ENDPOINTS.USER.REASON_REJECTIONS),
    dashboardstats: () => 
      api.get(API_CONFIG.ENDPOINTS.USER.DASHBOARD_STATS),
    pendingcars: (body, page = 1, limit = 10) => 
  api.post(API_CONFIG.ENDPOINTS.USER.PENDING_CARS(page, limit), body),
    getCarById: (id) => api.get(API_CONFIG.ENDPOINTS.USER.GET_BY_ID(id),{ skipAuth: true }),
    approvecar: (body) => 
  api.post(API_CONFIG.ENDPOINTS.USER.APPORVE_CAR, body),
    rejectcar: (body) => 
  api.post(API_CONFIG.ENDPOINTS.USER.REJECT_CAR, body),
   markasbestcar: (body) => 
  api.post(API_CONFIG.ENDPOINTS.USER.MARKAS_BESTCAR, body),

};

export const loginApi = {
  login: (body) =>
    api.post(API_CONFIG.ENDPOINTS.LOGIN.ADMIN_LOGIN, body),
  logout: () => api.post(API_CONFIG.ENDPOINTS.LOGIN.ADMIN_LOGOUT),
  createsubadmin: (body) =>
    api.post(API_CONFIG.ENDPOINTS.LOGIN.CREATE_SUBADMIN, body),
  createnewpassword: (body) =>
    api.post(API_CONFIG.ENDPOINTS.LOGIN.CREATENEWPASSWORD, body),
  admincreate: (body) =>
    api.post(API_CONFIG.ENDPOINTS.LOGIN.ADMINCREATE, body),
   getadmindata: (page = 1, limit = 10) =>
    api.get(API_CONFIG.ENDPOINTS.LOGIN.GETADMINDATA(page, limit)),
   admindata: (id,body) =>
    api.post(API_CONFIG.ENDPOINTS.LOGIN.UPDATEADMINDATA(id),body),
   editadmindata: (id) =>
    api.get(API_CONFIG.ENDPOINTS.LOGIN.EDITADMINDATA(id)),
    deletedata: (id) =>
    api.delete(API_CONFIG.ENDPOINTS.LOGIN.DELETEDATA(id)),
    forgotpassword: (body) =>
    api.post(API_CONFIG.ENDPOINTS.LOGIN.FORGOTPASSWORD,body),
    verifyotp: (body) =>
    api.post(API_CONFIG.ENDPOINTS.LOGIN.VERIFYOTP,body),
    resendotp: (body) =>
    api.post(API_CONFIG.ENDPOINTS.LOGIN.RESENDOTP,body),
    resetpassword: (body) =>
    api1.post(API_CONFIG.ENDPOINTS.LOGIN.RESETPASSWORD,body),
    updatepassword: (body) =>
    api.post(API_CONFIG.ENDPOINTS.LOGIN.UPDATEPASSWORD,body),
    bestcarpick:  (body) =>
    api.post(API_CONFIG.ENDPOINTS.LOGIN.BESTCARSPICK,body),
    makedata: () =>
    api.get(API_CONFIG.ENDPOINTS.LOGIN.MAKEDATA),
    getsubscriptionpackage: () =>
    api.get(API_CONFIG.ENDPOINTS.LOGIN.SUBSCRIPTIONPACKAGE),
    editsubscriptionpackage: (body) =>
    api.post(API_CONFIG.ENDPOINTS.LOGIN.EDITSUBSCRIPTIONPACKAGE,body),
    createsubscriptionpackage: (body) =>
    api.post(API_CONFIG.ENDPOINTS.LOGIN.CREATESUBSCRIPTIONPACKAGE,body),
    deletesubscriptionpackage: (id) =>
    api.delete(API_CONFIG.ENDPOINTS.LOGIN.DELETSUBSCRIPTIONPACKAGE(id)),
    editsubscriptionpackagedata: (id) =>
    api.get(API_CONFIG.ENDPOINTS.LOGIN.EDITDATASUBSCRIPTIONPACKAGE(id)),

    getallusers: (body) =>
    api.post(API_CONFIG.ENDPOINTS.LOGIN.GETALLUSERS,body),
    getallusersid: (id,body) =>
    api.post(API_CONFIG.ENDPOINTS.LOGIN.GETALLUSERSID(id),body),
    verificationstatus: (body) =>
    api.post(API_CONFIG.ENDPOINTS.LOGIN.VERFICATIONSTATUS,body),
    reporteduser: (body) =>
    api.post(API_CONFIG.ENDPOINTS.LOGIN.REPORTEDFLAG,body),
    banneduser: (body) =>
    api.post(API_CONFIG.ENDPOINTS.LOGIN.BANNEDUSER,body),
    savefaq: (body) =>
    api.post(API_CONFIG.ENDPOINTS.LOGIN.SAVEFAQ,body),
    getfaq:() =>
    api.get(API_CONFIG.ENDPOINTS.LOGIN.GETFAQ),
    editfaq: (id,body) =>
    api.post(API_CONFIG.ENDPOINTS.LOGIN.EDITFAQ(id),body),
    deletefaq: (id) =>
    api.delete(API_CONFIG.ENDPOINTS.LOGIN.DELETEFAQ(id)),
};
export const bestcarAPI = {};

export default api;
