import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../services/api';

interface Transaction {
  id: string;
  amount: number;
  type: 'deposit' | 'withdrawal';
  timestamp: string;
  date: string;
}

interface WalletState {
  balance: number;
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
}

export const fetchWalletData = createAsyncThunk<
  { balance: number; transactions: Transaction[] },
  void,
  { rejectValue: string }
>('wallet/fetchWalletData', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/wallet');
    return response.data;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'An unknown error occurred');
  }
});

export const depositFunds = createAsyncThunk<
  { balance: number; transaction: Transaction },
  number,
  { rejectValue: string }
>('wallet/depositFunds', async (amount, { rejectWithValue }) => {
  try {
    const response = await api.post('/wallet/deposit', { amount });
    return response.data;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'An unknown error occurred');
  }
});

export const withdrawFunds = createAsyncThunk<
  { balance: number; transaction: Transaction },
  number,
  { rejectValue: string }
>('wallet/withdrawFunds', async (amount, { rejectWithValue }) => {
  try {
    const response = await api.post('/wallet/withdraw', { amount });
    return response.data;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'An unknown error occurred');
  }
});

const initialState: WalletState = {
  balance: 0,
  transactions: [],
  loading: false,
  error: null
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWalletData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWalletData.fulfilled, (state, action) => {
        state.loading = false;
        state.balance = action.payload.balance;
        state.transactions = action.payload.transactions;
        state.error = null;
      })
      .addCase(fetchWalletData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to fetch wallet data';
      })
      .addCase(depositFunds.fulfilled, (state, action) => {
        state.balance = action.payload.balance;
        state.transactions.unshift(action.payload.transaction);
      })
      .addCase(withdrawFunds.fulfilled, (state, action) => {
        state.balance = action.payload.balance;
        state.transactions.unshift(action.payload.transaction);
      });
  },
});

export default walletSlice.reducer;