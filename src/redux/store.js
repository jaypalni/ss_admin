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

// import { createStore, combineReducers, applyMiddleware } from "redux";
// import { thunk } from "redux-thunk"; // named import
// import authReducer from "./reducers/authReducer";

// // Combine reducers
// const rootReducer = combineReducers({
//   auth: authReducer,
// });

// // Load persisted token
// const persistedToken = localStorage.getItem("token");

// // Initial state
// const initialState = {
//   auth: {
//     user: null,
//     token: persistedToken || null,
//     email: null,
//     loading: false,
//     error: null,
//     isAuthenticated: !!persistedToken,
//   },
// };

// // Create store
// const store = createStore(rootReducer, initialState, applyMiddleware(thunk));

// // Persist token to localStorage
// store.subscribe(() => {
//   const state = store.getState();
//   console.log("satet12345",state)
//   console.log("satet12345234",state.auth.token)
//   if (state.auth.token) {
//     // localStorage.setItem("token", state.auth.token);
//   } else {
//     localStorage.removeItem("token");
//   }
// });

// export default store;

import { createStore, applyMiddleware, combineReducers } from "redux";
import { thunk } from "redux-thunk";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./reducers/authReducer";

const rootReducer = combineReducers({ auth: authReducer });

const persistConfig = { key: "root", storage, whitelist: ["auth"] };
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(persistedReducer, applyMiddleware(thunk));
export const persistor = persistStore(store);
export default store;

