import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Claim {
  id: string;
  policyId: string;
  policyNumber: string;
  customerId: string;
  customerName: string;
  type: 'auto' | 'home' | 'life' | 'health';
  status: 'pending' | 'approved' | 'denied' | 'processing';
  amount: number;
  description: string;
  dateSubmitted: string;
  dateProcessed?: string;
  agentId: string;
  agentName: string;
  documents: string[];
}

interface ClaimsState {
  claims: Claim[];
  searchTerm: string;
  filterStatus: string;
}

const initialState: ClaimsState = {
  claims: [],
  searchTerm: '',
  filterStatus: '',
};

const claimsSlice = createSlice({
  name: 'claims',
  initialState,
  reducers: {
    setClaims: (state, action: PayloadAction<Claim[]>) => {
      state.claims = action.payload;
    },
    addClaim: (state, action: PayloadAction<Claim>) => {
      state.claims.push(action.payload);
    },
    updateClaim: (state, action: PayloadAction<Claim>) => {
      const index = state.claims.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.claims[index] = action.payload;
      }
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setFilterStatus: (state, action: PayloadAction<string>) => {
      state.filterStatus = action.payload;
    },
  },
});

export const { setClaims, addClaim, updateClaim, setSearchTerm, setFilterStatus } = claimsSlice.actions;
export default claimsSlice.reducer;