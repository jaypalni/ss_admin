// API Configuration
const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL,
  ENDPOINTS: {
    USER: {
      ADMIN_GET_USER_SUMMARY: (id) => `/api/users/summary/${id}`,
      ADMIN_CUSTOMERS: "/api/admin/dealers",
      ADMIN_CUSTOMERS_REPORTED: "/api/admin/reported-users",
      ADMIN_CUSTOMERS_BANNED: "/api/admin/banned",
      ADMIN_CUSTOMERS_REPORTED_FLAG: (id) =>
        `/api/admin/reported-users/${id}/flag`,
      ADMIN_CUSTOMERS_WATCHLIST: "/api/admin/watchlist",
      ADMIN_WATCHLIST_BANNED_FLAG: (id) =>
        `/api/admin/users/${id}/ban`,
      ADMIN_VERIFY_USER: (id) =>
        `/api/admin/users/${id}/verification-status`,

      USER_PROFILE: "/api/admin/profile",
      CAR_DETAILS_TYPES: "/api/admin/add-make-model-trim-year",
      UPLOAD_DOCUMENTS: '/api/search/upload-attachment',
      CAR_DETAILS_ALL: (activeTab,page,limit) => `/api/admin/pending-cars?approval=${activeTab}&page=${page}&limit=${limit}`,
      CAR_BEST_PICK: (id,pick) => `/api/admin/cars/${id}/mark-best-pick/${pick}`,
      CAR_APPROVE: (id) => `/api/admin/cars/${id}/approve`,
      CAR_REJECTED: (id) => `/api/admin/cars/${id}/reject`,
      GET_BY_ID: (id) => `/api/cars/details/${id}`,

      // New APi's
      REGIONS_LIST: "/api/cars/regions",
      REASON_REJECTIONS:  "/api/admin/car-rejection-reasons",
      DASHBOARD_STATS: "/api/dashboard/stats",
      PENDING_CARS: (page = 1, limit = 10) => `/api/admin/pending-cars?page=${page}&limit=${limit}`,
      GET_BY_ID: (id) => `/api/cars/details/${id}`,
      APPORVE_CAR: '/api/admin/cars/approve',
      REJECT_CAR: '/api/admin/cars/reject',
      MARKAS_BESTCAR: '/api/admin/cars/mark-best-pick'
    },

    LOGIN: {
      ADMIN_LOGIN: "/api/admin/login",
      ADMIN_LOGOUT: "/api/admin/logout",
      CREATE_SUBADMIN: "/api/admin/admins",
      CREATENEWPASSWORD: "api/admin/update-password-initial",
      ADMINCREATE: "/api/admin/admins",
      GETADMINDATA:(page = 1, limit = 10) => `/api/admin/admins?page=${page}&limit=${limit}`,
      UPDATEADMINDATA:(id) => `/api/admin/admins/${id}`,
      EDITADMINDATA:(id) => `/api/admin/admins/${id}`,
      DELETEDATA:(id) => `/api/admin/admins/${id}`,
      FORGOTPASSWORD: "/api/admin/forgot-password",
      VERIFYOTP: "/api/admin/verify-otp",
      RESENDOTP: "/api/admin/resend-otp",
      RESETPASSWORD:"api/admin/reset-password",
      UPDATEPASSWORD:"/api/admin/update_password",
      MAKEDATA:"/api/cars/makes",
      BESTCARSPICK:  "/api/admin/cars/best-picks",
    },

    BESTCAR: {},
  },
};

// Validate environment variables
if (!process.env.REACT_APP_API_URL) {
  console.warn("REACT_APP_API_URL is not defined in environment variables");
}

export default API_CONFIG;
