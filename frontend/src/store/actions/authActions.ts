import { Dispatch } from 'redux';
import { Agent } from '../types';
import api from '../../services/api';

export const fetchAgents = () => async (dispatch: Dispatch) => {
  dispatch({ type: 'FETCH_AGENTS_REQUEST' });
  try {
    const response = await api.get('/agents');
    dispatch({ type: 'FETCH_AGENTS_SUCCESS', payload: response.data });
  } catch (error) {
    dispatch({
      type: 'FETCH_AGENTS_FAILURE',
      payload: error instanceof Error ? error.message : 'An unknown error occurred'
    });
  }
};

export const createAgent = (agentData: Partial<Agent>) => async (dispatch: Dispatch) => {
  dispatch({ type: 'CREATE_AGENT_REQUEST' });
  try {
    const response = await api.post('/agents', agentData);
    dispatch({ type: 'CREATE_AGENT_SUCCESS', payload: response.data });
  } catch (error) {
    dispatch({
      type: 'CREATE_AGENT_FAILURE',
      payload: error instanceof Error ? error.message : 'An unknown error occurred'
    });
  }
};