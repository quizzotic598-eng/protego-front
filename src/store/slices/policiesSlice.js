import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  policies: [],
  searchTerm: '',
  filterType: '',
  filterStatus: '',
};

const policiesSlice = createSlice({
  name: 'policies',
  initialState,
  reducers: {
    setPolicies: (state, action) => {
      state.policies = action.payload;
    },
    addPolicy: (state, action) => {
      state.policies.push(action.payload);
    },
    updatePolicy: (state, action) => {
      const index = state.policies.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.policies[index] = action.payload;
      }
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setFilterType: (state, action) => {
      state.filterType = action.payload;
    },
    setFilterStatus: (state, action) => {
      state.filterStatus = action.payload;
    },
  },
});

export const { setPolicies, addPolicy, updatePolicy, setSearchTerm, setFilterType, setFilterStatus } = policiesSlice.actions;
export default policiesSlice.reducer;