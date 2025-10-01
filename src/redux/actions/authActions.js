
import { authAPI } from '../../services/api';

// Action Types
export const AUTH_LOGIN_REQUEST = 'AUTH_LOGIN_REQUEST';
export const AUTH_LOGIN_SUCCESS = 'AUTH_LOGIN_SUCCESS';
export const AUTH_LOGIN_FAILURE = 'AUTH_LOGIN_FAILURE';
export const AUTH_LOGOUT = 'AUTH_LOGOUT';
export const SET_EMAIL = 'SET_EMAIL';
export const SET_RESET_TOKEN = 'SET_RESET_TOKEN';

// Action Creators
export const loginRequest = () => ({
  type: AUTH_LOGIN_REQUEST,
});

export const loginSuccess = (user, token, email,role,need_password) => ({
  type: AUTH_LOGIN_SUCCESS,
  payload: { user, token, email,role,need_password },
});

export const setEmailLogin = (email) => ({
  type: SET_EMAIL,
  payload: email
});

export const setResetLogin = (reset_token) => ({
  type: SET_RESET_TOKEN,
  payload: reset_token,
});

export const loginFailure = (error) => ({
  type: AUTH_LOGIN_FAILURE,
  payload: error,
});

export const logout = () => ({
  type: AUTH_LOGOUT,
});

// Thunk Actions
export const login = (credentials) => async (dispatch) => {
  try {
    dispatch(loginRequest());
    const response = await authAPI.login(credentials);
    const { user, token, email, needs_password_update,role,need_password } = response.data;

    // Save token in localStorage
    localStorage.setItem('token', token);

    dispatch(loginSuccess(user, token, email,role,need_password));

    return { success: true, needs_password_update };
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Login failed';
    dispatch(loginFailure(errorMessage));
    return { success: false, error: errorMessage };
  }
};

export const logoutUser = () => async (dispatch) => {
  try {
    await authAPI.logout();
    localStorage.removeItem('token');
    dispatch(logout());
  } catch (error) {
    console.error('Logout error:', error);
  }
};
