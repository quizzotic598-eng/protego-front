import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Policy {
  id: string;
  customerId: string;
  customerName: string;
  type: 'auto' | 'home' | 'life' | 'health';
  number: string;
  status: 'active' | 'pending' | 'expired' | 'cancelled';
  premium: number;
  coverage: number;
  startDate: string;
  endDate: string;
  agentId: string;
  agentName: string;
  documents: string[];
}

interface PoliciesState {
  policies: Policy[];
  searchTerm: string;
  filterType: string;
  filterStatus: string;
}

const initialState: PoliciesState = {
  policies: [],
  searchTerm: '',
  filterType: '',
  filterStatus: '',
};

const policiesSlice = createSlice({
  name: 'policies',
  initialState,
  reducers: {
    setPolicies: (state, action: PayloadAction<Policy[]>) => {
      state.policies = action.payload;
    },
    addPolicy: (state, action: PayloadAction<Policy>) => {
      state.policies.push(action.payload);
    },
    updatePolicy: (state, action: PayloadAction<Policy>) => {
      const index = state.policies.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.policies[index] = action.payload;
      }
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setFilterType: (state, action: PayloadAction<string>) => {
      state.filterType = action.payload;
    },
    setFilterStatus: (state, action: PayloadAction<string>) => {
      state.filterStatus = action.payload;
    },
  },
});

export const { setPolicies, addPolicy, updatePolicy, setSearchTerm, setFilterType, setFilterStatus } = policiesSlice.actions;
export default policiesSlice.reducer;