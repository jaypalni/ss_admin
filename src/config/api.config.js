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
    },

    LOGIN: {
      ADMIN_LOGIN: "/api/admin/login",
      ADMIN_LOGOUT: "/api/admin/logout",
      CREATE_SUBADMIN: "/api/admin/admins",
      // CREATENEWPASSWORD: "api/admin/update-password-initial",
    },

    BESTCAR: {},
  },
};

// Validate environment variables
if (!process.env.REACT_APP_API_URL) {
  console.warn("REACT_APP_API_URL is not defined in environment variables");
}

export default API_CONFIG;
