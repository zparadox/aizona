import { MarketplaceAction, FETCH_AGENTS_REQUEST, FETCH_AGENTS_SUCCESS, FETCH_AGENTS_FAILURE } from '../actions/marketplaceActions';
import { AgentsState as ImportedAgentsState } from '../types';

// Use the local AgentsState interface
interface AgentsState {
  agents: any[]; // Replace 'any' with the correct type for agents
  loading: boolean;
  error: string | null;
}

// Replace the interface with a type
type FetchAgentsFailureAction = MarketplaceAction & {
  error: string;
};

const initialState: AgentsState = {
  agents: [],
  loading: false,
  error: null
};

const agentReducer = (state = initialState, action: MarketplaceAction): AgentsState => {
  switch (action.type) {
    case FETCH_AGENTS_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_AGENTS_SUCCESS:
      return { ...state, loading: false, agents: (action as { payload: any[] }).payload, error: null };
    case FETCH_AGENTS_FAILURE:
      return { ...state, loading: false, error: (action as FetchAgentsFailureAction).error };
    default:
      return state;
  }
};

export default agentReducer;