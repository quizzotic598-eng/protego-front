import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Payment {
  id: string;
  customerId: string;
  customerName: string;
  policyId: string;
  policyNumber: string;
  amount: number;
  type: 'premium' | 'claim';
  status: 'completed' | 'pending' | 'failed';
  method: 'credit_card' | 'bank_transfer' | 'check';
  date: string;
  dueDate?: string;
}

interface PaymentsState {
  payments: Payment[];
  searchTerm: string;
}

const initialState: PaymentsState = {
  payments: [],
  searchTerm: '',
};

const paymentsSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    setPayments: (state, action: PayloadAction<Payment[]>) => {
      state.payments = action.payload;
    },
    addPayment: (state, action: PayloadAction<Payment>) => {
      state.payments.push(action.payload);
    },
    updatePayment: (state, action: PayloadAction<Payment>) => {
      const index = state.payments.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.payments[index] = action.payload;
      }
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
  },
});

export const { setPayments, addPayment, updatePayment, setSearchTerm } = paymentsSlice.actions;
export default paymentsSlice.reducer;