import { AppThunk } from '../index';
import api from '../../services/api';

// Action Types
export const FETCH_WALLET_DATA_REQUEST = 'FETCH_WALLET_DATA_REQUEST';
export const FETCH_WALLET_DATA_SUCCESS = 'FETCH_WALLET_DATA_SUCCESS';
export const FETCH_WALLET_DATA_FAILURE = 'FETCH_WALLET_DATA_FAILURE';
export const DEPOSIT_FUNDS_REQUEST = 'DEPOSIT_FUNDS_REQUEST';
export const DEPOSIT_FUNDS_SUCCESS = 'DEPOSIT_FUNDS_SUCCESS';
export const DEPOSIT_FUNDS_FAILURE = 'DEPOSIT_FUNDS_FAILURE';
export const WITHDRAW_FUNDS_REQUEST = 'WITHDRAW_FUNDS_REQUEST';
export const WITHDRAW_FUNDS_SUCCESS = 'WITHDRAW_FUNDS_SUCCESS';
export const WITHDRAW_FUNDS_FAILURE = 'WITHDRAW_FUNDS_FAILURE';

// Action Creators
const fetchWalletDataRequest = () => ({ type: FETCH_WALLET_DATA_REQUEST });
const fetchWalletDataSuccess = (data: any) => ({ type: FETCH_WALLET_DATA_SUCCESS, payload: data });
const fetchWalletDataFailure = (error: string) => ({ type: FETCH_WALLET_DATA_FAILURE, payload: error });

const depositFundsRequest = () => ({ type: DEPOSIT_FUNDS_REQUEST });
const depositFundsSuccess = (data: any) => ({ type: DEPOSIT_FUNDS_SUCCESS, payload: data });
const depositFundsFailure = (error: string) => ({ type: DEPOSIT_FUNDS_FAILURE, payload: error });

const withdrawFundsRequest = () => ({ type: WITHDRAW_FUNDS_REQUEST });
const withdrawFundsSuccess = (data: any) => ({ type: WITHDRAW_FUNDS_SUCCESS, payload: data });
const withdrawFundsFailure = (error: string) => ({ type: WITHDRAW_FUNDS_FAILURE, payload: error });

// Thunk Actions
export const fetchWalletData = (): AppThunk => async (dispatch) => {
  dispatch(fetchWalletDataRequest());
  try {
    const response = await api.get('/wallet');
    dispatch(fetchWalletDataSuccess(response.data));
  } catch (error) {
    dispatch(fetchWalletDataFailure(error instanceof Error ? error.message : 'An unknown error occurred'));
  }
};

export const depositFunds = (amount: number): AppThunk => async (dispatch) => {
  dispatch(depositFundsRequest());
  try {
    const response = await api.post('/wallet/deposit', { amount });
    dispatch(depositFundsSuccess(response.data));
  } catch (error) {
    dispatch(depositFundsFailure(error instanceof Error ? error.message : 'An unknown error occurred'));
  }
};

export const withdrawFunds = (amount: number): AppThunk => async (dispatch) => {
  dispatch(withdrawFundsRequest());
  try {
    const response = await api.post('/wallet/withdraw', { amount });
    dispatch(withdrawFundsSuccess(response.data));
  } catch (error) {
    dispatch(withdrawFundsFailure(error instanceof Error ? error.message : 'An unknown error occurred'));
  }
};