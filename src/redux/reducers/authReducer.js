// import {
//   AUTH_LOGIN_REQUEST,
//   AUTH_LOGIN_SUCCESS,
//   AUTH_LOGIN_FAILURE,
//   AUTH_LOGOUT,
// } from '../actions/authActions';

// const initialState = {
//   user: null,
//   token: localStorage.getItem('token'),
//   loading: false,
//   error: null,
//   isAuthenticated: !!localStorage.getItem('token'),
// };

// const authReducer = (state = initialState, action) => {
//   switch (action.type) {
//     case AUTH_LOGIN_REQUEST:
//       return {
//         ...state,
//         loading: true,
//         error: null,
//       };
//     case AUTH_LOGIN_SUCCESS:
//       return {
//         ...state,
//         loading: false,
//         user: action.payload.user,
//         token: action.payload.token,
//         isAuthenticated: true,
//         error: null,
//       };
//     case AUTH_LOGIN_FAILURE:
//       return {
//         ...state,
//         loading: false,
//         error: action.payload,
//         isAuthenticated: false,
//       };
//     case AUTH_LOGOUT:
//       return {
//         ...state,
//         user: null,
//         token: null,
//         isAuthenticated: false,
//         error: null,
//       };
//     default:
//       return state;
//   }
// };

// export default authReducer; 

import {
  AUTH_LOGIN_REQUEST,
  AUTH_LOGIN_SUCCESS,
  AUTH_LOGIN_FAILURE,
  AUTH_LOGOUT,
} from '../actions/authActions';

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  email:null,
  loading: false,
  error: null,
  isAuthenticated: !!localStorage.getItem('token'),
};

const authReducer = (state = initialState, action) => {
  console.log('set111',action.payload)
  switch (action.type) {
    case AUTH_LOGIN_REQUEST:
      return { ...state, loading: true, error: null };
    case AUTH_LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.payload.user,
        token: action.payload.token,
        email:action.payload.email,
        isAuthenticated: true,
        error: null,
      };
    case AUTH_LOGIN_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        isAuthenticated: false,
      };
    case AUTH_LOGOUT:
      return { ...state, user: null, token: null,email:null, isAuthenticated: false, error: null };
    default:
      return state;
  }
};

export default authReducer;
