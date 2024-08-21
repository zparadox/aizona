import { AppThunk } from '../store';
import api from '../../services/api';
import { Proposal } from '../types';

// Action Types
export const FETCH_PROPOSALS_REQUEST = 'FETCH_PROPOSALS_REQUEST';
export const FETCH_PROPOSALS_SUCCESS = 'FETCH_PROPOSALS_SUCCESS';
export const FETCH_PROPOSALS_FAILURE = 'FETCH_PROPOSALS_FAILURE';
export const VOTE_ON_PROPOSAL_REQUEST = 'VOTE_ON_PROPOSAL_REQUEST';
export const VOTE_ON_PROPOSAL_SUCCESS = 'VOTE_ON_PROPOSAL_SUCCESS';
export const VOTE_ON_PROPOSAL_FAILURE = 'VOTE_ON_PROPOSAL_FAILURE';

// Action Creators
export const fetchProposalsRequest = () => ({ type: FETCH_PROPOSALS_REQUEST });
export const fetchProposalsSuccess = (proposals: Proposal[]) => ({ 
  type: FETCH_PROPOSALS_SUCCESS,
  payload: proposals 
});
export const fetchProposalsFailure = (error: string) => ({ 
  type: FETCH_PROPOSALS_FAILURE,
  payload: error 
});

export const voteOnProposalRequest = () => ({ type: VOTE_ON_PROPOSAL_REQUEST });
export const voteOnProposalSuccess = (proposal: Proposal) => ({ 
  type: VOTE_ON_PROPOSAL_SUCCESS,
  payload: proposal 
});
export const voteOnProposalFailure = (error: string) => ({ 
  type: VOTE_ON_PROPOSAL_FAILURE,
  payload: error 
});

// Thunk Actions
export const fetchProposals = (): AppThunk => async (dispatch) => {
  dispatch(fetchProposalsRequest());
  try {
    const response = await api.get('/proposals');
    dispatch(fetchProposalsSuccess(response.data));
  } catch (error) {
    dispatch(fetchProposalsFailure(error instanceof Error ? error.message : 'An unknown error occurred'));
  }
};

export const voteOnProposal = (proposalId: string, vote: 'for' | 'against'): AppThunk => 
  async (dispatch) => {
    dispatch(voteOnProposalRequest());
    try {
      const response = await api.post(`/proposals/${proposalId}/vote`, { vote });
      dispatch(voteOnProposalSuccess(response.data));
    } catch (error) {
      dispatch(voteOnProposalFailure(error instanceof Error ? error.message : 'An unknown error occurred'));
    }
  };

// Define the union type for all governance actions
export type GovernanceAction = 
  | ReturnType<typeof fetchProposalsRequest>
  | ReturnType<typeof fetchProposalsSuccess>
  | ReturnType<typeof fetchProposalsFailure>
  | ReturnType<typeof voteOnProposalRequest>
  | ReturnType<typeof voteOnProposalSuccess>
  | ReturnType<typeof voteOnProposalFailure>;