import { combineReducers } from '@reduxjs/toolkit';
import agentReducer from './agentReducer';
import authReducer from './authReducer';
import userReducer from './userReducer';
import marketplaceReducer from './marketplaceReducer';
import walletReducer from './walletReducer';
import governanceReducer from './governanceReducer';

export const rootReducer = combineReducers({
  agents: agentReducer,
  auth: authReducer,
  user: userReducer,
  marketplace: marketplaceReducer,
  wallet: walletReducer,
  governance: governanceReducer,
});

export type RootState = ReturnType<typeof rootReducer>;