import { createSlice } from '@reduxjs/toolkit';

const governanceSlice = createSlice({
  name: 'governance',
  initialState: {
    proposals: [],
    loading: false,
    error: null
  },
  reducers: {
    // Add your reducers here
  },
});

export default governanceSlice.reducer;