import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import policiesSlice from './slices/policiesSlice';
import claimsSlice from './slices/claimsSlice';
import paymentsSlice from './slices/paymentsSlice';
import usersSlice from './slices/usersSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    policies: policiesSlice,
    claims: claimsSlice,
    payments: paymentsSlice,
    users: usersSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;