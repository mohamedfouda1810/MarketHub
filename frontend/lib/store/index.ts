import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import cartReducer from './cartSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    // Add RTK Query reducers here
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      // Add RTK Query middleware here
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;