// frontend/src/store/types.ts

export interface Agent {
  id: string;
  name: string;
  description: string;
  capabilities: string[];
  category: string;
}

export interface AgentFormData {
  name: string;
  description: string;
  capabilities: string[];
  category: string;
}

export interface AgentsState {
  agents: Agent[];
  loading: boolean;
  error: string | null;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: null | { id: string; username: string };
  loading: boolean;
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
}

export interface UserState {
  profile: null | User;
  loading: boolean;
}

export interface MarketplaceState {
  agents: Agent[];
  loading: boolean;
}

export interface Transaction {
  id: string;
  date: string;
  type: 'deposit' | 'withdrawal' | 'purchase';
  amount: number;
  description: string;
}

export interface WalletState {
  balance: number;
  transactions: Transaction[];
  loading: boolean;
}

export interface Proposal {
  id: string;
  title: string;
  description: string;
  votes_for: number;
  votes_against: number;
}

export interface GovernanceState {
  proposals: Proposal[];
  loading: boolean;
}

export interface RootState {
  agents: AgentsState;
  auth: AuthState;
  user: UserState;
  marketplace: MarketplaceState;
  wallet: WalletState;
  governance: GovernanceState;
}