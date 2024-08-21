import { AnyAction } from 'redux';
import {
  FETCH_AGENTS_REQUEST,
  FETCH_AGENTS_SUCCESS,
  FETCH_AGENTS_FAILURE,
  SET_SEARCH_TERM,
  SET_CATEGORY_FILTER,
  PURCHASE_AGENT_REQUEST,
  PURCHASE_AGENT_SUCCESS,
  PURCHASE_AGENT_FAILURE
} from '../actions/marketplaceActions';
import { Agent } from '../types';

export interface MarketplaceState {
  agents: Agent[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  categoryFilter: string;
  purchasingAgent: boolean;
  purchaseError: string | null;
}

const initialState: MarketplaceState = {
  agents: [],
  loading: false,
  error: null,
  searchTerm: '',
  categoryFilter: 'all',
  purchasingAgent: false,
  purchaseError: null
};

const marketplaceReducer = (state = initialState, action: AnyAction): MarketplaceState => {
  switch (action.type) {
    case FETCH_AGENTS_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_AGENTS_SUCCESS:
      return { ...state, loading: false, agents: action.payload, error: null };
    case FETCH_AGENTS_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case SET_SEARCH_TERM:
      return { ...state, searchTerm: action.payload };
    case SET_CATEGORY_FILTER:
      return { ...state, categoryFilter: action.payload };
    case PURCHASE_AGENT_REQUEST:
      return { ...state, purchasingAgent: true, purchaseError: null };
    case PURCHASE_AGENT_SUCCESS:
      return {
        ...state,
        purchasingAgent: false,
        agents: state.agents.map(agent =>
          agent.id === action.payload.id ? { ...agent, purchased: true } : agent
        )
      };
    case PURCHASE_AGENT_FAILURE:
      return { ...state, purchasingAgent: false, purchaseError: action.payload };
    default:
      return state;
  }
};

export default marketplaceReducer;