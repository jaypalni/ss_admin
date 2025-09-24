// import { createStore, applyMiddleware } from "redux";
// import { thunk } from "redux-thunk";
// import rootReducer from "./reducers";

// // Load persisted data from localStorage if available
// const persistedUserData = localStorage.getItem("userData")
//   ? JSON.parse(localStorage.getItem("userData"))
//   : { isLogin: false };

// // Initial state
// const initialState = {
//   userData:
//     persistedUserData && typeof persistedUserData === "object"
//       ? { isLogin: false, ...persistedUserData }
//       : { isLogin: false },
// };

// // Reducer function
// const reducer = (state = initialState, action) => {
//   switch (action.type) {
//     case "SET_USER_DATA":
//       return {
//         ...state,
//         userData: { ...state.userData, ...action.payload },
//       };
//     case "CLEAR_USER_DATA":
//       return {
//         ...state,
//         userData: { isLogin: false },
//       };
//     default:
//       return state;
//   }
// };

// // Create store
// const store = createStore(reducer, applyMiddleware(thunk));

// // Subscribe to store changes to persist to localStorage
// store.subscribe(() => {
//   const state = store.getState();
//   localStorage.setItem("userData", JSON.stringify(state.userData));
// });

// export default store;

import { createStore, combineReducers, applyMiddleware } from "redux";
import { thunk } from "redux-thunk"; // named import
import authReducer from "./reducers/authReducer";

// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
});

// Load persisted token
const persistedToken = localStorage.getItem("token");

// Initial state
const initialState = {
  auth: {
    user: null,
    token: persistedToken || null,
    email: null,
    loading: false,
    error: null,
    isAuthenticated: !!persistedToken,
  },
};

// Create store
const store = createStore(rootReducer, initialState, applyMiddleware(thunk));

// Persist token to localStorage
store.subscribe(() => {
  const state = store.getState();
  if (state.auth.token) {
    // localStorage.setItem("token", state.auth.token);
  } else {
    localStorage.removeItem("token");
  }
});

export default store;
