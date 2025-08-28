import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  claims: [],
  searchTerm: '',
  filterStatus: '',
};

const claimsSlice = createSlice({
  name: 'claims',
  initialState,
  reducers: {
    setClaims: (state, action) => {
      state.claims = action.payload;
    },
    addClaim: (state, action) => {
      state.claims.push(action.payload);
    },
    updateClaim: (state, action) => {
      const index = state.claims.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.claims[index] = action.payload;
      }
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setFilterStatus: (state, action) => {
      state.filterStatus = action.payload;
    },
  },
});

export const { setClaims, addClaim, updateClaim, setSearchTerm, setFilterStatus } = claimsSlice.actions;
export default claimsSlice.reducer;