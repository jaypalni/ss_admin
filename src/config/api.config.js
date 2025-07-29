// API Configuration
const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL,
  ENDPOINTS: {
    USER: {
      ADMIN_GET_USER_SUMMARY: (id) => `/api/users/summary/${id}`,
    },
  },
};

// Validate environment variables
if (!process.env.REACT_APP_API_URL) {
  console.warn("REACT_APP_API_URL is not defined in environment variables");
}

export default API_CONFIG;
