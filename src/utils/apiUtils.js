// API Response Handler
export const handleApiResponse = (response) => {
  return response?.data ?? null;
};


// API Error Handler
export const handleApiError = (error) => {
  if (error.response) {
    const { status, data } = error.response;
    const message = data.message || data.error || 'An error occurred';
    return {
      status,
      message,
      error: data.error || message,
      errors: data.errors || [],
    };
  } else if (error.request) {
    return {
      status: 0,
      message: 'You are currently offline. Please check your internet connection and try again.',
      error: 'You are currently offline. Please check your internet connection and try again.',
      errors: [],
    };
  } else {
    const message = error.message || 'Request failed';
    return {
      status: 0,
      message,
      error: message,
      errors: [],
    };
  }
};


// Form Data Helper
export const createFormData = (data) => {
  const formData = new FormData();
  Object.keys(data).forEach(key => {
    if (data[key] !== null && data[key] !== undefined) {
      formData.append(key, data[key]);
    }
  });
  return formData;
};

// Query String Helper
export const createQueryString = (params) => {
  const queryParams = new URLSearchParams();
  Object.keys(params).forEach(key => {
    if (params[key] !== null && params[key] !== undefined) {
      queryParams.append(key, params[key]);
    }
  });
  return queryParams.toString();
}; 