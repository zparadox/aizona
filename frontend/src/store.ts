import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

// Import your reducers
import agentReducer from './store/reducers/agentReducer';
import userReducer from './store/reducers/userReducer';
import authReducer from './store/reducers/authReducer';

// Define the root state type
export interface RootState {
  agents: ReturnType<typeof agentReducer>;
  user: ReturnType<typeof userReducer>;
  auth: ReturnType<typeof authReducer>;
}

// Combine reducers
const rootReducer = combineReducers<RootState>({
  agents: agentReducer,
  user: userReducer,
  auth: authReducer,
});

// Create the store
const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

export type AppDispatch = typeof store.dispatch;

export * from './store/index';
export { default } from './store/index';