import { AnyAction } from 'redux';
import {
  FETCH_WALLET_DATA_REQUEST,
  FETCH_WALLET_DATA_SUCCESS,
  FETCH_WALLET_DATA_FAILURE,
  DEPOSIT_FUNDS_SUCCESS,
  WITHDRAW_FUNDS_SUCCESS,
} from '../actions/walletActions';

export interface WalletState {
  balance: number;
  transactions: any[];
  loading: boolean;
  error: string | null;
}

const initialState: WalletState = {
  balance: 0,
  transactions: [],
  loading: false,
  error: null,
};

const walletReducer = (state = initialState, action: AnyAction): WalletState => {
  switch (action.type) {
    case FETCH_WALLET_DATA_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_WALLET_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        balance: action.payload.balance,
        transactions: action.payload.transactions,
        error: null,
      };
    case FETCH_WALLET_DATA_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case DEPOSIT_FUNDS_SUCCESS:
    case WITHDRAW_FUNDS_SUCCESS:
      return {
        ...state,
        balance: action.payload.balance,
        transactions: [...state.transactions, action.payload.transaction],
      };
    default:
      return state;
  }
};

export default walletReducer;