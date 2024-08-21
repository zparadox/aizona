import { AppThunk } from '../store';
import { agentService } from '../../services/agentService';
import { Agent, AgentFormData } from '../types';

// Action Types
export const FETCH_AGENTS_REQUEST = 'FETCH_AGENTS_REQUEST';
export const FETCH_AGENTS_SUCCESS = 'FETCH_AGENTS_SUCCESS';
export const FETCH_AGENTS_FAILURE = 'FETCH_AGENTS_FAILURE';
export const CREATE_AGENT_REQUEST = 'CREATE_AGENT_REQUEST';
export const CREATE_AGENT_SUCCESS = 'CREATE_AGENT_SUCCESS';
export const CREATE_AGENT_FAILURE = 'CREATE_AGENT_FAILURE';

// Action Creators
export const fetchAgentsRequest = () => ({
  type: FETCH_AGENTS_REQUEST
} as const);

export const fetchAgentsSuccess = (agents: Agent[]) => ({
  type: FETCH_AGENTS_SUCCESS,
  payload: agents
} as const);

export const fetchAgentsFailure = (error: string) => ({
  type: FETCH_AGENTS_FAILURE,
  payload: error
} as const);

export const createAgentRequest = () => ({
  type: CREATE_AGENT_REQUEST
} as const);

export const createAgentSuccess = (agent: Agent) => ({
  type: CREATE_AGENT_SUCCESS,
  payload: agent
} as const);

export const createAgentFailure = (error: string) => ({
  type: CREATE_AGENT_FAILURE,
  payload: error
} as const);

// Thunk Actions
export const fetchAgents = (): AppThunk => async (dispatch) => {
  dispatch(fetchAgentsRequest());
  try {
    const agents = await agentService.fetchAgents();
    dispatch(fetchAgentsSuccess(agents));
  } catch (error) {
    dispatch(fetchAgentsFailure(error instanceof Error ? error.message : 'An unknown error occurred'));
  }
};

export const createAgent = (agentData: AgentFormData): AppThunk => async (dispatch) => {
  dispatch(createAgentRequest());
  try {
    const createdAgent = await agentService.createAgent(agentData);
    dispatch(createAgentSuccess(createdAgent));
  } catch (error) {
    dispatch(createAgentFailure(error instanceof Error ? error.message : 'An unknown error occurred'));
  }
};

// Define a union type for all possible actions
export type AgentAction = 
  | ReturnType<typeof fetchAgentsRequest>
  | ReturnType<typeof fetchAgentsSuccess>
  | ReturnType<typeof fetchAgentsFailure>
  | ReturnType<typeof createAgentRequest>
  | ReturnType<typeof createAgentSuccess>
  | ReturnType<typeof createAgentFailure>;