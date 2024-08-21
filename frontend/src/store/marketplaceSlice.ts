import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Create the async thunk
export const fetchAgents = createAsyncThunk(
  'marketplace/fetchAgents',
  async () => {
    const response = await fetch('/api/agents');
    return response.json();
  }
);

const marketplaceSlice = createSlice({
  name: 'marketplace',
  initialState: {
    agents: [],
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAgents.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAgents.fulfilled, (state, action) => {
        state.agents = action.payload;
        state.loading = false;
      })
      .addCase(fetchAgents.rejected, (state, action) => {
        state.error = action.error.message || null;
        state.loading = false;
      });
  },
});

export default marketplaceSlice.reducer;