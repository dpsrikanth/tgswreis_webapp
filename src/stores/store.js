import { configureStore ,combineReducers} from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import AccountDetailsReducer from './userappdetails';


export const AccountDetails = (type ,accountInfo) => ({
    "type": type,
    "payload": accountInfo
})
const persistConfig = {
  key: 'root',
  storage,  
  version: 1,
};
const rootReducer = combineReducers({
  userappdetails: AccountDetailsReducer,
  // add other reducers here if needed
});
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false,
  }),
});

export const persistor = persistStore(store);
export default store;