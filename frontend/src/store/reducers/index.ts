import { combineReducers } from '@reduxjs/toolkit';
import userReducer from './userReducer';
// Import other reducers as needed

const rootReducer = combineReducers({
  user: userReducer,
  // Add other reducers here
});

export default rootReducer;