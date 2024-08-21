import { Dispatch } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { RootState, Agent } from '../types';
import api from '../../services/api';

// Action Types
export const FETCH_AGENTS_REQUEST = 'FETCH_AGENTS_REQUEST';
export const FETCH_AGENTS_SUCCESS = 'FETCH_AGENTS_SUCCESS';
export const FETCH_AGENTS_FAILURE = 'FETCH_AGENTS_FAILURE';
export const SET_SEARCH_TERM = 'SET_SEARCH_TERM';
export const SET_CATEGORY_FILTER = 'SET_CATEGORY_FILTER';
export const PURCHASE_AGENT_REQUEST = 'PURCHASE_AGENT_REQUEST';
export const PURCHASE_AGENT_SUCCESS = 'PURCHASE_AGENT_SUCCESS';
export const PURCHASE_AGENT_FAILURE = 'PURCHASE_AGENT_FAILURE';

// Action Creators
export const fetchAgentsRequest = () => ({ type: FETCH_AGENTS_REQUEST });
export const fetchAgentsSuccess = (agents: Agent[]) => ({ 
  type: FETCH_AGENTS_SUCCESS, 
  payload: agents 
});
export const fetchAgentsFailure = (error: string) => ({ 
  type: FETCH_AGENTS_FAILURE, 
  payload: error 
});

export const setSearchTerm = (searchTerm: string) => ({
  type: SET_SEARCH_TERM,
  payload: searchTerm
});

export const setCategoryFilter = (category: string) => ({
  type: SET_CATEGORY_FILTER,
  payload: category
});

export const purchaseAgentRequest = () => ({ type: PURCHASE_AGENT_REQUEST });
export const purchaseAgentSuccess = (agent: Agent) => ({ 
  type: PURCHASE_AGENT_SUCCESS, 
  payload: agent 
});
export const purchaseAgentFailure = (error: string) => ({ 
  type: PURCHASE_AGENT_FAILURE, 
  payload: error 
});

// Update the MarketplaceAction type
export interface FetchAgentsSuccessAction {
  type: typeof FETCH_AGENTS_SUCCESS;
  payload: Agent[];
}

export interface FetchAgentsFailureAction {
  type: typeof FETCH_AGENTS_FAILURE;
  payload: string;
}

export type MarketplaceAction = 
  | { type: typeof FETCH_AGENTS_REQUEST }
  | FetchAgentsSuccessAction
  | FetchAgentsFailureAction
  | ReturnType<typeof setSearchTerm>
  | ReturnType<typeof setCategoryFilter>
  | ReturnType<typeof purchaseAgentRequest>
  | ReturnType<typeof purchaseAgentSuccess>
  | ReturnType<typeof purchaseAgentFailure>;

// Define a type for thunk actions
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  MarketplaceAction
>;

// Update your thunk actions
export const fetchAgents = (): AppThunk => {
  return async (dispatch: ThunkDispatch<RootState, unknown, MarketplaceAction>) => {
    dispatch(fetchAgentsRequest());
    try {
      const response = await api.get('/agents');
      dispatch(fetchAgentsSuccess(response.data));
    } catch (error) {
      dispatch(fetchAgentsFailure(error instanceof Error ? error.message : 'An unknown error occurred'));
    }
  };
};

export const searchAgents = (searchTerm: string): AppThunk => {
  return (dispatch: ThunkDispatch<RootState, unknown, MarketplaceAction>) => {
    dispatch(setSearchTerm(searchTerm));
    dispatch(fetchAgents());
  };
};

export const filterAgentsByCategory = (category: string): AppThunk => {
  return (dispatch: ThunkDispatch<RootState, unknown, MarketplaceAction>) => {
    dispatch(setCategoryFilter(category));
    dispatch(fetchAgents());
  };
};

export const purchaseAgent = (agentId: string): AppThunk => {
  return async (dispatch: ThunkDispatch<RootState, unknown, MarketplaceAction>) => {
    dispatch(purchaseAgentRequest());
    try {
      const response = await api.post(`/agents/${agentId}/purchase`);
      dispatch(purchaseAgentSuccess(response.data));
    } catch (error) {
      dispatch(purchaseAgentFailure(error instanceof Error ? error.message : 'An unknown error occurred'));
    }
  };
};