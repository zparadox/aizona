import { AnyAction } from 'redux';
import {
  FETCH_PROPOSALS_REQUEST,
  FETCH_PROPOSALS_SUCCESS,
  FETCH_PROPOSALS_FAILURE,
  VOTE_ON_PROPOSAL_REQUEST,
  VOTE_ON_PROPOSAL_SUCCESS,
  VOTE_ON_PROPOSAL_FAILURE,
} from '../actions/governanceActions';
import { Proposal } from '../types';

export interface GovernanceState {
  proposals: Proposal[];
  loading: boolean;
  error: string | null;
}

const initialState: GovernanceState = {
  proposals: [],
  loading: false,
  error: null,
};

const governanceReducer = (state = initialState, action: AnyAction): GovernanceState => {
  switch (action.type) {
    case FETCH_PROPOSALS_REQUEST:
    case VOTE_ON_PROPOSAL_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_PROPOSALS_SUCCESS:
      return { ...state, loading: false, proposals: action.payload, error: null };
    case VOTE_ON_PROPOSAL_SUCCESS:
      return {
        ...state,
        loading: false,
        proposals: state.proposals.map((proposal) =>
          proposal.id === action.payload.id ? action.payload : proposal
        ),
        error: null,
      };
    case FETCH_PROPOSALS_FAILURE:
    case VOTE_ON_PROPOSAL_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default governanceReducer;