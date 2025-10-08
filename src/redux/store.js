

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

