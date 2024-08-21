import api from './api';
import { Agent, AgentFormData } from '../store/types';

export const agentService = {
  fetchAgents: async (): Promise<Agent[]> => {
    const response = await api.get('/agents');
    return response.data;
  },

  createAgent: async (agentData: AgentFormData): Promise<Agent> => {
    const response = await api.post('/agents', agentData);
    return response.data;
  },

  // Add other agent-related API calls here
};