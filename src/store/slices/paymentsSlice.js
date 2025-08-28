import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  payments: [],
  searchTerm: '',
};

const paymentsSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    setPayments: (state, action) => {
      state.payments = action.payload;
    },
    addPayment: (state, action) => {
      state.payments.push(action.payload);
    },
    updatePayment: (state, action) => {
      const index = state.payments.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.payments[index] = action.payload;
      }
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
  },
});

export const { setPayments, addPayment, updatePayment, setSearchTerm } = paymentsSlice.actions;
export default paymentsSlice.reducer;